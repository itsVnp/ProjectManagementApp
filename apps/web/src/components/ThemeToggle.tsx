import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme, applyTheme, themes } from '@/styles/theme';
import { getDynamicColor } from '@/styles/dynamic-utils';
import DynamicButton from '@/components/ui/dynamic-button';

const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  
  const toggleTheme = () => {
    const newTheme = theme.mode === 'light' ? themes.dark : themes.light;
    applyTheme(newTheme);
  };
  
  return (
    <DynamicButton
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0"
      style={{
        color: getDynamicColor('gray', '600'),
        '&:hover': {
          backgroundColor: getDynamicColor('gray', '100'),
        }
      }}
    >
      {theme.mode === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </DynamicButton>
  );
};

export default ThemeToggle; 