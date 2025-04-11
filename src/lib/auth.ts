import { signIn, signOut } from "@/auth";

export const login = async (provider: string) => {
  try {
    await signIn(provider, { redirect: true, callbackUrl: "/" });
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const logout = async () => {
  try {
    await signOut({ redirect: true, callbackUrl: "/" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
