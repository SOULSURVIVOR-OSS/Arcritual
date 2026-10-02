import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Flame,
  Milestone,
  Activity,
  Sparkles,
  Calendar,
  Settings,
  User,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { useTheme, Modal, TextInput } from '../design-system';
import { OverviewPage } from '../pages/OverviewPage';
import { HabitsPage } from '../pages/HabitsPage';
import { RoadmapsPage } from '../pages/RoadmapsPage';
import { ActivityPage } from '../pages/ActivityPage';
import { MotivationPage } from '../pages/MotivationPage';
import { CalendarPage } from '../pages/CalendarPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';

export type SectionId =
  | 'overview'
  | 'habits'
  | 'roadmaps'
  | 'activity'
  | 'motivation'
  | 'calendar'
  | 'settings'
  | 'profile';

interface NavItemConfig {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
}

const PRIMARY_NAV_ITEMS: NavItemConfig[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, shortcut: '⌘1' },
  { id: 'habits', label: 'Habits', icon: Flame, shortcut: '⌘2' },
  { id: 'roadmaps', label: 'Roadmaps', icon: Milestone, shortcut: '⌘3' },
  { id: 'activity', label: 'Activity', icon: Activity, shortcut: '⌘4' },
  { id: 'motivation', label: 'Motivation', icon: Sparkles, shortcut: '⌘5' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, shortcut: '⌘6' },
];

const BOTTOM_NAV_ITEMS: NavItemConfig[] = [
  { id: 'settings', label: 'Settings', icon: Settings, shortcut: '⌘,' },
  { id: 'profile', label: 'Profile', icon: User, shortcut: '⌘P' },
];

