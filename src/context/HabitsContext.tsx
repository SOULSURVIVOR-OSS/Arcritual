import React, { createContext, useContext, useState, useEffect } from 'react';

export type FrequencyType = 'daily' | 'weekly' | 'selected_days';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: FrequencyType;
  selectedDays?: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  preferredTime?: string; // "07:30"
  goal?: string; // "1.0L" or "90 min"
  isPaused: boolean;
  createdAt: string;
  history: Record<string, boolean>; // 'YYYY-MM-DD': boolean
  longestStreak: number;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'history' | 'longestStreak'>) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  deleteHabit: (id: string) => void;
  togglePauseHabit: (id: string) => void;
  toggleCompleteHabit: (id: string, dateKey?: string) => void;
  getHabitStreak: (habit: Habit) => { current: number; longest: number };
  getOverallStats: () => {
    completedToday: number;
    activeTotal: number;
    completionRateToday: number;
    weeklyConsistency: number;
  };
  getDaysOfWeek: () => { label: string; dateKey: string; isToday: boolean; dayNumber: number }[];
}

const STORAGE_KEY = 'arcritual_habits_v1';

// Seed data with realistic history leading up to today
const getInitialHabits = (): Habit[] => {
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const generateHistory = (completedDaysAgo: number[]) => {
    const hist: Record<string, boolean> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = formatDate(d);
      if (completedDaysAgo.includes(i)) {
        hist[key] = true;
      }
    }
    return hist;
  };

  return [
    {
      id: 'h1',
      name: 'Morning Horizon & Prioritization',
      description: 'Review top 3 invariants before opening messaging or inbox.',
      category: 'Morning Horizon',
      frequency: 'daily',
      preferredTime: '07:30',
      goal: '15 min review',
      isPaused: false,
      createdAt: '2026-08-01',
      history: generateHistory([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]),
      longestStreak: 30,
    },
    {
      id: 'h2',
      name: '90m Deep Work Block — Core Architecture',
      description: 'High-cognitive single-task execution in full lockdown.',
      category: 'Deep Execution',
      frequency: 'daily',
      preferredTime: '09:00',
      goal: '90m lockdown',
      isPaused: false,
      createdAt: '2026-08-10',
      history: generateHistory([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
      longestStreak: 21,
    },
    {
      id: 'h3',
      name: 'Hydration & Electrolyte Baseline (1.0L)',
      description: 'Clean hydration upon waking with trace mineral salts.',
      category: 'Vitality',
      frequency: 'daily',
      preferredTime: '08:00',
      goal: '1.0L water',
      isPaused: false,
      createdAt: '2026-07-15',
      history: generateHistory([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]),
      longestStreak: 42,
    },
    {
      id: 'h4',
      name: 'Zone 2 Aerobic Conditioning',
      description: 'Low-lactate sustained cardio (heart rate 130-140 bpm).',
      category: 'Vitality',
      frequency: 'selected_days',
      selectedDays: [1, 3, 5, 6], // Mon, Wed, Fri, Sat
      preferredTime: '16:30',
      goal: '45m cardio',
      isPaused: false,
      createdAt: '2026-08-20',
      history: generateHistory([1, 3, 5, 7, 9]),
      longestStreak: 14,
    },
    {
      id: 'h5',
      name: 'Evening Synthesis & Daily Retrospective',
      description: 'Audit deliverables, record velocity, and archive distraction logs.',
      category: 'Evening Synthesis',
      frequency: 'daily',
      preferredTime: '20:45',
      goal: '15m synthesis',
      isPaused: false,
      createdAt: '2026-08-05',
      history: generateHistory([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
      longestStreak: 31,
    },
    {
      id: 'h6',
      name: 'Zero Ambient Screen Consumption after 21:00',
      description: 'Protect circadian rhythm and neural recovery window.',
      category: 'Evening Synthesis',
      frequency: 'daily',
      preferredTime: '21:00',
      goal: 'No blue light',
      isPaused: false,
      createdAt: '2026-09-01',
      history: generateHistory([1, 2, 3, 4, 5, 6]),
      longestStreak: 14,
    },
  ];
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored habits', e);
        }
      }
    }
    return getInitialHabits();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  const toggleCompleteHabit = (id: string, dateKey?: string) => {
    const targetDate = dateKey || getTodayKey();

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        const currentCompleted = Boolean(habit.history[targetDate]);
        const updatedHistory = { ...habit.history, [targetDate]: !currentCompleted };

        // Recalculate streak
        let streak = 0;
        const d = new Date();
        // check backward
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(d);
          checkDate.setDate(checkDate.getDate() - i);
          const key = checkDate.toISOString().split('T')[0];
          if (updatedHistory[key]) {
            streak++;
          } else if (i === 0 && !updatedHistory[key]) {
            // today not done yet is fine if yesterday was done
            continue;
          } else {
            break;
          }
        }

        const newLongest = Math.max(habit.longestStreak || 0, streak);

        return {
          ...habit,
          history: updatedHistory,
          longestStreak: newLongest,
        };
      })
    );
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'history' | 'longestStreak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      history: {},
      longestStreak: 0,
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const updateHabit = (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const togglePauseHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, isPaused: !habit.isPaused } : habit
      )
    );
  };

  const getHabitStreak = (habit: Habit) => {
    let current = 0;
    const d = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(d);
      checkDate.setDate(checkDate.getDate() - i);
      const key = checkDate.toISOString().split('T')[0];
      if (habit.history[key]) {
        current++;
      } else if (i === 0) {
        // Today might not be completed yet; continue checking backward from yesterday
        continue;
      } else {
        break;
      }
    }

    return {
      current,
      longest: Math.max(habit.longestStreak || 0, current),
    };
  };

  const getOverallStats = () => {
    const todayKey = getTodayKey();
    const activeHabits = habits.filter((h) => !h.isPaused);
    const completedToday = activeHabits.filter((h) => Boolean(h.history[todayKey])).length;
    const activeTotal = activeHabits.length;
    const completionRateToday = activeTotal > 0 ? Math.round((completedToday / activeTotal) * 100) : 0;

    // Calculate weekly consistency across past 7 days
    let totalChecks = 0;
    let completedChecks = 0;
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const k = d.toISOString().split('T')[0];
      activeHabits.forEach((h) => {
        totalChecks++;
        if (h.history[k]) completedChecks++;
      });
    }

    const weeklyConsistency = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

    return {
      completedToday,
      activeTotal,
      completionRateToday,
      weeklyConsistency,
    };
  };

  // Get current week's 7 days (Monday to Sunday)
  const getDaysOfWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday
    // Distance to Monday: if Sunday (0), distance is -6; otherwise 1 - currentDay
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    const days = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = d.toISOString().split('T')[0];
      days.push({
        label: dayNames[i],
        dateKey,
        isToday: dateKey === getTodayKey(),
        dayNumber: d.getDate(),
      });
    }

    return days;
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        togglePauseHabit,
        toggleCompleteHabit,
        getHabitStreak,
        getOverallStats,
        getDaysOfWeek,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};
