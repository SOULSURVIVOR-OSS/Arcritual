import React, { useState } from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
  SegmentedControl,
  StatDisplay,
} from '../design-system';
import { Download, Clock, Target, Calendar } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'focus' | 'habit' | 'review'>('all');

  const activities = [
    {
      type: 'focus',
      title: 'Deep Architecture Writing & Spec Definition',
      timestamp: 'Today · 11:15',
      duration: '90m',
      category: 'Core Work',
      notes: 'Finalized token rules, zero-pill discipline, and typography hierarchy.',
    },
    {
      type: 'habit',
      title: 'Morning Horizon Prioritization Completed',
      timestamp: 'Today · 07:30',
      duration: '15m',
      category: 'Routines',
      notes: 'Identified top 3 invariant deliverables for October 2.',
    },
    {
      type: 'focus',
      title: 'Compiler & State Management Synthesis',
      timestamp: 'Yesterday · 14:00',
      duration: '120m',
      category: 'Core Work',
      notes: 'Reviewed benchmark data and memory footprints.',
    },
    {
      type: 'review',
      title: 'Weekly Retrospective & Horizon Audit #39',
      timestamp: 'Sep 27 · 18:30',
      duration: '45m',
      category: 'Review',
      notes: 'Achieved 22.5 hours of deep cognitive work; adjusted Q4 roadmaps.',
    },
    {
      type: 'focus',
      title: 'Zone 2 Aerobic Conditioning (12.4km)',
      timestamp: 'Sep 26 · 06:45',
      duration: '65m',
      category: 'Vitality',
      notes: 'Average heart rate 138 bpm; cadence 172 spm.',
    },
  ];

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Chronological Log</Kicker>
          <Heading level={1} className="mt-1">
            Activity & Session Ledger
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Continuous audit log of verified focus blocks, habit checkpoints, and weekly syntheses.
          </Text>
        </div>
        <Button
          variant="secondary"
          size="sm"
          prefixIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export CSV Ledger
        </Button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Surface padding="md">
          <StatDisplay
            label="OCTOBER COGNITIVE HOURS"
            value="18.5h"
            delta={{ value: "+2.4h vs last week", trend: "up" }}
            secondaryText="Target: 80 hours total"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="AVG SESSION LENGTH"
            value="84m"
            delta={{ value: "Optimal range", trend: "neutral" }}
            secondaryText="Target: 90m block"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="INTERRUPTION RATE"
            value="4.1%"
            delta={{ value: "-2.3% improved", trend: "up" }}
            secondaryText="Measured across 18 sessions"
          />
        </Surface>
      </div>

      {/* Filter Tabs */}
      <SegmentedControl
        value={filter}
        onChange={(v) => setFilter(v as any)}
        items={[
          { id: 'all', label: 'All Activities' },
          { id: 'focus', label: 'Focus Blocks' },
          { id: 'habit', label: 'Habit Logs' },
          { id: 'review', label: 'Syntheses' },
        ]}
      />

      {/* High-Density Activity List */}
      <Surface padding="none" className="overflow-hidden">
        <div className="divide-y divide-subtle">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 hover:bg-surface-elevated/40 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="text-sm font-medium text-primary">{item.title}</span>
                  <span className="text-xs text-tertiary select-none">·</span>
                  <span className="text-xs text-secondary">{item.category}</span>
                </div>
                <p className="text-xs text-secondary pl-4 leading-relaxed max-w-2xl">
                  {item.notes}
                </p>
              </div>

              <div className="flex items-center gap-4 sm:self-center shrink-0 pl-4 sm:pl-0">
                <span className="text-xs font-mono tabular-nums text-tertiary">
                  {item.timestamp}
                </span>
                <span className="text-xs font-mono font-semibold tabular-nums text-primary bg-surface-subtle px-2 py-0.5 rounded-[4px] border border-subtle">
                  {item.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
};
