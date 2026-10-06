// src/character/Mo.js
// ─────────────────────────────────────────────────────────────────────────────
// Mo – animated SVG restaurant mascot.
//
// Public API
//   Mo.init(containerEl)              – inject SVG into container
//   Mo.start()                        – begin animation loop
//   Mo.stop()                         – halt animation loop
//   Mo.setState('idle'|'listening'|'thinking'|'talking')
//   Mo.setExpression('happy'|'smug'|'surprised')
//   Mo.setMouthOpen(0..1)             – drive mouth shape from voice amplitude
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing helpers ────────────────────────────────────────────────────────────
const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp      = (a, b, t) => a + (b - a) * t;
const clamp     = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── SVG source ────────────────────────────────────────────────────────────────
// All groups are given explicit IDs so JS can grab and transform them.
function buildSVG() {
  return /* html */`
<svg id="mo-svg" viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg"
     style="width:100%;height:100%;overflow:visible;">
  <defs>
    <!-- Soft inner shadow for depth -->
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.4"/>
    </filter>
    <!-- Glow for eyes -->
    <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Cheek blush gradient -->
    <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF8FAB" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#FF8FAB" stop-opacity="0"/>
    </radialGradient>
    <!-- Skin gradient -->
    <radialGradient id="skinGrad" cx="45%" cy="38%" r="60%">
      <stop offset="0%" stop-color="#FFCC80"/>
      <stop offset="100%" stop-color="#F5A623"/>
    </radialGradient>
    <!-- Hat gradient -->
    <radialGradient id="hatGrad" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#E53935"/>
      <stop offset="100%" stop-color="#B71C1C"/>
    </radialGradient>
    <!-- Clip for eyelids -->
    <clipPath id="leftEyeClip">
      <ellipse cx="142" cy="232" rx="34" ry="32"/>
    </clipPath>
    <clipPath id="rightEyeClip">
      <ellipse cx="258" cy="232" rx="34" ry="32"/>
    </clipPath>
  </defs>

  <!-- ── Root transform group (breathing / head bob) ── -->
  <g id="mo-root" transform="translate(0,0)">

    <!-- ── Neck ── -->
    <rect x="175" y="368" width="50" height="42" rx="12"
          fill="#F5A623" filter="url(#softShadow)"/>

    <!-- ── Body (chef top) ── -->
    <ellipse cx="200" cy="440" rx="90" ry="55" fill="#FFFFFF" filter="url(#softShadow)"/>
    <!-- Body buttons -->
    <circle cx="200" cy="420" r="5" fill="#E0E0E0"/>
    <circle cx="200" cy="435" r="5" fill="#E0E0E0"/>
    <circle cx="200" cy="450" r="5" fill="#E0E0E0"/>
    <!-- Collar -->
    <path d="M155 405 Q200 420 245 405" stroke="#DDD" stroke-width="3" fill="none"/>

    <!-- ── Head ── -->
    <g id="mo-head" transform="translate(0,0)">

      <!-- Head base -->
      <ellipse cx="200" cy="265" rx="118" ry="115"
               fill="url(#skinGrad)" filter="url(#softShadow)"/>

      <!-- Ear left -->
      <ellipse cx="84" cy="272" rx="22" ry="28" fill="#F5A623"/>
      <ellipse cx="84" cy="272" rx="13" ry="18" fill="#FFD09B"/>
      <!-- Ear right -->
      <ellipse cx="316" cy="272" rx="22" ry="28" fill="#F5A623"/>
      <ellipse cx="316" cy="272" rx="13" ry="18" fill="#FFD09B"/>

      <!-- ── Cheeks ── -->
      <g id="mo-cheeks">
        <ellipse cx="122" cy="298" rx="30" ry="20" fill="url(#blushGrad)"/>
        <ellipse cx="278" cy="298" rx="30" ry="20" fill="url(#blushGrad)"/>
      </g>

      <!-- ── Eyebrows ── -->
      <g id="mo-eyebrows">
        <!-- Left eyebrow -->
        <path id="brow-left"
              d="M108 196 Q142 182 172 190"
              stroke="#5D3A1A" stroke-width="8" stroke-linecap="round" fill="none"/>
        <!-- Right eyebrow -->
        <path id="brow-right"
              d="M228 190 Q258 182 292 196"
              stroke="#5D3A1A" stroke-width="8" stroke-linecap="round" fill="none"/>
      </g>

      <!-- ── Eyes ── -->
      <g id="mo-eyes">
        <!-- Left eye white -->
        <ellipse id="eye-left-white" cx="142" cy="232" rx="34" ry="32" fill="#FFFFFF"/>
        <!-- Left iris -->
        <g clip-path="url(#leftEyeClip)">
          <ellipse id="eye-left-iris" cx="142" cy="232" rx="22" ry="22" fill="#3A2A0A"/>
          <!-- Pupil -->
          <ellipse id="pupil-left" cx="142" cy="232" rx="12" ry="12" fill="#1A1A1A"/>
          <!-- Highlight -->
          <ellipse cx="150" cy="225" rx="5" ry="5" fill="white" opacity="0.9"/>
          <ellipse cx="137" cy="238" rx="2.5" ry="2.5" fill="white" opacity="0.5"/>
        </g>

        <!-- Right eye white -->
        <ellipse id="eye-right-white" cx="258" cy="232" rx="34" ry="32" fill="#FFFFFF"/>
        <!-- Right iris -->
        <g clip-path="url(#rightEyeClip)">
          <ellipse id="eye-right-iris" cx="258" cy="232" rx="22" ry="22" fill="#3A2A0A"/>
          <!-- Pupil -->
          <ellipse id="pupil-right" cx="258" cy="232" rx="12" ry="12" fill="#1A1A1A"/>
          <!-- Highlight -->
          <ellipse cx="266" cy="225" rx="5" ry="5" fill="white" opacity="0.9"/>
          <ellipse cx="253" cy="238" rx="2.5" ry="2.5" fill="white" opacity="0.5"/>
        </g>

        <!-- ── Eyelids (cover eyes for blink) ── -->
        <g id="mo-eyelids">
          <!-- Left eyelid -->
          <ellipse id="lid-left" cx="142" cy="200" rx="36" ry="34"
                   fill="#F5A623" transform="translate(0, 0)"/>
          <!-- Right eyelid -->
          <ellipse id="lid-right" cx="258" cy="200" rx="36" ry="34"
                   fill="#F5A623" transform="translate(0, 0)"/>
        </g>
      </g>

      <!-- ── Nose ── -->
      <ellipse cx="200" cy="276" rx="14" ry="10" fill="#E8941A" opacity="0.7"/>
      <ellipse cx="193" cy="278" rx="5" ry="4" fill="#C47A10" opacity="0.5"/>
      <ellipse cx="207" cy="278" rx="5" ry="4" fill="#C47A10" opacity="0.5"/>

      <!-- ── Mouth ── -->
      <g id="mo-mouth" transform="translate(200, 318)">
        <!--
          All mouth shapes are drawn relative to this group's origin (0,0).
          JS morphs the path data between states.
        -->
        <!-- Mouth fill (inside) -->
        <path id="mouth-fill"
              d="M-28,0 Q0,16 28,0 Q28,4 0,4 Q-28,4 -28,0 Z"
              fill="#8B2020"/>
        <!-- Teeth -->
        <path id="mouth-teeth"
              d="M-22,2 Q0,14 22,2 L22,8 Q0,18 -22,8 Z"
              fill="#FFFFFF" opacity="0"/>
        <!-- Tongue -->
        <ellipse id="mouth-tongue" cx="0" cy="16" rx="14" ry="9"
                 fill="#FF6B6B" opacity="0"/>
        <!-- Mouth outline / lips -->
        <path id="mouth-shape"
              d="M-28,0 Q0,16 28,0"
              stroke="#8B2020" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Mouth corners (dimples) -->
        <circle cx="-28" cy="0" r="3.5" fill="#E8941A" opacity="0.6"/>
        <circle cx="28"  cy="0" r="3.5" fill="#E8941A" opacity="0.6"/>
      </g>

      <!-- ── Hat (chef) ── -->
      <g id="mo-hat">
        <!-- Hat brim -->
        <rect x="105" y="166" width="190" height="22" rx="8"
              fill="#CC2222" filter="url(#softShadow)"/>
        <!-- Hat body (tall chef cylinder) -->
        <rect x="130" y="52" width="140" height="120" rx="16"
              fill="url(#hatGrad)" filter="url(#softShadow)"/>
        <!-- Hat top curve -->
        <ellipse cx="200" cy="64" rx="70" ry="18" fill="#E53935"/>
        <!-- Hat highlights -->
        <rect x="148" y="68" width="12" height="95" rx="6" fill="white" opacity="0.12"/>
        <rect x="167" y="62" width="6" height="100" rx="3" fill="white" opacity="0.08"/>
        <!-- Hat band -->
        <rect x="130" y="148" width="140" height="20" rx="0"
              fill="#B71C1C"/>
        <!-- Hat logo placeholder -->
        <text x="200" y="108" text-anchor="middle" font-family="Arial Black, sans-serif"
              font-size="22" font-weight="900" fill="white" opacity="0.9"
              letter-spacing="1">MO</text>
      </g>

    </g><!-- end mo-head -->
  </g><!-- end mo-root -->
</svg>`;
}

