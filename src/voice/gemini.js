// src/voice/gemini.js
// ─────────────────────────────────────────────────────────────────────────────
// GeminiVoiceSession – manages a live voice session via the protected
// server-side WebSocket relay (/ws/live).
//
// 100% Confidential Architecture:
//   • The entire Mo system prompt (personality.js) stays strictly on the server.
//   • Google Gemini API key is loaded on the server and never exposed to the client.
//   • Zero prompt text or credentials are bundled into the client-side JavaScript.
//   • Streams 16-bit PCM audio chunks and transcription events with zero latency overhead.
// ─────────────────────────────────────────────────────────────────────────────

// ── Helpers ───────────────────────────────────────────────────────────────────

function int16ToBase64(int16Array) {
  const bytes  = new Uint8Array(int16Array.buffer, int16Array.byteOffset, int16Array.byteLength);
  let   binary = '';
  const CHUNK  = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK)
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return btoa(binary);
}

function base64ToInt16(b64) {
  const binary = atob(b64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

// ── GeminiVoiceSession ────────────────────────────────────────────────────────

export class GeminiVoiceSession {
  /** @param {Record<string, Function>} callbacks */
  constructor(callbacks = {}) {
    this._cb               = callbacks;
    this._ws               = null;
    this._latencyMark      = null;
    this._waitingForAudio  = false;
    this._pendingTextQueue = [];
    this._isOpen           = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl    = `${protocol}//${window.location.host}/ws/live`;
      console.log(`[Gemini] Connecting to secure backend relay: ${wsUrl}`);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[Gemini] Connected to relay socket ✓');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this._handleMessage(msg, resolve);
        } catch (err) {
          console.warn('[Gemini] Malformed message from relay:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('[Gemini] Relay WebSocket error:', err);
        const error = new Error('WebSocket connection to voice relay failed.');
        this._cb.onError?.(error);
        reject(error);
      };

      ws.onclose = (ev) => {
        console.log(`[Gemini] Relay connection closed code=${ev.code} reason=${ev.reason || '(none)'}`);
        this._isOpen = false;
        this._cb.onClose?.(ev);
      };

      this._ws = ws;
    });
  }

  /**
   * Send a 16-bit PCM chunk (20 ms @ 16 kHz) to the relay.
   * @param {Int16Array} int16Array
   */
  sendAudioChunk(int16Array) {
    if (!this._ws || this._ws.readyState !== WebSocket.OPEN) return;
    try {
      this._ws.send(JSON.stringify({
        type: 'audio',
        data: int16ToBase64(int16Array),
      }));
    } catch (err) {
      console.warn('[Gemini] sendAudioChunk failed:', err);
    }
  }

  /**
   * Send a client text turn to the model via the relay.
   * Enables proactive audio responses and one-tap scenario chips.
   * @param {string} text
   */
  sendTextMessage(text) {
    if (!this._isOpen || !this._ws || this._ws.readyState !== WebSocket.OPEN) {
      console.log('[Gemini] Session connecting — queueing text turn:', text);
      this._pendingTextQueue.push(text);
      return;
    }
    try {
      this._latencyMark     = performance.now();
      this._waitingForAudio = true;
      this._ws.send(JSON.stringify({
        type: 'text',
        text,
      }));
    } catch (err) {
      console.warn('[Gemini] sendTextMessage failed:', err);
    }
  }

  close() {
    try { this._ws?.close(); } catch {}
    this._ws = null;
    this._isOpen = false;
    this._pendingTextQueue = [];
  }

  // ── Private ───────────────────────────────────────────────────────────────

  _handleMessage(msg, resolveConnect) {
    switch (msg.type) {
      case 'open':
        this._isOpen = true;
        console.log('[Gemini] Live session active on server ✓');
        this._cb.onOpen?.();
        while (this._pendingTextQueue.length > 0) {
          const queued = this._pendingTextQueue.shift();
          console.log('[Gemini] Flushing queued text turn:', queued);
          this.sendTextMessage(queued);
        }
        resolveConnect?.();
        break;

      case 'audio':
        if (msg.data) {
          if (this._waitingForAudio && this._latencyMark !== null) {
            const ms = Math.round(performance.now() - this._latencyMark);
            this._waitingForAudio = false;
            console.log(`[Gemini] ⚡ First audio latency: ${ms} ms`);
            this._cb.onLatency?.(ms);
          }
          this._cb.onAudioChunk?.(base64ToInt16(msg.data));
        }
        break;

      case 'output_transcript':
        if (msg.text) {
          this._cb.onOutputTranscript?.(msg.text);
        }
        break;

      case 'input_transcript':
        if (msg.text) {
          this._latencyMark     = performance.now();
          this._waitingForAudio = true;
          this._cb.onInputTranscript?.(msg.text);
        }
        break;

      case 'interrupted':
        console.log('[Gemini] Interrupted by user');
        this._waitingForAudio = false;
        this._cb.onInterrupted?.();
        break;

      case 'turn_complete':
        console.log('[Gemini] Turn complete');
        this._cb.onTurnComplete?.();
        break;

      case 'error':
        console.error('[Gemini] Error from server relay:', msg.message);
        this._cb.onError?.(new Error(msg.message || 'Server relay error'));
        break;

      case 'close':
        console.log(`[Gemini] Closed by server code=${msg.code} reason=${msg.reason || '(none)'}`);
        this._isOpen = false;
        this._cb.onClose?.(msg);
        break;
    }
  }
}
