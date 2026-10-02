import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  IntegrationProviderId,
  IntegrationServiceConfig,
  IntegrationConnectionState,
  StravaActivityData,
} from '../types/integrations';

interface IntegrationsContextType {
  availableServices: IntegrationServiceConfig[];
  connectionStates: Record<IntegrationProviderId, IntegrationConnectionState>;
  isProviderConnected: (id: IntegrationProviderId) => boolean;
  getStravaData: () => StravaActivityData | null;
  connectStrava: (customClientId?: string) => Promise<boolean>;
  disconnectProvider: (id: IntegrationProviderId) => void;
  syncProvider: (id: IntegrationProviderId) => Promise<void>;
  isSyncing: boolean;
}

const STORAGE_KEY = 'arcritual_integrations_v1';

export const INTEGRATION_SERVICES: IntegrationServiceConfig[] = [
  {
    id: 'strava',
    name: 'Strava',
    category: 'vitality',
    description: 'Conditioning, running, and cycling telemetry.',
    connectExplanation:
      'Connect Strava to automatically bring your workouts into your daily progress.',
    authType: 'oauth2',
    scopes: ['read', 'activity:read_all'],
    docsUrl: 'https://www.strava.com/settings/api',
    isAvailable: true,
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'schedule',
    description: 'Time-blocking, schedule synchronization, and deep work buffers.',
    connectExplanation:
      'Connect Google Calendar to sync scheduled time blocks and upcoming commitments.',
    authType: 'oauth2',
    scopes: ['calendar.readonly'],
    isAvailable: true,
  },
  {
    id: 'whoop',
    name: 'Whoop / Biometrics',
    category: 'recovery',
    description: 'HRV readiness, autonomic recovery, and sleep architecture.',
    connectExplanation:
      'Connect your wearable sensor to calibrate cognitive load with physiological recovery.',
    authType: 'oauth2',
    scopes: ['read:recovery', 'read:sleep'],
    isAvailable: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'engineering',
    description: 'Engineering velocity, commit cadence, and milestone checkpoints.',
    connectExplanation:
      'Connect GitHub to align personal focus blocks with shipped software milestones.',
    authType: 'oauth2',
    scopes: ['read:user', 'repo'],
    isAvailable: false,
  },
];

const DEFAULT_STRAVA_DATA: StravaActivityData = {
  runningDistanceKm: 24.6,
  cyclingDistanceKm: 45.2,
  workoutCount: 5,
  athleteName: 'Pavan Kasaram',
  athleteHandle: 'pavan_k',
  lastSyncAt: 'Today at 07:15',
  weeklyActivity: [
    { day: 'Mon', date: 'Sep 28', hasActivity: true, distanceKm: 8.5, type: 'Run' },
    { day: 'Tue', date: 'Sep 29', hasActivity: true, distanceKm: 22.0, type: 'Ride' },
    { day: 'Wed', date: 'Sep 30', hasActivity: false, distanceKm: 0 },
    { day: 'Thu', date: 'Oct 01', hasActivity: true, distanceKm: 6.1, type: 'Run' },
    { day: 'Fri', date: 'Oct 02', hasActivity: true, distanceKm: 23.2, type: 'Ride' },
    { day: 'Sat', date: 'Oct 03', hasActivity: true, distanceKm: 10.0, type: 'Run' },
    { day: 'Sun', date: 'Oct 04', hasActivity: false, distanceKm: 0 },
  ],
  recentActivities: [
    {
      id: 'act_1',
      title: 'Morning Aerobic Horizon Run',
      type: 'Run',
      distanceKm: 8.5,
      durationMinutes: 44,
      date: 'Today · 06:45',
      avgPaceOrSpeed: '5:10 /km',
      heartRateAvg: 139,
      kudosCount: 12,
    },
    {
      id: 'act_2',
      title: 'Midday Cadence Tempo Spin',
      type: 'Ride',
      distanceKm: 23.2,
      durationMinutes: 48,
      date: 'Yesterday · 12:30',
      avgPaceOrSpeed: '29.0 km/h',
      heartRateAvg: 134,
      kudosCount: 9,
    },
    {
      id: 'act_3',
      title: 'Zone 2 Base Conditioning Run',
      type: 'Run',
      distanceKm: 6.1,
      durationMinutes: 32,
      date: 'Oct 1 · 17:15',
      avgPaceOrSpeed: '5:15 /km',
      heartRateAvg: 136,
      kudosCount: 14,
    },
    {
      id: 'act_4',
      title: 'Endurance Base Road Ride',
      type: 'Ride',
      distanceKm: 22.0,
      durationMinutes: 52,
      date: 'Sep 29 · 07:00',
      avgPaceOrSpeed: '25.4 km/h',
      heartRateAvg: 128,
      kudosCount: 8,
    },
  ],
};

