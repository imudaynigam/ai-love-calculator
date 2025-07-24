import React, { useEffect, useRef, useState } from "react";

const heartColors = ["#ff69b4", "#ffb6c1", "#ff1493", "#e75480", "#ff85a1"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Heart {
  id: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  popped: boolean;
  key: number;
}

export const FloatingHearts: React.FC<{ count?: number }> = ({ count = 16 }) => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const nextId = useRef(0);

  // Initialize hearts
  useEffect(() => {
    setHearts(
      Array.from({ length: count }).map(() => makeHeart())
    );
    // eslint-disable-next-line
  }, [count]);

  function makeHeart(): Heart {
    return {
      id: nextId.current++,
      left: randomBetween(5, 95),
      size: randomBetween(18, 36),
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      duration: randomBetween(6, 12),
      delay: randomBetween(0, 4),
      popped: false,
      key: Math.random(),
    };
  }

  // When a heart animation ends (floats out), respawn it
  const handleAnimationEnd = (id: number) => {
    setHearts((prev) =>
      prev.map((h) =>
        h.id === id ? { ...makeHeart(), id, key: Math.random() } : h
      )
    );
  };

  // When a heart is clicked, pop it (fade/scale out), then respawn
  const handlePop = (id: number) => {
    setHearts((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, popped: true } : h
      )
    );
    setTimeout(() => {
      setHearts((prev) =>
        prev.map((h) =>
          h.id === id ? { ...makeHeart(), id, key: Math.random() } : h
        )
      );
    }, 350);
  };

  return (
    <div
      style={{
        pointerEvents: "auto",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      {hearts.map((h) => (
        <span
          key={h.key}
          onClick={() => handlePop(h.id)}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: 0,
            fontSize: h.size,
            color: h.color,
            opacity: h.popped ? 0 : 0.85,
            cursor: "pointer",
            animation: h.popped
              ? `popHeart 0.35s cubic-bezier(0.4,0,0.2,1) forwards`
              : `floatHeart ${h.duration}s linear ${h.delay}s forwards`,
            filter: "drop-shadow(0 2px 6px rgba(255,105,180,0.2))",
            transition: h.popped ? "opacity 0.2s, transform 0.2s" : undefined,
            transform: h.popped ? "scale(1.7)" : undefined,
            pointerEvents: h.popped ? "none" : "auto",
            userSelect: "none",
          }}
          onAnimationEnd={() => !h.popped && handleAnimationEnd(h.id)}
        >
          ♥
        </span>
      ))}
      <style>{`
        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(1) rotate(-8deg);
            opacity: 0.85;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translateY(-90vh) scale(1.2) rotate(12deg);
            opacity: 0;
          }
        }
        @keyframes popHeart {
          0% {
            opacity: 0.85;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.7);
          }
        }
      `}</style>
    </div>
  );
};
