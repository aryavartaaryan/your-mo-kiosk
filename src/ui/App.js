// src/ui/App.js
// ─────────────────────────────────────────────────────────────────────────────
// App – builds and manages the kiosk UI shell.
//
// Responsibilities:
//   • Render the full-screen layout (header, character stage, caption, button)
//   • Expose setCaption(), setUserCaption(), setStatus(), onTalkPress() callback
//   • Render the hidden debug panel (toggle with the "D" key)
//   • updateLatency(ms) for the debug panel latency readout
// ─────────────────────────────────────────────────────────────────────────────

import { CONFIG } from '../config.js';

// ── Inject global CSS ─────────────────────────────────────────────────────────
function injectStyles(colors) {
  const css = /* css */`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --c-primary:    ${colors.primary};
      --c-secondary:  ${colors.secondary};
      --c-bg:         ${colors.background};
      --c-surface:    ${colors.surface};
      --c-text:       ${colors.text};
      --c-muted:      ${colors.textMuted};
      --c-glow:       ${colors.glow};
      --radius-lg:    24px;
      --radius-xl:    40px;
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
      width: 100vw;
      height: 100vh;
      position: relative;
      overflow: hidden;
    }

    /* ── Animated background gradient ── */
    #bg-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse 70% 55% at 50% 60%,
        color-mix(in srgb, var(--c-glow) 18%, transparent) 0%,
        transparent 70%
      );
      pointer-events: none;
      z-index: 0;
    }

    /* Subtle grid overlay */
    #bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(color-mix(in srgb, var(--c-primary) 4%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--c-primary) 4%, transparent) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
      z-index: 0;
    }

    /* ── Header ── */
    #header {
      position: relative;
      z-index: 10;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 20px 32px 0;
      flex-shrink: 0;
    }

    #logo-placeholder {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--c-primary), var(--c-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 18px;
      color: white;
      letter-spacing: -1px;
      flex-shrink: 0;
      box-shadow: 0 4px 20px color-mix(in srgb, var(--c-primary) 50%, transparent);
    }

    #restaurant-name {
      font-size: clamp(18px, 2.5vw, 26px);
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(90deg, var(--c-text), var(--c-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    #status-badge {
      margin-left: auto;
      padding: 6px 16px;
      border-radius: 99px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      background: var(--c-surface);
      border: 1px solid color-mix(in srgb, var(--c-primary) 30%, transparent);
      color: var(--c-muted);
      transition: color 0.3s, border-color 0.3s, background 0.3s;
      text-transform: uppercase;
    }
    #status-badge.state-idle      { color: var(--c-muted);     border-color: transparent; }
    #status-badge.state-listening { color: var(--c-primary);   border-color: var(--c-primary);   background: color-mix(in srgb, var(--c-primary) 12%, var(--c-surface)); }
    #status-badge.state-thinking  { color: var(--c-secondary); border-color: var(--c-secondary); background: color-mix(in srgb, var(--c-secondary) 10%, var(--c-surface)); }
    #status-badge.state-talking   { color: #7ECFFF;            border-color: #7ECFFF;            background: color-mix(in srgb, #7ECFFF 10%, var(--c-surface)); }

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
      50%       { opacity: 0.4; transform: scale(0.6); }
    }

    /* ── Character stage ── */
    #stage {
      position: relative;
      z-index: 10;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 0;
    }

    /* Glow ring behind Mo */
    #stage-glow {
      position: absolute;
      width: min(56vh, 480px);
      height: min(56vh, 480px);
      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--c-glow) 22%, transparent) 0%,
        transparent 70%
      );
      pointer-events: none;
      animation: glow-pulse 3s ease-in-out infinite;
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.08); }
    }

    #mo-container {
      width: min(60vh, 500px);
      height: min(60vh, 500px);
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 16px 40px rgba(0,0,0,0.5));
    }

    /* ── Caption area ── */
    #caption-area {
      position: relative;
      z-index: 10;
      width: min(640px, 92vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      margin-bottom: 10px;
      gap: 0;
    }

    #caption-bubble {
      background: var(--c-surface);
      border: 1px solid color-mix(in srgb, var(--c-primary) 20%, transparent);
      border-radius: 20px;
      padding: 14px 24px;
      text-align: center;
      font-size: clamp(15px, 2vw, 18px);
      line-height: 1.5;
      color: var(--c-text);
      transition: opacity 0.35s ease;
      position: relative;
      box-shadow: 0 4px 24px rgba(0,0,0,0.3);
      width: 100%;
    }

    /* Triangle pointer */
    #caption-bubble::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 10px solid transparent;
      border-bottom-color: color-mix(in srgb, var(--c-primary) 20%, transparent);
      margin-bottom: -1px;
    }
    #caption-bubble::after {
      content: '';
      position: absolute;
      bottom: calc(100% - 1px);
      left: 50%;
      transform: translateX(-50%);
      border: 9px solid transparent;
      border-bottom-color: var(--c-surface);
    }

    #caption-bubble.fade-out { opacity: 0; }
    #caption-bubble.fade-in  { opacity: 1; }

    /* ── User caption (what the customer said) ── */
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

    /* ── CTA button ── */
    #bottom-bar {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 0 24px 28px;
      flex-shrink: 0;
    }

    #talk-btn {
      padding: 18px 52px;
      border-radius: var(--radius-xl);
      border: none;
      background: linear-gradient(135deg, var(--c-primary), color-mix(in srgb, var(--c-primary) 70%, var(--c-secondary)));
      color: white;
      font-size: clamp(17px, 2.2vw, 21px);
      font-weight: 800;
      letter-spacing: 0.2px;
      cursor: pointer;
      outline: none;
      box-shadow:
        0 6px 30px color-mix(in srgb, var(--c-primary) 50%, transparent),
        0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.3s;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      position: relative;
      overflow: hidden;
    }

    /* Shimmer sweep */
    #talk-btn::after {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      transform: skewX(-20deg);
      animation: btn-shimmer 3s ease-in-out infinite;
    }
    @keyframes btn-shimmer {
      0%   { left: -100%; }
      50%  { left: 160%; }
      100% { left: 160%; }
    }

    #talk-btn:hover  { transform: translateY(-2px); box-shadow: 0 10px 40px color-mix(in srgb, var(--c-primary) 55%, transparent), 0 4px 12px rgba(0,0,0,0.3); }
    #talk-btn:active { transform: translateY(1px) scale(0.98); box-shadow: 0 3px 16px color-mix(in srgb, var(--c-primary) 40%, transparent); }

    #talk-btn.listening {
      background: linear-gradient(135deg, #E53935, #C62828);
      box-shadow: 0 6px 30px rgba(229, 57, 53, 0.5);
      animation: listening-pulse 1.4s ease-in-out infinite;
    }
    @keyframes listening-pulse {
      0%, 100% { box-shadow: 0 6px 30px rgba(229, 57, 53, 0.5); }
      50%       { box-shadow: 0 6px 50px rgba(229, 57, 53, 0.8); }
    }

    /* ── Debug panel ── */
    #debug-panel {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 1000;
      background: rgba(10, 10, 18, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 20px;
      width: 260px;
      display: none;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    }
    #debug-panel.open { display: flex; }

    #debug-panel h3 {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--c-muted);
      margin-bottom: 4px;
    }

    .debug-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .dbg-btn {
      flex: 1;
      min-width: 0;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
      color: var(--c-text);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      white-space: nowrap;
      text-align: center;
    }
    .dbg-btn:hover  { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.25); }
    .dbg-btn.active { background: color-mix(in srgb, var(--c-primary) 25%, transparent); border-color: var(--c-primary); color: var(--c-primary); }

    .debug-label {
      font-size: 11px;
      color: var(--c-muted);
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }

    input[type=range] {
      width: 100%;
      accent-color: var(--c-primary);
      cursor: pointer;
    }

    /* Latency readout */
    #debug-latency-val {
      font-size: 24px;
      font-weight: 800;
      color: var(--c-secondary);
      text-align: center;
      letter-spacing: -1px;
    }

    #debug-hint {
      position: fixed;
      bottom: 16px;
      right: 20px;
      font-size: 11px;
      color: rgba(255,255,255,0.2);
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
  const initials = config.restaurantName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('');

  return /* html */`
    <div id="bg-gradient"></div>
    <div id="bg-grid"></div>

    <!-- Header -->
    <header id="header">
      <div id="logo-placeholder">${initials}</div>
      <span id="restaurant-name">${config.restaurantName}</span>
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
      <button id="talk-btn">🎤&nbsp; Tap to talk to Mo</button>
    </div>

    <!-- Debug panel -->
    <div id="debug-panel">
      <h3>🛠 Debug – Mo</h3>

      <div class="debug-label">STATE</div>
      <div class="debug-row">
        <button class="dbg-btn active" data-state="idle">Idle</button>
        <button class="dbg-btn" data-state="listening">Listen</button>
        <button class="dbg-btn" data-state="thinking">Think</button>
        <button class="dbg-btn" data-state="talking">Talk</button>
      </div>

      <div class="debug-label">EXPRESSION</div>
      <div class="debug-row">
        <button class="dbg-btn active" data-expr="happy">Happy</button>
        <button class="dbg-btn" data-expr="smug">Smug</button>
        <button class="dbg-btn" data-expr="surprised">Surprised</button>
      </div>

      <div class="debug-label">MOUTH OPEN &nbsp;<span id="mouth-val">0.00</span></div>
      <input type="range" id="mouth-slider" min="0" max="100" value="0" step="1"/>

      <div class="debug-label" style="margin-top:4px">CAPTION PRESETS</div>
      <div class="debug-row">
        <button class="dbg-btn" data-caption="What can I get you today?">Greet</button>
        <button class="dbg-btn" data-caption="Let me think about that…">Think</button>
        <button class="dbg-btn" data-caption="Here's what I recommend!">Rec.</button>
      </div>

      <div class="debug-label" style="margin-top:4px">RESPONSE LATENCY</div>
      <div id="debug-latency-val">-- ms</div>
    </div>

    <div id="debug-hint">Press D for debug</div>
  `;
}

// ── App class ──────────────────────────────────────────────────────────────────
export class App {
  /**
   * @param {HTMLElement} rootEl  – mount point (typically document.body)
   * @param {{ Mo: object }} deps
   */
  constructor(rootEl, deps) {
    this._root  = rootEl;
    this._Mo    = deps.Mo;
    this._state = 'idle';
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

  /** Returns the container element for Mo's SVG. */
  get moContainer() {
    return document.getElementById('mo-container');
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  /** Register the callback fired when the user taps "Talk". */
  onTalkPress(fn) {
    this._onTalkPress = fn;
  }

  /**
   * Update status label + button appearance.
   * @param {'idle'|'listening'|'thinking'|'talking'} state
   */
  setState(state) {
    this._state = state;
    const labels = {
      idle:      'Idle',
      listening: 'Listening',
      thinking:  'Thinking',
      talking:   'Talking',
    };
    this._statusEl.textContent = labels[state] || state;
    this._statusEl.className   = `state-${state}`;

    if (state === 'listening') {
      this._talkBtn.textContent = '\uD83D\uDED1\u00A0 Tap to stop';
      this._talkBtn.classList.add('listening');
    } else if (state === 'idle') {
      this._talkBtn.textContent = '\uD83C\uDFA4\u00A0 Tap to talk to Mo';
      this._talkBtn.classList.remove('listening');
    } else {
      // thinking / talking — keep the stop button
      if (!this._talkBtn.classList.contains('listening')) {
        // Was not in listening before; keep current button text
      }
    }

    // Sync debug buttons
    document.querySelectorAll('[data-state]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.state === state);
    });
  }

  /**
   * Update Mo's speech bubble with a fade transition.
   * @param {string} text
   */
  setCaption(text) {
    const el = this._captionEl;
    el.classList.add('fade-out');
    setTimeout(() => {
      el.textContent = text;
      el.classList.remove('fade-out');
      el.classList.add('fade-in');
      setTimeout(() => el.classList.remove('fade-in'), 400);
    }, 300);
  }

  /**
   * Show what the customer said in a dimmer line below the caption bubble.
   * @param {string} text
   */
  setUserCaption(text) {
    const el = this._userCaptionEl;
    if (!el) return;
    el.textContent = text ? `You: ${text}` : '';
    el.classList.toggle('visible', !!text);
  }

  /** Hide the user caption line. */
  clearUserCaption() {
    this.setUserCaption('');
  }

  /**
   * Update the latency readout in the debug panel.
   * @param {number} ms
   */
  updateLatency(ms) {
    const el = document.getElementById('debug-latency-val');
    if (el) el.textContent = `${ms} ms`;
  }

  // ── Internal event wiring ────────────────────────────────────────────────────

  _bindEvents() {
    // Talk button
    this._talkBtn.addEventListener('click', () => {
      if (this._onTalkPress) this._onTalkPress(this._state);
    });

    // D-key debug toggle
    document.addEventListener('keydown', e => {
      if (e.key === 'd' || e.key === 'D') {
        this._debugPanel.classList.toggle('open');
      }
    });

    // Debug: state buttons
    document.querySelectorAll('[data-state]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setState(btn.dataset.state);
        this._Mo.setState(btn.dataset.state);
        if (btn.dataset.state === 'talking') {
          this._startTalkDemo();
        } else {
          this._stopTalkDemo();
        }
      });
    });

    // Debug: expression buttons
    document.querySelectorAll('[data-expr]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._Mo.setExpression(btn.dataset.expr);
        document.querySelectorAll('[data-expr]').forEach(b =>
          b.classList.toggle('active', b === btn));
      });
    });

    // Debug: mouth slider
    const slider   = document.getElementById('mouth-slider');
    const mouthVal = document.getElementById('mouth-val');
    if (slider) {
      slider.addEventListener('input', () => {
        const v = Number(slider.value) / 100;
        if (mouthVal) mouthVal.textContent = v.toFixed(2);
        this._Mo.setMouthOpen(v);
      });
    }

    // Debug: caption presets
    document.querySelectorAll('[data-caption]').forEach(btn => {
      btn.addEventListener('click', () => this.setCaption(btn.dataset.caption));
    });
  }

  // ── Talk demo (debug panel only) ─────────────────────────────────────────────
  _talkDemoRaf   = null;
  _talkDemoPhase = 0;

  _startTalkDemo() {
    this._stopTalkDemo();
    let last = performance.now();
    const loop = (ts) => {
      const dt = ts - last;
      last = ts;
      this._talkDemoPhase += dt * 0.006;
      const v = Math.abs(Math.sin(this._talkDemoPhase)) * 0.85;
      this._Mo.setMouthOpen(v);

      const slider = document.getElementById('mouth-slider');
      const valEl  = document.getElementById('mouth-val');
      if (slider) slider.value      = String(Math.round(v * 100));
      if (valEl)  valEl.textContent = v.toFixed(2);

      this._talkDemoRaf = requestAnimationFrame(loop);
    };
    this._talkDemoRaf = requestAnimationFrame(loop);
  }

  _stopTalkDemo() {
    if (this._talkDemoRaf) {
      cancelAnimationFrame(this._talkDemoRaf);
      this._talkDemoRaf = null;
    }
    this._Mo.setMouthOpen(0);
  }
}
