import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

console.log(process.env.AUTH_GITHUB_ID);
console.log(process.env.AUTH_GITHUB_SECRET);

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
});
