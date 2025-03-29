"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signupUser } from "./action";

interface userDataProps {
  userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "nati",
    email: "nati@email.com",
    password: "123456",
    confirmPassword: "123456",
  });
  const [error, setError] = useState("");
  //   const [isLoading, setIsLoading] = useState(false);

  const { mutate: CreateUser, isLoading } = useMutation({
    mutationKey: ["auth"],
    mutationFn: signupUser,
    onSuccess: () => router.push("/auth/signin"),
    onError: (err) => setError("Failed to sign up"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("This is from signUpPage", formData);
    CreateUser({ userData: formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 shadow-xl border border-neutral-800 rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-300"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-400">Already have an account?</span>{" "}
            <Link
              href="/auth/signin"
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
