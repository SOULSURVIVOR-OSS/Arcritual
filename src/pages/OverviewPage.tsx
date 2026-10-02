import React, { useState, useMemo } from 'react';
import {
  Heading,
  Text,
  Kicker,
  Progress,
  MetadataList,
  Button,
} from '../design-system';
import {
  Check,
  ArrowRight,
  Activity as ActivityIcon,
  Calendar as CalendarIcon,
  Plus,
} from 'lucide-react';

interface HabitItem {
  id: string;
  name: string;
  time?: string;
  streak?: number;
  completed: boolean;
}

interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  category: string;
}

interface OverviewPageProps {
  onNavigate: (section: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  // Today's interactive habit checklist
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: 'h1',
      name: 'Morning Cognitive Horizon & Planning',
      time: '07:30',
      streak: 24,
      completed: true,
    },
    {
      id: 'h2',
      name: '90m Deep Work Block — Core Architecture',
      time: '09:00',
      streak: 18,
      completed: true,
    },
    {
      id: 'h3',
      name: 'Hydration & Electrolyte Baseline (1.0L)',
      streak: 42,
      completed: true,
    },
    {
      id: 'h4',
      name: 'Zone 2 Aerobic Conditioning',
      time: '16:30',
      streak: 9,
      completed: false,
    },
    {
      id: 'h5',
      name: 'Evening Synthesis & Daily Retrospective',
      time: '20:45',
      streak: 31,
      completed: false,
    },
    {
      id: 'h6',
      name: 'Zero Ambient Screen Consumption after 21:00',
      streak: 6,
      completed: false,
    },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  // Dynamic time-based greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Pavan.';
    if (hour < 17) return 'Good afternoon, Pavan.';
    return 'Good evening, Pavan.';
  }, []);

  // Format today's date
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  }, []);

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent = Math.round((completedCount / habits.length) * 100);

  // Next relevant events from Google Calendar
  const upcomingEvents: CalendarEvent[] = [
    {
      id: 'e1',
      time: '11:15 — 12:45',
      title: 'Core Architecture Review',
      category: 'Deep Work Window',
    },
    {
      id: 'e2',
      time: '14:00 — 14:30',
      title: 'Weekly Systems Sync',
      category: 'Video Call',
    },
    {
      id: 'e3',
      time: '17:00 — 17:45',
      title: 'Aerobic Training Window',
      category: 'Outdoor Track',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-14 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* TOP: GREETING, DATE & VISUAL SUMMARY */}
      {/* ========================================================================= */}
      <header className="space-y-4 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary [text-wrap:balance]">
            {greeting}
          </h1>
          <p className="text-sm text-secondary mt-1 font-normal">
            {formattedDate}
          </p>
        </div>

        {/* Visual Progress Summary (Clean, unboxed, tabular) */}
        <div className="pt-2 space-y-2 max-w-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary font-medium">Today's Progress</span>
            <span className="font-mono tabular-nums text-tertiary">
              <span className="text-primary font-semibold">{completedCount}</span> of{' '}
              {habits.length} completed · <span className="text-accent font-semibold">{progressPercent}%</span>
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden border border-subtle">
            <div
              className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1 — TODAY (Checklist: What do I need to do? How are habits going?) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-subtle pb-2">
          <div>
            <span className="text-[11px] font-medium tracking-wider uppercase text-tertiary block">
              Section 01
            </span>
            <h2 className="text-base font-semibold tracking-tight text-primary">
              Today
            </h2>
          </div>
          <button
            onClick={() => onNavigate('habits')}
            className="text-xs text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            Manage habits →
          </button>
        </div>

        <div className="divide-y divide-subtle">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className="py-3.5 flex items-center justify-between gap-4 group cursor-pointer hover:bg-surface-elevated/30 px-2 -mx-2 rounded-[6px] transition-colors"
            >
              {/* Left: Checkbox + Name */}
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={habit.completed}
                  aria-label={habit.name}
                  className={`
                    w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0
                    ${
                      habit.completed
                        ? 'bg-accent border-accent text-accent-foreground'
                        : 'border-subtle bg-surface-subtle group-hover:border-strong'
                    }
                  `}
                >
                  {habit.completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                </button>

                <span
                  className={`text-sm transition-colors truncate ${
                    habit.completed
                      ? 'text-tertiary line-through select-none'
                      : 'text-primary font-normal'
                  }`}
                >
                  {habit.name}
                </span>
              </div>

              {/* Right: Scheduled Time & Optional Streak */}
              <div className="flex items-center gap-4 shrink-0 text-xs font-mono tabular-nums">
                {habit.time && (
                  <span className="text-secondary">
                    {habit.time}
                  </span>
                )}
                {habit.streak !== undefined && (
                  <span className="text-tertiary">
                    {habit.streak}d streak
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — ROADMAP (What am I currently working toward?) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-subtle pb-2">
          <div>
            <span className="text-[11px] font-medium tracking-wider uppercase text-tertiary block">
              Section 02
            </span>
            <h2 className="text-base font-semibold tracking-tight text-primary">
              Active Roadmap
            </h2>
          </div>
          <button
            onClick={() => onNavigate('roadmaps')}
            className="text-xs text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            All roadmaps →
          </button>
        </div>

        {/* Roadmap Display (Single surface, restrained, spacious) */}
        <div className="p-5 rounded-[8px] bg-surface border border-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h3 className="text-sm font-semibold text-primary">
              Arcritual OS Core Architecture & Protocol
            </h3>
            <span className="text-xs font-mono tabular-nums text-tertiary">
              Q4 2026 Horizon
            </span>
          </div>

          {/* Simple progress indicator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary">Overall Completion</span>
              <span className="font-mono tabular-nums font-semibold text-accent">
                82%
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden border border-subtle">
              <div
                className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
                style={{ width: '82%' }}
              />
            </div>
          </div>

          {/* Next milestone & deliverables */}
          <div className="pt-2 border-t border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-tertiary">Next milestone:</span>
              <span className="font-medium text-primary">
                Telemetry synchronization & persistence layer
              </span>
            </div>
            <span className="font-mono tabular-nums text-tertiary shrink-0">
              Due Oct 9
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — ACTIVITY (How active have I been? e.g. Strava summary) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-subtle pb-2">
          <div>
            <span className="text-[11px] font-medium tracking-wider uppercase text-tertiary block">
              Section 03
            </span>
            <h2 className="text-base font-semibold tracking-tight text-primary">
              Activity
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-tertiary">
            <ActivityIcon className="w-3.5 h-3.5 text-secondary" />
            <span>Strava Synced</span>
          </div>
        </div>

        {/* Minimal Activity Summary with generous whitespace, not crammed */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2">
          <div className="space-y-1">
            <span className="text-xs text-tertiary block">Distance this week</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-primary font-mono tabular-nums">
                34.8
              </span>
              <span className="text-xs text-tertiary">km</span>
            </div>
            <span className="text-[11px] text-secondary block">
              +6.2 km vs last week
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-tertiary block">Workouts logged</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-primary font-mono tabular-nums">
                4
              </span>
              <span className="text-xs text-tertiary">sessions</span>
            </div>
            <span className="text-[11px] text-secondary block">
              Avg 52m per session
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-tertiary block">Active days</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-primary font-mono tabular-nums">
                5
              </span>
              <span className="text-xs text-tertiary">of 7 days</span>
            </div>
            <span className="text-[11px] text-secondary block">
              Aerobic threshold nominal
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — CALENDAR (Next few relevant events from Google Calendar) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-subtle pb-2">
          <div>
            <span className="text-[11px] font-medium tracking-wider uppercase text-tertiary block">
              Section 04
            </span>
            <h2 className="text-base font-semibold tracking-tight text-primary">
              Upcoming Events
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-tertiary">
            <CalendarIcon className="w-3.5 h-3.5 text-secondary" />
            <span>Google Calendar</span>
          </div>
        </div>

        {/* Clean, sparse upcoming events rows (No huge calendar) */}
        <div className="divide-y divide-subtle">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 hover:bg-surface-elevated/30 px-2 -mx-2 rounded-[6px] transition-colors"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-mono tabular-nums text-secondary w-28 shrink-0">
                  {evt.time}
                </span>
                <span className="text-sm font-medium text-primary">
                  {evt.title}
                </span>
              </div>
              <span className="text-xs text-tertiary sm:self-center pl-28 sm:pl-0 font-normal">
                {evt.category}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
