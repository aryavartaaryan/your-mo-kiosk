// vite.config.js
// ─────────────────────────────────────────────────────────────────────────────
// Vite Configuration for Halalholic Mo Kiosk
// Integrates the secure Gemini Live WebSocket relay (/ws/live) directly into
// the Vite development server so dev mode has 100% protected credentials.
// ─────────────────────────────────────────────────────────────────────────────

import { defineConfig } from 'vite';
import { WebSocketServer } from 'ws';
import { handleRelayConnection } from './server/geminiRelay.js';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  css: {
    postcss: {},
  },
  plugins: [
    {
      name: 'gemini-live-relay',
      configureServer(server) {
        const wss = new WebSocketServer({ noServer: true });

        wss.on('connection', (ws) => {
          handleRelayConnection(ws);
        });

        server.httpServer?.on('upgrade', (req, socket, head) => {
          const url = new URL(req.url || '/', 'http://localhost');
          if (url.pathname === '/ws/live') {
            wss.handleUpgrade(req, socket, head, (ws) => {
              wss.emit('connection', ws, req);
            });
          }
        });

        console.log('[Vite] Protected Gemini Live relay mounted on /ws/live ✓');
      },
    },
  ],
});
