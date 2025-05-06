import Link from "next/link";
import { UsersTable } from "./users-table";
import { db } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { Button } from "@/components/ui/button";

export default async function UsersPage() {
  await requireAdmin();
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button>
          <Link href="/dashboard/add-user">Add User</Link>
        </Button>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
