import React from 'react';

export function CableConnector({ className = '', style = {} }) {
  return (
    <svg className={`tech-object ${className}`} style={style} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="0" width="20" height="60" fill="var(--ink-800)" />
      <rect x="40" y="60" width="40" height="40" rx="4" fill="var(--ink-950)" />
      <path d="M45 100 L45 120 M75 100 L75 120" stroke="var(--ink-800)" strokeWidth="4" />
      <circle cx="50" cy="80" r="4" fill="var(--lime-400)" />
      <circle cx="70" cy="80" r="4" fill="var(--ink-800)" />
    </svg>
  );
}

export function PuzzleSlot({ className = '', style = {} }) {
  return (
    <svg className={`tech-object ${className}`} style={style} width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10 H110 V110 H10 Z" stroke="var(--ink-950)" strokeWidth="4" strokeDasharray="10 10" />
      <path d="M40 40 H80 V80 H40 Z" fill="var(--ink-800)" />
      <circle cx="60" cy="25" r="15" fill="var(--ink-800)" />
      <circle cx="95" cy="60" r="15" fill="var(--ink-800)" />
    </svg>
  );
}

export function FloatingTerminal({ className = '', style = {} }) {
  return (
    <svg className={`tech-object ${className}`} style={style} width="200" height="140" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="200" height="140" rx="8" fill="var(--ink-950)" />
      <rect x="0" y="0" width="200" height="30" rx="8" fill="var(--ink-900)" />
      <circle cx="20" cy="15" r="5" fill="var(--wine-600)" />
      <circle cx="35" cy="15" r="5" fill="var(--lime-500)" />
      <circle cx="50" cy="15" r="5" fill="var(--ink-700)" />
      <text x="20" y="60" fill="var(--lime-400)" fontFamily="var(--font-mono)" fontSize="14">&gt; _</text>
    </svg>
  );
}
