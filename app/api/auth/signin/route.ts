import { signIn } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    await signIn("credentials", {
      email,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sign in successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Signin error", error);
    return NextResponse.json(
      {
        error: "Error creating user",
      },
      { status: 500 }
    );
  }
}
