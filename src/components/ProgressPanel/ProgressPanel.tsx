function StatCard({ label, value, sub, variant }: {
  label: string;
  value: string;
  sub: string;
  variant: 'emerald' | 'indigo' | 'amber';
}) {
  const colors = {
    emerald: { value: 'text-emerald-400', bar: 'bg-emerald-500' },
    indigo: { value: 'text-indigo-400', bar: 'bg-indigo-500' },
    amber: { value: 'text-amber-400', bar: 'bg-amber-500' },
  }[variant];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center">
      <div className="text-[10px] sm:text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-lg sm:text-2xl font-bold ${colors.value}`}>{value}</div>
      <div className="text-[10px] sm:text-xs text-slate-600 mt-0.5">{sub}</div>
    </div>
  );
}

interface Props {
  completionRate: number;
  streakDays: number;
  totalTasks: number;
  completedTasks: number;
  todayDone: number;
  todayTotal: number;
}

export function ProgressPanel({ completionRate, streakDays, totalTasks, completedTasks, todayDone, todayTotal }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <StatCard
        label="今日进度"
        value={todayTotal > 0 ? `${todayDone}/${todayTotal}` : '--'}
        sub={todayTotal > 0 ? `${Math.round((todayDone / todayTotal) * 100)}%` : '暂无任务'}
        variant="emerald"
      />
      <StatCard
        label="连续打卡"
        value={`${streakDays}`}
        sub="天"
        variant="indigo"
      />
      <StatCard
        label="总完成度"
        value={`${completionRate}%`}
        sub={`${completedTasks}/${totalTasks}`}
        variant="amber"
      />
    </div>
  );
}
