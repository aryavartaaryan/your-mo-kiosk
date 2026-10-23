// src/ui/App.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Mo — Kiosk UI Shell v3.0
// Extraordinary client-ready MVP with:
//   • Rich animated brand background (multi-layer gradient + floating embers)
//   • Full-bleed stage glow that pulses in sync with Mo's voice
//   • Premium caption bubble with smooth animated typewriter feel
//   • Interactive Quick Demo Chips for client presentations
//   • Perfectly centered layout on all screen sizes (mobile → 4K desktop)
// ─────────────────────────────────────────────────────────────────────────────

import { CONFIG } from '../config.js';

function injectStyles(colors) {
  const css = /* css */`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --c-primary:    ${colors.primary};
      --c-secondary:  ${colors.secondary};
      --c-accent:     ${colors.accent};
      --c-bg:         ${colors.background};
      --c-surface:    ${colors.surface};
      --c-surface2:   ${colors.surfaceAlt};
      --c-text:       ${colors.text};
      --c-muted:      ${colors.textMuted};
      --c-glow:       ${colors.glow};
    }

    html, body {
      width: 100vw; height: 100vh;
      margin: 0; padding: 0;
      overflow: hidden;
      background: var(--c-bg);
      color: var(--c-text);
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ══════════════════════════════════════════════════
       APP SHELL — Full-viewport centered column layout
       ══════════════════════════════════════════════════ */
    #app {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      width: 100vw;
      height: 100vh;
      position: relative;
      overflow: hidden;
    }

    /* ══════════════════════════════════════════════════
       ANIMATED BACKGROUND LAYERS
       ══════════════════════════════════════════════════ */
    #bg-base {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 50% 60%,
          color-mix(in srgb, #FF6A00 13%, transparent) 0%,
          color-mix(in srgb, #0A1F0C 40%, transparent) 55%,
          transparent 80%
        ),
        radial-gradient(ellipse 50% 50% at 20% 20%,
          color-mix(in srgb, #72CC38 6%, transparent) 0%,
          transparent 60%
        ),
        radial-gradient(ellipse 50% 50% at 80% 80%,
          color-mix(in srgb, #FF6A00 5%, transparent) 0%,
          transparent 60%
        );
      pointer-events: none; z-index: 0;
      animation: bg-breathe 8s ease-in-out infinite;
    }
    @keyframes bg-breathe {
      0%, 100% { opacity: 0.9; }
      50%       { opacity: 1; }
    }

    #bg-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(color-mix(in srgb, var(--c-primary) 4%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--c-primary) 4%, transparent) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none; z-index: 0;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
    }

    /* ── Floating Embers ── */
    .ember {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      animation: ember-rise linear infinite;
    }
    @keyframes ember-rise {
      0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.8; }
      50%  { opacity: 0.4; }
      100% { transform: translateY(-100vh) scale(0.2) rotate(360deg); opacity: 0; }
    }

    /* ══════════════════════════════════════════════════
       HEADER
       ══════════════════════════════════════════════════ */
    #header {
      position: relative; z-index: 20;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 32px 0;
      flex-shrink: 0;
    }

    #logo-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #logo-icon {
      width: 48px; height: 48px;
      border-radius: 14px;
      background: linear-gradient(145deg, #FF8030, #D64200);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
      box-shadow:
        0 4px 24px color-mix(in srgb, var(--c-primary) 60%, transparent),
        0 0 0 1px rgba(255,255,255,0.08);
    }

    #header-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    #restaurant-name {
      font-size: clamp(19px, 2.4vw, 26px);
      font-weight: 900;
      letter-spacing: 2px;
      color: var(--c-primary);
      line-height: 1;
      font-family: 'Arial Black', 'Inter', Impact, sans-serif;
      text-shadow: 0 0 30px color-mix(in srgb, var(--c-primary) 55%, transparent);
    }

    #tagline {
      font-size: clamp(10px, 1.2vw, 13px);
      color: var(--c-secondary);
      font-weight: 600;
      letter-spacing: 0.5px;
      font-style: italic;
    }

    #status-badge {
      margin-left: auto;
      padding: 7px 20px;
      border-radius: 99px;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: var(--c-surface);
      border: 1px solid rgba(255,255,255,0.08);
      color: var(--c-muted);
      transition: all 0.4s ease;
    }
    #status-badge::before {
      content: '';
      display: inline-block;
      width: 7px; height: 7px;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.3s;
    }
    #status-badge.state-idle      { color: var(--c-muted); }
    #status-badge.state-listening {
      color: var(--c-primary);
      border-color: color-mix(in srgb, var(--c-primary) 50%, transparent);
      background: color-mix(in srgb, var(--c-primary) 10%, var(--c-surface));
    }
    #status-badge.state-thinking  {
      color: #FFD060;
      border-color: color-mix(in srgb, #FFD060 50%, transparent);
      background: color-mix(in srgb, #FFD060 10%, var(--c-surface));
    }
    #status-badge.state-talking   {
      color: var(--c-secondary);
      border-color: color-mix(in srgb, var(--c-secondary) 50%, transparent);
      background: color-mix(in srgb, var(--c-secondary) 10%, var(--c-surface));
    }
    #status-badge.state-listening::before,
    #status-badge.state-thinking::before,
    #status-badge.state-talking::before {
      opacity: 1;
      animation: pulse-dot 1s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.3; transform: scale(0.5); }
    }

    /* ══════════════════════════════════════════════════
       CHARACTER STAGE
       ══════════════════════════════════════════════════ */
    #stage {
      position: relative; z-index: 10;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 0;
      overflow: visible;
    }

    /* Multi-ring glow system */
    #stage-glow-outer {
      position: absolute;
      width: min(72vh, 600px);
      height: min(72vh, 600px);
      border-radius: 50%;
      background: radial-gradient(circle,
        color-mix(in srgb, var(--c-glow) 8%, transparent) 0%,
        transparent 65%
      );
      pointer-events: none;
      animation: glow-outer 4s ease-in-out infinite;
    }
    @keyframes glow-outer {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50%       { transform: scale(1.12); opacity: 1; }
    }

    #stage-glow {
      position: absolute;
      width: min(52vh, 440px);
      height: min(52vh, 440px);
      border-radius: 50%;
      background: radial-gradient(circle,
        color-mix(in srgb, var(--c-glow) 26%, transparent) 0%,
        transparent 68%
      );
      pointer-events: none;
      animation: glow-inner 3s ease-in-out infinite;
      transition: all 0.5s ease;
    }
    @keyframes glow-inner {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50%       { opacity: 1; transform: scale(1.06); }
    }
    #stage-glow.talking {
      background: radial-gradient(circle,
        color-mix(in srgb, var(--c-glow) 42%, transparent) 0%,
        transparent 70%
      );
      transform: scale(1.2);
    }

    /* Ground shadow ring under Mo's feet */
    #stage-floor {
      position: absolute;
      bottom: calc(50% - min(31vh, 260px));
      width: min(34vh, 280px);
      height: 22px;
      background: radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 72%);
      border-radius: 50%;
      pointer-events: none;
    }

    #mo-container {
      width: min(65vh, 540px);
      height: min(65vh, 540px);
      position: relative; z-index: 2;
      filter: drop-shadow(0 20px 48px rgba(0,0,0,0.6));
    }

    /* ══════════════════════════════════════════════════
       CAPTION AREA
       ══════════════════════════════════════════════════ */
    #caption-area {
      position: relative; z-index: 20;
      width: min(640px, 90vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      margin: 0 auto 10px;
    }

    #caption-bubble {
      position: relative;
      background: var(--c-surface);
      border: 1px solid color-mix(in srgb, var(--c-primary) 35%, transparent);
      border-left: 4px solid var(--c-primary);
      border-radius: 22px;
      padding: 14px 26px;
      text-align: center;
      font-size: clamp(14px, 1.7vw, 17px);
      font-weight: 500;
      line-height: 1.55;
      color: var(--c-text);
      transition: opacity 0.24s ease;
      width: 100%;
      box-shadow:
        0 6px 36px rgba(0,0,0,0.45),
        0 0 0 1px color-mix(in srgb, white 5%, transparent),
        inset 0 1px 0 rgba(255,255,255,0.06);
    }

    /* Speech bubble pointer */
    #caption-bubble::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 10px solid transparent;
      border-bottom-color: color-mix(in srgb, var(--c-primary) 40%, transparent);
      margin-bottom: -1px;
    }
    #caption-bubble::after {
      content: '';
      position: absolute;
      bottom: calc(100% - 2px);
      left: 50%;
      transform: translateX(-50%);
      border: 9px solid transparent;
      border-bottom-color: var(--c-surface);
    }

    #caption-bubble.fade-out { opacity: 0; }
    #caption-bubble.fade-in  { opacity: 1; }

    /* Mo speaking emphasis */
    #caption-bubble.speaking {
      border-color: color-mix(in srgb, var(--c-secondary) 55%, transparent);
      border-left-color: var(--c-secondary);
      box-shadow:
        0 6px 36px rgba(0,0,0,0.45),
        0 0 20px color-mix(in srgb, var(--c-secondary) 18%, transparent);
    }

    #user-caption {
      font-size: 12px;
      color: var(--c-muted);
      text-align: center;
      padding: 5px 24px 0;
      width: 100%;
      height: 20px;
      opacity: 0;
      transition: opacity 0.3s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-style: italic;
    }
    #user-caption.visible { opacity: 1; }

    /* ══════════════════════════════════════════════════
       BOTTOM BAR — CHIPS + TALK BUTTON
       ══════════════════════════════════════════════════ */
    #bottom-bar {
      position: relative; z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 0 20px 26px;
      flex-shrink: 0;
      width: 100%;
      max-width: 760px;
      margin: 0 auto;
    }

    /* ── Scenario Chips ── */
    #scenario-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .chip {
      background: rgba(14, 48, 46, 0.78);
      border: 1px solid color-mix(in srgb, var(--c-primary) 30%, transparent);
      color: var(--c-text);
      padding: 7px 15px;
      border-radius: 99px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(12px);
      transition: all 0.22s ease;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      letter-spacing: 0.2px;
    }
    .chip:hover {
      background: color-mix(in srgb, var(--c-primary) 20%, var(--c-surface));
      border-color: var(--c-primary);
      color: var(--c-primary);
      transform: translateY(-2px);
      box-shadow: 0 5px 18px color-mix(in srgb, var(--c-primary) 30%, transparent);
    }
    .chip:active { transform: translateY(0.5px) scale(0.97); }
    .chip.chip-active {
      background: color-mix(in srgb, var(--c-primary) 25%, var(--c-surface));
      border-color: var(--c-primary);
      color: var(--c-primary);
    }

    /* ── Talk Button ── */
    #talk-btn {
      display: block;
      margin: 0 auto;
      padding: 18px 58px;
      border-radius: 99px;
      border: none;
      background: linear-gradient(135deg, #FF7820 0%, var(--c-primary) 40%, #C84000 100%);
      color: white;
      font-size: clamp(16px, 2.1vw, 20px);
      font-weight: 900;
      letter-spacing: 0.4px;
      cursor: pointer;
      outline: none;
      box-shadow:
        0 6px 36px color-mix(in srgb, var(--c-primary) 55%, transparent),
        0 2px 10px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.15);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      position: relative;
      overflow: hidden;
      font-family: 'Arial Black', 'Inter', sans-serif;
    }
    #talk-btn::after {
      content: '';
      position: absolute;
      top: 0; left: -110%;
      width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transform: skewX(-20deg);
      animation: btn-shimmer 3.8s ease-in-out infinite;
    }
    @keyframes btn-shimmer {
      0%   { left: -110%; }
      45%  { left: 170%; }
      100% { left: 170%; }
    }
    #talk-btn:hover {
      transform: translateY(-3px);
      box-shadow:
        0 12px 48px color-mix(in srgb, var(--c-primary) 62%, transparent),
        0 4px 14px rgba(0,0,0,0.5);
    }
    #talk-btn:active { transform: translateY(1px) scale(0.98); }

    #talk-btn.listening {
      background: linear-gradient(135deg, #E03030, #A81818);
      box-shadow:
        0 6px 36px rgba(220, 48, 48, 0.6),
        0 2px 10px rgba(0,0,0,0.5);
      animation: listening-pulse 1.5s ease-in-out infinite;
    }
    @keyframes listening-pulse {
      0%, 100% { box-shadow: 0 6px 36px rgba(220, 48, 48, 0.55), 0 2px 10px rgba(0,0,0,0.5); }
      50%       { box-shadow: 0 6px 60px rgba(220, 48, 48, 0.9), 0 2px 10px rgba(0,0,0,0.5); }
    }

    /* ══════════════════════════════════════════════════
       DEBUG PANEL
       ══════════════════════════════════════════════════ */
    #debug-panel {
      position: fixed; top: 14px; right: 14px;
      z-index: 1000;
      background: rgba(6, 18, 8, 0.96);
      backdrop-filter: blur(16px);
      border: 1px solid color-mix(in srgb, var(--c-primary) 30%, transparent);
      border-radius: 20px;
      padding: 18px;
      width: 284px;
      display: none;
      flex-direction: column;
      gap: 9px;
      box-shadow: 0 10px 50px rgba(0,0,0,0.75);
    }
    #debug-panel.open { display: flex; }
    #debug-panel h3 {
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 1.3px;
      text-transform: uppercase;
      color: var(--c-primary);
    }
    .debug-row { display: flex; gap: 5px; flex-wrap: wrap; }
    .dbg-btn {
      flex: 1; min-width: 0;
      padding: 7px 9px;
      border-radius: 9px;
      border: 1px solid rgba(255,255,255,0.09);
      background: rgba(255,255,255,0.04);
      color: var(--c-text);
      font-size: 11.5px; font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap; text-align: center;
    }
    .dbg-btn:hover  { background: rgba(255,255,255,0.1); }
    .dbg-btn.active {
      background: color-mix(in srgb, var(--c-primary) 22%, transparent);
      border-color: var(--c-primary);
      color: var(--c-primary);
    }
    .debug-label {
      font-size: 10.5px;
      color: var(--c-muted);
      font-weight: 700;
      letter-spacing: 0.7px;
      text-transform: uppercase;
      margin-top: 3px;
    }
    input[type=range] { width: 100%; accent-color: var(--c-primary); cursor: pointer; }
    #debug-latency-val {
      font-size: 24px; font-weight: 900; color: var(--c-primary);
      text-align: center; letter-spacing: -1px; font-family: 'Inter', monospace;
    }
    #debug-hint {
      position: fixed; bottom: 14px; right: 18px;
      font-size: 10.5px; color: rgba(255,255,255,0.16);
      pointer-events: none; z-index: 999; letter-spacing: 0.5px;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

// ── HTML Template ─────────────────────────────────────────────────────────────
function buildHTML(config) {
  const embers = [
    { left: '8%',   bottom: '14%', size: '4px',   col: '#FF6A00', dur: '7s',   delay: '0s'   },
    { left: '22%',  bottom: '10%', size: '3px',   col: '#FF8A30', dur: '9s',   delay: '2.2s' },
    { left: '38%',  bottom: '7%',  size: '2.5px', col: '#FFD060', dur: '6.5s', delay: '4s'   },
    { left: '54%',  bottom: '18%', size: '5px',   col: '#FF6A00', dur: '5.5s', delay: '1s'   },
    { left: '68%',  bottom: '12%', size: '3.5px', col: '#FF8A30', dur: '7.5s', delay: '3.5s' },
    { left: '82%',  bottom: '16%', size: '4.5px', col: '#FF6A00', dur: '8.5s', delay: '0.8s' },
    { left: '92%',  bottom: '8%',  size: '2.5px', col: '#72CC38', dur: '6s',   delay: '2.8s' },
    { left: '5%',   bottom: '30%', size: '2px',   col: '#72CC38', dur: '10s',  delay: '5s'   },
  ].map(e =>
    `<div class="ember" style="left:${e.left};bottom:${e.bottom};width:${e.size};height:${e.size};background:${e.col};animation-duration:${e.dur};animation-delay:${e.delay};box-shadow:0 0 6px ${e.col};"></div>`
  ).join('');

  return /* html */`
    <div id="app">
      <div id="bg-base"></div>
      <div id="bg-grid"></div>
      ${embers}

      <!-- Header -->
      <header id="header">
        <div id="logo-wrap">
          <div id="logo-icon">🔥</div>
          <div id="header-text">
            <span id="restaurant-name">${config.restaurantName.toUpperCase()}</span>
            <span id="tagline">${config.tagline}</span>
          </div>
        </div>
        <div id="status-badge" class="state-idle">Idle</div>
      </header>

      <!-- Character Stage -->
      <main id="stage">
        <div id="stage-glow-outer"></div>
        <div id="stage-glow"></div>
        <div id="stage-floor"></div>
        <div id="mo-container"></div>
      </main>

      <!-- Caption -->
      <section id="caption-area">
        <div id="caption-bubble">${config.character.idleCaption}</div>
        <div id="user-caption"></div>
      </section>

      <!-- Bottom Bar -->
      <div id="bottom-bar">
        <div id="scenario-chips">
          <button class="chip" data-prompt="I have an exam tomorrow.">🎓 Exam tomorrow</button>
          <button class="chip" data-prompt="What should I order?">🍗 What's good?</button>
          <button class="chip" data-prompt="I brought the whole squad.">👥 Whole squad</button>
          <button class="chip" data-prompt="I'm running late to class, what's quick?">🥙 Running late</button>
        </div>
        <button id="talk-btn">🎤&nbsp; Tap to Talk to Mo</button>
      </div>
    </div>

    <!-- Debug Panel (press D) -->
    <div id="debug-panel">
      <h3>⚡ Mo 2.0 Studio</h3>

      <div class="debug-label">State</div>
      <div class="debug-row">
        <button class="dbg-btn active" data-state="idle">Idle</button>
        <button class="dbg-btn" data-state="listening">Listen</button>
        <button class="dbg-btn" data-state="thinking">Think</button>
        <button class="dbg-btn" data-state="talking">Talk</button>
      </div>

      <div class="debug-label">Expressions</div>
      <div class="debug-row">
        <button class="dbg-btn" data-expr="neutral">Neutral</button>
        <button class="dbg-btn active" data-expr="happy">Happy</button>
        <button class="dbg-btn" data-expr="smug">Smug</button>
      </div>
      <div class="debug-row">
        <button class="dbg-btn" data-expr="excited">Excited</button>
        <button class="dbg-btn" data-expr="thinking">Think</button>
        <button class="dbg-btn" data-expr="mock_offended">Offended</button>
      </div>
      <div class="debug-row">
        <button class="dbg-btn" data-expr="surprised">Surprise</button>
        <button class="dbg-btn" data-expr="wink">Wink</button>
        <button class="dbg-btn" id="dbg-laugh-btn">😂 Laugh</button>
      </div>

      <div class="debug-label">Mouth&nbsp;<span id="mouth-val">0.00</span></div>
      <input type="range" id="mouth-slider" min="0" max="100" value="0"/>

      <div class="debug-label">Quick Lines</div>
      <div class="debug-row">
        <button class="dbg-btn" data-caption="Yo habibi! You came hungry — that's a problem I can fix.">Welcome</button>
        <button class="dbg-btn" data-caption="Extra Holic? That's not an add-on, habibi. That's a personality trait.">Extra Holic</button>
      </div>
      <div class="debug-row">
        <button class="dbg-btn" data-caption="You brought the whole squad? HOLICBUCKET. Group project finally done right.">HolicBucket</button>
        <button class="dbg-btn" data-caption="My hair is lettuce and I still have more flavor than your dining hall.">Roast</button>
      </div>

      <div class="debug-label">Latency</div>
      <div id="debug-latency-val">-- ms</div>
    </div>

    <div id="debug-hint">Press D for studio controls</div>
  `;
}

// ── App Class ──────────────────────────────────────────────────────────────────
export class App {
  constructor(rootEl, deps) {
    this._root = rootEl;
    this._Mo   = deps.Mo;
    this._onTalkPress = null;
    this._onChipClick = null;
    this._captionTimer = null;

    injectStyles(CONFIG.colors);
    rootEl.innerHTML = buildHTML(CONFIG);

    this._captionEl     = document.getElementById('caption-bubble');
    this._userCaptionEl = document.getElementById('user-caption');
    this._statusEl      = document.getElementById('status-badge');
    this._talkBtn       = document.getElementById('talk-btn');
    this._stageGlow     = document.getElementById('stage-glow');
    this._debugPanel    = document.getElementById('debug-panel');

    this._bindEvents();
  }

  get moContainer() { return document.getElementById('mo-container'); }

  onTalkPress(fn) { this._onTalkPress = fn; }
  onChipClick(fn) { this._onChipClick = fn; }

  setState(state) {
    const labels = { idle: 'Idle', listening: 'Listening…', thinking: 'Thinking…', talking: 'Speaking' };
    this._statusEl.textContent = labels[state] || state;
    this._statusEl.className   = `state-${state}`;

    const isActive = state !== 'idle';
    this._talkBtn.textContent = isActive
      ? '\uD83D\uDED1\u00A0 Tap to Stop'
      : '\uD83C\uDFA4\u00A0 Tap to Talk to Mo';
    this._talkBtn.classList.toggle('listening', state === 'listening');
    this._stageGlow?.classList.toggle('talking', state === 'talking');
    this._captionEl?.classList.toggle('speaking', state === 'talking');

    document.querySelectorAll('[data-state]').forEach(b =>
      b.classList.toggle('active', b.dataset.state === state));
  }

  setCaption(text) {
    const el = this._captionEl;
    if (!el) return;
    el.classList.add('fade-out');
    clearTimeout(this._captionTimer);
    this._captionTimer = setTimeout(() => {
      el.textContent = text;
      el.classList.remove('fade-out');
    }, 220);
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

    // Scenario chips
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip-active'));
        chip.classList.add('chip-active');
        setTimeout(() => chip.classList.remove('chip-active'), 1200);
        this._onChipClick?.(chip.dataset.prompt);
      });
    });

    // Debug panel toggle
    document.addEventListener('keydown', e => {
      if (e.key === 'd' || e.key === 'D') this._debugPanel.classList.toggle('open');
    });

    // State buttons
    document.querySelectorAll('[data-state]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setState(btn.dataset.state);
        this._Mo.setState(btn.dataset.state);
        if (btn.dataset.state === 'talking') this._startTalkDemo();
        else this._stopTalkDemo();
      });
    });

    // Expression buttons
    document.querySelectorAll('[data-expr]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._Mo.setExpression(btn.dataset.expr);
        document.querySelectorAll('[data-expr]').forEach(b =>
          b.classList.toggle('active', b === btn));
      });
    });

    // Laugh button
    document.getElementById('dbg-laugh-btn')?.addEventListener('click', () => {
      this._Mo.triggerLaugh();
    });

    // Mouth slider
    const slider = document.getElementById('mouth-slider');
    const valEl  = document.getElementById('mouth-val');
    slider?.addEventListener('input', () => {
      const v = Number(slider.value) / 100;
      if (valEl) valEl.textContent = v.toFixed(2);
      this._Mo.setMouthOpen(v);
    });

    // Caption buttons
    document.querySelectorAll('[data-caption]').forEach(btn => {
      btn.addEventListener('click', () => this.setCaption(btn.dataset.caption));
    });
  }

  // Demo talk animation for debug panel
  _talkDemoRaf   = null;
  _talkDemoPhase = 0;

  _startTalkDemo() {
    this._stopTalkDemo();
    let last = performance.now();
    const loop = (ts) => {
      const dt = ts - last; last = ts;
      this._talkDemoPhase += dt * 0.006;
      const v = Math.abs(Math.sin(this._talkDemoPhase)) * 0.9;
      this._Mo.setMouthOpen(v);
      this._Mo.setSpeechCadence?.(v);
      const sl = document.getElementById('mouth-slider');
      const vl = document.getElementById('mouth-val');
      if (sl) sl.value = String(Math.round(v * 100));
      if (vl) vl.textContent = v.toFixed(2);
      this._talkDemoRaf = requestAnimationFrame(loop);
    };
    this._talkDemoRaf = requestAnimationFrame(loop);
  }

  _stopTalkDemo() {
    if (this._talkDemoRaf) { cancelAnimationFrame(this._talkDemoRaf); this._talkDemoRaf = null; }
    this._Mo?.setMouthOpen(0);
    this._Mo?.setSpeechCadence?.(0);
  }
}
