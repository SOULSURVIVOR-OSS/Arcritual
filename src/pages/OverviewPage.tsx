import React, { useMemo } from 'react';
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
import { useHabits } from '../context/HabitsContext';
import { useRoadmaps } from '../context/RoadmapsContext';

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
  const { habits, toggleCompleteHabit, getHabitStreak } = useHabits();
  const { activeRoadmap, getRoadmapProgress } = useRoadmaps();

  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter to active habits
  const activeHabits = useMemo(() => habits.filter((h) => !h.isPaused), [habits]);

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

  const completedCount = activeHabits.filter((h) => Boolean(h.history[todayKey])).length;
  const progressPercent = activeHabits.length > 0 ? Math.round((completedCount / activeHabits.length) * 100) : 0;

  // Active roadmap analytics
  const roadmapProgress = activeRoadmap ? getRoadmapProgress(activeRoadmap) : null;
  const nextTask = activeRoadmap?.phases
    .flatMap((p) => p.tasks)
    .find((t) => !t.completed);

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
              {activeHabits.length} completed · <span className="text-accent font-semibold">{progressPercent}%</span>
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
          {activeHabits.map((habit) => {
            const isCompleted = Boolean(habit.history[todayKey]);
            const streak = getHabitStreak(habit).current;

            return (
              <div
                key={habit.id}
                onClick={() => toggleCompleteHabit(habit.id)}
                className="py-3.5 flex items-center justify-between gap-4 group cursor-pointer hover:bg-surface-elevated/30 px-2 -mx-2 rounded-[6px] transition-colors"
              >
                {/* Left: Checkbox + Name */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isCompleted}
                    aria-label={habit.name}
                    className={`
                      w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0
                      ${
                        isCompleted
                          ? 'bg-accent border-accent text-accent-foreground'
                          : 'border-subtle bg-surface-subtle group-hover:border-strong'
                      }
                    `}
                  >
                    {isCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </button>

                  <span
                    className={`text-sm transition-colors truncate ${
                      isCompleted
                        ? 'text-tertiary line-through select-none'
                        : 'text-primary font-normal'
                    }`}
                  >
                    {habit.name}
                  </span>
                </div>

                {/* Right: Scheduled Time & Optional Streak */}
                <div className="flex items-center gap-4 shrink-0 text-xs font-mono tabular-nums">
                  {habit.preferredTime && (
                    <span className="text-secondary">
                      {habit.preferredTime}
                    </span>
                  )}
                  {streak > 0 && (
                    <span className="text-tertiary">
                      {streak}d streak
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
        {activeRoadmap && roadmapProgress ? (
          <div className="p-5 rounded-[8px] bg-surface border border-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <h3 className="text-sm font-semibold text-primary">
                {activeRoadmap.title}
              </h3>
              <span className="text-xs font-mono tabular-nums text-tertiary">
                {activeRoadmap.phases.length} Phases Active
              </span>
            </div>

            {/* Simple progress indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Overall Completion</span>
                <span className="font-mono tabular-nums font-semibold text-accent">
                  {roadmapProgress.percentage}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden border border-subtle">
                <div
                  className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${roadmapProgress.percentage}%` }}
                />
              </div>
            </div>

            {/* Next milestone & deliverables */}
            <div className="pt-2 border-t border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="text-tertiary shrink-0">Next milestone:</span>
                <span className="font-medium text-primary truncate">
                  {nextTask ? nextTask.title : 'All roadmap milestones completed'}
                </span>
              </div>
              <span className="font-mono tabular-nums text-tertiary shrink-0">
                {nextTask?.deadline || `${roadmapProgress.completedTasks}/${roadmapProgress.totalTasks} shipped`}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-[8px] bg-surface border border-subtle text-center text-xs text-secondary">
            No active roadmaps. Convert a learning plan from ChatGPT to get started.
          </div>
        )}
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
