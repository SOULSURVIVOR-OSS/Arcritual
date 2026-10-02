import React from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
  Progress,
  MetadataList,
} from '../design-system';
import { Plus, ArrowRight, Milestone } from 'lucide-react';

export const RoadmapsPage: React.FC = () => {
  const roadmaps = [
    {
      title: 'Kanso OS Core Framework & Architecture',
      horizon: 'Q4 2026 Horizon',
      progress: 85,
      status: 'In Progress',
      deliverables: '12 of 14 deliverables shipped',
      milestones: [
        { label: 'Token architecture & typography scale', done: true },
        { label: 'Application shell & responsive navigation', done: true },
        { label: 'Persistent state synchronization layer', done: false },
        { label: 'Telemetry & local export pipeline', done: false },
      ],
    },
    {
      title: 'Physical Vitality & Metabolic Conditioning',
      horizon: 'Annual 2026 Objective',
      progress: 60,
      status: 'On Track',
      deliverables: '3 of 5 phases completed',
      milestones: [
        { label: 'Sub-45 minute 10K aerodynamic standard', done: true },
        { label: 'Zone 2 aerobic threshold expansion (180 mins/wk)', done: true },
        { label: 'Consistent cold immersion baseline (3x/wk)', done: false },
      ],
    },
    {
      title: 'Monograph: Deep Cognitive Ergonomics',
      horizon: 'Q1 2027 Horizon',
      progress: 32,
      status: 'Early Stage',
      deliverables: '8 of 25 chapters drafted',
      milestones: [
        { label: 'Core literature review & notes synthesis', done: true },
        { label: 'Chapter outline & structural argumentation', done: true },
        { label: 'Drafting Phase 1: The Distraction Economy', done: false },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Strategic Intent</Kicker>
          <Heading level={1} className="mt-1">
            Roadmaps & Milestones
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Multi-month horizons translating core philosophy into measurable execution phases.
          </Text>
        </div>
        <Button
          variant="primary"
          size="sm"
          prefixIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Strategic Horizon
        </Button>
      </div>

      {/* Roadmaps List */}
      <div className="space-y-6">
        {roadmaps.map((map, i) => (
          <Surface key={i} padding="md" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <MetadataList items={[map.horizon, map.status]} className="mb-1" />
                <h3 className="text-base font-semibold text-primary">{map.title}</h3>
              </div>
              <span className="text-xs font-mono tabular-nums text-secondary">
                {map.deliverables}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-tertiary">Horizon Completion</span>
                <span className="font-mono tabular-nums font-semibold text-accent">
                  {map.progress}%
                </span>
              </div>
              <Progress value={map.progress} showValue={false} />
            </div>

            {/* Sub-Milestones */}
            <div className="pt-2 border-t border-subtle">
              <span className="text-[11px] font-medium uppercase tracking-wider text-tertiary block mb-2">
                Phase Checkpoints
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {map.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-secondary">
                    <span
                      className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0 ${
                        m.done
                          ? 'bg-accent/15 border-accent text-accent'
                          : 'border-subtle bg-surface-subtle'
                      }`}
                    >
                      {m.done && <span className="text-[10px]">✓</span>}
                    </span>
                    <span className={m.done ? 'line-through text-tertiary' : 'text-primary'}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
};
