'use client';

import { useEffect, useState } from 'react';

interface MetricScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animate?: boolean;
}

export default function MetricScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  animate = true,
}: MetricScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(animate ? 0 : score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#22C55E';
    if (s >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getGlow = (s: number) => {
    if (s >= 80) return 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.4))';
    if (s >= 50) return 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))';
    return 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))';
  };

  useEffect(() => {
    if (!animate) return;
    const duration = 1200;
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score, animate]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" style={{ filter: getGlow(score) }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E3045"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: animate ? 'stroke-dashoffset 1.2s ease-out' : 'none' }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold"
            style={{ fontSize: size * 0.28, color: getColor(score) }}
          >
            {animatedScore}%
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-text-secondary">{label}</span>
      )}
    </div>
  );
}
