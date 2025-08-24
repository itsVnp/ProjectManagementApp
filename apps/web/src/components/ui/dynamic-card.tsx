import React from 'react';
import { cn } from '@/lib/utils';
import { getDynamicColor } from '@/styles/dynamic-utils';
import { colors, spacing, borderRadius, shadows } from '@/styles/tokens';

interface DynamicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: 'white',
          border: `1px solid ${getDynamicColor('gray', '200')}`,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.sm,
        };
      case 'elevated':
        return {
          backgroundColor: 'white',
          border: 'none',
          borderRadius: borderRadius.lg,
          boxShadow: shadows.lg,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          border: `2px solid ${getDynamicColor('gray', '300')}`,
          borderRadius: borderRadius.lg,
          boxShadow: 'none',
        };
      case 'filled':
        return {
          backgroundColor: getDynamicColor('gray', '50'),
          border: 'none',
          borderRadius: borderRadius.lg,
          boxShadow: 'none',
        };
      default:
        return {};
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return { padding: '0' };
      case 'sm':
        return { padding: spacing.sm };
      case 'md':
        return { padding: spacing.md };
      case 'lg':
        return { padding: spacing.lg };
      case 'xl':
        return { padding: spacing.xl };
      default:
        return { padding: spacing.md };
    }
  };

  const baseStyles = {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: variant === 'default' ? shadows.md : shadows.xl,
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...getVariantStyles(),
    ...getPaddingStyles(),
  };

  return (
    <div
      className={cn(
        'transition-all duration-200',
        className
      )}
      style={combinedStyles}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component
interface DynamicCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const DynamicCardHeader: React.FC<DynamicCardHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5',
        className
      )}
      style={{ paddingBottom: spacing.md }}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Title Component
interface DynamicCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export const DynamicCardTitle: React.FC<DynamicCardTitleProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className
      )}
      style={{ color: getDynamicColor('gray', '900') }}
      {...props}
    >
      {children}
    </h3>
  );
};

// Card Description Component
interface DynamicCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const DynamicCardDescription: React.FC<DynamicCardDescriptionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p
      className={cn(
        'text-sm',
        className
      )}
      style={{ color: getDynamicColor('gray', '600') }}
      {...props}
    >
      {children}
    </p>
  );
};

// Card Content Component
interface DynamicCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const DynamicCardContent: React.FC<DynamicCardContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'pt-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Footer Component
interface DynamicCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const DynamicCardFooter: React.FC<DynamicCardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center',
        className
      )}
      style={{ paddingTop: spacing.md }}
      {...props}
    >
      {children}
    </div>
  );
};

export default DynamicCard; 