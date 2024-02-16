import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const githubClientId = process.env.GITHUB_ID;
const githubClientSecret = process.env.GITHUB_SECRET;

if (!githubClientId || !githubClientSecret) {
  throw new Error(
    "GitHub client ID or client secret not found in environment variables."
  );
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "plant" },
        password: { label: "Password", type: "password", placeholder: "buddy" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === "plant" &&
          credentials?.password === "buddy"
        ) {
          return {
            name: "Buddy",
            id: "Buddy",
          };
        } else {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
