export const runtime = "nodejs";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!profile?.id) {
        return false;
      }
      if (!profile?.email) {
        return false;
      }
      if (!profile?.name) {
        return false;
      }
      try {
        const url = process.env.NEXTAUTH_URL!;
        const resp = await fetch(`${url}/api/user/signUp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            email: profile.email,
            githubId: profile.id,
          }),
        });
        if (resp.status !== 200) {
          return false;
        }
        const data = await resp.json();
        profile.id = data.id;
      } catch (error) {
        console.log("Error in signIn callback: ", error);
      }
      return true;
    },
  },
});

export const { GET, POST } = handlers;
