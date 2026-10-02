import { Roadmap, RoadmapPhase, RoadmapTask } from '../types/roadmap';

export function parseAiRoadmapText(rawText: string): Omit<Roadmap, 'id' | 'createdAt'> {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      title: 'Untitled Roadmap',
      phases: [],
    };
  }

  let title = 'Structured Roadmap';
  let startIndex = 0;

  // Check if first line looks like a title (e.g. "# Title" or single short header line)
  const firstLine = lines[0];
  if (firstLine.startsWith('#')) {
    title = firstLine.replace(/^#+\s*/, '').trim();
    startIndex = 1;
  } else if (
    !firstLine.startsWith('-') &&
    !firstLine.startsWith('*') &&
    !firstLine.startsWith('•') &&
    !/^(week|phase|month|step|part)\b/i.test(firstLine) &&
    lines.length > 1 &&
    firstLine.length < 80
  ) {
    title = firstLine.replace(/^[:\-#*]\s*/, '').trim();
    startIndex = 1;
  }

  const phases: RoadmapPhase[] = [];
  let currentPhase: RoadmapPhase | null = null;

  const phaseRegex = /^(?:#+\s*)?(?:(week|phase|month|step|part)\s*(\d+|[ivxlcdm]+)?[:\s\-]*)?(.*)$/i;
  const isBulletRegex = /^[-*•\d+.)\]]\s*(?:\[[ xX]\]\s*)?(.*)$/;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];

    // Detect if this line is an explicit phase marker
    const isExplicitPhase =
      /^(week|phase|month|step|part)\s*(\d+|[ivxlcdm]+)?[:\s\-]/i.test(line) ||
      line.startsWith('## ') ||
      line.startsWith('### ') ||
      (line.endsWith(':') && !line.startsWith('-') && !line.startsWith('*'));

    if (isExplicitPhase) {
      let phaseTitle = line;
      let deadline: string | undefined = undefined;

      // Extract deadline if present (e.g. "Week 1: Fundamentals" -> deadline: "Week 1", title: "Fundamentals")
      const weekMatch = line.match(/^(week|phase|month|step|part)\s*(\d+|[ivxlcdm]+)?[:\s\-]*(.*)$/i);
      if (weekMatch) {
        const prefix = weekMatch[1];
        const num = weekMatch[2] ? ` ${weekMatch[2]}` : '';
        deadline = `${prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase()}${num}`;
        const remaining = weekMatch[3].replace(/[:\-]+$/, '').trim();
        phaseTitle = remaining.length > 0 ? remaining : `${deadline} Objectives`;
      } else {
        phaseTitle = line.replace(/^#+\s*/, '').replace(/[:\-]+$/, '').trim();
      }

      currentPhase = {
        id: `phase_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: phaseTitle || 'Phase',
        deadline,
        tasks: [],
      };
      phases.push(currentPhase);
      continue;
    }

    // Detect if this line is a task bullet
    const bulletMatch = line.match(isBulletRegex);
    const taskTitle = bulletMatch ? bulletMatch[1].trim() : line.trim();

    if (taskTitle.length === 0) continue;

    // Check completion state if marked like [x]
    const isCompleted = /^\[[xX]\]/.test(line.replace(/^[-*•\s]+/, ''));

    const newTask: RoadmapTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: taskTitle.replace(/^\[[ xX]\]\s*/, ''),
      completed: isCompleted,
    };

    // If no phase has been established yet, create a default first phase
    if (!currentPhase) {
      currentPhase = {
        id: `phase_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: 'Phase 1: Foundation',
        deadline: 'Horizon 1',
        tasks: [],
      };
      phases.push(currentPhase);
    }

    currentPhase.tasks.push(newTask);
  }

  return {
    title: title || 'Parsed Roadmap',
    phases: phases.filter((p) => p.tasks.length > 0 || p.title.length > 0),
  };
}
