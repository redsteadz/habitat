import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  text,
  boolean,
  date,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  // Can be null for a github userr
  githubId: varchar({ length: 255 }).notNull().unique(),
  createdAt: date().notNull(),
});

// Habit {
//   id: string;                // unique identifier
//   name: string;              // e.g. "Workout", "Meditate", "Read"
//   description?: string;      // optional longer description
//   createdAt: Date;           // when the habit was added
//   startDate: Date;           // when the user actually started
//   frequency: Frequency;      // how often? daily, weekly, custom
//
//   streak: number;            // current continuous streak
//   longestStreak: number;     // highest streak ever achieved
//   completions: Completion[]; // log of days when completed
//
//   status: 'active' | 'archived' | 'completed'; // lifecycle status
// }

export const usersRelations = relations(usersTable, ({ many }) => ({
  habits: many(habitsTable),
}));

// export const completionsTable = pgTable("completions", {
//   id: varchar({ length: 255 }).primaryKey(),
//   habitId: varchar({ length: 255 }).notNull(),
//   date: date(),
//   completed: boolean().notNull(),
// });

export const habitsTable = pgTable("habits", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: date(),
  startDate: date(),
  frequency: text({ enum: ["daily", "weekly", "custom"] }).notNull(),
  streak: integer().notNull(),
  userId: integer().notNull(),
  // Holds streaks
  // {startDate: number, endDate: number, streak: number}[]
  completions: integer().notNull(),
  status: text({ enum: ["active", "archived", "completed"] }).notNull(),
});

export const habitsRelations = relations(habitsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [habitsTable.userId],
    references: [usersTable.id],
  }),
}));

// A user can have many habits

// A habit can have many completions
// A completion belongs to a habit
