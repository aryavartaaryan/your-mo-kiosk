// src/main.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Mo — entry point.
// Wires voice pipeline, state machine, expression triggers, session idle reset.
//
// State machine:
//   idle ──tap──▶ connecting ──open──▶ listening
//   listening ──(VAD end)──▶ thinking ──(first audio)──▶ talking
//   talking ──(turn complete + queue drained)──▶ listening
//   talking ──(user interrupts)──▶ listening  (with surprised expression)
//   any ──tap stop / error──▶ idle
//   listening (90s idle) ──▶ "Still there?" caption
//   listening (120s idle) ──▶ full session reset → idle
// ─────────────────────────────────────────────────────────────────────────────

import { Mo }  from './character/Mo.js';
import { App } from './ui/App.js';
import { CONFIG } from './config.js';
import { GeminiVoiceSession } from './voice/gemini.js';
import { startMic, stopMic }  from './voice/audioInput.js';
import {
  initOutputAudio,
  resumeOutputAudio,
  enqueueAudioChunk,
  clearAudioQueue,
  getAnalyserNode,
  getRemainingPlaybackMs,
  setOnPlaybackEnd,
} from './voice/audioOutput.js';
import { startLipSync, stopLipSync } from './voice/lipSync.js';

// ── 1. Bootstrap ──────────────────────────────────────────────────────────────
const app = new App(document.body, { Mo });
Mo.init(app.moContainer);
Mo.setExpression(CONFIG.character.defaultExpression);
Mo.setState(CONFIG.character.defaultState);
Mo.start();
app.setState('idle');
app.setCaption(CONFIG.character.idleCaption);

// Pre-create AudioContext (resumed on first tap due to autoplay policy)
initOutputAudio();

// ── 2. Session state ──────────────────────────────────────────────────────────
/** @type {GeminiVoiceSession|null} */
let _session   = null;
let _isActive  = false;
let _isTalking = false;

// ── 3. Idle session timeout ───────────────────────────────────────────────────
let _idleTimer    = null;
let _idleWarnTimer = null;

function resetIdleTimer() {
  clearTimeout(_idleTimer);
  clearTimeout(_idleWarnTimer);

  // After 90s of no activity: nudge the customer
  _idleWarnTimer = setTimeout(() => {
    if (_isActive && !_isTalking) {
      app.setCaption('Still there, habibi? 👀');
      Mo.setExpression('smug');
    }
  }, 90_000);

  // After 120s of no activity: reset the session completely
  _idleTimer = setTimeout(() => {
    if (_isActive && !_isTalking) {
      console.log('[Mo] Idle timeout — resetting session');
      stopVoiceSession();
    }
  }, 120_000);
}

function clearIdleTimers() {
  clearTimeout(_idleTimer);
  clearTimeout(_idleWarnTimer);
}

// ── 4. Talk button ────────────────────────────────────────────────────────────
app.onTalkPress(async () => {
  if (_isActive) await stopVoiceSession();
  else           await startVoiceSession();
});

