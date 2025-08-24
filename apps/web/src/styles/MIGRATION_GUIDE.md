# Migration Guide: From Hardcoded to Dynamic Styling

This guide helps you migrate from hardcoded values to the new dynamic styling system.

## 🎯 **What's Now Dynamic**

### ✅ **Already Dynamic:**
- CSS Variables: `var(--primary-600)`, `var(--space-lg)`, etc.
- Design Tokens: `colors.primary[600]`, `spacing.lg`, etc.
- Theme System: `useTheme()` hook
- Dynamic Classes: `bg-primary-600`, `text-gray-900`, etc.

### ❌ **Still Need Migration:**
- Hardcoded Tailwind: `bg-blue-500`, `text-gray-900`
- Inline styles: `style={{ color: '#3b82f6' }}`
- Hex colors: `#3b82f6`, `#6b7280`

## 🚀 **Migration Examples**

### **1. Replace Hardcoded Colors**

#### Before (Hardcoded):
```tsx
// Tailwind classes
<div className="bg-blue-500 text-white">Content</div>
<div className="text-gray-900 bg-gray-100">Content</div>

// Inline styles
<div style={{ color: '#3b82f6', backgroundColor: '#f3f4f6' }}>Content</div>

// Hex colors
const color = '#3b82f6';
```

#### After (Dynamic):
```tsx
// Using dynamic classes
<div className="bg-primary-500 text-white">Content</div>
<div className="text-gray-900 bg-gray-100">Content</div>

// Using CSS variables
<div style={{ color: 'var(--primary-500)', backgroundColor: 'var(--gray-100)' }}>Content</div>

// Using design tokens
import { colors } from '@/styles/tokens';
const color = colors.primary[500];

// Using utility functions
import { getDynamicColor } from '@/styles/dynamic-utils';
const color = getDynamicColor('primary', '500');
```

### **2. Replace Hardcoded Spacing**

#### Before:
```tsx
<div className="p-4 m-2">Content</div>
<div style={{ padding: '16px', margin: '8px' }}>Content</div>
```

#### After:
```tsx
<div className="p-md m-sm">Content</div>
<div style={{ padding: 'var(--space-md)', margin: 'var(--space-sm)' }}>Content</div>

// Using design tokens
import { spacing } from '@/styles/tokens';
<div style={{ padding: spacing.md, margin: spacing.sm }}>Content</div>
```

### **3. Replace Status Colors**

#### Before:
```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-500'
    case 'IN_PROGRESS':
      return 'bg-blue-500'
    default:
      return 'bg-slate-400'
  }
}
```

#### After:
```tsx
import { getStatusColor } from '@/styles/dynamic-utils';

const getStatusColor = (status: string) => {
  return getStatusColor(status).bg;
}

// Or use directly
<div className={getStatusColor('COMPLETED').bg}>Completed</div>
```

### **4. Replace Typography**

#### Before:
```tsx
<h1 className="text-2xl font-bold">Title</h1>
<p style={{ fontSize: '16px', fontWeight: 500 }}>Text</p>
```

#### After:
```tsx
<h1 className="text-2xl font-bold">Title</h1>
<p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>Text</p>

// Using design tokens
import { typography } from '@/styles/tokens';
<p style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium }}>Text</p>
```

## 📋 **Migration Checklist**

### **Phase 1: Colors**
- [ ] Replace `bg-blue-500` → `bg-primary-500`
- [ ] Replace `text-gray-900` → `text-gray-900` (already dynamic)
- [ ] Replace `border-gray-200` → `border-gray-200` (already dynamic)
- [ ] Replace `#3b82f6` → `var(--primary-500)` or `colors.primary[500]`
- [ ] Replace `#6b7280` → `var(--gray-500)` or `colors.gray[500]`

### **Phase 2: Spacing**
- [ ] Replace `p-4` → `p-md`
- [ ] Replace `m-2` → `m-sm`
- [ ] Replace `px-6` → `px-lg`
- [ ] Replace `py-8` → `py-xl`

### **Phase 3: Typography**
- [ ] Replace `text-sm` → `text-sm` (already dynamic)
- [ ] Replace `font-bold` → `font-bold` (already dynamic)
- [ ] Replace `text-2xl` → `text-2xl` (already dynamic)

