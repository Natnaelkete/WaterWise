import Dashboard from "./dashboard";
import { signOut } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-guard";

export default async function DashboardPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-6">
              <span className="text-neutral-400">{"Admin"}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-900 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all hover:border-neutral-700">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <Dashboard />
    </div>
  );
}
