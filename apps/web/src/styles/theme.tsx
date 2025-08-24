import React, { createContext, useContext, ReactNode } from 'react';
import { colors, spacing, typography, borderRadius, shadows, transitions, zIndex, breakpoints, layout } from './tokens';

// ===== THEME INTERFACE =====
export interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  transitions: typeof transitions;
  zIndex: typeof zIndex;
  breakpoints: typeof breakpoints;
  layout: typeof layout;
  mode: 'light' | 'dark';
}

// ===== DEFAULT THEME =====
export const defaultTheme: Theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  layout,
  mode: 'light',
};

// ===== DARK THEME =====
export const darkTheme: Theme = {
  ...defaultTheme,
  mode: 'dark',
  colors: {
    ...colors,
    gray: {
      50: '#030712',
      100: '#111827',
      200: '#1f2937',
      300: '#374151',
      400: '#4b5563',
      500: '#6b7280',
      600: '#9ca3af',
      700: '#d1d5db',
      800: '#e5e7eb',
      900: '#f9fafb',
      950: '#ffffff',
    },
  },
};

// ===== THEME CONTEXT =====
const ThemeContext = createContext<Theme>(defaultTheme);

// ===== THEME PROVIDER =====
interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme = defaultTheme }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// ===== USE THEME HOOK =====
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ===== THEME UTILITIES =====

export const getThemeValue = (theme: Theme, path: string) => {
  const keys = path.split('.');
  let value: any = theme;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};

export const createThemeVariant = <T extends Record<string, any>>(
  baseTheme: T,
  variant: Partial<T>
): T => {
  return {
    ...baseTheme,
    ...variant,
  };
};

// ===== CSS VARIABLE GENERATOR =====
export const generateCSSVariables = (theme: Theme): Record<string, string> => {
  const variables: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors).forEach(([colorName, colorShades]) => {
    if (typeof colorShades === 'object') {
      Object.entries(colorShades).forEach(([shade, value]) => {
        variables[`--${colorName}-${shade}`] = value;
      });
    }
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([size, value]) => {
    variables[`--space-${size}`] = value;
  });

  // Typography
  Object.entries(theme.typography.fontSize).forEach(([size, value]) => {
    variables[`--font-size-${size}`] = value;
  });

  Object.entries(theme.typography.lineHeight).forEach(([height, value]) => {
    variables[`--line-height-${height}`] = value;
  });

  Object.entries(theme.typography.fontWeight).forEach(([weight, value]) => {
    variables[`--font-weight-${weight}`] = value;
  });

  // Border Radius
  Object.entries(theme.borderRadius).forEach(([size, value]) => {
    variables[`--radius-${size}`] = value;
  });

  // Shadows
  Object.entries(theme.shadows).forEach(([size, value]) => {
    variables[`--shadow-${size}`] = value;
  });

  // Transitions
  Object.entries(theme.transitions).forEach(([speed, value]) => {
    variables[`--transition-${speed}`] = value;
  });

  // Z-Index
  Object.entries(theme.zIndex).forEach(([level, value]) => {
    variables[`--z-${level}`] = value.toString();
  });

  // Layout
  Object.entries(theme.layout).forEach(([property, value]) => {
    variables[`--${property}`] = value;
  });

  return variables;
};

// ===== THEME APPLIER =====
export const applyTheme = (theme: Theme) => {
  const variables = generateCSSVariables(theme);
  const root = document.documentElement;

  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Apply theme mode class
  root.classList.remove('light', 'dark');
  root.classList.add(theme.mode);
};

// ===== PRESET THEMES =====
export const themes = {
  light: defaultTheme,
  dark: darkTheme,
  // Add more theme presets here
} as const;

export type ThemeName = keyof typeof themes; 