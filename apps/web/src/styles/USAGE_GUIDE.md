# Dynamic Styling System - Usage Guide

This guide shows you how to use the new dynamic styling system in your components.

## 🎯 **Quick Start**

### **1. Using Dynamic Components**

```tsx
import DynamicButton from '@/components/ui/dynamic-button';
import DynamicCard, { DynamicCardHeader, DynamicCardTitle, DynamicCardContent } from '@/components/ui/dynamic-card';
import DynamicBadge from '@/components/ui/dynamic-badge';

// Dynamic Button
<DynamicButton variant="primary" size="lg" onClick={handleClick}>
  Click Me
</DynamicButton>

// Dynamic Card
<DynamicCard variant="elevated" padding="lg">
  <DynamicCardHeader>
    <DynamicCardTitle>Card Title</DynamicCardTitle>
  </DynamicCardHeader>
  <DynamicCardContent>
    Card content goes here
  </DynamicCardContent>
</DynamicCard>

// Dynamic Badge
<DynamicBadge variant="success" size="md">
  Success
</DynamicBadge>
```

### **2. Using Design Tokens**

```tsx
import { colors, spacing, typography } from '@/styles/tokens';
import { getDynamicColor, getStatusColor } from '@/styles/dynamic-utils';

// Direct token usage
const styles = {
  backgroundColor: colors.primary[600],
  padding: spacing.lg,
  fontSize: typography.fontSize.lg,
};

// Utility functions
const primaryColor = getDynamicColor('primary', '600');
const statusColors = getStatusColor('COMPLETED'); // { bg: 'bg-success-500', text: 'text-success-500' }
```

### **3. Using CSS Variables**

```tsx
// In your component styles
const componentStyles = {
  backgroundColor: 'var(--primary-600)',
  color: 'var(--gray-900)',
  padding: 'var(--space-lg)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
};
```

## 🎨 **Component Variants**

### **DynamicButton Variants**

```tsx
// All available variants
<DynamicButton variant="primary">Primary</DynamicButton>
<DynamicButton variant="secondary">Secondary</DynamicButton>
<DynamicButton variant="success">Success</DynamicButton>
<DynamicButton variant="warning">Warning</DynamicButton>
<DynamicButton variant="error">Error</DynamicButton>
<DynamicButton variant="outline">Outline</DynamicButton>
<DynamicButton variant="ghost">Ghost</DynamicButton>

// All available sizes
<DynamicButton size="sm">Small</DynamicButton>
<DynamicButton size="md">Medium</DynamicButton>
<DynamicButton size="lg">Large</DynamicButton>
```

### **DynamicCard Variants**

```tsx
// All available variants
<DynamicCard variant="default">Default Card</DynamicCard>
<DynamicCard variant="elevated">Elevated Card</DynamicCard>
<DynamicCard variant="outlined">Outlined Card</DynamicCard>
<DynamicCard variant="filled">Filled Card</DynamicCard>

// All available padding sizes
<DynamicCard padding="none">No Padding</DynamicCard>
<DynamicCard padding="sm">Small Padding</DynamicCard>
<DynamicCard padding="md">Medium Padding</DynamicCard>
<DynamicCard padding="lg">Large Padding</DynamicCard>
<DynamicCard padding="xl">Extra Large Padding</DynamicCard>
```

### **DynamicBadge Variants**

```tsx
// All available variants
<DynamicBadge variant="primary">Primary</DynamicBadge>
<DynamicBadge variant="secondary">Secondary</DynamicBadge>
<DynamicBadge variant="success">Success</DynamicBadge>
<DynamicBadge variant="warning">Warning</DynamicBadge>
<DynamicBadge variant="error">Error</DynamicBadge>
<DynamicBadge variant="info">Info</DynamicBadge>
<DynamicBadge variant="outline">Outline</DynamicBadge>

// All available sizes
<DynamicBadge size="sm">Small</DynamicBadge>
<DynamicBadge size="md">Medium</DynamicBadge>
<DynamicBadge size="lg">Large</DynamicBadge>
```

## 🎯 **Status & Priority Colors**

### **Using Status Colors**

```tsx
import { getStatusColor, getPriorityColor, getRoleColor } from '@/styles/dynamic-utils';

// Task/Project Status
const taskStatus = getStatusColor('COMPLETED'); // { bg: 'bg-success-500', text: 'text-success-500' }
const projectStatus = getStatusColor('ACTIVE'); // { bg: 'bg-success-500', text: 'text-success-500' }

// Priority Colors
const urgentColor = getPriorityColor('URGENT'); // Returns hex color
const highColor = getPriorityColor('HIGH'); // Returns hex color

// Role Colors
const adminRole = getRoleColor('admin'); // { bg: 'bg-error-100', text: 'text-error-800' }
const developerRole = getRoleColor('developer'); // { bg: 'bg-success-100', text: 'text-success-800' }
```

### **Example Usage**

```tsx
const TaskCard = ({ task }) => {
  const statusColors = getStatusColor(task.status);
  
  return (
    <div className="task-card">
      <div 
        className="status-indicator"
        style={{ backgroundColor: getDynamicColor('success', '500') }}
      />
      <span className={statusColors.text}>{task.status}</span>
    </div>
  );
};
```

## 🌙 **Theme Switching**

### **Using Theme Toggle**

```tsx
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
};
```

### **Manual Theme Switching**

