"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { hashSync } from "bcrypt-ts-edge";
import { db } from "./prisma";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    await signIn("credentials", user);

    revalidatePath("/dashboard");

    return { success: true, message: "Sign in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Invalid Email or Password",
    };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUserWithGoogle() {
  await signIn("google");
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword"),
    };

    if (user.password !== user.confirmPassword) {
      return { success: false, message: "Confirm password correctly" };
    }

    const existingUser = await db.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return { success: false, message: "This email is already registered" };
    }

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await db.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export const getUserById = async (userId: string) => {
  const user = await db.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
};
