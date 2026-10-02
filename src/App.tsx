import React from 'react';
import { ThemeProvider } from './design-system';
import { AppShell } from './components/AppShell';

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