```tsx
import { useTheme, applyTheme, themes } from '@/styles/theme';

const ThemeSwitcher = () => {
  const theme = useTheme();
  
  const switchToLight = () => applyTheme(themes.light);
  const switchToDark = () => applyTheme(themes.dark);
  
  return (
    <div>
      <button onClick={switchToLight}>Light Mode</button>
      <button onClick={switchToDark}>Dark Mode</button>
    </div>
  );
};
```

## 📐 **Spacing & Typography**

### **Using Spacing Tokens**

```tsx
import { spacing } from '@/styles/tokens';

const styles = {
  margin: spacing.lg,
  padding: `${spacing.sm} ${spacing.md}`,
  gap: spacing.xl,
};
```

### **Using Typography Tokens**

```tsx
import { typography } from '@/styles/tokens';

const styles = {
  fontSize: typography.fontSize.xl,
  fontWeight: typography.fontWeight.bold,
  lineHeight: typography.lineHeight.relaxed,
};
```

## 🎨 **Color System**

### **Available Color Palettes**

```tsx
import { colors } from '@/styles/tokens';

// Primary Colors (Blue)
colors.primary[50]   // Lightest
colors.primary[100]  // Very Light
colors.primary[500]  // Base
colors.primary[600]  // Primary
colors.primary[900]  // Darkest

// Gray Colors (Neutral)
colors.gray[50]      // Background
colors.gray[100]     // Light Background
colors.gray[500]     // Medium Text
colors.gray[900]     // Dark Text

// Semantic Colors
colors.success[500]  // Success
colors.warning[500]  // Warning
colors.error[500]    // Error
colors.info[500]     // Info
```

### **Color Usage Examples**

```tsx
// Background colors
const bgStyles = {
  backgroundColor: colors.primary[50],    // Light background
  backgroundColor: colors.success[100],   // Success background
  backgroundColor: colors.error[50],      // Error background
};

// Text colors
const textStyles = {
  color: colors.gray[900],               // Primary text
  color: colors.gray[600],               // Secondary text
  color: colors.primary[600],            // Link text
  color: colors.success[700],            // Success text
};
```

## 🔧 **Utility Functions**

### **Dynamic Color Helper**

```tsx
import { getDynamicColor } from '@/styles/dynamic-utils';

// Get any color with shade
const primaryColor = getDynamicColor('primary', '600');
const successColor = getDynamicColor('success', '500');
const grayColor = getDynamicColor('gray', '100');
```

### **CSS Variable Helper**

```tsx
import { cssVar } from '@/styles/dynamic-utils';

// Get CSS variable values
const primaryColor = cssVar.color('primary', '600');
const spacingValue = cssVar.space('lg');
const fontSize = cssVar.fontSize('xl');

// Set CSS variables dynamically
cssVar.set('custom-color', '#ff0000');
```

### **Style Object Generators**

```tsx
import { createDynamicStyles } from '@/styles/dynamic-utils';

const styles = {
  ...createDynamicStyles.bg('primary', '600'),
  ...createDynamicStyles.text('white'),
  ...createDynamicStyles.padding('lg'),
  ...createDynamicStyles.borderRadius('md'),
  ...createDynamicStyles.boxShadow('lg'),
};
```

## 📱 **Responsive Design**

### **Using Responsive Classes**

```tsx
// The dynamic classes include responsive variants
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="p-2 md:p-4 lg:p-6">
  Responsive padding
</div>
```

### **Custom Responsive Styles**

```tsx
const responsiveStyles = {
  fontSize: 'var(--font-size-sm)',
  '@media (min-width: 768px)': {
    fontSize: 'var(--font-size-base)',
  },
  '@media (min-width: 1024px)': {
    fontSize: 'var(--font-size-lg)',
  },
};
```

## 🎯 **Best Practices**

### **1. Use Dynamic Components**

✅ **Good:**
```tsx
<DynamicButton variant="primary" size="lg">
  Submit
</DynamicButton>
```

❌ **Avoid:**
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Submit
</button>
```

### **2. Use Design Tokens**

✅ **Good:**
```tsx
const styles = {
  backgroundColor: colors.primary[600],
  padding: spacing.lg,
};
```

❌ **Avoid:**
```tsx
const styles = {
  backgroundColor: '#3b82f6',
  padding: '24px',
};
```

### **3. Use Utility Functions**

✅ **Good:**
```tsx
const statusColors = getStatusColor('COMPLETED');
<div className={statusColors.bg}>Completed</div>
```

❌ **Avoid:**
```tsx
const getStatusColor = (status) => {
  if (status === 'COMPLETED') return 'bg-green-500';
  // ... more hardcoded values
};
```

### **4. Use CSS Variables for Dynamic Values**

✅ **Good:**
```tsx
const styles = {
  color: 'var(--primary-600)',
  backgroundColor: 'var(--gray-50)',
};
```

❌ **Avoid:**
```tsx
const styles = {
  color: '#3b82f6',
  backgroundColor: '#f9fafb',
};
```

## 🚀 **Migration Checklist**

- [ ] Replace hardcoded colors with design tokens
- [ ] Replace hardcoded spacing with spacing tokens
- [ ] Replace hardcoded typography with typography tokens
- [ ] Use DynamicButton instead of regular buttons
- [ ] Use DynamicCard instead of regular cards
- [ ] Use DynamicBadge instead of regular badges
- [ ] Implement theme switching
- [ ] Test all components in both light and dark modes
- [ ] Verify responsive behavior
- [ ] Check accessibility (color contrast, focus states)

## 📚 **Additional Resources**

- [Design Tokens Documentation](./README.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Theme System Documentation](./theme.ts)
- [Dynamic Utilities Documentation](./dynamic-utils.ts) 