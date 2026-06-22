import type { DailyTask } from '../../types';

interface Props {
  tasks: DailyTask[];
  onToggle: (taskId: string) => void;
}

export function TaskList({ tasks, onToggle }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="text-3xl mb-2">☕</div>
        <p className="text-slate-500 text-sm">今日暂无任务</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 space-y-0.5">
      {tasks.map((task) => (
        <label
          key={task.id}
          className={`
            flex items-center gap-3 p-3 sm:py-3.5 rounded-xl cursor-pointer transition-all
            ${task.completed ? 'bg-emerald-500/5' : 'hover:bg-slate-800 active:bg-slate-800'}
            group min-h-[44px]
          `}
        >
          <div className="relative flex-shrink-0">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="sr-only"
            />
            <div
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${task.completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-600 group-hover:border-slate-500'
                }
              `}
            >
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-medium transition-all ${
                task.completed ? 'line-through text-slate-600' : 'text-slate-200'
              }`}
            >
              {task.title}
            </div>
            {task.description && (
              <div className="text-xs text-slate-600 mt-0.5 truncate">{task.description}</div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
