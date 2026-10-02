import React, { useState } from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
  SegmentedControl,
} from '../design-system';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const [view, setView] = useState<'week' | 'day'>('week');

  const days = [
    { day: 'Mon', date: '28', active: false },
    { day: 'Tue', date: '29', active: false },
    { day: 'Wed', date: '30', active: false },
    { day: 'Thu', date: '1', active: false },
    { day: 'Fri', date: '2', active: true, isToday: true },
    { day: 'Sat', date: '3', active: false },
    { day: 'Sun', date: '4', active: false },
  ];

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const events = [
    {
      time: '09:00 — 10:30',
      title: 'Deep Architecture Specification',
      category: 'Deep Work',
      top: 1, // index in timeSlots
      span: 1.5,
    },
    {
      time: '11:15 — 12:45',
      title: 'Layout & Typography Refactor',
      category: 'Active Session',
      top: 3.25,
      span: 1.5,
    },
    {
      time: '14:30 — 16:00',
      title: 'Quarterly Systems Retrospective',
      category: 'Review',
      top: 6.5,
      span: 1.5,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Temporal Architecture</Kicker>
          <Heading level={1} className="mt-1">
            Focus Calendar & Schedule
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Time-blocking intentional horizons. Every session is protected from ambient fragmentation.
          </Text>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center border border-subtle rounded-[6px] p-0.5 bg-surface">
            <button className="p-1 hover:text-primary text-secondary transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium px-2 text-primary">October 2026</span>
            <button className="p-1 hover:text-primary text-secondary transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Button
            variant="primary"
            size="sm"
            prefixIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Block Focus Window
          </Button>
        </div>
      </div>

      {/* Days Strip */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <div
            key={i}
            className={`
              p-3 rounded-[8px] border text-center transition-colors cursor-pointer
              ${
                d.isToday
                  ? 'bg-surface-elevated border-accent text-primary ring-1 ring-accent'
                  : 'bg-surface border-subtle hover:border-strong text-secondary'
              }
            `}
          >
            <span className="text-[11px] font-medium uppercase tracking-wider block text-tertiary">
              {d.day}
            </span>
            <span className="text-base font-semibold font-mono tabular-nums text-primary block mt-0.5">
              {d.date}
            </span>
            {d.isToday && (
              <span className="text-[10px] text-accent font-semibold block mt-0.5">Today</span>
            )}
          </div>
        ))}
      </div>

      {/* Time-blocking Grid Surface */}
      <Surface padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-primary">Friday, October 2 · Horizon</span>
            <span className="text-tertiary">·</span>
            <span className="text-secondary font-mono tabular-nums">4h 30m Total Allocated</span>
          </div>
          <SegmentedControl
            size="sm"
            value={view}
            onChange={(v) => setView(v as any)}
            items={[
              { id: 'week', label: 'Week' },
              { id: 'day', label: 'Day Timeline' },
            ]}
          />
        </div>

        <div className="divide-y divide-subtle">
          {timeSlots.map((time, idx) => {
            const matchingEvent = events.find((e) => Math.floor(e.top) === idx);

            return (
              <div
                key={time}
                className="flex items-start min-h-[56px] text-xs hover:bg-surface-subtle/30 transition-colors"
              >
                {/* Time Column */}
                <div className="w-20 sm:w-24 p-3 font-mono tabular-nums text-tertiary border-r border-subtle shrink-0">
                  {time}
                </div>

                {/* Event Slot */}
                <div className="flex-1 p-2">
                  {matchingEvent && (
                    <div className="p-2.5 rounded-[6px] bg-surface-elevated border border-accent/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <div>
                          <span className="font-semibold text-primary block">
                            {matchingEvent.title}
                          </span>
                          <span className="text-[11px] font-mono tabular-nums text-tertiary">
                            {matchingEvent.time}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-secondary">
                        {matchingEvent.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Surface>
    </div>
  );
};