### **Phase 4: Status & Priority Colors**
- [ ] Replace status color functions with `getStatusColor()`
- [ ] Replace priority color functions with `getPriorityColor()`
- [ ] Replace role color functions with `getRoleColor()`

### **Phase 5: Components**
- [ ] Update Button components
- [ ] Update Card components
- [ ] Update Badge components
- [ ] Update Form components

## 🔧 **Migration Tools**

### **1. Search & Replace Patterns**

```bash
# Colors
bg-blue-500 → bg-primary-500
bg-emerald-500 → bg-success-500
bg-red-500 → bg-error-500
bg-yellow-500 → bg-warning-500

# Hex colors
#3b82f6 → var(--primary-500)
#6b7280 → var(--gray-500)
#ef4444 → var(--error-500)
#22c55e → var(--success-500)
```

### **2. Import Statements**

Add to files that need dynamic utilities:
```tsx
import { getStatusColor, getPriorityColor, getDynamicColor } from '@/styles/dynamic-utils';
import { colors, spacing, typography } from '@/styles/tokens';
```

### **3. CSS Variable Usage**

```css
/* Instead of hardcoded values */
.my-component {
  color: #3b82f6;
  padding: 16px;
  border-radius: 8px;
}

/* Use CSS variables */
.my-component {
  color: var(--primary-500);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
}
```

## 📁 **File-by-File Migration**

### **Priority Files to Migrate:**

1. **`DashboardPage.tsx`** - High priority
   - Status colors
   - Stat cards
   - Task cards

2. **`LandingPage.tsx`** - High priority
   - Hero section colors
   - Feature cards
   - Pricing cards

3. **`ProjectsPage.tsx`** - Medium priority
   - Project cards
   - Status indicators

4. **`TasksPage.tsx`** - Medium priority
   - Task cards
   - Priority colors

5. **`TeamPage.tsx`** - Medium priority
   - Member cards
   - Role colors

6. **`CalendarPage.tsx`** - Low priority
   - Event colors
   - Calendar styling

## 🎨 **Theme Switching**

### **Enable Dynamic Theme Switching:**

```tsx
import { useTheme, applyTheme, themes } from '@/styles/theme';

const ThemeToggle = () => {
  const theme = useTheme();
  
  const toggleTheme = () => {
    const newTheme = theme.mode === 'light' ? themes.dark : themes.light;
    applyTheme(newTheme);
  };
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme.mode === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};
```

## ✅ **Verification**

### **Check if Migration is Complete:**

1. **Search for hardcoded values:**
   ```bash
   grep -r "#[0-9a-fA-F]\{6\}" src/
   grep -r "bg-blue-" src/
   grep -r "text-gray-" src/
   ```

2. **Test theme switching:**
   - Verify colors change when switching themes
   - Check that all components respond to theme changes

3. **Check browser dev tools:**
   - Inspect elements to see CSS variables being used
   - Verify no hardcoded colors in computed styles

## 🚨 **Common Issues**

### **1. Tailwind Override Issues**
If Tailwind classes aren't being overridden:
```css
/* Add to your CSS */
@layer utilities {
  .bg-primary-500 { background-color: var(--primary-500) !important; }
  .text-primary-500 { color: var(--primary-500) !important; }
}
```

### **2. CSS Variable Not Found**
If CSS variables aren't working:
- Check that `globals.css` is imported
- Verify variable names match exactly
- Check browser support for CSS variables

### **3. TypeScript Errors**
If you get TypeScript errors:
- Import types from design tokens
- Use proper type annotations
- Check that all required properties are provided

## 🎯 **Benefits After Migration**

✅ **Consistent Design**: All colors, spacing, and typography are centralized
✅ **Easy Theming**: Switch between light/dark themes instantly
✅ **Maintainable**: Change design tokens in one place
✅ **Type Safe**: Full TypeScript support for all design values
✅ **Performance**: CSS variables for dynamic theming
✅ **Accessibility**: Consistent color contrast and spacing

## 📞 **Need Help?**

If you encounter issues during migration:
1. Check the browser console for errors
2. Verify CSS variable names match
3. Ensure imports are correct
4. Test with the theme switching functionality 