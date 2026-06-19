import { useEffect } from 'react';
import type { SkillNode } from '../../types';

interface Props {
  node: SkillNode;
  allNodes: SkillNode[];
  onClose: () => void;
}

const difficultyText = { 1: '入门', 2: '进阶', 3: '挑战' };
const difficultyColor = { 1: 'text-emerald-400', 2: 'text-amber-400', 3: 'text-red-400' };
const difficultyBg = { 1: 'bg-emerald-500/10 border-emerald-500/30', 2: 'bg-amber-500/10 border-amber-500/30', 3: 'bg-red-500/10 border-red-500/30' };

const resourceIcon: Record<string, string> = {
  article: '文',
  video: '视',
  course: '课',
  project: '项',
};

export function NodeDetailDrawer({ node, allNodes, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const deps = allNodes.filter((n) => node.dependencies.includes(n.id));
  const dependents = allNodes.filter((n) => n.dependencies.includes(node.id));

  const statusLabel: Record<string, string> = {
    locked: '未解锁',
    unlocked: '可学习',
    in_progress: '学习中',
    completed: '已完成',
  };
  const statusColor: Record<string, string> = {
    locked: 'bg-slate-700 text-slate-400',
    unlocked: 'bg-indigo-500/20 text-indigo-400',
    in_progress: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-[420px] max-w-full bg-slate-900 border-l border-slate-800 h-full overflow-y-auto animate-slide-in-right"
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-100">节点详情</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 text-xs rounded-full border ${statusColor[node.status]}`}>
                {statusLabel[node.status]}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full border ${difficultyBg[node.difficulty]} ${difficultyColor[node.difficulty]}`}>
                {difficultyText[node.difficulty]}
              </span>
              <span className="text-xs text-slate-500">{node.estimatedHours}h</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{node.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{node.description}</p>
          </div>

          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">学完后能做什么</div>
            <p className="text-sm text-slate-300">
              掌握 {node.title} 后，你将具备独立完成相关任务的能力，可以进一步学习依赖此技能的高级主题。
            </p>
          </div>

          {node.progress > 0 && (
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>学习进度</span>
                <span>{node.progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${node.progress}%` }}
                />
              </div>
            </div>
          )}

          {deps.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">前置依赖</div>
              <div className="space-y-2">
                {deps.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${d.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className={`text-sm ${d.status === 'completed' ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {d.title}
                    </span>
                    {d.status === 'completed' && (
                      <span className="ml-auto text-xs text-emerald-500">已完成</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {dependents.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">解锁后可学</div>
              <div className="space-y-2">
                {dependents.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{d.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {node.resources.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">推荐资源</div>
              <div className="space-y-2">
                {node.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-all group"
                  >
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-xs font-medium text-slate-400 flex-shrink-0">
                      {resourceIcon[r.type] ?? '资'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-200 group-hover:text-indigo-300 truncate transition-colors">
                        {r.title}
                      </div>
                      {r.duration && (
                        <div className="text-xs text-slate-500 mt-0.5">{r.duration}</div>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
