import { relations, InferModel } from "drizzle-orm";
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

export const completionsTable = pgTable("completions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  habitId: integer()
    .notNull()
    .references(() => habitsTable.id),
  date: date().notNull(),
  streak: integer().default(0),
  completed: boolean().notNull(),
});

export const habitsTable = pgTable("habits", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: date(),
  startDate: date(),
  frequency: text({ enum: ["daily", "weekly", "custom"] }).notNull(),
  streak: integer().notNull().default(0),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
  status: text({ enum: ["active", "archived", "completed"] }).notNull(),
});

export const habitsRelations = relations(habitsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [habitsTable.userId],
    references: [usersTable.id],
  }),
  completions: many(completionsTable),
}));

export const completionsTableRelations = relations(
  completionsTable,
  ({ one }) => ({
    habit: one(habitsTable, {
      fields: [completionsTable.habitId],
      references: [habitsTable.id],
    }),
  }),
);

// typing
export type Habit = typeof habitsTable.$inferSelect;
export type HabitInsert = typeof habitsTable.$inferInsert;
export type Completion = typeof completionsTable.$inferSelect;

// A user can have many habits

// A habit can have many completions
// A completion belongs to a habit
