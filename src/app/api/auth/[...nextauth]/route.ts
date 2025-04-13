export const runtime = "nodejs";
import NextAuth from "next-auth";
import axios from "axios";
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
        const resp = await axios.post("http:localhost:3000/api/user/signUp", {
          name: profile.name,
          email: profile.email,
          githubId: profile.id,
        });
        if (resp.status !== 200) {
          return false;
        }
      } catch (error) {
        console.log("Error in signIn callback: ", error);
      }
      return true;
    },
  },
});

export const { GET, POST } = handlers;
