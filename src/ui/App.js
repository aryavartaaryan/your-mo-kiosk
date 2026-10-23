// src/ui/App.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Kiosk UI Shell v8.0 — Syracuse University Flagship Edition
// Ultra-Premium US QSR Collegiate Kiosk:
//   • Enlarged, human-sized 3D Mo avatar stage (min(58vh, 520px))
//   • Symmetrical side wings: 2 action cards on left, 2 action cards on right
//   • Iconic circular tactile "Tap to Talk" pulsating orb button
//   • Elevated Syracuse University campus flagship branding
//   • Floating glassmorphism dialogue capsule with dancing soundwave equalizer
//   • Slide-out Menu Board drawer for live price and food browsing
// ─────────────────────────────────────────────────────────────────────────────

import { CONFIG } from '../config.js';

function injectStyles(colors) {
  const css = /* css */`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Space+Grotesk:wght@700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --c-primary:        ${colors.primary};
      --c-secondary:      ${colors.secondary};
      --c-accent:         ${colors.accent};
      --c-bg:             #041210;
      --c-surface:        #08221E;
      --c-surface-glass:  rgba(8, 32, 28, 0.88);
      --c-card-glass:     rgba(10, 36, 32, 0.82);
      --c-text:           ${colors.text};
      --c-muted:          ${colors.textMuted};
      --font-display:     'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
      --font-ui:          'Plus Jakarta Sans', system-ui, sans-serif;
    }

    html, body {
      width: 100vw; height: 100vh;
      margin: 0; padding: 0;
      overflow: hidden;
      background: var(--c-bg);
      color: var(--c-text);
      font-family: var(--font-ui);
      -webkit-font-smoothing: antialiased;
      user-select: none;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #app {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      width: 100vw;
      height: 100vh;
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at 50% 36%, #0B2F2A 0%, #041210 74%);
    }

    /* ── Ambient Radial Warmth Behind Mascot ── */
    #bg-spotlight {
      position: absolute;
      top: 36%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(78vh, 660px);
      height: min(78vh, 660px);
      background: radial-gradient(circle,
        rgba(255, 106, 0, 0.17) 0%,
        rgba(119, 185, 63, 0.08) 46%,
        transparent 72%
      );
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      animation: ambient-breathe 7s ease-in-out infinite alternate;
    }
    @keyframes ambient-breathe {
      0%   { transform: translate(-50%, -50%) scale(0.96); opacity: 0.85; }
      100% { transform: translate(-50%, -50%) scale(1.06); opacity: 1; }
    }

    /* ── Floating Food-Kiosk Embers ── */
    .kiosk-ember {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      animation: ember-float linear infinite;
    }
    @keyframes ember-float {
      0%   { transform: translateY(0) scale(1); opacity: 0.75; }
      50%  { opacity: 0.35; }
      100% { transform: translateY(-105vh) scale(0.2); opacity: 0; }
    }

    /* ── Header: Elevated Campus Flagship Identity ── */
    #header {
      position: relative; z-index: 30;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 42px 0;
      flex-shrink: 0;
    }

    #brand-lockup {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    #brand-emblem {
      width: 48px; height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FF8030 0%, #D84200 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px;
      box-shadow: 0 4px 22px rgba(255, 106, 0, 0.55), inset 0 1px 1px rgba(255,255,255,0.4);
    }

    #brand-text-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    #brand-name {
      font-size: clamp(22px, 2.4vw, 28px);
      font-weight: 900;
      letter-spacing: 2.4px;
      color: #FFF;
      line-height: 1;
      font-family: var(--font-display);
      text-shadow: 0 2px 24px rgba(255,106,0,0.45);
    }

    #brand-sub {
      font-size: 11px;
      color: var(--c-primary);
      font-weight: 800;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    #brand-sub span {
      color: rgba(255,255,255,0.45);
      font-weight: 700;
    }

    #header-nav {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #menu-board-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 9px 20px;
      border-radius: 99px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.14);
      color: #FFF;
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 0.5px;
      cursor: pointer;
      backdrop-filter: blur(12px);
      transition: all 0.22s ease;
    }
    #menu-board-btn:hover {
      background: rgba(255, 106, 0, 0.20);
      border-color: var(--c-primary);
      color: var(--c-primary);
    }

    #status-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 22px;
      border-radius: 99px;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: var(--c-surface-glass);
      border: 1px solid rgba(255,255,255,0.12);
      backdrop-filter: blur(12px);
      color: var(--c-muted);
      transition: all 0.35s ease;
      box-shadow: 0 4px 18px rgba(0,0,0,0.3);
    }
    #status-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: currentColor;
    }
    #status-pill.state-idle      { color: var(--c-muted); }
    #status-pill.state-listening {
      color: #FF8A30;
      border-color: #FF8A30;
      background: rgba(255, 106, 0, 0.16);
      box-shadow: 0 0 24px rgba(255, 106, 0, 0.4);
    }
    #status-pill.state-listening #status-dot {
      animation: dot-pulse 0.9s ease-in-out infinite;
    }
    #status-pill.state-talking   {
      color: #72CC38;
      border-color: #72CC38;
      background: rgba(114, 204, 56, 0.18);
      box-shadow: 0 0 24px rgba(114, 204, 56, 0.35);
    }
    #status-pill.state-talking #status-dot {
      animation: dot-pulse 0.8s ease-in-out infinite;
    }
    @keyframes dot-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(0.4); opacity: 0.25; }
    }

    /* ── Main Stage Area: Symmetrical Side Wings + Larger Human Avatar ── */
    #kiosk-main-stage {
      position: relative; z-index: 10;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 1140px;
      padding: 0 32px;
      margin: -4px 0 0;
      min-height: 0;
    }

    /* Side Flanking Action Wings */
    .action-wing {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 250px;
      flex-shrink: 0;
      z-index: 15;
    }
    .action-wing-left  { align-items: flex-end; }
    .action-wing-right { align-items: flex-start; }

    .action-wing-card {
      width: 100%;
      background: var(--c-card-glass);
      border: 1.5px solid rgba(255, 106, 0, 0.28);
      border-radius: 18px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 28px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1);
      transition: all 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-align: left;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .action-wing-card:hover {
      background: rgba(18, 56, 50, 0.96);
      border-color: var(--c-primary);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 34px rgba(255, 106, 0, 0.42);
    }
    .action-wing-card:active {
      transform: translateY(1px) scale(0.97);
    }

    .wing-card-icon {
      width: 42px; height: 42px;
      border-radius: 12px;
      background: rgba(255, 106, 0, 0.14);
      border: 1px solid rgba(255, 106, 0, 0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .wing-card-text {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .wing-card-title {
      font-size: 13.5px;
      font-weight: 800;
      color: #FFF;
      letter-spacing: 0.3px;
    }
    .wing-card-sub {
      font-size: 11px;
      font-weight: 600;
      color: var(--c-muted);
      letter-spacing: 0.3px;
    }

    /* Central Character Stage: Now Substantially Enlarged & Imposing */
    #stage-area {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
      height: 100%;
    }

    #mo-container {
      width: min(58vh, 520px);
      height: min(58vh, 520px);
      position: relative; z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ── Floating Comic Speech Capsule ── */
    #speech-capsule-area {
      position: relative; z-index: 25;
      width: min(680px, 92vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      margin: 0 auto 10px;
    }

    #speech-capsule {
      position: relative;
      background: var(--c-surface-glass);
      border: 1.5px solid rgba(255, 106, 0, 0.38);
      border-radius: 24px;
      padding: 12px 28px;
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      box-shadow: 0 12px 42px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.12);
      backdrop-filter: blur(18px);
      transition: all 0.25s ease;
    }
    #speech-capsule::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 10px solid transparent;
      border-bottom-color: var(--c-primary);
      margin-bottom: -1px;
    }
    #speech-capsule::after {
      content: '';
      position: absolute;
      bottom: calc(100% - 2px);
      left: 50%;
      transform: translateX(-50%);
      border: 9px solid transparent;
      border-bottom-color: rgba(8, 32, 28, 0.98);
    }

    #speech-text {
      flex: 1;
      text-align: center;
      font-size: clamp(15px, 1.7vw, 17px);
      font-weight: 700;
      line-height: 1.45;
      color: #FFF;
      transition: opacity 0.2s ease;
    }
    #speech-capsule.speaking {
      border-color: #72CC38;
      box-shadow: 0 12px 42px rgba(0,0,0,0.55), 0 0 28px rgba(114, 204, 56, 0.35);
    }

    /* Soundwave Equalizer Indicator */
    .audio-eq-wave {
      display: flex;
      align-items: center;
      gap: 3.5px;
      height: 20px;
    }
    .eq-bar {
      width: 3.5px;
      height: 6px;
      border-radius: 99px;
      background: var(--c-primary);
      transition: height 0.15s ease;
    }
    #speech-capsule.speaking .eq-bar {
      background: #72CC38;
      animation: eq-pulse 0.6s ease-in-out infinite alternate;
    }
    #speech-capsule.speaking .eq-bar:nth-child(1) { animation-delay: 0.1s; }
    #speech-capsule.speaking .eq-bar:nth-child(2) { animation-delay: 0.25s; }
    #speech-capsule.speaking .eq-bar:nth-child(3) { animation-delay: 0.4s; }
    #speech-capsule.speaking .eq-bar:nth-child(4) { animation-delay: 0.15s; }
    @keyframes eq-pulse {
      0%   { height: 5px; }
      100% { height: 20px; }
    }

    #user-sub-caption {
      font-size: 13px;
      color: var(--c-muted);
      text-align: center;
      padding: 5px 20px 0;
      width: 100%;
      min-height: 20px;
      opacity: 0;
      transition: opacity 0.3s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-style: italic;
    }
    #user-sub-caption.visible { opacity: 1; }

    /* ── Bottom Section: Iconic Circular Tap-to-Talk Orb ── */
    #bottom-kiosk-bar {
      position: relative; z-index: 25;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 0 24px 22px;
      flex-shrink: 0;
      width: 100%;
      max-width: 880px;
      margin: 0 auto;
    }

    #talk-orb-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      position: relative;
    }

    /* Ambient Pulsing Wave Rings Behind the Orb */
    .orb-pulse-ring {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 1.5px solid rgba(255, 106, 0, 0.35);
      pointer-events: none;
      z-index: 1;
    }
    .orb-pulse-ring.ring-1 {
      width: 104px; height: 104px;
      animation: ring-expand 3s ease-out infinite;
    }
    .orb-pulse-ring.ring-2 {
      width: 122px; height: 122px;
      animation: ring-expand 3s ease-out infinite 1.2s;
    }
    @keyframes ring-expand {
      0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0.7; }
      100% { transform: translate(-50%, -50%) scale(1.22); opacity: 0; }
    }

    #talk-cta-btn {
      position: relative; z-index: 2;
      width: 82px; height: 82px;
      border-radius: 50%;
      border: 2.5px solid rgba(255, 255, 255, 0.35);
      background: radial-gradient(circle at 35% 30%, #FF9944 0%, var(--c-primary) 55%, #B83500 100%);
      color: white;
      cursor: pointer;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 10px 36px rgba(255, 106, 0, 0.65),
        0 2px 8px rgba(0,0,0,0.5),
        inset 0 2px 4px rgba(255,255,255,0.6),
        inset 0 -3px 6px rgba(0,0,0,0.4);
      transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    #talk-cta-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 14px 48px rgba(255, 106, 0, 0.85), inset 0 2px 6px rgba(255,255,255,0.7);
    }
    #talk-cta-btn:active {
      transform: scale(0.95);
    }

    #talk-cta-btn svg {
      width: 36px; height: 36px;
      fill: #FFF;
      filter: drop-shadow(0 2px 5px rgba(0,0,0,0.4));
      transition: transform 0.2s ease;
    }
    #talk-cta-btn:hover svg {
      transform: scale(1.08);
    }

    /* Listening state: transitions to glowing red/pulse */
    #talk-cta-btn.listening {
      background: radial-gradient(circle at 35% 30%, #FF5A5A 0%, #D81616 65%, #9E0000 100%);
      border-color: rgba(255,255,255,0.6);
      box-shadow: 0 0 45px rgba(230, 25, 25, 0.85);
      animation: orb-speaking-pulse 1.2s ease-in-out infinite;
    }
    @keyframes orb-speaking-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 35px rgba(230, 25, 25, 0.7); }
      50%       { transform: scale(1.07); box-shadow: 0 0 60px rgba(230, 25, 25, 0.95); }
    }

    #talk-cta-label-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      user-select: none;
    }
    #talk-cta-label {
      font-size: 13.5px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #FFF;
      font-family: var(--font-display);
      text-shadow: 0 2px 10px rgba(0,0,0,0.6);
    }
    #talk-cta-sub {
      font-size: 11px;
      font-weight: 600;
      color: var(--c-muted);
      letter-spacing: 0.5px;
    }

    /* Responsive Adaptation for Tablets / Narrow Screens */
    @media (max-width: 960px) {
      #kiosk-main-stage {
        flex-direction: column;
        padding: 0 16px;
      }
      .action-wing {
        flex-direction: row;
        width: 100%;
        justify-content: center;
      }
      .action-wing-left, .action-wing-right {
        align-items: center;
      }
      .action-wing-card {
        width: auto;
        min-width: 180px;
      }
      #mo-container {
        width: min(44vh, 380px);
        height: min(44vh, 380px);
      }
    }

    /* ── Slide-Out Menu Board Drawer ── */
    #menu-drawer {
      position: fixed;
      top: 0; right: -420px;
      width: 400px; height: 100vh;
      background: rgba(6, 21, 19, 0.98);
      backdrop-filter: blur(20px);
      border-left: 2px solid rgba(255, 106, 0, 0.35);
      z-index: 2000;
      padding: 26px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: -15px 0 50px rgba(0,0,0,0.85);
      transition: right 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow-y: auto;
    }
    #menu-drawer.open { right: 0; }

    .menu-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 12px;
    }
    .menu-drawer-header h2 {
      font-size: 19px;
      font-family: var(--font-display);
      color: var(--c-primary);
    }
    .drawer-close-btn {
      background: none; border: none;
      color: var(--c-muted);
      font-size: 22px; cursor: pointer;
    }
    .menu-category-block {
      background: rgba(10, 36, 32, 0.75);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      padding: 12px 16px;
    }
    .menu-cat-title {
      font-size: 13px; font-weight: 800; color: var(--c-secondary);
      margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px;
    }
    .menu-item-row {
      display: flex; justify-content: space-between;
      font-size: 13px; font-weight: 600; padding: 5px 0;
      border-bottom: 1px dashed rgba(255,255,255,0.06);
    }
    .menu-item-row:last-child { border-bottom: none; }
    .item-price { color: var(--c-primary); font-weight: 800; }

    /* ── Studio Debug Panel (Press 'D') ── */
    #debug-panel {
      position: fixed; top: 16px; right: 16px;
      z-index: 3000;
      background: rgba(6, 20, 18, 0.98);
      backdrop-filter: blur(18px);
      border: 1.5px solid rgba(255, 106, 0, 0.4);
      border-radius: 22px;
      padding: 18px;
      width: 320px;
      max-height: 92vh;
      overflow-y: auto;
      display: none;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 12px 60px rgba(0,0,0,0.85);
    }
    #debug-panel.open { display: flex; }
    #debug-panel h3 {
      font-size: 13px; font-weight: 900; letter-spacing: 1.4px;
      text-transform: uppercase; color: var(--c-primary);
      display: flex; align-items: center; justify-content: space-between;
    }
    .debug-row { display: flex; gap: 5px; flex-wrap: wrap; }
    .dbg-btn {
      flex: 1; min-width: 0;
      padding: 7px 9px;
      border-radius: 9px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      color: var(--c-text);
      font-size: 11px; font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap; text-align: center;
    }
    .dbg-btn:hover { background: rgba(255,255,255,0.15); }
    .dbg-btn.active {
      background: rgba(255, 106, 0, 0.28);
      border-color: var(--c-primary);
      color: var(--c-primary);
    }
    .debug-label {
      font-size: 11px; color: var(--c-muted);
      font-weight: 800; letter-spacing: 0.8px;
      text-transform: uppercase; margin-top: 3px;
    }
    #debug-latency-val {
      font-size: 24px; font-weight: 900; color: var(--c-primary);
      text-align: center; font-family: var(--font-display);
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

function buildHTML(config) {
  const embers = [
    { left: '10%',  bottom: '12%', size: '4.5px', col: '#FF6A00', dur: '7s',   delay: '0s'   },
    { left: '26%',  bottom: '8%',  size: '3px',   col: '#FF8A30', dur: '9s',   delay: '2s'   },
    { left: '42%',  bottom: '6%',  size: '2.5px', col: '#FFD060', dur: '6.5s', delay: '3.5s' },
    { left: '58%',  bottom: '16%', size: '5px',   col: '#FF6A00', dur: '5.5s', delay: '1s'   },
    { left: '74%',  bottom: '10%', size: '3.5px', col: '#FF8A30', dur: '8s',   delay: '2.8s' },
    { left: '88%',  bottom: '14%', size: '4.5px', col: '#FF6A00', dur: '8.5s', delay: '0.5s' },
  ].map(e =>
    `<div class="kiosk-ember" style="left:${e.left};bottom:${e.bottom};width:${e.size};height:${e.size};background:${e.col};animation-duration:${e.dur};animation-delay:${e.delay};box-shadow:0 0 8px ${e.col};"></div>`
  ).join('');

  return /* html */`
    <div id="app">
      <div id="bg-spotlight"></div>
      ${embers}

      <!-- Header: Elevated Campus Flagship Branding -->
      <header id="header">
        <div id="brand-lockup">
          <div id="brand-emblem">🔥</div>
          <div id="brand-text-group">
            <span id="brand-name">${config.restaurantName.toUpperCase()}</span>
            <span id="brand-sub">SYRACUSE CAMPUS <span>• UNIVERSITY AVE • 100% ZABIHA</span></span>
          </div>
        </div>

        <div id="header-nav">
          <button id="menu-board-btn">📋&nbsp; Menu Board</button>
          <div id="status-pill" class="state-idle">
            <span id="status-dot"></span>
            <span id="status-text">Idle</span>
          </div>
        </div>
      </header>

      <!-- Main Stage: Symmetrical Side Wings + Larger Human-Size 3D Mo Avatar -->
      <section id="kiosk-main-stage">
        <!-- Left Action Wing (2 Buttons) -->
        <aside class="action-wing action-wing-left">
          <button class="action-wing-card" data-prompt="I have an exam tomorrow.">
            <div class="wing-card-icon">🎓</div>
            <div class="wing-card-text">
              <span class="wing-card-title">Cramming for Finals</span>
              <span class="wing-card-sub">Heavy Fuel Platter</span>
            </div>
          </button>
          <button class="action-wing-card" data-prompt="What should I order?">
            <div class="wing-card-icon">🍗</div>
            <div class="wing-card-text">
              <span class="wing-card-title">What's Hitting Today?</span>
              <span class="wing-card-sub">Mo's Signature Pick</span>
            </div>
          </button>
        </aside>

        <!-- Central Mascot Stage (Noticeably Larger Scale) -->
        <main id="stage-area">
          <div id="mo-container"></div>
        </main>

        <!-- Right Action Wing (2 Buttons) -->
        <aside class="action-wing action-wing-right">
          <button class="action-wing-card" data-prompt="I brought the whole squad.">
            <div class="wing-card-icon">👥</div>
            <div class="wing-card-text">
              <span class="wing-card-title">Pulled Up with Squad</span>
              <span class="wing-card-sub">HolicBucket 5-in-1</span>
            </div>
          </button>
          <button class="action-wing-card" data-prompt="I'm running late to class, what's quick?">
            <div class="wing-card-icon">🏃</div>
            <div class="wing-card-text">
              <span class="wing-card-title">Late to Class</span>
              <span class="wing-card-sub">Speed Gyro Wrap</span>
            </div>
          </button>
        </aside>
      </section>

      <!-- Floating Comic Speech Capsule -->
      <section id="speech-capsule-area">
        <div id="speech-capsule">
          <div class="audio-eq-wave">
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
          </div>
          <div id="speech-text">${config.character.idleCaption}</div>
          <div class="audio-eq-wave">
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
          </div>
        </div>
        <div id="user-sub-caption"></div>
      </section>

      <!-- Bottom Console: Iconic Circular Tactile Tap-to-Talk Orb -->
      <div id="bottom-kiosk-bar">
        <div id="talk-orb-container">
          <div class="orb-pulse-ring ring-1"></div>
          <div class="orb-pulse-ring ring-2"></div>
          
          <button id="talk-cta-btn" aria-label="Tap to talk with Mo">
            <svg viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>

          <div id="talk-cta-label-group">
            <span id="talk-cta-label">TAP TO TALK WITH MO</span>
            <span id="talk-cta-sub">TOUCH OR CLICK TO SPEAK</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide-Out Menu Drawer -->
    <div id="menu-drawer">
      <div class="menu-drawer-header">
        <h2>🔥 Halalholic Menu</h2>
        <button class="drawer-close-btn" id="drawer-close-btn">✕</button>
      </div>

      <div class="menu-category-block">
        <div class="menu-cat-title">Platters Over Rice (Choice of 2 Sides)</div>
        <div class="menu-item-row"><span>Chicken Dose</span><span class="item-price">$9.99</span></div>
        <div class="menu-item-row"><span>Lamb Dose</span><span class="item-price">$9.99</span></div>
        <div class="menu-item-row"><span>Mix Combo Dose</span><span class="item-price">$9.99</span></div>
        <div class="menu-item-row"><span>Falafel Dose</span><span class="item-price">$9.99</span></div>
        <div class="menu-item-row"><span>Make It Extra Holic</span><span class="item-price">+$3.00</span></div>
      </div>

      <div class="menu-category-block">
        <div class="menu-cat-title">Gyro Sandwiches (Speed Pick)</div>
        <div class="menu-item-row"><span>Chicken Gyro</span><span class="item-price">$7.99</span></div>
        <div class="menu-item-row"><span>Lamb Gyro</span><span class="item-price">$7.99</span></div>
        <div class="menu-item-row"><span>Mix Gyro</span><span class="item-price">$7.99</span></div>
        <div class="menu-item-row"><span>Falafel Gyro</span><span class="item-price">$7.99</span></div>
      </div>

      <div class="menu-category-block">
        <div class="menu-cat-title">⭐ HolicBucket (Squad Star)</div>
        <div class="menu-item-row"><span>Tenders, Boneless Wings, Fries, Mozz Sticks & Mac Bites</span><span class="item-price">$15.99</span></div>
      </div>

      <div class="menu-category-block">
        <div class="menu-cat-title">Wings & Tenders</div>
        <div class="menu-item-row"><span>6pc Wings</span><span class="item-price">$9.99</span></div>
        <div class="menu-item-row"><span>3pc Tenders</span><span class="item-price">$6.99</span></div>
        <div class="menu-item-row"><span>Combo: Fries & Drink</span><span class="item-price">+$2.99</span></div>
      </div>
    </div>

    <!-- Studio Debug Panel (Press 'D') -->
    <div id="debug-panel">
      <h3>⚡ Mo Living 3D Studio <span style="font-size:11px;color:#888;">ESC to close</span></h3>

      <div class="debug-label">Kiosk State</div>
      <div class="debug-row">
        <button class="dbg-btn active" data-state="idle">Idle</button>
        <button class="dbg-btn" data-state="listening">Listen</button>
        <button class="dbg-btn" data-state="thinking">Think</button>
        <button class="dbg-btn" data-state="talking">Talk</button>
      </div>

      <div class="debug-label">Organic Reactions</div>
      <div class="debug-row">
        <button class="dbg-btn" id="dbg-blink-btn">👁️ Blink Eyes</button>
        <button class="dbg-btn" id="dbg-laugh-btn">😂 Laugh Bounce</button>
      </div>

      <div class="debug-label">Audio Latency</div>
      <div id="debug-latency-val">-- ms</div>
    </div>
  `;
}

export class App {
  constructor(rootEl, deps) {
    this._root = rootEl;
    this._Mo   = deps.Mo;
    this._onTalkPress = null;
    this._onChipClick = null;
    this._captionTimer = null;

    injectStyles(CONFIG.colors);
    rootEl.innerHTML = buildHTML(CONFIG);

    this._captionEl     = document.getElementById('speech-text');
    this._capsuleEl     = document.getElementById('speech-capsule');
    this._userCaptionEl = document.getElementById('user-sub-caption');
    this._statusPillEl  = document.getElementById('status-pill');
    this._statusTextEl  = document.getElementById('status-text');
    this._talkBtn       = document.getElementById('talk-cta-btn');
    this._talkLabelEl   = document.getElementById('talk-cta-label');
    this._talkSubEl     = document.getElementById('talk-cta-sub');
    this._debugPanel    = document.getElementById('debug-panel');
    this._menuDrawer    = document.getElementById('menu-drawer');

    this._bindEvents();
  }

  get moContainer() { return document.getElementById('mo-container'); }

  onTalkPress(fn) { this._onTalkPress = fn; }
  onChipClick(fn) { this._onChipClick = fn; }

  setState(state) {
    const labels = { idle: 'Idle', listening: 'Listening…', thinking: 'Thinking…', talking: 'Speaking' };
    if (this._statusTextEl) this._statusTextEl.textContent = labels[state] || state;
    this._statusPillEl.className = `state-${state}`;

    const isActive = state !== 'idle';
    if (this._talkBtn) {
      this._talkBtn.classList.toggle('listening', state === 'listening');
      if (isActive) {
        this._talkLabelEl.textContent = state === 'listening' ? 'LISTENING TO YOU…' : 'MO IS SPEAKING';
        this._talkSubEl.textContent   = 'TOUCH TO STOP';
      } else {
        this._talkLabelEl.textContent = 'TAP TO TALK WITH MO';
        this._talkSubEl.textContent   = 'TOUCH OR CLICK TO SPEAK';
      }
    }

    this._capsuleEl?.classList.toggle('speaking', state === 'talking');

    document.querySelectorAll('[data-state]').forEach(b =>
      b.classList.toggle('active', b.dataset.state === state));
  }

  setCaption(text) {
    const el = this._captionEl;
    if (!el) return;
    el.style.opacity = '0';
    clearTimeout(this._captionTimer);
    this._captionTimer = setTimeout(() => {
      el.textContent = text;
      el.style.opacity = '1';
    }, 160);
  }

  setUserCaption(text) {
    const el = this._userCaptionEl;
    if (!el) return;
    el.textContent = text ? `You: "${text}"` : '';
    el.classList.toggle('visible', !!text);
  }

  clearUserCaption() { this.setUserCaption(''); }

  updateLatency(ms) {
    const el = document.getElementById('debug-latency-val');
    if (el) el.textContent = `${ms} ms`;
  }

  _bindEvents() {
    this._talkBtn.addEventListener('click', () => this._onTalkPress?.());

    // Symmetrical Action Cards (Left & Right Wings)
    document.querySelectorAll('.action-wing-card').forEach(card => {
      card.addEventListener('click', () => {
        card.style.transform = 'translateY(1px) scale(0.97)';
        setTimeout(() => { card.style.transform = ''; }, 200);
        this._onChipClick?.(card.dataset.prompt);
      });
    });

    // Menu Drawer Toggle
    const peekBtn  = document.getElementById('menu-board-btn');
    const closeBtn = document.getElementById('drawer-close-btn');
    peekBtn?.addEventListener('click', () => this._menuDrawer.classList.toggle('open'));
    closeBtn?.addEventListener('click', () => this._menuDrawer.classList.remove('open'));

    // Studio Debug Panel Toggle (Press 'D' or 'ESC')
    document.addEventListener('keydown', e => {
      if (e.key === 'd' || e.key === 'D') {
        this._debugPanel.classList.toggle('open');
      } else if (e.key === 'Escape') {
        this._debugPanel.classList.remove('open');
        this._menuDrawer.classList.remove('open');
      }
    });

    // Debug Triggers
    document.getElementById('dbg-blink-btn')?.addEventListener('click', () => {
      this._Mo.triggerBlink();
    });
    document.getElementById('dbg-laugh-btn')?.addEventListener('click', () => {
      this._Mo.triggerLaugh();
    });

    // Debug State triggers
    document.querySelectorAll('[data-state]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setState(btn.dataset.state);
        this._Mo.setState(btn.dataset.state);
      });
    });
  }
}
