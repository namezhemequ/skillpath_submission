import { useEffect, useState } from 'react';

interface ConfettiParticle {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  rotation: number;
  size: string;
}

function generateParticles(): ConfettiParticle[] {
  const colors = ['#6366f1', '#818cf8', '#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#38bdf8'];
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 3}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: `${6 + Math.random() * 8}px`,
  }));
}

export function CelebrationOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [particles] = useState(generateParticles);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-confetti-fall"
            style={{
              left: p.left,
              top: '-10px',
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Message */}
      <div className="relative z-10 text-center animate-fade-in-up">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2">你做到了！</h2>
        <p className="text-lg text-slate-400 mb-8">学习计划 100% 完成，这是你坚持的证明</p>
        <button
          onClick={onDismiss}
          className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors"
        >
          继续
        </button>
      </div>
    </div>
  );
}

export function DailyDoneToast({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-slide-down">
      <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg shadow-emerald-500/10">
        <span className="text-xl">🔥</span>
        <div>
          <p className="text-sm font-semibold text-emerald-300">今日任务全部完成！</p>
          <p className="text-xs text-emerald-500/70">连续打卡 +1，继续保持</p>
        </div>
      </div>
    </div>
  );
}
