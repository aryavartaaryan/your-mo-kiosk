// src/main.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Mo 3.0 — Orchestrator (Syracuse Campus Edition)
// Wires real-time voice pipeline, 10 3D facial expressions, 9 animated 3D poses,
// audio-cadence nodding, college action cards, and auto-idle handling.
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
Mo.setPose('front');
Mo.setExpression('happy');
Mo.setState('idle');
Mo.start();
app.setState('idle');
app.setCaption(CONFIG.character.idleCaption);

// Pre-create AudioContext
initOutputAudio();

// ── 2. Session state ──────────────────────────────────────────────────────────
/** @type {GeminiVoiceSession|null} */
let _session   = null;
let _isActive  = false;
let _isTalking = false;

// ── 3. Idle session timeout ───────────────────────────────────────────────────
let _idleTimer     = null;
let _idleWarnTimer = null;

function resetIdleTimer() {
  clearTimeout(_idleTimer);
  clearTimeout(_idleWarnTimer);

  // After 90s: playful poke with crossed arms
  _idleWarnTimer = setTimeout(() => {
    if (_isActive && !_isTalking) {
      app.setCaption('Still there, habibi? 👀');
      Mo.setExpression('confident');
      Mo.setPose('arms_crossed');
    }
  }, 90_000);

  // After 120s: reset session cleanly
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

// ── 4. Talk button & College Action Cards ─────────────────────────────────────
app.onTalkPress(async () => {
  if (_isActive) await stopVoiceSession();
  else           await startVoiceSession();
});

// Interactive College Action Cards for instant one-tap student engagement
app.onChipClick(async (prompt) => {
  if (!_isActive) {
    await startVoiceSession(prompt);
  } else {
    app.setUserCaption(prompt);
    goState('thinking');
    Mo.setPose('thinking');
    Mo.setExpression('thinking');
    _session?.sendTextMessage(prompt);
  }
});

// ── 5. Start session ──────────────────────────────────────────────────────────
async function startVoiceSession(initialPrompt = null) {
  if (_isActive) return;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    app.setCaption('No API key found. Add VITE_GEMINI_API_KEY to your .env file.');
    return;
  }

  await resumeOutputAudio();

  _isActive  = true;
  _isTalking = false;
  goState('listening');
  app.setCaption('Connecting to Mo\u2026');

  _session = new GeminiVoiceSession({

    // ── WebSocket Open: Start mic & Trigger Proactive Voice Greeting ──────
    onOpen: async () => {
      try {
        await startMic((chunk) => {
          if (_isActive) _session?.sendAudioChunk(chunk);
        });

        resetIdleTimer();
        console.log('[Mo] Session live ✓');

        // If triggered via an Action Card, route pose & send prompt
        if (initialPrompt) {
          app.setUserCaption(initialPrompt);
          goState('thinking');
          const lower = initialPrompt.toLowerCase();
          if (lower.includes('exam')) {
            Mo.setPose('thumbs_up');
            Mo.setExpression('happy');
          } else if (lower.includes('squad')) {
            Mo.setPose('dancing');
            Mo.setExpression('excited');
          } else if (lower.includes('late')) {
            Mo.setPose('pointing');
            Mo.setExpression('confident');
          } else {
            Mo.setPose('talking');
            Mo.setExpression('happy');
          }
          _session.sendTextMessage(initialPrompt);
        } else {
          // Proactive vocal welcome — Mo greets first with pointing & wink!
          Mo.setPose('pointing');
          Mo.setExpression('wink');
          setTimeout(() => {
            if (_isActive && !_isTalking) {
              Mo.setPose('front');
              Mo.setExpression('happy');
            }
          }, 1800);

          _session.sendTextMessage(
            "A student just tapped to talk at the Syracuse kiosk. Greet them out loud in your signature Mo style with a short, punchy 1-sentence welcome!"
          );
        }
      } catch (err) {
        handleError(err, 'mic');
      }
    },

    // ── Audio Streaming: Playback + Lip Sync + Speech Cadence Nodding ──────
    onAudioChunk: (int16) => {
      enqueueAudioChunk(int16);
      if (!_isTalking) {
        _isTalking = true;
        goState('talking');
        Mo.setPose('talking');
        startLipSync(getAnalyserNode());
      }
    },

    // ── Mo's Transcript: Live caption, expression & 3D pose routing ───────
    onOutputTranscript: (text) => {
      app.setCaption(text);
      const lower = text.toLowerCase();

      // Dynamic Mascot Reactions & 3D Poses
      if (lower.includes('personality trait') || lower.includes('respect') || lower.includes('iconic')) {
        Mo.setExpression('confident');
        Mo.setPose('arms_crossed');
      } else if (lower.includes('holicbucket') || lower.includes('squad') || lower.includes('group project')) {
        Mo.setExpression('excited');
        Mo.setPose('dancing');
      } else if (lower.includes('gyro') || lower.includes('running late') || lower.includes('class')) {
        Mo.setExpression('confident');
        Mo.setPose('pointing');
      } else if (lower.includes('platter') || lower.includes('extra holic') || lower.includes('earned it')) {
        Mo.setExpression('happy');
        Mo.setPose('thumbs_up');
      } else if (lower.includes('flavor than your dining hall') || lower.includes('lettuce') || lower.includes('pita bread')) {
        Mo.setExpression('laughing');
        Mo.setPose('dancing');
        Mo.triggerLaugh();
      } else if (lower.includes('haha') || lower.includes('sharing is caring')) {
        Mo.triggerLaugh();
      }
    },

    // ── Customer's Transcript: Realtime understanding ─────────────────────
    onInputTranscript: (text) => {
      app.setUserCaption(text);
      resetIdleTimer();

      if (!_isTalking) {
        goState('thinking');
        Mo.setPose('sitting');
        const lower = text.toLowerCase();
        if (lower.includes('exam') || lower.includes('study') || lower.includes('lecture')) {
          Mo.setExpression('confident');
        } else if (lower.includes('squad') || lower.includes('friends') || lower.includes('group')) {
          Mo.setExpression('excited');
        } else if (lower.includes('eat you') || lower.includes('bread') || lower.includes('hair') || lower.includes('lettuce')) {
          Mo.setExpression('angry');
        } else {
          Mo.setExpression('thinking');
        }
      }
    },

    // ── Turn Complete: Smooth return to listening ─────────────────────────
    onTurnComplete: () => {
      const waitMs = getRemainingPlaybackMs() + 260;
      setOnPlaybackEnd(null);
      setTimeout(() => {
        if (!_isActive) return;
        _isTalking = false;
        stopLipSync();
        Mo.setExpression('happy');
        Mo.setPose('front');
        goState('listening');
        app.setCaption('What else can I get you, habibi?');
        resetIdleTimer();
      }, waitMs);
    },

    // ── User Interrupted Mo: Snappy response ──────────────────────────────
    onInterrupted: () => {
      clearAudioQueue();
      stopLipSync();
      _isTalking = false;
      Mo.setExpression('surprised');
      Mo.setPose('standing');
      setTimeout(() => { if (_isActive) { Mo.setExpression('happy'); Mo.setPose('front'); } }, 450);
      goState('listening');
      app.clearUserCaption();
      resetIdleTimer();
    },

    // ── Latency Monitoring ────────────────────────────────────────────────
    onLatency: (ms) => {
      app.updateLatency(ms);
    },

    // ── Session Error ─────────────────────────────────────────────────────
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

    // ── WebSocket Closed ──────────────────────────────────────────────────
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
  Mo.setPose('front');
  Mo.setExpression('happy');
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
  '%c HALALHOLIC MO 3.0 (SYRACUSE CAMPUS) %c Hooked on Flavor \n' +
  '%c Press D for Studio Controls | _mo.start() / _mo.stop() in console',
  'background:#FF6A00;color:white;padding:2px 8px;border-radius:4px;font-weight:900;font-family:Arial Black',
  'background:#0E302E;color:#5EA82A;padding:2px 8px;border-radius:4px;font-style:italic',
  'color:#8FAF8A;font-size:11px'
);

window._mo = { start: startVoiceSession, stop: stopVoiceSession, Mo };
