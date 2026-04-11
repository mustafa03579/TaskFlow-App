import React from 'react';

/**
 * TaskFlow Logo — Original Design
 * A rounded-square badge with a teal gradient background.
 * Inside: a stylized task list (3 lines) that flows into an upward arrow,
 * symbolizing tasks becoming progress and momentum.
 */
const LogoIcon = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="badge_grad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#14756a" />
        <stop offset="100%" stopColor="#25c49a" />
      </linearGradient>
      <linearGradient id="arrow_grad" x1="0" y1="80" x2="80" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
        <stop offset="100%" stopColor="rgba(255,255,255,1)" />
      </linearGradient>
      <filter id="logo_shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0a4a40" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Badge background */}
    <rect x="0" y="0" width="80" height="80" rx="20" fill="url(#badge_grad)" filter="url(#logo_shadow)" />

    {/* Task list lines — 3 horizontal bars, left side */}
    {/* Line 1 — full width */}
    <rect x="14" y="20" width="26" height="5" rx="2.5" fill="url(#arrow_grad)" />
    {/* Line 2 — medium */}
    <rect x="14" y="31" width="20" height="5" rx="2.5" fill="white" opacity="0.8" />
    {/* Line 3 — short */}
    <rect x="14" y="42" width="12" height="5" rx="2.5" fill="white" opacity="0.5" />

    {/* Flowing arrow — starts at bottom of task list and sweeps up-right */}
    {/* Arrow shaft: smooth bezier from (26,47) curving up to (60,20) */}
    <path
      d="M26 47 C32 47 36 22 60 20"
      stroke="url(#arrow_grad)"
      strokeWidth="5.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Arrow head pointing up-right */}
    <path
      d="M60 20 L50 17 M60 20 L63 30"
      stroke="white"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default LogoIcon;
