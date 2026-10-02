import React from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
  StatDisplay,
  MetadataList,
} from '../design-system';
import { User, Shield, Target, Key, Award, Clock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Identity & Command Parameters</Kicker>
          <Heading level={1} className="mt-1">
            Operator Profile
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Autonomous personal configuration, key statistics, and mastery shortcuts.
          </Text>
        </div>
        <Button variant="secondary" size="sm">
          Edit Profile
        </Button>
      </div>

      {/* Operator Card */}
      <Surface padding="md" className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-14 h-14 rounded-[8px] bg-surface-subtle border border-strong flex items-center justify-center text-primary font-semibold text-lg shrink-0">
          PK
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-primary">Pavan Kasaram</h2>
            <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-[4px]">
              Active Operator
            </span>
          </div>
          <MetadataList
            items={[
              'Horizon Cycle 2026',
              'Member since March 2026',
              'UTC-07:00 Pacific',
            ]}
          />
        </div>
      </Surface>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Surface padding="md">
          <StatDisplay
            label="LIFETIME FOCUS BLOCKS"
            value="342"
            delta={{ value: "+28 this month", trend: "up" }}
            secondaryText="513 total cognitive hours"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="HABIT EXECUTION RATE"
            value="94.1%"
            delta={{ value: "Historical standard", trend: "neutral" }}
            secondaryText="Over 180 consecutive days"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="ROADMAP MILESTONES SHIPPED"
            value="19"
            delta={{ value: "3 in current horizon", trend: "up" }}
            secondaryText="100% on-time delivery"
          />
        </Surface>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <Surface padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-primary block">
              Command Center Shortcuts
            </span>
            <span className="text-xs text-secondary">
              Accelerate common workflows without leaving the keyboard
            </span>
          </div>
          <span className="text-xs font-mono text-tertiary">Quick Navigation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-subtle">
          {[
            { shortcut: '⌘ 1', action: 'Switch to Overview' },
            { shortcut: '⌘ 2', action: 'Switch to Habits' },
            { shortcut: '⌘ 3', action: 'Switch to Roadmaps' },
            { shortcut: '⌘ 4', action: 'Switch to Activity' },
            { shortcut: '⌘ 5', action: 'Switch to Motivation' },
            { shortcut: '⌘ 6', action: 'Switch to Calendar' },
            { shortcut: '⌘ ,', action: 'Open Settings' },
            { shortcut: '⌘ K', action: 'Global Command Search' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-[6px] bg-surface-subtle border border-subtle text-xs"
            >
              <span className="text-secondary">{item.action}</span>
              <kbd className="font-mono text-primary font-semibold bg-surface border border-subtle px-1.5 py-0.5 rounded text-[11px]">
                {item.shortcut}
              </kbd>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
};
