"use client";
import SignOutGit from "@/components/buttons/signOutGit";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: session, status } = useSession();

  return (
    <div>
      {status === "loading" ? (
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      ) : session ? (
        <div>
          Welcome {session.user?.name}
          <SignOutGit />
        </div>
      ) : (
        <div>No active session</div>
      )}
    </div>
  );
}
