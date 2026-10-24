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
  let $bodyLayers= null;
  let _rafId     = null;
  let _phase     = 0;

  // Active states
  let _curState  = 'idle';

  // Cadence & Bi-Band Audio Lip-Sync (smoothed)
  let _rawMouthOpen     = 0;
  let _smoothMouthOpen  = 0;
  let _rawMouthWidth    = 0;
  let _smoothMouthWidth = 0;
  let _cadence          = 0;
  let _speechStress     = 0;

  // 3D Conversational Kinetics
  let _talkLean         = 0;  // 0 (idle) -> 1 (talking lean-in)
  let _nodPos           = 0;  // Spring position for syllable head nod
  let _nodVel           = 0;  // Spring velocity for syllable head nod

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
        perspective: 900px;
        transform-style: preserve-3d;
      ">
        <!-- Grounded Stage Contact Shadow (Anchored to Floor Platform) -->
        <div id="mo-floor-shadow" style="
          position: absolute;
          bottom: 8px;
          width: 50%;
          height: 20px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.74) 0%, rgba(6,21,19,0.38) 50%, transparent 72%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          filter: blur(4px);
          transition: transform 0.15s ease-out, opacity 0.15s ease-out;
        "></div>

        <!-- Articulated 3D Body Mesh Wrapper (Pivots naturally from feet & hips) -->
        <div id="mo-body-layers" style="
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform-origin: 50% 88%;
          transform-style: preserve-3d;
          will-change: transform;
        ">
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
            will-change: opacity, transform;
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
            will-change: opacity, transform;
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
      </div>
    `;

    _rootEl     = _container.querySelector('#mo-mascot-rig');
    $bodyLayers = _container.querySelector('#mo-body-layers');
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

  // ── Procedural Animation Tick (60 FPS Multi-Layer Kinetics) ──────────────────
  function _tick(ts) {
    _phase = ts * 0.001;
    if (!_rootEl || !$bodyLayers) { _rafId = requestAnimationFrame(_tick); return; }

    // 1. Organic Idle & Speech-Modulated Chest Breathing (0.28 Hz idle, energized speech respiration)
    const breathSpeed  = 1.75 + (_talkLean * 0.95);
    const breatheDepth = 0.007 + (_talkLean * 0.005);
    const breathe      = 1 + Math.sin(_phase * breathSpeed) * breatheDepth;

    // 2. Conversational Lean-In Dynamics (Active Attentive Engagement)
    // Smoothly steps/leans forward toward the student when speaking, returning on pauses
    const targetLean = _curState === 'talking' ? 1.0 : 0.0;
    _talkLean += (targetLean - _talkLean) * 0.075;

    // 3. Asymmetric Dual-Axis Weight Shift (Hip & Foot Posture Shift)
    // Compound harmonic Lissajous sway creates non-repetitive organic human life
    const hipSwayX   = Math.sin(_phase * 0.82) * 2.8 + Math.cos(_phase * 1.65) * 1.2;
    const hipSwayRot = Math.sin(_phase * 0.82) * 0.45;

    // 4. Conversational Communicative Head Tilts & Question Pitch
    // Heads subtly tilt sideways during phrases (~1.2° to 2.2°) as pitch changes
    const phraseCycle = _curState === 'talking'
      ? Math.sin(_phase * 2.4) * 1.5 + Math.cos(_phase * 1.1) * 0.9
      : 0;

    // 5. Speech Syllable Stress Micro-Nod (Spring-Damped Kinematics)
    // Impulse downward nod on stressed syllables detected from audio derivative:
    if (_speechStress > 0.05) {
      _nodVel -= _speechStress * 6.5;
      _speechStress *= 0.55; // consume pulse
    }
    const kS = 0.26, dampS = 0.76;
    _nodVel += (-_nodPos) * kS;
    _nodVel *= dampS;
    _nodPos += _nodVel;
    const nodOffset = _nodPos;

    // 6. Conversational Cadence Rhythmic Body Resonance
    const speechCadenceBounce = _curState === 'talking'
      ? Math.sin(_phase * 7.5) * (_cadence * 2.2)
      : 0;

    // 7. Spring physics laugh bounce
    if (_lActive) {
      const k = 0.28, damp = 0.74;
      _lVel += _lPos * (-k);
      _lVel *= damp;
      _lPos += _lVel;
      if (Math.abs(_lPos) < 0.2 && Math.abs(_lVel) < 0.2) {
        _lPos = 0; _lVel = 0; _lActive = false;
      }
    }

    // 8. 3D Articulated Kinematic Synthesis
    //   • Forward 3D perspective pitch (rotateX: 0 to 2.4 deg)
    //   • Torso drops slightly (posture relaxing into conversation)
    //   • Micro zoom (1.0 to 1.024) creating spatial camera depth
    const pitchForward = _talkLean * 2.4;
    const talkDropY    = _talkLean * 4.2;
    const scaleDepth   = 1.0 + (_talkLean * 0.024);

    const totalX   = hipSwayX;
    const totalY   = nodOffset + speechCadenceBounce + talkDropY + _lPos;
    const totalRot = hipSwayRot + phraseCycle;

    $bodyLayers.style.transform = `
      perspective(850px)
      translate3d(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0)
      rotateX(${pitchForward.toFixed(2)}deg)
      rotateZ(${totalRot.toFixed(2)}deg)
      scale(${breathe * scaleDepth})
    `;

    // 9. Grounded Stage Contact Shadow Synchronization
    if ($shadow) {
      const shadowShiftX = hipSwayX * 0.45;
      const shadowScaleX = 1 + (_talkLean * 0.06);
      const shadowScaleY = 1 - (_talkLean * 0.08);
      const shadowAlpha  = 0.72 + (_talkLean * 0.14);
      $shadow.style.transform = `translateX(${shadowShiftX.toFixed(1)}px) scale(${shadowScaleX.toFixed(2)}, ${shadowScaleY.toFixed(2)})`;
      $shadow.style.opacity   = shadowAlpha.toFixed(2);
    }

    // 10. Organic Smooth Bi-Band Viseme Crossfade & Elastic Articulation
    _smoothMouthOpen  += (_rawMouthOpen  - _smoothMouthOpen)  * 0.65;
    _smoothMouthWidth += (_rawMouthWidth - _smoothMouthWidth) * 0.48;

    if ($mouthHalf && $mouthOpen) {
      if (_curState === 'talking' && _smoothMouthOpen > 0.025) {
        const energy = _smoothMouthOpen;
        const width  = _smoothMouthWidth;

        // Dynamic elastic scale based on vowel resonance vs consonant tension:
        // Consonant tension widens mouth (scaleX up to 1.12)
        // Vowel resonance drops jaw (scaleY up to 1.18)
        const scaleX = 1.0 + (width * 0.12) - (energy * 0.04);
        const scaleYHalf = 0.86 + (energy * 0.55);
        const scaleYOpen = 0.88 + ((energy - 0.22) * 0.42);

        if (energy < 0.24) {
          // Soft Consonant / Transition Phase: Smoothly fade in Mouth Half
          const halfAlpha = Math.min(1.0, (energy - 0.025) / 0.12);
          $mouthHalf.style.opacity = halfAlpha.toFixed(2);
          $mouthHalf.style.transform = `scale(${scaleX.toFixed(2)}, ${scaleYHalf.toFixed(2)})`;
          $mouthOpen.style.opacity = '0';
        } else {
          // Open Vowel / Stressed Phase: Seamless crossfade from Half to Full Open
          const crossfade = Math.min(1.0, (energy - 0.24) / 0.18);
          $mouthHalf.style.opacity = (1.0 - crossfade).toFixed(2);
          $mouthHalf.style.transform = `scale(${scaleX.toFixed(2)}, ${scaleYHalf.toFixed(2)})`;

          $mouthOpen.style.opacity = crossfade.toFixed(2);
          $mouthOpen.style.transform = `scale(${scaleX.toFixed(2)}, ${Math.max(0.85, scaleYOpen).toFixed(2)})`;
        }
      } else {
        // Natural Closed Smile at Rest & Speech Pauses
        $mouthHalf.style.opacity = '0';
        $mouthOpen.style.opacity = '0';
      }
    }

    // 11. Check Eye Blink Schedule
    if (ts >= _nextBlinkTime && !_isBlinking) {
      _executeBlink();
    }

    _rafId = requestAnimationFrame(_tick);
  }

  // ── Organic 3D Eye Blinking System ──────────────────────────────────────────
  function _scheduleNextBlink() {
    const intervalMs = 3000 + Math.random() * 1800;
    _nextBlinkTime = performance.now() + intervalMs;
  }

  function _executeBlink() {
    if (!$eyelidsImg) return;
    _isBlinking = true;

    $eyelidsImg.style.opacity = '1';
    $eyelidsImg.style.transform = 'scaleY(1)';

    const isDoubleBlink = Math.random() < 0.16;

    setTimeout(() => {
      if ($eyelidsImg) {
        $eyelidsImg.style.opacity = '0';
        $eyelidsImg.style.transform = 'scaleY(0.9)';
      }

      if (isDoubleBlink) {
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
      _rawMouthOpen     = 0;
      _smoothMouthOpen  = 0;
      _rawMouthWidth    = 0;
      _smoothMouthWidth = 0;
      _speechStress     = 0;
      if ($mouthHalf) $mouthHalf.style.opacity = '0';
      if ($mouthOpen) $mouthOpen.style.opacity = '0';
    }
  }

  function setAcousticArticulation(art) {
    if (!art) return;
    if (typeof art.openness === 'number') _rawMouthOpen = Math.max(0, Math.min(1, art.openness));
    if (typeof art.width === 'number')    _rawMouthWidth = Math.max(0, Math.min(1, art.width));
    if (typeof art.stress === 'number' && art.stress > 0.08) {
      _speechStress = Math.max(_speechStress, art.stress);
    }
    if (typeof art.cadence === 'number')  _cadence = Math.max(0, Math.min(1, art.cadence));
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
    setAcousticArticulation,
    setPose,
    setExpression,
    setMouthOpen,
    setSpeechCadence,
    triggerLaugh,
    triggerBlink,
  };
})();
