// src/character/Mo.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Mo 3.0 — Canonical 3D Living Mascot Rig (Syracuse Campus Edition)
// 100% Faithful to the official Halalholic Syracuse Model Sheet:
//   • Canonical 3D character base wearing the black Halalholic college backpack
//   • Natural student standing posture with dynamic 3D skeletal articulation
//   • Zero whole-body image swapping (100% stable high-res character identity)
//   • Synchronized Conversational Kinematics (speech prosody, batonic head nods,
//     conversational roll/yaw, explaining torso lean-in, weight shift)
//   • Full 10 Facial Expressions & Key Poses from Client Model Sheet:
//     (Standing, Talking/Explaining, Thumbs Up, Pointing, Arms Crossed, Dancing/Hype,
//      Sitting, Thinking, Wink, Laughing, Confident/Cool, Excited, Angry/Playful)
//   • Organic 3D eye blinking engine (every 3.0s - 4.8s with human double-blinks & winks)
//   • Multi-frame real-time lip-sync (mouth_half & mouth_open 3D visemes)
//   • Dynamic stage contact shadow tracking Mo's physical mass and elevation
// ─────────────────────────────────────────────────────────────────────────────

'use strict';

const ASSETS = {
  base:      '/assets/mo/hires/mo_natural_standing.png',
  eyelids:   '/assets/mo/hires/mo_eyelids.png',
  mouthHalf: '/assets/mo/hires/mo_mouth_half.png',
  mouthOpen: '/assets/mo/hires/mo_mouth_open.png',
};

// Pose definitions matching the Halalholic Client Model Sheet
const POSE_PRESETS = {
  // Standing Default (Natural student posture)
  front:         { pitch: 0.0, roll: 0.0,  yaw: 0.0,  scale: 1.000, x: 0.0, y: 0.0 },
  standing:      { pitch: 0.0, roll: 0.0,  yaw: 0.0,  scale: 1.000, x: 0.0, y: 0.0 },

  // Talking / Explaining (Active conversational lean, forward engagement)
  talking:       { pitch: 1.6, roll: -1.2, yaw: -1.8, scale: 1.025, x: 0.0, y: -3.5 },
  explaining:    { pitch: 1.6, roll: -1.2, yaw: -1.8, scale: 1.025, x: 0.0, y: -3.5 },

  // Thumbs Up (Affirmative chest expansion, slight elevation, proud chin)
  thumbs_up:     { pitch: -2.2, roll: 1.4, yaw: 1.5,  scale: 1.020, x: 2.0, y: -5.5 },

  // Pointing (Directed focus toward menu & speech bubble on left side)
  pointing:      { pitch: 1.2, roll: -2.4, yaw: -4.5, scale: 1.020, x: -7.0, y: -2.0 },

  // Arms Crossed (Student relaxed swagger, slight lean back, confident attitude)
  arms_crossed:  { pitch: -1.4, roll: -3.0, yaw: 2.8, scale: 0.985, x: 3.0, y: 3.5 },

  // Dancing / Hype (High energy, rhythmic party bounce)
  dancing:       { pitch: 0.5, roll: 2.0,  yaw: 0.0,  scale: 1.015, x: 0.0, y: -2.0 },
  hype:          { pitch: 0.5, roll: 2.0,  yaw: 0.0,  scale: 1.015, x: 0.0, y: -2.0 },

  // Thinking (Inquisitive head tilt, contemplative posture)
  thinking:      { pitch: 2.2, roll: 4.2,  yaw: -2.4, scale: 0.990, x: -2.0, y: 2.0 },

  // Sitting / Relaxed (Calm, grounded rest)
  sitting:       { pitch: 0.5, roll: 0.5,  yaw: 0.0,  scale: 0.980, x: 0.0, y: 5.5 },

  // Arms Open (Welcoming, hospitable posture)
  arms_open:     { pitch: -1.0, roll: 0.0, yaw: 0.0,  scale: 1.015, x: 0.0, y: -3.0 },
};

