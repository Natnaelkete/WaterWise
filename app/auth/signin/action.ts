import { User } from "@prisma/client";

interface userDataProps {
  userData: {
    email: string;
    password: string;
  };
}

export const signinUser = async ({ userData }: userDataProps) => {
  try {
    console.log("singFunction data", userData);
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();
    console.log("Signin user data", data);

    if (!response.ok) {
      console.log("API Response:", await response.text());
      throw new Error(data.message || "Something went wrong");
    }
  } catch (error) {
    console.log("singin action error", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to sign up"
    );
  }
};
