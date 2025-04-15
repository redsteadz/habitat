import { NextRequest, NextResponse } from "next/server";
// Create new habits for the user
import { db } from "@/server/db";
import { Habit, habitsTable, usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// DEV - Create habits for given user id
// PROD - Create habits for authenticated user id

export async function POST(req: NextRequest) {
  // take an array of habits and create them
  const { habitId, userMail } = await req.json();

  if (!habitId || !userMail) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

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
    await db.delete(habitsTable).where(eq(habitsTable.id, habit.id));
    return NextResponse.json({
      message: "Habit removed successfully",
    });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { message: "Error creating habit" },
      { status: 500 },
    );
  }
}
