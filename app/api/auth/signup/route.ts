import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt, { hashSync } from "bcryptjs";
import { signIn } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    const plainPassword = password;

    const hashedPassword = hashSync(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: email,
      password: password,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Signup error", error);
    return NextResponse.json(
      {
        error: "Error creating user",
      },
      { status: 500 }
    );
  }
}
