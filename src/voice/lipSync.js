// src/voice/lipSync.js
// ─────────────────────────────────────────────────────────────────────────────
// Advanced Bi-Band Formant Lip-Sync & Conversational Cadence Engine
//
// Drives Mo's real-time facial articulation and speech-synchronized body kinetics
// from the audio output playback path.
//
// Dual-Domain Signal Analysis:
//   1. Time-Domain RMS: Instantaneous speech onset, noise gating, and syllabic envelope.
//   2. Frequency-Domain Formants:
//      • Low-Formant F1 (150Hz - 1100Hz): Vowel resonance driving vertical jaw drop (A, O, U, E).
//      • High-Formant F2/F3 (2200Hz - 6500Hz): Sibilants & fricatives driving horizontal mouth width (S, T, Z, EE).
//      • Syllabic Accent Derivative (dE/dt): Key syllable stress pulses driving natural head nods.
// ─────────────────────────────────────────────────────────────────────────────

import { Mo } from '../character/Mo.js';

// ── Acoustic Tuning Parameters ────────────────────────────────────────────────
const NOISE_GATE     = 0.0032; // RMS threshold below which audio is treated as silence
const ATTACK         = 0.84;   // Fast onset on vowel bursts (~14ms)
const RELEASE        = 0.24;   // Smooth natural syllabic decay (~65ms)
const NORMALIZE_AT   = 0.092;  // Target speech RMS for full jaw openness

// ── Engine State ──────────────────────────────────────────────────────────────
let _rafId           = null;
let _envelope        = 0;      // Smoothed speech volume envelope
let _smoothWidth     = 0;      // Smoothed horizontal mouth width
let _prevEnvelope    = 0;      // Previous frame envelope for stress derivative

/**
 * Start the real-time lip-sync and conversational cadence loop.
 * @param {AnalyserNode} analyserNode – Web Audio AnalyserNode on playback path
 */
export function startLipSync(analyserNode) {
  stopLipSync();

  const binCount = analyserNode.frequencyBinCount;
  const timeDomainBuf = new Uint8Array(binCount);
  const freqBuf = new Uint8Array(binCount);

  // Compute bin indices based on AudioContext sample rate
  const ctxSampleRate = analyserNode.context?.sampleRate || 24000;
  const binHz = ctxSampleRate / (2 * binCount);

  // Formant band boundaries
  const lowStart  = Math.max(1, Math.floor(150 / binHz));
  const lowEnd    = Math.min(binCount - 1, Math.max(lowStart + 2, Math.floor(1100 / binHz)));
  const highStart = Math.min(binCount - 2, Math.max(lowEnd + 1, Math.floor(2200 / binHz)));
  const highEnd   = Math.min(binCount - 1, Math.max(highStart + 2, Math.floor(6500 / binHz)));

  function frame() {
    analyserNode.getByteTimeDomainData(timeDomainBuf);
    analyserNode.getByteFrequencyData(freqBuf);

    // ── 1. Time-Domain RMS Calculation ────────────────────────────────────────
    let sumSq = 0;
    for (let i = 0; i < timeDomainBuf.length; i++) {
      const s = (timeDomainBuf[i] - 128) / 128;
      sumSq += s * s;
    }
    const rms = Math.sqrt(sumSq / timeDomainBuf.length);

    // ── 2. Noise Gate ─────────────────────────────────────────────────────────
    const gatedRms = rms < NOISE_GATE ? 0 : rms;

    // ── 3. Asymmetric Syllabic Attack / Release Filter ────────────────────────
    const rate = gatedRms > _envelope ? ATTACK : RELEASE;
    _envelope += rate * (gatedRms - _envelope);

    // ── 4. Bi-Band Formant Frequency Extraction ───────────────────────────────
    let lowEnergy = 0;
    const lowCount = lowEnd - lowStart;
    for (let i = lowStart; i < lowEnd; i++) {
      lowEnergy += freqBuf[i];
    }
    const vowelFormant = lowCount > 0 ? (lowEnergy / (lowCount * 255)) : 0;

    let highEnergy = 0;
    const highCount = highEnd - highStart;
    for (let i = highStart; i < highEnd; i++) {
      highEnergy += freqBuf[i];
    }
    const consonantFormant = highCount > 0 ? (highEnergy / (highCount * 255)) : 0;

    // ── 5. Syllable Stress Pulse (Acceleration Derivative) ────────────────────
    const dE = Math.max(0, _envelope - _prevEnvelope);
    const stressPulse = Math.min(1.0, dE * 9.5);
    _prevEnvelope = _envelope;

    // ── 6. Articulation Mapping ───────────────────────────────────────────────
    // Normalized mouth openness (jaw drop)
    const mouthOpen = Math.min(1.0, _envelope / NORMALIZE_AT);

    // Normalized mouth width (horizontal tension on sibilants vs rounding on deep vowels)
    const rawWidth = Math.min(1.0, consonantFormant * 2.2 - vowelFormant * 0.4);
    _smoothWidth += 0.35 * (rawWidth - _smoothWidth);
    const mouthWidth = Math.max(0, Math.min(1.0, _smoothWidth));

    // ── 7. Dispatch Articulation to Mo ────────────────────────────────────────
    Mo.setAcousticArticulation?.({
      openness: mouthOpen,
      width: mouthWidth,
      stress: stressPulse,
      cadence: mouthOpen
    });

    Mo.setMouthOpen(mouthOpen);
    Mo.setSpeechCadence?.(mouthOpen);

    _rafId = requestAnimationFrame(frame);
  }

  _rafId = requestAnimationFrame(frame);
}

/**
 * Stop the lip-sync loop and gracefully return Mo to neutral rest.
 */
export function stopLipSync() {
  if (_rafId !== null) {
    cancelAnimationFrame(_rafId);
    _rafId = null;
  }
  _envelope = 0;
  _smoothWidth = 0;
  _prevEnvelope = 0;

  Mo.setAcousticArticulation?.({
    openness: 0,
    width: 0,
    stress: 0,
    cadence: 0
  });

  Mo.setMouthOpen(0);
  Mo.setSpeechCadence?.(0);
}
