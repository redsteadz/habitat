import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { name, email, githubId } = await req.json();

  if (!name || !email || !githubId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    // Validate input
    if (!name || !email || !githubId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if the user already exists
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.githubId, githubId));
    const existingUser = existingUsers[0];
    if (existingUser) {
      return NextResponse.json({ id: existingUser.id });
    }

    // Create a new user
    const createdAt = new Date().toISOString();
    const [newUser] = await db
      .insert(usersTable)
      .values({ name, email, githubId, createdAt })
      .returning();

    // Return the new user's ID
    return NextResponse.json({ id: newUser.id });
  } catch (error) {
    console.error("Error signing up user:", error);
    return NextResponse.json(
      { message: "Error signing up user" },
      { status: 500 },
    );
  }
}
