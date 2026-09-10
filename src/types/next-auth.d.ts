import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      isEditor?: boolean;
    } & DefaultSession["user"];
  }
}
