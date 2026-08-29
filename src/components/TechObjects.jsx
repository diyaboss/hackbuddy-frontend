import React from 'react';

export function CableConnector({ className = '', style = {} }) {
  return (
    <svg className={`tech-object ${className}`} style={style} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metal-grad" x1="40" y1="60" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--ink-700)" />
          <stop offset="50%" stopColor="var(--ink-900)" />
          <stop offset="100%" stopColor="var(--ink-950)" />
        </linearGradient>
        <linearGradient id="cable-grad" x1="50" y1="0" x2="70" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--ink-950)" />
          <stop offset="100%" stopColor="var(--ink-700)" />
        </linearGradient>
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="var(--ink-950)" floodOpacity="0.4" />
        </filter>
        <filter id="inner-glow">
          <feComponentTransfer in="SourceAlpha"><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feOffset dx="-2" dy="-2"/>
          <feComposite operator="in" in2="SourceAlpha"/>
          <feComposite operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
          <feFlood floodColor="rgba(255,255,255,0.15)" floodOpacity="1"/>
          <feComposite operator="in" in2="shadowDiff"/>
          <feComposite operator="over" in2="SourceGraphic"/>
        </filter>
      </defs>
      <g filter="url(#drop-shadow)">
        <rect x="52" y="0" width="16" height="60" rx="8" fill="url(#cable-grad)" />
        <path d="M54 20 L66 20 M54 40 L66 40" stroke="rgba(0,0,0,0.5)" strokeWidth="2" />
        <rect x="40" y="55" width="40" height="45" rx="6" fill="url(#metal-grad)" filter="url(#inner-glow)" />
        <path d="M45 100 L45 115 M75 100 L75 115" stroke="var(--ink-700)" strokeWidth="6" strokeLinecap="round" />
        <path d="M45 100 L45 115 M75 100 L75 115" stroke="var(--ink-950)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="78" r="3" fill="var(--lime-400)" />
        <circle cx="70" cy="78" r="3" fill="var(--wine-700)" />
        <rect x="55" y="65" width="10" height="4" fill="var(--ink-950)" rx="1" />
      </g>
    </svg>
  );
}

export function PuzzleSlot({ className = '', style = {}, stage = 3 }) {
  // stage 0: separated, stage 1: connecting, stage 2: aligning, stage 3: connected
  const p1X = stage === 0 ? 10 : stage === 1 ? 25 : 40;
  const p1Y = stage === 0 ? 10 : stage === 1 ? 25 : 40;
  const p2X = stage < 2 ? 90 : stage === 2 ? 60 : 40;
  const p2Y = stage < 2 ? 90 : stage === 2 ? 60 : 40;
  const opacity = stage === 0 ? 0 : stage === 1 ? 0.3 : stage === 2 ? 0.6 : 1;

  return (
    <svg className={`tech-object ${className}`} style={style} width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="piece1" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--ink-900)" />
          <stop offset="100%" stopColor="var(--ink-950)" />
        </linearGradient>
        <linearGradient id="piece2" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--wine-700)" />
          <stop offset="100%" stopColor="var(--ink-950)" />
        </linearGradient>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="8" stdDeviation="6" floodColor="var(--ink-950)" floodOpacity="0.3" />
        </filter>
        <filter id="piece-glow">
          <feComponentTransfer in="SourceAlpha"><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feOffset dx="-1" dy="-1"/>
          <feComposite operator="in" in2="SourceAlpha"/>
          <feComposite operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
          <feFlood floodColor="rgba(255,255,255,0.2)" floodOpacity="1"/>
          <feComposite operator="in" in2="shadowDiff"/>
          <feComposite operator="over" in2="SourceGraphic"/>
        </filter>
      </defs>

      <path d="M20 20 H140 V140 H20 Z" stroke="var(--hairline-dark)" strokeWidth="1" strokeDasharray="4 4" fill="transparent" />

      {stage > 0 && (
        <path d={`M${p1X + 40} ${p1Y + 40} L${p2X + 40} ${p2Y + 40}`} stroke="var(--lime-400)" strokeWidth="2" strokeDasharray="4 4" opacity={opacity} />
      )}

      <g filter="url(#soft-shadow)" style={{ transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        <g transform={`translate(${p1X}, ${p1Y})`}>
          <path d="M0 0 H80 V80 H0 Z" fill="url(#piece1)" filter="url(#piece-glow)" />
          <circle cx="40" cy="0" r="16" fill="url(#piece1)" filter="url(#piece-glow)" />
          <circle cx="80" cy="40" r="16" fill="var(--ink-900)" />
        </g>
        
        <g transform={`translate(${p2X}, ${p2Y})`}>
          <path d="M0 0 H80 V80 H0 Z" fill="url(#piece2)" filter="url(#piece-glow)" opacity={stage === 3 ? 1 : 0.9} />
          <circle cx="0" cy="40" r="14" fill="var(--ink-950)" />
          <circle cx="40" cy="80" r="14" fill="var(--ink-950)" />
        </g>
      </g>
    </svg>
  );
}

export function FloatingTerminal({ className = '', style = {} }) {
  return (
    <svg className={`tech-object ${className}`} style={style} width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="term-bg" x1="0" y1="0" x2="0" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--ink-900)" />
          <stop offset="100%" stopColor="var(--ink-950)" />
        </linearGradient>
        <filter id="term-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="8" dy="16" stdDeviation="12" floodColor="var(--ink-950)" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter="url(#term-shadow)">
        <rect x="0" y="0" width="240" height="160" rx="6" fill="url(#term-bg)" stroke="var(--ink-700)" strokeWidth="1" />
        <rect x="0" y="0" width="240" height="28" rx="6" fill="var(--ink-950)" />
        <circle cx="16" cy="14" r="4" fill="var(--wine-700)" />
        <circle cx="32" cy="14" r="4" fill="var(--lime-400)" />
        <circle cx="48" cy="14" r="4" fill="var(--ink-700)" />
        
        <text x="20" y="55" fill="var(--lime-400)" fontFamily="var(--font-mono)" fontSize="12">system.match(</text>
        <text x="35" y="75" fill="var(--stone-500)" fontFamily="var(--font-mono)" fontSize="12">profile: "FRONTEND",</text>
        <text x="35" y="95" fill="var(--stone-500)" fontFamily="var(--font-mono)" fontSize="12">gap: "BACKEND"</text>
        <text x="20" y="115" fill="var(--lime-400)" fontFamily="var(--font-mono)" fontSize="12">) <tspan fill="var(--cream-50)">= true</tspan></text>
        
        <rect x="75" y="105" width="6" height="12" fill="var(--lime-400)">
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
}
