// src/ui/App.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic kiosk UI shell.
// Halalholic brand: dark green background, orange accents, cream text.
// ─────────────────────────────────────────────────────────────────────────────

import { CONFIG } from '../config.js';

function injectStyles(colors) {
  const css = /* css */`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --c-primary:   ${colors.primary};
      --c-secondary: ${colors.secondary};
      --c-accent:    ${colors.accent};
      --c-bg:        ${colors.background};
      --c-surface:   ${colors.surface};
      --c-surface2:  ${colors.surfaceAlt};
      --c-text:      ${colors.text};
      --c-muted:     ${colors.textMuted};
      --c-glow:      ${colors.glow};
    }

    html, body {
      width: 100%; height: 100%;
      overflow: hidden;
      background: var(--c-bg);
      color: var(--c-text);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* ── App shell ── */
    #app {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100vw; height: 100vh;
      position: relative;
      overflow: hidden;
    }

    /* ── Background layers ── */
    #bg-gradient {
      position: absolute; inset: 0;
      background: radial-gradient(
        ellipse 65% 55% at 50% 58%,
        color-mix(in srgb, var(--c-glow) 14%, transparent) 0%,
        transparent 70%
      );
      pointer-events: none; z-index: 0;
    }

    #bg-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(color-mix(in srgb, var(--c-primary) 5%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--c-primary) 5%, transparent) 1px, transparent 1px);
      background-size: 52px 52px;
      pointer-events: none; z-index: 0;
    }

    /* ── Floating embers (CSS-only animation) ── */
    .ember {
      position: absolute;
      border-radius: 50%;
      background: var(--c-primary);
      pointer-events: none;
      z-index: 0;
      animation: ember-float linear infinite;
    }
    @keyframes ember-float {
      0%   { transform: translateY(0)   scale(1);    opacity: 0.7; }
      40%  { opacity: 0.5; }
      100% { transform: translateY(-90vh) scale(0.4); opacity: 0;   }
    }

    /* ── Header ── */
    #header {
      position: relative; z-index: 10;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 28px 0;
      flex-shrink: 0;
    }

    #logo-icon {
      width: 48px; height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--c-primary), #C84400);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
      box-shadow: 0 4px 22px color-mix(in srgb, var(--c-primary) 55%, transparent);
    }

    #header-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    #restaurant-name {
      font-size: clamp(18px, 2.4vw, 26px);
      font-weight: 900;
      letter-spacing: 1.5px;
      color: var(--c-primary);
      line-height: 1;
      font-family: 'Arial Black', Impact, sans-serif;
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
      padding: 6px 18px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      background: var(--c-surface);
      border: 1px solid transparent;
      color: var(--c-muted);
      transition: all 0.3s ease;
    }
    #status-badge.state-idle      { color: var(--c-muted); }
    #status-badge.state-listening {
      color: var(--c-primary);
      border-color: var(--c-primary);
      background: color-mix(in srgb, var(--c-primary) 12%, var(--c-surface));
    }
    #status-badge.state-thinking  {
      color: #FFD060;
      border-color: #FFD060;
      background: color-mix(in srgb, #FFD060 10%, var(--c-surface));
    }
    #status-badge.state-talking   {
      color: var(--c-secondary);
      border-color: var(--c-secondary);
      background: color-mix(in srgb, var(--c-secondary) 12%, var(--c-surface));
    }

    /* Pulsing dot for active states */
    #status-badge::before {
      content: '';
      display: inline-block;
      width: 7px; height: 7px;
      border-radius: 50%;
      margin-right: 7px;
      vertical-align: middle;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.3s;
    }
    #status-badge.state-listening::before,
    #status-badge.state-thinking::before,
    #status-badge.state-talking::before {
      opacity: 1;
      animation: pulse-dot 1.2s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.35; transform: scale(0.55); }
    }

    /* ── Character stage ── */
    #stage {
      position: relative; z-index: 10;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 0;
    }

    /* Glow behind Mo */
    #stage-glow {
      position: absolute;
      width: min(58vh, 500px);
      height: min(58vh, 500px);
      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--c-glow) 18%, transparent) 0%,
        transparent 70%
      );
      pointer-events: none;
      animation: glow-pulse 3.2s ease-in-out infinite;
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.85; transform: scale(1);    }
      50%       { opacity: 1;    transform: scale(1.07); }
    }

    #mo-container {
      width: min(62vh, 520px);
      height: min(62vh, 520px);
      position: relative; z-index: 2;
      filter: drop-shadow(0 18px 45px rgba(0,0,0,0.55));
    }

    /* ── Caption area ── */
    #caption-area {
      position: relative; z-index: 10;
      width: min(650px, 93vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      margin-bottom: 8px;
      gap: 0;
    }

    #caption-bubble {
      background: var(--c-surface);
      border: 1px solid color-mix(in srgb, var(--c-primary) 28%, transparent);
      border-left: 3px solid var(--c-primary);
      border-radius: 20px;
      padding: 14px 24px;
      text-align: center;
      font-size: clamp(15px, 1.9vw, 18px);
      line-height: 1.5;
      color: var(--c-text);
      transition: opacity 0.3s ease;
      width: 100%;
      box-shadow: 0 4px 28px rgba(0,0,0,0.4),
                  inset 0 0 0 1px color-mix(in srgb, white 4%, transparent);
    }

    /* Triangle pointer */
    #caption-bubble::before {
      content: '';
      position: absolute;
      bottom: 100%; left: 50%;
      transform: translateX(-50%);
      border: 9px solid transparent;
      border-bottom-color: color-mix(in srgb, var(--c-primary) 28%, transparent);
      margin-bottom: -1px;
    }
    #caption-bubble::after {
      content: '';
      position: absolute;
      bottom: calc(100% - 2px); left: 50%;
      transform: translateX(-50%);
      border: 8px solid transparent;
      border-bottom-color: var(--c-surface);
    }

    #caption-bubble.fade-out { opacity: 0; }
    #caption-bubble.fade-in  { opacity: 1; }

    /* ── User caption ── */
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
    }
    #user-caption.visible { opacity: 1; }

    /* ── Bottom bar ── */
    #bottom-bar {
      position: relative; z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding: 0 24px 26px;
      flex-shrink: 0;
    }

    /* ── Talk button ── */
    #talk-btn {
      padding: 18px 56px;
      border-radius: 99px;
      border: none;
      background: linear-gradient(135deg, var(--c-primary) 0%, #C84000 100%);
      color: white;
      font-size: clamp(17px, 2.2vw, 21px);
      font-weight: 800;
      letter-spacing: 0.3px;
      cursor: pointer;
      outline: none;
      box-shadow:
        0 6px 32px color-mix(in srgb, var(--c-primary) 52%, transparent),
        0 2px 8px rgba(0,0,0,0.4);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      position: relative;
      overflow: hidden;
      font-family: 'Arial Black', 'Segoe UI', sans-serif;
    }

    #talk-btn::after {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 55%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
      transform: skewX(-20deg);
      animation: btn-shimmer 3.5s ease-in-out infinite;
    }
    @keyframes btn-shimmer {
      0%   { left: -100%; }
      45%  { left: 160%;  }
      100% { left: 160%;  }
    }

    #talk-btn:hover  { transform: translateY(-2px); box-shadow: 0 10px 44px color-mix(in srgb, var(--c-primary) 58%, transparent), 0 4px 12px rgba(0,0,0,0.4); }
    #talk-btn:active { transform: translateY(1px) scale(0.98); }

    #talk-btn.listening {
      background: linear-gradient(135deg, #DC3030, #A81818);
      box-shadow: 0 6px 32px rgba(220, 48, 48, 0.55);
      animation: listening-pulse 1.4s ease-in-out infinite;
    }
    @keyframes listening-pulse {
      0%, 100% { box-shadow: 0 6px 32px rgba(220, 48, 48, 0.5);  }
      50%       { box-shadow: 0 6px 55px rgba(220, 48, 48, 0.85); }
    }

    /* ── Debug panel ── */
    #debug-panel {
      position: fixed; top: 14px; right: 14px;
      z-index: 1000;
      background: rgba(8, 22, 10, 0.94);
      backdrop-filter: blur(14px);
      border: 1px solid color-mix(in srgb, var(--c-primary) 25%, transparent);
      border-radius: 18px;
      padding: 20px;
      width: 268px;
      display: none;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 8px 44px rgba(0,0,0,0.7);
    }
    #debug-panel.open { display: flex; }

    #debug-panel h3 {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: var(--c-primary);
    }

    .debug-row { display: flex; gap: 6px; flex-wrap: wrap; }

    .dbg-btn {
      flex: 1; min-width: 0;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      color: var(--c-text);
      font-size: 12px; font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      white-space: nowrap; text-align: center;
    }
    .dbg-btn:hover  { background: rgba(255,255,255,0.1); }
    .dbg-btn.active {
      background: color-mix(in srgb, var(--c-primary) 22%, transparent);
      border-color: var(--c-primary);
      color: var(--c-primary);
    }

    .debug-label {
      font-size: 11px;
      color: var(--c-muted);
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-top: 4px;
    }

    input[type=range] {
      width: 100%;
      accent-color: var(--c-primary);
      cursor: pointer;
    }

    #debug-latency-val {
      font-size: 26px;
      font-weight: 900;
      color: var(--c-primary);
      text-align: center;
      letter-spacing: -1px;
      font-family: 'Arial Black', monospace;
    }

    #debug-hint {
      position: fixed;
      bottom: 14px; right: 18px;
      font-size: 11px;
      color: rgba(255,255,255,0.18);
      pointer-events: none;
      z-index: 999;
      letter-spacing: 0.5px;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

// ── HTML template ─────────────────────────────────────────────────────────────
function buildHTML(config) {
  // Ember particles at different positions/speeds/sizes
  const embers = [
    { left: '15%',  bottom: '18%', size: '5px',  dur: '6s',  delay: '0s'   },
    { left: '28%',  bottom: '12%', size: '3.5px', dur: '8s',  delay: '2s'   },
    { left: '52%',  bottom: '22%', size: '4.5px', dur: '5s',  delay: '1s'   },
    { left: '68%',  bottom: '15%', size: '3px',   dur: '7s',  delay: '3.5s' },
    { left: '82%',  bottom: '20%', size: '4px',   dur: '9s',  delay: '0.5s' },
    { left: '38%',  bottom: '8%',  size: '2.5px', dur: '6.5s',delay: '4s'   },
  ].map(e =>
    `<div class="ember" style="left:${e.left};bottom:${e.bottom};width:${e.size};height:${e.size};animation-duration:${e.dur};animation-delay:${e.delay};"></div>`
  ).join('');

  return /* html */`
    <div id="bg-gradient"></div>
    <div id="bg-grid"></div>
    ${embers}

    <!-- Header -->
    <header id="header">
      <div id="logo-icon">🔥</div>
      <div id="header-text">
        <span id="restaurant-name">${config.restaurantName.toUpperCase()}</span>
        <span id="tagline">${config.tagline}</span>
      </div>
      <div id="status-badge" class="state-idle">Idle</div>
    </header>

    <!-- Character stage -->
    <main id="stage">
      <div id="stage-glow"></div>
      <div id="mo-container"></div>
    </main>

    <!-- Caption -->
    <section id="caption-area">
      <div id="caption-bubble">${config.character.idleCaption}</div>
      <div id="user-caption"></div>
    </section>

    <!-- Bottom bar -->
    <div id="bottom-bar">
      <button id="talk-btn">🎤&nbsp; Tap to Talk to Mo</button>
    </div>

    <!-- Debug panel -->
    <div id="debug-panel">
      <h3>⚡ Debug — Mo</h3>

      <div class="debug-label">State</div>
      <div class="debug-row">
        <button class="dbg-btn active" data-state="idle">Idle</button>
        <button class="dbg-btn" data-state="listening">Listen</button>
        <button class="dbg-btn" data-state="thinking">Think</button>
        <button class="dbg-btn" data-state="talking">Talk</button>
      </div>

      <div class="debug-label">Expression</div>
      <div class="debug-row">
        <button class="dbg-btn active" data-expr="happy">Happy</button>
        <button class="dbg-btn" data-expr="smug">Smug</button>
        <button class="dbg-btn" data-expr="excited">Excited</button>
      </div>
      <div class="debug-row">
        <button class="dbg-btn" data-expr="thinking">Think</button>
        <button class="dbg-btn" data-expr="surprised">Surprise</button>
        <button class="dbg-btn" data-expr="wink">Wink</button>
      </div>

      <div class="debug-label">Mouth&nbsp;<span id="mouth-val">0.00</span></div>
      <input type="range" id="mouth-slider" min="0" max="100" value="0"/>

      <div class="debug-label">Caption</div>
      <div class="debug-row">
        <button class="dbg-btn" data-caption="Habibi, you look hungry.">Greet</button>
        <button class="dbg-btn" data-caption="Lemme think on that...">Think</button>
        <button class="dbg-btn" data-caption="Solid choice, trust me.">Order</button>
      </div>

      <div class="debug-label">Latency</div>
      <div id="debug-latency-val">-- ms</div>
    </div>

    <div id="debug-hint">Press D for debug</div>
  `;
}

// ── App class ──────────────────────────────────────────────────────────────────
export class App {
  constructor(rootEl, deps) {
    this._root = rootEl;
    this._Mo   = deps.Mo;
    this._onTalkPress = null;

    injectStyles(CONFIG.colors);
    rootEl.innerHTML = buildHTML(CONFIG);

    this._captionEl     = document.getElementById('caption-bubble');
    this._userCaptionEl = document.getElementById('user-caption');
    this._statusEl      = document.getElementById('status-badge');
    this._talkBtn       = document.getElementById('talk-btn');
    this._debugPanel    = document.getElementById('debug-panel');

    this._bindEvents();
  }

  get moContainer() { return document.getElementById('mo-container'); }

  onTalkPress(fn) { this._onTalkPress = fn; }

  setState(state) {
    const labels = { idle: 'Idle', listening: 'Listening', thinking: 'Thinking', talking: 'Talking' };
    this._statusEl.textContent = labels[state] || state;
    this._statusEl.className   = `state-${state}`;

    if (state === 'listening' || state === 'thinking' || state === 'talking') {
      this._talkBtn.textContent = '\uD83D\uDED1\u00A0 Tap to Stop';
      this._talkBtn.classList.toggle('listening', state === 'listening');
    } else {
      this._talkBtn.textContent = '\uD83C\uDFA4\u00A0 Tap to Talk to Mo';
      this._talkBtn.classList.remove('listening');
    }

    document.querySelectorAll('[data-state]').forEach(b =>
      b.classList.toggle('active', b.dataset.state === state));
  }

  setCaption(text) {
    const el = this._captionEl;
    el.classList.add('fade-out');
    clearTimeout(this._captionTimer);
    this._captionTimer = setTimeout(() => {
      el.textContent = text;
      el.classList.remove('fade-out');
    }, 280);
  }

  setUserCaption(text) {
    const el = this._userCaptionEl;
    if (!el) return;
    el.textContent = text ? `You: ${text}` : '';
    el.classList.toggle('visible', !!text);
  }

  clearUserCaption() { this.setUserCaption(''); }

  updateLatency(ms) {
    const el = document.getElementById('debug-latency-val');
    if (el) el.textContent = `${ms} ms`;
  }

  _bindEvents() {
    this._talkBtn.addEventListener('click', () => {
      this._onTalkPress?.(this._state);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'd' || e.key === 'D') this._debugPanel.classList.toggle('open');
    });

    document.querySelectorAll('[data-state]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setState(btn.dataset.state);
        this._Mo.setState(btn.dataset.state);
        if (btn.dataset.state === 'talking') this._startTalkDemo();
        else this._stopTalkDemo();
      });
    });

    document.querySelectorAll('[data-expr]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._Mo.setExpression(btn.dataset.expr);
        document.querySelectorAll('[data-expr]').forEach(b =>
          b.classList.toggle('active', b === btn));
      });
    });

    const slider = document.getElementById('mouth-slider');
    const valEl  = document.getElementById('mouth-val');
    slider?.addEventListener('input', () => {
      const v = Number(slider.value) / 100;
      if (valEl) valEl.textContent = v.toFixed(2);
      this._Mo.setMouthOpen(v);
    });

    document.querySelectorAll('[data-caption]').forEach(btn => {
      btn.addEventListener('click', () => this.setCaption(btn.dataset.caption));
    });
  }

  _talkDemoRaf   = null;
  _talkDemoPhase = 0;

  _startTalkDemo() {
    this._stopTalkDemo();
    let last = performance.now();
    const loop = (ts) => {
      const dt = ts - last; last = ts;
      this._talkDemoPhase += dt * 0.006;
      const v = Math.abs(Math.sin(this._talkDemoPhase)) * 0.88;
      this._Mo.setMouthOpen(v);
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
    this._Mo.setMouthOpen(0);
  }
}