export const AppShell: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Route synchronization via hash (e.g. #overview, #habits, etc.)
  const [currentSection, setCurrentSection] = useState<SectionId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as SectionId;
      const validSections: SectionId[] = [
        'overview',
        'habits',
        'roadmaps',
        'activity',
        'motivation',
        'calendar',
        'settings',
        'profile',
      ];
      if (validSections.includes(hash)) return hash;
    }
    return 'overview';
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Update hash when section changes
  const navigateTo = (section: SectionId) => {
    setCurrentSection(section);
    window.location.hash = section;
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut routing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + K for Quick Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      // CMD/CTRL + 1-6 for Sections
      if (e.metaKey || e.ctrlKey) {
        if (e.key === '1') {
          e.preventDefault();
          navigateTo('overview');
        } else if (e.key === '2') {
          e.preventDefault();
          navigateTo('habits');
        } else if (e.key === '3') {
          e.preventDefault();
          navigateTo('roadmaps');
        } else if (e.key === '4') {
          e.preventDefault();
          navigateTo('activity');
        } else if (e.key === '5') {
          e.preventDefault();
          navigateTo('motivation');
        } else if (e.key === '6') {
          e.preventDefault();
          navigateTo('calendar');
        } else if (e.key === ',') {
          e.preventDefault();
          navigateTo('settings');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Format today's real date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const getPageTitle = (section: SectionId): string => {
    switch (section) {
      case 'overview':
        return 'Overview';
      case 'habits':
        return 'Habits';
      case 'roadmaps':
        return 'Roadmaps';
      case 'activity':
        return 'Activity';
      case 'motivation':
        return 'Motivation';
      case 'calendar':
        return 'Calendar';
      case 'settings':
        return 'Settings';
      case 'profile':
        return 'Profile';
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary flex transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 1. DESKTOP & TABLET SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`
          hidden md:flex flex-col justify-between shrink-0
          w-56 lg:w-60 h-screen sticky top-0
          bg-surface border-r border-subtle z-30 select-none
        `}
      >
        {/* Top: Wordmark / Brand Header */}
        <div>
          <div className="h-14 px-5 flex items-center justify-between border-b border-subtle">
            <button
              onClick={() => navigateTo('overview')}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <span className="text-sm font-semibold tracking-tight text-primary group-hover:opacity-80 transition-opacity">
                Kanso
              </span>
              <span className="text-[10px] font-mono text-tertiary">OS</span>
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" title="Online & Synced" />
          </div>

          {/* Primary Navigation Items */}
          <nav className="p-3 space-y-1" aria-label="Main Navigation">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-medium transition-colors cursor-pointer text-left
                    ${
                      isActive
                        ? 'bg-surface-elevated text-primary border border-subtle shadow-xs'
                        : 'text-secondary hover:text-primary hover:bg-surface-subtle border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-accent' : 'text-tertiary'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono shrink-0 transition-opacity ${
                      isActive ? 'text-secondary opacity-100' : 'text-tertiary opacity-40 hover:opacity-100'
                    }`}
                  >
                    {item.shortcut}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Navigation: Settings & Profile */}
        <div className="p-3 border-t border-subtle space-y-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-medium transition-colors cursor-pointer text-left
                  ${
                    isActive
                      ? 'bg-surface-elevated text-primary border border-subtle'
                      : 'text-secondary hover:text-primary hover:bg-surface-subtle border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-accent' : 'text-tertiary'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="text-[10px] font-mono text-tertiary opacity-50">
                  {item.shortcut}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA & RESPONSIVE TOP BAR */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract: Current page title — Date/context — Minimal actions */}
        <header className="sticky top-0 z-20 w-full h-14 bg-canvas/90 backdrop-blur-md border-b border-subtle px-4 sm:px-8 flex items-center justify-between transition-colors">
          {/* Left Zone: Title & Mobile Drawer Trigger */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 text-secondary hover:text-primary rounded-[6px] transition-colors cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 truncate">
              <span className="text-sm font-semibold tracking-tight text-primary truncate">
                {getPageTitle(currentSection)}
              </span>
              <span className="hidden sm:inline text-tertiary select-none text-xs">·</span>
              <span className="hidden sm:inline text-xs font-mono tabular-nums text-secondary truncate">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Right Zone: Minimal Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Command Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="h-8 px-2.5 text-xs text-secondary hover:text-primary hover:bg-surface-elevated rounded-[6px] border border-subtle flex items-center gap-2 transition-colors cursor-pointer"
              title="Command Search (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-tertiary" />
              <span className="hidden sm:inline text-secondary">Search</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono text-tertiary bg-surface-subtle px-1 py-0.2 rounded border border-subtle">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-secondary hover:text-primary hover:bg-surface-elevated rounded-[6px] transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-tertiary hover:text-primary transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-tertiary hover:text-primary transition-colors" />
              )}
            </button>

            {/* Profile Avatar / Trigger */}
            <button
              type="button"
              onClick={() => navigateTo('profile')}
              className={`
                w-7 h-7 rounded-[6px] border flex items-center justify-center text-xs font-semibold cursor-pointer transition-all
                ${
                  currentSection === 'profile'
                    ? 'border-accent text-accent bg-accent/10 ring-1 ring-accent'
                    : 'border-subtle bg-surface text-secondary hover:text-primary hover:border-strong'
                }
              `}
              title="View Operator Profile"
            >
              PK
            </button>
          </div>
        </header>

        {/* Content Container (Maximum readable width, personal command center feel) */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 md:py-10 pb-24 md:pb-12">
          {currentSection === 'overview' && <OverviewPage onNavigate={(sec) => navigateTo(sec as SectionId)} />}
          {currentSection === 'habits' && <HabitsPage />}
          {currentSection === 'roadmaps' && <RoadmapsPage />}
          {currentSection === 'activity' && <ActivityPage />}
          {currentSection === 'motivation' && <MotivationPage />}
          {currentSection === 'calendar' && <CalendarPage />}
          {currentSection === 'settings' && <SettingsPage />}
          {currentSection === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION (Sticky Cap ≤ 15% Viewport) */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-surface/95 backdrop-blur-md border-t border-subtle flex items-center justify-around px-2"
      >
        {[
          { id: 'overview' as SectionId, label: 'Overview', icon: LayoutDashboard },
          { id: 'habits' as SectionId, label: 'Habits', icon: Flame },
          { id: 'roadmaps' as SectionId, label: 'Roadmaps', icon: Milestone },
          { id: 'calendar' as SectionId, label: 'Calendar', icon: Calendar },
          { id: 'activity' as SectionId, label: 'Activity', icon: Activity },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1 w-14 h-full cursor-pointer transition-colors
                ${isActive ? 'text-accent' : 'text-tertiary hover:text-secondary'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. MOBILE SLIDE-OUT DRAWER FOR FULL MENU */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Card */}
          <div className="relative w-64 max-w-[80vw] h-full bg-surface border-r border-subtle z-10 flex flex-col justify-between p-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-subtle mb-4">
                <span className="text-sm font-semibold tracking-tight text-primary">Kanso OS</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-tertiary hover:text-primary cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium cursor-pointer text-left
                        ${
                          isActive
                            ? 'bg-surface-elevated text-primary font-semibold'
                            : 'text-secondary hover:text-primary hover:bg-surface-subtle'
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-tertiary'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-subtle space-y-1">
              {BOTTOM_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium cursor-pointer text-left
                      ${
                        isActive
                          ? 'bg-surface-elevated text-primary font-semibold'
                          : 'text-secondary hover:text-primary hover:bg-surface-subtle'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-tertiary'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. QUICK COMMAND SEARCH MODAL (⌘K) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Command Navigation"
        description="Jump instantly to any section or focus target."
      >
        <div className="space-y-4 pt-1">
          <TextInput
            placeholder="Type section name or command..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />

          <div className="space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-tertiary block px-1 mb-1">
              Available Horizons
            </span>
            {[
              ...PRIMARY_NAV_ITEMS,
              ...BOTTOM_NAV_ITEMS,
            ]
              .filter((item) =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateTo(item.id);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-[6px] hover:bg-surface-elevated text-xs transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-tertiary" />
                      <span className="text-primary font-medium">{item.label}</span>
                    </div>
                    <span className="font-mono text-[10px] text-tertiary">
                      {item.shortcut}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
