import HobbyTracker from "@/components/hobby-tracker";
import { db } from "@/server/db";
import { completionsTable, habitsTable } from "@/server/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { usersTable, Completion, Habit } from "@/server/db/schema";
import { auth } from "../api/auth/[...nextauth]/route";
import { addDays, format, formatDate, subDays } from "date-fns";
import { Suspense, cache } from "react";

type HabitWithCompletions = Habit & {
  completions: Completion[];
  todayStatus?: "done" | "skipped" | null;
};

const getUserHabits = cache(async (id: number) => {
  const habits: HabitWithCompletions[] = await db.query.habitsTable.findMany({
    where: eq(habitsTable.userId, id),
    with: {
      completions: {
        orderBy: (completions, { asc }) => [asc(completions.date)],
      },
    },
  });

  return habits;
});

const getUser = cache(async (email: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
    columns: { id: true },
  });
  return user;
});

export default async function DashboardPage() {
  // Read the Habits associated with the user
  const session = await auth();
  const email = session?.user?.email!;
  // console.log("email:", email);
  // from the email get the userID
  const user = await getUser(email);
  if (!user) throw new Error("User not found");
  // // from the user ID, retrieve all the Habits
  // console.log("userId: ", userId);
  const habits: HabitWithCompletions[] = await getUserHabits(user.id!);

  const today = new Date();
  const yesterday = subDays(today, 1);
  const fixedHabits: HabitWithCompletions[] = habits.map((habit) => {
    const todayCompletion = habit.completions.find((c) =>
      format(new Date(c.date), "yyyy-MM-dd").includes(
        format(today, "yyyy-MM-dd"),
      ),
    );

    if (!todayCompletion?.completed) {
      // console.log(todayCompletion);
      habit.streak = todayCompletion?.completed ? habit.streak : 0;
    }

    return {
      ...habit,
    };
  });
  // console.log("Habits: ", habits);
  return (
    <main className="min-h-screen py-8">
      <HobbyTracker habits={fixedHabits} today={today.toISOString()} />
    </main>
  );
}
