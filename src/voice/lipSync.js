// src/voice/lipSync.js
// ─────────────────────────────────────────────────────────────────────────────
// Billion-Dollar Quality Real-Time Modern AI Avatar Lip-Sync Engine
// Dual-formant (F1 jaw aperture, F2 tongue/lip-rounding) and spectral flux
// phoneme classifier. Maps 24kHz streaming audio to Preston Blair / Oculus
// phonetic visemes (AA, EE, OH, OU, DENTAL, FV, MBP, REST) with zero lag.
// ─────────────────────────────────────────────────────────────────────────────

import { Mo } from '../character/Mo.js';

// ── Tuning parameters ─────────────────────────────────────────────────────────
const NOISE_FLOOR     = 0.0055; // Reverb/silence baseline cutoff
const PEAK_LEVEL      = 0.075;  // Typical loud vowel RMS level
const ATTACK_RATE     = 0.88;   // Snappy jaw opening on vowel/syllable onset
const RELEASE_RATE    = 0.38;   // Rapid jaw closure on syllable offsets & stops (closes in ~35ms)
const GAMMA_CONTRAST  = 1.65;   // Contrast expander: forces valleys to zero so mouth shuts between words

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
    let rawNormalized = 0;

    if (rms <= NOISE_FLOOR) {
      candidateViseme = 'rest';
      rawNormalized = 0;
    } else {
      const vocalRms = (rms - NOISE_FLOOR) / (PEAK_LEVEL - NOISE_FLOOR);
      const sibilant = _sibSmooth > 85 ? (_sibSmooth - 85) / 160 * 0.35 : 0;
      rawNormalized = Math.max(vocalRms, sibilant);

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

    rawNormalized = Math.max(0, Math.min(1.0, rawNormalized));

    // 4. Dynamic Contrast Envelope Follower
    // Power curve (gamma 1.65) pushes inter-word dips to 0 so the mouth completely shuts,
    // while driving loud vowels to full aperture.
    const targetAperture = Math.pow(rawNormalized, GAMMA_CONTRAST);
    const rate           = targetAperture > _envelope ? ATTACK_RATE : RELEASE_RATE;
    _envelope           += rate * (targetAperture - _envelope);

    // If envelope dips below 0.04, snap candidate to rest (shut mouth)
    if (_envelope < 0.04) {
      candidateViseme = 'rest';
    }

    // 5. Syllabic Dwell & Coarticulation Debouncing
    const isVowel = candidateViseme === 'aa' || candidateViseme === 'oh' || candidateViseme === 'ee' || candidateViseme === 'ou';
    const targetDwell = isVowel ? 5 : 3;

    if (candidateViseme === 'rest') {
      _activeViseme = 'rest';
      _dwellCount   = 0;
    } else if (candidateViseme !== _activeViseme) {
      if (_dwellCount <= 0 || (candidateViseme === 'aa' && _envelope > 0.45)) {
        _activeViseme = candidateViseme;
        _dwellCount   = targetDwell;
      } else {
        _dwellCount--;
      }
    } else {
      _dwellCount = Math.max(0, _dwellCount - 1);
    }

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
