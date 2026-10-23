// src/voice/lipSync.js
// ─────────────────────────────────────────────────────────────────────────────
// Drives Mo.setMouthOpen() from a Web Audio AnalyserNode that sits on the
// playback path (so the mouth moves in sync with what Mo is *saying*, not
// what the customer is saying).
//
// Signal chain:
//   AnalyserNode → RMS → noise gate → attack/release envelope → normalize → Mo
// ─────────────────────────────────────────────────────────────────────────────

import { Mo } from '../character/Mo.js';

// ── Tuning parameters ─────────────────────────────────────────────────────────
const NOISE_GATE   = 0.003;  // RMS below this → treated as silence (0)
const ATTACK       = 0.65;   // per-frame blend towards louder signal (fast, snappy onset)
const RELEASE      = 0.16;   // per-frame blend towards quieter signal (~80ms decay)
const NORMALIZE_AT = 0.13;   // RMS that maps to mouth fully open (1.0)
//   Gemini 24kHz TTS speech RMS typically averages 0.04–0.12.
//   Setting NORMALIZE_AT to 0.13 ensures natural, full articulation of syllables.

// ── State ─────────────────────────────────────────────────────────────────────
let _rafId    = null;
let _envelope = 0;   // smoothed volume level

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Start the lip-sync loop.
 * @param {AnalyserNode} analyserNode  – from audioOutput.getAnalyserNode()
 */
export function startLipSync(analyserNode) {
  stopLipSync(); // cancel any previous loop

  const timeDomainBuf = new Uint8Array(analyserNode.frequencyBinCount);

  function frame() {
    analyserNode.getByteTimeDomainData(timeDomainBuf);

    // ── RMS of current buffer ─────────────────────────────────────────────
    let sumSq = 0;
    for (let i = 0; i < timeDomainBuf.length; i++) {
      const s = (timeDomainBuf[i] - 128) / 128; // normalise to -1..1
      sumSq += s * s;
    }
    const rms = Math.sqrt(sumSq / timeDomainBuf.length);

    // ── Noise gate ────────────────────────────────────────────────────────
    const gated = rms < NOISE_GATE ? 0 : rms;

    // ── Asymmetric attack / release envelope ──────────────────────────────
    // Fast attack so the mouth opens immediately on a loud sound;
    // slower release so it doesn't snap shut mid-word.
    const rate   = gated > _envelope ? ATTACK : RELEASE;
    _envelope   += rate * (gated - _envelope);

    // ── Normalise to 0..1 and drive Mo ───────────────────────────────────
    const mouthOpen = Math.min(1, _envelope / NORMALIZE_AT);
    Mo.setMouthOpen(mouthOpen);
    Mo.setSpeechCadence?.(mouthOpen);

    _rafId = requestAnimationFrame(frame);
  }

  _rafId = requestAnimationFrame(frame);
}

/**
 * Stop the lip-sync loop and reset Mo's mouth to closed.
 */
export function stopLipSync() {
  if (_rafId !== null) {
    cancelAnimationFrame(_rafId);
    _rafId = null;
  }
  _envelope = 0;
  Mo.setMouthOpen(0);
  Mo.setSpeechCadence?.(0);
}
