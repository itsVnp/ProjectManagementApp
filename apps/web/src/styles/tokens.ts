// ===== DESIGN TOKENS =====
// This file contains all design tokens used throughout the application
// These tokens ensure consistency across components and pages

export const colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Neutral Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
} as const;

export const typography = {
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const layout = {
  headerHeight: '4rem',      // 64px
  sidebarWidth: '18rem',     // 288px
  sidebarCollapsedWidth: '4rem', // 64px
  containerMaxWidth: '80rem', // 1280px
} as const;

// ===== UTILITY FUNCTIONS =====

export const getColor = (color: keyof typeof colors, shade?: keyof typeof colors.primary) => {
  if (shade) {
    return colors[color][shade];
  }
  return colors[color];
};

export const getSpacing = (size: keyof typeof spacing) => {
  return spacing[size];
};

export const getTypography = (type: keyof typeof typography.fontSize) => {
  return typography.fontSize[type];
};

export const getBorderRadius = (size: keyof typeof borderRadius) => {
  return borderRadius[size];
};

export const getShadow = (size: keyof typeof shadows) => {
  return shadows[size];
};

export const getTransition = (speed: keyof typeof transitions) => {
  return transitions[speed];
};

export const getZIndex = (level: keyof typeof zIndex) => {
  return zIndex[level];
};

// ===== THEME TYPES =====

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type TypographyToken = keyof typeof typography.fontSize;
export type BorderRadiusToken = keyof typeof borderRadius;
export type ShadowToken = keyof typeof shadows;
export type TransitionToken = keyof typeof transitions;
export type ZIndexToken = keyof typeof zIndex;

// ===== CSS VARIABLE HELPERS =====

export const cssVariables = {
  // Convert tokens to CSS custom properties
  primary: Object.fromEntries(
    Object.entries(colors.primary).map(([key, value]) => [`--primary-${key}`, value])
  ),
  gray: Object.fromEntries(
    Object.entries(colors.gray).map(([key, value]) => [`--gray-${key}`, value])
  ),
  spacing: Object.fromEntries(
    Object.entries(spacing).map(([key, value]) => [`--space-${key}`, value])
  ),
  fontSize: Object.fromEntries(
    Object.entries(typography.fontSize).map(([key, value]) => [`--font-size-${key}`, value])
  ),
  borderRadius: Object.fromEntries(
    Object.entries(borderRadius).map(([key, value]) => [`--radius-${key}`, value])
  ),
  shadows: Object.fromEntries(
    Object.entries(shadows).map(([key, value]) => [`--shadow-${key}`, value])
  ),
} as const; 