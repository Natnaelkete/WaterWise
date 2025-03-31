// import { db } from "@/lib/prisma";
// import { compareSync } from "bcrypt-ts-edge";
// import { signIn } from "next-auth/react";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Missing required field" },
//         { status: 400 }
//       );
//     }

//     const existingUser = await db.user.findUnique({
//       where: { email },
//     });

//     if (!existingUser) {
//       return NextResponse.json(
//         { error: "There is no user with this email" },
//         { status: 400 }
//       );
//     }

//     console.log("Existiting user", existingUser);

//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Sign in successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Signin error", error);
//     return NextResponse.json(
//       {
//         error: "Error logging user",
//       },
//       { status: 500 }
//     );
//   }
// }
