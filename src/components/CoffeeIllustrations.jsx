import React from 'react';

// Crisp, scalable botanical SVG illustrations with custom stroke and fill colors
export function CoffeeBeansArt({ className = '', size = 48, color = 'var(--color-caramel-400)' }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bean 1 */}
      <g transform="rotate(-25 24 24)">
        <ellipse cx="24" cy="24" rx="14" ry="9" stroke={color} strokeWidth="2.5" fill="none" />
        <path d="M12 24C16 21 20 27 24 24C28 21 32 27 36 24" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="18" x2="19" y2="19" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <line x1="28" y1="28" x2="31" y2="29" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>
      {/* Bean 2 */}
      <g transform="rotate(35 44 38)">
        <ellipse cx="44" cy="38" rx="12" ry="7.5" stroke={color} strokeWidth="2.2" fill="none" />
        <path d="M34 38C37 35 41 40 44 38C47 36 51 41 54 38" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="38" y1="33" x2="40" y2="34" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );
}

export function CoffeeBranchArt({ className = '', width = 80, height = 48, color = 'var(--color-caramel-400)' }) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 100 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main Stem */}
      <path d="M5 50C25 45 60 30 95 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M30 42C32 28 48 24 55 26C52 38 38 43 30 42Z" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M30 42C40 35 50 28 55 26" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      
      <path d="M60 28C65 14 80 12 86 16C82 28 68 31 60 28Z" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M60 28C70 21 80 16 86 16" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />

      <path d="M45 35C42 48 28 52 20 48C24 38 38 34 45 35Z" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M45 35C35 41 25 46 20 48" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7" />

      {/* Coffee Cherries */}
      <circle cx="34" cy="40" r="4.5" stroke={color} strokeWidth="1.8" fill="none" />
      <circle cx="41" cy="42" r="4" stroke={color} strokeWidth="1.8" fill="none" />
      <circle cx="63" cy="26" r="4" stroke={color} strokeWidth="1.8" fill="none" />
    </svg>
  );
}

export function CoffeeDripperArt({ className = '', size = 52, color = 'var(--color-caramel-400)' }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* V60 Cone */}
      <path d="M12 18H52L38 40H26L12 18Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill="none" />
      <line x1="8" y1="18" x2="56" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Dripper Base Stand */}
      <line x1="20" y1="40" x2="44" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Server Carafe */}
      <path d="M24 43L18 56C18 58 20 60 23 60H41C44 60 46 58 46 56L40 43" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
      {/* Carafe handle */}
      <path d="M44 47C50 49 50 56 43 57" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Steam lines */}
      <path d="M26 12C28 9 26 6 28 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M32 13C34 10 32 7 34 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M38 12C40 9 38 6 40 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

