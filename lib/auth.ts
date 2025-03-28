import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./prisma";
import CredentialProvider from "next-auth/providers/credentials";
import { compareSync } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";

export const config: AuthOptions = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        const user = await db.user.findFirst({
          where: { email: credentials?.email as string },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials?.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          await db.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
  },
};
export const { handlers, auth, signIn, signOut } = NextAuth(config);
