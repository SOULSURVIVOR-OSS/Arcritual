# Arcritual — Personal Command & Productivity OS

A calm, intentional, and high-agency personal productivity and self-improvement operating dashboard. Engineered with a monastic, focused design language, zero visual slop, single-elevation depth, and tabular precision.

---

## 🏛 Architecture Overview

```
Arcritual/
├── src/                               # Frontend Architecture
│   ├── design-system/                 # Layer 1: Core Design System
│   │   ├── tokens.ts                  # Design tokens (Spacing, radius, 60-30-10 palette)
│   │   ├── ThemeContext.tsx           # Dark/Light theme & single-accent state engine
│   │   ├── components/                # Reusable UI Primitives
│   │   │   ├── Typography.tsx         # Heading (H1-H4), Text, Metric, MetadataList, Kicker
│   │   │   ├── Button.tsx             # Primary, Secondary, Ghost, Destructive, Loading
│   │   │   ├── Input.tsx              # TextInput, SearchInput (⌘K), Textarea, Toggle, Select
│   │   │   ├── Navigation.tsx         # TopBar (3-zone), SegmentedControl, Breadcrumb, SidebarItem
│   │   │   ├── Surface.tsx            # Single-elevation Surface, StatDisplay, SectionHeader
│   │   │   ├── Feedback.tsx           # Progress, RingProgress, StatusIndicator, AlertCallout
│   │   │   ├── Modal.tsx              # Accessible dialog with ESC & backdrop handling
│   │   │   ├── Dropdown.tsx           # Popover menu with keyboard accessibility
│   │   │   └── EmptyState.tsx         # Domain-native empty state container
│   │   └── index.ts                   # Design system barrel export
│   │
│   ├── components/                    # Layer 2: Application Shell
│   │   └── AppShell.tsx               # Responsive layout (Desktop sidebar, mobile navigation, TopBar)
│   │
│   ├── pages/                         # Command Center Views
│   │   ├── OverviewPage.tsx           # Daily brief, metric anchors, active session allocations
│   │   ├── HabitsPage.tsx             # Keystone habit systems, morning/deep/evening clusters
│   │   ├── RoadmapsPage.tsx           # Multi-month strategic horizons & milestone checkpoints
│   │   ├── ActivityPage.tsx           # Chronological audit ledger & tabular metrics
│   │   ├── MotivationPage.tsx         # Operating invariants, stoic axioms & reflection prompts
│   │   ├── CalendarPage.tsx           # Protected time-blocking timeline & week view
│   │   ├── SettingsPage.tsx           # System parameters, accent palette & lockdown controls
│   │   └── ProfilePage.tsx            # Operator profile, lifetime statistics & shortcut cheat sheet
│   │
│   ├── App.tsx                        # Root application component wrapped in ThemeProvider
│   ├── index.css                      # Tailwind CSS v4 design tokens and CSS variables
│   └── main.tsx                       # React 19 entry point
│
├── .env.example                       # Clean environment variable template (No secrets)
├── .gitignore                         # Build, dependencies, and local secret exclusion rules
├── index.html                         # HTML5 shell with Plus Jakarta Sans & JetBrains Mono
├── metadata.json                      # Applet manifest and capabilities
├── package.json                       # Dependencies and npm build scripts
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Vite + Tailwind CSS v4 compiler configuration
```

---

## 🎨 Design Constitution (Layer 1)

1. **60-30-10 Color Discipline**:
   - **60% Canvas**: Pure, deep neutral background (`#0C0D0F` dark mode primary; `#F8F8F9` light mode).
   - **30% Structural Surfaces**: Flat panels with 1px hairline borders (`rgba(255, 255, 255, 0.07)` / `#22242A`).
   - **10% Accent Budget**: High-intent accent color strictly reserved for progress bars, active states, and primary CTAs. Curated options: *Ochre Amber*, *Serene Sage*, *Precision Cobalt*, and *Pure Monochrome*.

2. **Zero-Pill Metadata**:
   - Informational metadata (durations, dates, tags) is rendered as clean unboxed text separated by typographic bullets (`·`).
   - Badges and pill capsules are strictly banned for static metadata.

