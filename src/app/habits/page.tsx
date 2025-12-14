"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Archive, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitCard } from "@/components/habits/habit-card";
import { CreateHabitDialog } from "@/components/habits/create-habit-dialog";
import { toast } from "sonner";
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
  {
    id: "5",
    userId: "demo",
    name: "Weekly Review",
    description: "Reflect on the week and plan ahead",
    icon: "brain",
    color: "#6366f1",
    categoryId: "productivity",
    frequency: "WEEKLY",
    targetCount: 1,
    targetPeriod: "WEEK",
    createdAt: new Date(),
    updatedAt: new Date(),
    archived: false,
    category: { id: "productivity", name: "Productivity", icon: "sparkles", color: "#6366f1" },
  },
];

const sampleStreaks: Record<string, StreakInfo> = {
  "1": { currentStreak: 12, longestStreak: 15, lastCompletedAt: new Date(), isCompletedToday: true },
  "2": { currentStreak: 5, longestStreak: 21, lastCompletedAt: new Date(), isCompletedToday: false },
  "3": { currentStreak: 8, longestStreak: 30, lastCompletedAt: new Date(), isCompletedToday: true },
  "4": { currentStreak: 3, longestStreak: 10, lastCompletedAt: new Date(), isCompletedToday: false },
  "5": { currentStreak: 4, longestStreak: 12, lastCompletedAt: new Date(), isCompletedToday: false },
};

type FilterType = "all" | "daily" | "weekly" | "monthly";
type SortType = "name" | "created" | "streak";

export default function HabitsPage() {
  const [habits, setHabits] = useState(sampleHabits);
  const [streaks, setStreaks] = useState(sampleStreaks);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("created");
  const [showArchived, setShowArchived] = useState(false);

  // Filter and sort habits
  const filteredHabits = habits
    .filter((habit) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !habit.name.toLowerCase().includes(query) &&
          !habit.description?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Frequency filter
      if (filterType !== "all") {
        if (filterType === "daily" && habit.frequency !== "DAILY") return false;
        if (filterType === "weekly" && habit.frequency !== "WEEKLY") return false;
        if (filterType === "monthly" && habit.frequency !== "MONTHLY") return false;
      }

      // Archived filter
      if (!showArchived && habit.archived) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "streak") {
        return (streaks[b.id]?.currentStreak || 0) - (streaks[a.id]?.currentStreak || 0);
      }
      // Default: created
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleToggleHabit = (habitId: string, completed: boolean) => {
    setStreaks((prev) => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        isCompletedToday: completed,
        currentStreak: completed
          ? (prev[habitId]?.currentStreak || 0) + 1
          : Math.max(0, (prev[habitId]?.currentStreak || 0) - 1),
      },
    }));

    if (completed) {
      toast.success("Habit completed! Keep it up!");
    }
  };

  const handleCreateHabit = (data: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: string;
    targetCount: number;
    targetPeriod: string;
  }) => {
    const newHabit: HabitWithRelations = {
      id: Date.now().toString(),
      userId: "demo",
      name: data.name,
      description: data.description || null,
      icon: data.icon,
      color: data.color,
      categoryId: null,
      frequency: data.frequency as "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM",
      targetCount: data.targetCount,
      targetPeriod: data.targetPeriod as "DAY" | "WEEK" | "MONTH",
      createdAt: new Date(),
      updatedAt: new Date(),
      archived: false,
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

    toast.success(`"${data.name}" created! Start building your streak.`);
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    toast.success(`"${habit?.name}" deleted`);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Your Habits</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all your habits in one place
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Frequency</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilterType("all")}>
                All habits
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("daily")}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("weekly")}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("monthly")}>
                Monthly
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowArchived(!showArchived)}>
                <Archive className="h-4 w-4 mr-2" />
                {showArchived ? "Hide archived" : "Show archived"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("created")}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("streak")}>
                Highest streak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CreateHabitDialog onSubmit={handleCreateHabit} />
        </div>
      </motion.div>

      {/* Tabs for quick filtering */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilterType("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="daily" onClick={() => setFilterType("daily")}>
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" onClick={() => setFilterType("weekly")}>
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" onClick={() => setFilterType("monthly")}>
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <HabitsList
            habits={filteredHabits}
            streaks={streaks}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
          />
        </TabsContent>
        <TabsContent value="daily" className="mt-4">
          <HabitsList
            habits={filteredHabits}
            streaks={streaks}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
          />
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          <HabitsList
            habits={filteredHabits}
            streaks={streaks}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
          />
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <HabitsList
            habits={filteredHabits}
            streaks={streaks}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HabitsList({
  habits,
  streaks,
  onToggle,
  onDelete,
}: {
  habits: HabitWithRelations[];
  streaks: Record<string, StreakInfo>;
  onToggle: (habitId: string, completed: boolean) => void;
  onDelete: (habitId: string) => void;
}) {
  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground">No habits found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new habit to get started
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
          >
            <HabitCard
              habit={habit}
              streakInfo={streaks[habit.id] || {
                currentStreak: 0,
                longestStreak: 0,
                lastCompletedAt: null,
                isCompletedToday: false,
              }}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
