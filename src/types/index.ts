export type NodeStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';
export type Difficulty = 1 | 2 | 3;

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'project';
  duration?: string;
}

export interface SkillNode {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: Difficulty;
  resources: Resource[];
  dependencies: string[];
  status: NodeStatus;
  progress: number;
}

export interface DailyTask {
  id: string;
  planId: string;
  nodeId: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  order: number;
}

export interface LearningPlan {
  id: string;
  goal: string;
  createdAt: string;
  skillTree: SkillNode[];
  tasks: DailyTask[];
  completionRate: number;
  streakDays: number;
}

export interface AnimationPhase {
  text: string;
  icon: string;
}
