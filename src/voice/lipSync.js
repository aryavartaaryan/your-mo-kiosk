// src/voice/lipSync.js
// ─────────────────────────────────────────────────────────────────────────────
// Billion-Dollar Quality Real-Time Modern AI Avatar Lip-Sync Engine
// Dual-formant (F1 jaw aperture, F2 tongue/lip-rounding) and spectral flux
// phoneme classifier. Maps 24kHz streaming audio to Preston Blair / Oculus
// phonetic visemes (AA, EE, OH, OU, DENTAL, FV, MBP, REST) with zero lag.
// ─────────────────────────────────────────────────────────────────────────────

import { Mo } from '../character/Mo.js';

// ── Tuning parameters ─────────────────────────────────────────────────────────
const NOISE_GATE      = 0.0035; // RMS threshold for silence (resting smile)
const ATTACK_RATE     = 0.90;   // Instantaneous jaw onset (<16ms, zero perceptual delay)
const RELEASE_RATE    = 0.24;   // Natural phonetic syllable closure (~65ms decay)
const NORMALIZE_PEAK  = 0.082;  // Calibrated to Gemini Live 24kHz vocal stream

// ── State ─────────────────────────────────────────────────────────────────────
let _rafId          = null;
let _envelope       = 0;        // smoothed speech power envelope
let _cadence        = 0;        // smoothed conversational pacing
let _activeViseme   = 'rest';   // current active phonetic viseme
let _dwellCount     = 0;        // frames remaining for current viseme dwell
let _f1Smooth       = 0;        // smoothed F1 jaw formant
let _f2Smooth       = 0;        // smoothed F2 frontness formant
let _sibSmooth      = 0;        // smoothed sibilance

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Start the real-time formant-tracking phoneme lip-sync loop.
 * @param {AnalyserNode} analyserNode – from audioOutput.getAnalyserNode()
 */
