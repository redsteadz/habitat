import { NextRequest, NextResponse } from "next/server";
// Create new habits for the user
import { db } from "@/server/db";
import {
  Completion,
  completionsTable,
  Habit,
  habitsTable,
  usersTable,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { assert } from "console";

// DEV - Create habits for given user id
// PROD - Create habits for authenticated user id

export async function POST(req: NextRequest) {
  // take an array of habits and create them
  const { habitId, userMail, status } = await req.json();

  if (!habitId || !userMail || !status) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }
  assert(typeof status == "boolean");
  try {
    const userId = await db.query.usersTable
      .findFirst({
        where: eq(usersTable.email, userMail),
      })
      .then((user) => user?.id);
    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const habit = await db.query.habitsTable.findFirst({
      where: eq(habitsTable.id, habitId),
    });
    if (!habit) {
      return NextResponse.json(
        {
          message: "Habit not found",
        },
        { status: 404 },
      );
    }

    const newCompletion: typeof completionsTable.$inferInsert = {
      date: new Date().toISOString(),
      completed: status,
      habitId: habit.id,
    };

    const completion = await db.insert(completionsTable).values(newCompletion);

    return NextResponse.json({
      message: "Completion added successfully",
      completion: completion,
    });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { message: "Error creating habit" },
      { status: 500 },
    );
  }
}
