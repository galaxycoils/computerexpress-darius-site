// Shared SVG icon components for ComputerExpress

export function IconWeb({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

export function IconSearch({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  )
}

export function IconMap({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

export function IconRocket({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  )
}

export function IconShield({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}

export function IconChart({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/>
      <path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  )
}

export function IconCode({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  )
}

export function IconZap({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}

export function IconArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

export function IconCheck({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export function IconStar({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

// Hero illustration: abstract browser/window with floating elements
export function HeroIllustration({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Background glow */}
      <defs>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#12d6ff" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#12d6ff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#12d6ff" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d1b30"/>
          <stop offset="100%" stopColor="#0a1628"/>
        </linearGradient>
      </defs>

      {/* Glow circles */}
      <circle cx="250" cy="200" r="180" fill="url(#glow1)"/>
      <circle cx="350" cy="150" r="120" fill="url(#glow2)"/>

      {/* Main browser window */}
      <rect x="60" y="50" width="380" height="260" rx="16" fill="url(#screenGrad)" stroke="url(#borderGrad)" strokeWidth="1.5"/>

      {/* Browser top bar */}
      <rect x="60" y="50" width="380" height="44" rx="16" fill="#0f1c35"/>
      <rect x="60" y="78" width="380" height="16" fill="#0f1c35"/>

      {/* Traffic lights */}
      <circle cx="82" cy="72" r="6" fill="#ff5f57"/>
      <circle cx="100" cy="72" r="6" fill="#febc2e"/>
      <circle cx="118" cy="72" r="6" fill="#28c840"/>

      {/* URL bar */}
      <rect x="140" y="60" width="240" height="24" rx="12" fill="#0a1628" stroke="#7df9ff1a" strokeWidth="1"/>
      <text x="155" y="76" fill="#9ab4d2" fontSize="11" fontFamily="Inter, sans-serif">computerexpress.pages.dev</text>

      {/* Content area - hero section mockup */}
      <rect x="80" y="110" width="200" height="8" rx="4" fill="#12d6ff" opacity="0.6"/>
      <rect x="80" y="128" width="280" height="12" rx="4" fill="#ecf5ff" opacity="0.9"/>
      <rect x="80" y="146" width="240" height="12" rx="4" fill="#ecf5ff" opacity="0.5"/>

      {/* CTA buttons mockup */}
      <rect x="80" y="172" width="100" height="32" rx="6" fill="#12d6ff" opacity="0.8"/>
      <rect x="192" y="172" width="100" height="32" rx="6" stroke="#7df9ff40" strokeWidth="1" fill="none"/>

      {/* Card grid mockup */}
      <rect x="80" y="220" width="100" height="60" rx="8" fill="#0f1c35" stroke="#7df9ff1a" strokeWidth="1"/>
      <rect x="190" y="220" width="100" height="60" rx="8" fill="#0f1c35" stroke="#7df9ff1a" strokeWidth="1"/>
      <rect x="300" y="220" width="100" height="60" rx="8" fill="#0f1c35" stroke="#7df9ff1a" strokeWidth="1"/>

      {/* Floating elements */}
      {/* Speedometer */}
      <g transform="translate(380, 140)">
        <circle cx="0" cy="0" r="32" fill="#0d1b30" stroke="#12d6ff30" strokeWidth="1.5"/>
        <path d="M-18 5 A22 22 0 0 1 18 5" stroke="#12d6ff" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <circle cx="0" cy="0" r="4" fill="#12d6ff"/>
        <text x="0" y="12" textAnchor="middle" fill="#7df9ff" fontSize="8" fontFamily="Inter, sans-serif">100</text>
      </g>

      {/* SEO badge */}
      <g transform="translate(370, 240)">
        <rect x="-30" y="-14" width="60" height="28" rx="14" fill="#0d1b30" stroke="#a78bfa30" strokeWidth="1.5"/>
        <text x="0" y="4" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">SEO ↑</text>
      </g>

      {/* Mobile device */}
      <g transform="translate(420, 180)">
        <rect x="-22" y="-35" width="44" height="70" rx="8" fill="#0d1b30" stroke="#7df9ff20" strokeWidth="1.5"/>
        <rect x="-16" y="-28" width="32" height="50" rx="4" fill="#0f1c35"/>
        <rect x="-12" y="-20" width="24" height="4" rx="2" fill="#12d6ff" opacity="0.5"/>
        <rect x="-12" y="-12" width="20" height="4" rx="2" fill="#7df9ff" opacity="0.3"/>
        <rect x="-12" y="-4" width="16" height="4" rx="2" fill="#7df9ff" opacity="0.2"/>
        <circle cx="0" cy="28" r="3" fill="#7df9ff20"/>
      </g>

      {/* Decorative dots */}
      <circle cx="440" cy="80" r="3" fill="#12d6ff" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="300" r="2" fill="#a78bfa" opacity="0.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="460" cy="320" r="2.5" fill="#7df9ff" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite"/>
      </circle>

      {/* Connection lines */}
      <line x1="380" y1="172" x2="350" y2="220" stroke="#12d6ff" strokeWidth="1" opacity="0.2" strokeDasharray="4 4"/>
      <line x1="420" y1="215" x2="400" y2="240" stroke="#a78bfa" strokeWidth="1" opacity="0.2" strokeDasharray="4 4"/>
    </svg>
  )
}
