import React from "react";

const confettiColors = ["#FFD700", "#FF69B4", "#00CFFF", "#FFB347", "#B19CD9", "#FF85A1"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const CelebrationEffect: React.FC<{ count?: number }> = ({ count = 24 }) => {
  return (
    <div
      style={{
        pointerEvents: "none",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: 31,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const left = randomBetween(5, 95);
        const duration = randomBetween(1.8, 3.2);
        const size = randomBetween(10, 22);
        const delay = randomBetween(0, 1.2);
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const rotate = randomBetween(-90, 90);
        const isStar = Math.random() > 0.5;
        return isStar ? (
          <span
            key={"star-" + i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: 0,
              fontSize: size,
              color,
              opacity: 0.9,
              animation: `starBurst ${duration}s ease-out ${delay}s forwards`,
              filter: "drop-shadow(0 2px 6px rgba(255,215,0,0.2))",
              transform: `rotate(${rotate}deg)`
            }}
          >
            ★
          </span>
        ) : (
          <span
            key={"confetti-" + i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: 0,
              width: size,
              height: size,
              background: color,
              borderRadius: 3,
              opacity: 0.85,
              animation: `confettiDrop ${duration}s cubic-bezier(0.4,0,0.2,1) ${delay}s forwards`,
              display: "inline-block",
              transform: `rotate(${rotate}deg)`
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiDrop {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.85;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(85vh) scale(1.1) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes starBurst {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.9;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: translateY(70vh) scale(1.2) rotate(180deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
