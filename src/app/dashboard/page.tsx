import HobbyTracker from "@/components/hobby-tracker";
import { db } from "@/server/db";
import { completionsTable, habitsTable } from "@/server/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { usersTable, Completion, Habit } from "@/server/db/schema";
import { auth } from "../api/auth/[...nextauth]/route";
import { addDays, format, formatDate, subDays } from "date-fns";

type HabitWithCompletions = Habit & {
  completions: Completion[];
  todayStatus?: "done" | "skipped" | null;
};

export default async function DashboardPage() {
  // Read the Habits associated with the user
  const session = await auth();
  const email = session?.user?.email!;
  // console.log("email:", email);
  // from the email get the userID

  const userId = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email?.toString()));
  // // from the user ID, retrieve all the Habits
  // console.log("userId: ", userId);
  const habits: HabitWithCompletions[] = await db.query.habitsTable.findMany({
    where: eq(habitsTable.userId, userId[0]?.id),
    with: {
      completions: {
        orderBy: (completions, { asc }) => [asc(completions.date)],
      },
    },
  });

  const today = new Date();
  const yesterday = subDays(today, 1);
  const fixedHabits: HabitWithCompletions[] = await Promise.all(
    habits.map(async (habit) => {
      // update the streak according to if the previous day is completed
      const prevCompletion = await db.query.completionsTable.findFirst({
        where: and(
          eq(completionsTable.habitId, habit.id),
          eq(completionsTable.date, yesterday.toISOString()),
        ),
      });
      if (prevCompletion?.completed ?? false) {
        habit.streak = 0;
      }

      let newCompletions: Completion[] = [];
      // for each hobby, return the completion of the last 7 days
      // from last saturday to next friday
      const lastSat = subDays(today, today.getDay() % 7);
      // set todayStatus to the completion of today

      for (let i = 0; i < 7; i++) {
        const date = addDays(lastSat, i);
        const completion = habit.completions.find((c) =>
          format(new Date(c.date), "yyyy-MM-dd").includes(
            format(date, "yyyy-MM-dd"),
          ),
        );
        newCompletions.push({
          id: completion ? completion.id : 0,
          habitId: habit.id,
          date: date.toISOString(),
          completed: completion?.completed ? true : false,
        });
      }
      return {
        ...habit,
        completions: newCompletions,
      };
    }),
  );

  // console.log("Habits: ", habits);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <HobbyTracker habits={fixedHabits} today={today.toISOString()} />
    </main>
  );
}
