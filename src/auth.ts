import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLocaleLowerCase();

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      return Boolean(adminEmail && user.email?.toLocaleLowerCase() === adminEmail);
    },
    async session({ session }) {
      session.user.isEditor = Boolean(adminEmail && session.user.email?.toLocaleLowerCase() === adminEmail);
      return session;
    },
  },
  pages: { signIn: "/innlogging" },
});

export async function isEditor() {
  const session = await auth();
  return Boolean(session?.user?.isEditor);
}
