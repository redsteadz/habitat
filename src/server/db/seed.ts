import "dotenv/config";
import { usersTable } from "./schema";
import { eq } from "drizzle-orm";
import { db } from "./index";

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    email: "john@example.com",
    githubId: "1",
  };
  await db.insert(usersTable).values(user);
  console.log("New user created!");
  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
  await db
    .update(usersTable)
    .set({
      email: "halooo",
    })
    .where(eq(usersTable.email, user.email));
  console.log("User info updated!");
  // await db.delete(usersTable).where(eq(usersTable.email, user.email));
  // console.log("User deleted!");
}

main();