// ── State machine ──────────────────────────────────────────────────────────────
const STATES      = ['idle', 'listening', 'thinking', 'talking'];
const EXPRESSIONS = ['happy', 'smug', 'surprised'];

// ── Internal state ─────────────────────────────────────────────────────────────
let _svg       = null;
let _rafId     = null;
let _running   = false;
let _state     = 'idle';
let _expr      = 'happy';
let _mouthOpen = 0;   // 0..1 driven externally

// Animated values (all in "target → current" spring pairs)
const anim = {
  // Breathing / bob
  breathPhase: 0,
  bobPhase:    0,
  rootY:       { cur: 0, tgt: 0 },

  // Blink
  lidY:        { cur: -34, tgt: -34 },   // eyelid Y offset (negative = hidden above eye)
  blinkTimer:  randomBlinkDelay(),
  isBlinking:  false,
  blinkPhase:  0,

  // Brow Y offsets (0 = neutral; negative = raised; positive = furrowed)
  browLeftY:   { cur: 0, tgt: 0 },
  browRightY:  { cur: 0, tgt: 0 },

  // Eye scale
  eyeScale:    { cur: 1, tgt: 1 },

  // Pupil offset
  pupilX:      { cur: 0, tgt: 0 },
  pupilY:      { cur: 0, tgt: 0 },

  // Head lean
  headTilt:    { cur: 0, tgt: 0 },   // rotate degrees
  headX:       { cur: 0, tgt: 0 },   // translate X

  // Mouth
  mouthOpenCur: 0,

  // Talking bounce
  talkBounce:  0,
};

