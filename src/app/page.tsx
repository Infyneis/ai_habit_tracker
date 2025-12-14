"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { AffirmationCard } from "@/components/dashboard/affirmation-card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { HabitCard } from "@/components/habits/habit-card";
import { CreateHabitDialog } from "@/components/habits/create-habit-dialog";
import { Confetti } from "@/components/animations/confetti";
import { HABIT_CATEGORIES } from "@/lib/ollama";
import type { HabitWithRelations, StreakInfo } from "@/types";

// Sample data - will be replaced with real data from database
const sampleHabits: HabitWithRelations[] = [
  {
    id: "1",
    userId: "demo",
    name: "Morning Meditation",
    description: "10 minutes of mindfulness",
    icon: "meditation",
    color: "#a855f7",
    categoryId: "wellness",
    frequency: "DAILY",
    targetCount: 1,
    targetPeriod: "DAY",
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
    category: { id: "wellness", name: "Wellness", icon: "heart", color: "#a855f7" },
  },
  {
    id: "2",
    userId: "demo",
    name: "Read 20 pages",
    description: "Expand your knowledge daily",
    icon: "book",
    color: "#7c3aed",
    categoryId: "growth",
    frequency: "DAILY",
    targetCount: 1,
    targetPeriod: "DAY",
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
    category: { id: "growth", name: "Growth", icon: "brain", color: "#7c3aed" },
  },
  {
    id: "3",
    userId: "demo",
    name: "Exercise",
    description: "30 minutes of movement",
    icon: "dumbbell",
    color: "#9333ea",
    categoryId: "health",
    frequency: "DAILY",
    targetCount: 1,
    targetPeriod: "DAY",
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
    category: { id: "health", name: "Health", icon: "heart", color: "#9333ea" },
  },
  {
    id: "4",
    userId: "demo",
    name: "Drink 8 glasses of water",
    description: "Stay hydrated throughout the day",
    icon: "water",
    color: "#c084fc",
    categoryId: "health",
    frequency: "DAILY",
    targetCount: 8,
    targetPeriod: "DAY",
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
    category: { id: "health", name: "Health", icon: "heart", color: "#9333ea" },
  },
];

const sampleStreaks: Record<string, StreakInfo> = {
  "1": { currentStreak: 12, longestStreak: 15, lastCompletedAt: new Date(), isCompletedToday: true },
  "2": { currentStreak: 5, longestStreak: 21, lastCompletedAt: new Date(), isCompletedToday: false },
  "3": { currentStreak: 8, longestStreak: 30, lastCompletedAt: new Date(), isCompletedToday: true },
  "4": { currentStreak: 3, longestStreak: 10, lastCompletedAt: new Date(), isCompletedToday: false },
};

const affirmations = [
  "Every small step you take today builds the foundation for tomorrow's success.",
  "Your consistency is creating lasting change. Keep going!",
  "You are capable of achieving anything you set your mind to.",
  "Today is another opportunity to become the best version of yourself.",
  "Your dedication to growth inspires those around you.",
];

export default function DashboardPage() {
  const [habits, setHabits] = useState(sampleHabits);
  const [streaks, setStreaks] = useState(sampleStreaks);
  const [affirmation, setAffirmation] = useState(affirmations[0]);
  const [isLoadingAffirmation, setIsLoadingAffirmation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const completedToday = Object.values(streaks).filter((s) => s.isCompletedToday).length;
  const totalHabits = habits.length;
  const completionRate = Math.round((completedToday / totalHabits) * 100);
  const overallStreak = Math.max(...Object.values(streaks).map((s) => s.currentStreak));

  const handleToggleHabit = (habitId: string, completed: boolean) => {
    setStreaks((prev) => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        isCompletedToday: completed,
        currentStreak: completed
          ? prev[habitId].currentStreak + 1
          : Math.max(0, prev[habitId].currentStreak - 1),
      },
    }));

    // Trigger confetti for milestone streaks
    if (completed) {
      const newStreak = streaks[habitId].currentStreak + 1;
      if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
    }
  };

  const refreshAffirmation = () => {
    setIsLoadingAffirmation(true);
    // Simulate API call - will be replaced with real Ollama call
    setTimeout(() => {
      const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      setAffirmation(newAffirmation);
      setIsLoadingAffirmation(false);
    }, 1000);
  };

  const handleCreateHabit = (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: string;
    targetCount: number;
    targetPeriod: string;
    categoryId?: string;
  }) => {
    // Find category details if categoryId is provided
    const categoryData = data.categoryId
      ? HABIT_CATEGORIES.find((c) => c.id === data.categoryId)
      : null;

    const newHabit: HabitWithRelations = {
      id: crypto.randomUUID(),
      userId: "demo",
      name: data.name,
      description: data.description || null,
      icon: data.icon,
      color: data.color,
      categoryId: data.categoryId || null,
      frequency: data.frequency as "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM",
      targetCount: data.targetCount,
      targetPeriod: data.targetPeriod as "DAY" | "WEEK" | "MONTH",
      createdAt: new Date(),
      updatedAt: new Date(),
      archived: false,
      category: categoryData
        ? {
            id: categoryData.id,
            name: categoryData.name,
            icon: categoryData.icon,
            color: categoryData.color,
          }
        : null,
    };

    setHabits((prev) => [newHabit, ...prev]);
    setStreaks((prev) => ({
      ...prev,
      [newHabit.id]: {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedAt: null,
        isCompletedToday: false,
      },
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setStreaks((prev) => {
      const newStreaks = { ...prev };
      delete newStreaks[habitId];
      return newStreaks;
    });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Confetti trigger={showConfetti} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">
          {getGreeting()}! <span className="text-gradient-lavender">Ready to grow?</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and build lasting habits
        </p>
      </motion.div>

      {/* Affirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <AffirmationCard
          affirmation={affirmation}
          onRefresh={refreshAffirmation}
          isLoading={isLoadingAffirmation}
        />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <StatsCard
          title="Total Habits"
          value={totalHabits}
          icon={Target}
          color="#a855f7"
        />
        <StatsCard
          title="Completed Today"
          value={completedToday}
          icon={CheckCircle2}
          color="#9333ea"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Completion Rate"
          value={completionRate}
          suffix="%"
          icon={TrendingUp}
          color="#7c3aed"
        />
        <StatsCard
          title="Best Streak"
          value={overallStreak}
          suffix=" days"
          icon={Calendar}
          color="#c084fc"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Habits List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today&apos;s Habits</h2>
            <CreateHabitDialog onSubmit={handleCreateHabit} />
          </div>

          <div className="space-y-3">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <HabitCard
                  habit={habit}
                  streakInfo={streaks[habit.id]}
                  onToggle={handleToggleHabit}
                  onDelete={handleDeleteHabit}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Progress Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today&apos;s Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-4">
              <ProgressRing
                progress={completionRate}
                size={140}
                strokeWidth={10}
                label="completed"
              />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                {completedToday} of {totalHabits} habits completed
              </p>
            </CardContent>
          </Card>

          {/* Streak Display */}
          <StreakCounter
            streak={overallStreak}
            label="Current Best Streak"
            size="md"
          />

          {/* AI Suggestions Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Suggestions</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your habits, you might enjoy:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Evening journaling
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Gratitude practice
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Digital detox hour
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
