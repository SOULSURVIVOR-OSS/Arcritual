import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export interface TopBarProps {
  brandName?: string;
  navItems?: { label: string; href?: string; onClick?: () => void; active?: boolean }[];
  primaryAction?: { label: string; onClick: () => void };
  extraAction?: React.ReactNode;
  className?: string;
}

/**
 * TopBar implements the Top Bar Contract:
 * [Brand title, one line] — [4–6 nav links, 1–2 word labels, single-line] — [1–2 primary actions]
 * No taglines, descriptors, status tickers, or secondary rows.
 */
export const TopBar: React.FC<TopBarProps> = ({
  brandName = 'Kanso',
  navItems = [],
  primaryAction,
  extraAction,
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`
        sticky top-0 z-40 w-full h-14 bg-canvas/90 backdrop-blur-md border-b border-subtle
        flex items-center justify-between px-6 transition-colors duration-200
        ${className}
      `}
    >
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center shrink-0">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-base font-semibold tracking-tight text-primary hover:opacity-80 transition-opacity select-none cursor-pointer"
        >
          {brandName}
        </a>
      </div>

      {/* Zone 2: 4-6 clean text navigation links (single line, no pills) */}
      {navItems.length > 0 && (
        <nav
          className="hidden md:flex items-center gap-7 text-sm"
          aria-label="Main Navigation"
        >
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className={`
                relative py-1 text-xs font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer
                ${
                  item.active
                    ? 'text-primary'
                    : 'text-secondary hover:text-primary'
                }
              `}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </nav>
      )}

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {extraAction}

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 text-secondary hover:text-primary hover:bg-surface-elevated rounded-[6px] transition-colors cursor-pointer"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-tertiary hover:text-primary transition-colors" />
          ) : (
            <Moon className="w-4 h-4 text-tertiary hover:text-primary transition-colors" />
          )}
        </button>

        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className="h-8 px-3.5 text-xs font-medium bg-accent text-accent-foreground rounded-[6px] hover:opacity-90 active:opacity-100 transition-opacity whitespace-nowrap cursor-pointer"
          >
            {primaryAction.label}
          </button>
        )}
      </div>
    </header>
  );
};

export interface SegmentedControlItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * SegmentedControl for interactive filter tabs or section switching:
 * Functional button elements with active/inactive visual states, clean segmented layout.
 */
export function SegmentedControl<T extends string = string>({
  items,
  value,
  onChange,
  className = '',
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={`
        inline-flex items-center p-0.5 bg-surface-subtle border border-subtle rounded-[7px]
        ${className}
      `}
    >
      {items.map((item) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`
              inline-flex items-center gap-1.5 font-medium rounded-[5px] transition-all duration-150 whitespace-nowrap cursor-pointer select-none
              ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'}
              ${
                isActive
                  ? 'bg-surface text-primary shadow-xs border border-subtle'
                  : 'text-secondary hover:text-primary border border-transparent'
              }
            `}
          >
            <span>{item.label}</span>
            {typeof item.count === 'number' && (
              <span className={`text-[10px] tabular-nums ${isActive ? 'text-secondary' : 'text-tertiary'}`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  current?: boolean;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[]; className?: string }> = ({
  items,
  className = '',
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs text-secondary ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.onClick && !item.current ? (
            <button
              onClick={item.onClick}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className={item.current ? 'text-primary font-medium' : 'text-secondary'}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span aria-hidden="true" className="text-tertiary select-none">
              /
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string | number;
  shortcut?: string;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active = false,
  badge,
  shortcut,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-medium transition-colors duration-150 cursor-pointer text-left
        ${
          active
            ? 'bg-surface-elevated text-primary font-semibold'
            : 'text-secondary hover:text-primary hover:bg-surface'
        }
      `}
    >
      <div className="flex items-center gap-2.5 truncate">
        <span className={`shrink-0 ${active ? 'text-accent' : 'text-tertiary'}`}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {badge !== undefined && (
          <span className="text-[11px] font-mono tabular-nums text-tertiary">
            {badge}
          </span>
        )}
        {shortcut && (
          <span className="text-[10px] font-mono text-tertiary border border-subtle px-1 rounded">
            {shortcut}
          </span>
        )}
      </div>
    </button>
  );
};
