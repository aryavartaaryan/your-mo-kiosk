// src/config.js
// ─────────────────────────────────────────────────────────────────────────────
// Central configuration for the Your Mo kiosk.
// Edit these values to customise the restaurant, colours, menu, and AI model.
// ─────────────────────────────────────────────────────────────────────────────

export const CONFIG = {
  // ── Restaurant identity ───────────────────────────────────────────────────
  restaurantName: 'Burger Palace',
  tagline: 'Home of the legendary smash burger',

  // ── Brand colours ─────────────────────────────────────────────────────────
  colors: {
    primary:    '#FF6B35',
    secondary:  '#FFD700',
    background: '#0D0D12',
    surface:    '#1A1A24',
    text:       '#F5F5F5',
    textMuted:  '#8A8A9A',
    glow:       '#FF6B35',
  },

  // ── Mo character defaults ─────────────────────────────────────────────────
  character: {
    defaultExpression: 'happy',
    idleCaption: "Hi! Tap below to talk to me 👋",
  },

  // ── Gemini Live model ─────────────────────────────────────────────────────
  // gemini-3.1-flash-live-preview  ← fastest, lowest latency (recommended)
  // gemini-2.0-flash-live-001      ← stable fallback if above isn't available
  // gemini-2.5-flash-native-audio-preview-12-2025  ← original preview
  GEMINI_MODEL: 'gemini-3.1-flash-live-preview',

  // ── Voice selection ───────────────────────────────────────────────────────
  // Puck = upbeat & lively (best for Mo's personality)
  // Fenrir = bold & energetic | Charon = calm & deep | Kore = warm & friendly
  VOICE_NAME: 'Puck',

  // ── VAD (Voice Activity Detection) ───────────────────────────────────────
  // Controls how quickly Mo detects you've stopped speaking.
  // Lower silenceDurationMs = faster response, but may cut you off mid-thought.
  VAD: {
    startOfSpeechSensitivity: 'START_SENSITIVITY_HIGH',
    endOfSpeechSensitivity:   'END_SENSITIVITY_HIGH',
    prefixPaddingMs:           200,   // ms of audio kept before speech starts
    silenceDurationMs:         500,   // ms of silence → end of speech trigger
  },

  // ── Menu ─────────────────────────────────────────────────────────────────
  menu: [
    { id: 'smash-burger',   name: 'Smash Burger',    price: 9.99,  category: 'burgers' },
    { id: 'double-smash',   name: 'Double Smash',    price: 13.99, category: 'burgers' },
    { id: 'crispy-chicken', name: 'Crispy Chicken',  price: 10.99, category: 'burgers' },
    { id: 'loaded-fries',   name: 'Loaded Fries',    price: 5.99,  category: 'sides'   },
    { id: 'onion-rings',    name: 'Onion Rings',     price: 4.99,  category: 'sides'   },
    { id: 'vanilla-shake',  name: 'Vanilla Shake',   price: 4.49,  category: 'drinks'  },
    { id: 'choc-shake',     name: 'Chocolate Shake', price: 4.49,  category: 'drinks'  },
    { id: 'lemonade',       name: 'Fresh Lemonade',  price: 3.49,  category: 'drinks'  },
  ],
};
