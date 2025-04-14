import Dashboard from "./dashboard";
import { requireAdmin } from "@/lib/auth-guard";

export default async function DashboardPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-black text-white">
      <Dashboard />
    </div>
  );
}
