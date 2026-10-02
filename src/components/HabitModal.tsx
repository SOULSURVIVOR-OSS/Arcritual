import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, SegmentedControl, Select } from '../design-system';
import { Habit, FrequencyType } from '../context/HabitsContext';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit | null;
  onSave: (habitData: {
    name: string;
    description?: string;
    category: string;
    frequency: FrequencyType;
    selectedDays?: number[];
    preferredTime?: string;
    goal?: string;
    isPaused: boolean;
  }) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'Morning Horizon', label: 'Morning Horizon' },
  { value: 'Deep Execution', label: 'Deep Execution' },
  { value: 'Vitality', label: 'Vitality & Health' },
  { value: 'Evening Synthesis', label: 'Evening Synthesis' },
  { value: 'Mind & Reading', label: 'Mind & Reading' },
];

const DAYS_OF_WEEK = [
  { day: 1, label: 'M' },
  { day: 2, label: 'T' },
  { day: 3, label: 'W' },
  { day: 4, label: 'T' },
  { day: 5, label: 'F' },
  { day: 6, label: 'S' },
  { day: 0, label: 'S' },
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  habitToEdit,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Morning Horizon');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [preferredTime, setPreferredTime] = useState('');
  const [goal, setGoal] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category || 'Morning Horizon');
      setFrequency(habitToEdit.frequency);
      setSelectedDays(habitToEdit.selectedDays || [1, 2, 3, 4, 5]);
      setPreferredTime(habitToEdit.preferredTime || '');
      setGoal(habitToEdit.goal || '');
    } else {
      setName('');
      setDescription('');
      setCategory('Morning Horizon');
      setFrequency('daily');
      setSelectedDays([1, 2, 3, 4, 5]);
      setPreferredTime('');
      setGoal('');
    }
    setNameError('');
  }, [habitToEdit, isOpen]);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      setNameError('Habit name is required');
      return;
    }
    if (frequency === 'selected_days' && selectedDays.length === 0) {
      setNameError('Select at least one day for selected days frequency');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      selectedDays: frequency === 'selected_days' ? selectedDays : undefined,
      preferredTime: preferredTime.trim() || undefined,
      goal: goal.trim() || undefined,
      isPaused: habitToEdit ? habitToEdit.isPaused : false,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habitToEdit ? 'Edit Habit System' : 'Create Habit System'}
      description="Design a deliberate, repeatable routine into your everyday command horizon."
      primaryAction={{
        label: habitToEdit ? 'Save Changes' : 'Establish Habit',
        onClick: handleSave,
      }}
      secondaryAction={{
        label: 'Cancel',
        onClick: onClose,
      }}
    >
      <div className="space-y-4 py-1">
        {/* Name */}
        <TextInput
          label="Habit Name"
          placeholder="e.g. 90m Deep Work Block — Core Architecture"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError('');
          }}
          error={nameError}
          autoFocus
        />

        {/* Description */}
        <Textarea
          label="Purpose / Standard (Optional)"
          placeholder="State the non-negotiable standard and boundary conditions..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        {/* Category & Frequency Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
          />

          <div>
            <span className="text-xs font-medium text-primary select-none block mb-1.5">
              Frequency
            </span>
            <SegmentedControl
              size="sm"
              value={frequency}
              onChange={(val) => setFrequency(val as FrequencyType)}
              items={[
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' },
                { id: 'selected_days', label: 'Specific Days' },
              ]}
            />
          </div>
        </div>

        {/* Days of Week Selector (Shown if selected_days) */}
        {frequency === 'selected_days' && (
          <div className="pt-1">
            <span className="text-xs text-secondary block mb-1.5">
              Select Active Days
            </span>
            <div className="flex items-center gap-1.5">
              {DAYS_OF_WEEK.map(({ day, label }) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`
                      w-8 h-8 rounded-[5px] text-xs font-medium border transition-colors cursor-pointer flex items-center justify-center
                      ${
                        isSelected
                          ? 'bg-accent border-accent text-accent-foreground font-semibold'
                          : 'bg-surface-subtle border-subtle text-secondary hover:text-primary hover:border-strong'
                      }
                    `}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Preferred Time & Daily Goal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <TextInput
            label="Scheduled / Preferred Time"
            placeholder="07:30"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            hint="24h format (e.g. 09:00, 16:30)"
          />

          <TextInput
            label="Goal / Target Metric"
            placeholder="e.g. 90 min, 1.0L, 25 pages"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            hint="Concrete minimum standard"
          />
        </div>
      </div>
    </Modal>
  );
};
