// app/components/users-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { db } from "@/lib/prisma";

export async function UsersTable() {
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
                    <DropdownMenuItem className="hover:bg-gray-800 focus:bg-gray-800">
                      <Link
                        href={`/dashboard/users/edit/${user.id}`}
                        className="flex items-center w-full"
                      >
                        <Pencil className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Edit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 hover:bg-gray-800 focus:bg-gray-800">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
