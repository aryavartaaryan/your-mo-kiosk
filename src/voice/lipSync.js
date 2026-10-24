// src/voice/lipSync.js
// ─────────────────────────────────────────────────────────────────────────────
// Organic Speech Formant Lip-Sync Engine
// Analyzes both audio RMS and vocal tract formant energy (250Hz - 1,400Hz)
// to drive Mo's mouth visemes with human coarticulation and zero jitter.
// ─────────────────────────────────────────────────────────────────────────────

import { Mo } from '../character/Mo.js';

// ── Tuning parameters ─────────────────────────────────────────────────────────
const NOISE_GATE      = 0.004;  // RMS below this → silence (resting smile)
const ATTACK_RATE     = 0.38;   // Natural human jaw opening rate (~35ms)
const RELEASE_RATE    = 0.16;   // Phonetic syllable dwell & smooth closing (~90ms)
const NORMALIZE_PEAK  = 0.085;  // Typical Gemini TTS vowel peak energy

// ── State ─────────────────────────────────────────────────────────────────────
let _rafId     = null;
let _envelope  = 0;   // smoothed vowel energy
let _cadence   = 0;   // smoothed conversational pacing

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Start the formant-weighted lip-sync loop.
 * @param {AnalyserNode} analyserNode – from audioOutput.getAnalyserNode()
 */
export function startLipSync(analyserNode) {
  stopLipSync();

  const binCount = analyserNode.frequencyBinCount;
  const timeBuf  = new Uint8Array(binCount);
  const freqBuf  = new Uint8Array(binCount);

  const sampleRate = analyserNode.context?.sampleRate || 24000;
  const nyquist    = sampleRate / 2;
  const hzPerBin   = nyquist / binCount;

  // Compute bin range for human speech vowel formants (F1: ~250 Hz to ~1,400 Hz)
  const fMinBin = Math.max(1, Math.floor(250 / hzPerBin));
  const fMaxBin = Math.min(binCount - 1, Math.ceil(1400 / hzPerBin));

  function frame() {
    analyserNode.getByteTimeDomainData(timeBuf);
    analyserNode.getByteFrequencyData(freqBuf);

    // 1. Time-Domain RMS (overall loudness)
    let sumSq = 0;
    for (let i = 0; i < timeBuf.length; i++) {
      const s = (timeBuf[i] - 128) / 128;
      sumSq += s * s;
    }
    const rms = Math.sqrt(sumSq / timeBuf.length);

    // 2. Frequency-Domain Vowel Formant Energy (jaw-drop resonance)
    let vowelSum = 0;
    let vowelCount = 0;
    for (let b = fMinBin; b <= fMaxBin; b++) {
      vowelSum += freqBuf[b];
      vowelCount++;
    }
    const vowelEnergy = vowelCount > 0 ? (vowelSum / vowelCount) / 255 : 0;

    // 3. Combined Speech Signal (Formant-boosted RMS)
    let rawSignal = 0;
    if (rms >= NOISE_GATE) {
      // Blend 60% vowel formant frequency energy with 40% broadband RMS
      rawSignal = (vowelEnergy * 0.6) + (rms * 0.4);
    }

    // 4. Asymmetric Human Articulation Attack / Release Filter
    const target = Math.min(1, rawSignal / NORMALIZE_PEAK);
    const rate   = target > _envelope ? ATTACK_RATE : RELEASE_RATE;
    _envelope   += rate * (target - _envelope);

    // 5. Conversational Cadence (smooth pacing signal for head emphasis)
    _cadence += 0.22 * (_envelope - _cadence);

    // 6. Drive Mo's living rig
    const finalMouth = Math.max(0, Math.min(1, _envelope));
    Mo.setMouthOpen(finalMouth);
    Mo.setSpeechCadence?.(_cadence);

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
  _cadence  = 0;
  Mo.setMouthOpen(0);
  Mo.setSpeechCadence?.(0);
}
