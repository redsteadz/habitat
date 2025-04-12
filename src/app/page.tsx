import { auth } from "@/server/auth/config"; // Adjust if path is different
import SignInGit from "@/components/buttons/signInGit";
import SignOutGit from "@/components/buttons/signOutGit";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      {session ? (
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold">Welcome, {session.user?.name}!</h1>
          <p className="text-gray-500">{session.user?.email}</p>
          <SignOutGit />
        </div>
      ) : (
        <SignInGit />
      )}
    </div>
  );
}
