import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  as,
  children,
  className = '',
  ...props
}) => {
  const Component = as || (`h${level}` as const);

  const levelStyles = {
    1: 'text-2xl md:text-3xl font-semibold tracking-tight text-primary [text-wrap:balance]',
    2: 'text-xl md:text-2xl font-semibold tracking-tight text-primary [text-wrap:balance]',
    3: 'text-base md:text-lg font-medium text-primary [text-wrap:balance]',
    4: 'text-sm font-medium text-primary [text-wrap:balance]',
  };

  return (
    <Component className={`${levelStyles[level]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'body' | 'bodyLarge' | 'secondary' | 'caption' | 'code';
  as?: 'p' | 'span' | 'div' | 'label';
  children: React.ReactNode;
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  as: Component = 'p',
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    bodyLarge: 'text-base font-normal leading-relaxed text-primary',
    body: 'text-sm font-normal leading-relaxed text-secondary',
    secondary: 'text-xs font-normal leading-relaxed text-secondary',
    caption: 'text-xs font-normal text-tertiary',
    code: 'text-xs font-mono tabular-nums text-secondary bg-surface-subtle px-1.5 py-0.5 rounded-[4px] border border-subtle',
  };

  return React.createElement(
    Component,
    {
      className: `${variantStyles[variant]} ${className}`,
      ...props,
    },
    children
  );
};

export interface MetricProps {
  value: string | number;
  unit?: string;
  label?: string;
  subtext?: string;
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({
  value,
  unit,
  label,
  subtext,
  className = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <span className="text-xs font-medium text-tertiary mb-1 tracking-wide">{label}</span>}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl md:text-3xl font-semibold tracking-tight text-primary tabular-nums">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-tertiary tracking-normal">{unit}</span>}
      </div>
      {subtext && <span className="text-xs text-secondary mt-1">{subtext}</span>}
    </div>
  );
};

/**
 * MetadataList implements the Zero-Pill & Metadata Discipline:
 * Never wrap metadata (tags, dates, counts) in rounded pill boxes or colored chips.
 * Render as clean, unboxed text separated by subtle typographic bullets or slashes.
 */
export interface MetadataListProps {
  items: (string | number | React.ReactNode)[];
  separator?: string;
  className?: string;
}

export const MetadataList: React.FC<MetadataListProps> = ({
  items,
  separator = '·',
  className = '',
}) => {
  const filtered = items.filter(Boolean);
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs text-secondary ${className}`}>
      {filtered.map((item, index) => (
        <React.Fragment key={index}>
          <span>{item}</span>
          {index < filtered.length - 1 && (
            <span aria-hidden="true" className="text-tertiary select-none">
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <span className={`text-[11px] font-medium tracking-wider uppercase text-tertiary ${className}`}>
      {children}
    </span>
  );
};
