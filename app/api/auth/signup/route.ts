import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashSync } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = hashSync(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role ?? "USER",
      },
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
