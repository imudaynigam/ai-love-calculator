import React, { useEffect, useState } from "react";

export const AnimatedScore: React.FC<{
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  duration?: number;
}> = ({ value, size = 128, strokeWidth = 12, color = "#ec4899", duration = 1.2 }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setTimeout(() => setProgress(value), 100);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#fce7f3"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: `stroke-dashoffset ${duration}s cubic-bezier(0.4,0,0.2,1)`
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.28}
        fontWeight="bold"
        fill="#ec4899"
        style={{ pointerEvents: "none", textShadow: "0 1px 4px #fff, 0 0 2px #fff" }}
      >
        {progress}%
      </text>
    </svg>
  );
};
