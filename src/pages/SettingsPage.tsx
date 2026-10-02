import React from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
  Toggle,
  Select,
  useTheme,
  DESIGN_TOKENS,
  AccentId,
} from '../design-system';
import { Sun, Moon, Palette, Shield, Database, BellOff } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Preferences & System Parameters</Kicker>
          <Heading level={1} className="mt-1">
            Settings
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Configure visual themes, focus parameters, and ambient constraints.
          </Text>
        </div>
        <Button variant="primary" size="sm">
          Save Preferences
        </Button>
      </div>

      {/* Visual Direction & Theme */}
      <Surface padding="md" className="space-y-6">
        <div>
          <span className="text-sm font-semibold text-primary block">Visual Theme</span>
          <span className="text-xs text-secondary mt-0.5 block">
            Dark mode is the primary visual direction for Kanso. Switch anytime for high-ambient lighting.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={theme === 'dark' ? 'primary' : 'secondary'}
            size="sm"
            prefixIcon={<Moon className="w-3.5 h-3.5" />}
            onClick={() => theme !== 'dark' && toggleTheme()}
          >
            Dark Mode (Primary)
          </Button>
          <Button
            variant={theme === 'light' ? 'primary' : 'secondary'}
            size="sm"
            prefixIcon={<Sun className="w-3.5 h-3.5" />}
            onClick={() => theme !== 'light' && toggleTheme()}
          >
            Light Mode
          </Button>
        </div>

        <div className="pt-4 border-t border-subtle">
          <span className="text-sm font-semibold text-primary block mb-1">
            Restrained Accent Color
          </span>
          <span className="text-xs text-secondary block mb-3">
            One single accent is budgeted across active navigation, progress, and primary actions.
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DESIGN_TOKENS.accents.map((acc) => {
              const isCurrent = accent === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => setAccent(acc.id as AccentId)}
                  className={`
                    p-3 rounded-[7px] border text-left transition-colors cursor-pointer flex flex-col justify-between h-20
                    ${
                      isCurrent
                        ? 'bg-surface-elevated border-strong ring-1 ring-accent text-primary'
                        : 'bg-surface-subtle border-subtle hover:border-strong text-secondary'
                    }
                  `}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: acc.color }}
                    />
                    {isCurrent && <span className="text-[10px] text-accent font-semibold">Active</span>}
                  </div>
                  <div>
                    <span className="text-xs font-semibold block">{acc.name}</span>
                    <span className="text-[10px] text-tertiary block truncate">{acc.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Surface>

      {/* Focus & Privacy Parameters */}
      <Surface padding="md" className="space-y-5">
        <span className="text-sm font-semibold text-primary block">
          Focus & Lockdown Protocols
        </span>

        <div className="space-y-4">
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Automatic Lockdown Mode"
            description="Prevent notifications and tab switching during active 90-minute blocks."
          />
          <div className="h-px bg-border-subtle" />
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Strict Single-Task Timer"
            description="Only one active timer may run simultaneously across all roadmaps."
          />
          <div className="h-px bg-border-subtle" />
          <Toggle
            checked={false}
            onChange={() => {}}
            label="Ambient Sound Generation"
            description="Play subtle brown noise during deep cognitive intervals."
          />
        </div>
      </Surface>

      {/* Data Sovereignty */}
      <Surface padding="md" className="space-y-4">
        <div>
          <span className="text-sm font-semibold text-primary block">Data Sovereignty</span>
          <span className="text-xs text-secondary mt-0.5 block">
            Your telemetry and focus records belong entirely to you. Export anytime in structured CSV or JSON formats.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" prefixIcon={<Database className="w-3.5 h-3.5" />}>
            Export JSON Archive
          </Button>
          <Button variant="ghost" size="sm">
            Wipe Local Cache
          </Button>
        </div>
      </Surface>
    </div>
  );
};