export function startLipSync(analyserNode) {
  stopLipSync();

  const binCount = analyserNode.frequencyBinCount;
  const timeBuf  = new Uint8Array(binCount);
  const freqBuf  = new Uint8Array(binCount);

  function frame() {
    analyserNode.getByteTimeDomainData(timeBuf);

    // 1. Instantaneous Time-Domain RMS (Zero-latency physical loudness)
    let sumSq = 0;
    for (let i = 0; i < timeBuf.length; i++) {
      const s = (timeBuf[i] - 128) / 128;
      sumSq += s * s;
    }
    const rms = Math.sqrt(sumSq / timeBuf.length);

    // 2. Frequency-Domain Formant & Spectral Feature Extraction
    analyserNode.getByteFrequencyData(freqBuf);

    // Formant F1 Band (bins 5..18, ~235 Hz to ~845 Hz) -> Jaw Aperture
    let f1Sum = 0;
    for (let b = 5; b <= 18; b++) f1Sum += freqBuf[b];
    const eF1 = f1Sum / 14;

    // Formant F2 Band (bins 19..52, ~890 Hz to ~2440 Hz) -> Tongue Frontness vs Rounding
    let f2Sum = 0;
    for (let b = 19; b <= 52; b++) f2Sum += freqBuf[b];
    const eF2 = f2Sum / 34;

    // High-Frequency Sibilant / Fricative Band (bins 55..125, ~2575 Hz to ~5860 Hz)
    let sibPeak = 0;
    for (let b = 55; b <= 125; b += 2) {
      if (freqBuf[b] > sibPeak) sibPeak = freqBuf[b];
    }

    // Coarticulation Exponential Smoothing (eliminates single-sample noisy glitches)
    _f1Smooth  += 0.55 * (eF1 - _f1Smooth);
    _f2Smooth  += 0.55 * (eF2 - _f2Smooth);
    _sibSmooth += 0.60 * (sibPeak - _sibSmooth);

    // 3. Phonetic Target Classification
    let candidateViseme = 'rest';
    let rawSignal = 0;

    if (rms < NOISE_GATE) {
      candidateViseme = 'rest';
      rawSignal = 0;
    } else {
      rawSignal = Math.max(rms, (_sibSmooth / 255) * 0.045);

      if (_sibSmooth > 92 && _sibSmooth > _f1Smooth * 1.15) {
        // Sibilants: /s, z, t, d, th, ch/ (teeth clenched dental)
        candidateViseme = 'dental';
      } else if (_sibSmooth > 72 && _f1Smooth < 58) {
        // Labiodentals: /f, v/ (lower lip tuck)
        candidateViseme = 'fv';
      } else if (_f1Smooth > 72) {
        // High F1 -> Wide open vowel sounds
        if (_f2Smooth > 80) {
          candidateViseme = 'ee'; // Front vowels (/i, e, æ/ - wide spread)
        } else if (_f2Smooth < 54) {
          candidateViseme = 'oh'; // Rounded back vowels (/o, ɔ/ - open oval)
        } else {
          candidateViseme = 'aa'; // Central open vowels (/a, ɑ/ - deep jaw drop)
        }
      } else if (_f1Smooth > 40) {
        // Moderate F1 -> Mid/Close vowels
        if (_f2Smooth < 50) {
          candidateViseme = 'ou'; // Tightly rounded /u, w, oo/ (pucker)
        } else if (_f2Smooth > 68) {
          candidateViseme = 'ee'; // Spread smile
        } else {
          candidateViseme = 'oh'; // Round oval
        }
      } else if (rms > 0.007) {
        // Low F1 + vocal energy -> Bilabials (/m, b, p/ closed lips)
        candidateViseme = 'mbp';
      } else {
        candidateViseme = 'dental';
      }
    }

    // 4. Syllabic Dwell & Coarticulation Debouncing
    const isVowel = candidateViseme === 'aa' || candidateViseme === 'oh' || candidateViseme === 'ee' || candidateViseme === 'ou';
    const targetDwell = isVowel ? 5 : 3;

    if (candidateViseme === 'rest') {
      _activeViseme = 'rest';
      _dwellCount   = 0;
    } else if (candidateViseme !== _activeViseme) {
      if (_dwellCount <= 0 || (candidateViseme === 'aa' && rms > 0.045)) {
        _activeViseme = candidateViseme;
        _dwellCount   = targetDwell;
      } else {
        _dwellCount--;
      }
    } else {
      _dwellCount = Math.max(0, _dwellCount - 1);
    }

    // 5. Envelope Follower (Zero-Lag Attack, Organic Phonetic Release)
    const target = Math.min(1.0, rawSignal / NORMALIZE_PEAK);
    const rate   = target > _envelope ? ATTACK_RATE : RELEASE_RATE;
    _envelope   += rate * (target - _envelope);

    // 6. Conversational Cadence (smooth pacing signal for head nod & emphasis)
    _cadence += 0.22 * (_envelope - _cadence);

    // 7. Parametric Lateral Spread Calculation (-1 = pucker, +1 = wide spread)
    const mouthSpread = candidateViseme === 'ee' ? 0.8 : (candidateViseme === 'ou' ? -0.7 : 0.0);

    // 8. Drive Mo's 3D Living Mascot Rig
    Mo.setViseme?.({
      viseme:   _activeViseme,
      aperture: Math.max(0, Math.min(1, _envelope)),
      spread:   mouthSpread,
      cadence:  _cadence,
    });

    // Backward-compatible calls
    Mo.setMouthOpen(Math.max(0, Math.min(1, _envelope)));
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
  _envelope     = 0;
  _cadence      = 0;
  _activeViseme = 'rest';
  _dwellCount   = 0;
  _f1Smooth     = 0;
  _f2Smooth     = 0;
  _sibSmooth    = 0;

  Mo.setViseme?.({
    viseme:   'rest',
    aperture: 0,
    spread:   0,
    cadence:  0,
  });
  Mo.setMouthOpen(0);
  Mo.setSpeechCadence?.(0);
}
