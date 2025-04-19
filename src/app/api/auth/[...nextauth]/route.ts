export const runtime = "nodejs";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log("user: ", user);
      // console.log("account: ", account);
      // console.log("profile: ", profile);
      if (!profile?.id) {
        console.log("No profile id");
        return false;
      }
      if (!profile?.email) {
        console.log("No profile email");
        return false;
      }
      if (!profile?.login) {
        console.log("No profile name");
        return false;
      }
      try {
        const url = process.env.NEXTAUTH_URL!;
        const resp = await fetch(`${url}/api/user/signUp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.login,
            email: profile.email,
            githubId: profile.id,
          }),
        });
        if (resp.status !== 200) {
          console.log("Error in signIn callback: ", resp.status);
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
