import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkillTree } from '../components/SkillTree';
import { TaskList } from '../components/TaskList';
import { ProgressPanel } from '../components/ProgressPanel';
import { NodeDetailDrawer } from '../components/SkillTree/NodeDetailDrawer';
import { useStore } from '../store/useStore';
import type { SkillNode } from '../types';

export function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plans, loadFromStorage, getTodayTasks, toggleTaskComplete } = useStore();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const plan = useMemo(() => plans.find((p) => p.id === id), [plans, id]);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (!plan) return;
    const node = plan.skillTree.find((n) => n.id === nodeId);
    if (node) setSelectedNode(node);
  }, [plan]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">计划不存在</p>
          <button onClick={() => navigate('/')} className="text-indigo-400 hover:underline text-sm">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const todayTasks = getTodayTasks(plan.id);
  const totalCompleted = plan.tasks?.filter((t) => t.completed).length ?? 0;
  const todayDone = todayTasks?.filter((t) => t.completed).length ?? 0;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* STICKY TOP BAR */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">首页</span>
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-slate-100 truncate">{plan.goal}</h1>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span>今日 {todayDone}/{todayTasks.length}</span>
            <span>连续 {plan.streakDays} 天</span>
            <span>完成 {plan.completionRate}%</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* ProgressPanel full width */}
        <ProgressPanel
          completionRate={plan.completionRate}
          streakDays={plan.streakDays}
          totalTasks={plan.tasks?.length ?? 0}
          completedTasks={totalCompleted}
          todayDone={todayDone}
          todayTotal={todayTasks.length}
        />

        {/* Two-column: skill tree 2/3 + today tasks 1/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">技能树</h2>
              <span className="text-xs text-slate-600">点击节点查看详情</span>
            </div>
            <div className="h-[480px] sm:h-[560px]">
              <SkillTree nodes={plan.skillTree} onNodeClick={handleNodeClick} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">今日任务</h2>
            <TaskList
              tasks={todayTasks}
              onToggle={(taskId) => toggleTaskComplete(plan.id, taskId)}
            />
          </div>
        </div>
      </main>

      {/* NODE DETAIL DRAWER */}
      {selectedNode && (
        <NodeDetailDrawer
          node={selectedNode}
          allNodes={plan.skillTree}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
