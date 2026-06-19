import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { SkillNode } from '../../types';

const STATUS_STYLE: Record<string, string> = {
  locked: 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed',
  unlocked: 'bg-indigo-500/10 border-2 border-indigo-500/50 text-indigo-300 cursor-pointer hover:border-indigo-400',
  in_progress: 'bg-amber-500/10 border-2 border-amber-500/50 text-amber-300 cursor-pointer',
  completed: 'bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/20',
};

const STATUS_ICON: Record<string, string> = {
  locked: '🔒',
  unlocked: '○',
  in_progress: '◐',
  completed: '✓',
};

interface Props {
  data: SkillNode;
  selected: boolean;
}

export const SkillNodeComponent = memo(function SkillNodeComponent({ data, selected }: Props) {
  const isCompleted = data.status === 'completed';
  const isInProgress = data.status === 'in_progress';

  return (
    <div
      className={`
        relative px-4 py-3 rounded-xl min-w-[150px] max-w-[180px]
        transition-all duration-300
        ${STATUS_STYLE[data.status]}
        ${selected ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : ''}
        ${isCompleted ? 'animate-completed-pop' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-2 !h-2" />

      <div className="flex items-center gap-2">
        <span className="text-xs w-5 text-center flex-shrink-0">{STATUS_ICON[data.status]}</span>
        <span className="font-semibold text-sm truncate">{data.title}</span>
      </div>

      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-[10px] opacity-60">{data.estimatedHours}h</span>
        <span className="text-[10px] opacity-40">
          {'●'.repeat(data.difficulty)}{'○'.repeat(3 - data.difficulty)}
        </span>
      </div>

      {isInProgress && (
        <div className="mt-2 h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(data.progress, 8)}%` }}
          />
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-2 !h-2" />
    </div>
  );
});
