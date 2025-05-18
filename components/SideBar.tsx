import { auth, signOut } from "@/lib/auth";
import { DropletIcon, LogOutIcon, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const SideBar = async () => {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  return (
    <div className="w-full flex flex-col justify-between h-screen p-6 gap-6">
      <div>
        <div className="flex items-center justify-between mb-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400  to-blue-600 flex items-center justify-center">
              <DropletIcon className="text-white" />
            </div>
            <span className="text-lg font-semibold text-white">WaterWise</span>
          </Link>
        </div>
        <Link href="/dashboard">
          <div className="text-neutral-400 mb-5  p-2 rounded-sm hover:bg-gray-800/50 hover:text-neutral-200 hover:translate-x-1 transition-all">
            Dashboard
          </div>
        </Link>
        <Link href="/dashboard/map">
          <div className="text-neutral-400 mb-5 p-2 rounded-sm hover:bg-gray-800/50 hover:text-neutral-200 hover:translate-x-1 transition-all">
            Map
          </div>
        </Link>
        {isAdmin && (
          <Link href="/dashboard/users">
            <div className="text-neutral-400 mb-5  p-2 rounded-sm hover:bg-gray-800/50 hover:text-neutral-200 hover:translate-x-1 transition-all">
              Users
            </div>
          </Link>
        )}
        {isAdmin && (
          <Link href="/dashboard/add-user">
            <div className="text-neutral-400 mb-5  p-2 rounded-sm hover:bg-gray-800/50 hover:text-neutral-200 hover:translate-x-1 transition-all">
              Add user
            </div>
          </Link>
        )}
      </div>
      <div className="flex justify-between mb-10">
        <Link href="/dashboard/profile/edit">
          <div className="flex gap-3 cursor-pointer ">
            <User className="text-white/50 hover:text-white" />
            <span className="text-neutral-400 hover:text-white">
              {session?.user?.name || "Admin"}
            </span>
          </div>
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">
            <LogOutIcon className="text-white/50 cursor-pointer hover:text-white/65" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SideBar;
