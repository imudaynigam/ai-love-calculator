import React, { useEffect, useRef, useState } from "react";

export const AnimatedBar: React.FC<{
  value: number;
  color?: string;
  duration?: number;
  height?: number;
}> = ({ value, color = "#ec4899", duration = 1.2, height = 8 }) => {
  const [width, setWidth] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    setTimeout(() => setWidth(value), 100);
    prevValue.current = value;
  }, [value]);

  return (
    <div
      style={{
        width: "100%",
        height,
        background: "#fce7f3",
        borderRadius: height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: color,
          borderRadius: height,
          transition: `width ${duration}s cubic-bezier(0.4,0,0.2,1)`,
        }}
      ></div>
    </div>
  );
};