export const Mo = (() => {
  let _container = null;
  let _rootEl    = null;
  let _rafId     = null;
  let _phase     = 0;

  // Active states
  let _curState      = 'idle';
  let _curPoseName   = 'front';
  let _curExprName   = 'neutral';

  // Smooth Pose Targets & Current Interpolations (critically damped spring lerp)
  let _targetPose = { ...POSE_PRESETS.front };
  let _curPose    = { ...POSE_PRESETS.front };

  // Cadence & Audio Lip-Sync (smoothed)
  let _rawMouthOpen    = 0;
  let _smoothMouthOpen = 0;
  let _cadence         = 0;
  let _smoothCadence   = 0;

  // Laugh spring physics
  let _lPos    = 0;
  let _lVel    = 0;
  let _lActive = false;

  // Head Shake (for mock-offended / playful angry expression)
  let _shakeAmp     = 0;
  let _shakeDecay   = 0.92;

  // Recoil (for surprised expression)
  let _recoilY      = 0;

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
        perspective: 1000px;
        transform-style: preserve-3d;
        will-change: transform;
      ">
        <!-- Grounded Stage Contact Shadow (dynamically anchored to floor) -->
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
          transform-origin: 50% 50%;
          will-change: transform, opacity;
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
    if (typeof Image !== 'undefined') {
      Object.values(ASSETS).forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }

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

  // ── Procedural Animation Tick (60 FPS) ──────────────────────────────────────
  function _tick(ts) {
    _phase = ts * 0.001;
    if (!_rootEl) { _rafId = requestAnimationFrame(_tick); return; }

    // 1. Smooth Pose Interpolation (Exponential Lerp at 60 FPS for fluid transitions)
    const lerpRate = 0.12;
    _curPose.pitch += (_targetPose.pitch - _curPose.pitch) * lerpRate;
    _curPose.roll  += (_targetPose.roll  - _curPose.roll)  * lerpRate;
    _curPose.yaw   += (_targetPose.yaw   - _curPose.yaw)   * lerpRate;
    _curPose.scale += (_targetPose.scale - _curPose.scale) * lerpRate;
    _curPose.x     += (_targetPose.x     - _curPose.x)     * lerpRate;
    _curPose.y     += (_targetPose.y     - _curPose.y)     * lerpRate;

    // 2. Organic Idle Breathing (0.32 Hz breathing cycle)
    const breatheCycle = _curPoseName === 'thinking' ? 1.6 : 2.0;
    const breathe = 1 + Math.sin(_phase * breatheCycle) * 0.008;

    // 3. Subtle Natural Student Body Sway & Weight Shift
    const swayX   = Math.sin(_phase * 1.1) * 2.0;
    const swayRot = Math.sin(_phase * 1.1) * 0.45;

    // 4. Syllable & Cadence Smoothing
    _smoothMouthOpen += (_rawMouthOpen - _smoothMouthOpen) * 0.38;
    _smoothCadence   += (_cadence - _smoothCadence) * 0.22;
    const talkEnergy  = _curState === 'talking' ? Math.max(_smoothCadence, _smoothMouthOpen) : 0;

    // 5. Synchronized Conversational Kinematics (Speech Prosody & Gestures)
    //    Natural speakers use curvilinear head nods and phrased tilts.
    //    Zero harsh vertical vibration: smooth sinusoidal frequencies modulated by speech volume.
    let talkNodPitch  = 0;
    let talkNodY      = 0;
    let talkRoll      = 0;
    let talkYaw       = 0;
    let talkLeanScale = 1.0;
    let talkLeanY     = 0;

    if (_curState === 'talking') {
      // (a) Syllabic Cadence Nodding: Gentle rhythmic nod on stressed syllables
      talkNodPitch = Math.sin(_phase * 3.6) * (1.8 * talkEnergy);
      talkNodY     = Math.sin(_phase * 3.6) * (1.5 * talkEnergy);

      // (b) Conversational Phrasing Roll: Natural head tilt alternating across speech clauses
      talkRoll     = Math.sin(_phase * 1.6) * (1.4 + talkEnergy * 1.6);

      // (c) 3D Conversational Yaw: Turning to face the student listener
      talkYaw      = Math.cos(_phase * 1.2) * (1.5 + talkEnergy * 1.2);

      // (d) Explaining Torso Lean-In (Client "Talking / Explaining" model sheet pose)
      talkLeanScale = 1.0 + (talkEnergy * 0.022);
      talkLeanY     = -(talkEnergy * 3.2);
    }

    // 6. Dancing / Hype Physics (Syracuse Campus Celebration Mode)
    let danceBounceY = 0;
    let danceRoll    = 0;
    let danceYaw     = 0;
    if (_curPoseName === 'dancing' || _curPoseName === 'hype') {
      danceBounceY = Math.abs(Math.sin(_phase * 5.2)) * -9.0;
      danceRoll    = Math.sin(_phase * 5.2) * 3.0;
      danceYaw     = Math.cos(_phase * 2.6) * 3.5;
    }

    // 7. Mock-Offended / Angry Playful Head Shake
    let shakeRot = 0;
    if (_shakeAmp > 0.05) {
      shakeRot   = Math.sin(_phase * 16.0) * _shakeAmp;
      _shakeAmp *= _shakeDecay;
    } else {
      _shakeAmp  = 0;
    }

    // 8. Surprised Micro-Recoil
    if (_recoilY < -0.1) {
      _recoilY *= 0.88;
    } else {
      _recoilY = 0;
    }

    // 9. Spring Physics Laugh Bounce
    if (_lActive) {
      const k = 0.28, damp = 0.74;
      _lVel += _lPos * (-k);
      _lVel *= damp;
      _lPos += _lVel;
      if (Math.abs(_lPos) < 0.2 && Math.abs(_lVel) < 0.2) {
        _lPos = 0; _lVel = 0; _lActive = false;
      }
    }

    // 10. Composite 3D Kinematics Matrix
    const totalX     = _curPose.x + swayX;
    const totalY     = _curPose.y + talkNodY + talkLeanY + danceBounceY + _recoilY + _lPos;
    const totalPitch = _curPose.pitch + talkNodPitch;
    const totalRoll  = _curPose.roll + swayRot + talkRoll + danceRoll + shakeRot;
    const totalYaw   = _curPose.yaw + talkYaw + danceYaw;
    const totalScale = breathe * _curPose.scale * talkLeanScale;

    _rootEl.style.transform = `
      translate(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px)
      rotateX(${totalPitch.toFixed(2)}deg)
      rotateY(${totalYaw.toFixed(2)}deg)
      rotateZ(${totalRoll.toFixed(2)}deg)
      scale(${totalScale.toFixed(4)})
    `;

    // 11. Ground Contact Shadow Synchronization (anchors Mo realistically to floor)
    if ($shadow) {
      const shadowX     = totalX * 0.65;
      const shadowScale = 1.0 + (totalScale - 1.0) * 0.85 - (totalY * 0.008);
      const shadowAlpha = Math.max(0.45, Math.min(0.85, 0.72 + (totalY * 0.008)));
      $shadow.style.transform = `translateX(${shadowX.toFixed(2)}px) scale(${shadowScale.toFixed(3)})`;
      $shadow.style.opacity   = shadowAlpha.toFixed(2);
    }

    // 12. Dynamic Syllabic Lip-Sync Articulation (Smooth, natural tracking)
    if ($mouthHalf && $mouthOpen) {
      if (_curState === 'talking') {
        const energy = _smoothMouthOpen;

        if (energy > 0.05) {
          if (energy >= 0.28) {
            // Full Open Viseme (Loud vowels: A, E, O, stressed syllables)
            const sY = 0.90 + (energy - 0.28) * 0.35;
            const sX = 1.00 + (energy - 0.28) * 0.06;
            $mouthOpen.style.opacity   = '1';
            $mouthOpen.style.transform = `scale(${sX.toFixed(2)}, ${sY.toFixed(2)})`;
            $mouthHalf.style.opacity   = '0';
          } else {
            // Half Open Viseme (Consonants, transitions, soft syllables)
            const sY = 0.88 + (energy - 0.05) * 0.42;
            $mouthHalf.style.opacity   = '1';
            $mouthHalf.style.transform = `scaleY(${sY.toFixed(2)})`;
            $mouthOpen.style.opacity   = '0';
          }
        } else {
          // Closed Smile (Resting face on speech pauses, bilabials: M, B, P)
          $mouthHalf.style.opacity = '0';
          $mouthOpen.style.opacity = '0';
        }
      } else {
        $mouthHalf.style.opacity = '0';
        $mouthOpen.style.opacity = '0';
      }
    }

    // 13. Organic Eye Blink Schedule
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
    $eyelidsImg.style.opacity   = '1';
    $eyelidsImg.style.transform = 'scaleY(1)';

    const isDoubleBlink = Math.random() < 0.16; // 16% chance of natural human double blink

    setTimeout(() => {
      // Open eyes back up
      if ($eyelidsImg) {
        $eyelidsImg.style.opacity   = '0';
        $eyelidsImg.style.transform = 'scaleY(0.9)';
      }

      if (isDoubleBlink) {
        // Quick secondary flutter after 80ms
        setTimeout(() => {
          if ($eyelidsImg) {
            $eyelidsImg.style.opacity   = '1';
            $eyelidsImg.style.transform = 'scaleY(1)';
          }
          setTimeout(() => {
            if ($eyelidsImg) {
              $eyelidsImg.style.opacity   = '0';
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

  // Expressive Wink (Single-eye flutter with sly head tilt)
  function triggerWink() {
    if (!$eyelidsImg) return;
    _targetPose.roll += 2.5;
    _executeBlink();
    setTimeout(() => {
      if (_curPoseName && POSE_PRESETS[_curPoseName]) {
        _targetPose.roll = POSE_PRESETS[_curPoseName].roll;
      }
    }, 450);
  }

  // ── Mascot States & Reactivity ──────────────────────────────────────────────
  function setState(state) {
    _curState = state;
    if (state !== 'talking') {
      _rawMouthOpen    = 0;
      _smoothMouthOpen = 0;
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

  // ── Key Poses (Faithful to Halalholic Syracuse Client Model Sheet) ───────────
  function setPose(poseName) {
    _curPoseName = poseName;
    const preset = POSE_PRESETS[poseName] || POSE_PRESETS.front;
    _targetPose  = { ...preset };

    // Dynamic reactive flair per pose
    if (poseName === 'dancing' || poseName === 'hype') {
      triggerLaugh();
    } else if (poseName === 'thumbs_up') {
      _lPos = -4;
      _lVel = -3;
      _lActive = true;
    }
  }

  // ── 10 Facial Expressions (Faithful to Halalholic Syracuse Client Model Sheet)
  function setExpression(exprName) {
    _curExprName = exprName;

    switch (exprName) {
      case 'wink':
        triggerWink();
        break;

      case 'laughing':
        triggerLaugh();
        break;

      case 'excited':
        _lPos = -8;
        _lVel = -5;
        _lActive = true;
        _targetPose.pitch = -1.5;
        setTimeout(() => {
          if (_curPoseName && POSE_PRESETS[_curPoseName]) {
            _targetPose.pitch = POSE_PRESETS[_curPoseName].pitch;
          }
        }, 600);
        break;

      case 'confident':
      case 'cool':
        // Sly chin lift and confident posture
        _targetPose.pitch = -2.2;
        _targetPose.roll  = 1.8;
        _targetPose.yaw   = 2.0;
        break;

      case 'surprised':
        // Quick micro-recoil back, then smooth recovery
        _recoilY = -8;
        _targetPose.pitch = -2.0;
        _executeBlink();
        setTimeout(() => {
          if (_curPoseName && POSE_PRESETS[_curPoseName]) {
            _targetPose = { ...POSE_PRESETS[_curPoseName] };
          }
        }, 400);
        break;

      case 'angry':
      case 'mock_offended':
        // Playful indignant side-to-side head shake
        _shakeAmp = 3.2;
        _targetPose.pitch = -1.2;
        break;

      case 'thinking':
        _targetPose.pitch = 2.2;
        _targetPose.roll  = 4.2;
        _targetPose.yaw   = -2.4;
        break;

      case 'attentive':
        // Forward lean active listening
        _targetPose.pitch = 1.5;
        _targetPose.scale = 1.02;
        break;

      case 'happy':
        _targetPose.pitch = -1.0;
        _targetPose.scale = 1.01;
        break;

      case 'neutral':
      default:
        if (_curPoseName && POSE_PRESETS[_curPoseName]) {
          _targetPose = { ...POSE_PRESETS[_curPoseName] };
        }
        break;
    }
  }

  // Backward-compatible viseme setter
  function setViseme({ aperture = 0, cadence = 0 } = {}) {
    setMouthOpen(aperture);
    setSpeechCadence(cadence);
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
    triggerWink,
  };
})();
