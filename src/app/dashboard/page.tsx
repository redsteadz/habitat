import HobbyTracker from "@/components/hobby-tracker";
import { db } from "@/server/db";
import { completionsTable, habitsTable } from "@/server/db/schema";
import { asc, eq } from "drizzle-orm";
import { usersTable } from "@/server/db/schema";
import { auth } from "../api/auth/[...nextauth]/route";

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
  const habits = await db.query.habitsTable.findMany({
    where: eq(habitsTable.userId, userId[0]?.id),
    with: {
      completions: {
        orderBy: (completions, { asc }) => [asc(completions.date)],
      },
    },
  });

  console.log("Habits: ", habits);
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <HobbyTracker habits={habits} />
    </main>
  );
}
