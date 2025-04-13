import "dotenv/config";
import { habitsTable, usersTable } from "./schema";
import { eq } from "drizzle-orm";
import { db } from "./index";

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    email: "john@example.com",
    githubId: "1",
    createdAt: new Date().toISOString(),
  };

  // export const habitsTable = pgTable("habits", {
  //   id: varchar({ length: 255 }).primaryKey(),
  //   name: varchar({ length: 255 }).notNull(),
  //   createdAt: date(),
  //   startDate: date(),
  //   frequency: text({ enum: ["daily", "weekly", "custom"] }).notNull(),
  //   streak: integer().notNull(),
  //   userId: integer().notNull(),
  //   // Holds streaks
  //   // {startDate: number, endDate: number, streak: number}[]
  //   completions: integer().notNull(),
  //   status: text({ enum: ["active", "archived", "completed"] }).notNull(),
  // });
  const habit: typeof habitsTable.$inferInsert = {
    name: "Workout",
    createdAt: new Date().toISOString(),
    startDate: new Date().toISOString(),
    frequency: "daily",
    streak: 0,
    userId: 1,
    completions: 0,
    status: "active",
  };
  await db.insert(usersTable).values(user);
  console.log("New user created!");
  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);

  await db.insert(habitsTable).values(habit);
  console.log("New habit created!");
  const habits = await db.select().from(habitsTable);
  console.log("Getting all habits from the database: ", habits);
}

main();
