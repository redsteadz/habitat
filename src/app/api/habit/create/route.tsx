import { NextRequest, NextResponse } from "next/server";
// Create new habits for the user
import { db } from "@/server/db";
import { habitsTable } from "@/server/db/schema";

// DEV - Create habits for given user id
// PROD - Create habits for authenticated user id

export async function POST(req: NextRequest) {
  // take an array of habits and create them
  const { name, frequency, startDate, userId } = await req.json();

  if (!name || !frequency || !startDate || !userId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const createdAt = new Date().toISOString();
    const newHabit: typeof habitsTable.$inferInsert = {
      name,
      createdAt,
      startDate,
      frequency,
      streak: 0,
      userId,
      status: "active",
    };

    console.log("New habit: ", newHabit);

    await db.insert(habitsTable).values(newHabit);
    return NextResponse.json({ message: "Habit created successfully" });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { message: "Error creating habit" },
      { status: 500 },
    );
  }
}