// ── 5. Start session ──────────────────────────────────────────────────────────
async function startVoiceSession() {
  if (_isActive) return;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    app.setCaption('No API key found. Add VITE_GEMINI_API_KEY to your .env file.');
    return;
  }

  // Must resume AudioContext inside a user-gesture handler
  await resumeOutputAudio();

  _isActive  = true;
  _isTalking = false;
  goState('listening');
  app.setCaption('Connecting to Mo\u2026');

  _session = new GeminiVoiceSession({

    // ── WebSocket open + model ready ──────────────────────────────────────
    onOpen: async () => {
      try {
        await startMic((chunk) => {
          if (_isActive) _session?.sendAudioChunk(chunk);
        });
        Mo.setExpression('excited');
        app.setCaption("Yo! What can I get you today? 🔥");
        resetIdleTimer();
        console.log('[Mo] Session live ✓');
      } catch (err) {
        handleError(err, 'mic');
      }
    },

    // ── Audio from Gemini → play + lip sync ───────────────────────────────
    onAudioChunk: (int16) => {
      enqueueAudioChunk(int16);
      if (!_isTalking) {
        _isTalking = true;
        goState('talking');
        // Randomly smug or happy when Mo starts talking (keeps it fresh)
        Mo.setExpression(Math.random() > 0.45 ? 'smug' : 'happy');
        startLipSync(getAnalyserNode());
      }
    },

    // ── Mo's transcript (streams while he speaks) ─────────────────────────
    onOutputTranscript: (text) => {
      app.setCaption(text);
    },

    // ── Customer's transcript → switch to thinking ────────────────────────
    onInputTranscript: (text) => {
      app.setUserCaption(text);
      resetIdleTimer(); // customer is active — reset idle clock
      if (!_isTalking) {
        goState('thinking');
        Mo.setExpression('thinking');
      }
    },

    // ── Mo finished his turn → back to listening ──────────────────────────
    onTurnComplete: () => {
      const waitMs = getRemainingPlaybackMs() + 320;
      setOnPlaybackEnd(null);
      setTimeout(() => {
        if (!_isActive) return;
        _isTalking = false;
        stopLipSync();
        Mo.setExpression('happy');
        goState('listening');
        app.setCaption('What else can I get you?');
        resetIdleTimer();
      }, waitMs);
    },

    // ── Customer interrupted Mo ───────────────────────────────────────────
    onInterrupted: () => {
      clearAudioQueue();
      stopLipSync();
      _isTalking = false;
      Mo.setExpression('surprised');
      // Recover to happy after 500ms — feels natural
      setTimeout(() => { if (_isActive) Mo.setExpression('happy'); }, 500);
      goState('listening');
      app.clearUserCaption();
      resetIdleTimer();
    },

    // ── Latency readout ───────────────────────────────────────────────────
    onLatency: (ms) => {
      app.updateLatency(ms);
    },

    // ── Session error ─────────────────────────────────────────────────────
    onError: (err) => {
      console.error('[Mo] Voice error:', err);
      let msg = 'Something went wrong \u2014 tap to try again!';
      const m = err?.message ?? '';
      if (m.includes('API key') || m.includes('GEMINI'))
        msg = 'API key issue. Check your .env file.';
      else if (m.includes('network') || m.includes('WebSocket'))
        msg = 'Connection dropped. Check internet and tap to retry.';
      app.setCaption(msg);
      stopVoiceSession();
    },

    // ── WebSocket closed ──────────────────────────────────────────────────
    onClose: (ev) => {
      if (_isActive) {
        console.warn('[Mo] Session closed unexpectedly', ev?.code, ev?.reason);
        app.setCaption('Connection dropped \u2014 tap to reconnect!');
        stopVoiceSession();
      }
    },
  });

  try {
    await _session.connect();
  } catch (err) {
    handleError(err, 'connect');
  }
}

// ── 6. Stop session ───────────────────────────────────────────────────────────
async function stopVoiceSession() {
  _isActive  = false;
  _isTalking = false;
  clearIdleTimers();

  stopMic();
  clearAudioQueue();
  stopLipSync();
  setOnPlaybackEnd(null);

  _session?.close();
  _session = null;

  goState('idle');
  Mo.setExpression(CONFIG.character.defaultExpression);
  app.setCaption(CONFIG.character.idleCaption);
  app.clearUserCaption();
}

// ── 7. Helpers ────────────────────────────────────────────────────────────────
function goState(state) {
  Mo.setState(state);
  app.setState(state);
}

function handleError(err, ctx = '') {
  console.error(`[Mo] Error (${ctx}):`, err);
  let msg = 'Something went wrong \u2014 tap to try again!';
  const n = err?.name ?? '', m = err?.message ?? '';
  if (n === 'NotAllowedError' || n === 'PermissionDeniedError')
    msg = 'Mic access denied. Allow microphone in browser settings and tap again.';
  else if (n === 'NotFoundError')
    msg = 'No microphone found. Connect one and try again.';
  else if (m.includes('API key') || m.includes('GEMINI'))
    msg = 'API key is missing or invalid. Check your .env file.';
  else if (m.includes('network') || m.includes('WebSocket'))
    msg = 'Can\u2019t connect. Check your internet and tap to retry.';
  app.setCaption(msg);
  stopVoiceSession();
}

// ── 8. Dev console helpers ────────────────────────────────────────────────────
console.info(
  '%c HALALHOLIC MO %c Hooked on Flavor \n' +
  '%c Press D for debug panel | _mo.start() / _mo.stop() in console',
  'background:#FF6A00;color:white;padding:2px 8px;border-radius:4px;font-weight:900;font-family:Arial Black',
  'background:#0E302E;color:#5EA82A;padding:2px 8px;border-radius:4px;font-style:italic',
  'color:#8FAF8A;font-size:11px'
);

window._mo = { start: startVoiceSession, stop: stopVoiceSession, Mo };
