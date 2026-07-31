import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const ScoreGauge3D = ({ score = 0, size = 180 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const target = Math.min(100, Math.max(0, score || 0));
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [score]);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getGrade = (val) => {
    if (val >= 90) return { letter: 'A+', text: 'Outstanding Match', color: 'from-emerald-400 to-teal-300' };
    if (val >= 75) return { letter: 'A', text: 'Strong Alignment', color: 'from-blue-400 to-indigo-400' };
    if (val >= 60) return { letter: 'B', text: 'Moderate Match', color: 'from-purple-400 to-pink-400' };
    if (val >= 40) return { letter: 'C', text: 'Needs Improvement', color: 'from-amber-400 to-orange-400' };
    return { letter: 'F', text: 'Low Compatibility', color: 'from-red-400 to-rose-500' };
  };

  const gradeInfo = getGrade(animatedScore);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-3xl border border-gray-700/60 shadow-2xl backdrop-blur-xl group hover:border-indigo-500/50 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#scoreGaugeGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-gray-300 drop-shadow-md">
              {animatedScore}
            </span>
            <span className="text-sm font-bold text-indigo-400 ml-0.5">%</span>
          </div>
          <div className={`mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-black text-white bg-gradient-to-r ${gradeInfo.color} shadow-sm`}>
            {gradeInfo.letter}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center z-10">
        <h4 className="text-sm font-semibold text-gray-200 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          {gradeInfo.text}
        </h4>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          {score > 0 ? 'AI Match Audit Complete' : 'Upload resume to analyze match'}
        </p>
      </div>
    </div>
  );
};

export default ScoreGauge3D;
