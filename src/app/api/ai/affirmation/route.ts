export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { generateAffirmation, checkOllamaHealth } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";

// Fallback affirmations in case Ollama is not available
const fallbackAffirmations = [
  "Every small step you take today builds the foundation for tomorrow's success.",
  "Your consistency is creating lasting change. Keep going!",
  "You are capable of achieving anything you set your mind to.",
  "Today is another opportunity to become the best version of yourself.",
  "Your dedication to growth inspires those around you.",
  "Progress, not perfection, is the key to lasting change.",
  "Each day is a fresh start to build the life you want.",
  "Your habits shape your future. Choose them wisely.",
  "Believe in your ability to grow and improve every day.",
  "Small daily improvements lead to remarkable results over time.",
];

// POST /api/ai/affirmation - Generate a personalized affirmation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, context } = body;

    // Check if Ollama is available
    const isOllamaAvailable = await checkOllamaHealth();

    let affirmationContent: string;

    if (isOllamaAvailable) {
      try {
        affirmationContent = await generateAffirmation(context);
      } catch {
        // Fallback to random affirmation if generation fails
        affirmationContent =
          fallbackAffirmations[
            Math.floor(Math.random() * fallbackAffirmations.length)
          ];
      }
    } else {
      // Use fallback if Ollama is not available
      affirmationContent =
        fallbackAffirmations[
          Math.floor(Math.random() * fallbackAffirmations.length)
        ];
    }

    // Save to database if userId is provided
    if (userId) {
      const affirmation = await prisma.affirmation.create({
        data: {
          userId,
          content: affirmationContent,
        },
      });

      return NextResponse.json({
        data: affirmation,
        source: isOllamaAvailable ? "ollama" : "fallback",
      });
    }

    return NextResponse.json({
      data: { content: affirmationContent },
      source: isOllamaAvailable ? "ollama" : "fallback",
    });
  } catch (error) {
    console.error("Error generating affirmation:", error);
    // Always return a fallback affirmation
    return NextResponse.json({
      data: {
        content:
          fallbackAffirmations[
            Math.floor(Math.random() * fallbackAffirmations.length)
          ],
      },
      source: "fallback",
    });
  }
}
