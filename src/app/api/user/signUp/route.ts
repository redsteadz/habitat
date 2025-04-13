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
    // Assuming you have a function to add a user to your database
    // await addUserToDatabase({ name, email, githubId });
    const isExisting = await db.query.usersTable.findFirst({
      where: eq(usersTable.githubId, githubId),
    });
    if (isExisting) {
      console.log("User already exists: ", isExisting);
      return NextResponse.json({ message: "User logged in" });
    }

    const newUser: typeof usersTable.$inferInsert = {
      name,
      email,
      githubId,
    };

    console.log("New user: ", newUser);

    await db.insert(usersTable).values(newUser);
    return NextResponse.json({ message: "User signed up successfully" });
  } catch (error) {
    console.error("Error signing up user:", error);
    return NextResponse.json(
      { message: "Error signing up user" },
      { status: 500 },
    );
  }
}
