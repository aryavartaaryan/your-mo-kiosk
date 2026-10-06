// src/voice/audioInput.js
// ─────────────────────────────────────────────────────────────────────────────
// Microphone capture → 16-bit PCM at 16 kHz chunks for Gemini Live.
//
// Latency tuning:
//   _chunkFrames = 320  →  20 ms chunks (was 40 ms)
//   Smaller chunks = audio reaches the server faster = lower perceived latency.
// ─────────────────────────────────────────────────────────────────────────────

const WORKLET_SRC = /* js */`
class PcmProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // 320 samples @ 16 kHz = 20 ms per chunk — optimal for real-time speech
    this._chunkFrames = 320;
    this._buf = [];
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;

    for (let i = 0; i < channel.length; i++) {
      const s = Math.max(-1, Math.min(1, channel[i]));
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

let _ctx         = null;
let _stream      = null;
let _sourceNode  = null;
let _workletNode = null;
let _blobUrl     = null;

/**
 * Start mic capture. Calls onChunk with each 20 ms Int16Array PCM chunk.
 * @param {(chunk: Int16Array) => void} onChunk
 */
export async function startMic(onChunk) {
  stopMic();

  _ctx = new AudioContext({ sampleRate: 16_000 });

  _blobUrl = URL.createObjectURL(
    new Blob([WORKLET_SRC], { type: 'application/javascript' })
  );
  await _ctx.audioWorklet.addModule(_blobUrl);

  _stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl:  true,
      channelCount:     1,
      sampleRate:       16_000,
    },
    video: false,
  });

  _sourceNode  = _ctx.createMediaStreamSource(_stream);
  _workletNode = new AudioWorkletNode(_ctx, 'pcm-processor');

  _workletNode.port.onmessage = (e) => onChunk(new Int16Array(e.data));

  // mic → worklet only (NOT to destination — prevents feedback loop)
  _sourceNode.connect(_workletNode);
}

export function stopMic() {
  try { _workletNode?.disconnect(); } catch {}
  try { _sourceNode?.disconnect();  } catch {}
  _stream?.getTracks().forEach(t => t.stop());
  _ctx?.close().catch(() => {});
  if (_blobUrl) { URL.revokeObjectURL(_blobUrl); _blobUrl = null; }
  _ctx = _stream = _sourceNode = _workletNode = null;
}

export function isMicActive() { return _ctx !== null; }
