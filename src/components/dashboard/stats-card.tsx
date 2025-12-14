"use client";

import { motion, useSpring, MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
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

interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatsCard({
  title,
  value,
  suffix = "",
  icon: Icon,
  trend,
  color = "var(--primary)",
}: StatsCardProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <Card className="overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tabular-nums">
                <AnimatedNumber value={spring} />
              </span>
              {suffix && (
                <span className="text-lg text-muted-foreground">{suffix}</span>
              )}
            </div>

            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                <span>{trend.isPositive ? "↑" : "↓"}</span>
                <span>{Math.abs(trend.value)}%</span>
                <span className="text-muted-foreground">vs last week</span>
              </motion.div>
            )}
          </div>

          <motion.div
            className="p-3 rounded-xl transition-colors duration-300"
            style={{ backgroundColor: `${color}15` }}
            whileHover={{ scale: 1.05 }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
