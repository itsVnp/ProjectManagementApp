// ===== DYNAMIC STYLING UTILITIES =====
// These utilities help replace hardcoded values with dynamic design tokens

import { colors, spacing, typography, borderRadius, shadows, transitions } from './tokens';

// ===== COLOR UTILITIES =====
export const getDynamicColor = (colorName: string, shade: string = '500') => {
  const colorMap: Record<string, any> = {
    primary: colors.primary,
    gray: colors.gray,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  };

  const color = colorMap[colorName];
  if (!color) {
    console.warn(`Color "${colorName}" not found in design tokens`);
    return colors.gray[500];
  }

  return color[shade as keyof typeof color] || color[500] || colors.gray[500];
};

// ===== STATUS COLOR MAPPING =====
export const getStatusColor = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string }> = {
    // Task/Project Status
    'COMPLETED': { bg: 'bg-success-500', text: 'text-success-500' },
    'IN_PROGRESS': { bg: 'bg-primary-500', text: 'text-primary-500' },
    'TODO': { bg: 'bg-gray-400', text: 'text-gray-400' },
    'ACTIVE': { bg: 'bg-success-500', text: 'text-success-500' },
    'ARCHIVED': { bg: 'bg-gray-400', text: 'text-gray-400' },
    
    // Priority
    'URGENT': { bg: 'bg-error-500', text: 'text-error-500' },
    'HIGH': { bg: 'bg-warning-500', text: 'text-warning-500' },
    'MEDIUM': { bg: 'bg-primary-500', text: 'text-primary-500' },
    'LOW': { bg: 'bg-gray-500', text: 'text-gray-500' },
    
    // Team Member Status
    'ONLINE': { bg: 'bg-success-500', text: 'text-success-500' },
    'OFFLINE': { bg: 'bg-gray-400', text: 'text-gray-400' },
    'AWAY': { bg: 'bg-warning-500', text: 'text-warning-500' },
    'BUSY': { bg: 'bg-error-500', text: 'text-error-500' },
    
    // Event Types
    'meeting': { bg: 'bg-primary-500', text: 'text-primary-500' },
    'deadline': { bg: 'bg-error-500', text: 'text-error-500' },
    'reminder': { bg: 'bg-warning-500', text: 'text-warning-500' },
    'task': { bg: 'bg-success-500', text: 'text-success-500' },
  };

  return statusMap[status] || { bg: 'bg-gray-400', text: 'text-gray-400' };
};

