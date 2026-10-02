import React from 'react';
import { ThemeProvider } from './design-system';
import { HabitsProvider } from './context/HabitsContext';
import { RoadmapsProvider } from './context/RoadmapsContext';
import { IntegrationsProvider } from './context/IntegrationsContext';
import { AppShell } from './components/AppShell';

export default function App() {
  return (
    <ThemeProvider>
      <HabitsProvider>
        <RoadmapsProvider>
          <IntegrationsProvider>
            <AppShell />
          </IntegrationsProvider>
        </RoadmapsProvider>
      </HabitsProvider>
    </ThemeProvider>
  );
}
