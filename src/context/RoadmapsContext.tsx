import React, { createContext, useContext, useState, useEffect } from 'react';
import { Roadmap, RoadmapPhase, RoadmapTask } from '../types/roadmap';
import { parseAiRoadmapText } from '../utils/roadmapParser';

interface RoadmapsContextType {
  roadmaps: Roadmap[];
  activeRoadmapId: string;
  activeRoadmap: Roadmap | null;
  setActiveRoadmapId: (id: string) => void;
  createRoadmapFromText: (rawText: string) => string;
  createEmptyRoadmap: (title?: string) => string;
  deleteRoadmap: (id: string) => void;
  updateRoadmapTitle: (id: string, title: string) => void;
  
  // Phase Operations
  addPhase: (roadmapId: string, title: string, deadline?: string) => void;
  updatePhase: (roadmapId: string, phaseId: string, updates: Partial<RoadmapPhase>) => void;
  deletePhase: (roadmapId: string, phaseId: string) => void;
  
  // Task Operations
  addTask: (roadmapId: string, phaseId: string, title: string, deadline?: string) => void;
  updateTask: (roadmapId: string, phaseId: string, taskId: string, updates: Partial<RoadmapTask>) => void;
  deleteTask: (roadmapId: string, phaseId: string, taskId: string) => void;
  toggleTaskCompletion: (roadmapId: string, phaseId: string, taskId: string) => void;
  moveTask: (roadmapId: string, phaseId: string, taskId: string, direction: 'up' | 'down') => void;

  // Analytics
  getRoadmapProgress: (roadmap: Roadmap) => {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
  };
}

const STORAGE_KEY = 'arcritual_roadmaps_v1';

const INITIAL_ROADMAPS: Roadmap[] = [
  {
    id: 'rm_network',
    title: 'Network Engineering Mastery',
    description: 'Generated from AI study syllabus covering OSI, TCP/IP, and enterprise routing.',
    createdAt: '2026-09-15',
    phases: [
      {
        id: 'p1',
        title: 'Phase 1: Networking Fundamentals',
        deadline: 'Week 1–2',
        tasks: [
          { id: 't1', title: 'OSI 7-Layer Reference Model & Encapsulation', completed: true },
          { id: 't2', title: 'TCP/IP Protocol Suite & Handshake Mechanisms', completed: true },
          { id: 't3', title: 'IPv4 Addressing & VLSM Subnetting Mastery', completed: false, deadline: 'Oct 5' },
          { id: 't4', title: 'Packet Capture & Inspection via Wireshark', completed: false, deadline: 'Oct 8' },
        ],
      },
      {
        id: 'p2',
        title: 'Phase 2: Routing Protocols & Tables',
        deadline: 'Week 3–4',
        tasks: [
          { id: 't5', title: 'Routing Information Base & Next-Hop Lookups', completed: false },
          { id: 't6', title: 'Static Routing Configurations & Floating Defaults', completed: false },
          { id: 't7', title: 'Dynamic Link-State Routing: OSPF Single Area', completed: false },
          { id: 't8', title: 'BGP Path Attributes & Peering Basics', completed: false },
        ],
      },
      {
        id: 'p3',
        title: 'Phase 3: Enterprise Architecture & Defense',
        deadline: 'Week 5–6',
        tasks: [
          { id: 't9', title: 'Stateful Firewalls & Extended ACLs', completed: false },
          { id: 't10', title: 'Site-to-Site IPsec VPN Tunnels', completed: false },
        ],
      },
    ],
  },
  {
    id: 'rm_core_os',
    title: 'Arcritual OS Core Architecture & Protocol',
    description: 'Q4 2026 Horizon focusing on design tokens, personal command center, and local persistence.',
    createdAt: '2026-09-01',
    phases: [
      {
        id: 'p10',
        title: 'Phase 1: Token Architecture & Typography Scale',
        deadline: 'Sprint 1',
        tasks: [
          { id: 't11', title: 'Establish 60-30-10 palette tokens and semantic CSS variables', completed: true },
          { id: 't12', title: 'Integrate Plus Jakarta Sans & JetBrains Mono with tabular figures', completed: true },
          { id: 't13', title: 'Build unboxed typography primitives and metadata lists', completed: true },
        ],
      },
      {
        id: 'p11',
        title: 'Phase 2: Command Navigation & Habit System',
        deadline: 'Sprint 2',
        tasks: [
          { id: 't14', title: 'Implement responsive sidebar with 16px icons and zero pills', completed: true },
          { id: 't15', title: 'Build interactive Habit Systems engine with 30-day matrix', completed: true },
          { id: 't16', title: 'Sync habit completions with Overview dashboard progress', completed: true },
        ],
      },
      {
        id: 'p12',
        title: 'Phase 3: Natural Language AI Roadmap Converter',
        deadline: 'Sprint 3',
        tasks: [
          { id: 't17', title: 'Create intelligent multi-tier text parser for ChatGPT roadmaps', completed: false, deadline: 'Oct 9' },
          { id: 't18', title: 'Build inline phase reordering, task editing, and deadlines', completed: false },
          { id: 't19', title: 'Local storage synchronization layer', completed: false },
        ],
      },
    ],
  },
];

const RoadmapsContext = createContext<RoadmapsContextType | undefined>(undefined);

