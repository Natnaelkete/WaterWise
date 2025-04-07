// types/next-auth.d.ts
import "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  /**
   * Extends the built-in session user type
   */
  interface User extends Partial<PrismaUser> {
    id: string;
    role?: string;
  }

  /**
   * The shape of the session object
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT type
   */
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    sub?: string;
  }
}
