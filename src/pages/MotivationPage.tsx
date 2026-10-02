import React from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
} from '../design-system';
import { Sparkles, BookOpen, Quote, Shield } from 'lucide-react';

export const MotivationPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>First Principles & Philosophy</Kicker>
          <Heading level={1} className="mt-1">
            Motivation & Invariants
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Mental models, core axioms, and stoic reflections grounding your everyday focus.
          </Text>
        </div>
        <Button variant="secondary" size="sm">
          Write Reflection
        </Button>
      </div>

      {/* Featured Anchor Aphorism */}
      <Surface padding="lg" className="border-l-2 border-l-accent">
        <Kicker>Core Axiom of Action</Kicker>
        <blockquote className="mt-3 text-lg md:text-xl font-medium tracking-tight text-primary leading-snug italic [text-wrap:balance]">
          "You have power over your mind - not outside events. Realize this, and you will find strength."
        </blockquote>
        <div className="mt-4 flex items-center justify-between text-xs text-secondary">
          <span>— Marcus Aurelius, Meditations (Book IV)</span>
          <span className="font-mono text-tertiary">Invariant 01</span>
        </div>
      </Surface>

      {/* Personal Operating Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Surface padding="md" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-accent font-semibold">01.</span>
            <span className="text-sm font-semibold text-primary">The Law of Cognitive Conservation</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Willpower is finite and depletes through context-switching. Do not rely on discipline in hostile environments; design systems where distraction is structurally impossible.
          </p>
        </Surface>

        <Surface padding="md" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-accent font-semibold">02.</span>
            <span className="text-sm font-semibold text-primary">Process Over Outcome Fixation</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Outcomes belong to the external world; flawless adherence to the daily 90-minute block belongs to you. Judge each day strictly by the execution of your chosen standard.
          </p>
        </Surface>

        <Surface padding="md" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-accent font-semibold">03.</span>
            <span className="text-sm font-semibold text-primary">Silence as an Active Tool</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Constant low-grade stimulation dulls pattern recognition. Protect blocks of uninterrupted, sensory-deprived focus to allow deep neural consolidation to occur.
          </p>
        </Surface>

        <Surface padding="md" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-accent font-semibold">04.</span>
            <span className="text-sm font-semibold text-primary">The Horizon Rule</span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Measure progress in 90-day quarters rather than hourly fluctuations. Consistency over weeks compounds exponentially beyond any single heroic sprint.
          </p>
        </Surface>
      </div>

      {/* Daily Retrospective Prompt */}
      <Surface padding="md">
        <span className="text-xs font-semibold text-primary block mb-1">
          Evening Retrospective Question
        </span>
        <p className="text-xs text-secondary mb-3">
          "Did you avoid shallow distraction and commit your primary energy to your highest-leverage objective today?"
        </p>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm">
            Log Affirmation
          </Button>
          <Button variant="ghost" size="sm">
            Add Field Note
          </Button>
        </div>
      </Surface>
    </div>
  );
};
