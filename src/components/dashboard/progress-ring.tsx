"use client";

import { motion, useSpring, useTransform, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Component to display animated number from MotionValue
function AnimatedNumber({ value }: { value: MotionValue<number> }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = value.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [value]);

  return <>{displayValue}</>;
}

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "var(--primary)",
  backgroundColor = "var(--muted)",
  label,
  showPercentage = true,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const strokeDashoffset = useTransform(
    spring,
    (value) => circumference - (value / 100) * circumference
  );

  useEffect(() => {
    spring.set(Math.min(100, Math.max(0, progress)));
  }, [spring, progress]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          className="opacity-20"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />

        {/* Glow effect for high progress */}
        {progress >= 80 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            className="opacity-20 blur-sm"
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold tabular-nums">
            <AnimatedNumber value={spring} />
            <span className="text-sm text-muted-foreground">%</span>
          </span>
        )}
        {label && (
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}

// Mini progress bar variant
interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  color = "var(--primary)",
  height = 8,
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor: "var(--muted)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
