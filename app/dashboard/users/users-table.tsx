"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deleteUser } from "@/lib/user.action";
import { Role } from "@prisma/client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type UserType = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
};

export function UsersTable({ users }: { users: UserType[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    startTransition(async () => {
      try {
        await deleteUser(id);
        router.refresh();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    });
  };

  if (isPending) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-gray-900">
          <TableRow className="hover:bg-gray-900">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Email</TableHead>
            <TableHead className="text-gray-300">Phone</TableHead>
            <TableHead className="text-gray-300">Role</TableHead>
            <TableHead className="text-right text-gray-300"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="border-gray-800 hover:bg-gray-800/50"
            >
              <TableCell className="font-medium text-gray-200">
                {user.name}
              </TableCell>
              <TableCell className="text-gray-400">{user.email}</TableCell>
              <TableCell className="text-gray-400">
                {user.phone || "N/A"}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-purple-900/50 text-purple-300 border border-purple-800"
                      : "bg-blue-900/50 text-blue-300 border border-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-800"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-900 border-gray-800"
                  >
                    <DropdownMenuItem
                      className="hover:bg-gray-800 focus:bg-gray-800"
                      onClick={() => handleDelete(user.id)}
                    >
                      <div className="flex items-center w-full">
                        <Trash className="mr-2 h-3 w-3 text-red-500" />
                        <span className="text-gray-300">Delete</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <div className="text-center py-12 text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800">
          No users found.
        </div>
      )}
    </div>
  );
}
