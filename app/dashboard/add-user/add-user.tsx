"use client";

import { toast } from "@/hooks/use-toast";
import { addUser } from "@/lib/user.action";
import { ArrowDown } from "lucide-react";
import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

const AddUser = () => {
  
  const [role, setRole] = useState("MODERATOR");
  const [data, action] = useActionState(addUser, {
    success: false,
    message: "",
  });

  const handleSubmit = (formData: FormData) => {
    formData.set("role", role);
    return action(formData);
  };

  if (data.success) {
    toast({
      title: "Success",
      description: data.message,
    });
  }

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Add User"
        )}
      </button>
    );
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="py-8 px-4 shadow-xl border border-neutral-800 rounded-xl sm:px-10">
        <form className="space-y-6" action={handleSubmit}>
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
                className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neutral-300"
            >
              Phone number
            </label>
            <div className="mt-1">
              <input
                id="phone"
                name="phone"
                type="tel"
                className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                placeholder="Enter user phone number"
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
                minLength={6}
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
                className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-neutral-300"
            >
              User role
            </label>
            <div className="mt-1 relative">
              <ArrowDown className="text-white/50 absolute right-2 top-2" />
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
              >
                <option value="MODERATOR">MODERATOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div>
            <SubmitButton />
          </div>

          {data && !data.success && (
            <div className="text-center text-red-500">
              {data.message as string}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddUser;
