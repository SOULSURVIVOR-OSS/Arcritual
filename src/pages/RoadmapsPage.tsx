import React, { useState } from 'react';
import {
  Heading,
  Text,
  Kicker,
  Surface,
  Button,
  Progress,
  MetadataList,
  Modal,
} from '../design-system';
import {
  Plus,
  Check,
  Sparkles,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Calendar,
  ChevronDown,
  FolderPlus,
  BookOpen,
  X,
} from 'lucide-react';
import { useRoadmaps } from '../context/RoadmapsContext';
import { RoadmapPhase, RoadmapTask } from '../types/roadmap';

const SAMPLE_AI_INPUT = `Network Engineering Mastery
Week 1: Networking Fundamentals
- OSI 7-Layer Reference Model & Encapsulation
- TCP/IP Protocol Suite & 3-Way Handshake
- IPv4 Addressing & VLSM Subnetting Mastery
- Packet Capture Analysis via Wireshark

Week 2: Enterprise Routing
- Routing Information Base & Next-Hop Lookups
- Static Routing Configurations & Floating Defaults
- Dynamic Link-State Routing: OSPF Single Area
- BGP Path Attributes & Peering Basics

Week 3: Enterprise Architecture & Defense
- Stateful Firewalls & Extended ACLs
- Site-to-Site IPsec VPN Tunnels
- Zero Trust Architecture Principles`;