function randomBlinkDelay() {
  return 3000 + Math.random() * 2000;
}

// Spring – moves current toward target with smooth damping
function spring(obj, stiffness = 0.12) {
  obj.cur = lerp(obj.cur, obj.tgt, stiffness);
}

// ── DOM helpers ───────────────────────────────────────────────────────────────
function el(id) {
  return _svg ? _svg.querySelector('#' + id) : null;
}

function setAttr(id, attr, val) {
  const e = el(id);
  if (e) e.setAttribute(attr, val);
}

function setStyle(id, prop, val) {
  const e = el(id);
  if (e) e.style[prop] = val;
}

// ── Mouth morphing ────────────────────────────────────────────────────────────
// Four keyframe shapes at open = 0, 0.33, 0.66, 1.0
// Each is: { shape (path d), fill (path d), teethOpacity, tongueOpacity }
const MOUTH_SHAPES = [
  // Closed – confident smirk
  {
    shape:  'M-28,0 Q0,14 28,0',
    fill:   'M-28,0 Q0,14 28,0 Q28,2 0,2 Q-28,2 -28,0 Z',
    teeth:  0,
    tongue: 0,
  },
  // Small open
  {
    shape:  'M-26,2 Q0,22 26,2',
    fill:   'M-26,2 Q0,24 26,2 Q26,16 0,20 Q-26,16 -26,2 Z',
    teeth:  0.6,
    tongue: 0,
  },
  // Wide open
  {
    shape:  'M-30,4 Q0,30 30,4',
    fill:   'M-30,4 Q0,32 30,4 Q30,22 0,28 Q-30,22 -30,4 Z',
    teeth:  1,
    tongue: 0.5,
  },
  // Round "O"
  {
    shape:  'M-20,0 Q-26,20 0,28 Q26,20 20,0 Q0,-8 -20,0 Z',
    fill:   'M-20,0 Q-26,20 0,28 Q26,20 20,0 Q0,-8 -20,0 Z',
    teeth:  0,
    tongue: 0.8,
  },
];

