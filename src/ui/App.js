// src/ui/App.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic kiosk UI shell.
// Halalholic brand: dark green background, orange accents, cream text.
// Includes:
//   • Animated background & ember particles
//   • Responsive kiosk character stage with audio glow
//   • Quick Scenario Chips for live client demonstrations
//   • Rich debug panel with 8 expressions & laugh trigger
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

    /* ── App Shell ── */
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
        ellipse 65% 55% at 50% 56%,
        color-mix(in srgb, var(--c-glow) 15%, transparent) 0%,
        transparent 72%
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

    /* ── Floating Embers ── */
    .ember {
      position: absolute;
      border-radius: 50%;
      background: var(--c-primary);
      pointer-events: none;
      z-index: 0;
      animation: ember-float linear infinite;
    }
    @keyframes ember-float {
      0%   { transform: translateY(0) scale(1); opacity: 0.7; }
      40%  { opacity: 0.5; }
      100% { transform: translateY(-90vh) scale(0.35); opacity: 0; }
    }

    /* ── Header ── */
    #header {
      position: relative; z-index: 10;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 28px 0;
      flex-shrink: 0;
    }

    #logo-icon {
      width: 46px; height: 46px;
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
      font-size: clamp(18px, 2.3vw, 25px);
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

    /* ── Character Stage ── */
    #stage {
      position: relative; z-index: 10;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 0;
    }

    #stage-glow {
      position: absolute;
      width: min(58vh, 500px);
      height: min(58vh, 500px);
      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--c-glow) 20%, transparent) 0%,
        transparent 70%
      );
      pointer-events: none;
      transition: transform 0.4s ease, opacity 0.4s ease;
      animation: glow-pulse 3.2s ease-in-out infinite;
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.85; transform: scale(1); }
      50%       { opacity: 1;    transform: scale(1.08); }
    }
    #stage-glow.talking {
      transform: scale(1.18);
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--c-glow) 32%, transparent) 0%,
        transparent 72%
      );
    }

    #mo-container {
      width: min(62vh, 520px);
      height: min(62vh, 520px);
      position: relative; z-index: 2;
      filter: drop-shadow(0 18px 45px rgba(0,0,0,0.55));
    }

    /* ── Caption Area ── */
    #caption-area {
      position: relative; z-index: 10;
      width: min(650px, 93vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      margin-bottom: 6px;
    }

    #caption-bubble {
      background: var(--c-surface);
      border: 1px solid color-mix(in srgb, var(--c-primary) 28%, transparent);
      border-left: 3.5px solid var(--c-primary);
      border-radius: 20px;
      padding: 13px 24px;
      text-align: center;
      font-size: clamp(15px, 1.8vw, 18px);
      line-height: 1.5;
      color: var(--c-text);
      transition: opacity 0.28s ease;
      width: 100%;
      box-shadow: 0 4px 28px rgba(0,0,0,0.4),
                  inset 0 0 0 1px color-mix(in srgb, white 4%, transparent);
    }

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

    #user-caption {
      font-size: 12px;
      color: var(--c-muted);
      text-align: center;
      padding: 4px 24px 0;
      width: 100%;
      height: 18px;
      opacity: 0;
      transition: opacity 0.3s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #user-caption.visible { opacity: 1; }

    /* ── Bottom Bar ── */
    #bottom-bar {
      position: relative; z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 0 20px 22px;
      flex-shrink: 0;
      width: 100%;
      max-width: 720px;
    }

    /* ── Quick Scenario Chips ── */
    #scenario-chips {
      display: flex;
      gap: 7px;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
    }
    .chip {
      background: rgba(14, 48, 46, 0.82);
      border: 1px solid color-mix(in srgb, var(--c-primary) 34%, transparent);
      color: var(--c-text);
      padding: 6px 13px;
      border-radius: 99px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      backdrop-filter: blur(8px);
      transition: all 0.2s ease;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .chip:hover {
      background: color-mix(in srgb, var(--c-primary) 22%, var(--c-surface));
      border-color: var(--c-primary);
      transform: translateY(-1.5px);
      box-shadow: 0 4px 14px color-mix(in srgb, var(--c-primary) 32%, transparent);
    }
    .chip:active {
      transform: translateY(0.5px) scale(0.97);
    }

    /* ── Talk Button ── */
    #talk-btn {
      padding: 17px 52px;
      border-radius: 99px;
      border: none;
      background: linear-gradient(135deg, var(--c-primary) 0%, #C84000 100%);
      color: white;
      font-size: clamp(16px, 2.1vw, 20px);
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
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
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

    /* ── Debug Panel ── */
    #debug-panel {
      position: fixed; top: 14px; right: 14px;
      z-index: 1000;
      background: rgba(8, 22, 10, 0.95);
      backdrop-filter: blur(14px);
      border: 1px solid color-mix(in srgb, var(--c-primary) 28%, transparent);
      border-radius: 18px;
      padding: 18px;
      width: 280px;
      display: none;
      flex-direction: column;
      gap: 9px;
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

    .debug-row { display: flex; gap: 5px; flex-wrap: wrap; }

    .dbg-btn {
      flex: 1; min-width: 0;
      padding: 7px 9px;
      border-radius: 9px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      color: var(--c-text);
      font-size: 11.5px; font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      white-space: nowrap; text-align: center;
    }
    .dbg-btn:hover  { background: rgba(255,255,255,0.1); }
    .dbg-btn.active {
      background: color-mix(in srgb, var(--c-primary) 24%, transparent);
      border-color: var(--c-primary);
      color: var(--c-primary);
    }

    .debug-label {
      font-size: 11px;
      color: var(--c-muted);
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-top: 3px;
    }

    input[type=range] {
      width: 100%;
      accent-color: var(--c-primary);
      cursor: pointer;
    }

    #debug-latency-val {
      font-size: 24px;
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

// ── HTML Template ─────────────────────────────────────────────────────────────
function buildHTML(config) {
  const embers = [
    { left: '15%',  bottom: '18%', size: '5px',   dur: '6s',   delay: '0s'   },
    { left: '28%',  bottom: '12%', size: '3.5px', dur: '8s',   delay: '2s'   },
    { left: '52%',  bottom: '22%', size: '4.5px', dur: '5s',   delay: '1s'   },
    { left: '68%',  bottom: '15%', size: '3px',   dur: '7s',   delay: '3.5s' },
    { left: '82%',  bottom: '20%', size: '4px',   dur: '9s',   delay: '0.5s' },
    { left: '38%',  bottom: '8%',  size: '2.5px', dur: '6.5s', delay: '4s'   },
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

    <!-- Character Stage -->
    <main id="stage">
      <div id="stage-glow"></div>
      <div id="mo-container"></div>
    </main>

    <!-- Caption -->
    <section id="caption-area">
      <div id="caption-bubble">${config.character.idleCaption}</div>
      <div id="user-caption"></div>
    </section>

    <!-- Bottom Bar -->
    <div id="bottom-bar">
      <!-- Quick Scenario Chips for Client Demo -->
      <div id="scenario-chips">
        <button class="chip" data-prompt="I have an exam tomorrow.">🎓 Exam tomorrow</button>
        <button class="chip" data-prompt="What should I order?">🍗 What's good?</button>
        <button class="chip" data-prompt="I brought the whole squad.">👥 Brought the squad</button>
        <button class="chip" data-prompt="I'm running late to class, what's quick?">🥙 Running late</button>
      </div>

      <button id="talk-btn">🎤&nbsp; Tap to Talk to Mo</button>
    </div>

    <!-- Debug Panel -->
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

      <div class="debug-label">Sample Speech</div>
      <div class="debug-row">
        <button class="dbg-btn" data-caption="Yo habibi! You came hungry, that's a problem I can fix.">Welcome</button>
        <button class="dbg-btn" data-caption="Extra Holic? That's not an add-on, habibi. That's a personality trait.">Extra Holic</button>
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
    const labels = { idle: 'Idle', listening: 'Listening', thinking: 'Thinking', talking: 'Talking' };
    this._statusEl.textContent = labels[state] || state;
    this._statusEl.className   = `state-${state}`;

    if (state === 'listening' || state === 'thinking' || state === 'talking') {
      this._talkBtn.textContent = '\uD83D\uDED1\u00A0 Tap to Stop';
      this._talkBtn.classList.toggle('listening', state === 'listening');
      this._stageGlow?.classList.toggle('talking', state === 'talking');
    } else {
      this._talkBtn.textContent = '\uD83C\uDFA4\u00A0 Tap to Talk to Mo';
      this._talkBtn.classList.remove('listening');
      this._stageGlow?.classList.remove('talking');
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
    }, 240);
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
    this._talkBtn.addEventListener('click', () => {
      this._onTalkPress?.(this._state);
    });

    // Quick Scenario Chips
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt;
        this._onChipClick?.(prompt);
      });
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

    document.getElementById('dbg-laugh-btn')?.addEventListener('click', () => {
      this._Mo.triggerLaugh();
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
      this._Mo.setSpeechCadence(v);
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
    this._Mo.setSpeechCadence(0);
  }
}