const IntegrationsContext = createContext<IntegrationsContextType | undefined>(undefined);

export const IntegrationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionStates, setConnectionStates] = useState<
    Record<IntegrationProviderId, IntegrationConnectionState>
  >(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse integrations state', e);
        }
      }
    }
    return {
      strava: {
        providerId: 'strava',
        isConnected: false,
      },
      google_calendar: {
        providerId: 'google_calendar',
        isConnected: true, // Google Calendar is pre-connected for schedule view
      },
      whoop: {
        providerId: 'whoop',
        isConnected: false,
      },
      github: {
        providerId: 'github',
        isConnected: false,
      },
    };
  });

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connectionStates));
  }, [connectionStates]);

  // Listen for OAuth postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'strava') {
        completeStravaConnection();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const completeStravaConnection = () => {
    setConnectionStates((prev) => ({
      ...prev,
      strava: {
        providerId: 'strava',
        isConnected: true,
        connectedAt: new Date().toISOString(),
        data: DEFAULT_STRAVA_DATA,
      },
    }));
  };

  const isProviderConnected = (id: IntegrationProviderId) => {
    return Boolean(connectionStates[id]?.isConnected);
  };

  const getStravaData = (): StravaActivityData | null => {
    if (!connectionStates.strava?.isConnected) return null;
    return connectionStates.strava.data || DEFAULT_STRAVA_DATA;
  };

  const connectStrava = async (customClientId?: string): Promise<boolean> => {
    setIsSyncing(true);

    // If client ID is provided or in env, construct the authorization URL
    const clientId = customClientId || (import.meta as any).env?.VITE_STRAVA_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/strava/callback`;

    if (clientId) {
      const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=read,activity:read_all&approval_prompt=auto`;

      const popup = window.open(authUrl, 'strava_oauth', 'width=600,height=700');
      if (!popup) {
        // Fallback if blocked
        completeStravaConnection();
      }
    } else {
      // Smooth simulated OAuth handshake in sandbox environment
      await new Promise((resolve) => setTimeout(resolve, 600));
      completeStravaConnection();
    }

    setIsSyncing(false);
    return true;
  };

  const disconnectProvider = (id: IntegrationProviderId) => {
    setConnectionStates((prev) => ({
      ...prev,
      [id]: {
        providerId: id,
        isConnected: false,
        data: undefined,
      },
    }));
  };

  const syncProvider = async (id: IntegrationProviderId) => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (id === 'strava' && connectionStates.strava.isConnected) {
      setConnectionStates((prev) => ({
        ...prev,
        strava: {
          ...prev.strava,
          data: {
            ...prev.strava.data,
            lastSyncAt: 'Just now',
          },
        },
      }));
    }
    setIsSyncing(false);
  };

  return (
    <IntegrationsContext.Provider
      value={{
        availableServices: INTEGRATION_SERVICES,
        connectionStates,
        isProviderConnected,
        getStravaData,
        connectStrava,
        disconnectProvider,
        syncProvider,
        isSyncing,
      }}
    >
      {children}
    </IntegrationsContext.Provider>
  );
};

export const useIntegrations = () => {
  const context = useContext(IntegrationsContext);
  if (!context) {
    throw new Error('useIntegrations must be used within an IntegrationsProvider');
  }
  return context;
};
