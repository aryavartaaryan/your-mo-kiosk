// src/voice/audioOutput.js
// ─────────────────────────────────────────────────────────────────────────────
// Streaming playback for Gemini's 16-bit PCM, 24 kHz audio replies.
//
// Latency tuning:
//   STARTUP_BUFFER_S = 0.03  →  30 ms (was 60 ms)
//   Lower buffer = audio starts playing sooner after first chunk arrives.
// ─────────────────────────────────────────────────────────────────────────────

const OUTPUT_SAMPLE_RATE = 24_000;
const STARTUP_BUFFER_S   = 0.03;   // 30 ms before first chunk plays (was 60 ms)

let _ctx         = null;
let _gainNode    = null;
let _analyser    = null;
let _nextStart   = 0;
let _activeNodes = new Set();
let _endCb       = null;

export function initOutputAudio() {
  if (_ctx) return;
  _ctx      = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
  _gainNode = _ctx.createGain();
  _analyser = _ctx.createAnalyser();
  _analyser.fftSize               = 512;
  _analyser.smoothingTimeConstant = 0;
  _gainNode.connect(_analyser);
  _analyser.connect(_ctx.destination);
}

export async function resumeOutputAudio() {
  if (_ctx?.state === 'suspended') await _ctx.resume();
}

export function getAnalyserNode()  { return _analyser; }

export function getRemainingPlaybackMs() {
  if (!_ctx || _nextStart <= _ctx.currentTime) return 0;
  return (_nextStart - _ctx.currentTime) * 1000;
}

export function isOutputPlaying()  { return _activeNodes.size > 0; }

/**
 * Enqueue a 16-bit PCM chunk for immediate streaming playback.
 * @param {Int16Array} int16Array
 */
export function enqueueAudioChunk(int16Array) {
  if (!_ctx) return;

  const floats = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) floats[i] = int16Array[i] / 32768;

  const buffer = _ctx.createBuffer(1, floats.length, OUTPUT_SAMPLE_RATE);
  buffer.copyToChannel(floats, 0);

  const source = _ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(_gainNode);

  const now = _ctx.currentTime;
  // Add startup buffer only if queue is empty (first chunk or after a clear)
  if (_nextStart < now + 0.01) _nextStart = now + STARTUP_BUFFER_S;

  source.start(_nextStart);
  _nextStart += buffer.duration;

  _activeNodes.add(source);
  source.addEventListener('ended', () => {
    _activeNodes.delete(source);
    if (_activeNodes.size === 0 && _endCb) _endCb();
  });
}

export function clearAudioQueue() {
  for (const node of _activeNodes) try { node.stop(); } catch {}
  _activeNodes.clear();
  _nextStart = _ctx ? _ctx.currentTime : 0;
}

export function setOnPlaybackEnd(fn) { _endCb = fn; }
