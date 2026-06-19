import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DecompositionAnimation } from '../components/Animation';
import { getAnimationPhases, generateMockPlan } from '../utils/mockAI';
import { useStore } from '../store/useStore';

export function AnimationPage() {
  const navigate = useNavigate();
  const { createPlan, setAnimating } = useStore();

  useEffect(() => {
    setAnimating(true);
    return () => setAnimating(false);
  }, [setAnimating]);

  const handleComplete = useCallback(() => {
    const goal = sessionStorage.getItem('currentGoal') || '我想学机器学习';
    const { skillTree, tasks } = generateMockPlan(goal);
    const planId = createPlan(goal, skillTree, tasks);
    sessionStorage.removeItem('currentGoal');
    navigate(`/plan/${planId}`);
  }, [createPlan, navigate]);

  return (
    <DecompositionAnimation
      phases={getAnimationPhases()}
      onComplete={handleComplete}
    />
  );
}
