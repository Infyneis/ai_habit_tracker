export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for creating a habit
const createHabitSchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().default("sparkles"),
  color: z.string().default("#a855f7"),
  categoryId: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"]).default("DAILY"),
  targetCount: z.number().int().min(1).default(1),
  targetPeriod: z.enum(["DAY", "WEEK", "MONTH"]).default("DAY"),
  tags: z.array(z.string()).optional(),
});

// GET /api/habits - List all habits for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId,
        archived: false,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        completions: {
          orderBy: { completedAt: "desc" },
          take: 30, // Last 30 completions for streak calculation
        },
        _count: {
          select: { completions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: habits });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createHabitSchema.parse(body);

    const { tags, ...habitData } = validated;

    const habit = await prisma.habit.create({
      data: {
        ...habitData,
        tags: tags
          ? {
              create: tags.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({ data: habit }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