export const RoadmapsPage: React.FC = () => {
  const {
    roadmaps,
    activeRoadmapId,
    activeRoadmap,
    setActiveRoadmapId,
    createRoadmapFromText,
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
  } = useRoadmaps();

  // Converter state
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [pasteInputText, setPasteInputText] = useState('');
  const [pasteError, setPasteError] = useState('');

  // Editing state
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  // New task inline input state: record of phaseId -> task string
  const [newTaskInput, setNewTaskInput] = useState<Record<string, string>>({});
  const [newPhaseInput, setNewPhaseInput] = useState('');
  const [showAddPhase, setShowAddPhase] = useState(false);

  // Edit task modal/inline
  const [editingTask, setEditingTask] = useState<{
    phaseId: string;
    task: RoadmapTask;
  } | null>(null);

  // Edit phase modal/inline
  const [editingPhase, setEditingPhase] = useState<RoadmapPhase | null>(null);

  const handleConvert = () => {
    if (!pasteInputText.trim()) {
      setPasteError('Please paste your roadmap text before converting.');
      return;
    }

    createRoadmapFromText(pasteInputText);
    setPasteInputText('');
    setPasteError('');
    setIsConverterOpen(false);
  };

  const handleLoadSample = () => {
    setPasteInputText(SAMPLE_AI_INPUT);
    setPasteError('');
  };

  const handleAddTaskToPhase = (phaseId: string) => {
    const text = (newTaskInput[phaseId] || '').trim();
    if (!text || !activeRoadmap) return;

    addTask(activeRoadmap.id, phaseId, text);
    setNewTaskInput((prev) => ({ ...prev, [phaseId]: '' }));
  };

  const handleAddPhaseSubmit = () => {
    if (!newPhaseInput.trim() || !activeRoadmap) return;
    addPhase(activeRoadmap.id, newPhaseInput.trim());
    setNewPhaseInput('');
    setShowAddPhase(false);
  };

  const progress = activeRoadmap
    ? getRoadmapProgress(activeRoadmap)
    : { totalTasks: 0, completedTasks: 0, percentage: 0 };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER & ROADMAP PICKER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-subtle">
        <div>
          <Kicker>Strategic Intent & Horizons</Kicker>
          <Heading level={1} className="mt-1">
            Personal Roadmaps
          </Heading>
          <Text variant="body" className="mt-1 text-secondary">
            Convert messy AI learning syllabi and project outlines into clean, executable personal roadmaps.
          </Text>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            prefixIcon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => setIsConverterOpen(true)}
          >
            Convert AI Roadmap
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ROADMAP SWITCHER TABS (If multiple exist) */}
      {/* ========================================================================= */}
      {roadmaps.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-b border-subtle pb-3 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {roadmaps.map((rm) => {
              const isActive = rm.id === activeRoadmapId;
              const p = getRoadmapProgress(rm);
              return (
                <button
                  key={rm.id}
                  onClick={() => setActiveRoadmapId(rm.id)}
                  className={`
                    px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0
                    ${
                      isActive
                        ? 'bg-surface-elevated text-primary border border-subtle shadow-xs'
                        : 'text-secondary hover:text-primary hover:bg-surface-subtle border border-transparent'
                    }
                  `}
                >
                  <span className="truncate max-w-[200px]">{rm.title}</span>
                  <span className="text-[10px] font-mono tabular-nums text-tertiary">
                    {p.percentage}%
                  </span>
                </button>
              );
            })}
          </div>

          {activeRoadmap && roadmaps.length > 1 && (
            <button
              onClick={() => deleteRoadmap(activeRoadmap.id)}
              className="text-xs text-tertiary hover:text-red-500 transition-colors p-1"
              title="Delete this roadmap"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EMPTY STATE (When no roadmaps exist or user hasn't imported yet) */}
      {/* ========================================================================= */}
      {roadmaps.length === 0 ? (
        <Surface padding="lg" className="text-center py-12 space-y-4">
          <div className="w-12 h-12 rounded-[8px] bg-surface-subtle border border-subtle flex items-center justify-center mx-auto text-tertiary">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-semibold text-primary">No Roadmaps Active</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Ask ChatGPT or another AI for a learning plan or project milestones, copy the response, and paste it here. Arcritual converts messy text into a disciplined roadmap.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            prefixIcon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={() => setIsConverterOpen(true)}
          >
            Paste your roadmap here
          </Button>
        </Surface>
      ) : activeRoadmap ? (
        /* ========================================================================= */
        /* 4. ACTIVE STRUCTURED ROADMAP VIEW */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Roadmap Header & Progress Summary */}
          <Surface padding="md" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div className="space-y-1">
                {editingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="text-lg font-semibold bg-surface-subtle border border-subtle rounded px-2 py-0.5 text-primary focus:outline-none focus:border-accent"
                      autoFocus
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        if (tempTitle.trim()) updateRoadmapTitle(activeRoadmap.id, tempTitle.trim());
                        setEditingTitle(false);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-lg font-semibold tracking-tight text-primary">
                      {activeRoadmap.title}
                    </h2>
                    <button
                      onClick={() => {
                        setTempTitle(activeRoadmap.title);
                        setEditingTitle(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-tertiary hover:text-primary transition-opacity cursor-pointer p-0.5"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <MetadataList
                  items={[
                    `${activeRoadmap.phases.length} phases`,
                    `${progress.completedTasks} of ${progress.totalTasks} deliverables shipped`,
                    `Created ${activeRoadmap.createdAt}`,
                  ]}
                />
              </div>

              {/* Progress readout */}
              <div className="text-right shrink-0">
                <span className="text-xs font-mono tabular-nums font-semibold text-accent block">
                  {progress.percentage}% COMPLETE
                </span>
                <span className="text-[11px] text-tertiary">
                  {progress.totalTasks - progress.completedTasks} tasks remaining
                </span>
              </div>
            </div>

            {/* Clean Progress Visualization */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden border border-subtle">
                <div
                  className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          </Surface>

          {/* Phases Container */}
          <div className="space-y-6">
            {activeRoadmap.phases.map((phase, pIndex) => {
              const phaseCompleted = phase.tasks.filter((t) => t.completed).length;
              const phaseTotal = phase.tasks.length;
              const phasePct = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;

              return (
                <Surface key={phase.id} padding="none" className="overflow-hidden">
                  {/* Phase Header */}
                  <div className="p-4 sm:px-5 bg-surface-subtle/50 border-b border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-tertiary block">
                          Phase 0{pIndex + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-primary">
                          {phase.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {phase.deadline && (
                        <span className="font-mono text-tertiary bg-surface px-2 py-0.5 rounded border border-subtle">
                          {phase.deadline}
                        </span>
                      )}
                      <span className="font-mono tabular-nums text-secondary">
                        {phaseCompleted}/{phaseTotal} ({phasePct}%)
                      </span>

                      <button
                        onClick={() => setEditingPhase(phase)}
                        className="text-tertiary hover:text-primary transition-colors p-1"
                        title="Edit phase"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => deletePhase(activeRoadmap.id, phase.id)}
                        className="text-tertiary hover:text-red-500 transition-colors p-1"
                        title="Delete phase"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="divide-y divide-subtle">
                    {phase.tasks.map((task, tIndex) => (
                      <div
                        key={task.id}
                        className="p-3 sm:px-5 flex items-center justify-between gap-3 hover:bg-surface-elevated/40 transition-colors group"
                      >
                        {/* Left: Checkbox + Title */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={task.completed}
                            onClick={() => toggleTaskCompletion(activeRoadmap.id, phase.id, task.id)}
                            className={`
                              w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 cursor-pointer
                              ${
                                task.completed
                                  ? 'bg-accent border-accent text-accent-foreground'
                                  : 'border-subtle bg-surface-subtle hover:border-strong'
                              }
                            `}
                          >
                            {task.completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                          </button>

                          <span
                            onClick={() => toggleTaskCompletion(activeRoadmap.id, phase.id, task.id)}
                            className={`text-xs cursor-pointer truncate ${
                              task.completed
                                ? 'text-secondary line-through select-none'
                                : 'text-primary font-normal'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        {/* Right: Deadline & Actions */}
                        <div className="flex items-center gap-2 shrink-0 text-xs">
                          {task.deadline && (
                            <span className="text-[11px] font-mono text-tertiary bg-surface-subtle px-1.5 py-0.5 rounded border border-subtle">
                              {task.deadline}
                            </span>
                          )}

                          {/* Reordering Controls */}
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                            <button
                              type="button"
                              onClick={() => moveTask(activeRoadmap.id, phase.id, task.id, 'up')}
                              disabled={tIndex === 0}
                              className="p-1 text-tertiary hover:text-primary disabled:opacity-20 cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveTask(activeRoadmap.id, phase.id, task.id, 'down')}
                              disabled={tIndex === phase.tasks.length - 1}
                              className="p-1 text-tertiary hover:text-primary disabled:opacity-20 cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTask({ phaseId: phase.id, task })}
                              className="p-1 text-tertiary hover:text-primary cursor-pointer"
                              title="Edit task"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTask(activeRoadmap.id, phase.id, task.id)}
                              className="p-1 text-tertiary hover:text-red-500 cursor-pointer"
                              title="Delete task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inline Add Task Row */}
                  <div className="p-3 sm:px-5 bg-surface-subtle/20 border-t border-subtle flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add milestone task to this phase..."
                      value={newTaskInput[phase.id] || ''}
                      onChange={(e) =>
                        setNewTaskInput((prev) => ({ ...prev, [phase.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTaskToPhase(phase.id);
                      }}
                      className="text-xs bg-transparent border-0 text-primary placeholder:text-tertiary flex-1 focus:outline-none"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddTaskToPhase(phase.id)}
                    >
                      Add
                    </Button>
                  </div>
                </Surface>
              );
            })}

            {/* Add New Phase Button / Form */}
            {showAddPhase ? (
              <Surface padding="md" className="space-y-3">
                <span className="text-xs font-semibold text-primary block">Create New Phase</span>
                <input
                  type="text"
                  placeholder="Phase title (e.g. Phase 4: Production Deployment)"
                  value={newPhaseInput}
                  onChange={(e) => setNewPhaseInput(e.target.value)}
                  className="w-full text-xs bg-surface-subtle border border-subtle rounded-[6px] p-2 text-primary focus:outline-none focus:border-accent"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" onClick={handleAddPhaseSubmit}>
                    Add Phase
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddPhase(false)}>
                    Cancel
                  </Button>
                </div>
              </Surface>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                prefixIcon={<FolderPlus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddPhase(true)}
              >
                Add Another Phase
              </Button>
            )}
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 5. AI ROADMAP CONVERTER MODAL (Large Input Area) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        title="AI Roadmap Converter"
        description="Paste an unstructured learning plan or outline from ChatGPT, Claude, or any AI to automatically generate a personal roadmap."
      >
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary font-medium">Input Outline</span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-accent hover:underline cursor-pointer flex items-center gap-1 font-mono text-[11px]"
            >
              <Sparkles className="w-3 h-3" />
              Load Sample AI Output
            </button>
          </div>

          {/* Large Input Area */}
          <textarea
            rows={10}
            placeholder="Paste your roadmap here...&#10;&#10;Example:&#10;Week 1: Learn networking basics&#10;- OSI model&#10;- TCP/IP&#10;- IP addressing&#10;&#10;Week 2: Learn routing&#10;- routing tables&#10;- static routing"
            value={pasteInputText}
            onChange={(e) => {
              setPasteInputText(e.target.value);
              if (pasteError) setPasteError('');
            }}
            className="w-full text-xs font-mono p-3 rounded-[6px] bg-surface-subtle border border-subtle text-primary placeholder:text-tertiary focus:outline-none focus:border-accent leading-relaxed resize-y"
            autoFocus
          />

          {pasteError && (
            <p className="text-xs text-red-500 font-medium">{pasteError}</p>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-subtle">
            <span className="text-[11px] text-tertiary">
              Converts weeks, phases, and bullets automatically.
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsConverterOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                prefixIcon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={handleConvert}
              >
                Convert to roadmap
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 6. EDIT TASK MODAL */}
      {/* ========================================================================= */}
      {editingTask && activeRoadmap && (
        <Modal
          isOpen={true}
          onClose={() => setEditingTask(null)}
          title="Edit Milestone Task"
          primaryAction={{
            label: 'Save Task',
            onClick: () => setEditingTask(null),
          }}
        >
          <div className="space-y-4 pt-1">
            <div>
              <label className="text-xs text-secondary block mb-1">Task Title</label>
              <input
                type="text"
                value={editingTask.task.title}
                onChange={(e) =>
                  updateTask(activeRoadmap.id, editingTask.phaseId, editingTask.task.id, {
                    title: e.target.value,
                  })
                }
                className="w-full text-xs p-2.5 rounded bg-surface-subtle border border-subtle text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-secondary block mb-1">Optional Deadline</label>
              <input
                type="text"
                placeholder="e.g. Oct 15 or Week 2"
                value={editingTask.task.deadline || ''}
                onChange={(e) =>
                  updateTask(activeRoadmap.id, editingTask.phaseId, editingTask.task.id, {
                    deadline: e.target.value || undefined,
                  })
                }
                className="w-full text-xs p-2.5 rounded bg-surface-subtle border border-subtle text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 7. EDIT PHASE MODAL */}
      {/* ========================================================================= */}
      {editingPhase && activeRoadmap && (
        <Modal
          isOpen={true}
          onClose={() => setEditingPhase(null)}
          title="Edit Phase"
          primaryAction={{
            label: 'Save Phase',
            onClick: () => setEditingPhase(null),
          }}
        >
          <div className="space-y-4 pt-1">
            <div>
              <label className="text-xs text-secondary block mb-1">Phase Title</label>
              <input
                type="text"
                value={editingPhase.title}
                onChange={(e) => {
                  setEditingPhase({ ...editingPhase, title: e.target.value });
                  updatePhase(activeRoadmap.id, editingPhase.id, { title: e.target.value });
                }}
                className="w-full text-xs p-2.5 rounded bg-surface-subtle border border-subtle text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-secondary block mb-1">Phase Horizon / Deadline</label>
              <input
                type="text"
                placeholder="e.g. Week 1–2 or Sprint 1"
                value={editingPhase.deadline || ''}
                onChange={(e) => {
                  setEditingPhase({ ...editingPhase, deadline: e.target.value });
                  updatePhase(activeRoadmap.id, editingPhase.id, {
                    deadline: e.target.value || undefined,
                  });
                }}
                className="w-full text-xs p-2.5 rounded bg-surface-subtle border border-subtle text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
