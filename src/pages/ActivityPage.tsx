import React, { useState } from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
  SegmentedControl,
  StatDisplay,
  MetadataList,
  Modal,
} from '../design-system';
import {
  Download,
  Activity as ActivityIcon,
  RefreshCw,
  LogOut,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useIntegrations } from '../context/IntegrationsContext';

export const ActivityPage: React.FC = () => {
  const {
    availableServices,
    isProviderConnected,
    getStravaData,
    connectStrava,
    disconnectProvider,
    syncProvider,
    isSyncing,
  } = useIntegrations();

  const isStravaConnected = isProviderConnected('strava');
  const stravaData = getStravaData();

  const [activeTab, setActiveTab] = useState<'all' | 'focus' | 'vitality' | 'reviews'>('all');
  const [showIntegrationsList, setShowIntegrationsList] = useState(false);
  const [showOAuthDetails, setShowOAuthDetails] = useState(false);

  // Focus and cognitive sessions
  const cognitiveSessions = [
    {
      type: 'focus',
      title: 'Deep Architecture Writing & Spec Definition',
      timestamp: 'Today · 11:15',
      duration: '90m',
      category: 'Core Work',
      notes: 'Finalized token rules, zero-pill discipline, and typography hierarchy.',
    },
    {
      type: 'focus',
      title: 'Compiler & State Management Synthesis',
      timestamp: 'Yesterday · 14:00',
      duration: '120m',
      category: 'Core Work',
      notes: 'Reviewed benchmark data and memory footprints.',
    },
    {
      type: 'reviews',
      title: 'Weekly Retrospective & Horizon Audit #39',
      timestamp: 'Sep 27 · 18:30',
      duration: '45m',
      category: 'Syntheses',
      notes: 'Achieved 22.5 hours of deep cognitive work; adjusted Q4 roadmaps.',
    },
  ];

  const handleSyncAll = () => {
    if (isStravaConnected) {
      syncProvider('strava');
    }
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://app.arcritual.com';
  const callbackUrl = `${currentOrigin}/auth/strava/callback`;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Chronological & Physical Telemetry</Kicker>
          <Heading level={1} className="mt-1">
            Activity & Conditioning
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Unified telemetry combining cognitive focus blocks, habit checkpoints, and physical endurance.
          </Text>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            prefixIcon={
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-accent' : ''}`}
              />
            }
            onClick={handleSyncAll}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Sync Telemetry'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            prefixIcon={<Layers className="w-3.5 h-3.5" />}
            onClick={() => setShowIntegrationsList(!showIntegrationsList)}
          >
            Connected Services
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STRAVA INTEGRATION SECTION */}
      {/* ========================================================================= */}
      {!isStravaConnected ? (
        /* Disconnected State */
        <Surface padding="lg" className="space-y-4 border border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-tertiary">
                  Physical Conditioning Telemetry
                </span>
              </div>
              <h2 className="text-base font-semibold text-primary">
                Strava Integration
              </h2>
              <p className="text-xs text-secondary max-w-xl leading-relaxed">
                Connect Strava to automatically bring your workouts into your daily progress.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                prefixIcon={<ActivityIcon className="w-3.5 h-3.5" />}
                onClick={() => connectStrava()}
                disabled={isSyncing}
              >
                {isSyncing ? 'Connecting...' : 'Connect Strava'}
              </Button>
            </div>
          </div>

          {/* Quick Developer OAuth Info Toggle */}
          <div className="pt-2 border-t border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-tertiary">
            <span>OAuth 2.0 PKCE protocol with granular read scopes.</span>
            <button
              onClick={() => setShowOAuthDetails(!showOAuthDetails)}
              className="text-secondary hover:text-primary transition-colors cursor-pointer text-left sm:text-right"
            >
              {showOAuthDetails ? 'Hide OAuth URI' : 'OAuth Configuration Details →'}
            </button>
          </div>

          {showOAuthDetails && (
            <div className="p-3 bg-surface-subtle/60 rounded-[6px] border border-subtle text-xs space-y-2">
              <span className="text-secondary font-medium block">
                Strava Developer Application Settings:
              </span>
              <div className="font-mono text-[11px] text-tertiary space-y-1">
                <div>
                  <span className="text-secondary">Authorization Callback Domain:</span>{' '}
                  <span className="text-primary">{new URL(currentOrigin).hostname}</span>
                </div>
                <div>
                  <span className="text-secondary">Full Callback URL:</span>{' '}
                  <span className="text-primary">{callbackUrl}</span>
                </div>
              </div>
            </div>
          )}
        </Surface>
      ) : (
        /* Connected State */
        <Surface padding="md" className="space-y-6">
          {/* Header row: Connected to Strava */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-subtle">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-primary">
                  Connected to Strava
                </span>
                <span className="text-tertiary text-xs">·</span>
                <span className="text-xs text-secondary">
                  Athlete: {stravaData?.athleteName} ({stravaData?.athleteHandle})
                </span>
              </div>
              <span className="text-[11px] text-tertiary font-mono block">
                Last verified: {stravaData?.lastSyncAt}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              prefixIcon={<LogOut className="w-3.5 h-3.5" />}
              onClick={() => disconnectProvider('strava')}
            >
              Disconnect Strava
            </Button>
          </div>

          {/* Core Personal Telemetry (Disciplined, not overwhelming) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1">
              <span className="text-xs text-tertiary block">Running Distance (Week)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight text-primary font-mono tabular-nums">
                  {stravaData?.runningDistanceKm}
                </span>
                <span className="text-xs text-tertiary">km</span>
              </div>
              <span className="text-[11px] text-secondary block">
                Zone 2 baseline on track
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-tertiary block">Cycling Distance (Week)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight text-primary font-mono tabular-nums">
                  {stravaData?.cyclingDistanceKm}
                </span>
                <span className="text-xs text-tertiary">km</span>
              </div>
              <span className="text-[11px] text-secondary block">
                Aerobic threshold nominal
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-tertiary block">Workout Count</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight text-primary font-mono tabular-nums">
                  {stravaData?.workoutCount}
                </span>
                <span className="text-xs text-tertiary">sessions logged</span>
              </div>
              <span className="text-[11px] text-secondary block">
                Active days: 5 of 7
              </span>
            </div>
          </div>

          {/* Weekly Activity Matrix (7-day timeline) */}
          <div className="space-y-2 pt-2 border-t border-subtle">
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary font-medium">Weekly Activity Timeline</span>
              <span className="font-mono tabular-nums text-tertiary">
                Total: {(
                  (stravaData?.runningDistanceKm || 0) +
                  (stravaData?.cyclingDistanceKm || 0)
                ).toFixed(1)}{' '}
                km
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {stravaData?.weeklyActivity.map((day) => (
                <div
                  key={day.day}
                  className={`
                    p-2 rounded-[5px] border flex flex-col justify-between h-14 text-center transition-colors
                    ${
                      day.hasActivity
                        ? 'border-accent bg-surface-elevated/60 text-primary'
                        : 'border-subtle bg-surface-subtle/40 text-tertiary'
                    }
                  `}
                >
                  <span className="text-[10px] font-mono">{day.day}</span>
                  <div className="text-xs font-mono tabular-nums font-semibold">
                    {day.hasActivity ? `${day.distanceKm}k` : '—'}
                  </div>
                  <span className="text-[9px] text-tertiary font-mono">
                    {day.type || 'Rest'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities List */}
          <div className="space-y-2 pt-2 border-t border-subtle">
            <span className="text-xs font-medium text-secondary block">
              Recent Strava Activities
            </span>

            <div className="divide-y divide-subtle">
              {stravaData?.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-surface-elevated/30 px-2 -mx-2 rounded-[5px] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`
                        w-6 h-6 rounded-[4px] border flex items-center justify-center font-mono text-[10px] font-semibold shrink-0
                        ${
                          act.type === 'Run'
                            ? 'bg-accent/10 border-accent/40 text-accent'
                            : 'bg-surface-subtle border-subtle text-secondary'
                        }
                      `}
                    >
                      {act.type === 'Run' ? 'RUN' : 'RIDE'}
                    </span>

                    <div className="min-w-0">
                      <span className="text-sm font-medium text-primary block truncate">
                        {act.title}
                      </span>
                      <span className="text-[11px] text-tertiary font-mono tabular-nums">
                        {act.date}
                        {act.avgPaceOrSpeed && ` · ${act.avgPaceOrSpeed}`}
                        {act.heartRateAvg && ` · ${act.heartRateAvg} bpm`}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono tabular-nums">
                    <span className="text-sm font-semibold text-primary block">
                      {act.distanceKm} km
                    </span>
                    <span className="text-[11px] text-tertiary">
                      {act.durationMinutes} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Surface>
      )}

      {/* ========================================================================= */}
      {/* 3. EXTENSIBLE INTEGRATIONS CATALOG DRAWER / VIEW */}
      {/* ========================================================================= */}
      {showIntegrationsList && (
        <Surface padding="md" className="space-y-4 border border-subtle">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-primary">
                Integrations Architecture
              </h3>
              <p className="text-xs text-secondary">
                Modular service connector framework designed for personal data sovereignty.
              </p>
            </div>
            <button
              onClick={() => setShowIntegrationsList(false)}
              className="text-xs text-tertiary hover:text-primary transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {availableServices.map((svc) => {
              const connected = isProviderConnected(svc.id);
              return (
                <div
                  key={svc.id}
                  className="p-3.5 rounded-[6px] border border-subtle bg-surface-subtle/30 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">
                        {svc.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-tertiary">
                        {svc.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-secondary leading-relaxed">
                      {svc.description}
                    </p>
                    <span className="text-[10px] font-mono text-tertiary block">
                      Scopes: {svc.scopes.join(', ')}
                    </span>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {connected ? (
                      <span className="text-[11px] font-mono text-emerald-500 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Connected
                      </span>
                    ) : svc.isAvailable ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (svc.id === 'strava') connectStrava();
                        }}
                      >
                        Connect
                      </Button>
                    ) : (
                      <span className="text-[10px] font-mono text-tertiary border border-subtle px-1.5 py-0.5 rounded">
                        Planned
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>
      )}

      {/* ========================================================================= */}
      {/* 4. COGNITIVE SESSION AUDIT LEDGER */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-subtle pb-2">
          <div>
            <span className="text-[11px] font-medium tracking-wider uppercase text-tertiary block">
              Cognitive Ledger
            </span>
            <h2 className="text-base font-semibold tracking-tight text-primary">
              Focus & Execution Sessions
            </h2>
          </div>

          <SegmentedControl
            size="sm"
            value={activeTab}
            onChange={(v) => setActiveTab(v as any)}
            items={[
              { id: 'all', label: 'All Sessions' },
              { id: 'focus', label: 'Deep Work' },
              { id: 'reviews', label: 'Syntheses' },
            ]}
          />
        </div>

        <Surface padding="none" className="overflow-hidden">
          <div className="divide-y divide-subtle">
            {cognitiveSessions
              .filter((s) => activeTab === 'all' || s.type === activeTab)
              .map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 hover:bg-surface-elevated/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span className="text-sm font-medium text-primary">
                        {item.title}
                      </span>
                      <span className="text-xs text-tertiary select-none">·</span>
                      <span className="text-xs text-secondary">{item.category}</span>
                    </div>
                    <p className="text-xs text-secondary pl-4 leading-relaxed max-w-2xl">
                      {item.notes}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:self-center shrink-0 pl-4 sm:pl-0">
                    <span className="text-xs font-mono tabular-nums text-tertiary">
                      {item.timestamp}
                    </span>
                    <span className="text-xs font-mono font-semibold tabular-nums text-primary bg-surface-subtle px-2 py-0.5 rounded-[4px] border border-subtle">
                      {item.duration}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Surface>
      </div>
    </div>
  );
};
