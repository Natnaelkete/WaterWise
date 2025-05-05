// app/admin/users/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UsersTable } from "./users-table";

export default async function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/dashboard/add-user">Add User</Link>
        </Button>
      </div>
      <UsersTable />
    </div>
  );
}
