import { auth } from "@/lib/auth";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await auth();

  return <Dashboard session={session as any} />;
}
