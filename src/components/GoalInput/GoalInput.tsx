import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function GoalInput() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    sessionStorage.setItem('currentGoal', trimmed);
    navigate('/setup');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="描述你想学的技能，例如：我想学机器学习..."
          className="w-full h-16 px-6 pr-36 text-lg rounded-2xl bg-slate-900/80 backdrop-blur border-2 border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-lg shadow-black/20"
          autoFocus
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-11 px-6 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl text-sm font-semibold transition-all disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
        >
          开始拆解
        </button>
      </div>
    </form>
  );
}
