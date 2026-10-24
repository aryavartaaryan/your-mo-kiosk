// src/ui/App.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Kiosk UI Shell v10.0 — Syracuse University Flagship World-Class Edition
// Ultra-Premium US QSR Collegiate Kiosk:
//   • Grounded 3D Holographic Stage Pedestal & realistic floor occlusion shadow
//   • Monumental horizontal varsity stadium arch (HALALHOLIC) with zero collisions
//   • High-Energy Crave Chips with real food photography thumbnails & neon badges
//   • Dynamic floating speech bubble anchored to Mo with live acoustic EQ waves
//   • Perfectly centered circular Sonic Reactor ("Tap to Talk") with concentric waves
//   • Seamless peripheral campus lifestyle & food craving interactive vignettes
//   • Unified frosted obsidian luxury navigation header
// ─────────────────────────────────────────────────────────────────────────────

import { CONFIG } from '../config.js';

function injectStyles(colors) {
  const css = /* css */`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Space+Grotesk:wght@700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --c-primary:        ${colors.primary};
      --c-secondary:      ${colors.secondary};
      --c-accent:         ${colors.accent};
      --c-bg:             #070D0B;
      --c-surface:        #0E201C;
      --c-surface-glass:  rgba(14, 30, 26, 0.88);
      --c-card-glass:     rgba(14, 32, 28, 0.86);
      --c-text:           ${colors.text};
      --c-muted:          ${colors.textMuted};
      --font-display:     'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
      --font-ui:          'Plus Jakarta Sans', system-ui, sans-serif;
    }

    html, body {
      width: 100vw; height: 100vh;
      margin: 0; padding: 0;
      overflow: hidden;
      background: var(--c-bg);
      color: var(--c-text);
      font-family: var(--font-ui);
      -webkit-font-smoothing: antialiased;
      user-select: none;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #app {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      width: 100vw;
      height: 100vh;
      position: relative;
      overflow: hidden;
      background: radial-gradient(ellipse at 50% 36%, #152A23 0%, #08110E 55%, #050A08 100%);
    }

    /* ── Cyber-Varsity Campus Stage Grid Matrix ── */
    #bg-campus-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 110, 20, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 110, 20, 0.04) 1px, transparent 1px);
      background-size: 54px 54px;
      mask-image: radial-gradient(ellipse at 50% 46%, black 35%, transparent 80%);
      -webkit-mask-image: radial-gradient(ellipse at 50% 46%, black 35%, transparent 80%);
      pointer-events: none;
      z-index: 0;
    }

    /* ── Monumental Architectural Brand Identity: Varsity Stadium Horizon Banner ── */
    #bg-brand-backdrop {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      pointer-events: none;
      user-select: none;
      z-index: 1;
      width: 100%;
      max-width: 1200px;
    }

    #bg-brand-backdrop .bg-title-crest {
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 4.5px;
      color: #FFA044;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 2px;
      opacity: 0.95;
      text-shadow: 0 0 16px rgba(255, 160, 68, 0.7);
    }

    #bg-brand-backdrop .bg-title-text {
      font-family: var(--font-display);
      font-size: clamp(58px, 8.8vw, 115px);
      font-weight: 900;
      letter-spacing: 0.22em;
      line-height: 0.92;
      text-transform: uppercase;
      color: transparent;
      -webkit-text-stroke: 2.5px rgba(255, 120, 30, 0.42);
      background: linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,115,20,0.22) 55%, rgba(10,36,32,0.02) 100%);
      -webkit-background-clip: text;
      filter: drop-shadow(0 0 42px rgba(255, 106, 0, 0.35));
      white-space: nowrap;
    }

    #bg-brand-backdrop .bg-title-sub {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(255, 160, 68, 0.65);
      margin-top: 4px;
    }

    /* ── Ambient Radial Saffron Warmth Behind Mascot ── */
    #bg-spotlight {
      position: absolute;
      top: 46%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(72vh, 620px);
      height: min(72vh, 620px);
      background: radial-gradient(circle,
        rgba(255, 120, 20, 0.24) 0%,
        rgba(255, 80, 0, 0.09) 38%,
        rgba(10, 36, 32, 0.03) 65%,
        transparent 75%
      );
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      animation: ambient-breathe 7s ease-in-out infinite alternate;
    }
    @keyframes ambient-breathe {
      0%   { transform: translate(-50%, -50%) scale(0.96); opacity: 0.85; }
      100% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
    }

    /* ── Floating Food-Kiosk Saffron Embers ── */
    .kiosk-ember {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      animation: ember-float linear infinite;
    }
    @keyframes ember-float {
      0%   { transform: translateY(0) scale(1); opacity: 0.75; }
      50%  { opacity: 0.35; }
      100% { transform: translateY(-105vh) scale(0.2); opacity: 0; }
    }

    /* ── Header: Unified Luxury Frosted Navigation Bar ── */
    #header {
      position: relative; z-index: 30;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 36px 0;
      flex-shrink: 0;
    }

    #header-campus-pill {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 8px 18px;
      border-radius: 99px;
      background: rgba(14, 32, 28, 0.88);
      border: 1.5px solid rgba(255, 120, 40, 0.35);
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      flex-shrink: 0;
    }
    #header-campus-pill .flame-icon {
      font-size: 15px;
      filter: drop-shadow(0 0 8px #FF6A00);
    }
    #header-campus-pill .campus-text {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: #FFF;
      text-transform: uppercase;
      font-family: var(--font-display);
    }
    #header-campus-pill .sub-tag {
      color: #FFA044;
      font-weight: 700;
      font-size: 10px;
    }

    #header-center-emblem {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 18px;
      border-radius: 99px;
      background: rgba(14, 32, 28, 0.76);
      border: 1px solid rgba(255, 140, 50, 0.3);
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 18px rgba(0,0,0,0.3);
      pointer-events: none;
      user-select: none;
    }
    #header-center-emblem .emblem-bolt {
      color: #FFA044;
      font-size: 12px;
      filter: drop-shadow(0 0 6px rgba(255, 160, 68, 0.9));
    }
    #header-center-emblem .emblem-text {
      font-family: var(--font-display);
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 1.8px;
      color: #FFF;
      text-transform: uppercase;
    }
    #header-center-emblem .emblem-tag {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #72CC38;
      text-transform: uppercase;
    }

    #header-nav {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Crave Menu Launcher */
    #menu-board-btn {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 8px 18px;
      border-radius: 99px;
      background: linear-gradient(135deg, rgba(255, 106, 0, 0.32) 0%, rgba(14, 36, 32, 0.92) 100%);
      border: 1.5px solid rgba(255, 120, 40, 0.5);
      color: #FFF;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      cursor: pointer;
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 22px rgba(255, 106, 0, 0.32), inset 0 1px 1px rgba(255,255,255,0.25);
      transition: all 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #menu-board-btn:hover {
      background: linear-gradient(135deg, rgba(255, 106, 0, 0.48) 0%, rgba(18, 54, 48, 0.96) 100%);
      border-color: #FFA044;
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 8px 32px rgba(255, 106, 0, 0.6), inset 0 1px 2px rgba(255,255,255,0.4);
    }
    #menu-board-btn:active {
      transform: translateY(1px) scale(0.98);
    }
    #menu-board-btn .menu-btn-icon {
      font-size: 14px;
      filter: drop-shadow(0 0 6px #FF6A00);
      animation: flame-flicker 2s ease-in-out infinite alternate;
    }
    @keyframes flame-flicker {
      0%   { transform: scale(1) rotate(-4deg); }
      100% { transform: scale(1.15) rotate(4deg); }
    }
    #menu-board-btn .menu-btn-badge {
      font-size: 8.5px;
      font-weight: 900;
      letter-spacing: 0.8px;
      padding: 2px 7px;
      border-radius: 99px;
      background: linear-gradient(90deg, #FF6A00 0%, #FF9944 100%);
      color: #000;
      box-shadow: 0 0 10px rgba(255, 106, 0, 0.7);
    }

    #status-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: var(--c-surface-glass);
      border: 1.5px solid rgba(255,255,255,0.14);
      backdrop-filter: blur(14px);
      color: var(--c-muted);
      transition: all 0.35s ease;
      box-shadow: 0 4px 18px rgba(0,0,0,0.35);
    }
    #status-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: currentColor;
    }
    #status-pill.state-idle      { color: #72CC38; border-color: rgba(114, 204, 56, 0.35); }
    #status-pill.state-listening {
      color: #FF8A30;
      border-color: #FF8A30;
      background: rgba(255, 106, 0, 0.16);
      box-shadow: 0 0 24px rgba(255, 106, 0, 0.4);
    }
    #status-pill.state-listening #status-dot {
      animation: dot-pulse 0.9s ease-in-out infinite;
    }
    #status-pill.state-talking   {
      color: #72CC38;
      border-color: #72CC38;
      background: rgba(114, 204, 56, 0.18);
      box-shadow: 0 0 24px rgba(114, 204, 56, 0.35);
    }
    #status-pill.state-talking #status-dot {
      animation: dot-pulse 0.8s ease-in-out infinite;
    }
    @keyframes dot-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(0.4); opacity: 0.25; }
    }

    /* ── Main Stage Area: Side Wings + 3D Holographic Stage Pedestal ── */
    #kiosk-main-stage {
      position: relative; z-index: 10;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 1240px;
      padding: 0 28px;
      min-height: 0;
    }

    /* ── Side Flanking Action Wings (High-Energy Crave Chips) ── */
    .action-wing {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 260px;
      flex-shrink: 0;
      z-index: 15;
    }
    .action-wing-left  { align-items: flex-end; }
    .action-wing-right { align-items: flex-start; }

    .action-wing-card {
      width: 100%;
      background: var(--c-card-glass);
      border: 1.5px solid rgba(255, 120, 40, 0.32);
      border-radius: 20px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 13px;
      cursor: pointer;
      backdrop-filter: blur(18px);
      box-shadow: 0 10px 32px rgba(0,0,0,0.48), inset 0 1px 1px rgba(255,255,255,0.12);
      transition: all 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-align: left;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .action-wing-card:hover {
      background: rgba(20, 48, 42, 0.96);
      border-color: #FFA044;
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 14px 42px rgba(255, 106, 0, 0.45), inset 0 1px 2px rgba(255,255,255,0.25);
    }
    .action-wing-card:active {
      transform: translateY(1px) scale(0.97);
    }

    /* Food Micro-Thumbnail Wrap */
    .chip-thumb-wrap {
      width: 50px; height: 50px;
      border-radius: 50%;
      border: 2px solid rgba(255, 160, 68, 0.55);
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 12px rgba(255, 106, 0, 0.3);
      position: relative;
    }
    .chip-thumb-wrap img {
      width: 100%; height: 100%;
      object-fit: cover;
      filter: saturate(1.15) contrast(1.08);
      transition: transform 0.3s ease;
    }
    .action-wing-card:hover .chip-thumb-wrap img {
      transform: scale(1.12);
    }

    .chip-info-wrap {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }
    .chip-badge-row {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .chip-badge {
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      padding: 1.5px 6px;
      border-radius: 99px;
      background: linear-gradient(90deg, #FF6A00, #FFA844);
      color: #000;
      box-shadow: 0 0 8px rgba(255, 106, 0, 0.5);
    }
    .chip-title {
      font-size: 13.5px;
      font-weight: 800;
      color: #FFF;
      letter-spacing: 0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chip-sub {
      font-size: 10.5px;
      font-weight: 600;
      color: var(--c-muted);
      letter-spacing: 0.2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Central Character Stage with Holographic Stage Pedestal ── */
    #stage-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 0;
      height: 100%;
      position: relative;
    }

    #mo-stage-wrapper {
      position: relative;
      width: min(58vh, 500px);
      height: min(58vh, 500px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #mo-container {
      width: 100%;
      height: 100%;
      position: relative; z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ── 3D Holographic Stage Pedestal (Grounds Mo on the Floor) ── */
    #mo-stage-pedestal {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 78%;
      height: 48px;
      pointer-events: none;
      z-index: 1;
    }
    .stage-disc-outer {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: radial-gradient(ellipse at 50% 50%,
        rgba(255, 120, 30, 0.45) 0%,
        rgba(255, 90, 0, 0.2) 48%,
        rgba(8, 26, 22, 0.8) 75%,
        transparent 100%
      );
      border: 2px solid rgba(255, 150, 50, 0.6);
      box-shadow: 0 0 40px rgba(255, 106, 0, 0.5), inset 0 0 25px rgba(255, 120, 30, 0.35);
      transform: perspective(400px) rotateX(68deg);
    }
    .stage-disc-inner {
      position: absolute;
      top: 15%; left: 15%; right: 15%; bottom: 15%;
      border-radius: 50%;
      background: radial-gradient(ellipse at 50% 50%, rgba(255, 180, 80, 0.4) 0%, rgba(255, 106, 0, 0.12) 60%, transparent 80%);
      border: 1px dashed rgba(255, 210, 110, 0.6);
      transform: perspective(400px) rotateX(68deg);
      animation: stage-spin 25s linear infinite;
    }
    @keyframes stage-spin {
      from { transform: perspective(400px) rotateX(68deg) rotate(0deg); }
      to   { transform: perspective(400px) rotateX(68deg) rotate(360deg); }
    }
    .stage-disc-spotlight {
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 88%;
      height: 90px;
      background: radial-gradient(ellipse at 50% 100%, rgba(255, 120, 40, 0.32) 0%, rgba(255, 80, 0, 0.1) 50%, transparent 75%);
      filter: blur(14px);
      border-radius: 50%;
    }
    .stage-contact-shadow {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: 48%;
      height: 18px;
      background: radial-gradient(ellipse, rgba(0,0,0,0.85) 0%, rgba(5,15,12,0.5) 55%, transparent 75%);
      border-radius: 50%;
      filter: blur(4px);
      z-index: 2;
    }

    /* ── Dynamic Floating Speech Bubble Anchored to Mo ── */
    #mo-speech-bubble {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 25;
      background: rgba(12, 28, 24, 0.94);
      border: 1.5px solid rgba(255, 120, 40, 0.45);
      border-radius: 20px;
      padding: 9px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 440px;
      width: max-content;
      box-shadow: 0 12px 38px rgba(0,0,0,0.65), 0 0 25px rgba(255, 106, 0, 0.25);
      backdrop-filter: blur(20px);
      transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #mo-speech-bubble.speaking {
      border-color: #72CC38;
      box-shadow: 0 12px 42px rgba(0,0,0,0.7), 0 0 30px rgba(114, 204, 56, 0.4);
      transform: translateX(-50%) scale(1.02);
    }

    /* Speech Bubble Downward Tail */
    .speech-bubble-tail {
      position: absolute;
      bottom: -9px;
      left: 50%;
      transform: translateX(-50%);
      width: 0; height: 0;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 9px solid rgba(255, 120, 40, 0.6);
      filter: drop-shadow(0 3px 4px rgba(0,0,0,0.5));
      transition: border-top-color 0.25s ease;
    }
    #mo-speech-bubble.speaking .speech-bubble-tail {
      border-top-color: #72CC38;
    }

    #speech-text {
      font-size: clamp(13.5px, 1.4vw, 15.5px);
      font-weight: 700;
      line-height: 1.35;
      color: #FFF;
      transition: opacity 0.2s ease;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 380px;
    }

    /* Speech Bubble Audio Wave */
    .speech-eq {
      display: flex;
      align-items: center;
      gap: 3px;
      height: 16px;
      flex-shrink: 0;
    }
    .speech-eq .eq-bar {
      width: 3px;
      height: 5px;
      border-radius: 99px;
      background: #FFA044;
      transition: height 0.15s ease;
    }
    #mo-speech-bubble.speaking .speech-eq .eq-bar {
      background: #72CC38;
      animation: eq-pulse 0.6s ease-in-out infinite alternate;
    }
    #mo-speech-bubble.speaking .speech-eq .eq-bar:nth-child(1) { animation-delay: 0.1s; }
    #mo-speech-bubble.speaking .speech-eq .eq-bar:nth-child(2) { animation-delay: 0.25s; }
    #mo-speech-bubble.speaking .speech-eq .eq-bar:nth-child(3) { animation-delay: 0.4s; }
    @keyframes eq-pulse {
      0%   { height: 4px; }
      100% { height: 16px; }
    }

    /* ── Seamless Peripheral Campus Lifestyle & Food Vignettes ── */
    #bg-student-vignettes {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 12;
      overflow: hidden;
    }

    .bg-vignette-card {
      position: absolute;
      width: clamp(210px, 17vw, 255px);
      height: clamp(135px, 12vw, 165px);
      border-radius: 18px;
      padding: 7px;
      background: rgba(12, 28, 24, 0.90);
      border: 1.5px solid rgba(255, 130, 50, 0.4);
      backdrop-filter: blur(16px);
      box-shadow: 0 16px 45px rgba(0,0,0,0.75), 0 0 28px rgba(255, 106, 0, 0.22);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      opacity: 1.0;
      pointer-events: auto;
      cursor: pointer;
    }

    .bg-vignette-card:hover {
      transform: translateY(-4px) scale(1.04) !important;
      border-color: #FFA044;
      box-shadow: 0 20px 55px rgba(0,0,0,0.85), 0 0 38px rgba(255, 106, 0, 0.48);
    }

    .bg-vignette-card.left-card {
      bottom: 80px;
      left: 32px;
    }

    .bg-vignette-card.right-card {
      bottom: 80px;
      right: 32px;
    }

    .vignette-img-wrap {
      position: relative;
      width: 100%;
      height: 77%;
      border-radius: 12px;
      overflow: hidden;
    }

    .vignette-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(1.15) contrast(1.08);
      transition: transform 0.4s ease;
    }

    .bg-vignette-card:hover .vignette-img-wrap img {
      transform: scale(1.06);
    }

    .vignette-glass-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(6, 24, 20, 0.75) 100%);
    }

    .vignette-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px 0;
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #FFA044;
    }

    .vignette-badge .badge-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: #FF6A00;
      box-shadow: 0 0 6px #FF6A00;
      animation: dot-pulse 1s infinite alternate;
    }

    /* ── Bottom Section: Centered Sonic Reactor ("Tap to Talk") ── */
    #bottom-kiosk-bar {
      position: relative; z-index: 25;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0 24px 20px;
      flex-shrink: 0;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    #user-sub-caption {
      font-size: 12px;
      color: var(--c-muted);
      text-align: center;
      padding: 0 20px;
      width: 100%;
      min-height: 16px;
      opacity: 0;
      transition: opacity 0.3s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-style: italic;
    }
    #user-sub-caption.visible { opacity: 1; }

    /* ── Centered Sonic Reactor Orb Container ── */
    #talk-orb-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      position: relative;
      width: 220px;
      height: auto;
    }

    /* Concentric Dynamic Acoustic Pulse Rings (Centered with Precision) */
    .orb-pulse-ring {
      position: absolute;
      top: 44px; left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 1.5px solid rgba(255, 130, 40, 0.45);
      pointer-events: none;
      z-index: 1;
    }
    .orb-pulse-ring.ring-1 {
      width: 110px; height: 110px;
      animation: ring-expand 3s ease-out infinite;
    }
    .orb-pulse-ring.ring-2 {
      width: 132px; height: 132px;
      animation: ring-expand 3s ease-out infinite 1s;
    }
    .orb-pulse-ring.ring-3 {
      width: 154px; height: 154px;
      animation: ring-expand 3s ease-out infinite 2s;
    }
    @keyframes ring-expand {
      0%   { transform: translate(-50%, -50%) scale(0.75); opacity: 0.75; }
      100% { transform: translate(-50%, -50%) scale(1.25); opacity: 0; }
    }

    /* Concentric Rotating Holographic Neon Cyber-Halo (Centered with Precision) */
    .orb-cyber-halo {
      position: absolute;
      top: 44px; left: 50%;
      transform: translate(-50%, -50%);
      width: 104px; height: 104px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, #FF6A00, #FFA855, transparent 55%, #FF8A30, #FF6A00);
      mask: radial-gradient(circle, transparent 44px, black 45px);
      -webkit-mask: radial-gradient(circle, transparent 44px, black 45px);
      pointer-events: none;
      z-index: 1;
      animation: cyber-spin 4s linear infinite;
      opacity: 0.85;
      filter: drop-shadow(0 0 10px rgba(255, 106, 0, 0.65));
    }
    @keyframes cyber-spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to   { transform: translate(-50%, -50%) rotate(360deg); }
    }

    #talk-cta-btn {
      position: relative; z-index: 2;
      width: 88px; height: 88px;
      border-radius: 50%;
      border: 3.5px solid rgba(255, 220, 140, 0.88);
      background: radial-gradient(circle at 35% 25%, #FFC888 0%, #FF8000 40%, #C23800 78%, #521200 100%);
      color: white;
      cursor: pointer;
      outline: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      box-shadow:
        0 14px 44px rgba(255, 106, 0, 0.85),
        0 4px 14px rgba(0,0,0,0.6),
        inset 0 3px 6px rgba(255, 255, 255, 0.95),
        inset 0 -6px 14px rgba(0, 0, 0, 0.7),
        0 0 0 4px rgba(255, 120, 40, 0.24);
      transition: all 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    #talk-cta-btn:hover {
      transform: scale(1.08) translateY(-2px);
      border-color: #FFF;
      box-shadow:
        0 20px 58px rgba(255, 106, 0, 1),
        0 6px 18px rgba(0,0,0,0.7),
        inset 0 4px 8px rgba(255, 255, 255, 1),
        inset 0 -6px 14px rgba(0, 0, 0, 0.7),
        0 0 0 8px rgba(255, 120, 40, 0.38);
    }
    #talk-cta-btn:active {
      transform: scale(0.96) translateY(1px);
    }

    #talk-cta-btn svg {
      width: 32px; height: 32px;
      fill: #FFF;
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.5)) drop-shadow(0 0 8px rgba(255,255,255,0.6));
      transition: transform 0.2s ease;
    }
    #talk-cta-btn:hover svg {
      transform: scale(1.10);
    }

    /* Mini Internal EQ Wave inside Orb */
    .orb-internal-eq {
      display: flex;
      align-items: center;
      gap: 2.5px;
      height: 8px;
      margin-top: -1px;
    }
    .orb-eq-bar {
      width: 2.5px; height: 4px;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.9);
      animation: orb-eq-bounce 0.8s ease-in-out infinite alternate;
    }
    .orb-eq-bar:nth-child(1) { animation-delay: 0.1s; }
    .orb-eq-bar:nth-child(2) { animation-delay: 0.3s; }
    .orb-eq-bar:nth-child(3) { animation-delay: 0.2s; }
    @keyframes orb-eq-bounce {
      0%   { height: 3px; }
      100% { height: 8px; }
    }

    /* Listening state: transitions to glowing red/pulse */
    #talk-cta-btn.listening {
      background: radial-gradient(circle at 35% 25%, #FFAAAA 0%, #E62020 50%, #990000 85%, #4A0000 100%);
      border-color: rgba(255, 255, 255, 0.95);
      box-shadow:
        0 0 58px rgba(230, 25, 25, 1),
        0 0 0 8px rgba(230, 25, 25, 0.4),
        inset 0 3px 6px rgba(255, 255, 255, 0.9);
      animation: orb-speaking-pulse 1.2s ease-in-out infinite;
    }
    @keyframes orb-speaking-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 42px rgba(230, 25, 25, 0.85), 0 0 0 6px rgba(230, 25, 25, 0.35); }
      50%       { transform: scale(1.07); box-shadow: 0 0 75px rgba(230, 25, 25, 1), 0 0 0 10px rgba(230, 25, 25, 0.5); }
    }

    #talk-cta-label-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      user-select: none;
      margin-top: 4px;
    }
    #talk-cta-label {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #FFF;
      font-family: var(--font-display);
      text-shadow: 0 2px 12px rgba(0,0,0,0.7), 0 0 16px rgba(255, 120, 40, 0.6);
    }
    #talk-cta-sub {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #FFA044;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    #talk-cta-sub .sub-live-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #72CC38;
      box-shadow: 0 0 8px #72CC38;
      animation: dot-pulse 1s infinite alternate;
    }

    /* Responsive Adaptation for Tablets / Narrow Screens */
    @media (max-width: 960px) {
      #kiosk-main-stage {
        flex-direction: column;
        padding: 0 16px;
      }
      .action-wing {
        flex-direction: row;
        width: 100%;
        justify-content: center;
      }
      .action-wing-left, .action-wing-right {
        align-items: center;
      }
      .action-wing-card {
        width: auto;
        min-width: 180px;
      }
      #mo-stage-wrapper {
        width: min(42vh, 355px);
        height: min(42vh, 355px);
      }
      .bg-vignette-card {
        display: none;
      }
    }

    /* ── Slide-Out Crave Menu Board Drawer ── */
    #menu-drawer {
      position: fixed;
      top: 0; right: -540px;
      width: min(94vw, 480px); height: 100vh;
      background: rgba(6, 21, 19, 0.98);
      backdrop-filter: blur(24px);
      border-left: 2px solid rgba(255, 120, 40, 0.45);
      z-index: 2000;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: -20px 0 60px rgba(0,0,0,0.9);
      transition: right 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow-y: auto;
    }
    #menu-drawer.open { right: 0; }

    .menu-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding-bottom: 14px;
      flex-shrink: 0;
    }
    .menu-drawer-header h2 {
      font-size: 20px;
      font-family: var(--font-display);
      font-weight: 900;
      letter-spacing: 0.5px;
      color: #FFF;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .drawer-close-btn {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 50%;
      width: 32px; height: 32px;
      color: #FFF;
      font-size: 16px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .drawer-close-btn:hover {
      background: rgba(255, 106, 0, 0.35);
      border-color: #FF6A00;
    }

    .menu-category-block {
      background: rgba(10, 36, 32, 0.85);
      border: 1.5px solid rgba(255, 120, 40, 0.25);
      border-radius: 18px;
      padding: 0;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      transition: border-color 0.2s;
    }
    .menu-category-block:hover {
      border-color: rgba(255, 120, 40, 0.55);
    }

    .menu-cat-hero-img {
      position: relative;
      width: 100%;
      height: 125px;
      overflow: hidden;
    }
    .menu-cat-hero-img img {
      width: 100%; height: 100%;
      object-fit: cover;
      filter: saturate(1.15) contrast(1.05);
      transition: transform 0.35s ease;
    }
    .menu-category-block:hover .menu-cat-hero-img img {
      transform: scale(1.05);
    }
    .menu-cat-hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10, 36, 32, 0.95) 100%);
      display: flex;
      align-items: flex-end;
      padding: 10px 14px;
    }
    .menu-cat-hero-title {
      font-family: var(--font-display);
      font-size: 13.5px;
      font-weight: 800;
      color: #FFF;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .menu-cat-badge {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.8px;
      padding: 2px 7px;
      border-radius: 99px;
      background: linear-gradient(90deg, #FF6A00, #FFA044);
      color: #000;
    }

    .menu-items-list {
      padding: 10px 14px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .menu-item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .menu-item-row:hover {
      background: rgba(255, 106, 0, 0.16);
      border-color: rgba(255, 120, 40, 0.4);
      transform: translateX(3px);
    }
    .item-name-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .item-name {
      color: #FFF;
      font-weight: 700;
    }
    .item-sub {
      font-size: 10px;
      color: var(--c-muted);
    }
    .item-price-tag {
      color: #FFA044;
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 13.5px;
    }

    /* ── Studio Debug Panel (Press 'D') ── */
    #debug-panel {
      position: fixed; top: 16px; right: 16px;
      z-index: 3000;
      background: rgba(6, 20, 18, 0.98);
      backdrop-filter: blur(18px);
      border: 1.5px solid rgba(255, 106, 0, 0.4);
      border-radius: 22px;
      padding: 18px;
      width: 320px;
      max-height: 92vh;
      overflow-y: auto;
      display: none;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 12px 60px rgba(0,0,0,0.85);
    }
    #debug-panel.open { display: flex; }
    #debug-panel h3 {
      font-size: 13px; font-weight: 900; letter-spacing: 1.4px;
      text-transform: uppercase; color: var(--c-primary);
      display: flex; align-items: center; justify-content: space-between;
    }
    .debug-row { display: flex; gap: 5px; flex-wrap: wrap; }
    .dbg-btn {
      flex: 1; min-width: 0;
      padding: 7px 9px;
      border-radius: 9px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      color: var(--c-text);
      font-size: 11px; font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap; text-align: center;
    }
    .dbg-btn:hover { background: rgba(255,255,255,0.15); }
    .dbg-btn.active {
      background: rgba(255, 106, 0, 0.28);
      border-color: var(--c-primary);
      color: var(--c-primary);
    }
    .debug-label {
      font-size: 11px; color: var(--c-muted);
      font-weight: 800; letter-spacing: 0.8px;
      text-transform: uppercase; margin-top: 3px;
    }
    #debug-latency-val {
      font-size: 24px; font-weight: 900; color: var(--c-primary);
      text-align: center; font-family: var(--font-display);
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

function buildHTML(config) {
  const embers = [
    { left: '10%',  bottom: '12%', size: '4.5px', col: '#FF6A00', dur: '7s',   delay: '0s'   },
    { left: '26%',  bottom: '8%',  size: '3px',   col: '#FF8A30', dur: '9s',   delay: '2s'   },
    { left: '42%',  bottom: '6%',  size: '2.5px', col: '#FFD060', dur: '6.5s', delay: '3.5s' },
    { left: '58%',  bottom: '16%', size: '5px',   col: '#FF6A00', dur: '5.5s', delay: '1s'   },
    { left: '74%',  bottom: '10%', size: '3.5px', col: '#FF8A30', dur: '8s',   delay: '2.8s' },
    { left: '88%',  bottom: '14%', size: '4.5px', col: '#FF6A00', dur: '8.5s', delay: '0.5s' },
  ].map(e =>
    `<div class="kiosk-ember" style="left:${e.left};bottom:${e.bottom};width:${e.size};height:${e.size};background:${e.col};animation-duration:${e.dur};animation-delay:${e.delay};box-shadow:0 0 8px ${e.col};"></div>`
  ).join('');

  return /* html */`
    <div id="app">
      <!-- Cyber-Varsity Campus Stage Grid Matrix -->
      <div id="bg-campus-grid"></div>

      <!-- Monumental Architectural Brand Identity: Varsity Stadium Horizon Banner -->
      <div id="bg-brand-backdrop">
        <div class="bg-title-crest">
          <span>★</span>
          <span>SYRACUSE UNIVERSITY FLAGSHIP • EST. 2024</span>
          <span>★</span>
        </div>
        <div class="bg-title-text">${config.restaurantName.toUpperCase()}</div>
        <div class="bg-title-sub">AUTHENTIC STREET FOOD • 100% HAND-SLAUGHTERED ZABIHA</div>
      </div>

      <!-- Seamless Peripheral Campus Lifestyle & Food Vignettes -->
      <div id="bg-student-vignettes">
        <div class="bg-vignette-card left-card" data-prompt="What's the best late-night meal for Syracuse students?">
          <div class="vignette-img-wrap">
            <img src="/assets/backgrounds/college_students_hangout.jpg" alt="Syracuse Students Hangout" />
            <div class="vignette-glass-overlay"></div>
          </div>
          <div class="vignette-badge">
            <span class="badge-dot"></span>
            <span>CAMPUS NIGHTS • SYRACUSE 'CUSE</span>
          </div>
        </div>

        <div class="bg-vignette-card right-card" data-prompt="Tell me about the signature Halalholic rice platter!">
          <div class="vignette-img-wrap">
            <img src="/assets/backgrounds/halal_crave_platter.jpg" alt="Loaded Halal Crave Platter" />
            <div class="vignette-glass-overlay"></div>
          </div>
          <div class="vignette-badge">
            <span class="badge-dot"></span>
            <span>SIZZLING PLATTERS • CRAVE 24/7</span>
          </div>
        </div>
      </div>

      <div id="bg-spotlight"></div>
      ${embers}

      <!-- Unified Luxury Frosted Navigation Header -->
      <header id="header">
        <div id="header-campus-pill">
          <span class="flame-icon">🔥</span>
          <span class="campus-text">SYRACUSE CAMPUS</span>
          <span class="sub-tag">• 100% ZABIHA</span>
        </div>

        <div id="header-center-emblem">
          <span class="emblem-bolt">⚡</span>
          <span class="emblem-text">HALALHOLIC KIOSK #01</span>
          <span class="emblem-tag">• VOICE ACTIVATED</span>
        </div>

        <div id="header-nav">
          <button id="menu-board-btn" class="crave-menu-launcher">
            <span class="menu-btn-icon">🔥</span>
            <span class="menu-btn-text">EXPLORE MENU</span>
            <span class="menu-btn-badge">HOT PICKS</span>
          </button>
          <div id="status-pill" class="state-idle">
            <span id="status-dot"></span>
            <span id="status-text">Ready to Order</span>
          </div>
        </div>
      </header>

      <!-- Main Stage: High-Energy Crave Chips + 3D Holographic Stage Pedestal -->
      <section id="kiosk-main-stage">
        <!-- Left Action Wing (2 Crave Chips) -->
        <aside class="action-wing action-wing-left">
          <button class="action-wing-card" data-prompt="I have an exam tomorrow, what's a heavy fuel platter?">
            <div class="chip-thumb-wrap">
              <img src="/assets/food/halal_platter.jpg" alt="Finals Fuel Platter" />
            </div>
            <div class="chip-info-wrap">
              <div class="chip-badge-row">
                <span class="chip-badge">🔥 EXTRA LOADED</span>
              </div>
              <span class="chip-title">Finals Fuel Platter</span>
              <span class="chip-sub">Heavy Rice & Double Meat</span>
            </div>
          </button>

          <button class="action-wing-card" data-prompt="What's hitting today? Tell me your signature pick.">
            <div class="chip-thumb-wrap">
              <img src="/assets/food/crispy_wings.jpg" alt="Crispy Sauced Wings" />
            </div>
            <div class="chip-info-wrap">
              <div class="chip-badge-row">
                <span class="chip-badge">⭐ MO'S PICK</span>
              </div>
              <span class="chip-title">Crispy Sauced Wings</span>
              <span class="chip-sub">Hot Holic Glaze & Garlic Dip</span>
            </div>
          </button>
        </aside>

        <!-- Central Character Stage with Holographic Pedestal & Dynamic Speech Bubble -->
        <main id="stage-area">
          <div id="mo-stage-wrapper">
            <!-- Dynamic Floating Speech Bubble Anchored Directly to Mo -->
            <div id="mo-speech-bubble">
              <div class="speech-eq">
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
              </div>
              <div id="speech-text">${config.character.idleCaption}</div>
              <div class="speech-bubble-tail"></div>
            </div>

            <!-- Mo Living 3D Rig Mount -->
            <div id="mo-container"></div>

            <!-- 3D Holographic Stage Pedestal (Grounding Platform) -->
            <div id="mo-stage-pedestal">
              <div class="stage-disc-spotlight"></div>
              <div class="stage-disc-outer"></div>
              <div class="stage-disc-inner"></div>
              <div class="stage-contact-shadow"></div>
            </div>
          </div>
        </main>

        <!-- Right Action Wing (2 Crave Chips) -->
        <aside class="action-wing action-wing-right">
          <button class="action-wing-card" data-prompt="I brought the whole squad. What feeds everyone?">
            <div class="chip-thumb-wrap">
              <img src="/assets/food/holic_bucket.jpg" alt="Squad HolicBucket" />
            </div>
            <div class="chip-info-wrap">
              <div class="chip-badge-row">
                <span class="chip-badge">🍗 FEEDS 3-4</span>
              </div>
              <span class="chip-title">Holic Squad Bucket</span>
              <span class="chip-sub">5-in-1 Feast & Waffle Fries</span>
            </div>
          </button>

          <button class="action-wing-card" data-prompt="I'm running late to class, what's ready in 2 minutes?">
            <div class="chip-thumb-wrap">
              <img src="/assets/food/gyro_wrap.jpg" alt="Speed Gyro Rush" />
            </div>
            <div class="chip-info-wrap">
              <div class="chip-badge-row">
                <span class="chip-badge">⚡ 3-MIN RUSH</span>
              </div>
              <span class="chip-title">Speed Gyro Rush</span>
              <span class="chip-sub">Toasted Flatbread On-the-Go</span>
            </div>
          </button>
        </aside>
      </section>

      <!-- Bottom Console: Centered Sonic Reactor Orb ("Tap to Talk") -->
      <div id="bottom-kiosk-bar">
        <div id="user-sub-caption"></div>

        <!-- Perfectly Centered Sonic Reactor -->
        <div id="talk-orb-container">
          <div class="orb-pulse-ring ring-1"></div>
          <div class="orb-pulse-ring ring-2"></div>
          <div class="orb-pulse-ring ring-3"></div>
          <div class="orb-cyber-halo"></div>

          <button id="talk-cta-btn" aria-label="Tap to talk with Mo">
            <svg viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            <div class="orb-internal-eq">
              <div class="orb-eq-bar"></div>
              <div class="orb-eq-bar"></div>
              <div class="orb-eq-bar"></div>
            </div>
          </button>

          <div id="talk-cta-label-group">
            <span id="talk-cta-label">TAP TO TALK WITH MO</span>
            <span id="talk-cta-sub">
              <span class="sub-live-dot"></span>
              SAY "YO MO!" OR TAP TO ORDER
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide-Out Menu Drawer with Gourmet Imagery -->
    <div id="menu-drawer">
      <div class="menu-drawer-header">
        <h2>🔥 Halalholic Crave Board</h2>
        <button class="drawer-close-btn" id="drawer-close-btn">✕</button>
      </div>

      <!-- Category 1: Loaded Rice Platters -->
      <div class="menu-category-block">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/halal_platter.jpg" alt="Signature Halal Platters" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🍛 Loaded Platters Over Rice</span>
            <span class="menu-cat-badge">#1 CAMPUS PICK</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="Can I get the Chicken Dose Platter?">
            <div class="item-name-group">
              <span class="item-name">Chicken Dose Platter</span>
              <span class="item-sub">Seasoned basmati rice, spiced chicken, signature white sauce</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Lamb Dose Platter?">
            <div class="item-name-group">
              <span class="item-name">Lamb Dose Platter</span>
              <span class="item-sub">Tender marinated gyro lamb over golden seasoned rice</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Mix Combo Dose Platter?">
            <div class="item-name-group">
              <span class="item-name">Mix Combo Dose</span>
              <span class="item-sub">Double protein: Spiced Chicken + Gyro Lamb combo</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Falafel Dose Platter?">
            <div class="item-name-group">
              <span class="item-name">Falafel Dose (Vegetarian)</span>
              <span class="item-sub">Crispy golden handmade falafels & pickled cabbage</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can you make my platter Extra Holic?">
            <div class="item-name-group">
              <span class="item-name">Make It Extra Holic</span>
              <span class="item-sub">Double meat load, extra white sauce & spicy red drizzle</span>
            </div>
            <span class="item-price-tag">+$3.00</span>
          </div>
        </div>
      </div>

      <!-- Category 2: Speed Gyro Wraps -->
      <div class="menu-category-block">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/gyro_wrap.jpg" alt="Speed Gyro Wraps" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🌯 Speed Gyro Wraps</span>
            <span class="menu-cat-badge">3-MIN RUSH</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="I need a quick Chicken Gyro.">
            <div class="item-name-group">
              <span class="item-name">Chicken Gyro Wrap</span>
              <span class="item-sub">Warm toasted flatbread with lettuce, tomato & garlic white sauce</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
          <div class="menu-item-row" data-prompt="I need a quick Lamb Gyro.">
            <div class="item-name-group">
              <span class="item-name">Lamb Gyro Wrap</span>
              <span class="item-sub">Classic shaved gyro with pickled red cabbage & white sauce</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Mix Gyro?">
            <div class="item-name-group">
              <span class="item-name">Mix Gyro Wrap</span>
              <span class="item-sub">Chicken + lamb double protein wrap</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
        </div>
      </div>

      <!-- Category 3: Squad HolicBucket -->
      <div class="menu-category-block">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/holic_bucket.jpg" alt="Squad HolicBucket 5-in-1" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">⭐ Squad HolicBucket 5-in-1</span>
            <span class="menu-cat-badge">FEEDS 3-4</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="We want the HolicBucket for the squad!">
            <div class="item-name-group">
              <span class="item-name">HolicBucket 5-in-1 Feast</span>
              <span class="item-sub">Tenders, Buffalo Wings, Waffle Fries, Mozz Sticks & Mac Bites</span>
            </div>
            <span class="item-price-tag">$15.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I order 6 piece Wings?">
            <div class="item-name-group">
              <span class="item-name">6pc Crispy Wings (Sauced)</span>
              <span class="item-sub">Choice of Mild, Hot Holic, or Garlic Parm</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Studio Debug Panel (Press 'D') -->
    <div id="debug-panel">
      <h3>⚡ Mo Living 3D Studio <span style="font-size:11px;color:#888;">ESC to close</span></h3>

      <div class="debug-label">Kiosk State</div>
      <div class="debug-row">
        <button class="dbg-btn active" data-state="idle">Idle</button>
        <button class="dbg-btn" data-state="listening">Listen</button>
        <button class="dbg-btn" data-state="thinking">Think</button>
        <button class="dbg-btn" data-state="talking">Talk</button>
      </div>

      <div class="debug-label">Organic Reactions</div>
      <div class="debug-row">
        <button class="dbg-btn" id="dbg-blink-btn">👁️ Blink Eyes</button>
        <button class="dbg-btn" id="dbg-laugh-btn">😂 Laugh Bounce</button>
      </div>

      <div class="debug-label">Audio Latency</div>
      <div id="debug-latency-val">-- ms</div>
    </div>
  `;
}

export class App {
  constructor(rootEl, deps) {
    this._root = rootEl;
    this._Mo   = deps.Mo;
    this._onTalkPress = null;
    this._onChipClick = null;
    this._captionTimer = null;

    injectStyles(CONFIG.colors);
    rootEl.innerHTML = buildHTML(CONFIG);

    this._captionEl     = document.getElementById('speech-text');
    this._speechBubble  = document.getElementById('mo-speech-bubble');
    this._userCaptionEl = document.getElementById('user-sub-caption');
    this._statusPillEl  = document.getElementById('status-pill');
    this._statusTextEl  = document.getElementById('status-text');
    this._talkBtn       = document.getElementById('talk-cta-btn');
    this._talkLabelEl   = document.getElementById('talk-cta-label');
    this._talkSubEl     = document.getElementById('talk-cta-sub');
    this._debugPanel    = document.getElementById('debug-panel');
    this._menuDrawer    = document.getElementById('menu-drawer');

    this._bindEvents();
  }

  get moContainer() { return document.getElementById('mo-container'); }

  onTalkPress(fn) { this._onTalkPress = fn; }
  onChipClick(fn) { this._onChipClick = fn; }

  setState(state) {
    const labels = { idle: 'Ready to Order', listening: 'Listening…', thinking: 'Thinking…', talking: 'Mo Speaking' };
    if (this._statusTextEl) this._statusTextEl.textContent = labels[state] || state;
    this._statusPillEl.className = `state-${state}`;

    const isActive = state !== 'idle';
    if (this._talkBtn) {
      this._talkBtn.classList.toggle('listening', state === 'listening');
      if (isActive) {
        this._talkLabelEl.textContent = state === 'listening' ? 'LISTENING TO YOU…' : 'MO IS SPEAKING';
        this._talkSubEl.innerHTML     = '<span class="sub-live-dot" style="background:#FF3B30;box-shadow:0 0 8px #FF3B30;"></span> TOUCH TO STOP';
      } else {
        this._talkLabelEl.textContent = 'TAP TO TALK WITH MO';
        this._talkSubEl.innerHTML     = '<span class="sub-live-dot"></span> SAY "YO MO!" OR TAP TO ORDER';
      }
    }

    this._speechBubble?.classList.toggle('speaking', state === 'talking');

    document.querySelectorAll('[data-state]').forEach(b =>
      b.classList.toggle('active', b.dataset.state === state));
  }

  setCaption(text) {
    const el = this._captionEl;
    if (!el) return;
    el.style.opacity = '0';
    clearTimeout(this._captionTimer);
    this._captionTimer = setTimeout(() => {
      el.textContent = text;
      el.style.opacity = '1';
    }, 120);
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
    this._talkBtn.addEventListener('click', () => this._onTalkPress?.());

    // Symmetrical Crave Chips (Left & Right Wings)
    document.querySelectorAll('.action-wing-card').forEach(card => {
      card.addEventListener('click', () => {
        card.style.transform = 'translateY(1px) scale(0.97)';
        setTimeout(() => { card.style.transform = ''; }, 200);
        this._onChipClick?.(card.dataset.prompt);
      });
    });

    // Peripheral Lifestyle Vignettes (Interactive Voice Triggers)
    document.querySelectorAll('.bg-vignette-card[data-prompt]').forEach(card => {
      card.addEventListener('click', () => {
        card.style.transform = 'scale(0.97)';
        setTimeout(() => { card.style.transform = ''; }, 200);
        this._onChipClick?.(card.dataset.prompt);
      });
    });

    // Menu Drawer Toggle & Interactive Item Selection
    const peekBtn  = document.getElementById('menu-board-btn');
    const closeBtn = document.getElementById('drawer-close-btn');
    peekBtn?.addEventListener('click', () => this._menuDrawer.classList.toggle('open'));
    closeBtn?.addEventListener('click', () => this._menuDrawer.classList.remove('open'));

    document.querySelectorAll('.menu-item-row[data-prompt]').forEach(row => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        this._menuDrawer.classList.remove('open');
        this._onChipClick?.(row.dataset.prompt);
      });
    });

    // Studio Debug Panel Toggle (Press 'D' or 'ESC')
    document.addEventListener('keydown', e => {
      if (e.key === 'd' || e.key === 'D') {
        this._debugPanel.classList.toggle('open');
      } else if (e.key === 'Escape') {
        this._debugPanel.classList.remove('open');
        this._menuDrawer.classList.remove('open');
      }
    });

    // Debug Triggers
    document.getElementById('dbg-blink-btn')?.addEventListener('click', () => {
      this._Mo.triggerBlink();
    });
    document.getElementById('dbg-laugh-btn')?.addEventListener('click', () => {
      this._Mo.triggerLaugh();
    });

    // Debug State triggers
    document.querySelectorAll('[data-state]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setState(btn.dataset.state);
        this._Mo.setState(btn.dataset.state);
      });
    });
  }
}