function getMouthShape(t) {
  t = clamp(t, 0, 1);
  const segments = MOUTH_SHAPES.length - 1;
  const scaled   = t * segments;
  const idx      = Math.min(Math.floor(scaled), segments - 1);
  const frac     = scaled - idx;
  const a        = MOUTH_SHAPES[idx];
  const b        = MOUTH_SHAPES[idx + 1];
  // For path morphing we linearly interpolate numeric coords by swapping strings
  // (simple approach – shapes are designed to have the same number of commands)
  return {
    shape:  a.shape,   // We'll switch at thresholds for simplicity
    fill:   a.fill,
    teeth:  lerp(a.teeth,  b.teeth,  frac),
    tongue: lerp(a.tongue, b.tongue, frac),
    // Pass raw t for direct path selection
    t,
    idx,
    frac,
  };
}

function applyMouth(t) {
  t = clamp(t, 0, 1);
  // Pick nearest discrete shape for the outline (morphing complex SVG paths
  // requires a library; this gives a clean 4-step approach)
  const step = Math.round(t * (MOUTH_SHAPES.length - 1));
  const ms   = MOUTH_SHAPES[step];
  setAttr('mouth-shape', 'd', ms.shape);
  setAttr('mouth-fill',  'd', ms.fill);

  const teethEl  = el('mouth-teeth');
  const tongueEl = el('mouth-tongue');
  if (teethEl)  teethEl.setAttribute('opacity',  String(ms.teeth));
  if (tongueEl) tongueEl.setAttribute('opacity', String(ms.tongue));
}

// ── Brow path helpers ──────────────────────────────────────────────────────────
function applyBrows() {
  const ly = anim.browLeftY.cur;
  const ry = anim.browRightY.cur;
  // Left brow
  setAttr('brow-left',  'd', `M108 ${196 + ly} Q142 ${182 + ly} 172 ${190 + ly}`);
  // Right brow
  setAttr('brow-right', 'd', `M228 ${190 + ry} Q258 ${182 + ry} 292 ${196 + ry}`);
}

// ── Eye scale ─────────────────────────────────────────────────────────────────
function applyEyes() {
  const s = anim.eyeScale.cur;
  ['eye-left-white', 'eye-right-white'].forEach((id, i) => {
    const cx = i === 0 ? 142 : 258;
    const e  = el(id);
    if (e) {
      e.setAttribute('ry', String(32 * s));
    }
  });
}

// ── Pupil position ────────────────────────────────────────────────────────────
function applyPupils() {
  const px = anim.pupilX.cur;
  const py = anim.pupilY.cur;
  ['pupil-left', 'pupil-right',
   'eye-left-iris', 'eye-right-iris'].forEach((id, i) => {
    const baseCx = i % 2 === 0 ? (i < 2 ? 142 : 142) : (i < 2 ? 258 : 258);
    const e = el(id);
    if (e) {
      const cx = (i === 0 || i === 2) ? 142 : 258;
      e.setAttribute('cx', String(cx + px));
      e.setAttribute('cy', String(232 + py));
    }
  });
}

