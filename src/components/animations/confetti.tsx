"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  pieces?: number;
}

const colors = [
  "#a855f7", // lavender-500
  "#c084fc", // lavender-400
  "#9333ea", // lavender-600
  "#d8b4fe", // lavender-300
  "#7c3aed", // lavender-700
  "#f0abfc", // fuchsia-300
  "#e879f9", // fuchsia-400
];

export function Confetti({ trigger, duration = 2000, pieces = 50 }: ConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger) {
      const newConfetti = Array.from({ length: pieces }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
      }));
      setConfetti(newConfetti);

      const timer = setTimeout(() => {
        setConfetti([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, pieces]);

  return (
    <AnimatePresence>
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3"
              style={{
                left: `${piece.x}%`,
                top: -20,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
              }}
              initial={{
                y: -20,
                rotate: piece.rotation,
                scale: 1,
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: piece.rotation + 720,
                scale: [1, 1.2, 0.8, 1],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Sparkle burst effect for smaller celebrations
export function SparklesBurst({ trigger }: { trigger: boolean }) {
  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number; angle: number }[]
  >([]);

  useEffect(() => {
    if (trigger) {
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        angle: (i * 30) + Math.random() * 15,
      }));
      setSparkles(newSparkles);

      const timer = setTimeout(() => {
        setSparkles([]);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {sparkles.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {sparkles.map((sparkle) => {
            const radians = (sparkle.angle * Math.PI) / 180;
            const distance = 50 + Math.random() * 30;
            const endX = sparkle.x + Math.cos(radians) * distance;
            const endY = sparkle.y + Math.sin(radians) * distance;

            return (
              <motion.div
                key={sparkle.id}
                className="absolute w-1.5 h-1.5 bg-primary rounded-full"
                style={{
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  x: `${endX - sparkle.x}%`,
                  y: `${endY - sparkle.y}%`,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