export const RoadmapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored roadmaps', e);
        }
      }
    }
    return INITIAL_ROADMAPS;
  });

  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(() => {
    return roadmaps.length > 0 ? roadmaps[0].id : '';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps));
  }, [roadmaps]);

  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0] || null;

  const createRoadmapFromText = (rawText: string): string => {
    const parsed = parseAiRoadmapText(rawText);
    const newId = `rm_${Date.now()}`;
    const newRoadmap: Roadmap = {
      id: newId,
      title: parsed.title,
      description: 'Imported from AI outline.',
      createdAt: new Date().toISOString().split('T')[0],
      phases: parsed.phases,
    };

    setRoadmaps((prev) => [newRoadmap, ...prev]);
    setActiveRoadmapId(newId);
    return newId;
  };

  const createEmptyRoadmap = (title?: string): string => {
    const newId = `rm_${Date.now()}`;
    const newRoadmap: Roadmap = {
      id: newId,
      title: title || 'New Horizon Roadmap',
      createdAt: new Date().toISOString().split('T')[0],
      phases: [
        {
          id: `p_${Date.now()}`,
          title: 'Phase 1: Initial Milestones',
          deadline: 'Horizon 1',
          tasks: [
            { id: `t_${Date.now()}_1`, title: 'Define scope and invariant standards', completed: false },
          ],
        },
      ],
    };
    setRoadmaps((prev) => [newRoadmap, ...prev]);
    setActiveRoadmapId(newId);
    return newId;
  };

  const deleteRoadmap = (id: string) => {
    setRoadmaps((prev) => {
      const remaining = prev.filter((r) => r.id !== id);
      if (activeRoadmapId === id && remaining.length > 0) {
        setActiveRoadmapId(remaining[0].id);
      }
      return remaining;
    });
  };

  const updateRoadmapTitle = (id: string, title: string) => {
    setRoadmaps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, title } : r))
    );
  };

  const addPhase = (roadmapId: string, title: string, deadline?: string) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        const newPhase: RoadmapPhase = {
          id: `phase_${Date.now()}`,
          title,
          deadline,
          tasks: [],
        };
        return { ...r, phases: [...r.phases, newPhase] };
      })
    );
  };

  const updatePhase = (roadmapId: string, phaseId: string, updates: Partial<RoadmapPhase>) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          phases: r.phases.map((p) => (p.id === phaseId ? { ...p, ...updates } : p)),
        };
      })
    );
  };

  const deletePhase = (roadmapId: string, phaseId: string) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          phases: r.phases.filter((p) => p.id !== phaseId),
        };
      })
    );
  };

  const addTask = (roadmapId: string, phaseId: string, title: string, deadline?: string) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          phases: r.phases.map((p) => {
            if (p.id !== phaseId) return p;
            const newTask: RoadmapTask = {
              id: `task_${Date.now()}`,
              title,
              completed: false,
              deadline,
            };
            return { ...p, tasks: [...p.tasks, newTask] };
          }),
        };
      })
    );
  };

  const updateTask = (
    roadmapId: string,
    phaseId: string,
    taskId: string,
    updates: Partial<RoadmapTask>
  ) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          phases: r.phases.map((p) => {
            if (p.id !== phaseId) return p;
            return {
              ...p,
              tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
            };
          }),
        };
      })
    );
  };

  const deleteTask = (roadmapId: string, phaseId: string, taskId: string) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          phases: r.phases.map((p) => {
            if (p.id !== phaseId) return p;
            return {
              ...p,
              tasks: p.tasks.filter((t) => t.id !== taskId),
            };
          }),
        };
      })
    );
  };

  const toggleTaskCompletion = (roadmapId: string, phaseId: string, taskId: string) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          phases: r.phases.map((p) => {
            if (p.id !== phaseId) return p;
            return {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            };
          }),
        };
      })
    );
  };

  const moveTask = (
    roadmapId: string,
    phaseId: string,
    taskId: string,
    direction: 'up' | 'down'
  ) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          phases: r.phases.map((p) => {
            if (p.id !== phaseId) return p;
            const index = p.tasks.findIndex((t) => t.id === taskId);
            if (index === -1) return p;
            if (direction === 'up' && index === 0) return p;
            if (direction === 'down' && index === p.tasks.length - 1) return p;

            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            const newTasks = [...p.tasks];
            const [removed] = newTasks.splice(index, 1);
            newTasks.splice(targetIndex, 0, removed);

            return { ...p, tasks: newTasks };
          }),
        };
      })
    );
  };

  const getRoadmapProgress = (roadmap: Roadmap) => {
    let totalTasks = 0;
    let completedTasks = 0;

    roadmap.phases.forEach((p) => {
      p.tasks.forEach((t) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalTasks, completedTasks, percentage };
  };

  return (
    <RoadmapsContext.Provider
      value={{
        roadmaps,
        activeRoadmapId,
        activeRoadmap,
        setActiveRoadmapId,
        createRoadmapFromText,
        createEmptyRoadmap,
        deleteRoadmap,
        updateRoadmapTitle,
        addPhase,
        updatePhase,
        deletePhase,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        moveTask,
        getRoadmapProgress,
      }}
    >
      {children}
    </RoadmapsContext.Provider>
  );
};

export const useRoadmaps = () => {
  const context = useContext(RoadmapsContext);
  if (!context) {
    throw new Error('useRoadmaps must be used within a RoadmapsProvider');
  }
  return context;
};