// ── Blink ─────────────────────────────────────────────────────────────────────
function applyLids(openAmount) {
  // openAmount 0 = fully open (lids hidden), 1 = fully closed
  // Lid Y: at 0 → lids above eye (y offset -34), at 1 → lids cover eye (y offset +32)
  const yOffset = lerp(-34, 36, openAmount);
  ['lid-left', 'lid-right'].forEach(id => {
    const e = el(id);
    if (e) {
      const baseCy = id === 'lid-left' ? 200 : 200;
      e.setAttribute('cy', String(baseCy + yOffset));
    }
  });
}

// ── State → target values ─────────────────────────────────────────────────────
const STATE_TARGETS = {
  idle: {
    browLeftY:  0,
    browRightY: 0,
    eyeScale:   1,
    pupilX:     0,
    pupilY:     0,
    headTilt:   0,
    headX:      0,
  },
  listening: {
    browLeftY:  -14,
    browRightY: -14,
    eyeScale:   1.2,
    pupilX:     0,
    pupilY:     0,
    headTilt:   4,
    headX:      6,
  },
  thinking: {
    browLeftY:  -12,
    browRightY:  4,
    eyeScale:   1.0,
    pupilX:     10,
    pupilY:    -10,
    headTilt:  -6,
    headX:     -8,
  },
  talking: {
    browLeftY:  -6,
    browRightY: -6,
    eyeScale:   1.05,
    pupilX:     0,
    pupilY:     0,
    headTilt:   0,
    headX:      0,
  },
};

const EXPR_TARGETS = {
  happy: {
    browLeftY:  -4,
    browRightY: -4,
  },
  smug: {
    browLeftY:   0,
    browRightY: -10,
  },
  surprised: {
    browLeftY:  -18,
    browRightY: -18,
    eyeScale:    1.3,
  },
};

function applyStateTargets() {
  const st = STATE_TARGETS[_state] || STATE_TARGETS.idle;
  const ex = EXPR_TARGETS[_expr]   || EXPR_TARGETS.happy;

  // Merge: expression overrides state brows, state overrides everything else
  anim.browLeftY.tgt   = st.browLeftY   + (ex.browLeftY  ?? 0);
  anim.browRightY.tgt  = st.browRightY  + (ex.browRightY ?? 0);
  anim.eyeScale.tgt    = Math.max(st.eyeScale, ex.eyeScale ?? 1);
  anim.pupilX.tgt      = st.pupilX;
  anim.pupilY.tgt      = st.pupilY;
  anim.headTilt.tgt    = st.headTilt;
  anim.headX.tgt       = st.headX;
}

// ── Main animation loop ────────────────────────────────────────────────────────
let _lastTs = 0;

