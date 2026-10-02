export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  deadline?: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  deadline?: string;
  tasks: RoadmapTask[];
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  phases: RoadmapPhase[];
}
