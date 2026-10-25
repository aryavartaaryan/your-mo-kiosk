// src/voice/audioInput.js
// ─────────────────────────────────────────────────────────────────────────────
// Microphone capture → 16-bit PCM at 16 kHz chunks for Gemini Live.
//
// Acoustic Noise Management Architecture:
//   1. Hardware DSP Constraints: echo cancellation, noise suppression, AGC.
//   2. Web Audio Low-Cut Biquad Filter: 85 Hz Butterworth high-pass cuts mechanical
//      table thumps, HVAC rumble, and 60 Hz hum without touching vocal timbre.
//   3. Dynamic RMS Noise Gate in Worklet:
//      - Instant-attack (0ms) so soft consonants ('p', 't', 'k', 's') are never clipped.
//      - 400ms hangover hold time preserves natural pauses between words.
//      - Smooth gain curve prevents clicks/pops and eliminates ambient cafeteria hiss.
// ─────────────────────────────────────────────────────────────────────────────

import { CONFIG } from '../config.js';

const WORKLET_SRC = /* js */`
class PcmProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // 320 samples @ 16 kHz = 20 ms per chunk — optimal for real-time speech
    this._chunkFrames = 320;
    this._buf = [];

    // Acoustic noise gate & dynamic ambient tracker
    this._enabled        = true;
    this._openThreshold  = 0.016; // Static minimum open threshold
    this._closeThreshold = 0.009; // Static minimum close threshold
    this._holdFrames     = 20;    // ~400ms hangover (20 chunks * 20ms) for natural pauses
    this._holdCount      = 0;
    this._isOpen         = false;
    this._gain           = 0.0;   // Smoothed multiplier (0.0 to 1.0)
    this._isMuted        = false; // External mute state

    // Adaptive noise floor tracking (dynamically calibrates to loud cafeterias)
    this._adaptive       = true;
    this._noiseFloor     = 0.005; // Running baseline ambient energy
    this._snrMultiplier  = 2.8;   // Voice must be ~9dB (2.8x) above ambient room floor

    this.port.onmessage = (e) => {
      if (e.data?.type === 'config') {
        if (typeof e.data.enabled === 'boolean')  this._enabled        = e.data.enabled;
        if (typeof e.data.adaptive === 'boolean') this._adaptive       = e.data.adaptive;
        if (e.data.openThreshold)                 this._openThreshold  = e.data.openThreshold;
        if (e.data.closeThreshold)                this._closeThreshold = e.data.closeThreshold;
        if (e.data.holdFrames)                    this._holdFrames     = e.data.holdFrames;
        if (e.data.snrMultiplier)                 this._snrMultiplier  = e.data.snrMultiplier;
      } else if (e.data?.type === 'mute') {
        this._isMuted = !!e.data.value;
      }
    };
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;

    // 1. Calculate RMS energy of current audio quantum
    let sumSq = 0;
    for (let i = 0; i < channel.length; i++) {
      const v = channel[i];
      sumSq += v * v;
    }
    const rms = Math.sqrt(sumSq / channel.length);

    // 2. Adaptive Room Noise Floor Tracker
    // When the speech gate is closed and mic is unmuted, continuously calibrate to background room noise
    if (!this._isOpen && !this._isMuted) {
      // Gentle leaky filter (adapts to changing lunch rush noise levels over ~2 seconds)
      this._noiseFloor += (rms - this._noiseFloor) * 0.015;
      if (this._noiseFloor < 0.001) this._noiseFloor = 0.001;
    }

    // Dynamic thresholds: requires the voice to stand out above room baseline
    const effectiveOpen = this._adaptive
      ? Math.max(this._openThreshold, this._noiseFloor * this._snrMultiplier)
      : this._openThreshold;
    const effectiveClose = this._adaptive
      ? Math.max(this._closeThreshold, this._noiseFloor * 1.5)
      : this._closeThreshold;

    // 3. Hysteresis & Hangover Hold logic
    if (!this._isMuted && rms >= effectiveOpen) {
      this._isOpen = true;
      this._holdCount = this._holdFrames; // Reset hangover timer
    } else if (this._holdCount > 0 && !this._isMuted) {
      this._holdCount--;
      this._isOpen = true; // Keep gate open during natural conversational pauses
    } else if (rms < effectiveClose || this._isMuted) {
      this._isOpen = false;
    }

    // 4. Smooth gain application (instant attack, gentle release, zero clicks)
    const targetGain = (!this._enabled || this._isOpen) && !this._isMuted ? 1.0 : 0.0;
    const alpha = this._isOpen ? 0.95 : 0.22;
    this._gain += (targetGain - this._gain) * alpha;
    if (this._gain < 0.001) this._gain = 0;

    // 5. Scale to 16-bit PCM with gate applied
    for (let i = 0; i < channel.length; i++) {
      const gSample = channel[i] * this._gain;
      const s = Math.max(-1, Math.min(1, gSample));
      this._buf.push(s < 0 ? s * 32768 : s * 32767);
    }

    while (this._buf.length >= this._chunkFrames) {
      const chunk = new Int16Array(this._buf.splice(0, this._chunkFrames));
      this.port.postMessage(chunk.buffer, [chunk.buffer]);
    }
    return true;
  }
}
registerProcessor('pcm-processor', PcmProcessor);
`;

