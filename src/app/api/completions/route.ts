export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCompletionSchema = z.object({
  habitId: z.string(),
  note: z.string().max(500).optional(),
  completedAt: z.string().datetime().optional(),
});

const deleteCompletionSchema = z.object({
  habitId: z.string(),
  date: z.string(), // YYYY-MM-DD format
});

// POST /api/completions - Mark a habit as complete
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCompletionSchema.parse(body);

    const completion = await prisma.completion.create({
      data: {
        habitId: validated.habitId,
        note: validated.note,
        completedAt: validated.completedAt
          ? new Date(validated.completedAt)
          : new Date(),
      },
    });

    return NextResponse.json({ data: completion }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating completion:", error);
    return NextResponse.json(
      { error: "Failed to create completion" },
      { status: 500 }
    );
  }
}

// DELETE /api/completions - Remove a completion for a specific day
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = deleteCompletionSchema.parse(body);

    const startOfDay = new Date(validated.date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(validated.date);
    endOfDay.setHours(23, 59, 59, 999);

    // Delete completions for this habit on this specific day
    const deleted = await prisma.completion.deleteMany({
      where: {
        habitId: validated.habitId,
        completedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return NextResponse.json({
      message: `Deleted ${deleted.count} completion(s)`,
      count: deleted.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error deleting completion:", error);
    return NextResponse.json(
      { error: "Failed to delete completion" },
      { status: 500 }
    );
  }
}
