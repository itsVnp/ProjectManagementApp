import React from 'react';
import { cn } from '@/lib/utils';
import { getDynamicColor } from '@/styles/dynamic-utils';
import { colors } from '@/styles/tokens';

interface DynamicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const DynamicButton = React.forwardRef<HTMLButtonElement, DynamicButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: getDynamicColor('primary', '600'),
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: getDynamicColor('primary', '700'),
          },
        };
      case 'secondary':
        return {
          backgroundColor: getDynamicColor('gray', '100'),
          color: getDynamicColor('gray', '900'),
          border: 'none',
          '&:hover': {
            backgroundColor: getDynamicColor('gray', '200'),
          },
        };
      case 'success':
        return {
          backgroundColor: getDynamicColor('success', '600'),
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: getDynamicColor('success', '700'),
          },
        };
      case 'warning':
        return {
          backgroundColor: getDynamicColor('warning', '600'),
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: getDynamicColor('warning', '700'),
          },
        };
      case 'error':
        return {
          backgroundColor: getDynamicColor('error', '600'),
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: getDynamicColor('error', '700'),
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: getDynamicColor('primary', '600'),
          border: `1px solid ${getDynamicColor('primary', '600')}`,
          '&:hover': {
            backgroundColor: getDynamicColor('primary', '50'),
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: getDynamicColor('gray', '600'),
          border: 'none',
          '&:hover': {
            backgroundColor: getDynamicColor('gray', '100'),
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          borderRadius: '0.375rem',
        };
      case 'md':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '0.5rem',
        };
      case 'lg':
        return {
          padding: '1rem 2rem',
          fontSize: '1.125rem',
          borderRadius: '0.5rem',
        };
      default:
        return {};
    }
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    '&:focus': {
      outline: `2px solid ${getDynamicColor('primary', '500')}`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...getVariantStyles(),
    ...getSizeStyles(),
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      style={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
});

DynamicButton.displayName = 'DynamicButton';

export default DynamicButton; 