import Dashboard from "./dashboard";
import { auth, signOut } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-guard";

export default async function DashboardPage() {
  await requireAdmin();
  const session = await auth();

  return (
    <div className="min-h-screen bg-black text-white">
      <Dashboard />
    </div>
  );
}
