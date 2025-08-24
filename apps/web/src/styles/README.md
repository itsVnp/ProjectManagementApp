# Global Styling System

This directory contains the global styling system for the Claro application, including design tokens, CSS variables, and theme management.

## 📁 File Structure

```
src/styles/
├── globals.css          # Global CSS with CSS variables and base styles
├── tokens.ts            # TypeScript design tokens
├── theme.ts             # Theme context and utilities
└── README.md           # This documentation
```

## 🎨 Design Tokens

### Colors
- **Primary**: Blue color palette (50-950)
- **Gray**: Neutral color palette (50-950)
- **Semantic**: Success, Warning, Error, Info colors

### Spacing
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)
- **4xl**: 6rem (96px)

### Typography
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- **Line Heights**: tight, snug, normal, relaxed, loose
- **Font Weights**: light, normal, medium, semibold, bold, extrabold

### Border Radius
- **none**: 0
- **sm**: 0.125rem (2px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **3xl**: 1.5rem (24px)
- **full**: 9999px

### Shadows
- **sm**: Subtle shadow
- **md**: Medium shadow
- **lg**: Large shadow
- **xl**: Extra large shadow
- **2xl**: Maximum shadow

## 🚀 Usage

### Using CSS Variables

```css
.my-component {
  color: var(--primary-600);
  background-color: var(--gray-50);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}
```

### Using TypeScript Tokens

```typescript
import { colors, spacing, typography } from '@/styles/tokens';

const styles = {
  color: colors.primary[600],
  padding: spacing.lg,
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold,
};
```

### Using Theme Hook

```typescript
import { useTheme } from '@/styles/theme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <div style={{ 
      color: theme.colors.primary[600],
      padding: theme.spacing.lg 
    }}>
      Content
    </div>
  );
};
```

### Using Utility Functions

```typescript
import { getColor, getSpacing, getTypography } from '@/styles/tokens';

const styles = {
  color: getColor('primary', '600'),
  padding: getSpacing('lg'),
  fontSize: getTypography('lg'),
};
```

## 🎯 CSS Classes

### Utility Classes

```css
/* Screen reader only */
.sr-only

/* Text gradient */
.text-gradient

/* Glass effect */
.glass-effect

/* Animations */
.animate-fade-in
.animate-slide-in
.animate-pulse
```

### Typography Classes

The global CSS includes base typography styles for headings (h1-h6) and paragraphs.

## 🌙 Theme System

### Light Theme (Default)
- Clean, modern design
- High contrast
- Professional appearance

### Dark Theme
- Inverted color scheme
- Reduced eye strain
- Modern aesthetic

### Switching Themes

```typescript
import { applyTheme, themes } from '@/styles/theme';

// Apply light theme
applyTheme(themes.light);

// Apply dark theme
applyTheme(themes.dark);
```

## 📱 Responsive Design

The system includes responsive breakpoints:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Responsive Typography

```css
@media (max-width: 640px) {
  :root {
    --font-size-4xl: 2rem;
    --font-size-3xl: 1.75rem;
    --font-size-2xl: 1.375rem;
  }
}
```

## 🎨 Customization

### Adding New Colors

1. Add to `tokens.ts`:
```typescript
export const colors = {
  // ... existing colors
  brand: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    900: '#0c4a6e',
  },
};
```

2. Add to `globals.css`:
```css
:root {
  /* ... existing variables */
  --brand-50: #f0f9ff;
  --brand-500: #0ea5e9;
  --brand-900: #0c4a6e;
}
```

### Adding New Spacing

```typescript
export const spacing = {
  // ... existing spacing
  '5xl': '8rem',    // 128px
  '6xl': '12rem',   // 192px
};
```

## 🔧 Best Practices

1. **Use CSS Variables**: Prefer CSS variables for styling components
2. **Consistent Spacing**: Always use the predefined spacing tokens
3. **Semantic Colors**: Use semantic color names (success, error, warning)
4. **Responsive Design**: Use the provided breakpoints
5. **Accessibility**: Ensure sufficient color contrast
6. **Performance**: Use CSS variables for dynamic theming

## 📚 Examples

### Button Component

```typescript
import { colors, spacing, borderRadius } from '@/styles/tokens';

const buttonStyles = {
  backgroundColor: colors.primary[600],
  color: 'white',
  padding: `${spacing.sm} ${spacing.md}`,
  borderRadius: borderRadius.md,
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  
  '&:hover': {
    backgroundColor: colors.primary[700],
  },
};
```

### Card Component

```css
.card {
  background-color: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
}
```

## 🐛 Troubleshooting

### CSS Variables Not Working
- Ensure `globals.css` is imported in `index.css`
- Check that variables are defined in `:root`
- Verify the variable name spelling

### TypeScript Errors
- Import tokens from the correct path
- Use the correct type annotations
- Check that all required properties are provided

### Theme Not Applying
- Ensure `ThemeProvider` wraps your app
- Check that `applyTheme` is called correctly
- Verify theme object structure

## 📖 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Design Tokens](https://www.designtokens.org/) 