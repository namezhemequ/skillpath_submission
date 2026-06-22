import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DecompositionAnimation } from '../components/Animation';
import { getAnimationPhases, generateMockPlan } from '../utils/mockAI';
import { decomposeGoal } from '../utils/api';
import { useStore } from '../store/useStore';

export function AnimationPage() {
  const navigate = useNavigate();
  const { createPlan, setAnimating } = useStore();
  const [waiting, setWaiting] = useState(false);
  const goalRef = useRef(sessionStorage.getItem('currentGoal') || '我想学机器学习');
  const apiPromiseRef = useRef<ReturnType<typeof decomposeGoal> | null>(null);

  useEffect(() => {
    setAnimating(true);

    apiPromiseRef.current = decomposeGoal(goalRef.current)
      .catch(() => generateMockPlan(goalRef.current));

    return () => setAnimating(false);
  }, [setAnimating]);

  const handleComplete = useCallback(async () => {
    if (!apiPromiseRef.current) return;

    setWaiting(true);
    const data = await apiPromiseRef.current;

    const planId = createPlan(goalRef.current, data.skillTree, data.tasks);
    sessionStorage.removeItem('currentGoal');
    navigate(`/plan/${planId}`);
  }, [createPlan, navigate]);

  return (
    <>
      <DecompositionAnimation
        phases={getAnimationPhases()}
        onComplete={handleComplete}
      />
      {waiting && (
        <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-xl text-slate-300 font-medium">AI 正在深度分析你的目标...</p>
            <p className="text-sm text-slate-500 mt-3">这通常需要 5-15 秒</p>
          </div>
        </div>
      )}
    </>
  );
}
