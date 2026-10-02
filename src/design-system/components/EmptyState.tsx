import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    prefixIcon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center p-8 sm:p-12
        border border-dashed border-subtle rounded-[10px] bg-surface/40
        ${className}
      `}
    >
      {icon && (
        <div className="w-10 h-10 rounded-[8px] bg-surface-subtle border border-subtle flex items-center justify-center text-tertiary mb-3.5">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold tracking-tight text-primary [text-wrap:balance]">
        {title}
      </h3>
      <p className="text-xs text-secondary mt-1 max-w-sm leading-relaxed [text-wrap:balance]">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2.5 mt-5">
          {primaryAction && (
            <Button
              variant="primary"
              size="sm"
              prefixIcon={primaryAction.prefixIcon}
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
