import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface ProgressProps {
  value: number; // 0 to 100
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  label,
  showValue = true,
  size = 'md',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-secondary">{label}</span>}
          {showValue && (
            <span className="font-mono tabular-nums text-tertiary ml-auto">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
        className={`
          w-full bg-surface-subtle overflow-hidden rounded-full border border-subtle
          ${size === 'sm' ? 'h-1.5' : 'h-2'}
        `}
      >
        <div
          className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export interface RingProgressProps {
  value: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  label?: string;
  centerContent?: React.ReactNode;
  className?: string;
}

export const RingProgress: React.FC<RingProgressProps> = ({
  value,
  size = 72,
  strokeWidth = 5,
  label,
  centerContent,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-surface-subtle"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-accent transition-all duration-300 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-primary">
          {centerContent !== undefined ? centerContent : `${Math.round(clamped)}%`}
        </div>
      </div>
      {label && <span className="text-[11px] text-tertiary select-none">{label}</span>}
    </div>
  );
};

export type StatusType = 'online' | 'nominal' | 'warning' | 'alert' | 'idle';

export interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  className?: string;
}

/**
 * StatusIndicator obeys Anti-Slop:
 * Never convey critical state by color alone; always pair status color with explicit text label.
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className = '',
}) => {
  const statusConfig = {
    online: { dot: 'bg-emerald-500', text: 'text-secondary' },
    nominal: { dot: 'bg-emerald-500', text: 'text-secondary' },
    warning: { dot: 'bg-amber-500', text: 'text-amber-500' },
    alert: { dot: 'bg-red-500', text: 'text-red-500' },
    idle: { dot: 'bg-zinc-500', text: 'text-tertiary' },
  };

  const current = statusConfig[status] || statusConfig.idle;

  return (
    <div className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} aria-hidden="true" />
      <span className={`font-medium ${current.text}`}>{label}</span>
    </div>
  );
};

export interface AlertCalloutProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export const AlertCallout: React.FC<AlertCalloutProps> = ({
  type = 'info',
  title,
  message,
  action,
  onDismiss,
  className = '',
}) => {
  const typeConfig = {
    info: {
      icon: <Info className="w-4 h-4 text-secondary shrink-0" />,
      border: 'border-subtle',
      bg: 'bg-surface-subtle',
    },
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
      border: 'border-emerald-500/20',
      bg: 'bg-surface',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
      border: 'border-amber-500/20',
      bg: 'bg-surface',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
      border: 'border-red-500/20',
      bg: 'bg-surface',
    },
  };

  const { icon, border, bg } = typeConfig[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-[8px] border ${border} ${bg} text-xs text-primary transition-colors ${className}`}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold text-primary mb-0.5">{title}</div>}
        <div className="text-secondary leading-relaxed">{message}</div>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-xs font-semibold text-primary underline underline-offset-2 hover:opacity-80 cursor-pointer"
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-tertiary hover:text-primary transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
};
