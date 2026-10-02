import React from 'react';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'subtle';
  className?: string;
}

/**
 * Surface represents a structural panel adhering to Single-Elevation Depth.
 * It uses a subtle 1px hairline border and muted surface background.
 * Avoids nested cards, excessive borders, or heavy drop shadows.
 */
export const Surface: React.FC<SurfaceProps> = ({
  children,
  padding = 'md',
  variant = 'default',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'bg-surface border border-subtle',
    elevated: 'bg-surface-elevated border border-strong',
    subtle: 'bg-surface-subtle border border-subtle',
  };

  return (
    <div
      className={`
        rounded-[10px] ${variantStyles[variant]} ${paddingStyles[padding]}
        transition-colors duration-150 ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  kicker,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-subtle ${className}`}>
      <div>
        {kicker && (
          <span className="block text-[11px] font-medium tracking-wider uppercase text-tertiary mb-1">
            {kicker}
          </span>
        )}
        <h2 className="text-lg md:text-xl font-semibold tracking-tight text-primary [text-wrap:balance]">
          {title}
        </h2>
        {description && (
          <p className="text-xs md:text-sm text-secondary mt-1 max-w-2xl [text-wrap:balance]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export interface StatDisplayProps {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  secondaryText?: string;
  className?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  value,
  delta,
  secondaryText,
  className = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xs font-medium text-tertiary tracking-wide mb-1.5 select-none">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-semibold tracking-tight text-primary tabular-nums">
          {value}
        </span>
        {delta && (
          <span
            className={`text-xs font-medium tabular-nums ${
              delta.trend === 'up'
                ? 'text-status-success'
                : delta.trend === 'down'
                ? 'text-status-warning'
                : 'text-tertiary'
            }`}
          >
            {delta.trend === 'up' ? '↑' : delta.trend === 'down' ? '↓' : '·'} {delta.value}
          </span>
        )}
      </div>
      {secondaryText && (
        <span className="text-xs text-secondary mt-1">{secondaryText}</span>
      )}
    </div>
  );
};

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <hr className={`border-0 h-px bg-border-subtle my-6 ${className}`} />;
};
