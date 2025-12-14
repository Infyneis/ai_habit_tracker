export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { suggestCategory, checkOllamaHealth, HABIT_CATEGORIES } from "@/lib/ollama";

// POST /api/ai/suggest-category - Get AI-suggested category for a habit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { habitName, habitDescription } = body;

    if (!habitName) {
      return NextResponse.json(
        { error: "habitName is required" },
        { status: 400 }
      );
    }

    // Check if Ollama is available
    const isOllamaAvailable = await checkOllamaHealth();

    let suggestedCategoryId: string;

    if (isOllamaAvailable) {
      suggestedCategoryId = await suggestCategory(habitName, habitDescription);
    } else {
      // Fallback: simple keyword matching
      suggestedCategoryId = fallbackCategorySuggestion(habitName, habitDescription);
    }

    const category = HABIT_CATEGORIES.find((c) => c.id === suggestedCategoryId);

    return NextResponse.json({
      data: {
        categoryId: suggestedCategoryId,
        category,
      },
      source: isOllamaAvailable ? "ollama" : "fallback",
    });
  } catch (error) {
    console.error("Error suggesting category:", error);
    return NextResponse.json({
      data: {
        categoryId: "other",
        category: HABIT_CATEGORIES.find((c) => c.id === "other"),
      },
      source: "fallback",
    });
  }
}

// Simple keyword-based fallback when Ollama is unavailable
function fallbackCategorySuggestion(name: string, description?: string): string {
  const text = `${name} ${description || ""}`.toLowerCase();

  const keywords: Record<string, string[]> = {
    health: ["health", "doctor", "medicine", "vitamin", "checkup"],
    fitness: ["exercise", "workout", "gym", "run", "walk", "sport", "training", "stretch"],
    nutrition: ["eat", "food", "diet", "water", "drink", "meal", "vegetable", "fruit", "calories"],
    sleep: ["sleep", "bed", "wake", "morning", "night", "rest", "nap"],
    mindfulness: ["meditat", "mindful", "breath", "calm", "stress", "relax", "peace"],
    wellness: ["wellness", "self-care", "spa", "mental", "therapy"],
    learning: ["read", "book", "learn", "study", "course", "skill", "language", "practice"],
    productivity: ["work", "task", "project", "plan", "organize", "focus", "email", "meeting"],
    creativity: ["art", "paint", "draw", "music", "write", "creative", "design", "craft"],
    social: ["friend", "family", "call", "meet", "social", "connect", "relationship"],
    finance: ["money", "save", "budget", "invest", "finance", "expense", "income"],
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((word) => text.includes(word))) {
      return category;
    }
  }

  return "other";
}
