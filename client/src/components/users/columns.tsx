"use client";

import { User } from "@/schema/user.schema";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useContext } from "react";
import { UserTableContext } from "./data-table";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

function ActionsCell({ row }: { row: Row<User> }) {
  const user = row.original as User;
  const { setUserIdEdit, setUserDelete } = useContext(UserTableContext);
  const actionTableTranslation = useTranslations("actionTable");
  const notifyTranslation = useTranslations("notify");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {actionTableTranslation("action")}
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            toast.success(notifyTranslation("title"), {
              description: notifyTranslation("copyName"),
              position: "top-center",
            });
            navigator.clipboard.writeText(user.name);
          }}
        >
          {actionTableTranslation("copyUserName")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setUserIdEdit(user.id)}>
          {actionTableTranslation("editUser")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:!bg-red-500 text-red-500"
          onClick={() => setUserDelete(user)}
        >
          {actionTableTranslation("deleteUser")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

//- thay vì export const columns thì tạo 1 component để bọc và dùng được hàm useTranslations()
export function useUserColumns(): ColumnDef<User>[] {
  const headerTranslation = useTranslations("valueColumnShow");

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: headerTranslation("id"),
    },
    {
      accessorKey: "name",
      header: headerTranslation("name"),
    },
    {
      accessorKey: "age",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!p-0"
        >
          {headerTranslation("age")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="!p-0"
        >
          {headerTranslation("email")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "actions",
      header: headerTranslation("action"),
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
}
