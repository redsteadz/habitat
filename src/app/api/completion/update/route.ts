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
import { and, eq } from "drizzle-orm";
import { assert } from "console";
import { stat } from "fs";
import { addDays, subDays } from "date-fns";

// DEV - Create habits for given user id
// PROD - Create habits for authenticated user id

export async function POST(req: NextRequest) {
  // take an array of habits and create them
  const { habitId, userMail, status } = await req.json();

  if (!habitId || !userMail || status == undefined) {
    console.log(habitId, userMail, status);
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
    const today = addDays(new Date(), 1).toISOString();
    const newCompletion: typeof completionsTable.$inferInsert = {
      date: today,
      completed: status,
      habitId: habit.id,
    };

    // console.log(newCompletion);

    let isExisting = await db.query.completionsTable.findFirst({
      where: and(
        eq(completionsTable.date, today),
        eq(completionsTable.habitId, habitId),
      ),
    });
    let yesterday = subDays(new Date(today), 3).toISOString();
    let previousCompletion = await db.query.completionsTable.findFirst({
      where: and(
        eq(completionsTable.date, yesterday),
        eq(completionsTable.habitId, habitId),
      ),
    });

    let completion;
    if (!isExisting) {
      // IF not existing re use and update
      completion = await db
        .insert(completionsTable)
        .values(newCompletion)
        .returning();
    } else if (isExisting.completed != status) {
      // console.log("Updating completion");
      completion = await db
        .update(completionsTable)
        .set({
          completed: status,
        })
        .where(
          and(
            eq(completionsTable.date, today),
            eq(completionsTable.habitId, habitId),
          ),
        )
        .returning();
    }

    let newStreak = 0;
    if (previousCompletion?.completed) {
      const habit = await db.query.habitsTable.findFirst({
        where: eq(habitsTable.id, habitId),
      });

      newStreak = habit?.streak!;
    }

    if (status) {
      newStreak++;
    } else newStreak = 0;

    await db
      .update(habitsTable)
      .set({ streak: newStreak })
      .where(eq(habitsTable.id, habitId));

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
