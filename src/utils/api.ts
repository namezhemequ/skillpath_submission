import type { SkillNode, DailyTask } from '../types';

interface DecomposeResponse {
  skillTree: SkillNode[];
  tasks: DailyTask[];
}

export async function decomposeGoal(goal: string): Promise<DecomposeResponse> {
  const resp = await fetch('/api/decompose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `API returned ${resp.status}`);
  }

  return resp.json();
}
