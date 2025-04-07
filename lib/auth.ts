import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import { db } from "./prisma";

export const config = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
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
        token.id = user.id;
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update database to reflect the token name
          await db.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    authorized({ request, auth }: any) {
      const protectedPaths = [/\/dashboard\/(.*)/, /\/admin/];

      const { pathname } = request.nextUrl;

      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
