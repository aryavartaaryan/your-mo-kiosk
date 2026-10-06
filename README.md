# Your Mo 🍔

**An animated restaurant kiosk mascot powered by Gemini Live real-time voice.**

Mo listens, thinks, and speaks — in character — with his mouth animating in sync with his voice. No separate STT or TTS; it's all one Gemini Live audio session.

---

## Quick Start

### 1. Get a free Gemini API key

Go to **[Google AI Studio → Get API Key](https://aistudio.google.com/apikey)** and create a key.

### 2. Set up your environment

```bash
cd your-mo
cp .env.example .env
```

Open `.env` and paste your key:
```
VITE_GEMINI_API_KEY=AIza...your_key_here...
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** — tap "Tap to talk to Mo" and speak.

> **Tip:** Use a headset or earbuds to prevent echo feedback. The mic has echo cancellation enabled, but external speakers can still bleed into the mic on some hardware.

---

## Project Structure

```
your-mo/
├── index.html
├── .env.example          ← copy to .env and add your key
├── .gitignore
├── package.json
├── src/
│   ├── main.js           ← entry point; wires everything together
│   ├── config.js         ← restaurant name, colours, model, voice, menu
│   ├── character/
│   │   └── Mo.js         ← SVG mascot + spring animation engine
│   ├── ui/
│   │   └── App.js        ← kiosk layout, caption, button, debug panel
│   └── voice/
│       ├── gemini.js     ← Gemini Live WebSocket session manager
│       ├── audioInput.js ← mic capture → 16-bit PCM @ 16 kHz (AudioWorklet)
│       ├── audioOutput.js← streaming PCM playback @ 24 kHz (gapless queue)
│       ├── lipSync.js    ← RMS analyser → Mo.setMouthOpen()
│       └── personality.js← Mo's system instruction + menu
```

---

## Changing the Model

Edit `src/config.js`:

```js
GEMINI_MODEL: 'gemini-2.5-flash-native-audio-preview-12-2025',
```

**Available Live-capable models** (check [AI Studio](https://aistudio.google.com) for the latest):

| Model | Notes |
|-------|-------|
| `gemini-2.5-flash-native-audio-preview-12-2025` | Default; native speech-in/speech-out |
| `gemini-2.0-flash-live-001` | Stable, widely available on free tier |
| `gemini-2.5-flash-live-preview` | Latest preview; may require allowlist |

---

## Changing the Voice

Edit `src/config.js`:

```js
VOICE_NAME: 'Puck',   // upbeat, lively — default for Mo
```

**All available prebuilt voices:**

| Name | Character |
|------|-----------|
| **Puck** | Upbeat, lively, young — great for Mo |
| Charon | Calm, professional, deeper |
| Kore | Warm, friendly |
| Fenrir | Bold, energetic |
| Aoede | Clear, neutral |
| Zephyr | Light, gentle |

---

## Debug Panel

Press **D** on the keyboard. From the panel you can:

- Switch Mo between all four animation states instantly
- Toggle facial expressions (happy / smug / surprised)
- Drag the **Mouth Open** slider to preview lip shapes without voice
- Fire caption presets
- See the **Response Latency** — time from when you finish speaking to when Mo's first audio chunk arrives

---

## Mo's API (unchanged)

```js
import { Mo } from './src/character/Mo.js';

Mo.init(containerEl);              // inject SVG
Mo.start() / Mo.stop();            // animation loop

Mo.setState('idle' | 'listening' | 'thinking' | 'talking');
Mo.setExpression('happy' | 'smug' | 'surprised');
Mo.setMouthOpen(0.0 → 1.0);       // driven by lipSync.js
```

---

## Voice Integration — How It Works

```
Browser mic → AudioWorklet → Int16 PCM @ 16 kHz
  ↓  base64 encoded
Gemini Live WebSocket (gemini.js)
  ↓  base64 PCM @ 24 kHz + transcripts
audioOutput.js  →  AudioBufferSourceNode queue (gapless streaming)
  ↓  AnalyserNode
lipSync.js → RMS → Mo.setMouthOpen()
```

The voice layer hooks are in `src/main.js`. Every callback is a named function; you can inspect them in the browser DevTools console.

**Console debug helpers:**

```js
_mo.start()   // start a voice session programmatically
_mo.stop()    // stop the session
_mo.Mo        // direct access to the Mo character API
```

---

## Free-Tier Limits (as of mid-2025)

| Limit | Value |
|-------|-------|
| Requests per minute | 15 RPM |
| Tokens per minute | 1 000 000 TPM |
| Requests per day | 1 500 RPD |
| Live API session length | Up to 30 minutes |

Check [Google AI Studio → Plans](https://aistudio.google.com) for the latest limits.

---

## ⚠️ Production Security Warning

The API key is embedded in the browser bundle via Vite's `import.meta.env`. This means **anyone who views page source can find your key**.

For production, you must either:

1. **Move to a backend proxy** — your server holds the key, the browser talks to your server
2. **Use ephemeral tokens** — generate short-lived tokens server-side and send them to the browser
3. **Apply key restrictions** — in Google Cloud Console, restrict your key to specific HTTP referrers

See the [Gemini API key security guide](https://ai.google.dev/gemini-api/docs/api-key) for details.

---

## Manual Test Checklist

After running `npm run dev`, test each of these:

- [ ] Page loads with Mo animated and idle
- [ ] Tap "Talk to Mo" → mic permission prompt appears
- [ ] Allow mic → button turns red "Tap to stop", status badge shows "Listening"
- [ ] Speak a question ("what's on the menu?") → status shows "Thinking"
- [ ] Mo starts speaking → status shows "Talking", mouth moves with voice
- [ ] Customer caption ("You: what's on the menu?") appears below bubble
- [ ] Mo's transcript streams into the caption bubble while he talks
- [ ] When Mo finishes → status returns to "Listening"
- [ ] Interrupt Mo mid-sentence → he stops immediately, returns to Listening
- [ ] Tap "Tap to stop" → session closes, Mo returns to Idle state
- [ ] **Press D** → debug panel appears with all controls working
- [ ] Latency readout updates in the debug panel after first response
- [ ] Block mic permission (deny) → friendly error message in caption bubble
- [ ] Remove API key from `.env`, restart → clear error message on tap

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot-reload |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |

---

## Tech Stack

- **Vite 5** — zero-config dev + build
- **Vanilla JS ES modules** — no framework, no virtual DOM
- **@google/genai ≥ 2.0** — Gemini Live WebSocket via official SDK
- **AudioWorklet** — low-latency PCM capture at 16 kHz
- **Web Audio API** — gapless streaming playback at 24 kHz
- **Inline SVG + requestAnimationFrame** — Mo's spring-physics animation
