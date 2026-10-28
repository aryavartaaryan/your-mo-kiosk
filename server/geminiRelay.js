// server/geminiRelay.js
// ─────────────────────────────────────────────────────────────────────────────
// Secure Server-Side Gemini Live Relay for Halalholic Mo
//
// 100% Confidential Architecture:
//   • The entire Mo system prompt (personality.js) stays strictly on the server.
//   • Google Gemini API key is read from server environment / .env.
//   • Zero prompt text and zero API credentials are sent to the client browser.
//   • Bridges audio PCM streaming, transcripts, and turn events over WebSockets.
// ─────────────────────────────────────────────────────────────────────────────

import { GoogleGenAI } from '@google/genai';
import { CONFIG }      from '../src/config.js';
import { buildSystemInstruction } from '../src/voice/personality.js';

// Ensure .env is loaded on Node.js
if (typeof process.loadEnvFile === 'function') {
  try { process.loadEnvFile('.env'); } catch {}
}

export function handleRelayConnection(clientWs) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    console.error('[GeminiRelay] GEMINI_API_KEY is missing on server!');
    if (clientWs.readyState === clientWs.OPEN) {
      clientWs.send(JSON.stringify({
        type: 'error',
        message: 'GEMINI_API_KEY is missing on server. Please configure .env file.'
      }));
    }
    clientWs.close();
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemPrompt = typeof buildSystemInstruction === 'function'
    ? buildSystemInstruction()
    : 'You are Mo.';

  let geminiSession = null;
  let isClosed = false;

  async function startSession() {
    try {
      geminiSession = await ai.live.connect({
        model: CONFIG.GEMINI_MODEL,
        config: {
          responseModalities: ['AUDIO'],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: CONFIG.VOICE_NAME },
            },
          },
          inputAudioTranscription:  {},
          outputAudioTranscription: {},
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
          onopen: () => {
            // Note: SDK triggers onopen before initial setup completes.
          },
          onmessage: (msg) => {
            if (isClosed || clientWs.readyState !== clientWs.OPEN) return;
            const sc = msg?.serverContent;
            if (!sc) return;

            // Audio chunks
            for (const part of sc.modelTurn?.parts ?? []) {
              const b64 = part.inlineData?.data;
              if (b64) {
                clientWs.send(JSON.stringify({ type: 'audio', data: b64 }));
              }
            }

            // Mo's transcript
            const outText = sc.outputTranscription?.text;
            if (outText) {
              clientWs.send(JSON.stringify({ type: 'output_transcript', text: outText }));
            }

            // Customer's transcript
            const inText = sc.inputTranscription?.text;
            if (inText) {
              clientWs.send(JSON.stringify({ type: 'input_transcript', text: inText }));
            }

            // Interruption
            if (sc.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }

            // Turn complete
            if (sc.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turn_complete' }));
            }
          },
          onerror: (err) => {
            console.error('[GeminiRelay] Google session error:', err);
            if (!isClosed && clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'error',
                message: err?.message || String(err)
              }));
            }
          },
          onclose: (ev) => {
            console.log(`[GeminiRelay] Google session closed code=${ev?.code} reason=${ev?.reason}`);
            if (!isClosed && clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'close',
                code: ev?.code,
                reason: ev?.reason
              }));
              clientWs.close();
            }
          },
        },
      });

      console.log(`[GeminiRelay] Connected to Google Live ✓ model=${CONFIG.GEMINI_MODEL}`);
      if (!isClosed && clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify({ type: 'open' }));
      }
    } catch (err) {
      console.error('[GeminiRelay] Failed to connect to Google Live:', err);
      if (!isClosed && clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify({
          type: 'error',
          message: err?.message || 'Failed to connect to Gemini Live'
        }));
        clientWs.close();
      }
    }
  }

  startSession();

  clientWs.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (!geminiSession) return;

      if (msg.type === 'audio' && msg.data) {
        geminiSession.sendRealtimeInput({
          audio: {
            data:     msg.data,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      } else if (msg.type === 'text' && msg.text) {
        geminiSession.sendClientContent({
          turns: [{ role: 'user', parts: [{ text: msg.text }] }],
          turnComplete: true,
        });
      }
    } catch (err) {
      console.warn('[GeminiRelay] Error handling client message:', err);
    }
  });

  clientWs.on('close', () => {
    isClosed = true;
    try { geminiSession?.close(); } catch {}
    geminiSession = null;
    console.log('[GeminiRelay] Client disconnected — Gemini session closed');
  });

  clientWs.on('error', (err) => {
    console.warn('[GeminiRelay] Client socket error:', err);
  });
}
