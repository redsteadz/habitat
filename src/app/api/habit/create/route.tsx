import { NextRequest, NextResponse } from "next/server";
// Create new habits for the user
import { db } from "@/server/db";
import { habitsTable, usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// DEV - Create habits for given user id
// PROD - Create habits for authenticated user id

export async function POST(req: NextRequest) {
  // take an array of habits and create them
  const { name, frequency, userMail } = await req.json();

  if (!name || !frequency || !userMail) {
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
    const createdAt = new Date().toISOString();
    const startDate = new Date().toISOString();
    const newHabit: typeof habitsTable.$inferInsert = {
      name,
      createdAt,
      startDate,
      frequency,
      streak: 0,
      userId,
      status: "active",
    };

    // console.log("New habit: ", newHabit);

    const habit = await db.insert(habitsTable).values(newHabit).returning();
    return NextResponse.json({
      message: "Habit created successfully",
      habit: habit[0],
    });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { message: "Error creating habit" },
      { status: 500 },
    );
  }
}