3. **Single-Elevation Depth**:
   - No cards within cards. Whitespace and subtle dividers structure content hierarchy instead of heavy shadows or stacked layers.

4. **Tabular Numerals**:
   - All timestamps, durations, countdowns, and metrics use `font-mono tabular-nums` (JetBrains Mono) to eliminate layout jitter during transitions.

---

## ⚡ Navigation & Application Shell (Layer 2)

- **Left Sidebar**:
  - `Overview` (`⌘1`)
  - `Habits` (`⌘2`)
  - `Roadmaps` (`⌘3`)
  - `Activity` (`⌘4`)
  - `Motivation` (`⌘5`)
  - `Calendar` (`⌘6`)
  - *Bottom*: `Settings` (`⌘,`), `Profile` (`⌘P`)
- **Top Bar**: Current view title, formatted live date, quick search trigger (`⌘K`), instant theme toggle, and operator avatar.
- **Responsive Geometry**:
  - Desktop: Compact 240px sidebar with keyboard shortcut cues.
  - Tablet: Compact, optimized layout.
  - Mobile: Fixed bottom navigation bar (under 15% viewport height) with slide-out drawer menu.

---

## 🎯 Command Center Overview (Layer 3)

The Overview dashboard answers four core questions with intentional sparsity:

1. **What do I need to do today? & How are my habits going?**
   - **Section 01 — Today**: Clean checklist of daily habits with scheduled times, interactive checkboxes, strikethrough completion states, and streak counters.
   - Dynamic top greeting and real-time visual progress bar (`completed of total · % daily focus`).
2. **What am I currently working toward?**
   - **Section 02 — Active Roadmap**: Displays active horizon name (`Arcritual OS Core Architecture & Protocol`), tabular progress percentage (`82%`), accent progress indicator, and next milestone target.
3. **How active have I been?**
   - **Section 03 — Activity**: Minimalist connected services summary (`Strava Synced`): Distance this week (`34.8 km`), logged workouts (`4 sessions`), active days (`5 of 7 days`).
4. **What is scheduled next?**
   - **Section 04 — Upcoming Events**: Next relevant Google Calendar appointments in clean tabular time rows without a cluttered grid.

---

## ⚡ Habit Tracking Engine (Layer 4)

- **Disciplined Lifecycle**: Create, edit, pause, and delete habits with strict anti-gamification (no coins, XP, or badges).
- **Frequency & Timing**: Daily, weekly, or specific days (Mon–Sun), preferred time (e.g. `07:30`), and target goals (e.g. `90m session`).
- **Compact Weekly View**: 7-day Monday–Sunday matrix directly on each habit row with interactive completion toggles.
- **30-Day Matrix**: Monastic consistency matrix detailing verified daily completion ratios and streak tracking.

---

## 🗺 Natural Language AI Roadmap Converter (Layer 5)

- **AI Parsing Engine**: Paste unstructured learning syllabi or outlines from ChatGPT/Claude (`Week 1:`, `Phase 1:`, bullet lists).
- **Structured Horizons**: Automatically generates milestones, phases, tasks, and deadlines.
- **Personal Scope**: In-line task reordering, inline task addition, phase editing, and real-time progress visualization without Jira overhead.
- **Local Persistence**: State synchronized automatically with `localStorage` and the central Command Overview.

---

## 🏃 Strava & Extensible Integrations System (Layer 6)

- **Reusable Integrations Model**: Modular service connector interface (`IntegrationServiceConfig`) pre-architected for Strava, Google Calendar, Whoop, and GitHub.
- **Strava OAuth Flow**:
  - Unconnected state: Explains value proposition and provides instant `"Connect Strava"` trigger with OAuth 2.0 PKCE support and developer configuration view.
  - Connected state: Displays `"Connected to Strava"` with athlete identity and live sync verification.
  - Telemetry: Surfaces running distance, cycling distance, weekly workouts, and 7-day activity timeline without statistical overload.
  - Disconnect control: Allows instant unlinking anytime.
- **Command Overview Sync**: Live sync with Section 3 (`Activity`) on the Overview command center.

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

---

## 🛡 Security & Environment

- All secrets and personal tokens are strictly excluded from source control.
- Configuration is driven by `.env.example`.
