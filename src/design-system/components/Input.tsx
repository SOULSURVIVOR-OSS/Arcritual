import React, { useId } from 'react';
import { Search, X } from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixAffordance?: React.ReactNode;
  containerClassName?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      hint,
      error,
      prefixIcon,
      suffixAffordance,
      id,
      className = '',
      containerClassName = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-primary select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-tertiary">
              {prefixIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={`
              w-full h-9 bg-surface text-primary text-sm rounded-[7px] border transition-colors duration-150 ease-out
              placeholder:text-tertiary
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
              disabled:opacity-50 disabled:bg-surface-subtle disabled:cursor-not-allowed
              ${prefixIcon ? 'pl-9' : 'pl-3'}
              ${suffixAffordance ? 'pr-9' : 'pr-3'}
              ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500' : 'border-subtle hover:border-strong'}
              ${className}
            `}
            {...props}
          />
          {suffixAffordance && (
            <div className="absolute right-3 flex items-center text-tertiary">
              {suffixAffordance}
            </div>
          )}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="text-xs text-red-500 font-normal">
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={`${inputId}-hint`} className="text-xs text-tertiary font-normal">
            {hint}
          </span>
        )}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';

export interface SearchInputProps extends Omit<TextInputProps, 'prefixIcon' | 'suffixAffordance'> {
  onClear?: () => void;
  showShortcut?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  showShortcut = true,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  const hasValue = Boolean(value && String(value).length > 0);

  return (
    <TextInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      prefixIcon={<Search className="w-4 h-4" />}
      suffixAffordance={
        hasValue && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="hover:text-primary transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : showShortcut ? (
          <span className="hidden sm:inline-flex items-center text-[10px] font-mono border border-subtle bg-surface-subtle px-1.5 py-0.5 rounded text-tertiary">
            ⌘K
          </span>
        ) : null
      }
      className={className}
      {...props}
    />
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className = '', containerClassName = '', ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={textareaId} className="text-xs font-medium text-primary select-none">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`
            w-full min-h-[90px] p-3 bg-surface text-primary text-sm rounded-[7px] border transition-colors duration-150 ease-out
            placeholder:text-tertiary
            focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
            disabled:opacity-50 disabled:bg-surface-subtle disabled:cursor-not-allowed
            ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500' : 'border-subtle hover:border-strong'}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
        {!error && hint && <span className="text-xs text-tertiary">{hint}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
  className = '',
}) => {
  const generatedId = useId();
  const toggleId = id || generatedId;

  return (
    <div className={`flex items-start justify-between gap-4 select-none ${className}`}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={toggleId}
              className={`text-sm font-medium ${disabled ? 'text-tertiary' : 'text-primary'} cursor-pointer`}
            >
              {label}
            </label>
          )}
          {description && <span className="text-xs text-tertiary mt-0.5">{description}</span>}
        </div>
      )}
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent
          transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          ${checked ? 'bg-accent' : 'bg-surface-subtle border-subtle'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-4 bg-accent-foreground' : 'translate-x-0.5 bg-secondary'}
          `}
        />
      </button>
    </div>
  );
};

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  hint,
  id,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-primary select-none">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`
            w-full h-9 pl-3 pr-8 bg-surface text-primary text-sm rounded-[7px] border appearance-none transition-colors duration-150 ease-out
            focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
            disabled:opacity-50 disabled:bg-surface-subtle disabled:cursor-not-allowed
            ${error ? 'border-red-500/60' : 'border-subtle hover:border-strong'}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-primary">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-tertiary">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {!error && hint && <span className="text-xs text-tertiary">{hint}</span>}
    </div>
  );
};
