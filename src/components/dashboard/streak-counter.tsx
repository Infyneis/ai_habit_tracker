"use client";

import { motion, useSpring, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

interface StreakCounterProps {
  streak: number;
  label?: string;
  showFlame?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    card: "p-3",
    number: "text-2xl",
    flame: "h-5 w-5",
    label: "text-xs",
  },
  md: {
    card: "p-4",
    number: "text-4xl",
    flame: "h-6 w-6",
    label: "text-sm",
  },
  lg: {
    card: "p-6",
    number: "text-6xl",
    flame: "h-8 w-8",
    label: "text-base",
  },
};

export function StreakCounter({
  streak,
  label = "Day Streak",
  showFlame = true,
  size = "md",
}: StreakCounterProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    spring.set(streak);
  }, [spring, streak]);

  const classes = sizeClasses[size];
  const isOnFire = streak >= 7;

  return (
    <Card className="relative overflow-hidden">
      {/* Background glow effect for high streaks */}
      {isOnFire && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <CardContent className={cn("relative", classes.card)}>
        <div className="flex items-center gap-3">
          {showFlame && (
            <motion.div
              animate={
                isOnFire
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [-5, 5, -5],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: isOnFire ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <Flame
                className={cn(
                  classes.flame,
                  isOnFire ? "text-orange-500" : "text-muted-foreground"
                )}
              />
            </motion.div>
          )}

          <div>
            <span
              className={cn(
                "font-bold tabular-nums",
                classes.number,
                isOnFire ? "text-orange-500" : "text-foreground"
              )}
            >
              <AnimatedNumber value={spring} />
            </span>
            <p className={cn("text-muted-foreground", classes.label)}>
              {label}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Milestone badges */}
      {streak >= 30 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {streak >= 100 ? "🏆 Legend" : streak >= 30 ? "⭐ Champion" : ""}
          </span>
        </motion.div>
      )}
    </Card>
  );
}
