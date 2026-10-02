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
import { Plus, Check, Flame } from 'lucide-react';

interface HabitItem {
  id: string;
  title: string;
  category: 'Morning' | 'Deep Focus' | 'Evening';
  streak: number;
  targetDays: number;
  completedToday: boolean;
}

export const HabitsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'Morning' | 'Deep Focus' | 'Evening'>('all');
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: 'h1',
      title: '07:30 Morning Cognitive Planning & Prioritization',
      category: 'Morning',
      streak: 24,
      targetDays: 30,
      completedToday: true,
    },
    {
      id: 'h2',
      title: 'Hydration & Electrolyte Protocol (1.0L)',
      category: 'Morning',
      streak: 42,
      targetDays: 60,
      completedToday: true,
    },
    {
      id: 'h3',
      title: 'First 90-Minute Uninterrupted Focus Block',
      category: 'Deep Focus',
      streak: 18,
      targetDays: 21,
      completedToday: true,
    },
    {
      id: 'h4',
      title: 'Physical Conditioning (Aerobic or Resistance)',
      category: 'Deep Focus',
      streak: 9,
      targetDays: 14,
      completedToday: false,
    },
    {
      id: 'h5',
      title: 'Daily Retrospective & Evening Synthesis (15m)',
      category: 'Evening',
      streak: 31,
      targetDays: 30,
      completedToday: false,
    },
    {
      id: 'h6',
      title: 'Zero Ambient Screen Consumption after 21:00',
      category: 'Evening',
      streak: 6,
      targetDays: 14,
      completedToday: false,
    },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completedToday: !h.completedToday } : h))
    );
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const filteredHabits = filter === 'all' ? habits : habits.filter((h) => h.category === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Habit Architecture</Kicker>
          <Heading level={1} className="mt-1">
            Habit Consistency & Systems
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Non-negotiable foundational routines engineered to maintain high baseline agency.
          </Text>
        </div>
        <Button
          variant="primary"
          size="sm"
          prefixIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Habit System
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Surface padding="md">
          <StatDisplay
            label="TODAY'S EXECUTION"
            value={`${completedCount} / ${habits.length}`}
            delta={{ value: `${Math.round((completedCount / habits.length) * 100)}%`, trend: "up" }}
            secondaryText="Target: 100% daily completion"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="LONGEST CONTINUOUS STREAK"
            value="42 days"
            delta={{ value: "Electrolyte Protocol", trend: "up" }}
            secondaryText="Zero missed intervals"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="SYSTEM ADHERENCE"
            value="94.8%"
            delta={{ value: "Past 30 days", trend: "neutral" }}
            secondaryText="1.4% above monthly quota"
          />
        </Surface>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <SegmentedControl
          value={filter}
          onChange={(v) => setFilter(v as any)}
          items={[
            { id: 'all', label: 'All Routines', count: habits.length },
            { id: 'Morning', label: 'Morning Horizon' },
            { id: 'Deep Focus', label: 'Deep Execution' },
            { id: 'Evening', label: 'Evening Synthesis' },
          ]}
        />
        <span className="text-xs text-tertiary hidden sm:inline font-mono tabular-nums">
          {completedCount} Completed Today
        </span>
      </div>

      {/* Habit List Surface */}
      <Surface padding="none" className="overflow-hidden">
        <div className="divide-y divide-subtle">
          {filteredHabits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className="p-4 sm:px-6 flex items-center justify-between hover:bg-surface-elevated/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  aria-checked={habit.completedToday}
                  role="checkbox"
                  className={`
                    w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors shrink-0
                    ${
                      habit.completedToday
                        ? 'bg-accent border-accent text-accent-foreground'
                        : 'border-subtle bg-surface-subtle group-hover:border-strong'
                    }
                  `}
                >
                  {habit.completedToday && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
                <div className="min-w-0">
                  <span
                    className={`text-sm font-medium block truncate ${
                      habit.completedToday ? 'text-secondary line-through' : 'text-primary'
                    }`}
                  >
                    {habit.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-tertiary mt-0.5">
                    <span>{habit.category}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">Target: {habit.targetDays}d milestone</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 pl-3">
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold tabular-nums text-primary block">
                    {habit.streak}d streak
                  </span>
                  <span className="text-[10px] text-tertiary">
                    {habit.completedToday ? 'Logged today' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
};
