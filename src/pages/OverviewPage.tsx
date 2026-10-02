import React from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  StatDisplay,
  Progress,
  MetadataList,
  Button,
} from '../design-system';
import { Plus, Target, Clock, ArrowUpRight, Flame } from 'lucide-react';

interface OverviewPageProps {
  onNavigate: (section: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Horizon Summary Anchor */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Morning Horizon · Daily Brief</Kicker>
          <Heading level={1} className="mt-1">
            Command Overview
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Today is focused on core cognitive architecture and deep execution.
          </Text>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('calendar')}
          >
            Open Schedule
          </Button>
          <Button
            variant="primary"
            size="sm"
            prefixIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onNavigate('habits')}
          >
            Start Focus Block
          </Button>
        </div>
      </div>

      {/* 3 Core Metric Anchors (Tabular Numerals, Single-elevation depth) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Surface padding="md">
          <StatDisplay
            label="DEEP WORK TODAY"
            value="3h 45m"
            delta={{ value: "+45m vs avg", trend: "up" }}
            secondaryText="Target: 4h 30m"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="HABIT CONSISTENCY"
            value="92%"
            delta={{ value: "11-day streak", trend: "up" }}
            secondaryText="5 of 6 completed"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="ACTIVE MILESTONES"
            value="4"
            delta={{ value: "2 due this week", trend: "neutral" }}
            secondaryText="Q4 Strategic Horizon"
          />
        </Surface>
      </div>

      {/* Daily Intention & Focus Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Surface padding="md" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary">Today's Scheduled Focus Sessions</span>
            <span className="text-xs font-mono tabular-nums text-tertiary">3 Sessions Remaining</span>
          </div>

          <div className="divide-y divide-subtle">
            {[
              {
                time: '09:00 — 10:30',
                title: 'High-Density Engine Specification',
                status: 'Completed',
                completed: true,
                duration: '90m',
              },
              {
                time: '11:15 — 12:45',
                title: 'Layout & Typography Refactor',
                status: 'In Progress',
                completed: false,
                duration: '90m',
              },
              {
                time: '14:30 — 16:00',
                title: 'Quarterly Systems Retrospective',
                status: 'Scheduled',
                completed: false,
                duration: '90m',
              },
            ].map((block, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between text-xs hover:bg-surface-elevated/40 transition-colors px-1 rounded-[5px]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      block.completed
                        ? 'bg-emerald-500'
                        : block.status === 'In Progress'
                        ? 'bg-accent animate-pulse'
                        : 'bg-zinc-500'
                    }`}
                  />
                  <div>
                    <span className="font-medium text-primary block">{block.title}</span>
                    <span className="text-[11px] text-tertiary font-mono tabular-nums">
                      {block.time} · {block.duration}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs ${
                    block.completed
                      ? 'text-secondary'
                      : block.status === 'In Progress'
                      ? 'text-accent font-medium'
                      : 'text-tertiary'
                  }`}
                >
                  {block.status}
                </span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface padding="md" className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-primary">Weekly Horizon</span>
              <span className="text-xs font-mono tabular-nums text-accent">78%</span>
            </div>
            <Progress value={78} />
            <Text variant="secondary" className="mt-3 leading-relaxed">
              18.5 of 24 planned cognitive hours logged. You are tracking 1.2 hours ahead of baseline pace.
            </Text>
          </div>

          <div className="pt-4 border-t border-subtle">
            <button
              onClick={() => onNavigate('roadmaps')}
              className="w-full flex items-center justify-between text-xs font-medium text-primary hover:text-accent transition-colors group cursor-pointer"
            >
              <span>View Roadmap Alignment</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-tertiary group-hover:text-accent transition-colors" />
            </button>
          </div>
        </Surface>
      </div>

      {/* Core Habit Snapshot & Principle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Surface padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-primary">Daily Keystone Habits</span>
            <button
              onClick={() => onNavigate('habits')}
              className="text-xs text-accent hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              { name: 'Morning Horizon Review (07:30)', done: true, streak: '24d' },
              { name: '90m Single-Task Deep Work Block', done: true, streak: '18d' },
              { name: 'Cold Immersion / Aerobic Baseline', done: true, streak: '9d' },
              { name: 'Zero Ambient Screen Consumption after 21:00', done: false, streak: '6d' },
            ].map((habit, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs py-1.5 border-b border-subtle last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center ${
                      habit.done
                        ? 'bg-accent/15 border-accent text-accent'
                        : 'border-subtle bg-surface-subtle'
                    }`}
                  >
                    {habit.done && <span className="text-[10px]">✓</span>}
                  </span>
                  <span className={habit.done ? 'text-secondary line-through' : 'text-primary'}>
                    {habit.name}
                  </span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-tertiary">
                  {habit.streak}
                </span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface padding="md" className="flex flex-col justify-between">
          <div>
            <Kicker>Guiding Invariant</Kicker>
            <blockquote className="mt-2 text-sm text-primary font-medium leading-relaxed italic">
              "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy."
            </blockquote>
            <span className="block text-xs text-tertiary mt-2">— Cal Newport, Deep Work</span>
          </div>

          <div className="pt-4 border-t border-subtle flex items-center justify-between text-xs text-secondary">
            <span>Evening Synthesis in 4h 15m</span>
            <button
              onClick={() => onNavigate('motivation')}
              className="text-accent hover:underline cursor-pointer"
            >
              Open Philosophy →
            </button>
          </div>
        </Surface>
      </div>
    </div>
  );
};
