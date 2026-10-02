import React, { useState, useMemo } from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
  SegmentedControl,
  StatDisplay,
  Progress,
  Modal,
} from '../design-system';
import {
  Plus,
  Check,
  MoreHorizontal,
  Pause,
  Play,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
} from 'lucide-react';
import { useHabits, Habit } from '../context/HabitsContext';
import { HabitModal } from '../components/HabitModal';

export const HabitsPage: React.FC = () => {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    togglePauseHabit,
    toggleCompleteHabit,
    getHabitStreak,
    getOverallStats,
    getDaysOfWeek,
  } = useHabits();

  // Active view: 'list' (Today & Weekly) vs 'history' (30-Day History Matrix)
  const [viewMode, setViewMode] = useState<'today_weekly' | 'history'>('today_weekly');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);

  const daysOfWeek = useMemo(() => getDaysOfWeek(), [getDaysOfWeek]);
  const stats = useMemo(() => getOverallStats(), [getOverallStats]);
  const todayKey = new Date().toISOString().split('T')[0];

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(habits.map((h) => h.category).filter(Boolean));
    return ['all', ...Array.from(cats), 'paused'];
  }, [habits]);

  // Filtered habits
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (categoryFilter === 'all') return !habit.isPaused;
      if (categoryFilter === 'paused') return habit.isPaused;
      return habit.category === categoryFilter && !habit.isPaused;
    });
  }, [habits, categoryFilter]);

  const handleCreateNew = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: any) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
  };

  const confirmDelete = () => {
    if (deletingHabitId) {
      deleteHabit(deletingHabitId);
      setDeletingHabitId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Behavioral Architecture</Kicker>
          <Heading level={1} className="mt-1">
            Habit Systems
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Non-negotiable foundational routines engineered to maintain high baseline agency.
          </Text>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            prefixIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleCreateNew}
          >
            New Habit System
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS ROW (Tabular Figures, Single-Elevation) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Surface padding="md">
          <StatDisplay
            label="TODAY'S EXECUTION"
            value={`${stats.completedToday} / ${stats.activeTotal}`}
            delta={{
              value: `${stats.completionRateToday}%`,
              trend: stats.completionRateToday >= 80 ? 'up' : 'neutral',
            }}
            secondaryText="Target: 100% daily standard"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="WEEKLY CONSISTENCY"
            value={`${stats.weeklyConsistency}%`}
            delta={{ value: 'Past 7 days', trend: 'up' }}
            secondaryText="Adherence across all active protocols"
          />
        </Surface>

        <Surface padding="md">
          <StatDisplay
            label="ACTIVE PROTOCOLS"
            value={stats.activeTotal}
            delta={{
              value: `${habits.filter((h) => h.isPaused).length} paused`,
              trend: 'neutral',
            }}
            secondaryText="Continuous daily tracking"
          />
        </Surface>
      </div>

      {/* ========================================================================= */}
      {/* 3. VIEW TOGGLE & CATEGORY FILTERS */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <SegmentedControl
            value={viewMode}
            onChange={(val) => setViewMode(val as any)}
            items={[
              { id: 'today_weekly', label: "Today's Habits & Weekly Matrix" },
              { id: 'history', label: '30-Day History Matrix' },
            ]}
          />
        </div>

        {viewMode === 'today_weekly' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <SegmentedControl
              size="sm"
              value={categoryFilter}
              onChange={setCategoryFilter}
              items={[
                { id: 'all', label: 'All Active' },
                { id: 'Morning Horizon', label: 'Morning' },
                { id: 'Deep Execution', label: 'Deep Focus' },
                { id: 'Vitality', label: 'Vitality' },
                { id: 'Evening Synthesis', label: 'Evening' },
                { id: 'paused', label: 'Paused' },
              ]}
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: TODAY'S HABITS & WEEKLY VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'today_weekly' && (
        <div className="space-y-4">
          <Surface padding="none" className="overflow-hidden">
            {/* Table Header Row */}
            <div className="px-5 py-3.5 border-b border-subtle bg-surface-subtle/50 hidden md:flex items-center justify-between text-xs font-medium text-tertiary">
              <div className="w-1/2">HABIT SYSTEM & PURPOSE</div>
              <div className="w-44 text-center">WEEKLY COMPLETION (M—S)</div>
              <div className="w-32 text-right">STREAK / LONGEST</div>
              <div className="w-20 text-right">ACTIONS</div>
            </div>

            {/* Habit Rows */}
            {filteredHabits.length === 0 ? (
              <div className="p-8 text-center text-xs text-secondary">
                No habit systems found in this filter category.
              </div>
            ) : (
              <div className="divide-y divide-subtle">
                {filteredHabits.map((habit) => {
                  const isDoneToday = Boolean(habit.history[todayKey]);
                  const streakInfo = getHabitStreak(habit);

                  return (
                    <div
                      key={habit.id}
                      className="p-4 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-elevated/30 transition-colors"
                    >
                      {/* Left: Completion control + Info */}
                      <div className="flex items-start gap-3.5 md:w-1/2 min-w-0">
                        {/* Checkbox */}
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isDoneToday}
                          onClick={() => toggleCompleteHabit(habit.id)}
                          className={`
                            mt-0.5 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 cursor-pointer
                            ${
                              isDoneToday
                                ? 'bg-accent border-accent text-accent-foreground'
                                : 'border-subtle bg-surface-subtle hover:border-strong'
                            }
                            ${habit.isPaused ? 'opacity-40 cursor-not-allowed' : ''}
                          `}
                          disabled={habit.isPaused}
                        >
                          {isDoneToday && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </button>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium truncate ${
                                isDoneToday && !habit.isPaused
                                  ? 'text-secondary line-through'
                                  : 'text-primary'
                              }`}
                            >
                              {habit.name}
                            </span>
                            {habit.isPaused && (
                              <span className="text-[10px] font-mono text-tertiary border border-subtle px-1.5 py-0.2 rounded">
                                Paused
                              </span>
                            )}
                          </div>

                          {habit.description && (
                            <p className="text-xs text-secondary truncate max-w-md">
                              {habit.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-tertiary">
                            <span>{habit.category}</span>
                            {habit.preferredTime && (
                              <>
                                <span>·</span>
                                <span className="font-mono tabular-nums">
                                  {habit.preferredTime}
                                </span>
                              </>
                            )}
                            {habit.goal && (
                              <>
                                <span>·</span>
                                <span>{habit.goal}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Compact Weekly Strip (7 days) */}
                      <div className="md:w-44 flex items-center justify-start md:justify-center gap-1.5">
                        {daysOfWeek.map((day) => {
                          const isDone = Boolean(habit.history[day.dateKey]);
                          return (
                            <button
                              key={day.dateKey}
                              type="button"
                              onClick={() => toggleCompleteHabit(habit.id, day.dateKey)}
                              className={`
                                w-5 h-6 rounded-[3px] border flex flex-col items-center justify-center text-[10px] font-mono tabular-nums transition-colors cursor-pointer
                                ${
                                  isDone
                                    ? 'bg-accent/15 border-accent text-accent font-semibold'
                                    : 'border-subtle bg-surface-subtle text-tertiary hover:border-strong'
                                }
                                ${day.isToday ? 'ring-1 ring-accent' : ''}
                              `}
                              title={`${day.label} (${day.dateKey}): ${isDone ? 'Completed' : 'Incomplete'}`}
                            >
                              <span>{day.label[0]}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right: Streak & Longest */}
                      <div className="md:w-32 flex md:flex-col items-center md:items-end justify-between md:justify-center text-xs font-mono tabular-nums">
                        <div className="flex items-center gap-1">
                          <span className="text-primary font-semibold">
                            {streakInfo.current}d
                          </span>
                          <span className="text-tertiary">streak</span>
                        </div>
                        <span className="text-[11px] text-tertiary">
                          max {streakInfo.longest}d
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="md:w-20 flex items-center justify-end gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => togglePauseHabit(habit.id)}
                          className="p-1.5 text-tertiary hover:text-primary hover:bg-surface-elevated rounded-[4px] transition-colors cursor-pointer"
                          title={habit.isPaused ? 'Resume habit' : 'Pause habit'}
                        >
                          {habit.isPaused ? (
                            <Play className="w-3.5 h-3.5" />
                          ) : (
                            <Pause className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(habit)}
                          className="p-1.5 text-tertiary hover:text-primary hover:bg-surface-elevated rounded-[4px] transition-colors cursor-pointer"
                          title="Edit habit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingHabitId(habit.id)}
                          className="p-1.5 text-tertiary hover:text-red-500 hover:bg-red-500/10 rounded-[4px] transition-colors cursor-pointer"
                          title="Delete habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Surface>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: 30-DAY CONSISTENCY MATRIX (Disciplined, anti-gamified) */}
      {/* ========================================================================= */}
      {viewMode === 'history' && (
        <Surface padding="md" className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-primary block">
              30-Day Horizon Adherence Matrix
            </span>
            <span className="text-xs text-secondary mt-0.5 block">
              Daily verification ledger. Shaded by total habits verified per calendar day.
            </span>
          </div>

          {/* Matrix Grid (Past 30 days) */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {Array.from({ length: 30 }).map((_, idx) => {
              const d = new Date();
              d.setDate(d.getDate() - (29 - idx));
              const dateKey = d.toISOString().split('T')[0];
              const isToday = dateKey === todayKey;

              const activeHabits = habits.filter((h) => !h.isPaused);
              const doneCount = activeHabits.filter((h) => Boolean(h.history[dateKey])).length;
              const totalActive = activeHabits.length;
              const ratio = totalActive > 0 ? doneCount / totalActive : 0;

              return (
                <div
                  key={dateKey}
                  className={`
                    p-2 rounded-[5px] border flex flex-col justify-between h-16 text-xs transition-colors
                    ${
                      isToday
                        ? 'border-accent bg-surface-elevated ring-1 ring-accent'
                        : 'border-subtle bg-surface-subtle/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-tertiary">
                    <span>{d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
                    {isToday && <span className="text-accent font-semibold">Today</span>}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono tabular-nums font-medium text-primary block">
                      {doneCount}/{totalActive}
                    </span>
                    <div className="h-1 w-full bg-border-subtle rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all rounded-full"
                        style={{ width: `${Math.round(ratio * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-secondary">
            <span>
              Total checks verified: <span className="font-mono text-primary font-semibold">{stats.completedToday}</span> today
            </span>
            <span className="text-tertiary">
              Calculated strictly from persistent local history. Zero gamification.
            </span>
          </div>
        </Surface>
      )}

      {/* ========================================================================= */}
      {/* 4. HABIT CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habitToEdit={editingHabit}
        onSave={handleSaveModal}
      />

      {/* ========================================================================= */}
      {/* 5. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(deletingHabitId)}
        onClose={() => setDeletingHabitId(null)}
        title="Delete Habit System"
        description="Are you sure you want to delete this habit? All historical completion logs for this protocol will be permanently removed."
        primaryAction={{
          label: 'Delete Permanently',
          variant: 'destructive',
          onClick: confirmDelete,
        }}
        secondaryAction={{
          label: 'Keep Habit',
          onClick: () => setDeletingHabitId(null),
        }}
      >
        <p className="text-xs text-secondary leading-relaxed">
          This operation is irreversible. If you merely want to pause tracking, select Pause instead.
        </p>
      </Modal>
    </div>
  );
};
