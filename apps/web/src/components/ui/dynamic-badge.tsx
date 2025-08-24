import React from 'react';
import { cn } from '@/lib/utils';
import { getDynamicColor } from '@/styles/dynamic-utils';
import { colors, spacing, borderRadius, typography } from '@/styles/tokens';

interface DynamicBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const DynamicBadge: React.FC<DynamicBadgeProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: getDynamicColor('primary', '100'),
          color: getDynamicColor('primary', '800'),
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: getDynamicColor('gray', '100'),
          color: getDynamicColor('gray', '800'),
          border: 'none',
        };
      case 'success':
        return {
          backgroundColor: getDynamicColor('success', '100'),
          color: getDynamicColor('success', '800'),
          border: 'none',
        };
      case 'warning':
        return {
          backgroundColor: getDynamicColor('warning', '100'),
          color: getDynamicColor('warning', '800'),
          border: 'none',
        };
      case 'error':
        return {
          backgroundColor: getDynamicColor('error', '100'),
          color: getDynamicColor('error', '800'),
          border: 'none',
        };
      case 'info':
        return {
          backgroundColor: getDynamicColor('info', '100'),
          color: getDynamicColor('info', '800'),
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: getDynamicColor('gray', '700'),
          border: `1px solid ${getDynamicColor('gray', '300')}`,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${spacing.xs} ${spacing.sm}`,
          fontSize: typography.fontSize.xs,
          borderRadius: borderRadius.sm,
        };
      case 'md':
        return {
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: typography.fontSize.sm,
          borderRadius: borderRadius.md,
        };
      case 'lg':
        return {
          padding: `${spacing.md} ${spacing.lg}`,
          fontSize: typography.fontSize.base,
          borderRadius: borderRadius.lg,
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
    whiteSpace: 'nowrap',
    '&:hover': {
      opacity: 0.8,
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...getVariantStyles(),
    ...getSizeStyles(),
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 whitespace-nowrap',
        className
      )}
      style={combinedStyles}
      {...props}
    >
      {children}
    </div>
  );
};

export default DynamicBadge; 