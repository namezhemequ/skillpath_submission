import { useEffect, useState, useCallback, useRef } from 'react';
import type { AnimationPhase } from '../../types';

interface Props {
  phases: AnimationPhase[];
  onComplete: () => void;
  totalDuration?: number;
}

export function DecompositionAnimation({ phases, onComplete, totalDuration = 7000 }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [skipped, setSkipped] = useState(false);
  const completedRef = useRef(false);

  const phaseMs = totalDuration / phases.length;

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setSkipped(true);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (skipped) return;
    const phase = phases[phaseIndex];
    if (!phase) return;

    let i = 0;
    setDisplayText('');

    const typeTimer = setInterval(() => {
      if (i <= phase.text.length) {
        setDisplayText(phase.text.slice(0, i));
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 35);

    const nextTimer = setTimeout(() => {
      if (phaseIndex < phases.length - 1) {
        setPhaseIndex((p) => p + 1);
      } else {
        finish();
      }
    }, phaseMs);

    return () => {
      clearInterval(typeTimer);
      clearTimeout(nextTimer);
    };
  }, [phaseIndex, phases, phaseMs, skipped, finish]);

  const progressPct = ((phaseIndex + (displayText.length > 0 ? 0.3 : 0)) / phases.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px]" />

      <button
        onClick={finish}
        className="absolute top-6 right-6 px-4 py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        跳过动画 →
      </button>

      <div className="relative text-center max-w-lg px-6">
        <div className="text-5xl mb-6 transition-all duration-500">
          {phases[phaseIndex]?.icon ?? '🔍'}
        </div>

        <div className="h-1 bg-slate-800 rounded-full mb-10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progressPct, 100)}%` }}
          />
        </div>

        <div className="min-h-[64px] flex items-center justify-center">
          <p className="text-xl sm:text-2xl text-slate-200 font-medium leading-relaxed">
            {displayText}
            <span className="inline-block w-0.5 h-5 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
          </p>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {phases.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < phaseIndex
                  ? 'bg-indigo-400 scale-100'
                  : i === phaseIndex
                  ? 'bg-indigo-400 scale-125'
                  : 'bg-slate-700 scale-100'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
