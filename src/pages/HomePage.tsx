import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoalInput } from '../components/GoalInput';
import { useStore } from '../store/useStore';

const EXAMPLES = [
  '我想学机器学习',
  '转行数据分析',
  '学习 Rust 系统编程',
  '零基础学钢琴',
];

export function HomePage() {
  const { plans, loadFromStorage, deletePlan } = useStore();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleExample = (goal: string) => {
    sessionStorage.setItem('currentGoal', goal);
    navigate('/setup');
  };

  return (
    <div className="relative min-h-screen text-slate-100">
      {/* ====== AMBIENT GLOW BLOBS ====== */}
      <div className="absolute top-0 left-0 w-[800px] h-[700px] rounded-full bg-indigo-500/6 blur-[150px] -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/4 blur-[130px] translate-x-1/4" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/3 blur-[120px]" />

      {/* ====== HERO ====== */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
            </span>
            AI 学习路径规划师
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            把模糊目标
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-indigo-100 to-purple-300 bg-clip-text text-transparent">
              拆成清晰路径
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto mb-2 leading-relaxed">
            输入任何一个想学的技能，AI 帮你解剖成可视化技能树 + 每日最小行动清单
          </p>
          <p className="text-sm text-slate-600 mb-12">
            告别「收藏从未停止，学习从未开始」
          </p>

          {/* Input */}
          <div className="max-w-2xl mx-auto mb-10">
            <GoalInput />
          </div>

          {/* Quick examples */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            <span className="text-xs text-slate-600 self-center mr-1">试试：</span>
            {EXAMPLES.map((eg) => (
              <button
                key={eg}
                onClick={() => handleExample(eg)}
                className="px-3.5 py-2 text-xs rounded-full bg-slate-800/70 border border-slate-700/70 text-slate-400 hover:border-indigo-500/60 hover:text-indigo-300 hover:bg-slate-800 transition-all"
              >
                {eg}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-16 sm:gap-20 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-400">3</div>
              <div className="text-xs text-slate-500 mt-1">步从目标到行动清单</div>
            </div>
            <div className="w-px bg-slate-800 self-stretch" />
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-400">3层+</div>
              <div className="text-xs text-slate-500 mt-1">技能树分解深度</div>
            </div>
            <div className="w-px bg-slate-800 self-stretch" />
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-400">0</div>
              <div className="text-xs text-slate-500 mt-1">门槛，每天3件小事</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== HISTORY ====== */}
      {plans.length > 0 && (
        <section className="relative max-w-2xl mx-auto px-4 pb-24">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            历史学习计划
          </h2>
          <div className="space-y-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group relative flex items-center gap-4 bg-slate-900/80 backdrop-blur border border-slate-800/80 rounded-xl px-5 py-4 hover:border-slate-700 transition-all"
                onMouseEnter={() => setHoveredId(plan.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
                  {typeof plan.goal === 'string' ? plan.goal.charAt(0) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-200 truncate">{plan.goal ?? '未命名计划'}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {plan.skillTree?.length ?? 0} 个技能 · {plan.tasks?.length ?? 0} 个任务 · {plan.completionRate ?? 0}% 完成
                  </div>
                </div>
                <div
                  className={`flex items-center gap-2 transition-opacity ${
                    hoveredId === plan.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Link
                    to={`/plan/${plan.id}`}
                    className="px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                  >
                    继续
                  </Link>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="px-2 py-1.5 text-slate-500 hover:text-red-400 text-sm transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {plans.length === 0 && (
        <section className="relative max-w-2xl mx-auto px-4 pb-24 text-center">
          <p className="text-slate-600 text-sm">还没有学习计划 — 在上方输入你的第一个目标开始吧</p>
        </section>
      )}
    </div>
  );
}