let _ctx            = null;
let _stream         = null;
let _sourceNode     = null;
let _highPassFilter = null;
let _workletNode    = null;
let _blobUrl        = null;

/**
 * Start mic capture with full acoustic noise management.
 * Calls onChunk with each 20 ms Int16Array PCM chunk.
 * @param {(chunk: Int16Array) => void} onChunk
 * @param {object} [options]
 */
export async function startMic(onChunk, options = {}) {
  stopMic();

  _ctx = new AudioContext({ sampleRate: 16_000 });

  _blobUrl = URL.createObjectURL(
    new Blob([WORKLET_SRC], { type: 'application/javascript' })
  );
  await _ctx.audioWorklet.addModule(_blobUrl);

  // Kiosk Noise Hardening:
  // Disable AGC (Auto Gain Control). When AGC is true, pauses between words cause
  // the hardware to aggressively amplify distant dining hall chatter into the microphone.
  _stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation:     true,
      noiseSuppression:     true,
      autoGainControl:      false, // DISABLED: Prevents auto-amplifying room noise
      channelCount:         1,
      sampleRate:           16_000,
      googEchoCancellation: true,
      googAutoGainControl:  false, // DISABLED in Google WebRTC engine
      googNoiseSuppression: true,
      googHighpassFilter:   true,
    },
    video: false,
  });

  _sourceNode  = _ctx.createMediaStreamSource(_stream);
  _workletNode = new AudioWorkletNode(_ctx, 'pcm-processor');

  // ── High-Pass Acoustic Filter (85 Hz Butterworth low-cut) ───────────────────
  const nmConfig = CONFIG.noiseManagement || {};
  const lowCutHz = options.lowCutHz ?? nmConfig.lowCutFilterHz ?? 85;

  _highPassFilter = _ctx.createBiquadFilter();
  _highPassFilter.type = 'highpass';
  _highPassFilter.frequency.setValueAtTime(lowCutHz, _ctx.currentTime);
  _highPassFilter.Q.setValueAtTime(0.707, _ctx.currentTime);

  // Configure worklet noise gate settings
  const openThresh    = options.gateOpenThreshold   ?? nmConfig.gateOpenThreshold  ?? 0.016;
  const closeThresh   = options.gateCloseThreshold  ?? nmConfig.gateCloseThreshold ?? 0.009;
  const holdMs        = options.gateHoldMs          ?? nmConfig.gateHoldMs         ?? 400;
  const holdFrames    = Math.round(holdMs / 20); // 20ms chunks
  const adaptive      = options.adaptiveNoiseFloor  ?? nmConfig.adaptiveNoiseFloor ?? true;
  const snrMultiplier = options.snrMultiplier       ?? nmConfig.snrMultiplier      ?? 2.8;

  _workletNode.port.postMessage({
    type:           'config',
    enabled:        nmConfig.enabled ?? true,
    adaptive:       adaptive,
    openThreshold:  openThresh,
    closeThreshold: closeThresh,
    holdFrames:     holdFrames,
    snrMultiplier:  snrMultiplier,
  });

  _workletNode.port.onmessage = (e) => onChunk(new Int16Array(e.data));

  // mic → highPassFilter → workletNode (NOT to destination — prevents feedback loop)
  _sourceNode.connect(_highPassFilter);
  _highPassFilter.connect(_workletNode);
}

/**
 * Programmatically mute or unmute the microphone stream in the worklet.
 * Used during Mo's playback to guarantee 100% anti-barge-in noise protection.
 * @param {boolean} muted
 */
export function setMicMuted(muted) {
  try {
    _workletNode?.port.postMessage({ type: 'mute', value: !!muted });
  } catch {}
}

export function stopMic() {
  try { _workletNode?.disconnect();    } catch {}
  try { _highPassFilter?.disconnect(); } catch {}
  try { _sourceNode?.disconnect();     } catch {}
  _stream?.getTracks().forEach(t => t.stop());
  _ctx?.close().catch(() => {});
  if (_blobUrl) { URL.revokeObjectURL(_blobUrl); _blobUrl = null; }
  _ctx = _stream = _sourceNode = _highPassFilter = _workletNode = null;
}

export function isMicActive() { return _ctx !== null; }
