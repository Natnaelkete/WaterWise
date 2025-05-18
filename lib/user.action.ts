"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { hashSync } from "bcrypt-ts-edge";
import { db } from "./prisma";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Role } from "@prisma/client";

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

export async function addUser(prevState: unknown, formData: FormData) {
  try {
    const user = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword"),
      phone: formData.get("phone"),
      role: formData.get("role"),
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
        phone: user.phone as string,
        role: user.role as Role,
      },
    });

    return { success: true, message: "User added successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log("This is from addUser", error);

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export const getUserById = async (userId: string) => {
  try {
    const user = await db.user.findFirst({
      where: { id: userId },
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

export async function updateUser(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();

    const currentUser = await db.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) {
      return { success: false, message: "User not found" };
    }

    const user = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword"),
      phone: formData.get("phone"),
    };

    if (user.password !== user.confirmPassword) {
      return { success: false, message: "Confirm password correctly" };
    }

    user.password = hashSync(user.password, 10);

    await db.user.update({
      where: { id: session?.user?.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone as string,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
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

export async function deleteUser(id: string) {
  try {
    const user = await db.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }
    await db.user.delete({
      where: { id: id },
    });

    return { success: true, message: "User deleted successfully" };
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
