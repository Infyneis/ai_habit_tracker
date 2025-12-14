const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generateCompletion(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  const { model = OLLAMA_MODEL, temperature = 0.7, maxTokens = 500 } = options;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error("Ollama generation error:", error);
    throw error;
  }
}

export async function generateAffirmation(
  context?: string
): Promise<string> {
  const prompt = context
    ? `Generate a short, personalized daily affirmation (1-2 sentences) for someone who is working on: ${context}. Make it encouraging and specific. Only output the affirmation, no quotes or attribution.`
    : `Generate a short, inspiring daily affirmation (1-2 sentences) about personal growth and building good habits. Make it warm and encouraging. Only output the affirmation, no quotes or attribution.`;

  return generateCompletion(prompt, { temperature: 0.8 });
}

export async function generateHabitSuggestions(
  existingHabits: string[]
): Promise<string[]> {
  const habitsList = existingHabits.join(", ") || "none yet";
  const prompt = `Based on these existing habits: ${habitsList}

Suggest 3 complementary habits that would pair well. Format as a JSON array of strings, like: ["habit1", "habit2", "habit3"]
Only output the JSON array, nothing else.`;

  const response = await generateCompletion(prompt, { temperature: 0.7 });

  try {
    const parsed = JSON.parse(response.trim());
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Fallback: try to extract habits from text
    const matches = response.match(/"([^"]+)"/g);
    return matches ? matches.map((m) => m.replace(/"/g, "")).slice(0, 3) : [];
  }
}

export async function generateHabitTips(habitName: string): Promise<string> {
  const prompt = `Give 3 practical tips for maintaining the habit: "${habitName}".
Keep each tip concise (1 sentence). Format as a numbered list.
Only output the tips, nothing else.`;

  return generateCompletion(prompt, { temperature: 0.6 });
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Predefined categories for habits
export const HABIT_CATEGORIES = [
  { id: "health", name: "Health", icon: "💪", color: "#22c55e" },
  { id: "wellness", name: "Wellness", icon: "🧘", color: "#a855f7" },
  { id: "productivity", name: "Productivity", icon: "⚡", color: "#f97316" },
  { id: "learning", name: "Learning", icon: "📚", color: "#3b82f6" },
  { id: "fitness", name: "Fitness", icon: "🏃", color: "#ef4444" },
  { id: "mindfulness", name: "Mindfulness", icon: "🧠", color: "#8b5cf6" },
  { id: "nutrition", name: "Nutrition", icon: "🥗", color: "#10b981" },
  { id: "sleep", name: "Sleep", icon: "🌙", color: "#6366f1" },
  { id: "social", name: "Social", icon: "👥", color: "#ec4899" },
  { id: "creativity", name: "Creativity", icon: "🎨", color: "#f59e0b" },
  { id: "finance", name: "Finance", icon: "💰", color: "#14b8a6" },
  { id: "other", name: "Other", icon: "✨", color: "#64748b" },
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

export async function suggestCategory(
  habitName: string,
  habitDescription?: string
): Promise<string> {
  const categoryNames = HABIT_CATEGORIES.map((c) => c.id).join(", ");
  const context = habitDescription
    ? `${habitName}: ${habitDescription}`
    : habitName;

  const prompt = `Given this habit: "${context}"

Choose the single most appropriate category from this list: ${categoryNames}

Only respond with the category id (one word), nothing else.`;

  try {
    const response = await generateCompletion(prompt, {
      temperature: 0.3,
      maxTokens: 20,
    });

    const suggested = response.trim().toLowerCase();
    const validCategory = HABIT_CATEGORIES.find((c) => c.id === suggested);

    return validCategory ? validCategory.id : "other";
  } catch {
    return "other";
  }
}
