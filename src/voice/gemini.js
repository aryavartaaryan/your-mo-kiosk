// src/voice/gemini.js
// ─────────────────────────────────────────────────────────────────────────────
// GeminiVoiceSession – manages a Gemini Live WebSocket session.
//
// Latency optimisations applied here:
//   1. realtimeInputConfig.voiceActivityDetection with tight VAD settings
//      → server detects end-of-speech in ~500 ms instead of 1000+ ms
//   2. VAD settings pulled from CONFIG.VAD so they're easy to tune
// ─────────────────────────────────────────────────────────────────────────────

import { GoogleGenAI } from '@google/genai';
import { CONFIG }      from '../config.js';
import { SYSTEM_INSTRUCTION } from './personality.js';

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
    this._session          = null;
    this._latencyMark      = null;
    this._waitingForAudio  = false;
    this._pendingTextQueue = [];
  }

  async connect() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey?.trim()) {
      throw new Error(
        'VITE_GEMINI_API_KEY is missing. Copy .env.example → .env and add your key.'
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const session = await ai.live.connect({
      model: CONFIG.GEMINI_MODEL,

      config: {
        // ── Audio only — no text modality = less overhead ─────────────────
        responseModalities: ['AUDIO'],

        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },

        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: CONFIG.VOICE_NAME },
          },
        },

        // ── Transcription for both sides ──────────────────────────────────
        inputAudioTranscription:  {},
        outputAudioTranscription: {},

        // ── VAD — key latency fix ─────────────────────────────────────────
        // Tells the server how quickly to decide the user has stopped speaking.
        // HIGH sensitivity + 500 ms silence = Mo responds ~500 ms faster.
        realtimeInputConfig: {
          automaticActivityDetection: {
            startOfSpeechSensitivity: CONFIG.VAD.startOfSpeechSensitivity,
            endOfSpeechSensitivity:   CONFIG.VAD.endOfSpeechSensitivity,
            prefixPaddingMs:          CONFIG.VAD.prefixPaddingMs,
            silenceDurationMs:        CONFIG.VAD.silenceDurationMs,
          },
        },
      },

      callbacks: {
        // Note: SDK fires onopen before session setup is complete.
        // We trigger _handleOpen below AFTER the session is fully resolved.
        onopen:    ()    => {},
        onmessage: (msg) => this._handleMessage(msg),
        onerror:   (err) => this._handleError(err),
        onclose:   (ev)  => this._handleClose(ev),
      },
    });

    this._session = session;
    this._handleOpen();
  }

  /**
   * Send a 16-bit PCM chunk (20 ms @ 16 kHz) to the model.
   * @param {Int16Array} int16Array
   */
  sendAudioChunk(int16Array) {
    if (!this._session) return;
    try {
      this._session.sendRealtimeInput({
        audio: {
          data:     int16ToBase64(int16Array),
          mimeType: 'audio/pcm;rate=16000',
        },
      });
    } catch (err) {
      console.warn('[Gemini] sendRealtimeInput failed:', err);
    }
  }

  /**
   * Send a client text turn to the model.
   * Enables proactive audio responses and one-tap scenario chips.
   * @param {string} text
   */
  sendTextMessage(text) {
    if (!this._session) {
      console.log('[Gemini] Session connecting — queueing text turn:', text);
      this._pendingTextQueue.push(text);
      return;
    }
    try {
      this._latencyMark     = performance.now();
      this._waitingForAudio = true;
      this._session.sendClientContent({
        turns: [{ role: 'user', parts: [{ text }] }],
        turnComplete: true,
      });
    } catch (err) {
      console.warn('[Gemini] sendClientContent failed:', err);
    }
  }

  close() {
    try { this._session?.close(); } catch {}
    this._session = null;
    this._pendingTextQueue = [];
  }

  // ── Private ───────────────────────────────────────────────────────────────

  _handleOpen() {
    console.log(`[Gemini] Connected ✓  model=${CONFIG.GEMINI_MODEL}  voice=${CONFIG.VOICE_NAME}`);
    this._cb.onOpen?.();
    while (this._pendingTextQueue.length > 0) {
      const queued = this._pendingTextQueue.shift();
      console.log('[Gemini] Flushing queued text turn:', queued);
      this.sendTextMessage(queued);
    }
  }

  _handleMessage(msg) {
    const sc = msg?.serverContent;
    if (!sc) return;

    // ── Audio chunks ──────────────────────────────────────────────────────
    for (const part of sc.modelTurn?.parts ?? []) {
      const b64 = part.inlineData?.data;
      if (!b64) continue;

      if (this._waitingForAudio && this._latencyMark !== null) {
        const ms = Math.round(performance.now() - this._latencyMark);
        this._waitingForAudio = false;
        console.log(`[Gemini] ⚡ First audio latency: ${ms} ms`);
        this._cb.onLatency?.(ms);
      }

      this._cb.onAudioChunk?.(base64ToInt16(b64));
    }

    // ── Mo's transcript ───────────────────────────────────────────────────
    const outText = sc.outputTranscription?.text;
    if (outText) this._cb.onOutputTranscript?.(outText);

    // ── Customer's transcript + start latency clock ───────────────────────
    const inText = sc.inputTranscription?.text;
    if (inText) {
      this._latencyMark     = performance.now();
      this._waitingForAudio = true;
      this._cb.onInputTranscript?.(inText);
    }

    // ── Interruption ──────────────────────────────────────────────────────
    if (sc.interrupted) {
      console.log('[Gemini] Interrupted by user');
      this._waitingForAudio = false;
      this._cb.onInterrupted?.();
    }

    // ── Turn complete ─────────────────────────────────────────────────────
    if (sc.turnComplete) {
      console.log('[Gemini] Turn complete');
      this._cb.onTurnComplete?.();
    }
  }

  _handleError(err) {
    const error = err instanceof Error ? err : new Error(String(err?.message ?? err));
    console.error('[Gemini] Session error:', error);
    this._cb.onError?.(error);
  }

  _handleClose(ev) {
    console.log(`[Gemini] Closed  code=${ev?.code ?? '?'}  reason=${ev?.reason ?? '(none)'}`);
    this._cb.onClose?.(ev);
  }
}
