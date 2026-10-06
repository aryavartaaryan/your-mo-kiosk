// src/main.js
// ─────────────────────────────────────────────────────────────────────────────
// Entry point – wires the voice layer to Mo and the kiosk UI.
//
// State machine:
//   idle ──tap──▶ connecting ──open──▶ listening
//   listening ──(VAD detects end)──▶ thinking ──(first audio)──▶ talking
//   talking ──(turn complete + queue drained)──▶ listening
//   talking ──(user interrupts)──▶ listening
//   any ──tap stop──▶ idle
//   any ──error──▶ idle
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

// ── 1. Bootstrap App and Mo ───────────────────────────────────────────────────
const app = new App(document.body, { Mo });
Mo.init(app.moContainer);
Mo.setExpression(CONFIG.character.defaultExpression);
Mo.setState('idle');
Mo.start();
app.setState('idle');
app.setCaption(CONFIG.character.idleCaption);

// Create the audio output graph (safe to call before a user gesture;
// the AudioContext is resumed inside startVoiceSession on the tap event)
initOutputAudio();

// ── 2. Session state ──────────────────────────────────────────────────────────
/** @type {GeminiVoiceSession|null} */
let _session   = null;
let _isActive  = false;   // true while a session is running
let _isTalking = false;   // true while Mo's audio is playing

// ── 3. Talk button handler ────────────────────────────────────────────────────
app.onTalkPress(async () => {
  if (_isActive) {
    await stopVoiceSession();
  } else {
    await startVoiceSession();
  }
});

// ── 4. Start session ──────────────────────────────────────────────────────────
async function startVoiceSession() {
  if (_isActive) return;

  // Validate API key early so the user gets a clear message
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    app.setCaption(
      'No API key found. Add VITE_GEMINI_API_KEY to your .env file and restart.'
    );
    console.error('[Mo] VITE_GEMINI_API_KEY is not set in .env');
    return;
  }

  // Resume AudioContext on this user gesture (browser autoplay policy)
  await resumeOutputAudio();

  // Optimistic UI — we'll refine once the socket opens
  _isActive  = true;
  _isTalking = false;
  goState('listening');
  app.setCaption('Connecting to Mo\u2026');

  // ── Build session ──────────────────────────────────────────────────────
  _session = new GeminiVoiceSession({

    // Socket opened + model ready → start mic
    onOpen: async () => {
      try {
        await startMic((int16Chunk) => {
          if (_isActive) _session?.sendAudioChunk(int16Chunk);
        });
        app.setCaption('I\u2019m listening\u2026 go ahead!');
        console.log('[Mo] Mic streaming started');
      } catch (micErr) {
        handleError(micErr, 'mic');
      }
    },

    // Audio chunk from Gemini → queue for playback, start lip sync
    onAudioChunk: (int16) => {
      enqueueAudioChunk(int16);
      if (!_isTalking) {
        _isTalking = true;
        goState('talking');
        startLipSync(getAnalyserNode());
      }
    },

    // Mo's transcript streams in while he speaks
    onOutputTranscript: (text) => {
      app.setCaption(text);
    },

    // Customer's transcript arrives after VAD detects end of speech
    onInputTranscript: (text) => {
      app.setUserCaption(text);
      // Switch to thinking while we wait for Mo's first audio chunk
      if (!_isTalking) {
        goState('thinking');
      }
    },

    // All of Mo's audio has been sent — wait for queue to drain, then listen
    onTurnComplete: () => {
      const waitMs = getRemainingPlaybackMs() + 300; // 300 ms safety margin
      setOnPlaybackEnd(null); // clear any previous handler
      setTimeout(() => {
        if (!_isActive) return;
        _isTalking = false;
        stopLipSync();
        goState('listening');
        app.setCaption('What else can I get you?');
      }, waitMs);
    },

    // User interrupted Mo mid-sentence → clear audio immediately and listen
    onInterrupted: () => {
      clearAudioQueue();
      stopLipSync();
      _isTalking = false;
      goState('listening');
      app.clearUserCaption();
    },

    // Latency readout → debug panel
    onLatency: (ms) => {
      app.updateLatency(ms);
    },

    // Session-level error
    onError: (err) => {
      console.error('[Mo] Voice session error:', err);
      let msg = 'Something went wrong. Tap to try again!';
      if (err.message?.includes('API key') || err.message?.includes('GEMINI')) {
        msg = 'API key issue. Check .env and restart the dev server.';
      } else if (err.message?.includes('network') || err.message?.includes('WebSocket')) {
        msg = 'Network error. Check your connection and tap to retry.';
      }
      app.setCaption(msg);
      stopVoiceSession();
    },

    // WebSocket closed unexpectedly
    onClose: (ev) => {
      if (_isActive) {
        const reason = ev?.reason ? ` (${ev.reason})` : '';
        console.warn('[Mo] Connection closed unexpectedly' + reason);
        app.setCaption('Connection dropped. Tap to reconnect!');
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

// ── 5. Stop session ───────────────────────────────────────────────────────────
async function stopVoiceSession() {
  _isActive  = false;
  _isTalking = false;

  stopMic();
  clearAudioQueue();
  stopLipSync();
  setOnPlaybackEnd(null);

  _session?.close();
  _session = null;

  goState('idle');
  app.setCaption(CONFIG.character.idleCaption);
  app.clearUserCaption();
}

// ── 6. Helpers ────────────────────────────────────────────────────────────────

/** Drive both Mo and the App status badge to a new state in one call. */
function goState(state) {
  Mo.setState(state);
  app.setState(state);
}

/** Friendly error handler for mic permission, connection, and config errors. */
function handleError(err, context = '') {
  console.error(`[Mo] Error (${context}):`, err);

  let msg = 'Something went wrong. Tap to try again!';
  const n = err?.name ?? '';
  const m = err?.message ?? '';

  if (n === 'NotAllowedError' || n === 'PermissionDeniedError') {
    msg = 'Microphone access was denied. Allow mic access in your browser and tap again.';
  } else if (n === 'NotFoundError') {
    msg = 'No microphone found. Connect one and try again.';
  } else if (m.includes('API key') || m.includes('GEMINI_API_KEY') || m.includes('VITE_GEMINI')) {
    msg = 'API key is missing or invalid. Check your .env file.';
  } else if (m.includes('network') || m.includes('WebSocket') || m.includes('fetch')) {
    msg = 'Can\u2019t connect to Gemini. Check your internet and tap to retry.';
  }

  app.setCaption(msg);
  stopVoiceSession();
}

// ── 7. Dev-console helpers ────────────────────────────────────────────────────
console.info(
  '%c Your Mo %c v0.2 \u2013 Voice Edition \n' +
  '%c \u2022 Press D to open the debug panel\n' +
  '\u2022 Debug console: _mo.start() / _mo.stop()\n' +
  '\u2022 Mo API: Mo.setState() Mo.setExpression() Mo.setMouthOpen()',
  'background:#FF6B35;color:white;padding:2px 6px;border-radius:4px;font-weight:bold',
  '',
  'color:#8A8A9A'
);

window._mo = {
  start:  startVoiceSession,
  stop:   stopVoiceSession,
  Mo,
};
