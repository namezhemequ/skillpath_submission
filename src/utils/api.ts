import type { SkillNode, DailyTask } from '../types';

interface DecomposeResponse {
  skillTree: SkillNode[];
  tasks: DailyTask[];
}

const API_TIMEOUT_MS = 18_000;

export async function decomposeGoal(goal: string): Promise<DecomposeResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const resp = await fetch('/api/decompose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(err.error || `API returned ${resp.status}`);
    }

    return resp.json();
  } catch (e: any) {
    if (e.name === 'AbortError') {
      throw new Error('请求超时，AI 服务响应过慢');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
