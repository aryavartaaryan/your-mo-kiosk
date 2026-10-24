// src/ui/App.js
// ─────────────────────────────────────────────────────────────────────────────
// Halalholic Kiosk UI Shell v11.0 — "Meet Mo" Dedicated Kiosk Edition
// Engineered exclusively for physical touchscreen kiosks (Portrait & Landscape):
//   • "Meet Mo" hero identity adapted from premier AI kiosk avatars (Humion)
//   • Dedicated "TRY ASKING MO" quick-touch Crave Chips with gourmet food thumbnails
//   • Full adaptive dual-kiosk engine: Portrait (Vertical Tower) & Landscape (Countertop)
//   • Grounded 3D Holographic Stage Pedestal & realistic floor occlusion shadow
//   • Dynamic comic speech bubble anchored directly above Mo with acoustic EQ wave
//   • Centered circular Sonic Reactor ("Tap to Talk") with concentric acoustic waves
//   • Touch-first ergonomics: oversized targets, zero zoom/selection, instant haptic response
// ─────────────────────────────────────────────────────────────────────────────

import { CONFIG } from '../config.js';

function injectStyles(colors) {
  const css = /* css */`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Space+Grotesk:wght@700;800;900&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0; padding: 0;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    :root {
      --c-primary:        ${colors.primary};
      --c-secondary:      ${colors.secondary};
      --c-accent:         ${colors.accent};
      --c-bg:             #060B09;
      --c-surface:        #0D1E1A;
      --c-surface-glass:  rgba(13, 30, 26, 0.90);
      --c-card-glass:     rgba(14, 32, 28, 0.88);
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
      -webkit-user-select: none;
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
      background: radial-gradient(ellipse at 50% 32%, #142822 0%, #08110E 55%, #050908 100%);
    }

    /* ── Full-Screen Cinematic Campus Atmosphere Canvas (Multi-Slide Engine) ── */
    #kiosk-cinematic-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
      pointer-events: none;
    }

    .kiosk-bg-slide {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      will-change: opacity;
    }
    .kiosk-bg-slide.active {
      opacity: 1;
    }

    .kiosk-bg-photo {
      position: absolute;
      inset: -4%;
      width: 108%;
      height: 108%;
      object-fit: cover;
      object-position: center 28%;
      filter: saturate(1.22) contrast(1.12) brightness(0.70);
      animation: bg-cinematic-drift 28s ease-in-out infinite alternate;
      will-change: transform;
    }
    @keyframes bg-cinematic-drift {
      0%   { transform: scale(1) translate(0, 0); }
      50%  { transform: scale(1.06) translate(-1%, -1.2%); }
      100% { transform: scale(1.03) translate(1%, 0.8%); }
    }

    .kiosk-bg-glass-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 40%,
        rgba(255, 120, 20, 0.16) 0%,
        rgba(8, 26, 22, 0.62) 50%,
        rgba(4, 12, 10, 0.90) 82%,
        #030706 100%
      );
      backdrop-filter: blur(1.5px);
    }
    .kiosk-bg-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg,
        rgba(3, 10, 8, 0.94) 0%,
        rgba(3, 10, 8, 0.50) 18%,
        rgba(4, 14, 12, 0.22) 42%,
        rgba(3, 10, 8, 0.68) 72%,
        rgba(2, 6, 5, 0.96) 90%,
        #020504 100%
      );
    }

    /* ── Ambient Luxury Slide Indicator (Shows Active Featured Dish) ── */
    #kiosk-slide-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 5px;
      z-index: 25;
      pointer-events: auto;
    }
    .slide-indicator-track {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 99px;
      background: rgba(8, 24, 20, 0.78);
      border: 1px solid rgba(255, 140, 50, 0.35);
      backdrop-filter: blur(12px);
    }
    .indicator-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.35);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
    }
    .indicator-dot:hover {
      background: rgba(255, 160, 68, 0.85);
      transform: scale(1.25);
    }
    .indicator-dot.active {
      width: 18px;
      border-radius: 99px;
      background: linear-gradient(90deg, #FF6A00, #FFA855);
      box-shadow: 0 0 10px rgba(255, 106, 0, 0.9);
    }
    #slide-feature-tag {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.4px;
      color: rgba(255, 190, 100, 0.95);
      font-family: var(--font-display);
      text-transform: uppercase;
      text-shadow: 0 1px 8px rgba(0,0,0,0.8);
      transition: opacity 0.25s ease;
    }

    /* ── Cyber-Varsity Campus Stage Grid Matrix ── */
    #bg-campus-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 110, 20, 0.038) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 110, 20, 0.038) 1px, transparent 1px);
      background-size: 54px 54px;
      mask-image: radial-gradient(ellipse at 50% 46%, black 35%, transparent 80%);
      -webkit-mask-image: radial-gradient(ellipse at 50% 46%, black 35%, transparent 80%);
      pointer-events: none;
      z-index: 0;
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
        rgba(255, 120, 20, 0.22) 0%,
        rgba(255, 80, 0, 0.08) 38%,
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

    /* ── Header: Unified Kiosk Navigation Bar ── */
    #header {
      position: relative; z-index: 30;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 32px 0;
      flex-shrink: 0;
    }

    #header-campus-pill {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 8px 18px;
      border-radius: 99px;
      background: rgba(14, 32, 28, 0.90);
      border: 1.5px solid rgba(255, 120, 40, 0.38);
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      flex-shrink: 0;
    }
    #header-campus-pill .flame-icon {
      font-size: 15px;
      filter: drop-shadow(0 0 8px #FF6A00);
    }
    #header-campus-pill .campus-text {
      font-size: 11.5px;
      font-weight: 900;
      letter-spacing: 1.4px;
      color: #FFF;
      text-transform: uppercase;
      font-family: var(--font-display);
    }
    #header-campus-pill .sub-tag {
      color: #FFA044;
      font-weight: 800;
      font-size: 10px;
    }

    #header-center-emblem {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 18px;
      border-radius: 99px;
      background: rgba(14, 32, 28, 0.80);
      border: 1px solid rgba(255, 140, 50, 0.32);
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 18px rgba(0,0,0,0.3);
      pointer-events: none;
    }
    #header-center-emblem .emblem-bolt {
      color: #FFA044;
      font-size: 12px;
      filter: drop-shadow(0 0 6px rgba(255, 160, 68, 0.9));
    }
    #header-center-emblem .emblem-text {
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
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

    #menu-board-btn {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 8px 18px;
      border-radius: 99px;
      background: linear-gradient(135deg, rgba(255, 106, 0, 0.34) 0%, rgba(14, 36, 32, 0.94) 100%);
      border: 1.5px solid rgba(255, 120, 40, 0.52);
      color: #FFF;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      cursor: pointer;
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 22px rgba(255, 106, 0, 0.34), inset 0 1px 1px rgba(255,255,255,0.25);
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #menu-board-btn:hover {
      background: linear-gradient(135deg, rgba(255, 106, 0, 0.5) 0%, rgba(18, 54, 48, 0.96) 100%);
      border-color: #FFA044;
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 8px 32px rgba(255, 106, 0, 0.62), inset 0 1px 2px rgba(255,255,255,0.4);
    }
    #menu-board-btn:active {
      transform: translateY(1px) scale(0.97);
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
      border: 1.5px solid rgba(255,255,255,0.15);
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
    #status-pill.state-idle      { color: #72CC38; border-color: rgba(114, 204, 56, 0.38); }
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

    /* ── "Meet Mo" Hero Identity Banner (Adapted from "Meet Alex") ── */
    #kiosk-hero-banner {
      position: relative;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 6px 20px 0;
      pointer-events: none;
    }
    .hero-live-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 4px 14px;
      border-radius: 99px;
      background: rgba(14, 34, 28, 0.92);
      border: 1px solid rgba(255, 120, 40, 0.4);
      margin-bottom: 6px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
    }
    .hero-live-badge .badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #72CC38;
      box-shadow: 0 0 8px #72CC38;
      animation: dot-pulse 1s infinite alternate;
    }
    .hero-live-badge span {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 1.8px;
      color: #FFA044;
      text-transform: uppercase;
      font-family: var(--font-display);
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(34px, 4.4vw, 54px);
      font-weight: 900;
      letter-spacing: -0.01em;
      line-height: 1.05;
      color: #FFF;
      text-shadow: 0 2px 20px rgba(0,0,0,0.8), 0 0 35px rgba(255, 106, 0, 0.35);
      margin-bottom: 4px;
    }
    .hero-title .title-accent {
      color: #FF7B1A;
      background: linear-gradient(135deg, #FF9944 0%, #FF6A00 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: clamp(12px, 1.25vw, 14.5px);
      font-weight: 600;
      color: rgba(247, 243, 233, 0.85);
      max-width: 620px;
      line-height: 1.45;
      text-shadow: 0 2px 10px rgba(0,0,0,0.7);
    }

    /* ── Syracuse Live Social Proof Ticker ── */
    #kiosk-live-ticker {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 6px;
      margin-bottom: 2px;
      z-index: 20;
      pointer-events: none;
    }
    .ticker-pill {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 5px 18px;
      border-radius: 99px;
      background: rgba(10, 26, 22, 0.88);
      border: 1.5px solid rgba(255, 140, 50, 0.45);
      backdrop-filter: blur(14px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.55), 0 0 16px rgba(255, 106, 0, 0.22);
    }
    .ticker-fire {
      font-size: 13px;
      filter: drop-shadow(0 0 6px #FF6A00);
      animation: flame-flicker 1.8s infinite alternate;
    }
    .ticker-text {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #FFF;
      font-family: var(--font-display);
    }
    .ticker-text strong {
      color: #FFA044;
      font-weight: 900;
    }
    .ticker-sep {
      color: rgba(255, 160, 68, 0.45);
      font-size: 9px;
    }
    .ticker-tag {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #72CC38;
      text-transform: uppercase;
    }
    .ticker-perk {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #FFB055;
      text-transform: uppercase;
      background: rgba(255, 160, 68, 0.18);
      border: 1px solid rgba(255, 160, 68, 0.5);
      padding: 1.5px 7px;
      border-radius: 99px;
    }

    /* ── Main Stage Area: Side Wings + 3D Holographic Stage Pedestal ── */
    #kiosk-main-stage {
      position: relative; z-index: 10;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 1260px;
      padding: 0 24px;
      min-height: 0;
    }

    /* ── Side Flanking Action Wings ("TRY ASKING MO" Section) ── */
    .action-wing {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 260px;
      flex-shrink: 0;
      z-index: 15;
    }
    .action-wing-left  { align-items: flex-end; }
    .action-wing-right { align-items: flex-start; }

    .kiosk-wing-label {
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #FFA044;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 4px;
      opacity: 0.9;
    }
    .kiosk-wing-label .label-bolt {
      color: #FF6A00;
      filter: drop-shadow(0 0 6px #FF6A00);
    }

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
      transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-align: left;
      user-select: none;
    }
    .action-wing-card:hover {
      background: rgba(20, 48, 42, 0.96);
      border-color: #FFA044;
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 14px 42px rgba(255, 106, 0, 0.45), inset 0 1px 2px rgba(255,255,255,0.25);
    }
    .action-wing-card:active {
      transform: translateY(1px) scale(0.96);
    }

    /* Food Micro-Thumbnail Wrap */
    .chip-thumb-wrap {
      width: 48px; height: 48px;
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
    .chip-price-tag {
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 900;
      color: #FFA044;
      background: rgba(255, 160, 68, 0.16);
      border: 1px solid rgba(255, 160, 68, 0.45);
      padding: 1.5px 7px;
      border-radius: 99px;
      letter-spacing: 0.5px;
      text-shadow: 0 0 8px rgba(255, 160, 68, 0.4);
      margin-left: auto;
      flex-shrink: 0;
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
      width: min(56vh, 480px);
      height: min(56vh, 480px);
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

    /* ── 3D Holographic Stage Pedestal ── */
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
      border: 2px solid rgba(255, 150, 50, 0.65);
      box-shadow: 0 0 35px rgba(255, 106, 0, 0.55), inset 0 0 20px rgba(255, 120, 30, 0.4);
      transform: scaleY(0.32);
    }
    .stage-disc-inner {
      position: absolute;
      top: 18%; left: 18%; right: 18%; bottom: 18%;
      border-radius: 50%;
      background: radial-gradient(ellipse at 50% 50%, rgba(255, 200, 100, 0.45) 0%, rgba(255, 110, 0, 0.15) 55%, transparent 75%);
      border: 1.5px solid rgba(255, 210, 120, 0.8);
      box-shadow: 0 0 25px rgba(255, 140, 40, 0.65), inset 0 0 15px rgba(255, 160, 60, 0.4);
      transform: scaleY(0.32);
      animation: stage-pulse 3.5s ease-in-out infinite alternate;
    }
    @keyframes stage-pulse {
      0%   { opacity: 0.8; box-shadow: 0 0 20px rgba(255, 140, 40, 0.5), inset 0 0 12px rgba(255, 160, 60, 0.3); }
      100% { opacity: 1;   box-shadow: 0 0 35px rgba(255, 140, 40, 0.8), inset 0 0 22px rgba(255, 200, 80, 0.6); }
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
    #mo-stage-pedestal.talking .stage-disc-outer {
      border-color: #FFA044;
      box-shadow: 0 0 52px rgba(255, 120, 30, 0.85), inset 0 0 28px rgba(255, 140, 40, 0.55);
    }
    #mo-stage-pedestal.talking .stage-disc-inner {
      border-color: #FFD080;
      box-shadow: 0 0 38px rgba(255, 180, 68, 0.95), inset 0 0 22px rgba(255, 220, 120, 0.7);
      animation: stage-voice-pulse 0.7s ease-in-out infinite alternate;
    }
    @keyframes stage-voice-pulse {
      0%   { transform: scaleY(0.32) scale(0.97); opacity: 0.85; }
      100% { transform: scaleY(0.32) scale(1.05); opacity: 1; }
    }

    /* ── Dynamic Floating Speech Bubble Anchored to Mo ── */
    #mo-speech-bubble {
      position: absolute;
      top: -10px;
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
      font-size: clamp(13px, 1.35vw, 15.5px);
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

    /* ── Bottom Section: Centered Sonic Reactor ("Tap to Talk") ── */
    #bottom-kiosk-bar {
      position: relative; z-index: 25;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 24px 18px;
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
      gap: 12px;
      position: relative;
      width: 100%;
      height: auto;
    }

    /* Dedicated Touch Plate containing Button & Concentric Rings */
    .orb-plate {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      height: 88px;
    }

    /* Concentric Dynamic Acoustic Pulse Rings (Anchored to .orb-plate Center) */
    .orb-pulse-ring {
      position: absolute;
      top: 50%; left: 50%;
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

    /* Concentric Rotating Holographic Neon Cyber-Halo */
    .orb-cyber-halo {
      position: absolute;
      top: 50%; left: 50%;
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
      transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
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

    /* ─────────────────────────────────────────────────────────────────────────────
       DEDICATED FULL-CANVAS PORTRAIT KIOSK ARCHITECTURE
       Engineered to dynamically fill 1080×1920 (and any portrait touchscreen display)
       with life-sized 3D mascot presence, zero bottom void, and touch ergonomics
       ───────────────────────────────────────────────────────────────────────────── */
    @media (orientation: portrait), (max-aspect-ratio: 1.05/1) {
      #app {
        height: 100vh;
        width: 100vw;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        padding-bottom: 24px;
      }

      /* Unified Header scaled for standing eye-level readability */
      #header {
        padding: clamp(16px, 2.2vh, 32px) clamp(20px, 3.8vw, 44px) 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #header-campus-pill {
        padding: 10px 22px;
        gap: 10px;
      }
      #header-campus-pill .flame-icon {
        font-size: 18px;
      }
      #header-campus-pill .campus-text {
        font-size: clamp(12.5px, 1.4vw, 15px);
        letter-spacing: 1.6px;
      }
      #header-campus-pill .sub-tag {
        font-size: clamp(10.5px, 1.2vw, 12.5px);
      }

      /* Streamline portrait header by hiding center emblem for clean dual-anchor luxury layout */
      #header-center-emblem {
        display: none !important;
      }

      #menu-board-btn {
        padding: 10px 24px;
        font-size: clamp(12px, 1.3vw, 14px);
      }
      #status-pill {
        padding: 10px 22px;
        font-size: clamp(12px, 1.3vw, 13.5px);
      }

      /* Hero Greeting Banner ("Meet Mo") */
      #kiosk-hero-banner {
        padding: clamp(8px, 1.4vh, 20px) 24px 0;
        margin-top: 2px;
      }
      .hero-live-badge {
        padding: 5px 16px;
        margin-bottom: 8px;
      }
      .hero-live-badge span {
        font-size: clamp(10px, 1.1vw, 12px);
        letter-spacing: 2px;
      }
      .hero-title {
        font-size: clamp(44px, 5.2vw, 68px);
        letter-spacing: -0.01em;
        margin-bottom: 6px;
      }
      .hero-subtitle {
        font-size: clamp(14.5px, 1.7vw, 19px);
        max-width: 820px;
        line-height: 1.48;
      }

      /* Main Stage Area: Full Vertical Scale */
      #kiosk-main-stage {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        width: 100%;
        max-width: 980px;
        padding: 0 clamp(16px, 3vw, 36px);
        min-height: 0;
        gap: 12px;
      }

      /* Life-Sized 3D Avatar Stage */
      #stage-area {
        order: 1;
        width: 100%;
        height: auto;
        flex: 1;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      #mo-stage-wrapper {
        width: min(88vw, 760px);
        height: min(44vh, 760px);
        position: relative;
      }

      /* Dynamic Floating Speech Bubble */
      #mo-speech-bubble {
        top: -14px;
        padding: 11px 26px;
        max-width: min(92vw, 620px);
        border-radius: 24px;
        box-shadow: 0 16px 45px rgba(0,0,0,0.7), 0 0 30px rgba(255, 106, 0, 0.35);
      }
      #speech-text {
        font-size: clamp(15px, 1.7vw, 19px);
        max-width: 500px;
      }
      .speech-eq .eq-bar {
        width: 3.5px;
        height: 6px;
      }
      .speech-bubble-tail {
        bottom: -11px;
        border-left-width: 11px;
        border-right-width: 11px;
        border-top-width: 11px;
      }

      #mo-stage-pedestal {
        bottom: 8px;
        width: 82%;
        height: 56px;
      }
      .stage-contact-shadow {
        bottom: 14px;
        width: 52%;
        height: 22px;
      }

      /* "TRY ASKING MO" Crave Action Grid (2x2 Full Touch Cards) */
      .action-wing {
        width: 100%;
        max-width: 960px;
        flex-direction: row;
        gap: clamp(10px, 1.6vw, 16px);
      }
      .action-wing-left  { order: 2; }
      .action-wing-right { order: 3; }
      .action-wing-left, .action-wing-right { align-items: stretch; }

      .kiosk-wing-label {
        display: none;
      }

      .action-wing-card {
        flex: 1;
        min-width: 0;
        min-height: clamp(84px, 9.5vh, 114px);
        padding: clamp(10px, 1.4vh, 16px) clamp(12px, 1.8vw, 20px);
        gap: clamp(10px, 1.5vw, 16px);
        border-radius: clamp(16px, 2vw, 22px);
        border-width: 2px;
      }
      .chip-thumb-wrap {
        width: clamp(52px, 6.5vw, 76px);
        height: clamp(52px, 6.5vw, 76px);
        border-width: 2.5px;
      }
      .chip-badge {
        font-size: clamp(8.5px, 1vw, 11px);
        padding: 2.5px 8px;
      }
      .chip-price-tag {
        font-size: clamp(10.5px, 1.25vw, 13.5px);
        padding: 2px 8.5px;
      }
      .chip-title {
        font-size: clamp(14px, 1.7vw, 18.5px);
      }
      .chip-sub {
        font-size: clamp(11px, 1.3vw, 14px);
      }

      /* Bottom Voice Console: Ergonomic Waist/Chest Touch Height */
      #bottom-kiosk-bar {
        order: 4;
        padding: 0 24px clamp(12px, 2vh, 32px);
        width: 100%;
        max-width: 720px;
        gap: 8px;
      }
      #talk-orb-container {
        width: 100%;
        max-width: 380px;
        gap: 0;
      }
      .orb-plate {
        width: clamp(96px, 10.5vh, 118px);
        height: clamp(96px, 10.5vh, 118px);
      }
      #talk-cta-btn {
        width: 100%;
        height: 100%;
        border-width: 4px;
        box-shadow:
          0 16px 48px rgba(255, 106, 0, 0.9),
          0 4px 14px rgba(0,0,0,0.6),
          inset 0 4px 8px rgba(255, 255, 255, 1),
          inset 0 -8px 16px rgba(0, 0, 0, 0.7);
      }
      #talk-cta-btn svg {
        width: clamp(36px, 4.2vh, 44px);
        height: clamp(36px, 4.2vh, 44px);
      }
      .orb-pulse-ring {
        top: 50%; left: 50%;
      }
      .orb-pulse-ring.ring-1 {
        width: clamp(122px, 13.5vh, 150px);
        height: clamp(122px, 13.5vh, 150px);
      }
      .orb-pulse-ring.ring-2 {
        width: clamp(148px, 16.5vh, 184px);
        height: clamp(148px, 16.5vh, 184px);
      }
      .orb-pulse-ring.ring-3 {
        width: clamp(174px, 19.5vh, 218px);
        height: clamp(174px, 19.5vh, 218px);
      }
      .orb-cyber-halo {
        top: 50%; left: 50%;
        width: clamp(116px, 12.8vh, 142px);
        height: clamp(116px, 12.8vh, 142px);
      }

      #talk-cta-label-group {
        margin-top: clamp(16px, 2.2vh, 26px);
        gap: 5px;
      }
      #talk-cta-label {
        font-size: clamp(15px, 1.8vw, 19px);
        letter-spacing: 2.5px;
      }
      #talk-cta-sub {
        font-size: clamp(11px, 1.2vw, 13px);
        letter-spacing: 1.2px;
      }
      #user-sub-caption {
        font-size: clamp(13px, 1.4vw, 15px);
        min-height: 20px;
      }

      #kiosk-slide-indicator {
        margin-top: clamp(4px, 0.8vh, 8px);
      }
      .slide-indicator-track {
        padding: 4.5px 12px;
        gap: 7px;
      }
      .indicator-dot {
        width: 7px; height: 7px;
      }
      .indicator-dot.active {
        width: 20px;
      }
      #slide-feature-tag {
        font-size: clamp(10px, 1.15vw, 12px);
      }
    }

    /* ─────────────────────────────────────────────────────────────────────────────
       DEDICATED LUXURY DESKTOP & WIDESCREEN ARCHITECTURE
       Engineered to make Desktop / Laptop views look clean, spacious, and ultra-premium
       without removing a single element. Expands Mo's size and separates action wings.
       ───────────────────────────────────────────────────────────────────────────── */
    @media (min-aspect-ratio: 1.05/1) and (min-width: 900px) {
      #app {
        justify-content: space-between;
        padding-bottom: 6px;
      }

      /* Reduce visual background clash in center column */
      .kiosk-bg-glass-overlay {
        background: radial-gradient(ellipse at 50% 50%,
          rgba(255, 120, 20, 0.08) 0%,
          rgba(6, 20, 16, 0.72) 42%,
          rgba(3, 10, 8, 0.94) 75%,
          #020605 100%
        );
      }
      #bg-spotlight {
        width: min(78vh, 700px);
        height: min(78vh, 700px);
        background: radial-gradient(circle,
          rgba(255, 120, 20, 0.25) 0%,
          rgba(255, 80, 0, 0.08) 38%,
          rgba(8, 26, 22, 0.03) 65%,
          transparent 75%
        );
      }

      /* Desktop Header: Generous horizontal luxury breathing room */
      #header {
        padding: 12px clamp(32px, 4vw, 64px) 0;
      }

      /* Desktop Hero Greeting: Crisp, proportional, non-crowded */
      #kiosk-hero-banner {
        padding: 2px 24px 0;
        margin-bottom: 0;
      }
      .hero-live-badge {
        padding: 3px 12px;
        margin-bottom: 3px;
      }
      .hero-title {
        font-size: clamp(28px, 3.2vw, 42px);
        margin-bottom: 2px;
      }
      .hero-subtitle {
        font-size: 13px;
        max-width: 660px;
        line-height: 1.42;
        color: rgba(247, 243, 233, 0.88);
      }

      /* Desktop Ticker: Sleek capsule */
      #kiosk-live-ticker {
        margin-top: 4px;
        margin-bottom: 2px;
      }
      .ticker-pill {
        padding: 4px 18px;
        background: rgba(8, 22, 18, 0.92);
        border: 1.5px solid rgba(255, 140, 50, 0.42);
      }

      /* Desktop Slide Indicator: Clear separation from speech bubble */
      #kiosk-slide-indicator {
        margin: 5px 0 2px;
      }
      .slide-indicator-track {
        padding: 3.5px 12px;
        background: rgba(6, 20, 16, 0.90);
        border: 1px solid rgba(255, 140, 50, 0.4);
      }

      /* Desktop Main Stage: Push Crave Cards to outer flanks for massive center breathing room */
      #kiosk-main-stage {
        max-width: 1460px;
        padding: 0 clamp(24px, 4.5vw, 72px);
        gap: clamp(24px, 4vw, 64px);
        justify-content: space-between;
        align-items: center;
        flex: 1;
        min-height: 0;
      }

      .action-wing {
        width: clamp(250px, 18.5vw, 290px);
        gap: 12px;
      }
      .action-wing-card {
        padding: 12px 15px;
        background: rgba(8, 24, 20, 0.88);
        border: 1.5px solid rgba(255, 120, 40, 0.32);
        box-shadow: 0 10px 30px rgba(0,0,0,0.58);
      }
      .action-wing-card:hover {
        background: rgba(14, 38, 32, 0.96);
        border-color: #FFA044;
      }

      /* SIZABLY INCREASE MO SIZE ON DESKTOP (~18-20% larger presence) */
      #mo-stage-wrapper {
        width: min(65vh, 540px);
        height: min(65vh, 540px);
      }

      /* Desktop Speech Bubble: Anchored cleanly above Mo without colliding into top elements */
      #mo-speech-bubble {
        top: 2px;
        padding: 8px 18px;
        max-width: 480px;
        background: rgba(8, 22, 18, 0.96);
        border: 1.5px solid rgba(255, 120, 40, 0.5);
        box-shadow: 0 12px 36px rgba(0,0,0,0.7), 0 0 24px rgba(255, 106, 0, 0.25);
      }
      #speech-text {
        font-size: 14px;
        max-width: 420px;
      }

      /* Desktop Bottom Voice Console: Compact luxury footprint */
      #bottom-kiosk-bar {
        padding: 0 24px 10px;
        gap: 4px;
      }
      .orb-plate {
        width: clamp(86px, 9.5vh, 102px);
        height: clamp(86px, 9.5vh, 102px);
      }
      #talk-cta-label-group {
        margin-top: 3px;
        gap: 2px;
      }
      #talk-cta-label {
        font-size: 13px;
        letter-spacing: 1.8px;
      }
      #talk-cta-sub {
        font-size: 9.5px;
        letter-spacing: 0.9px;
      }
      #user-sub-caption {
        font-size: 11.5px;
        min-height: 14px;
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
      <!-- Full-Screen Cinematic Background Slideshow (Full Menu Showcase) -->
      <div id="kiosk-cinematic-bg">
        <div class="kiosk-bg-slide active" data-index="0" data-label="🎓 CAMPUS NIGHTS • SYRACUSE 'CUSE">
          <img class="kiosk-bg-photo" src="/assets/backgrounds/college_students_hangout.jpg" alt="Syracuse Students Hangout" />
        </div>
        <div class="kiosk-bg-slide" data-index="1" data-label="🍛 LOADED RICE PLATTERS • $9.99">
          <img class="kiosk-bg-photo" src="/assets/food/halal_platter.jpg" alt="Loaded Rice Platters" />
        </div>
        <div class="kiosk-bg-slide" data-index="2" data-label="🍗 CRISPY SAUCED WINGS • FROM $9.99">
          <img class="kiosk-bg-photo" src="/assets/food/crispy_wings.jpg" alt="Crispy Sauced Wings" />
        </div>
        <div class="kiosk-bg-slide" data-index="3" data-label="🌯 SPEED GYRO WRAPS • $7.99">
          <img class="kiosk-bg-photo" src="/assets/food/gyro_wrap.jpg" alt="Speed Gyro Wraps" />
        </div>
        <div class="kiosk-bg-slide" data-index="4" data-label="⭐ SQUAD HOLICBUCKET 5-IN-1 • $15.99">
          <img class="kiosk-bg-photo" src="/assets/food/holic_bucket.jpg" alt="Squad HolicBucket" />
        </div>
        <div class="kiosk-bg-slide" data-index="5" data-label="🍔 CHOPPED CHEESE & HEROES • $6.99–$9.99">
          <img class="kiosk-bg-photo" src="/assets/food/burger_hero.jpg" alt="Chopped Cheese & Gourmet Burgers" />
        </div>
        <div class="kiosk-bg-slide" data-index="6" data-label="🍗 CRISPY TENDERS & NUGGETS • FROM $5.99">
          <img class="kiosk-bg-photo" src="/assets/food/chicken_tenders.jpg" alt="Crispy Chicken Tenders & Nuggets" />
        </div>
        <div class="kiosk-bg-slide" data-index="7" data-label="🍟 CHEESE FRIES & SIDES FEAST • FROM $3.99">
          <img class="kiosk-bg-photo" src="/assets/food/loaded_sides.jpg" alt="Loaded Cheese Fries & Sides" />
        </div>
        <div class="kiosk-bg-slide" data-index="8" data-label="🥗 FALAFEL & MEDITERRANEAN SALADS • FROM $8.99">
          <img class="kiosk-bg-photo" src="/assets/food/falafel_salad.jpg" alt="Mediterranean Falafel & Fresh Salads" />
        </div>
        <div class="kiosk-bg-glass-overlay"></div>
        <div class="kiosk-bg-vignette"></div>
      </div>

      <!-- Cyber-Varsity Campus Stage Grid Matrix -->
      <div id="bg-campus-grid"></div>

      <div id="bg-spotlight"></div>
      ${embers}

      <!-- Unified Kiosk Navigation Header -->
      <header id="header">
        <div id="header-campus-pill">
          <span class="flame-icon">🔥</span>
          <span class="campus-text">HALALHOLIC</span>
          <span class="sub-tag">• SYRACUSE CAMPUS</span>
        </div>

        <div id="header-center-emblem">
          <span class="emblem-bolt">⚡</span>
          <span class="emblem-text">KIOSK AI HOST</span>
          <span class="emblem-tag">• 100% ZABIHA</span>
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

      <!-- "Meet Mo" Hero Identity Banner (Adapted from "Meet Alex") -->
      <div id="kiosk-hero-banner">
        <div class="hero-live-badge">
          <span class="badge-dot"></span>
          <span>● LIVE AI HOST • SYRACUSE UNIVERSITY FLAGSHIP</span>
        </div>
        <h1 class="hero-title">Meet <span class="title-accent">Mo</span></h1>
        <p class="hero-subtitle">
          Halalholic's living 3D AI host. Talk to him live right at this kiosk to customize platters, grab 2-min speed wraps, or order squad feasts.
        </p>
      </div>

      <!-- Syracuse Live Social Proof Ticker -->
      <div id="kiosk-live-ticker">
        <div class="ticker-pill">
          <span class="ticker-fire">🔥</span>
          <span class="ticker-text"><strong>1,840+ PLATTERS</strong> ORDERED TODAY ON 'CUSE CAMPUS</span>
          <span class="ticker-sep">•</span>
          <span class="ticker-tag">⚡ 2-MIN SPEED RUSH</span>
          <span class="ticker-sep">•</span>
          <span class="ticker-tag">🎓 100% FRESH ZABIHA</span>
          <span class="ticker-sep">•</span>
          <span class="ticker-perk">⭐ FREE SAUCE W/ STUDENT ID</span>
        </div>
      </div>

      <!-- Live Background Slide Indicator (Shows Active Featured Dish) -->
      <div id="kiosk-slide-indicator">
        <div class="slide-indicator-track">
          <span class="indicator-dot active" data-slide="0" title="Campus Nights"></span>
          <span class="indicator-dot" data-slide="1" title="Loaded Platters"></span>
          <span class="indicator-dot" data-slide="2" title="Crispy Wings"></span>
          <span class="indicator-dot" data-slide="3" title="Speed Gyros"></span>
          <span class="indicator-dot" data-slide="4" title="Squad Bucket"></span>
          <span class="indicator-dot" data-slide="5" title="Burgers & Heroes"></span>
          <span class="indicator-dot" data-slide="6" title="Tenders & Nuggets"></span>
          <span class="indicator-dot" data-slide="7" title="Loaded Sides"></span>
          <span class="indicator-dot" data-slide="8" title="Fresh Salads"></span>
        </div>
        <span id="slide-feature-tag">🎓 CAMPUS NIGHTS • SYRACUSE 'CUSE</span>
      </div>

      <!-- Main Stage: "TRY ASKING MO" Crave Chips + 3D Holographic Stage Pedestal -->
      <section id="kiosk-main-stage">
        <!-- Left Wing (Crave Chips 1 & 2) -->
        <aside class="action-wing action-wing-left">
          <div class="kiosk-wing-label">
            <span class="label-bolt">⚡</span>
            <span>TRY ASKING MO</span>
          </div>

          <button class="action-wing-card" data-prompt="I have an exam tomorrow, what's a heavy fuel platter?" data-slide-target="1">
            <div class="chip-thumb-wrap">
              <img src="/assets/food/halal_platter.jpg" alt="Finals Fuel Platter" />
            </div>
            <div class="chip-info-wrap">
              <div class="chip-badge-row">
                <span class="chip-badge">🔥 #1 CAMPUS HIT</span>
                <span class="chip-price-tag">$9.99</span>
              </div>
              <span class="chip-title">Finals Fuel Platter</span>
              <span class="chip-sub">Heavy Rice & Double Meat • 2 Mins</span>
            </div>
          </button>

          <button class="action-wing-card" data-prompt="What's hitting today? Tell me your signature pick." data-slide-target="2">
            <div class="chip-thumb-wrap">
              <img src="/assets/food/crispy_wings.jpg" alt="Crispy Sauced Wings" />
            </div>
            <div class="chip-info-wrap">
              <div class="chip-badge-row">
                <span class="chip-badge">⭐ MO'S SPECIALTY</span>
                <span class="chip-price-tag">$8.99</span>
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

        <!-- Right Wing (Crave Chips 3 & 4) -->
        <aside class="action-wing action-wing-right">
          <div class="kiosk-wing-label">
            <span class="label-bolt">⚡</span>
            <span>TRY ASKING MO</span>
          </div>

          <button class="action-wing-card" data-prompt="I brought the whole squad. What feeds everyone?" data-slide-target="4">
            <div class="chip-thumb-wrap">
              <img src="/assets/food/holic_bucket.jpg" alt="Squad HolicBucket" />
            </div>
            <div class="chip-info-wrap">
              <div class="chip-badge-row">
                <span class="chip-badge">🍗 SQUAD FEAST (3-4)</span>
                <span class="chip-price-tag">$15.99</span>
              </div>
              <span class="chip-title">Holic Squad Bucket</span>
              <span class="chip-sub">5-in-1 Feast & Waffle Fries • Share</span>
            </div>
          </button>

          <button class="action-wing-card" data-prompt="I'm running late to class, what's ready in 2 minutes?" data-slide-target="3">
            <div class="chip-thumb-wrap">
              <img src="/assets/food/gyro_wrap.jpg" alt="Speed Gyro Rush" />
            </div>
            <div class="chip-info-wrap">
              <div class="chip-badge-row">
                <span class="chip-badge">⚡ 2-MIN SPEED RUSH</span>
                <span class="chip-price-tag">$7.99</span>
              </div>
              <span class="chip-title">Speed Gyro Rush</span>
              <span class="chip-sub">Toasted Flatbread On-the-Go • Fast</span>
            </div>
          </button>
        </aside>
      </section>

      <!-- Bottom Console: Centered Sonic Reactor Orb ("Tap to Talk") -->
      <div id="bottom-kiosk-bar">
        <div id="user-sub-caption"></div>

        <!-- Perfectly Centered Sonic Reactor -->
        <div id="talk-orb-container">
          <div class="orb-plate">
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
          </div>

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
      <div class="menu-category-block" data-slide-target="1">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/halal_platter.jpg" alt="Signature Halal Platters" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🍛 Loaded Platters Over Rice</span>
            <span class="menu-cat-badge">#1 CAMPUS PICK</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="Can I get the Chicken Dose Platter?" data-slide-target="1">
            <div class="item-name-group">
              <span class="item-name">Chicken Dose Platter</span>
              <span class="item-sub">Seasoned basmati rice, spiced chicken, mix salad & fries or hummus</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Lamb Dose Platter?" data-slide-target="1">
            <div class="item-name-group">
              <span class="item-name">Lamb Dose Platter</span>
              <span class="item-sub">Tender marinated gyro lamb over golden rice + two sides</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Mix Combo Dose Platter?" data-slide-target="1">
            <div class="item-name-group">
              <span class="item-name">Mix Combo Dose</span>
              <span class="item-sub">Double protein: Spiced Chicken + Gyro Lamb combo</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Fish Dose Platter?" data-slide-target="1">
            <div class="item-name-group">
              <span class="item-name">Fish Dose Platter</span>
              <span class="item-sub">Golden crispy fish fillet over basmati rice + two sides</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Falafel Dose Platter?" data-slide-target="1">
            <div class="item-name-group">
              <span class="item-name">Falafel Dose (Vegetarian)</span>
              <span class="item-sub">Crispy golden handmade falafels & pickled cabbage</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Kofta Dose Platter?" data-slide-target="1">
            <div class="item-name-group">
              <span class="item-name">Kofta Dose Platter</span>
              <span class="item-sub">Seasoned beef & lamb kofta skewers over spiced rice</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can you make my platter Extra Holic?" data-slide-target="1">
            <div class="item-name-group">
              <span class="item-name">Make It Extra Holic</span>
              <span class="item-sub">Double meat load, extra white sauce & spicy red drizzle</span>
            </div>
            <span class="item-price-tag">+$3.00</span>
          </div>
        </div>
      </div>

      <!-- Category 2: Speed Gyro Wraps -->
      <div class="menu-category-block" data-slide-target="3">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/gyro_wrap.jpg" alt="Speed Gyro Wraps" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🌯 Speed Gyro Wraps</span>
            <span class="menu-cat-badge">2-MIN RUSH</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="I need a quick Chicken Gyro." data-slide-target="3">
            <div class="item-name-group">
              <span class="item-name">Chicken Gyro Wrap</span>
              <span class="item-sub">Warm toasted flatbread with lettuce, tomato & garlic white sauce</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
          <div class="menu-item-row" data-prompt="I need a quick Lamb Gyro." data-slide-target="3">
            <div class="item-name-group">
              <span class="item-name">Lamb Gyro Wrap</span>
              <span class="item-sub">Classic shaved gyro with pickled red cabbage & white sauce</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Mix Gyro?" data-slide-target="3">
            <div class="item-name-group">
              <span class="item-name">Mix Gyro Wrap</span>
              <span class="item-sub">Chicken + lamb double protein wrap</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Fish Gyro?" data-slide-target="3">
            <div class="item-name-group">
              <span class="item-name">Fish Gyro Wrap</span>
              <span class="item-sub">Golden fish fillet, crisp greens & tartar white sauce</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Falafel Gyro?" data-slide-target="3">
            <div class="item-name-group">
              <span class="item-name">Falafel Gyro (Vegetarian)</span>
              <span class="item-sub">Handmade falafel, hummus, lettuce, tomato & tahini</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Chicken Kofta Gyro?" data-slide-target="3">
            <div class="item-name-group">
              <span class="item-name">Chicken Kofta Gyro</span>
              <span class="item-sub">Spiced chicken kofta, grilled onions & white sauce</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
        </div>
      </div>

      <!-- Category 3: Squad HolicBucket -->
      <div class="menu-category-block" data-slide-target="4">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/holic_bucket.jpg" alt="Squad HolicBucket 5-in-1" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">⭐ Squad HolicBucket 5-in-1</span>
            <span class="menu-cat-badge">FEEDS 3-4</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="We want the HolicBucket for the squad!" data-slide-target="4">
            <div class="item-name-group">
              <span class="item-name">HolicBucket 5-in-1 Feast</span>
              <span class="item-sub">Tenders, Buffalo Wings, Waffle Fries, Mozz Sticks & Mac Bites</span>
            </div>
            <span class="item-price-tag">$15.99</span>
          </div>
        </div>
      </div>

      <!-- Category 4: Crispy Sauced Wings -->
      <div class="menu-category-block" data-slide-target="2">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/crispy_wings.jpg" alt="Crispy Sauced Wings" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🍗 Crispy Sauced Wings</span>
            <span class="menu-cat-badge">5 FLAVORS</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="Can I order 6 piece Wings?" data-slide-target="2">
            <div class="item-name-group">
              <span class="item-name">6 Pieces Crispy Wings</span>
              <span class="item-sub">Hot, BBQ, Buffalo, Lemon Pepper, or Mango Habanero</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I order 9 piece Wings?" data-slide-target="2">
            <div class="item-name-group">
              <span class="item-name">9 Pieces Crispy Wings</span>
              <span class="item-sub">Sauced with your choice of White, Blue Cheese or Ranch dip</span>
            </div>
            <span class="item-price-tag">$12.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the 12 piece Wings?" data-slide-target="2">
            <div class="item-name-group">
              <span class="item-name">12 Pieces Crispy Wings</span>
              <span class="item-sub">Perfect for sharing with friends</span>
            </div>
            <span class="item-price-tag">$15.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Give me the 20 piece party Wings!" data-slide-target="2">
            <div class="item-name-group">
              <span class="item-name">20 Pieces Party Wings</span>
              <span class="item-sub">Maximum crave feast for study groups</span>
            </div>
            <span class="item-price-tag">$23.99</span>
          </div>
        </div>
      </div>

      <!-- Category 5: Gourmet Burgers & Heroes -->
      <div class="menu-category-block" data-slide-target="5">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/burger_hero.jpg" alt="Gourmet Burgers & Heroes" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🍔 Burgers & Hero Sandwiches</span>
            <span class="menu-cat-badge">+$2.99 COMBO</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="Can I get the Chopped Cheese on Hero?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Chopped Cheese On Hero</span>
              <span class="item-sub">NYC bodega style seasoned beef, melted cheese, lettuce, tomato</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Philly Cheesesteak On Hero?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Philly Cheesesteak On Hero</span>
              <span class="item-sub">Shaved ribeye, grilled peppers, onions, melted provolone</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Chicken Cheesesteak On Hero?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Chicken Cheesesteak On Hero</span>
              <span class="item-sub">Grilled chicken, sweet peppers, melted cheese</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Chicken Cutlet On Hero?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Chicken Cutlet On Hero</span>
              <span class="item-sub">Crispy breaded golden chicken cutlet, mayo, lettuce</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Pastrami On Hero?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Pastrami On Hero</span>
              <span class="item-sub">Warm sliced pastrami with mustard & melted swiss</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Turkey On Hero?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Turkey On Hero</span>
              <span class="item-sub">Smoked halal turkey breast, cheese, crisp lettuce</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get a Classic Cheeseburger?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Classic Cheeseburger</span>
              <span class="item-sub">Grilled beef patty, American cheese, pickle, special sauce</span>
            </div>
            <span class="item-price-tag">$6.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Double Cheeseburger?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Double Cheeseburger</span>
              <span class="item-sub">Two smash patties, double cheese, toasted brioche bun</span>
            </div>
            <span class="item-price-tag">$8.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Crispy Chicken Sandwich?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Crispy Chicken Sandwich</span>
              <span class="item-sub">Golden fried breast fillet, pickles, house spread</span>
            </div>
            <span class="item-price-tag">$6.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Spicy Crispy Chicken Sandwich?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Spicy Crispy Chicken Sandwich</span>
              <span class="item-sub">Spicy glazed chicken fillet, jalapeño crunch</span>
            </div>
            <span class="item-price-tag">$6.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Heart Attack Burger?" data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Heart Attack Burger</span>
              <span class="item-sub">Loaded burger stack with extra beef & melted cheese</span>
            </div>
            <span class="item-price-tag">$7.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Add fries and drink to my sandwich." data-slide-target="5">
            <div class="item-name-group">
              <span class="item-name">Combo Deal: Add Fries & Drink</span>
              <span class="item-sub">Includes seasoned fries & fountain soda</span>
            </div>
            <span class="item-price-tag">+$2.99</span>
          </div>
        </div>
      </div>

      <!-- Category 6: Tenders & Nuggets -->
      <div class="menu-category-block" data-slide-target="6">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/chicken_tenders.jpg" alt="Crispy Chicken Tenders & Nuggets" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🍗 Tenders & Golden Nuggets</span>
            <span class="menu-cat-badge">CRISPY GOLD</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="Can I get 3 piece Chicken Tenders?" data-slide-target="6">
            <div class="item-name-group">
              <span class="item-name">3 Pieces Tenders</span>
              <span class="item-sub">Hand-breaded tenders with honey mustard or white sauce</span>
            </div>
            <span class="item-price-tag">$6.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get 5 piece Chicken Tenders?" data-slide-target="6">
            <div class="item-name-group">
              <span class="item-name">5 Pieces Tenders</span>
              <span class="item-sub">Golden crunch tenders with choice of 2 dipping sauces</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get 10 piece Chicken Tenders?" data-slide-target="6">
            <div class="item-name-group">
              <span class="item-name">10 Pieces Tenders</span>
              <span class="item-sub">Giant tender box for sharing</span>
            </div>
            <span class="item-price-tag">$15.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get 6 piece Nuggets?" data-slide-target="6">
            <div class="item-name-group">
              <span class="item-name">6 Pieces Nuggets</span>
              <span class="item-sub">Bite-sized crispy golden chicken nuggets</span>
            </div>
            <span class="item-price-tag">$5.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get 12 piece Nuggets?" data-slide-target="6">
            <div class="item-name-group">
              <span class="item-name">12 Pieces Nuggets</span>
              <span class="item-sub">12 golden nuggets with dipping sauce</span>
            </div>
            <span class="item-price-tag">$8.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get 20 piece Nuggets?" data-slide-target="6">
            <div class="item-name-group">
              <span class="item-name">20 Pieces Nuggets</span>
              <span class="item-sub">20-piece party nugget pack</span>
            </div>
            <span class="item-price-tag">$10.99</span>
          </div>
        </div>
      </div>

      <!-- Category 7: Side Orders & Loaded Starters -->
      <div class="menu-category-block" data-slide-target="7">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/loaded_sides.jpg" alt="Loaded Sides Feast" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🍟 Loaded Sides & Starters</span>
            <span class="menu-cat-badge">HOT SIDES</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="Can I get Seasoned Fries?" data-slide-target="7">
            <div class="item-name-group">
              <span class="item-name">Seasoned Fries</span>
              <span class="item-sub">Golden crispy fries tossed in signature Halalholic spice</span>
            </div>
            <span class="item-price-tag">$4.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get Cheese Fries?" data-slide-target="7">
            <div class="item-name-group">
              <span class="item-name">Cheese Fries</span>
              <span class="item-sub">Hot seasoned fries smothered in melted cheddar cheese sauce</span>
            </div>
            <span class="item-price-tag">$5.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get Mozzarella Sticks?" data-slide-target="7">
            <div class="item-name-group">
              <span class="item-name">Mozzarella Sticks</span>
              <span class="item-sub">Crispy golden sticks with warm marinara dipping sauce</span>
            </div>
            <span class="item-price-tag">$6.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get Mac N Cheese Bites?" data-slide-target="7">
            <div class="item-name-group">
              <span class="item-name">Mac N Cheese Bites</span>
              <span class="item-sub">Crispy fried bite-sized mac and cheddar goodness</span>
            </div>
            <span class="item-price-tag">$4.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get Onion Rings?" data-slide-target="7">
            <div class="item-name-group">
              <span class="item-name">Crispy Onion Rings</span>
              <span class="item-sub">Golden battered onion rings with house dipping sauce</span>
            </div>
            <span class="item-price-tag">$3.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I add Falafel Balls?" data-slide-target="7">
            <div class="item-name-group">
              <span class="item-name">Falafel Ball (Single Piece)</span>
              <span class="item-sub">Handmade fresh crispy falafel ball</span>
            </div>
            <span class="item-price-tag">$0.75</span>
          </div>
        </div>
      </div>

      <!-- Category 8: Mediterranean Fresh Salads -->
      <div class="menu-category-block" data-slide-target="8">
        <div class="menu-cat-hero-img">
          <img src="/assets/food/falafel_salad.jpg" alt="Mediterranean Fresh Salads" />
          <div class="menu-cat-hero-overlay">
            <span class="menu-cat-hero-title">🥗 Mediterranean Fresh Salads</span>
            <span class="menu-cat-badge">100% FRESH</span>
          </div>
        </div>
        <div class="menu-items-list">
          <div class="menu-item-row" data-prompt="Can I get the Garden Salad?" data-slide-target="8">
            <div class="item-name-group">
              <span class="item-name">Garden Salad (Vegetarian)</span>
              <span class="item-sub">Crisp romaine, tomatoes, cucumbers, olives & white sauce</span>
            </div>
            <span class="item-price-tag">$8.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Grilled Chicken Salad?" data-slide-target="8">
            <div class="item-name-group">
              <span class="item-name">Grilled Chicken Salad</span>
              <span class="item-sub">Seasoned grilled chicken breast over fresh garden greens</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Lamb Salad?" data-slide-target="8">
            <div class="item-name-group">
              <span class="item-name">Lamb Gyro Salad</span>
              <span class="item-sub">Tender shaved gyro lamb over crisp Mediterranean salad</span>
            </div>
            <span class="item-price-tag">$9.99</span>
          </div>
          <div class="menu-item-row" data-prompt="Can I get the Fish Salad?" data-slide-target="8">
            <div class="item-name-group">
              <span class="item-name">Fish Salad</span>
              <span class="item-sub">Crispy fish fillet over mixed greens with lemon herb dressing</span>
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

    this._initBgSlideshow();
    this._bindEvents();
  }

  get moContainer() { return document.getElementById('mo-container'); }

  _initBgSlideshow() {
    this._bgSlides = Array.from(document.querySelectorAll('.kiosk-bg-slide'));
    this._bgDots   = Array.from(document.querySelectorAll('.indicator-dot'));
    this._bgTagEl  = document.getElementById('slide-feature-tag');
    this._curSlideIdx = 0;
    this._slideTimer = null;
    this._startSlideTimer();

    this._bgDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(dot.dataset.slide, 10);
        this.goToSlide(idx);
      });
    });
  }

  _startSlideTimer() {
    if (this._slideTimer) clearInterval(this._slideTimer);
    this._slideTimer = setInterval(() => {
      const nextIdx = (this._curSlideIdx + 1) % (this._bgSlides.length || 1);
      this.goToSlide(nextIdx, false);
    }, 7000);
  }

  goToSlide(idx, resetTimer = true) {
    if (!this._bgSlides || this._bgSlides.length === 0) return;
    const targetIdx = Math.max(0, Math.min(idx, this._bgSlides.length - 1));
    this._curSlideIdx = targetIdx;

    this._bgSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === targetIdx);
    });

    this._bgDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === targetIdx);
    });

    const activeSlide = this._bgSlides[targetIdx];
    if (this._bgTagEl && activeSlide) {
      const label = activeSlide.dataset.label || '';
      this._bgTagEl.style.opacity = '0';
      setTimeout(() => {
        this._bgTagEl.textContent = label;
        this._bgTagEl.style.opacity = '1';
      }, 150);
    }

    if (resetTimer) {
      this._startSlideTimer();
    }
  }

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
    document.getElementById('mo-stage-pedestal')?.classList.toggle('talking', state === 'talking');

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

    // Symmetrical Crave Chips ("TRY ASKING MO")
    document.querySelectorAll('.action-wing-card').forEach(card => {
      card.addEventListener('click', () => {
        card.style.transform = 'translateY(1px) scale(0.96)';
        setTimeout(() => { card.style.transform = ''; }, 200);
        if (card.dataset.slideTarget !== undefined) {
          this.goToSlide(parseInt(card.dataset.slideTarget, 10));
        }
        this._onChipClick?.(card.dataset.prompt);
      });
    });

    // Menu Category Hero Cards click to switch slide
    document.querySelectorAll('.menu-category-block').forEach(block => {
      const hero = block.querySelector('.menu-cat-hero-img');
      hero?.addEventListener('click', () => {
        if (block.dataset.slideTarget !== undefined) {
          this.goToSlide(parseInt(block.dataset.slideTarget, 10));
        }
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
        if (row.dataset.slideTarget !== undefined) {
          this.goToSlide(parseInt(row.dataset.slideTarget, 10));
        }
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

