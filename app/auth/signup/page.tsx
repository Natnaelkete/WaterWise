import { auth } from "@/lib/auth";
import SignUpForm from "./sign-up-form";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth();

  if (session?.user.role === "ADMIN") {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <h2 className="text-center text-sm text-neutral-400">
          Sign up to get started
        </h2>
      </div>

      <SignUpForm />
    </div>
  );
}
