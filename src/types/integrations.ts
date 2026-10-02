export type IntegrationProviderId = 'strava' | 'google_calendar' | 'whoop' | 'github';

export interface IntegrationServiceConfig {
  id: IntegrationProviderId;
  name: string;
  category: 'vitality' | 'schedule' | 'recovery' | 'engineering';
  description: string;
  connectExplanation: string;
  authType: 'oauth2';
  scopes: string[];
  docsUrl?: string;
  isAvailable: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: 'Run' | 'Ride' | 'Workout' | 'Walk' | 'Swim';
  distanceKm?: number;
  durationMinutes: number;
  date: string;
  avgPaceOrSpeed?: string;
  heartRateAvg?: number;
  kudosCount?: number;
}

export interface WeeklyDayActivity {
  day: string; // 'Mon', 'Tue', etc.
  date: string;
  hasActivity: boolean;
  distanceKm: number;
  type?: string;
}

export interface StravaActivityData {
  runningDistanceKm: number;
  cyclingDistanceKm: number;
  workoutCount: number;
  weeklyActivity: WeeklyDayActivity[];
  recentActivities: ActivityItem[];
  athleteName: string;
  athleteHandle: string;
  lastSyncAt: string;
}

export interface IntegrationConnectionState {
  providerId: IntegrationProviderId;
  isConnected: boolean;
  connectedAt?: string;
  data?: StravaActivityData | any;
}
