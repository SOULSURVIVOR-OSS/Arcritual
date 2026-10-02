/**
 * Design Tokens & System Guidelines
 *
 * Core Principles:
 * - Minimal, spacious, calm, functional, intentional.
 * - Single-elevation depth: subtle 1px hairline borders instead of stacked cards.
 * - Strict 60-30-10 color distribution with ONE restrained accent color.
 * - Zero-pill discipline: metadata is rendered as unboxed inline text with '·' separators.
 * - Tabular numbers (tabular-nums) for all numeric values, timers, metrics, and timestamps.
 */

export const DESIGN_TOKENS = {
  // Spacing scale (multiples of 4px)
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
  },

  // Typography Scale
  typography: {
    fontFamilies: {
      sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', ui-monospace, monospace",
    },
    sizes: {
      display: 'text-3xl md:text-4xl font-semibold tracking-tight leading-tight', // 30px / 36px
      h1: 'text-2xl md:text-3xl font-semibold tracking-tight leading-snug',       // 24px / 30px
      h2: 'text-xl md:text-2xl font-semibold tracking-tight leading-snug',         // 20px / 24px
      h3: 'text-base md:text-lg font-medium tracking-normal leading-normal',       // 16px / 18px
      h4: 'text-sm font-medium tracking-normal leading-normal',                   // 14px
      body: 'text-sm font-normal leading-relaxed text-secondary',                 // 14px
      bodyLarge: 'text-base font-normal leading-relaxed text-primary',            // 16px
      caption: 'text-xs font-normal leading-normal text-tertiary',                // 12px
      kicker: 'text-xs font-medium tracking-wider text-tertiary uppercase',       // 11px
      metric: 'text-2xl md:text-3xl font-semibold tracking-tight tabular-nums',   // Tabular numeric display
    },
  },

  // Border Radius Rules (Subtle, restrained, no bubbly oversized capsules)
  radius: {
    none: 'rounded-none',
    xs: 'rounded-[3px]',
    sm: 'rounded-[5px]',
    md: 'rounded-[8px]',
    lg: 'rounded-[12px]',
    full: 'rounded-full', // strictly for circular buttons or status dots
  },

  // Surface and Depth (Single-elevation depth with 1px hairline borders)
  surfaces: {
    canvas: 'bg-canvas',
    surface: 'bg-surface border border-subtle',
    surfaceElevated: 'bg-surface-elevated border border-strong',
    surfaceSubtle: 'bg-surface-subtle',
  },

  // Single Accent Palettes (Restrained, focused)
  accents: [
    { id: 'amber', name: 'Ochre Amber', color: '#E5A93C', description: 'Calm, architectural warmth' },
    { id: 'emerald', name: 'Serene Sage', color: '#34D399', description: 'Focused, organic clarity' },
    { id: 'cobalt', name: 'Precision Cobalt', color: '#38BDF8', description: 'Technical, clear precision' },
    { id: 'monochrome', name: 'Pure Monochrome', color: '#EDEDED', description: 'Monastic stark minimalism' },
  ],
} as const;

export type AccentId = 'amber' | 'emerald' | 'cobalt' | 'monochrome';
