import SideBar from "@/components/SideBar";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-guard";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "MODERATOR") {
    redirect("/auth/signin");
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="relative min-h-screen bg-black selection:bg-sky-50">
      <div className="fixed inset-0 -z-10 min-h-screen">
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_100%)]" />
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_100%)]" />
      </div>

      <div className="fixed left-0 top-0 w-64 h-full border-r border-neutral-800 bg-black/50">
        <SideBar />
      </div>

      <div className="ml-64 min-h-screen">
        <nav className="fixed top-0 right-0 left-64 border-b border-neutral-800 pt-2 bg-black/50 backdrop-blur-xl z-[999]">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <div className="flex justify-between items-center">
              <Link href="/dashboard">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {isAdmin ? "Admin Dashboard" : "Moderator Dashboard"}
                </h1>
              </Link>
            </div>
          </div>
        </nav>

        <div className="pt-20 px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