function tick(ts) {
  if (!_running) return;
  const dt = Math.min(ts - _lastTs, 50); // cap at 50ms to prevent jumps
  _lastTs  = ts;

  // ── Breathing ──────────────────────────────────────────────────────────────
  anim.breathPhase += dt * 0.001;   // ~1 cycle / sec
  anim.bobPhase    += dt * 0.0006;  // ~0.6 cycle / sec

  const breathAmp = _state === 'idle' ? 5 : (_state === 'talking' ? 3 : 4);
  const bobAmp    = _state === 'idle' ? 3 : (_state === 'listening' ? 5 : 2);
  const breathY   = Math.sin(anim.breathPhase) * breathAmp;
  const bobY      = Math.sin(anim.bobPhase)    * bobAmp;

  // ── Talking bounce ─────────────────────────────────────────────────────────
  let talkBounceY = 0;
  if (_state === 'talking') {
    anim.talkBounce += dt * 0.012;
    talkBounceY = Math.abs(Math.sin(anim.talkBounce)) * 6 * _mouthOpen;
  }

  // ── Apply root transform ───────────────────────────────────────────────────
  const rootGroup = el('mo-root');
  if (rootGroup) {
    const ty = breathY + bobY - talkBounceY;
    rootGroup.setAttribute('transform', `translate(0, ${ty.toFixed(2)})`);
  }

  // ── Head tilt / shift ──────────────────────────────────────────────────────
  spring(anim.headX,    0.07);
  spring(anim.headTilt, 0.07);
  const headGroup = el('mo-head');
  if (headGroup) {
    const tx = anim.headX.cur;
    const r  = anim.headTilt.cur;
    headGroup.setAttribute('transform',
      `translate(${tx.toFixed(2)}, 0) rotate(${r.toFixed(2)}, 200, 265)`);
  }

  // ── Brows ──────────────────────────────────────────────────────────────────
  spring(anim.browLeftY,  0.09);
  spring(anim.browRightY, 0.09);
  applyBrows();

  // ── Eyes ───────────────────────────────────────────────────────────────────
  spring(anim.eyeScale, 0.08);
  applyEyes();

  // ── Pupils ─────────────────────────────────────────────────────────────────
  spring(anim.pupilX, 0.08);
  spring(anim.pupilY, 0.08);
  applyPupils();

  // ── Blink ──────────────────────────────────────────────────────────────────
  anim.blinkTimer -= dt;
  if (anim.blinkTimer <= 0 && !anim.isBlinking) {
    anim.isBlinking  = true;
    anim.blinkPhase  = 0;
    anim.blinkTimer  = randomBlinkDelay();
  }
  if (anim.isBlinking) {
    anim.blinkPhase += dt * 0.012;   // blink lasts ~250ms
    const closedness = easeInOut(Math.min(anim.blinkPhase, 1));
    // Close then open
    const open = anim.blinkPhase < 1
      ? closedness
      : 2 - closedness;  // will overshoot, clamp
    applyLids(clamp(open, 0, 1));
    if (anim.blinkPhase >= 2) {
      anim.isBlinking = false;
      applyLids(0);
    }
  }

  // ── Mouth ──────────────────────────────────────────────────────────────────
  const mouthTarget = _state === 'talking' ? _mouthOpen : 0;
  anim.mouthOpenCur = lerp(anim.mouthOpenCur, mouthTarget, 0.2);
  applyMouth(anim.mouthOpenCur);

  _rafId = requestAnimationFrame(tick);
}

// ── Public API ────────────────────────────────────────────────────────────────
export const Mo = {
  /**
   * Inject Mo's SVG into the given container element and grab all sub-elements.
   */
  init(containerEl) {
    containerEl.innerHTML = buildSVG();
    _svg = containerEl.querySelector('#mo-svg');
    // Set initial state
    applyLids(0);
    applyBrows();
    applyMouth(0);
    applyStateTargets();
  },

  /** Begin the animation loop. */
  start() {
    if (_running) return;
    _running = true;
    _lastTs  = performance.now();
    _rafId   = requestAnimationFrame(tick);
  },

  /** Halt the animation loop. */
  stop() {
    _running = false;
    if (_rafId) cancelAnimationFrame(_rafId);
    _rafId = null;
  },

  /**
   * Switch Mo's state.
   * @param {'idle'|'listening'|'thinking'|'talking'} state
   */
  setState(state) {
    if (!STATES.includes(state)) return;
    _state = state;
    applyStateTargets();
  },

  /**
   * Set Mo's facial expression.
   * @param {'happy'|'smug'|'surprised'} expr
   */
  setExpression(expr) {
    if (!EXPRESSIONS.includes(expr)) return;
    _expr = expr;
    applyStateTargets();
  },

  /**
   * Drive mouth openness from external audio amplitude.
   * @param {number} value – 0 (closed) to 1 (wide open)
   */
  setMouthOpen(value) {
    _mouthOpen = clamp(value, 0, 1);
  },

  /** Current state. */
  get state() { return _state; },

  /** Current expression. */
  get expression() { return _expr; },
};
