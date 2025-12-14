"use client";

import { motion } from "framer-motion";
import { Flame, MoreHorizontal, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HabitCheckbox } from "./habit-checkbox";
import { cn } from "@/lib/utils";
import type { HabitWithRelations, StreakInfo } from "@/types";

interface HabitCardProps {
  habit: HabitWithRelations;
  streakInfo: StreakInfo;
  onToggle: (habitId: string, completed: boolean) => void;
  onEdit?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  onViewDetails?: (habitId: string) => void;
}

// Icon mapping for habit icons
const iconComponents: Record<string, string> = {
  sparkles: "✨",
  heart: "❤️",
  book: "📚",
  dumbbell: "💪",
  brain: "🧠",
  coffee: "☕",
  moon: "🌙",
  sun: "☀️",
  water: "💧",
  apple: "🍎",
  run: "🏃",
  meditation: "🧘",
  music: "🎵",
  code: "💻",
  write: "✍️",
  paint: "🎨",
};

export function HabitCard({
  habit,
  streakInfo,
  onToggle,
  onEdit,
  onDelete,
  onViewDetails,
}: HabitCardProps) {
  const icon = iconComponents[habit.icon] || "✨";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/5",
          "border-border/50 hover:border-primary/30"
        )}
      >
        {/* Color accent bar */}
        <div
          className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-1.5"
          style={{ backgroundColor: habit.color }}
        />

        <CardContent className="p-4 pl-5">
          <div className="flex items-center gap-4">
            {/* Checkbox */}
            <HabitCheckbox
              checked={streakInfo.isCompletedToday}
              onChange={(checked) => onToggle(habit.id, checked)}
              color={habit.color}
              size="md"
            />

            {/* Habit info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <h3 className="font-medium truncate">{habit.name}</h3>
                {habit.category && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${habit.category.color}20`,
                      color: habit.category.color,
                    }}
                  >
                    {habit.category.name}
                  </span>
                )}
              </div>

              {habit.description && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {habit.description}
                </p>
              )}

              {/* Streak and stats */}
              <div className="flex items-center gap-3 mt-2">
                {streakInfo.currentStreak > 0 && (
                  <motion.div
                    className="flex items-center gap-1 text-sm"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    <Flame
                      className={cn(
                        "h-4 w-4",
                        streakInfo.currentStreak >= 7
                          ? "text-orange-500"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium",
                        streakInfo.currentStreak >= 7
                          ? "text-orange-500"
                          : "text-muted-foreground"
                      )}
                    >
                      {streakInfo.currentStreak} day
                      {streakInfo.currentStreak !== 1 ? "s" : ""}
                    </span>
                  </motion.div>
                )}

                {streakInfo.longestStreak > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Best: {streakInfo.longestStreak}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onViewDetails && (
                  <DropdownMenuItem onClick={() => onViewDetails(habit.id)}>
                    View Details
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(habit.id)}>
                    Edit Habit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(habit.id)}
                    className="text-destructive"
                  >
                    Delete Habit
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
