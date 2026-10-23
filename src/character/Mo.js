// src/character/Mo.js
// ─────────────────────────────────────────────────────────────────────────────
// Mo Avatar 2.0 — Halalholic Mascot.
// 2D flat SVG character with spring physics, procedural animation, speech cadence,
// and 8 expressive emotional states.
//
// Visual Identity:
//   • Toasted Pita Bread Face: Warm radial gradient with toasted griddle texture
//   • Volumetric Lettuce Hair: 3-layer leafy crown with depth and ambient flutter
//   • Halalholic Streetwear: Signature orange hoodie (#FF6A00), flame/H medallion,
//     sweatpants with cuffs, and Crocs.
//   • Over-ear DJ headphones with pulsing LED + snapback cap.
//
// Public API:
//   Mo.init(containerEl)
//   Mo.start() / Mo.stop()
//   Mo.setState('idle'|'listening'|'thinking'|'talking')
//   Mo.setExpression('neutral'|'happy'|'smug'|'excited'|'thinking'|'mock_offended'|'surprised'|'wink')
//   Mo.setMouthOpen(0..1)
//   Mo.setSpeechCadence(0..1)
//   Mo.triggerLaugh()
// ─────────────────────────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t)   { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// ── SVG Template ──────────────────────────────────────────────────────────────
function buildSVG() {
  return /* html */`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 590" id="mo-svg"
     style="width:100%;height:100%;overflow:visible;">
  <defs>
    <!-- Pita face gradient: warm golden center, toasted golden-brown edges -->
    <radialGradient id="pita-grad" cx="42%" cy="36%" r="66%">
      <stop offset="0%"   stop-color="#FCE5C2"/>
      <stop offset="45%"  stop-color="#EFC697"/>
      <stop offset="85%"  stop-color="#D9A162"/>
      <stop offset="100%" stop-color="#BA7E3C"/>
    </radialGradient>

    <!-- Hoodie gradient -->
    <radialGradient id="hoodie-grad" cx="50%" cy="20%" r="80%">
      <stop offset="0%"   stop-color="#FF7D24"/>
      <stop offset="55%"  stop-color="#FA5A00"/>
      <stop offset="100%" stop-color="#D64200"/>
    </radialGradient>

    <!-- Drop shadow for face -->
    <filter id="face-shadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="rgba(0,0,0,0.42)"/>
    </filter>

    <!-- Soft body shadow -->
    <filter id="body-shadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="rgba(0,0,0,0.38)"/>
    </filter>
  </defs>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- ROOT GROUP — breathing & overall physical suspension       -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <g id="mo-root">

    <!-- ───────────────────────────────────────────────────────── -->
    <!-- BODY GROUP (drawn first, layered behind head)             -->
    <!-- ───────────────────────────────────────────────────────── -->
    <g id="mo-body-group" filter="url(#body-shadow)">

      <!-- Backpack strap & pouch hint -->
      <rect x="84" y="284" width="46" height="74" rx="12" fill="#14142B" opacity="0.94"/>
      <rect x="90" y="292" width="35" height="58" rx="8"  fill="#1D1D3A"/>
      <rect x="94" y="300" width="27" height="10" rx="4"  fill="#121226" opacity="0.6"/>
      <rect x="94" y="316" width="27" height="10" rx="4"  fill="#121226" opacity="0.6"/>

      <!-- ── SWEATPANTS ── -->
      <!-- Left leg -->
      <path d="M 146 464 L 132 550 Q 130 562 152 562 L 174 562 Q 186 562 184 550 L 176 464 Z"
            fill="#B9B9CC"/>
      <!-- Right leg -->
      <path d="M 224 464 L 216 550 Q 214 562 228 562 L 250 562 Q 268 562 268 550 L 254 464 Z"
            fill="#B9B9CC"/>
      <!-- Waistband -->
      <rect x="106" y="454" width="188" height="20" rx="7" fill="#A4A4B8"/>
      <!-- Left ankle cuff -->
      <rect x="130" y="547" width="56" height="14" rx="6" fill="#9E9EB2"/>
      <!-- Right ankle cuff -->
      <rect x="214" y="547" width="56" height="14" rx="6" fill="#9E9EB2"/>
      <!-- Seam lines -->
      <line x1="160" y1="475" x2="156" y2="545" stroke="#9E9EB0" stroke-width="1.6" opacity="0.55"/>
      <line x1="240" y1="475" x2="244" y2="545" stroke="#9E9EB0" stroke-width="1.6" opacity="0.55"/>

      <!-- ── WHITE CROCS ── -->
      <!-- Left croc -->
      <ellipse cx="153" cy="571" rx="35" ry="13" fill="#E4DED1"/>
      <ellipse cx="153" cy="565" rx="31" ry="10" fill="#F4EFE6"/>
      <circle cx="137" cy="561" r="3.5" fill="#D3CBBD"/>
      <circle cx="150" cy="559" r="3.5" fill="#D3CBBD"/>
      <circle cx="163" cy="561" r="3.5" fill="#D3CBBD"/>
      <!-- Croc flame jibbitz detail -->
      <path d="M 148 554 Q 150 550 152 552 Q 154 548 156 554 Z" fill="#FF6A00"/>

      <!-- Right croc -->
      <ellipse cx="247" cy="571" rx="35" ry="13" fill="#E4DED1"/>
      <ellipse cx="247" cy="565" rx="31" ry="10" fill="#F4EFE6"/>
      <circle cx="231" cy="561" r="3.5" fill="#D3CBBD"/>
      <circle cx="244" cy="559" r="3.5" fill="#D3CBBD"/>
      <circle cx="257" cy="561" r="3.5" fill="#D3CBBD"/>
      <!-- Croc flame jibbitz detail -->
      <path d="M 242 554 Q 244 550 246 552 Q 248 548 250 554 Z" fill="#FF6A00"/>

      <!-- ── HOODIE BODY ── -->
      <path id="mo-hoodie"
        d="M 154 272
           C 126 283, 108 308, 102 348
           L 96  468 Q 96  480 108 480
           L 292 480 Q 304 480 304 468
           L 298 348 C 292 308, 274 283, 246 272
           Q 224 280, 200 280
           Q 176 280, 154 272 Z"
        fill="url(#hoodie-grad)"/>

      <!-- Neckline fold -->
      <path d="M 158 274 Q 200 270, 242 274 Q 222 291, 200 293 Q 178 291, 158 274 Z"
            fill="#C94000" opacity="0.7"/>

      <!-- Hood Drawstrings -->
      <path d="M 184 288 Q 183 315 180 332" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="0.85"/>
      <rect x="178.5" y="331" width="3" height="6" rx="1.5" fill="#C0C0C0"/>
      <path d="M 216 288 Q 217 315 220 332" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="0.85"/>
      <rect x="218.5" y="331" width="3" height="6" rx="1.5" fill="#C0C0C0"/>

      <!-- Center Seam -->
      <line x1="200" y1="295" x2="200" y2="466" stroke="#C23C00" stroke-width="2" opacity="0.55"/>

      <!-- Kangaroo Pocket -->
      <path d="M 164 388 Q 162 430, 200 430 Q 238 430, 236 388 Q 235 374, 200 374 Q 165 374, 164 388 Z"
            fill="#BD3700" opacity="0.58"/>
      <path d="M 164 388 Q 162 430, 200 430 Q 238 430, 236 388"
            fill="none" stroke="#A82E00" stroke-width="1.8" opacity="0.75"/>

      <!-- Halalholic Medallion on Chest -->
      <circle cx="200" cy="336" r="23" fill="#0E302E" opacity="0.96"/>
      <circle cx="200" cy="336" r="19" fill="#082220"/>
      <!-- Flame behind H -->
      <path d="M 200 322 Q 206 329 203 334 Q 200 330 197 334 Q 194 329 200 322 Z" fill="#FF6A00" opacity="0.75"/>
      <text x="200" y="344" font-size="24" font-weight="900" fill="#FF6A00"
            font-family="'Arial Black', Impact, sans-serif"
            text-anchor="middle">H</text>

      <!-- Sleeve Hints -->
      <path d="M 102 340 Q 82 360, 86 408 Q 86 418 96 416 L 104 390 Z"
            fill="#D94C00" opacity="0.88"/>
      <path d="M 298 340 Q 318 360, 314 408 Q 314 418 304 416 L 296 390 Z"
            fill="#D94C00" opacity="0.88"/>
    </g>

    <!-- Neck -->
    <rect id="mo-neck" x="182" y="262" width="36" height="24" rx="8" fill="#D39F6E"/>

    <!-- ───────────────────────────────────────────────────────── -->
    <!-- HEAD GROUP — tilt, nod, sway, expressions                 -->
    <!-- ───────────────────────────────────────────────────────── -->
    <g id="mo-head">

      <!-- ── VOLUMETRIC LETTUCE HAIR CROWN (3 depth layers) ── -->
      <g id="mo-lettuce">
        <!-- Deep shadow layer -->
        <ellipse cx="200" cy="118" rx="92" ry="30" fill="#24500C" opacity="0.5"/>
        <ellipse cx="112" cy="140" rx="30" ry="28" fill="#3D7518" transform="rotate(-18 112 140)"/>
        <ellipse cx="288" cy="140" rx="30" ry="28" fill="#3D7518" transform="rotate(18 288 140)"/>

        <!-- Mid leafy curls -->
        <ellipse cx="144" cy="122" rx="36" ry="34" fill="#4E9420"/>
        <ellipse cx="256" cy="122" rx="36" ry="34" fill="#4E9420"/>
        <ellipse cx="166" cy="104" rx="32" ry="30" fill="#5EAF27" transform="rotate(-6 166 104)"/>
        <ellipse cx="234" cy="104" rx="32" ry="30" fill="#5EAF27" transform="rotate(6 234 104)"/>

        <!-- Dominant front crown lobes -->
        <ellipse cx="200" cy="94"  rx="42" ry="38" fill="#6EC730"/>
        <ellipse cx="190" cy="82"  rx="20" ry="14" fill="#88E640" opacity="0.7"/>
        <ellipse cx="200" cy="126" rx="34" ry="25" fill="#5CB026"/>
        <ellipse cx="176" cy="90"  rx="19" ry="17" fill="#7ADB36" opacity="0.85"/>
        <ellipse cx="224" cy="90"  rx="19" ry="17" fill="#7ADB36" opacity="0.85"/>
      </g>

      <!-- ── PITA BREAD FACE ── -->
      <circle id="mo-face" cx="200" cy="182" r="92"
              fill="url(#pita-grad)" filter="url(#face-shadow)"/>

      <!-- Pita edge toasted rim -->
      <circle cx="200" cy="182" r="92" fill="none"
              stroke="#A86E32" stroke-width="3.5" opacity="0.4"/>

      <!-- Toasted Griddle Freckles & Spots -->
      <ellipse cx="140" cy="154" rx="16" ry="9" fill="#AD6E30"
               opacity="0.32" transform="rotate(-26 140 154)"/>
      <ellipse cx="260" cy="208" rx="14" ry="8" fill="#AD6E30"
               opacity="0.25" transform="rotate(20 260 208)"/>
      <ellipse cx="200" cy="254" rx="22" ry="9" fill="#AD6E30" opacity="0.2"/>
      <circle  cx="154" cy="235" r="4.5" fill="#B07032" opacity="0.22"/>
      <circle  cx="246" cy="152" r="5"   fill="#B07032" opacity="0.22"/>

      <!-- ── CHEEK BLUSH (dynamic) ── -->
      <ellipse id="mo-cheek-left"  cx="136" cy="208" rx="25" ry="14"
               fill="#FF8055" opacity="0"/>
      <ellipse id="mo-cheek-right" cx="264" cy="208" rx="25" ry="14"
               fill="#FF8055" opacity="0"/>

      <!-- ─────────────────────────────── -->
      <!-- LEFT EYE                        -->
      <!-- ─────────────────────────────── -->
      <g id="mo-eye-left">
        <ellipse id="eye-white-left" cx="168" cy="175" rx="27" ry="25" fill="#FFFFFF"/>
        <circle  id="eye-iris-left"  cx="168" cy="175" r="17"  fill="#122A16"/>
        <circle  id="eye-pupil-left" cx="170" cy="176" r="10.5" fill="#050805"/>
        <!-- Dual sparkling cartoon catchlights -->
        <circle cx="176" cy="168" r="6"   fill="#FFFFFF"/>
        <circle cx="163" cy="181" r="2.8" fill="rgba(255,255,255,0.7)"/>
      </g>
      <!-- Left Eyelid (blinks & winks) -->
      <ellipse id="mo-lid-left" cx="168" cy="175" rx="29" ry="0" fill="#EFC697"/>

      <!-- ─────────────────────────────── -->
      <!-- RIGHT EYE                       -->
      <!-- ─────────────────────────────── -->
      <g id="mo-eye-right">
        <ellipse id="eye-white-right" cx="232" cy="175" rx="27" ry="25" fill="#FFFFFF"/>
        <circle  id="eye-iris-right"  cx="232" cy="175" r="17"  fill="#122A16"/>
        <circle  id="eye-pupil-right" cx="234" cy="176" r="10.5" fill="#050805"/>
        <!-- Dual sparkling cartoon catchlights -->
        <circle cx="240" cy="168" r="6"   fill="#FFFFFF"/>
        <circle cx="227" cy="181" r="2.8" fill="rgba(255,255,255,0.7)"/>
      </g>
      <!-- Right Eyelid -->
      <ellipse id="mo-lid-right" cx="232" cy="175" rx="29" ry="0" fill="#EFC697"/>

      <!-- ─────────────────────────────── -->
      <!-- EYEBROWS                        -->
      <!-- ─────────────────────────────── -->
      <path id="mo-brow-left"
        d="M 141 151 Q 157 143 178 148"
        fill="none" stroke="#251206" stroke-width="7.5" stroke-linecap="round"/>
      <path id="mo-brow-right"
        d="M 222 148 Q 243 143 259 151"
        fill="none" stroke="#251206" stroke-width="7.5" stroke-linecap="round"/>

      <!-- ─────────────────────────────── -->
      <!-- MOUTH                           -->
      <!-- ─────────────────────────────── -->
      <g id="mo-mouth">
        <!-- Cavity -->
        <ellipse id="mouth-cavity" cx="200" cy="228" rx="0" ry="0" fill="#240700"/>
        <!-- Tongue -->
        <ellipse id="mouth-tongue" cx="200" cy="236" rx="0" ry="0" fill="#D44848"/>
        <!-- Teeth bar -->
        <rect id="mouth-teeth" x="184" y="219" width="32" height="10" rx="4"
              fill="#FAF8F5" opacity="0"/>
        <!-- Smile/smirk line -->
        <path id="mouth-line"
          d="M 179 223 Q 200 231 221 223"
          fill="none" stroke="#240700" stroke-width="3.5" stroke-linecap="round"/>
      </g>

      <!-- ── DJ HEADPHONES ── -->
      <g id="mo-headphones">
        <!-- Arch band -->
        <path d="M 108 191 A 94 98 0 0 1 292 191"
              fill="none" stroke="#0F0F1A" stroke-width="9.5" stroke-linecap="round"/>
        <!-- Left cup -->
        <circle cx="105" cy="193" r="20" fill="#181828"/>
        <circle cx="105" cy="193" r="14" fill="#0B0B16"/>
        <circle cx="100" cy="190" r="2.2" fill="#25253A"/>
        <circle cx="109" cy="190" r="2.2" fill="#25253A"/>
        <circle cx="105" cy="198" r="2.2" fill="#25253A"/>
        <!-- Pulsing orange status LED -->
        <circle id="headphone-led" cx="93" cy="182" r="5" fill="#FF6A00" opacity="0.95"/>
        <circle cx="93" cy="182" r="2.5" fill="#FFB066"/>

        <!-- Right cup -->
        <circle cx="295" cy="193" r="20" fill="#181828"/>
        <circle cx="295" cy="193" r="14" fill="#0B0B16"/>
        <circle cx="290" cy="190" r="2.2" fill="#25253A"/>
        <circle cx="299" cy="190" r="2.2" fill="#25253A"/>
        <circle cx="295" cy="198" r="2.2" fill="#25253A"/>
      </g>

      <!-- ── SNAPBACK BASEBALL CAP ── -->
      <g id="mo-cap">
        <path d="M 143 112 Q 147 68, 200 62 Q 253 68, 257 112 Z" fill="#0E302E"/>
        <ellipse cx="200" cy="72" rx="57" ry="22" fill="#0E302E"/>
        <rect x="141" y="109" width="118" height="15" rx="5" fill="#082220"/>
        <!-- Curved Visor Brim -->
        <path d="M 197 123 Q 268 124, 276 128 Q 277 134, 268 134 Q 200 132, 197 128 Z" fill="#061A18"/>
        <path d="M 163 110 Q 165 76, 200 70 Q 235 76, 237 110 Z" fill="#123B38"/>
        <!-- Embroidered H logo -->
        <text x="200" y="105" font-size="22" font-weight="900" fill="#FF6A00"
              font-family="'Arial Black', Impact, sans-serif"
              text-anchor="middle">H</text>
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

// ── Physical Spring & Animation Rigging ─────────────────────────────────────────
const anim = {
  // Head
  headTiltZ:   { cur: 0,    tgt: 0    },
  headX:       { cur: 0,    tgt: 0    },
  headY:       { cur: 0,    tgt: 0    },
  // Body
  bodyY:       { cur: 0,    tgt: 0    },
  // Eyebrows
  browLY:      { cur: 0,    tgt: 0    },
  browRY:      { cur: 0,    tgt: 0    },
  browLSlant:  { cur: 0,    tgt: 0    },
  browRSlant:  { cur: 0,    tgt: 0    },
  // Eyes
  eyeScaleY:   { cur: 1,    tgt: 1    },
  // Pupils
  pupilX:      { cur: 0,    tgt: 0    },
  pupilY:      { cur: 0,    tgt: 0    },
  // Mouth
  mouthOpen:   { cur: 0,    tgt: 0    },
  mouthSmile:  { cur: 0.25, tgt: 0.25 },
  mouthSkew:   { cur: 0,    tgt: 0    },
  // Cheeks
  cheekOpacity:{ cur: 0,    tgt: 0    },
  // Eyelids
  lidBoth:     { cur: 0,    tgt: 0    },
  lidLeft:     { cur: 0,    tgt: 0    },
};

// ── State Targets ─────────────────────────────────────────────────────────────
const STATE_TARGETS = {
  idle:      { browLY: 0,   browRY: 0,   eyeSY: 1,     smile: 0.25, skew: 0,   tilt: 0,    cheek: 0    },
  listening: { browLY: -4,  browRY: -4,  eyeSY: 1.08,  smile: 0.20, skew: 0,   tilt: 2.5,  cheek: 0    },
  thinking:  { browLY: -6,  browRY: 4,   eyeSY: 0.85,  smile: 0,    skew: 0,   tilt: -5.0, cheek: 0    },
  talking:   { browLY: -2,  browRY: -2,  eyeSY: 1.02,  smile: 0.50, skew: 0,   tilt: 1.5,  cheek: 0.25 },
};

// ── 8 Rich Expression Targets ─────────────────────────────────────────────────
const EXPR_TARGETS = {
  neutral:      { browLY: 0,    browRY: 0,   browLS: 0,   browRS: 0,   eyeSY: 1.0,  smile: 0.20, skew: 0,    tilt: 0,    cheek: 0    },
  happy:        { browLY: -4,   browRY: -4,  browLS: 0,   browRS: 0,   eyeSY: 1.10, smile: 0.75, skew: 0,    tilt: 0,    cheek: 0.50 },
  smug:         { browLY: 4,    browRY: -9,  browLS: 2,   browRS: -4,  eyeSY: 0.82, smile: 0.35, skew: 0.60, tilt: -7.0, cheek: 0    },
  excited:      { browLY: -11,  browRY: -11, browLS: 0,   browRS: 0,   eyeSY: 1.28, smile: 0.95, skew: 0,    tilt: 3.5,  cheek: 0.75 },
  thinking:     { browLY: -6,   browRY: 5,   browLS: 3,   browRS: -2,  eyeSY: 0.80, smile: -0.1, skew: 0,    tilt: -5.5, cheek: 0    },
  mock_offended:{ browLY: -12,  browRY: -7,  browLS: -3,  browRS: 3,   eyeSY: 1.22, smile: -0.35,skew: -0.2, tilt: -6.5, cheek: 0.60 },
  surprised:    { browLY: -13,  browRY: -13, browLS: 0,   browRS: 0,   eyeSY: 1.35, smile: 0.10, skew: 0,    tilt: 0,    cheek: 0.20 },
  wink:         { browLY: -3,   browRY: -5,  browLS: 0,   browRS: 0,   eyeSY: 1.05, smile: 0.65, skew: 0.25, tilt: 3.0,  cheek: 0.35 },
};

let _state         = 'idle';
let _expression    = 'happy';
let _speechCadence = 0; // driven by live audio amplitude

function applyStateAndExpression() {
  const s = STATE_TARGETS[_state]       || STATE_TARGETS.idle;
  const e = EXPR_TARGETS[_expression]   || EXPR_TARGETS.happy;

  anim.browLY.tgt       = s.browLY  + e.browLY;
  anim.browRY.tgt       = s.browRY  + e.browRY;
  anim.browLSlant.tgt   = e.browLS  || 0;
  anim.browRSlant.tgt   = e.browRS  || 0;
  anim.eyeScaleY.tgt    = lerp(s.eyeSY, e.eyeSY, 0.6);
  anim.mouthSmile.tgt   = lerp(s.smile, e.smile, 0.65);
  anim.mouthSkew.tgt    = s.skew + e.skew;
  anim.headTiltZ.tgt    = s.tilt + e.tilt;
  anim.cheekOpacity.tgt = Math.max(s.cheek, e.cheek);
}

// ── Blink System ──────────────────────────────────────────────────────────────
let _blinkTimer = 3000;
let _blinkPhase = 0;

function updateBlink(dt) {
  if (_blinkPhase === 0) {
    _blinkTimer -= dt;
    if (_blinkTimer <= 0) {
      _blinkPhase = 1;
      _blinkTimer = 80 + Math.random() * 60;
    }
    return;
  }
  _blinkTimer -= dt;
  const progress = Math.max(0, 1 - _blinkTimer / 100);

  if (_blinkPhase === 1) {
    anim.lidBoth.tgt = easeInOut(progress);
    if (_blinkTimer <= 0) {
      _blinkPhase = 2;
      _blinkTimer = 80 + Math.random() * 40;
    }
  } else if (_blinkPhase === 2) {
    anim.lidBoth.tgt = 1 - easeInOut(progress);
    if (_blinkTimer <= 0) {
      _blinkPhase = 0;
      anim.lidBoth.tgt = 0;
      _blinkTimer = 2500 + Math.random() * 3200;
    }
  }
}

// ── Idle & Speech Cadence ─────────────────────────────────────────────────────
let _pupilWanderTimer = 0;
let _pupilTgtX = 0, _pupilTgtY = 0;

function updateIdleMotion(ts) {
  const breath = Math.sin(ts * 0.0014) * 4;
  anim.headY.tgt = breath;
  anim.bodyY.tgt = -breath * 0.5;

  const sway = Math.sin(ts * 0.0007) * 1.5;
  if (_state === 'idle' || _state === 'listening' || _state === 'talking') {
    anim.headX.tgt = sway;
  }

  // Speech cadence emphasis nods: head gently responds to voice power
  if (_speechCadence > 0.04) {
    anim.headY.tgt     += Math.sin(ts * 0.012) * (_speechCadence * 5.5);
    anim.headTiltZ.tgt += Math.cos(ts * 0.008) * (_speechCadence * 2.8);
    anim.browLY.tgt    -= _speechCadence * 3.2;
    anim.browRY.tgt    -= _speechCadence * 3.2;
  }

  // Natural pupil wander
  _pupilWanderTimer -= 16;
  if (_pupilWanderTimer <= 0) {
    _pupilWanderTimer = 1600 + Math.random() * 2600;
    _pupilTgtX = (Math.random() - 0.5) * 8;
    _pupilTgtY = (Math.random() - 0.5) * 5;
  }
  anim.pupilX.tgt = _pupilTgtX;
  anim.pupilY.tgt = _pupilTgtY;
}

// ── DOM Element Cache ─────────────────────────────────────────────────────────
let _els = {};

function grabElements() {
  _els = {
    root:        document.getElementById('mo-root'),
    head:        document.getElementById('mo-head'),
    face:        document.getElementById('mo-face'),
    bodyGroup:   document.getElementById('mo-body-group'),
    eyeWhiteL:   document.getElementById('eye-white-left'),
    eyeWhiteR:   document.getElementById('eye-white-right'),
    pupilL:      document.getElementById('eye-pupil-left'),
    pupilR:      document.getElementById('eye-pupil-right'),
    irisL:       document.getElementById('eye-iris-left'),
    irisR:       document.getElementById('eye-iris-right'),
    lidL:        document.getElementById('mo-lid-left'),
    lidR:        document.getElementById('mo-lid-right'),
    browL:       document.getElementById('mo-brow-left'),
    browR:       document.getElementById('mo-brow-right'),
    cheekL:      document.getElementById('mo-cheek-left'),
    cheekR:      document.getElementById('mo-cheek-right'),
    mouthCavity: document.getElementById('mouth-cavity'),
    mouthTongue: document.getElementById('mouth-tongue'),
    mouthTeeth:  document.getElementById('mouth-teeth'),
    mouthLine:   document.getElementById('mouth-line'),
    headphoneLed:document.getElementById('headphone-led'),
  };
}

function applyHead() {
  const tilt = anim.headTiltZ.cur;
  const x    = anim.headX.cur;
  const y    = anim.headY.cur;
  _els.head.setAttribute('transform',
    `translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${tilt.toFixed(2)}, 200, 270)`
  );
}

function applyRoot() {
  const y = anim.bodyY.cur;
  _els.root.setAttribute('transform', `translate(0, ${y.toFixed(2)})`);
}

function applyBrows() {
  const lY = anim.browLY.cur, rY = anim.browRY.cur;
  const lS = anim.browLSlant.cur, rS = anim.browRSlant.cur;

  _els.browL.setAttribute('d',
    `M 141 ${(151 + lY).toFixed(1)} Q 157 ${(143 + lY * 0.85).toFixed(1)} 178 ${(148 + lY + lS * 5).toFixed(1)}`
  );
  _els.browR.setAttribute('d',
    `M 222 ${(148 + rY + rS * 5).toFixed(1)} Q 243 ${(143 + rY * 0.85).toFixed(1)} 259 ${(151 + rY).toFixed(1)}`
  );
}

function applyEyes() {
  const sY = anim.eyeScaleY.cur;
  const px = anim.pupilX.cur, py = anim.pupilY.cur;

  const newRY = clamp(25 * sY, 8, 32);
  _els.eyeWhiteL.setAttribute('ry', newRY.toFixed(1));
  _els.eyeWhiteR.setAttribute('ry', newRY.toFixed(1));

  const irisScale = clamp(sY * 0.9 + 0.1, 0.4, 1.0);
  _els.irisL.setAttribute('r', (17 * irisScale).toFixed(1));
  _els.irisR.setAttribute('r', (17 * irisScale).toFixed(1));

  const clampedPX = clamp(px, -7, 7);
  const clampedPY = clamp(py, -5, 5);
  _els.pupilL.setAttribute('cx', (170 + clampedPX).toFixed(1));
  _els.pupilL.setAttribute('cy', (176 + clampedPY).toFixed(1));
  _els.pupilR.setAttribute('cx', (234 + clampedPX).toFixed(1));
  _els.pupilR.setAttribute('cy', (176 + clampedPY).toFixed(1));
}

function applyLids() {
  const blinkRY = clamp(anim.lidBoth.cur, 0, 1) * 27;
  const winkRY  = clamp(anim.lidLeft.cur, 0, 1) * 27;

  _els.lidL.setAttribute('ry', Math.max(blinkRY, winkRY).toFixed(1));
  _els.lidR.setAttribute('ry', blinkRY.toFixed(1));
}

function applyMouth() {
  const open  = clamp(anim.mouthOpen.cur, 0, 1);
  const smile = anim.mouthSmile.cur;
  const skew  = anim.mouthSkew.cur;

  const cavRX = open * 22;
  const cavRY = open * 16;
  _els.mouthCavity.setAttribute('rx', cavRX.toFixed(1));
  _els.mouthCavity.setAttribute('ry', cavRY.toFixed(1));
  _els.mouthCavity.setAttribute('cy', (228 + open * 2).toFixed(1));

  const tongRY = Math.max(0, (open - 0.52) / 0.48) * 8.5;
  _els.mouthTongue.setAttribute('rx', (tongRY * 1.4).toFixed(1));
  _els.mouthTongue.setAttribute('ry', tongRY.toFixed(1));

  const teethOp = clamp((open - 0.22) / 0.6, 0, 1);
  _els.mouthTeeth.setAttribute('opacity', teethOp.toFixed(2));

  const liftL = smile * 9 + Math.max(0, -skew) * 7;
  const liftR = smile * 9 + Math.max(0,  skew) * 7;
  const cpY   = 231 - smile * 14 + open * 3;

  _els.mouthLine.setAttribute('d',
    `M 179 ${(223 - liftL).toFixed(1)} Q 200 ${cpY.toFixed(1)} 221 ${(223 - liftR).toFixed(1)}`
  );
  _els.mouthLine.setAttribute('opacity', (1 - clamp(open * 2.2, 0, 1)).toFixed(2));
}

function applyCheeks() {
  const op = clamp(anim.cheekOpacity.cur, 0, 0.85).toFixed(2);
  _els.cheekL.setAttribute('opacity', op);
  _els.cheekR.setAttribute('opacity', op);
}

// ── Animation Loop ────────────────────────────────────────────────────────────
let _rafId  = null;
let _lastTs = null;
const SPRING      = 0.11;
const SPRING_SLOW = 0.07;
const SPRING_FAST = 0.20;

function tick(ts) {
  const dt = _lastTs ? Math.min(ts - _lastTs, 50) : 16;
  _lastTs = ts;

  updateIdleMotion(ts);
  updateBlink(dt);

  anim.headTiltZ.cur    = lerp(anim.headTiltZ.cur,    anim.headTiltZ.tgt,    SPRING);
  anim.headX.cur        = lerp(anim.headX.cur,        anim.headX.tgt,        SPRING_SLOW);
  anim.headY.cur        = lerp(anim.headY.cur,        anim.headY.tgt,        SPRING_SLOW);
  anim.bodyY.cur        = lerp(anim.bodyY.cur,        anim.bodyY.tgt,        SPRING_SLOW);

  anim.browLY.cur       = lerp(anim.browLY.cur,       anim.browLY.tgt,       SPRING);
  anim.browRY.cur       = lerp(anim.browRY.cur,       anim.browRY.tgt,       SPRING);
  anim.browLSlant.cur   = lerp(anim.browLSlant.cur,   anim.browLSlant.tgt,   SPRING);
  anim.browRSlant.cur   = lerp(anim.browRSlant.cur,   anim.browRSlant.tgt,   SPRING);

  anim.eyeScaleY.cur    = lerp(anim.eyeScaleY.cur,    anim.eyeScaleY.tgt,    SPRING);
  anim.pupilX.cur       = lerp(anim.pupilX.cur,       anim.pupilX.tgt,       SPRING_SLOW);
  anim.pupilY.cur       = lerp(anim.pupilY.cur,       anim.pupilY.tgt,       SPRING_SLOW);

  anim.mouthOpen.cur    = lerp(anim.mouthOpen.cur,    anim.mouthOpen.tgt,    SPRING_FAST);
  anim.mouthSmile.cur   = lerp(anim.mouthSmile.cur,   anim.mouthSmile.tgt,   SPRING);
  anim.mouthSkew.cur    = lerp(anim.mouthSkew.cur,    anim.mouthSkew.tgt,    SPRING);

  anim.cheekOpacity.cur = lerp(anim.cheekOpacity.cur, anim.cheekOpacity.tgt, SPRING_SLOW);
  anim.lidBoth.cur      = lerp(anim.lidBoth.cur,      anim.lidBoth.tgt,      SPRING_FAST);
  anim.lidLeft.cur      = lerp(anim.lidLeft.cur,      anim.lidLeft.tgt,      SPRING_FAST);

  applyRoot();
  applyHead();
  applyBrows();
  applyEyes();
  applyLids();
  applyMouth();
  applyCheeks();

  _rafId = requestAnimationFrame(tick);
}

// ── Public Interface ──────────────────────────────────────────────────────────
export const Mo = {
  init(containerEl) {
    containerEl.innerHTML = buildSVG();
    grabElements();
    applyStateAndExpression();
  },

  start() {
    if (_rafId) return;
    _lastTs = null;
    _rafId = requestAnimationFrame(tick);
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

    if (expr === 'wink') {
      anim.lidLeft.tgt = 1;
      setTimeout(() => { anim.lidLeft.tgt = 0; }, 650);
    }

    _expression = expr;
    applyStateAndExpression();
  },

  setMouthOpen(value) {
    anim.mouthOpen.tgt = clamp(value, 0, 1);
  },

  setSpeechCadence(val) {
    _speechCadence = clamp(val, 0, 1);
  },

  triggerLaugh() {
    let bounce = 0;
    const interval = setInterval(() => {
      bounce++;
      anim.headY.tgt      = (bounce % 2 === 1) ? -6 : 3;
      anim.eyeScaleY.tgt  = 0.75;
      anim.mouthSmile.tgt = 0.95;
      if (bounce >= 6) {
        clearInterval(interval);
        applyStateAndExpression();
      }
    }, 85);
  },
};
