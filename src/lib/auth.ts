"use server";
import { signIn, signOut } from "@/server/auth/config";

export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
