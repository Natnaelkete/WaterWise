import Dashboard from "./dashboard";
import { requireAdmin } from "@/lib/auth-guard";
import SideBar from "@/components/SideBar";
import Link from "next/link";

export default async function DashboardPage() {
  await requireAdmin();

  return (
    <Dashboard/>
  );
}
