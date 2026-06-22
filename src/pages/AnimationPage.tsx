import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DecompositionAnimation } from '../components/Animation';
import { getAnimationPhases, generateMockPlan } from '../utils/mockAI';
import { decomposeGoal } from '../utils/api';
import { useStore } from '../store/useStore';

const SAFETY_TIMEOUT_MS = 25_000;

export function AnimationPage() {
  const navigate = useNavigate();
  const { createPlan, setAnimating } = useStore();
  const [waiting, setWaiting] = useState(false);
  const [useOffline, setUseOffline] = useState(false);
  const goalRef = useRef(sessionStorage.getItem('currentGoal') || '我想学机器学习');
  const apiPromiseRef = useRef<ReturnType<typeof decomposeGoal> | null>(null);
  const resolvedRef = useRef(false);

  const proceed = useCallback(
    (data: { skillTree: any; tasks: any }) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      const planId = createPlan(goalRef.current, data.skillTree, data.tasks);
      sessionStorage.removeItem('currentGoal');
      navigate(`/plan/${planId}`);
    },
    [createPlan, navigate],
  );

  useEffect(() => {
    setAnimating(true);

    const apiCall = decomposeGoal(goalRef.current).catch(() => generateMockPlan(goalRef.current));
    apiPromiseRef.current = apiCall;

    // Safety timeout: if API takes >25s total, force fallback
    const safety = setTimeout(() => {
      if (!resolvedRef.current) {
        setUseOffline(true);
        proceed(generateMockPlan(goalRef.current));
      }
    }, SAFETY_TIMEOUT_MS);

    return () => {
      setAnimating(false);
      clearTimeout(safety);
    };
  }, [setAnimating, proceed]);

  const handleComplete = useCallback(async () => {
    if (!apiPromiseRef.current || resolvedRef.current) return;

    setWaiting(true);
    const data = await apiPromiseRef.current;
    proceed(data);
  }, [proceed]);

  return (
    <>
      <DecompositionAnimation
        phases={getAnimationPhases()}
        onComplete={handleComplete}
      />
      {waiting && (
        <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
          {!useOffline ? (
            <>
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-xl text-slate-300 font-medium">AI 正在深度分析你的目标...</p>
                <p className="text-sm text-slate-500 mt-3">通常 5-15 秒，请耐心等待</p>
              </div>
              <button
                onClick={() => {
                  setUseOffline(true);
                  proceed(generateMockPlan(goalRef.current));
                }}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
              >
                跳过，使用离线模式
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg text-amber-400 font-medium">已切换到离线模式</p>
              <p className="text-sm text-slate-500 mt-2">正在加载本地学习计划...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
