// src/character/Mo.js
// ─────────────────────────────────────────────────────────────────────────────
// Mo — Halalholic mascot. 2D flat SVG character with spring-physics animation.
//
// Visual identity (from the Halalholic creative brief):
//   • Pita-wrap face  — round, warm toasted bread texture
//   • Lettuce hair    — thick green curly crown
//   • Orange hoodie   — Halalholic branded with H logo
//   • Gray sweatpants — streetwear college style
//   • White Crocs     — with holes detail
//   • Headphones      — over-ear black with orange LED
//   • Snapback cap    — dark green with H + orange brim
//
// Public API:
//   Mo.init(containerEl)
//   Mo.start() / Mo.stop()
//   Mo.setState('idle'|'listening'|'thinking'|'talking')
//   Mo.setExpression('happy'|'smug'|'excited'|'thinking'|'surprised'|'wink')
//   Mo.setMouthOpen(0..1)
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing ────────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t)   { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function clamp(v,a,b)   { return Math.max(a, Math.min(b, v)); }

// ── SVG template ──────────────────────────────────────────────────────────────
function buildSVG() {
  return /* html */`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 590" id="mo-svg"
     style="width:100%;height:100%;overflow:visible;">
  <defs>
    <!-- Pita face gradient: warm center, toasted edges -->
    <radialGradient id="pita-grad" cx="44%" cy="36%" r="65%">
      <stop offset="0%"   stop-color="#F5D9B0"/>
      <stop offset="50%"  stop-color="#EAC89C"/>
      <stop offset="100%" stop-color="#C8944E"/>
    </radialGradient>
    <!-- Hoodie gradient -->
    <radialGradient id="hoodie-grad" cx="50%" cy="20%" r="80%">
      <stop offset="0%"   stop-color="#FF8028"/>
      <stop offset="100%" stop-color="#E04E00"/>
    </radialGradient>
    <!-- Drop shadow for face -->
    <filter id="face-shadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
    <!-- Soft body shadow -->
    <filter id="body-shadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="rgba(0,0,0,0.35)"/>
    </filter>
  </defs>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- ROOT GROUP — breathing / idle Y bob                        -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <g id="mo-root">

    <!-- ───────────────────────────────────────────────────────── -->
    <!-- BODY (drawn first, appears behind head)                   -->
    <!-- ───────────────────────────────────────────────────────── -->
    <g id="mo-body-group" filter="url(#body-shadow)">

      <!-- Backpack hint (left side, partially behind hoodie) -->
      <rect x="85" y="285" width="46" height="72" rx="11" fill="#14142A" opacity="0.92"/>
      <rect x="91" y="293" width="35" height="57" rx="8"  fill="#1E1E38"/>
      <rect x="95" y="300" width="27" height="10" rx="4"  fill="#14142A" opacity="0.6"/>
      <rect x="95" y="316" width="27" height="10" rx="4"  fill="#14142A" opacity="0.6"/>

      <!-- ── SWEATPANTS ── -->
      <!-- Left leg -->
      <path d="M 146 464 L 133 550 Q 131 562 152 562 L 174 562 Q 186 562 184 550 L 176 464 Z"
            fill="#B8B8C8"/>
      <!-- Right leg -->
      <path d="M 224 464 L 218 550 Q 216 562 228 562 L 250 562 Q 268 562 268 550 L 256 464 Z"
            fill="#B8B8C8"/>
      <!-- Waistband -->
      <rect x="106" y="454" width="188" height="20" rx="7" fill="#A5A5B8"/>
      <!-- Left ankle cuff -->
      <rect x="130" y="547" width="56" height="14" rx="6" fill="#A5A5B8"/>
      <!-- Right ankle cuff -->
      <rect x="214" y="547" width="56" height="14" rx="6" fill="#A5A5B8"/>
      <!-- Sweatpants seam lines (subtle) -->
      <line x1="161" y1="475" x2="157" y2="545" stroke="#A0A0B5" stroke-width="1.5" opacity="0.5"/>
      <line x1="241" y1="475" x2="244" y2="545" stroke="#A0A0B5" stroke-width="1.5" opacity="0.5"/>

      <!-- ── CROCS ── -->
      <!-- Left croc body -->
      <ellipse cx="153" cy="571" rx="35" ry="13" fill="#E5DFD2"/>
      <ellipse cx="153" cy="565" rx="31" ry="10" fill="#F0EBE0"/>
      <!-- Left holes -->
      <circle cx="137" cy="561" r="3.5" fill="#D5CEC0"/>
      <circle cx="150" cy="559" r="3.5" fill="#D5CEC0"/>
      <circle cx="163" cy="561" r="3.5" fill="#D5CEC0"/>
      <!-- Right croc body -->
      <ellipse cx="247" cy="571" rx="35" ry="13" fill="#E5DFD2"/>
      <ellipse cx="247" cy="565" rx="31" ry="10" fill="#F0EBE0"/>
      <!-- Right holes -->
      <circle cx="231" cy="561" r="3.5" fill="#D5CEC0"/>
      <circle cx="244" cy="559" r="3.5" fill="#D5CEC0"/>
      <circle cx="257" cy="561" r="3.5" fill="#D5CEC0"/>

      <!-- ── HOODIE ── -->
      <path id="mo-hoodie"
        d="M 154 272
           C 126 283, 108 308, 102 348
           L 96  468 Q 96  480 108 480
           L 292 480 Q 304 480 304 468
           L 298 348 C 292 308, 274 283, 246 272
           Q 224 280, 200 280
           Q 176 280, 154 272 Z"
        fill="url(#hoodie-grad)"/>

      <!-- Hood neckline fold -->
      <path d="M 158 274 Q 200 270, 242 274 Q 222 290, 200 292 Q 178 290, 158 274 Z"
            fill="#D04800" opacity="0.65"/>

      <!-- Center seam -->
      <line x1="200" y1="294" x2="200" y2="466" stroke="#C84400" stroke-width="2" opacity="0.5"/>

      <!-- Kangaroo pocket -->
      <path d="M 166 390 Q 164 428, 200 428 Q 236 428, 234 390 Q 233 376, 200 376 Q 167 376, 166 390 Z"
            fill="#C84400" opacity="0.55"/>
      <path d="M 166 390 Q 164 428, 200 428 Q 236 428, 234 390"
            fill="none" stroke="#B03C00" stroke-width="1.5" opacity="0.7"/>

      <!-- H logo badge on chest -->
      <circle cx="200" cy="338" r="24" fill="#0E302E" opacity="0.95"/>
      <circle cx="200" cy="338" r="20" fill="#0A2820"/>
      <text x="200" y="346" font-size="26" font-weight="900" fill="#FF6A00"
            font-family="'Arial Black', 'Arial Bold', Impact, sans-serif"
            text-anchor="middle">H</text>

      <!-- Hoodie sleeve hints (arms at sides) -->
      <!-- Left sleeve -->
      <path d="M 102 340 Q 82 360, 86 408 Q 86 418 96 416 L 104 390 Z"
            fill="#E05500" opacity="0.85"/>
      <!-- Right sleeve -->
      <path d="M 298 340 Q 318 360, 314 408 Q 314 418 304 416 L 296 390 Z"
            fill="#E05500" opacity="0.85"/>
    </g>

    <!-- Neck -->
    <rect id="mo-neck" x="182" y="263" width="36" height="24" rx="8" fill="#DBA878"/>

    <!-- ───────────────────────────────────────────────────────── -->
    <!-- HEAD GROUP — tilt, sway, expressions                     -->
    <!-- (rotates around base of neck: x=200, y=270)              -->
    <!-- ───────────────────────────────────────────────────────── -->
    <g id="mo-head">

      <!-- ── LETTUCE HAIR (behind face, forms crown) ── -->
      <g id="mo-lettuce">
        <!-- Shadow layer under lettuce -->
        <ellipse cx="200" cy="120" rx="90" ry="28" fill="#2E6010" opacity="0.45"/>
        <!-- Far outer lobes -->
        <ellipse cx="113" cy="140" rx="28" ry="26" fill="#4A8B1F" transform="rotate(-18 113 140)"/>
        <ellipse cx="287" cy="140" rx="28" ry="26" fill="#4A8B1F" transform="rotate(18 287 140)"/>
        <!-- Mid lobes -->
        <ellipse cx="146" cy="124" rx="34" ry="32" fill="#55A024"/>
        <ellipse cx="254" cy="124" rx="34" ry="32" fill="#55A024"/>
        <!-- Upper mid lobes -->
        <ellipse cx="168" cy="106" rx="30" ry="28" fill="#62B82A" transform="rotate(-6 168 106)"/>
        <ellipse cx="232" cy="106" rx="30" ry="28" fill="#62B82A" transform="rotate(6 232 106)"/>
        <!-- Center top lobe (dominant) -->
        <ellipse cx="200" cy="96"  rx="40" ry="37" fill="#70CC30"/>
        <!-- Highlight on center lobe -->
        <ellipse cx="190" cy="84"  rx="18" ry="13" fill="#88E040" opacity="0.65"/>
        <!-- Fill gap center-mid -->
        <ellipse cx="200" cy="128" rx="32" ry="24" fill="#60B828"/>
        <!-- Small accent lobes -->
        <ellipse cx="178" cy="92"  rx="18" ry="16" fill="#78D835" opacity="0.8"/>
        <ellipse cx="222" cy="92"  rx="18" ry="16" fill="#78D835" opacity="0.8"/>
      </g>

      <!-- ── FACE CIRCLE (pita) ── -->
      <circle id="mo-face" cx="200" cy="182" r="92"
              fill="url(#pita-grad)" filter="url(#face-shadow)"/>

      <!-- Face edge shading (depth) -->
      <circle cx="200" cy="182" r="92" fill="none"
              stroke="#B87840" stroke-width="3.5" opacity="0.35"/>

      <!-- Toasted marks (pita texture) -->
      <ellipse cx="142" cy="155" rx="15" ry="9" fill="#C08040"
               opacity="0.3" transform="rotate(-28 142 155)"/>
      <ellipse cx="258" cy="210" rx="13" ry="8" fill="#C08040"
               opacity="0.22" transform="rotate(22 258 210)"/>
      <ellipse cx="200" cy="254" rx="20" ry="9" fill="#C08040" opacity="0.18"/>

      <!-- ── CHEEK BLUSH (animated) ── -->
      <ellipse id="mo-cheek-left"  cx="138" cy="208" rx="24" ry="14"
               fill="#FF8C6A" opacity="0"/>
      <ellipse id="mo-cheek-right" cx="262" cy="208" rx="24" ry="14"
               fill="#FF8C6A" opacity="0"/>

      <!-- ─────────────────────────────── -->
      <!-- LEFT EYE                        -->
      <!-- ─────────────────────────────── -->
      <g id="mo-eye-left">
        <!-- Sclera (white) -->
        <ellipse id="eye-white-left" cx="168" cy="175" rx="27" ry="25" fill="white"/>
        <!-- Iris (dark green) -->
        <circle  id="eye-iris-left"  cx="168" cy="175" r="17"  fill="#1A3620"/>
        <!-- Pupil -->
        <circle  id="eye-pupil-left" cx="170" cy="176" r="10"  fill="#080A08"/>
        <!-- Main highlight -->
        <circle cx="177" cy="168" r="6"   fill="white"/>
        <!-- Secondary micro highlight -->
        <circle cx="162" cy="181" r="2.5" fill="rgba(255,255,255,0.55)"/>
      </g>
      <!-- Left eyelid (blink + wink) -->
      <ellipse id="mo-lid-left" cx="168" cy="175" rx="29" ry="0" fill="#EAC89C"/>

      <!-- ─────────────────────────────── -->
      <!-- RIGHT EYE                       -->
      <!-- ─────────────────────────────── -->
      <g id="mo-eye-right">
        <ellipse id="eye-white-right" cx="232" cy="175" rx="27" ry="25" fill="white"/>
        <circle  id="eye-iris-right"  cx="232" cy="175" r="17"  fill="#1A3620"/>
        <circle  id="eye-pupil-right" cx="234" cy="176" r="10"  fill="#080A08"/>
        <circle cx="241" cy="168" r="6"   fill="white"/>
        <circle cx="226" cy="181" r="2.5" fill="rgba(255,255,255,0.55)"/>
      </g>
      <!-- Right eyelid (blink) -->
      <ellipse id="mo-lid-right" cx="232" cy="175" rx="29" ry="0" fill="#EAC89C"/>

      <!-- ─────────────────────────────── -->
      <!-- EYEBROWS                        -->
      <!-- ─────────────────────────────── -->
      <!-- Left brow (animated via d attribute) -->
      <path id="mo-brow-left"
        d="M 141 151 Q 157 143 178 148"
        fill="none" stroke="#2A160A" stroke-width="7.5" stroke-linecap="round"/>
      <!-- Right brow (animated via d attribute) -->
      <path id="mo-brow-right"
        d="M 222 148 Q 243 143 259 151"
        fill="none" stroke="#2A160A" stroke-width="7.5" stroke-linecap="round"/>

      <!-- ─────────────────────────────── -->
      <!-- MOUTH                           -->
      <!-- ─────────────────────────────── -->
      <g id="mo-mouth">
        <!-- Dark mouth cavity (oval — grows with lip sync) -->
        <ellipse id="mouth-cavity" cx="200" cy="228" rx="0" ry="0" fill="#280A02"/>
        <!-- Tongue (appears when wide open) -->
        <ellipse id="mouth-tongue" cx="200" cy="236" rx="0" ry="0" fill="#CC5050"/>
        <!-- Upper teeth -->
        <rect id="mouth-teeth" x="184" y="219" width="32" height="10" rx="4"
              fill="#F8F6F2" opacity="0"/>
        <!-- Mouth outline / smile line -->
        <path id="mouth-line"
          d="M 179 223 Q 200 231 221 223"
          fill="none" stroke="#2A160A" stroke-width="3.5" stroke-linecap="round"/>
      </g>

      <!-- ── HEADPHONES (over face/lettuce) ── -->
      <g id="mo-headphones">
        <!-- Band arc -->
        <path d="M 108 191 A 94 98 0 0 1 292 191"
              fill="none" stroke="#10101E" stroke-width="9.5" stroke-linecap="round"/>
        <!-- Left cup outer -->
        <circle cx="105" cy="193" r="20" fill="#1A1A2C"/>
        <!-- Left cup inner (speaker mesh look) -->
        <circle cx="105" cy="193" r="14" fill="#0C0C1A"/>
        <circle cx="100" cy="190" r="2.2" fill="#252540"/>
        <circle cx="109" cy="190" r="2.2" fill="#252540"/>
        <circle cx="105" cy="198" r="2.2" fill="#252540"/>
        <!-- Right cup outer -->
        <circle cx="295" cy="193" r="20" fill="#1A1A2C"/>
        <!-- Right cup inner -->
        <circle cx="295" cy="193" r="14" fill="#0C0C1A"/>
        <circle cx="290" cy="190" r="2.2" fill="#252540"/>
        <circle cx="299" cy="190" r="2.2" fill="#252540"/>
        <circle cx="295" cy="198" r="2.2" fill="#252540"/>
        <!-- LED indicator (orange glow) on left cup -->
        <circle cx="93"  cy="182" r="5"   fill="#FF6A00" opacity="0.95"/>
        <circle cx="93"  cy="182" r="2.5" fill="#FFAA60"/>
      </g>

      <!-- ── SNAPBACK CAP ── -->
      <g id="mo-cap">
        <!-- Cap main dome -->
        <path d="M 143 112 Q 147 70, 200 63 Q 253 70, 257 112 Z"
              fill="#0E302E"/>
        <ellipse cx="200" cy="72" rx="57" ry="22" fill="#0E302E"/>
        <!-- Cap sweatband / lower band -->
        <rect x="141" y="109" width="118" height="15" rx="5" fill="#0A2520"/>
        <!-- Cap brim (visor — extends slightly right for 3/4 feel) -->
        <path d="M 197 123 Q 268 124, 276 128 Q 277 134, 268 134
                 Q 200 132, 197 128 Z" fill="#081E1A"/>
        <!-- Front panel (slightly lighter) -->
        <path d="M 163 110 Q 165 76, 200 70 Q 235 76, 237 110 Z"
              fill="#0F3530"/>
        <!-- H logo on cap -->
        <text x="200" y="105" font-size="22" font-weight="900" fill="#FF6A00"
              font-family="'Arial Black', Impact, sans-serif"
              text-anchor="middle">H</text>
        <!-- Tiny brand text above H -->
        <text x="200" y="90" font-size="6.5" fill="#72CC38"
              font-family="Arial, Helvetica, sans-serif"
              text-anchor="middle" letter-spacing="1.2">HALALHOLIC</text>
      </g>

    </g>
    <!-- end mo-head -->

  </g>
  <!-- end mo-root -->
</svg>
`;
}

// ── Animation state ────────────────────────────────────────────────────────────
// All values animate via spring lerp toward their targets.
const anim = {
  // Head
  headTiltZ:   { cur: 0,    tgt: 0    },  // degrees
  headX:       { cur: 0,    tgt: 0    },  // px
  headY:       { cur: 0,    tgt: 0    },  // px (breathing)
  // Body (breathing, opposite phase)
  bodyY:       { cur: 0,    tgt: 0    },
  // Eyebrows (negative Y = raised)
  browLY:      { cur: 0,    tgt: 0    },
  browRY:      { cur: 0,    tgt: 0    },
  browLSlant:  { cur: 0,    tgt: 0    },  // inner end offset
  browRSlant:  { cur: 0,    tgt: 0    },
  // Eyes
  eyeScaleY:   { cur: 1,    tgt: 1    },  // squint (< 1)
  // Pupils
  pupilX:      { cur: 0,    tgt: 0    },
  pupilY:      { cur: 0,    tgt: 0    },
  // Mouth
  mouthOpen:   { cur: 0,    tgt: 0    },  // 0-1 (lip sync)
  mouthSmile:  { cur: 0.2,  tgt: 0.2  },  // -1=frown, 0=neutral, 1=smile
  mouthSkew:   { cur: 0,    tgt: 0    },  // smirk direction (-1 left, 1 right)
  // Cheeks
  cheekOpacity:{ cur: 0,    tgt: 0    },
  // Eyelids
  lidBoth:     { cur: 0,    tgt: 0    },  // 0=open, 1=closed
  lidLeft:     { cur: 0,    tgt: 0    },  // wink: only left lid
};

// ── State targets ─────────────────────────────────────────────────────────────
const STATE_TARGETS = {
  idle:      { browLY: 0,   browRY: 0,   eyeSY: 1,     smile:  0.25, skew: 0,   tilt: 0,    cheek: 0    },
  listening: { browLY: -4,  browRY: -4,  eyeSY: 1.06,  smile:  0.18, skew: 0,   tilt: 2.5,  cheek: 0    },
  thinking:  { browLY: -5,  browRY: 3.5, eyeSY: 0.86,  smile:  0,    skew: 0,   tilt: -4.5, cheek: 0    },
  talking:   { browLY: -2,  browRY: -2,  eyeSY: 1,     smile:  0.48, skew: 0,   tilt: 1.5,  cheek: 0.22 },
};

// ── Expression targets (additive modifiers on top of state) ──────────────────
const EXPR_TARGETS = {
  happy:     { browLY: -3,   browRY: -3,  browLS: 0,   browRS: 0,   eyeSY: 1.08, smile: 0.72, skew: 0,    tilt: 0,    cheek: 0.45 },
  smug:      { browLY: 4,    browRY: -8,  browLS: 2,   browRS: -4,  eyeSY: 0.82, smile: 0.32, skew: 0.55, tilt: -7,   cheek: 0    },
  excited:   { browLY: -10,  browRY: -10, browLS: 0,   browRS: 0,   eyeSY: 1.25, smile: 0.92, skew: 0,    tilt: 3.5,  cheek: 0.7  },
  thinking:  { browLY: -5,   browRY: 5,   browLS: 3,   browRS: -2,  eyeSY: 0.80, smile: -0.1, skew: 0,    tilt: -5.5, cheek: 0    },
  surprised: { browLY: -12,  browRY: -12, browLS: 0,   browRS: 0,   eyeSY: 1.35, smile: 0.1,  skew: 0,    tilt: 0,    cheek: 0.2  },
  wink:      { browLY: -3,   browRY: -4,  browLS: 0,   browRS: 0,   eyeSY: 1.05, smile: 0.62, skew: 0.2,  tilt: 2.5,  cheek: 0.32 },
};

// ── State machine ─────────────────────────────────────────────────────────────
let _state      = 'idle';
let _expression = 'happy';

function applyStateAndExpression() {
  const s  = STATE_TARGETS[_state]   || STATE_TARGETS.idle;
  const e  = EXPR_TARGETS[_expression] || EXPR_TARGETS.happy;

  anim.browLY.tgt      = s.browLY  + e.browLY;
  anim.browRY.tgt      = s.browRY  + e.browRY;
  anim.browLSlant.tgt  = e.browLS  || 0;
  anim.browRSlant.tgt  = e.browRS  || 0;
  anim.eyeScaleY.tgt   = lerp(s.eyeSY, e.eyeSY, 0.6);
  anim.mouthSmile.tgt  = lerp(s.smile, e.smile, 0.65);
  anim.mouthSkew.tgt   = s.skew + e.skew;
  anim.headTiltZ.tgt   = s.tilt + e.tilt;
  anim.cheekOpacity.tgt= Math.max(s.cheek, e.cheek);
}

// ── Blink system ──────────────────────────────────────────────────────────────
let _blinkTimer   = 3000;
let _blinkPhase   = 0;   // 0=idle, 1=closing, 2=opening
let _winkActive   = false;

function updateBlink(dt) {
  if (_blinkPhase === 0) {
    _blinkTimer -= dt;
    if (_blinkTimer <= 0) {
      _blinkPhase = 1;
      _blinkTimer = 80 + Math.random() * 60; // close over 80-140ms
    }
    return;
  }
  _blinkTimer -= dt;
  const progress = Math.max(0, 1 - _blinkTimer / 100);

  if (_blinkPhase === 1) {
    // Closing
    anim.lidBoth.tgt = easeInOut(progress);
    if (_blinkTimer <= 0) {
      _blinkPhase = 2;
      _blinkTimer = 80 + Math.random() * 40;
    }
  } else if (_blinkPhase === 2) {
    // Opening
    anim.lidBoth.tgt = 1 - easeInOut(progress);
    if (_blinkTimer <= 0) {
      _blinkPhase  = 0;
      anim.lidBoth.tgt = 0;
      _blinkTimer = 2500 + Math.random() * 3000;
    }
  }
}

// ── Idle motion ───────────────────────────────────────────────────────────────
let _idlePhase = 0;
let _pupilWanderTimer = 0;
let _pupilTgtX = 0, _pupilTgtY = 0;

function updateIdleMotion(ts) {
  // Breathing: head bobs up a little, body bobs down (opposing phase)
  const breath = Math.sin(ts * 0.0014) * 4;
  anim.headY.tgt = breath;
  anim.bodyY.tgt = -breath * 0.5;

  // Slight idle head sway
  const sway = Math.sin(ts * 0.0007) * 1.5;
  // Only add sway in idle/listening states, not thinking (already tilted)
  if (_state === 'idle' || _state === 'listening' || _state === 'talking') {
    anim.headX.tgt = sway;
  }

  // Pupil wander (eyes drift slowly)
  _pupilWanderTimer -= 16;
  if (_pupilWanderTimer <= 0) {
    _pupilWanderTimer  = 1500 + Math.random() * 2500;
    _pupilTgtX         = (Math.random() - 0.5) * 8;
    _pupilTgtY         = (Math.random() - 0.5) * 5;
  }
  anim.pupilX.tgt = _pupilTgtX;
  anim.pupilY.tgt = _pupilTgtY;
}

// ── DOM element references (set after Mo.init()) ──────────────────────────────
let _els = {};

function grabElements() {
  _els = {
    root:       document.getElementById('mo-root'),
    head:       document.getElementById('mo-head'),
    face:       document.getElementById('mo-face'),
    bodyGroup:  document.getElementById('mo-body-group'),

    // Eyes
    eyeWhiteL:  document.getElementById('eye-white-left'),
    eyeWhiteR:  document.getElementById('eye-white-right'),
    pupilL:     document.getElementById('eye-pupil-left'),
    pupilR:     document.getElementById('eye-pupil-right'),
    irisL:      document.getElementById('eye-iris-left'),
    irisR:      document.getElementById('eye-iris-right'),

    // Lids
    lidL:       document.getElementById('mo-lid-left'),
    lidR:       document.getElementById('mo-lid-right'),

    // Brows
    browL:      document.getElementById('mo-brow-left'),
    browR:      document.getElementById('mo-brow-right'),

    // Cheeks
    cheekL:     document.getElementById('mo-cheek-left'),
    cheekR:     document.getElementById('mo-cheek-right'),

    // Mouth
    mouthCavity:document.getElementById('mouth-cavity'),
    mouthTongue:document.getElementById('mouth-tongue'),
    mouthTeeth: document.getElementById('mouth-teeth'),
    mouthLine:  document.getElementById('mouth-line'),
  };
}

// ── Apply functions ───────────────────────────────────────────────────────────

function applyHead() {
  const tilt = anim.headTiltZ.cur;
  const x    = anim.headX.cur;
  const y    = anim.headY.cur;
  // Rotate around base of neck (200, 270), then translate
  _els.head.setAttribute('transform',
    `translate(${x}, ${y}) rotate(${tilt.toFixed(2)}, 200, 270)`
  );
}

function applyRoot() {
  const y = anim.bodyY.cur;
  _els.root.setAttribute('transform', `translate(0, ${y.toFixed(2)})`);
}

function applyBrows() {
  const lY = anim.browLY.cur;
  const rY = anim.browRY.cur;
  const lS = anim.browLSlant.cur;  // inner end Y offset for left brow
  const rS = anim.browRSlant.cur;  // inner end Y offset for right brow

  // Left brow: M outer Q ctrl inner
  // Default: M 141 151 Q 157 143 178 148
  const lOY  = 151 + lY;
  const lCY  = 143 + lY * 0.85;
  const lIY  = 148 + lY + lS * 5;
  _els.browL.setAttribute('d',
    `M 141 ${lOY.toFixed(1)} Q 157 ${lCY.toFixed(1)} 178 ${lIY.toFixed(1)}`
  );

  // Right brow: M inner Q ctrl outer
  // Default: M 222 148 Q 243 143 259 151
  const rIY = 148 + rY + rS * 5;
  const rCY = 143 + rY * 0.85;
  const rOY = 151 + rY;
  _els.browR.setAttribute('d',
    `M 222 ${rIY.toFixed(1)} Q 243 ${rCY.toFixed(1)} 259 ${rOY.toFixed(1)}`
  );
}

function applyEyes() {
  const sY = anim.eyeScaleY.cur;
  const px = anim.pupilX.cur;
  const py = anim.pupilY.cur;

  // Eye squint via ry scale
  const baseRX = 27, baseRY = 25;
  const newRY  = clamp(baseRY * sY, 8, 30);

  _els.eyeWhiteL.setAttribute('ry', newRY.toFixed(1));
  _els.eyeWhiteR.setAttribute('ry', newRY.toFixed(1));

  // Scale iris proportionally
  const irisScale = clamp(sY * 0.9 + 0.1, 0.4, 1.0);
  _els.irisL.setAttribute('r', (17 * irisScale).toFixed(1));
  _els.irisR.setAttribute('r', (17 * irisScale).toFixed(1));

  // Pupils: base position offset + wander
  const clampedPX = clamp(px, -7, 7);
  const clampedPY = clamp(py, -5, 5);
  _els.pupilL.setAttribute('cx', (170 + clampedPX).toFixed(1));
  _els.pupilL.setAttribute('cy', (176 + clampedPY).toFixed(1));
  _els.pupilR.setAttribute('cx', (234 + clampedPX).toFixed(1));
  _els.pupilR.setAttribute('cy', (176 + clampedPY).toFixed(1));
}

function applyLids() {
  // Combined blink (both lids) + wink (left lid only)
  const blinkRY  = clamp(anim.lidBoth.cur, 0, 1) * 27;
  const winkRY   = clamp(anim.lidLeft.cur, 0, 1) * 27;

  _els.lidL.setAttribute('ry', Math.max(blinkRY, winkRY).toFixed(1));
  _els.lidR.setAttribute('ry', blinkRY.toFixed(1));
}

function applyMouth() {
  const open  = clamp(anim.mouthOpen.cur, 0, 1);
  const smile = anim.mouthSmile.cur;  // -1 to 1
  const skew  = anim.mouthSkew.cur;   // -1 to 1

  // Cavity (dark oval, grows when open)
  const cavRX = open * 21;
  const cavRY = open * 15;
  _els.mouthCavity.setAttribute('rx', cavRX.toFixed(1));
  _els.mouthCavity.setAttribute('ry', cavRY.toFixed(1));
  _els.mouthCavity.setAttribute('cy', (228 + open * 2).toFixed(1));

  // Tongue (appears > 60% open)
  const tongRY = Math.max(0, (open - 0.55) / 0.45) * 8;
  _els.mouthTongue.setAttribute('rx', (tongRY * 1.4).toFixed(1));
  _els.mouthTongue.setAttribute('ry', tongRY.toFixed(1));

  // Teeth (appear > 25% open)
  const teethOp = clamp((open - 0.25) / 0.6, 0, 1);
  _els.mouthTeeth.setAttribute('opacity', teethOp.toFixed(2));

  // Mouth line (smile / smirk / frown)
  // Base endpoints, then lift/lower based on smile and skew
  const liftL = smile * 9  + Math.max(0, -skew) * 7;
  const liftR = smile * 9  + Math.max(0,  skew) * 7;
  const cpY   = 231 - smile * 14 + open * 3;

  const lY = (223 - liftL).toFixed(1);
  const rY = (223 - liftR).toFixed(1);
  const cY = cpY.toFixed(1);

  _els.mouthLine.setAttribute('d',
    `M 179 ${lY} Q 200 ${cY} 221 ${rY}`
  );

  // Hide mouth line when very open (cavity takes over)
  _els.mouthLine.setAttribute('opacity', (1 - clamp(open * 2, 0, 1)).toFixed(2));
}

function applyCheeks() {
  const op = clamp(anim.cheekOpacity.cur, 0, 0.8).toFixed(2);
  _els.cheekL.setAttribute('opacity', op);
  _els.cheekR.setAttribute('opacity', op);
}

// ── RAF loop ──────────────────────────────────────────────────────────────────
let _rafId   = null;
let _lastTs  = null;
const SPRING = 0.10;
const SPRING_SLOW = 0.07;
const SPRING_FAST = 0.18;

function tick(ts) {
  const dt = _lastTs ? Math.min(ts - _lastTs, 50) : 16;
  _lastTs = ts;

  // Update idle motion (breathing, pupil wander)
  updateIdleMotion(ts);

  // Update blink
  updateBlink(dt);

  // Spring all values toward targets
  anim.headTiltZ.cur   = lerp(anim.headTiltZ.cur,    anim.headTiltZ.tgt,    SPRING);
  anim.headX.cur       = lerp(anim.headX.cur,         anim.headX.tgt,        SPRING_SLOW);
  anim.headY.cur       = lerp(anim.headY.cur,         anim.headY.tgt,        SPRING_SLOW);
  anim.bodyY.cur       = lerp(anim.bodyY.cur,         anim.bodyY.tgt,        SPRING_SLOW);

  anim.browLY.cur      = lerp(anim.browLY.cur,        anim.browLY.tgt,       SPRING);
  anim.browRY.cur      = lerp(anim.browRY.cur,        anim.browRY.tgt,       SPRING);
  anim.browLSlant.cur  = lerp(anim.browLSlant.cur,    anim.browLSlant.tgt,   SPRING);
  anim.browRSlant.cur  = lerp(anim.browRSlant.cur,    anim.browRSlant.tgt,   SPRING);

  anim.eyeScaleY.cur   = lerp(anim.eyeScaleY.cur,    anim.eyeScaleY.tgt,    SPRING);
  anim.pupilX.cur      = lerp(anim.pupilX.cur,        anim.pupilX.tgt,       SPRING_SLOW);
  anim.pupilY.cur      = lerp(anim.pupilY.cur,        anim.pupilY.tgt,       SPRING_SLOW);

  anim.mouthOpen.cur   = lerp(anim.mouthOpen.cur,     anim.mouthOpen.tgt,    SPRING_FAST);
  anim.mouthSmile.cur  = lerp(anim.mouthSmile.cur,    anim.mouthSmile.tgt,   SPRING);
  anim.mouthSkew.cur   = lerp(anim.mouthSkew.cur,     anim.mouthSkew.tgt,    SPRING);

  anim.cheekOpacity.cur= lerp(anim.cheekOpacity.cur,  anim.cheekOpacity.tgt, SPRING_SLOW);
  anim.lidBoth.cur     = lerp(anim.lidBoth.cur,        anim.lidBoth.tgt,      SPRING_FAST);
  anim.lidLeft.cur     = lerp(anim.lidLeft.cur,        anim.lidLeft.tgt,      SPRING_FAST);

  // Apply to DOM
  applyRoot();
  applyHead();
  applyBrows();
  applyEyes();
  applyLids();
  applyMouth();
  applyCheeks();

  _rafId = requestAnimationFrame(tick);
}

// ── Public API ────────────────────────────────────────────────────────────────
export const Mo = {
  init(containerEl) {
    containerEl.innerHTML = buildSVG();
    grabElements();
    applyStateAndExpression();
  },

  start() {
    if (_rafId) return;
    _lastTs = null;
    _rafId  = requestAnimationFrame(tick);
  },

  stop() {
    if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  },

  setState(state) {
    if (!STATE_TARGETS[state]) return;
    _state = state;
    applyStateAndExpression();
  },

  setExpression(expr) {
    if (!EXPR_TARGETS[expr]) return;

    // Handle wink: close left lid then open after 600ms
    if (expr === 'wink') {
      anim.lidLeft.tgt = 1;
      setTimeout(() => { anim.lidLeft.tgt = 0; }, 600);
    }

    _expression = expr;
    applyStateAndExpression();
  },

  setMouthOpen(value) {
    anim.mouthOpen.tgt = clamp(value, 0, 1);
  },
};
