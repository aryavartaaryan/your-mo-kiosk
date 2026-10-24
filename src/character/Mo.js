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

  // Coarticulation syllable smoothing
  let _activeViseme = 'closed'; // 'closed' | 'half' | 'open'
  let _lastSpeechTs = 0;

  // ── Procedural Animation Tick (60 FPS) ──────────────────────────────────────
  function _tick(ts) {
    _phase = ts * 0.001;
    if (!_rootEl) { _rafId = requestAnimationFrame(_tick); return; }

    // 1. Organic Idle Breathing (0.32 Hz)
    const breathe = 1 + Math.sin(_phase * 2.0) * 0.008;

    // 2. Subtle Natural Body Sway & Weight Shift
    const swayX   = Math.sin(_phase * 1.1) * 2.0;
    const swayRot = Math.sin(_phase * 1.1) * 0.45;

    // 3. Natural conversational engagement tilt (zero vertical vibration)
    const talkTilt = _curState === 'talking'
      ? Math.sin(_phase * 2.2) * 0.35
      : 0;

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

    _rootEl.style.transform = `
      translate(${swayX}px, ${_lPos}px)
      rotate(${swayRot + talkTilt}deg)
      scale(${breathe})
    `;

    // 5. Dynamic Syllabic Lip-Sync Articulation (Smooth, natural tracking)
    _smoothMouthOpen += (_rawMouthOpen - _smoothMouthOpen) * 0.38;

    if ($mouthHalf && $mouthOpen) {
      if (_curState === 'talking') {
        const energy = _smoothMouthOpen;

        if (energy > 0.05) {
          if (energy >= 0.28) {
            // Full Open Viseme (Loud vowels: A, E, O, stressed syllables)
            const sY = 0.90 + (energy - 0.28) * 0.35;
            const sX = 1.0 + (energy - 0.28) * 0.06;
            $mouthOpen.style.opacity = '1';
            $mouthOpen.style.transform = `scale(${sX.toFixed(2)}, ${sY.toFixed(2)})`;
            $mouthHalf.style.opacity = '0';
          } else {
            // Half Open Viseme (Consonants, transitions, soft syllables)
            const sY = 0.88 + (energy - 0.05) * 0.42;
            $mouthHalf.style.opacity = '1';
            $mouthHalf.style.transform = `scaleY(${sY.toFixed(2)})`;
            $mouthOpen.style.opacity = '0';
          }
        } else {
          // Closed Smile (Resting face on pauses, bilabials: M, B, P)
          $mouthHalf.style.opacity = '0';
          $mouthOpen.style.opacity = '0';
        }
      } else {
        $mouthHalf.style.opacity = '0';
        $mouthOpen.style.opacity = '0';
      }
    }

    // 6. Check Eye Blink Schedule
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
