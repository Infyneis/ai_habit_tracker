import { NextRequest, NextResponse } from "next/server";
import { generateHabitSuggestions, checkOllamaHealth } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Fallback suggestions based on categories
const fallbackSuggestions: Record<string, string[]> = {
  health: [
    "Drink 8 glasses of water daily",
    "Take a 10-minute walk after lunch",
    "Practice deep breathing for 5 minutes",
    "Stretch for 10 minutes in the morning",
    "Get 7-8 hours of sleep",
  ],
  productivity: [
    "Plan your day the night before",
    "Use the Pomodoro technique",
    "Review your goals weekly",
    "Limit social media to 30 minutes",
    "Practice single-tasking",
  ],
  wellness: [
    "Meditate for 10 minutes daily",
    "Write 3 gratitude items each day",
    "Spend 15 minutes in nature",
    "Practice journaling",
    "Digital detox before bed",
  ],
  learning: [
    "Read 20 pages of a book",
    "Learn 5 new vocabulary words",
    "Watch an educational video",
    "Practice a new skill for 30 minutes",
    "Listen to a podcast during commute",
  ],
  default: [
    "Morning meditation",
    "Evening journaling",
    "Daily exercise",
    "Reading habit",
    "Gratitude practice",
  ],
};

// POST /api/ai/suggestions - Get habit suggestions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, category } = body;

    // Get existing habits if userId is provided
    let existingHabits: string[] = [];
    if (userId) {
      const habits = await prisma.habit.findMany({
        where: { userId, archived: false },
        select: { name: true },
      });
      existingHabits = habits.map((h) => h.name);
    }

    // Check if Ollama is available
    const isOllamaAvailable = await checkOllamaHealth();

    let suggestions: string[];

    if (isOllamaAvailable && existingHabits.length > 0) {
      try {
        suggestions = await generateHabitSuggestions(existingHabits);
      } catch {
        // Fallback to category-based suggestions
        suggestions = getFallbackSuggestions(category, existingHabits);
      }
    } else {
      // Use fallback suggestions
      suggestions = getFallbackSuggestions(category, existingHabits);
    }

    return NextResponse.json({
      data: suggestions,
      source: isOllamaAvailable ? "ollama" : "fallback",
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json({
      data: fallbackSuggestions.default,
      source: "fallback",
    });
  }
}

function getFallbackSuggestions(
  category?: string,
  existingHabits: string[] = []
): string[] {
  const categoryKey =
    category && category in fallbackSuggestions ? category : "default";
  const suggestions = fallbackSuggestions[categoryKey];

  // Filter out habits that already exist (case-insensitive)
  const existingLower = existingHabits.map((h) => h.toLowerCase());
  const filtered = suggestions.filter(
    (s) => !existingLower.some((e) => s.toLowerCase().includes(e))
  );

  // Return first 3 suggestions
  return filtered.slice(0, 3);
}
