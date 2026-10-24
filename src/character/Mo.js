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
  visemes: {
    aa:     '/assets/mo/hires/visemes/viseme_aa.png',
    ee:     '/assets/mo/hires/visemes/viseme_ee.png',
    oh:     '/assets/mo/hires/visemes/viseme_oh.png',
    ou:     '/assets/mo/hires/visemes/viseme_ou.png',
    dental: '/assets/mo/hires/visemes/viseme_dental.png',
    fv:     '/assets/mo/hires/visemes/viseme_fv.png',
    mbp:    '/assets/mo/hires/visemes/viseme_mbp.png',
  },
  // Backward compatibility fallbacks
  mouthHalf: '/assets/mo/hires/visemes/viseme_dental.png',
  mouthOpen: '/assets/mo/hires/visemes/viseme_aa.png',
};

const VISEME_KEYS = ['aa', 'ee', 'oh', 'ou', 'dental', 'fv', 'mbp'];

export const Mo = (() => {
  let _container = null;
  let _rootEl    = null;
  let _rafId     = null;
  let _phase     = 0;

  // Active states
  let _curState  = 'idle';

  // Cadence & Modern AI Avatar Viseme Lip-Sync
  let _currentViseme   = 'rest';
  let _rawAperture     = 0;
  let _smoothAperture  = 0;
  let _rawSpread       = 0;
  let _smoothSpread    = 0;
  let _cadence         = 0;

  // Laugh spring physics
  let _lPos    = 0;
  let _lVel    = 0;
  let _lActive = false;

  // Eye blinking engine
  let _nextBlinkTime = 0;
  let _isBlinking    = false;

  // DOM Elements
  let $baseImg, $eyelidsImg, $mouthGroup, $shadow;
  const $visemeEls = {};

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

        <!-- Layer 2: Anatomical Skeletal Jaw & 8-Viseme Mouth Articulation Group -->
        <div id="mo-mouth-group" style="
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          user-select: none;
          z-index: 3;
          transform-origin: 51.06% 32.08%;
          will-change: transform;
        ">
          <img id="mo-viseme-aa" src="${ASSETS.visemes.aa}" alt="AA" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: none; will-change: opacity, transform; transform-origin: 51.06% 32.08%; pointer-events: none;" />
          <img id="mo-viseme-ee" src="${ASSETS.visemes.ee}" alt="EE" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: none; will-change: opacity, transform; transform-origin: 51.06% 32.08%; pointer-events: none;" />
          <img id="mo-viseme-oh" src="${ASSETS.visemes.oh}" alt="OH" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: none; will-change: opacity, transform; transform-origin: 51.06% 32.08%; pointer-events: none;" />
          <img id="mo-viseme-ou" src="${ASSETS.visemes.ou}" alt="OU" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: none; will-change: opacity, transform; transform-origin: 51.06% 32.08%; pointer-events: none;" />
          <img id="mo-viseme-dental" src="${ASSETS.visemes.dental}" alt="DENTAL" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: none; will-change: opacity, transform; transform-origin: 51.06% 32.08%; pointer-events: none;" />
          <img id="mo-viseme-fv" src="${ASSETS.visemes.fv}" alt="FV" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: none; will-change: opacity, transform; transform-origin: 51.06% 32.08%; pointer-events: none;" />
          <img id="mo-viseme-mbp" src="${ASSETS.visemes.mbp}" alt="MBP" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: none; will-change: opacity, transform; transform-origin: 51.06% 32.08%; pointer-events: none;" />
        </div>

        <!-- Layer 3: 3D Natural Eyelid Overlay for Organic Blinking -->
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
    $mouthGroup = _container.querySelector('#mo-mouth-group');
    $eyelidsImg = _container.querySelector('#mo-eyelids-overlay');
    $shadow     = _container.querySelector('#mo-floor-shadow');

    VISEME_KEYS.forEach(key => {
      $visemeEls[key] = _container.querySelector(`#mo-viseme-${key}`);
    });

    // Preload all viseme textures
    const preloadUrls = [ASSETS.base, ASSETS.eyelids, ...Object.values(ASSETS.visemes)];
    preloadUrls.forEach(src => {
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

    // 6. Modern AI Avatar Phonetic Lip-Sync & Skeletal Jaw Hinge Engine
    _smoothAperture += (_rawAperture - _smoothAperture) * 0.90;
    _smoothSpread   += (_rawSpread - _smoothSpread) * 0.35;

    if ($mouthGroup) {
      // Anatomical Jaw-Drop Transform (Spring-hinged jaw drop on loud open vowels)
      let jawDropY = 0;
      if (_curState === 'talking' && _currentViseme !== 'rest') {
        if (_currentViseme === 'aa') jawDropY = _smoothAperture * 3.2;
        else if (_currentViseme === 'oh') jawDropY = _smoothAperture * 2.2;
        else if (_currentViseme === 'ee' || _currentViseme === 'dental') jawDropY = _smoothAperture * 1.0;
        else jawDropY = _smoothAperture * 0.6;
      }
      $mouthGroup.style.transform = `translateY(${jawDropY.toFixed(2)}px)`;

      // Parametric Elastic Scaling on Active Viseme
      let sx = 1.0, sy = 1.0;
      if (_currentViseme === 'aa') {
        sy = 0.95 + _smoothAperture * 0.38;
        sx = 1.00 + _smoothAperture * 0.08;
      } else if (_currentViseme === 'ee') {
        sy = 0.92 + _smoothAperture * 0.16;
        sx = 1.04 + _smoothAperture * 0.16;
      } else if (_currentViseme === 'oh') {
        sy = 0.94 + _smoothAperture * 0.28;
        sx = 0.96 - _smoothAperture * 0.08;
      } else if (_currentViseme === 'ou') {
        sy = 0.92 + _smoothAperture * 0.22;
        sx = 0.88 - _smoothAperture * 0.12;
      } else if (_currentViseme === 'dental') {
        sy = 0.90 + _smoothAperture * 0.18;
        sx = 1.00 + _smoothAperture * 0.08;
      } else if (_currentViseme === 'fv') {
        sy = 0.88 + _smoothAperture * 0.15;
        sx = 0.98;
      } else if (_currentViseme === 'mbp') {
        sy = 0.85 + _smoothAperture * 0.10;
        sx = 0.98;
      }

      // Viseme Rendering: Solid Opacity (ZERO ghosting / double-mouth artifact)
      for (let i = 0; i < VISEME_KEYS.length; i++) {
        const key = VISEME_KEYS[i];
        const el = $visemeEls[key];
        if (!el) continue;

        if (_curState === 'talking' && _currentViseme === key && _smoothAperture > 0.035) {
          el.style.opacity = '1';
          el.style.transform = `scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
        } else {
          el.style.opacity = '0';
        }
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
      _rawAperture    = 0;
      _smoothAperture = 0;
      _rawSpread      = 0;
      _smoothSpread   = 0;
      _currentViseme  = 'rest';
      _cadence         = 0;
      _smoothCadence   = 0;
      if ($mouthGroup) $mouthGroup.style.transform = 'translateY(0px)';
      for (let i = 0; i < VISEME_KEYS.length; i++) {
        const el = $visemeEls[VISEME_KEYS[i]];
        if (el) el.style.opacity = '0';
      }
    }
  }

  function setViseme({ viseme = 'rest', aperture = 0, spread = 0, cadence = 0 } = {}) {
    _currentViseme = viseme;
    _rawAperture   = Math.max(0, Math.min(1, aperture));
    _rawSpread     = Math.max(-1, Math.min(1, spread));
    _cadence       = Math.max(0, Math.min(1, cadence));
  }

  function setMouthOpen(v) {
    _rawAperture = Math.max(0, Math.min(1, v));
    if (_curState === 'talking' && _currentViseme === 'rest' && _rawAperture > 0.05) {
      _currentViseme = _rawAperture > 0.35 ? 'aa' : 'dental';
    }
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
    setViseme,
    setMouthOpen,
    setSpeechCadence,
    triggerLaugh,
    triggerBlink,
  };
})();
