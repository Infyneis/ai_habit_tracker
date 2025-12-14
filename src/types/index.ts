// Re-export Prisma types for convenience
export type {
  User,
  Habit,
  Completion,
  Category,
  Tag,
  HabitTag,
  Reminder,
  Settings,
  Affirmation,
  Notification,
} from "@/generated/prisma/client";

export {
  Frequency,
  Period,
  ReminderType,
  Theme,
  NotificationType,
} from "@/generated/prisma/client";

// Extended types with relations
export interface HabitWithRelations {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  categoryId: string | null;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
  targetCount: number;
  targetPeriod: "DAY" | "WEEK" | "MONTH";
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
  tags?: {
    tag: {
      id: string;
      name: string;
    };
  }[];
  completions?: {
    id: string;
    completedAt: Date;
    note: string | null;
  }[];
  _count?: {
    completions: number;
  };
}

// Streak calculation result
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt: Date | null;
  isCompletedToday: boolean;
}

// Statistics types
export interface HabitStats {
  totalCompletions: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: number[];
  monthlyProgress: number[];
}

export interface DashboardStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  overallStreak: number;
  weeklyCompletionRate: number;
}

// Form types
export interface CreateHabitInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryId?: string;
  frequency?: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
  targetCount?: number;
  targetPeriod?: "DAY" | "WEEK" | "MONTH";
  tags?: string[];
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  archived?: boolean;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
