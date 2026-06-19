import { create } from 'zustand';
import type { LearningPlan, SkillNode, DailyTask, NodeStatus } from '../types';
import { loadPlans, savePlan, deletePlan as rmPlan } from '../utils/localStorage';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function shiftOverdue(tasks: DailyTask[], today: string): DailyTask[] {
  return tasks.map((t) => (!t.completed && t.date < today ? { ...t, date: today } : t));
}

function calcNodeProgress(nodeId: string, tasks: DailyTask[]): number {
  const related = tasks.filter((t) => t.nodeId === nodeId);
  if (related.length === 0) return 0;
  return Math.round((related.filter((t) => t.completed).length / related.length) * 100);
}

function deriveNodeStatus(node: SkillNode, allNodes: SkillNode[]): NodeStatus {
  if (node.status === 'locked') {
    const allDepsCompleted = node.dependencies.every((depId) => {
      const dep = allNodes.find((n) => n.id === depId);
      return dep && dep.status === 'completed';
    });
    if (allDepsCompleted) return 'unlocked';
    return 'locked';
  }
  return node.status;
}

function updateNodeStatus(node: SkillNode, progress: number, allNodes: SkillNode[]): SkillNode {
  const currentStatus = deriveNodeStatus(node, allNodes);
  let newStatus: NodeStatus = currentStatus;

  if (currentStatus !== 'locked') {
    if (progress >= 100) {
      newStatus = 'completed';
    } else if (progress > 0) {
      newStatus = 'in_progress';
    } else {
      newStatus = 'unlocked';
    }
  }

  return { ...node, progress, status: newStatus };
}

function calcStreak(tasks: DailyTask[]): number {
  const dateMap = new Map<string, boolean>();
  for (const t of tasks) {
    const existing = dateMap.get(t.date);
    if (existing === false) continue;
    dateMap.set(t.date, t.completed);
  }

  let streak = 0;
  const d = new Date();
  d.setDate(d.getDate() - 1);

  while (true) {
    const s = d.toISOString().split('T')[0];
    const done = dateMap.get(s);
    if (done === true) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (done === undefined) {
      d.setDate(d.getDate() - 1);
      if (streak > 60) break;
    } else {
      break;
    }
  }

  const todayDone = dateMap.get(todayStr());
  if (todayDone === true) streak++;

  return streak;
}

interface StoreState {
  plans: LearningPlan[];
  currentPlanId: string | null;
  isAnimating: boolean;

  loadFromStorage: () => void;
  createPlan: (goal: string, skillTree: SkillNode[], tasks: DailyTask[]) => string;
  updatePlan: (plan: LearningPlan) => void;
  deletePlan: (id: string) => void;
  toggleTaskComplete: (planId: string, taskId: string) => void;
  setCurrentPlan: (id: string | null) => void;
  setAnimating: (v: boolean) => void;
  getTodayTasks: (planId: string) => DailyTask[];
}

export const useStore = create<StoreState>((set, get) => ({
  plans: [],
  currentPlanId: null,
  isAnimating: false,

  loadFromStorage: () => {
    const raw = loadPlans();
    // Filter out corrupted/mismatched data from old TRAE versions
    const valid = raw.filter((p) =>
      p && p.id && p.goal && Array.isArray(p.skillTree) && Array.isArray(p.tasks)
    );
    set({ plans: valid });
  },

  createPlan: (goal, skillTree, tasks) => {
    const id = `plan-${Date.now()}`;
    const today = todayStr();
    const shifted = shiftOverdue(tasks, today);
    const plan: LearningPlan = {
      id,
      goal,
      createdAt: new Date().toISOString(),
      skillTree,
      tasks: shifted,
      completionRate: 0,
      streakDays: 0,
    };
    set((s) => ({ plans: [...s.plans, plan] }));
    savePlan(plan);
    return id;
  },

  updatePlan: (plan) => {
    set((s) => ({ plans: s.plans.map((p) => (p.id === plan.id ? plan : p)) }));
    savePlan(plan);
  },

  deletePlan: (id) => {
    set((s) => ({
      plans: s.plans.filter((p) => p.id !== id),
      currentPlanId: s.currentPlanId === id ? null : s.currentPlanId,
    }));
    rmPlan(id);
  },

  toggleTaskComplete: (planId, taskId) => {
    const plan = get().plans.find((p) => p.id === planId);
    if (!plan) return;

    const tasks = plan.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    let tree = plan.skillTree.map((n) => {
      const progress = calcNodeProgress(n.id, tasks);
      return updateNodeStatus(n, progress, plan.skillTree);
    });

    // Auto-unlock nodes when all dependencies are completed
    tree = tree.map((n) => {
      if (n.status === 'locked') {
        const allDepsDone = n.dependencies.every((depId) => {
          const dep = tree.find((node) => node.id === depId);
          return dep && dep.status === 'completed';
        });
        if (allDepsDone) {
          return { ...n, status: 'unlocked' as NodeStatus };
        }
      }
      return n;
    });

    const completedCount = tasks.filter((t) => t.completed).length;
    const rate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    const streak = calcStreak(tasks);

    get().updatePlan({ ...plan, tasks, skillTree: tree, completionRate: rate, streakDays: streak });
  },

  setCurrentPlan: (id) => set({ currentPlanId: id }),
  setAnimating: (v) => set({ isAnimating: v }),

  getTodayTasks: (planId) => {
    const plan = get().plans.find((p) => p.id === planId);
    if (!plan) return [];
    return plan.tasks.filter((x) => x.date === todayStr()).sort((a, b) => a.order - b.order);
  },
}));
