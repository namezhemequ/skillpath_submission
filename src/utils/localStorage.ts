import type { LearningPlan } from '../types';

const STORAGE_KEY = 'todo-anatomizer-plans';

export function loadPlans(): LearningPlan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePlans(plans: LearningPlan[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function loadPlan(id: string): LearningPlan | undefined {
  return loadPlans().find((p) => p.id === id);
}

export function savePlan(plan: LearningPlan): void {
  const plans = loadPlans();
  const index = plans.findIndex((p) => p.id === plan.id);
  if (index >= 0) {
    plans[index] = plan;
  } else {
    plans.push(plan);
  }
  savePlans(plans);
}

export function deletePlan(id: string): void {
  const plans = loadPlans().filter((p) => p.id !== id);
  savePlans(plans);
}
