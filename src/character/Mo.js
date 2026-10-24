// src/character/Mo.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Mo 3.0 — Canonical 3D Living Mascot Rig (Syracuse Campus Edition)
// 100% Faithful to the official Halalholic Syracuse Model Sheet:
//   • Canonical 3D character base wearing the black Halalholic college backpack
//   • Natural, relaxed student standing posture (hands comfortably at sides)
//   • Zero whole-body image swapping (100% stable character identity)
//   • Organic 3D eye blinking engine (every 3.0s - 4.8s with human double-blinks)
//   • Multi-frame real-time lip-sync (mouth_half & mouth_open 3D visemes)
//   • Natural breathing physics (0.32 Hz), subtle body sway, and speech cadence nodding
// ─────────────────────────────────────────────────────────────────────────────

'use strict';

const ASSETS = {
  base:      '/assets/mo/hires/mo_natural_standing.png',
  eyelids:   '/assets/mo/hires/mo_eyelids.png',
  mouthHalf: '/assets/mo/hires/mo_mouth_half.png',
  mouthOpen: '/assets/mo/hires/mo_mouth_open.png',
};

export const Mo = (() => {
  let _container = null;
  let _rootEl    = null;
  let _rafId     = null;
  let _phase     = 0;

  // Active states
  let _curState  = 'idle';

  // Cadence & Audio Lip-Sync (smoothed)
  let _rawMouthOpen    = 0;
  let _smoothMouthOpen = 0;
  let _cadence         = 0;
  let _visemeState     = 'closed';

  // Laugh spring physics
  let _lPos    = 0;
  let _lVel    = 0;
  let _lActive = false;

  // Eye blinking engine
  let _nextBlinkTime = 0;
  let _isBlinking    = false;

  // DOM Elements
  let $baseImg, $eyelidsImg, $mouthHalf, $mouthOpen, $shadow;

  function init(containerEl) {
    _container = containerEl;
    _container.innerHTML = `
      <div id="mo-mascot-rig" style="
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform-origin: 50% 90%;
      ">
        <!-- Grounded Stage Contact Shadow -->
        <div id="mo-floor-shadow" style="
          position: absolute;
          bottom: 8px;
          width: 50%;
          height: 20px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.72) 0%, rgba(6,21,19,0.38) 50%, transparent 72%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          filter: blur(4px);
        "></div>

        <!-- Layer 1: Canonical Natural Standing 3D Body with College Backpack -->
        <img id="mo-base-img" src="${ASSETS.base}" alt="Mo the Halalholic Mascot" style="
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          z-index: 2;
          filter: drop-shadow(0 16px 32px rgba(0,0,0,0.58));
        " />

        <!-- Layer 2: 3D Talking Mouth Half Open Viseme (Consonants / Speech Transitions) -->
        <img id="mo-mouth-half" src="${ASSETS.mouthHalf}" alt="Mo Speaking Half" style="
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          z-index: 3;
          opacity: 0;
          transform-origin: 51.5% 31.8%;
          transform: scaleY(0.9);
          transition: none;
          will-change: opacity, transform;
        " />

        <!-- Layer 3: 3D Talking Mouth Full Open Viseme (Vowels / Loud Speech) -->
        <img id="mo-mouth-open" src="${ASSETS.mouthOpen}" alt="Mo Speaking Open" style="
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          z-index: 4;
          opacity: 0;
          transform-origin: 51.5% 31.8%;
          transform: scaleY(1.0);
          transition: none;
          will-change: opacity, transform;
        " />

        <!-- Layer 4: 3D Natural Eyelid Overlay for Organic Blinking -->
        <img id="mo-eyelids-overlay" src="${ASSETS.eyelids}" alt="Mo Eyelids" style="
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          z-index: 5;
          opacity: 0;
          transform-origin: 50% 25.5%;
          transform: scaleY(0.9);
          transition: opacity 0.05s ease, transform 0.06s ease;
        " />
      </div>
    `;

    _rootEl     = _container.querySelector('#mo-mascot-rig');
    $baseImg    = _container.querySelector('#mo-base-img');
    $mouthHalf  = _container.querySelector('#mo-mouth-half');
    $mouthOpen  = _container.querySelector('#mo-mouth-open');
    $eyelidsImg = _container.querySelector('#mo-eyelids-overlay');
    $shadow     = _container.querySelector('#mo-floor-shadow');

    // Preload all 4 layers
    Object.values(ASSETS).forEach(src => {
      const img = new Image();
      img.src = src;
    });

    _scheduleNextBlink();
  }

  function start() {
    if (_rafId) return;
    _rafId = requestAnimationFrame(_tick);
  }

  function stop() {
    if (_rafId) {
      cancelAnimationFrame(_rafId);
      _rafId = null;
    }
  }

  // Coarticulation syllable & motion smoothing
  let _smoothCadence = 0;

  // ── Procedural Animation Tick (60 FPS) ──────────────────────────────────────
  function _tick(ts) {
    _phase = ts * 0.001;
    if (!_rootEl) { _rafId = requestAnimationFrame(_tick); return; }

    // 1. Organic Diaphragm Breathing (0.28 Hz - relaxed human resting breath)
    const breatheY = 1 + Math.sin(_phase * 1.75) * 0.007;
    const breatheX = 1 + Math.cos(_phase * 1.75) * 0.0035;

    // 2. Human Postural Weight Shift (5.4s cycle between left & right hip)
    // Simulates an authentic Syracuse student casually shifting balance
    const weightPhase = _phase * 1.16;
    const hipShiftX   = Math.sin(weightPhase) * 3.2;   // 3.2px left/right shift
    const torsoTilt   = -Math.sin(weightPhase) * 0.55; // natural counter-balance tilt (deg)

    // Smooth cadence for expressive emphasis
    _smoothCadence += (_cadence - _smoothCadence) * 0.25;

    // 3. Conversational Speech Dynamics (Organic emphasis, ZERO vibration)
    let talkLeanY = 0;
    let talkPitch = 0;
    let talkYaw   = 0;

    if (_curState === 'talking') {
      // Smooth conversational forward engagement (Mo leans slightly into the conversation)
      talkLeanY = Math.sin(_phase * 2.8) * 1.2 - (_smoothCadence * 1.8);

      // Natural human head emphasis nodding (0.75 Hz slow nod on stressed syllables)
      talkPitch = Math.sin(_phase * 4.6) * (_smoothCadence * 1.4);

      // Expressive conversational head tilt (subtle curious/friendly head cant)
      talkYaw = Math.cos(_phase * 2.3) * (_smoothCadence * 1.1);
    } else if (_curState === 'listening') {
      // Attentive listening posture: slight forward perk with focused head cant
      talkLeanY = -2.0;
      talkPitch = -0.6;
      talkYaw   = 0.8;
    }

    // 4. Spring physics laugh bounce
    if (_lActive) {
      const k = 0.28, damp = 0.74;
      _lVel += _lPos * (-k);
      _lVel *= damp;
      _lPos += _lVel;
      if (Math.abs(_lPos) < 0.2 && Math.abs(_lVel) < 0.2) {
        _lPos = 0; _lVel = 0; _lActive = false;
      }
    }

    // 5. Apply Natural Composite Transform (Zero Up-Down Vibration)
    const totalX   = hipShiftX;
    const totalY   = talkLeanY + talkPitch + _lPos;
    const totalRot = torsoTilt + talkYaw;

    _rootEl.style.transform = `
      translate(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px)
      rotate(${totalRot.toFixed(2)}deg)
      scale(${breatheX.toFixed(4)}, ${breatheY.toFixed(4)})
    `;

    // Stage floor shadow follows body weight shift smoothly
    if ($shadow) {
      const shadowX = hipShiftX * 0.65;
      const shadowScale = 1 - (talkLeanY * 0.015);
      $shadow.style.transform = `translateX(${shadowX.toFixed(2)}px) scale(${shadowScale.toFixed(3)})`;
    }

    // 6. Zero-Latency Crisp Syllabic Lip-Sync Articulation (Hysteresis & Elastic Flex)
    _smoothMouthOpen += (_rawMouthOpen - _smoothMouthOpen) * 0.85;

    if ($mouthHalf && $mouthOpen) {
      if (_curState === 'talking' && _smoothMouthOpen > 0.038) {
        // Hysteresis debouncing to eliminate flutter at transition boundaries
        if (_visemeState === 'open') {
          // Open vowel stays open until acoustic energy drops below release threshold
          if (_smoothMouthOpen < 0.22) {
            _visemeState = _smoothMouthOpen >= 0.04 ? 'half' : 'closed';
          }
        } else if (_visemeState === 'half') {
          // Half open transitions to full open when vocal energy spikes
          if (_smoothMouthOpen >= 0.32) {
            _visemeState = 'open';
          } else if (_smoothMouthOpen < 0.036) {
            _visemeState = 'closed';
          }
        } else {
          // From resting closed smile, instantly articulate on speech onset
          if (_smoothMouthOpen >= 0.30) {
            _visemeState = 'open';
          } else if (_smoothMouthOpen >= 0.048) {
            _visemeState = 'half';
          } else {
            _visemeState = 'closed';
          }
        }
      } else {
        _visemeState = 'closed';
      }

      // Viseme Rendering: Solid opacity (ZERO ghosting / double-mouth artifact)
      // + Organic dynamic scaling with audio volume
      if (_visemeState === 'open') {
        const excess = Math.max(0, _smoothMouthOpen - 0.24);
        const scaleY = 0.94 + Math.min(0.38, excess * 0.52);
        const scaleX = 0.98 + Math.min(0.12, excess * 0.18);
        $mouthOpen.style.opacity = '1';
        $mouthOpen.style.transform = `scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
        $mouthHalf.style.opacity = '0';
      } else if (_visemeState === 'half') {
        const scaleY = 0.86 + Math.min(0.34, _smoothMouthOpen * 0.60);
        const scaleX = 0.98 + Math.min(0.08, _smoothMouthOpen * 0.16);
        $mouthHalf.style.opacity = '1';
        $mouthHalf.style.transform = `scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
        $mouthOpen.style.opacity = '0';
      } else {
        $mouthHalf.style.opacity = '0';
        $mouthOpen.style.opacity = '0';
      }
    }

    // 7. Check Eye Blink Schedule
    if (ts >= _nextBlinkTime && !_isBlinking) {
      _executeBlink();
    }

    _rafId = requestAnimationFrame(_tick);
  }

  // ── Organic 3D Eye Blinking System ──────────────────────────────────────────
  function _scheduleNextBlink() {
    // Normal human blink interval: 3.0 to 4.8 seconds
    const intervalMs = 3000 + Math.random() * 1800;
    _nextBlinkTime = performance.now() + intervalMs;
  }

  function _executeBlink() {
    if (!$eyelidsImg) return;
    _isBlinking = true;

    // Drop eyelids down
    $eyelidsImg.style.opacity = '1';
    $eyelidsImg.style.transform = 'scaleY(1)';

    const isDoubleBlink = Math.random() < 0.16; // 16% chance of double blink

    setTimeout(() => {
      // Open eyes back up
      if ($eyelidsImg) {
        $eyelidsImg.style.opacity = '0';
        $eyelidsImg.style.transform = 'scaleY(0.9)';
      }

      if (isDoubleBlink) {
        // Quick secondary flutter after 80ms
        setTimeout(() => {
          if ($eyelidsImg) {
            $eyelidsImg.style.opacity = '1';
            $eyelidsImg.style.transform = 'scaleY(1)';
          }
          setTimeout(() => {
            if ($eyelidsImg) {
              $eyelidsImg.style.opacity = '0';
              $eyelidsImg.style.transform = 'scaleY(0.9)';
            }
            _isBlinking = false;
            _scheduleNextBlink();
          }, 110);
        }, 80);
      } else {
        _isBlinking = false;
        _scheduleNextBlink();
      }
    }, 130);
  }

  function triggerBlink() {
    _executeBlink();
  }

  // ── Mascot States & Reactivity ──────────────────────────────────────────────
  function setState(state) {
    _curState = state;
    if (state !== 'talking') {
      _rawMouthOpen    = 0;
      _smoothMouthOpen = 0;
      _visemeState     = 'closed';
      _cadence         = 0;
      _smoothCadence   = 0;
      if ($mouthHalf) $mouthHalf.style.opacity = '0';
      if ($mouthOpen) $mouthOpen.style.opacity = '0';
    }
  }

  function setMouthOpen(v) {
    _rawMouthOpen = Math.max(0, Math.min(1, v));
  }

  function setSpeechCadence(v) {
    _cadence = Math.max(0, Math.min(1, v));
  }

  function triggerLaugh() {
    _lPos    = -14;
    _lVel    = -7;
    _lActive = true;
    _executeBlink();
  }

  // Backward-compatible API stubs
  function setPose(poseName) {
    if (poseName === 'dancing' || poseName === 'thumbs_up') {
      triggerLaugh();
    }
  }

  function setExpression(exprName) {
    if (exprName === 'wink') {
      triggerBlink();
    } else if (exprName === 'laughing' || exprName === 'excited') {
      triggerLaugh();
    }
  }

  return {
    init,
    start,
    stop,
    setState,
    setPose,
    setExpression,
    setMouthOpen,
    setSpeechCadence,
    triggerLaugh,
    triggerBlink,
  };
})();
