// src/config.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Mo — Central configuration.
// Edit this file to customise brand, menu, model and voice without touching
// any other source file.
// ─────────────────────────────────────────────────────────────────────────────

export const CONFIG = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  restaurantName: 'Halalholic',
  tagline:        'Hooked on Flavor',
  location:       'Syracuse, NY',

  // ── Brand colours (from official Halalholic model sheet) ──────────────────
  colors: {
    primary:     '#FF6A00',   // Halalholic Orange
    secondary:   '#5EA82A',   // Lettuce Green
    background:  '#0A1F0C',   // Deep dark green (kiosk bg)
    surface:     '#0E302E',   // Halalholic Dark Green (cards/panels)
    surfaceAlt:  '#122E1A',   // Slightly lighter surface
    text:        '#F7F3E9',   // Cream / Off White
    textMuted:   '#8FAF8A',   // Muted green-white
    glow:        '#FF6A00',   // Character glow (orange)
    accent:      '#72CC38',   // Bright lettuce for highlights
  },

  // ── Mo character defaults ─────────────────────────────────────────────────
  character: {
    defaultExpression: 'happy',
    defaultState:      'idle',
    idleCaption:       "Yo 'Cuse! I'm Mo. Half student, half pita wrap, full-time flavor legend. Tap below or shout your crave! 🔥",
  },

  // ── Gemini Live model ─────────────────────────────────────────────────────
  // gemini-3.1-flash-live-preview  ← confirmed available on your key (fastest)
  // gemini-2.0-flash-live-001      ← stable fallback
  GEMINI_MODEL: 'gemini-3.1-flash-live-preview',

  // ── Voice ─────────────────────────────────────────────────────────────────
  // Puck = upbeat, lively — best match for Mo's energy
  VOICE_NAME: 'Puck',

  // ── VAD (Voice Activity Detection) ───────────────────────────────────────
  VAD: {
    startOfSpeechSensitivity: 'START_SENSITIVITY_HIGH',
    endOfSpeechSensitivity:   'END_SENSITIVITY_HIGH',
    prefixPaddingMs:           200,
    silenceDurationMs:         500,
  },

  // ── Add-on pricing ───────────────────────────────────────────────────────
  EXTRA_HOLIC_PRICE: 3.00,   // "Make it Extra Holic" add-on

  // ── Full Halalholic Menu ──────────────────────────────────────────────────
  menu: {
    platters: {
      label: 'Platters',
      note: 'Comes with Mix Salad & Fries or Hummus',
      sauces: ['White', 'Hot', 'Green', 'BBQ', 'Chipotle'],
      items: [
        { name: 'Lamb Dose',       price: 9.99 },
        { name: 'Chicken Dose',    price: 9.99 },
        { name: 'Fish Dose',       price: 9.99 },
        { name: 'Falafel Dose',    price: 9.99 },
        { name: 'Kofta Dose',      price: 9.99 },
        { name: 'Mix Combo Dose',  price: 9.99 },
      ],
    },
    gyros: {
      label: 'Gyros',
      sauces: ['White', 'Hot', 'Green', 'BBQ', 'Chipotle'],
      items: [
        { name: 'Chicken Gyro',      price: 7.99 },
        { name: 'Lamb Gyro',         price: 7.99 },
        { name: 'Mix Gyro',          price: 7.99 },
        { name: 'Fish Gyro',         price: 7.99 },
        { name: 'Falafel Gyro',      price: 7.99 },
        { name: 'Chicken Kofta Gyro',price: 7.99 },
      ],
    },
    wings: {
      label: 'Wings',
      flavors: ['Hot', 'BBQ', 'Buffalo', 'Lemon Pepper', 'Mango Habanero'],
      sauces: ['White', 'Blue Cheese', 'Ranch'],
      items: [
        { name: '6 Pieces',  price: 9.99  },
        { name: '9 Pieces',  price: 12.99 },
        { name: '12 Pieces', price: 15.99 },
        { name: '20 Pieces', price: 23.99 },
      ],
    },
    tenders: {
      label: 'Tenders',
      sauces: ['White', 'Honey Mustard', 'BBQ', 'Chipotle'],
      deal: 'Add Fries & Drink for $2.99',
      items: [
        { name: '3 Pieces',  price: 6.99  },
        { name: '5 Pieces',  price: 9.99  },
        { name: '10 Pieces', price: 15.99 },
      ],
    },
    burgers: {
      label: 'Burgers & Sandwiches',
      deal: 'Add Fries & Drink for $2.99',
      items: [
        { name: 'Crispy Chicken Sandwich',       price: 6.99 },
        { name: 'Spicy Crispy Chicken Sandwich', price: 6.99 },
        { name: 'Grilled Chicken Sandwich',      price: 6.99 },
        { name: 'Spicy Grilled Chicken Sandwich',price: 6.99 },
        { name: 'Fish Sandwich',                  price: 6.99 },
        { name: 'Cheeseburger',                   price: 6.99 },
        { name: 'Double Cheeseburger',            price: 8.99 },
        { name: 'Baconator Only',                  price: 7.99 },
        { name: 'Heart Attack Burger',             price: 7.99 },
        { name: 'Chopped Cheese On Hero',          price: 9.99 },
        { name: 'Philly Cheesesteak On Hero',      price: 9.99 },
        { name: 'Chicken Cheesesteak On Hero',     price: 9.99 },
        { name: 'Chicken Cutlet On Hero',          price: 9.99 },
        { name: 'Pastrami On Hero',                price: 9.99 },
        { name: 'Turkey On Hero',                  price: 9.99 },
      ],
    },
    nuggets: {
      label: 'Nuggets',
      deal: 'Add Fries & Drink for $2.99',
      items: [
        { name: '6 Pieces',  price: 5.99  },
        { name: '12 Pieces', price: 8.99  },
        { name: '20 Pieces', price: 10.99 },
      ],
    },
    salads: {
      label: 'Salads',
      items: [
        { name: 'Garden Salad',         price: 8.99 },
        { name: 'Lamb Salad',           price: 9.99 },
        { name: 'Grilled Chicken Salad',price: 9.99 },
        { name: 'Fish Salad',           price: 9.99 },
      ],
    },
    sides: {
      label: 'Side Orders',
      items: [
        { name: 'Season Fries',      price: 4.99 },
        { name: 'Cheese Fries',      price: 5.99 },
        { name: 'Onion Rings',       price: 3.99 },
        { name: 'Mac N Cheese Bites',price: 4.99 },
        { name: 'Mozzarella Sticks', price: 6.99 },
        { name: 'Falafel Ball',      price: 0.75, unit: 'per pc' },
      ],
    },
    holicBucket: {
      label: 'HolicBucket — The Shareable Star',
      description: 'Chicken tenders, boneless wings, seasoned fries, mozzarella sticks, and mac bites',
      note: 'The go-to pick for friends, study groups, and squads',
    },
  },
};