// ===== ROLE COLOR MAPPING =====
export const getRoleColor = (role: string) => {
  const roleMap: Record<string, { bg: string; text: string }> = {
    'admin': { bg: 'bg-error-100', text: 'text-error-800' },
    'manager': { bg: 'bg-primary-100', text: 'text-primary-800' },
    'developer': { bg: 'bg-success-100', text: 'text-success-800' },
    'designer': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'analyst': { bg: 'bg-warning-100', text: 'text-warning-800' },
  };

  return roleMap[role.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

// ===== PRIORITY COLOR MAPPING =====
export const getPriorityColor = (priority: string) => {
  const priorityMap: Record<string, string> = {
    'URGENT': getDynamicColor('error', '500'),
    'HIGH': getDynamicColor('warning', '500'),
    'MEDIUM': getDynamicColor('primary', '500'),
    'LOW': getDynamicColor('gray', '500'),
  };

  return priorityMap[priority] || getDynamicColor('gray', '500');
};

// ===== SPACING UTILITIES =====
export const getDynamicSpacing = (size: keyof typeof spacing) => {
  return spacing[size];
};

// ===== TYPOGRAPHY UTILITIES =====
export const getDynamicFontSize = (size: keyof typeof typography.fontSize) => {
  return typography.fontSize[size];
};

export const getDynamicFontWeight = (weight: keyof typeof typography.fontWeight) => {
  return typography.fontWeight[weight];
};

// ===== BORDER RADIUS UTILITIES =====
export const getDynamicBorderRadius = (size: keyof typeof borderRadius) => {
  return borderRadius[size];
};

// ===== SHADOW UTILITIES =====
export const getDynamicShadow = (size: keyof typeof shadows) => {
  return shadows[size];
};

// ===== TRANSITION UTILITIES =====
export const getDynamicTransition = (speed: keyof typeof transitions) => {
  return transitions[speed];
};

// ===== STYLE OBJECT GENERATORS =====
export const createDynamicStyles = {
  // Background color
  bg: (color: string, shade: string = '500') => ({
    backgroundColor: getDynamicColor(color, shade),
  }),

  // Text color
  text: (color: string, shade: string = '500') => ({
    color: getDynamicColor(color, shade),
  }),

  // Border color
  border: (color: string, shade: string = '500') => ({
    borderColor: getDynamicColor(color, shade),
  }),

  // Padding
  padding: (size: keyof typeof spacing) => ({
    padding: getDynamicSpacing(size),
  }),

  // Margin
  margin: (size: keyof typeof spacing) => ({
    margin: getDynamicSpacing(size),
  }),

  // Font size
  fontSize: (size: keyof typeof typography.fontSize) => ({
    fontSize: getDynamicFontSize(size),
  }),

  // Font weight
  fontWeight: (weight: keyof typeof typography.fontWeight) => ({
    fontWeight: getDynamicFontWeight(weight),
  }),

  // Border radius
  borderRadius: (size: keyof typeof borderRadius) => ({
    borderRadius: getDynamicBorderRadius(size),
  }),

  // Box shadow
  boxShadow: (size: keyof typeof shadows) => ({
    boxShadow: getDynamicShadow(size),
  }),

  // Transition
  transition: (speed: keyof typeof transitions) => ({
    transition: getDynamicTransition(speed),
  }),
};

// ===== CSS VARIABLE HELPERS =====
export const cssVar = {
  // Get CSS variable value
  get: (name: string) => `var(--${name})`,
  
  // Set CSS variable
  set: (name: string, value: string) => {
    document.documentElement.style.setProperty(`--${name}`, value);
  },
  
  // Get color variable
  color: (color: string, shade: string = '500') => `var(--${color}-${shade})`,
  
  // Get spacing variable
  space: (size: keyof typeof spacing) => `var(--space-${size})`,
  
  // Get font size variable
  fontSize: (size: keyof typeof typography.fontSize) => `var(--font-size-${size})`,
  
  // Get font weight variable
  fontWeight: (weight: keyof typeof typography.fontWeight) => `var(--font-weight-${weight})`,
  
  // Get border radius variable
  radius: (size: keyof typeof borderRadius) => `var(--radius-${size})`,
  
  // Get shadow variable
  shadow: (size: keyof typeof shadows) => `var(--shadow-${size})`,
  
  // Get transition variable
  transition: (speed: keyof typeof transitions) => `var(--transition-${speed})`,
};

// ===== CLASS NAME GENERATORS =====
export const dynamicClasses = {
  // Background classes
  bg: (color: string, shade: string = '500') => `bg-${color}-${shade}`,
  
  // Text classes
  text: (color: string, shade: string = '500') => `text-${color}-${shade}`,
  
  // Border classes
  border: (color: string, shade: string = '500') => `border-${color}-${shade}`,
  
  // Spacing classes
  p: (size: keyof typeof spacing) => `p-${size}`,
  px: (size: keyof typeof spacing) => `px-${size}`,
  py: (size: keyof typeof spacing) => `py-${size}`,
  m: (size: keyof typeof spacing) => `m-${size}`,
  mx: (size: keyof typeof spacing) => `mx-${size}`,
  my: (size: keyof typeof spacing) => `my-${size}`,
  
  // Typography classes
  fontSize: (size: keyof typeof typography.fontSize) => `text-${size}`,
  fontWeight: (weight: keyof typeof typography.fontWeight) => `font-${weight}`,
  
  // Border radius classes
  rounded: (size: keyof typeof borderRadius) => `rounded-${size}`,
  
  // Shadow classes
  shadow: (size: keyof typeof shadows) => `shadow-${size}`,
  
  // Transition classes
  transition: (speed: keyof typeof transitions) => `transition-${speed}`,
};

// ===== COMMON STYLE COMBINATIONS =====
export const commonStyles = {
  // Button styles
  button: {
    primary: {
      backgroundColor: cssVar.color('primary', '600'),
      color: 'white',
      padding: `${cssVar.space('sm')} ${cssVar.space('md')}`,
      borderRadius: cssVar.radius('md'),
      fontWeight: cssVar.fontWeight('medium'),
      transition: cssVar.transition('fast'),
    },
    secondary: {
      backgroundColor: cssVar.color('gray', '100'),
      color: cssVar.color('gray', '900'),
      padding: `${cssVar.space('sm')} ${cssVar.space('md')}`,
      borderRadius: cssVar.radius('md'),
      fontWeight: cssVar.fontWeight('medium'),
      transition: cssVar.transition('fast'),
    },
  },

  // Card styles
  card: {
    default: {
      backgroundColor: 'white',
      border: `1px solid ${cssVar.color('gray', '200')}`,
      borderRadius: cssVar.radius('lg'),
      padding: cssVar.space('lg'),
      boxShadow: cssVar.shadow('sm'),
      transition: cssVar.transition('normal'),
    },
  },

  // Badge styles
  badge: {
    primary: {
      backgroundColor: cssVar.color('primary', '100'),
      color: cssVar.color('primary', '800'),
      padding: `${cssVar.space('xs')} ${cssVar.space('sm')}`,
      borderRadius: cssVar.radius('md'),
      fontSize: cssVar.fontSize('xs'),
      fontWeight: cssVar.fontWeight('medium'),
    },
    success: {
      backgroundColor: cssVar.color('success', '100'),
      color: cssVar.color('success', '800'),
      padding: `${cssVar.space('xs')} ${cssVar.space('sm')}`,
      borderRadius: cssVar.radius('md'),
      fontSize: cssVar.fontSize('xs'),
      fontWeight: cssVar.fontWeight('medium'),
    },
    warning: {
      backgroundColor: cssVar.color('warning', '100'),
      color: cssVar.color('warning', '800'),
      padding: `${cssVar.space('xs')} ${cssVar.space('sm')}`,
      borderRadius: cssVar.radius('md'),
      fontSize: cssVar.fontSize('xs'),
      fontWeight: cssVar.fontWeight('medium'),
    },
    error: {
      backgroundColor: cssVar.color('error', '100'),
      color: cssVar.color('error', '800'),
      padding: `${cssVar.space('xs')} ${cssVar.space('sm')}`,
      borderRadius: cssVar.radius('md'),
      fontSize: cssVar.fontSize('xs'),
      fontWeight: cssVar.fontWeight('medium'),
    },
  },
}; 