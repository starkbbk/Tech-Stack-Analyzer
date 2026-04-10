"use client";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label: string;
  color?: string;
  size?: number;
}

export default function ScoreGauge({ score, label, color = "#00ff41", size = 120 }: ScoreGaugeProps) {
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative" 
        style={{ width: size, height: size }}
      >
        <svg
          className="transform -rotate-90 w-full h-full"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-900"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeLinecap="round"
            style={{ 
              filter: `drop-shadow(0 0 5px ${color})` 
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl md:text-3xl font-header font-bold text-white tracking-widest">
            {score}
          </span>
        </div>
      </div>
      <span className="mt-4 text-xs md:text-sm font-code text-gray-500 uppercase tracking-tighter">
        {label}
      </span>
    </div>
  );
}
