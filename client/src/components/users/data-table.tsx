"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./DataTablePagination";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import AddUser from "./addUser";
import { createContext } from "react";
import EditUser from "./editUser";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { User } from "@/schema/user.schema";
import {
  useDeleteManyUserMutation,
  useDeleteUserMutation,
} from "@/queries/useUser";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const UserTableContext = createContext<{
  //- define type value
  userIdEdit: string | undefined;
  setUserIdEdit: (value: string | undefined) => void;
  userDelete: User | undefined;
  setUserDelete: (value: User | undefined) => void;
}>({
  //- define default value
  setUserIdEdit: (value: string | undefined) => {},
  userIdEdit: undefined,
  userDelete: undefined,
  setUserDelete: (value: User | undefined) => {},
});

function AlertDialogDeleteAccount({
  userDelete,
  setUserDelete,
}: {
  userDelete: User | undefined;
  setUserDelete: (value: User | undefined) => void;
}) {
  const { mutateAsync } = useDeleteUserMutation();
  const deleteUser = async () => {
    if (userDelete) {
      try {
        const result = await mutateAsync(userDelete.id);
        setUserDelete(undefined);
        toast("Thông báo", {
          description: result.message,
        });
      } catch (error) {
        console.log("error delete account: ", error);
      }
    }
  };
  return (
    <AlertDialog
      open={Boolean(userDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setUserDelete(undefined);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {userDelete?.name}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteUser}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  //- define state
  const [userIdEdit, setUserIdEdit] = React.useState<string | undefined>();
  const [userDelete, setUserDelete] = React.useState<User | undefined>();

  const detaleManyUser = useDeleteManyUserMutation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleleManyUser = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original as User);
    const ids = selectedData.map((item) => Number(item.id));

    try {
      if (ids) {
        detaleManyUser.mutateAsync(ids);
      }
      toast("Thông báo", {
        description: "Xóa người dùng thành công!",
      });
    } catch (error) {
      console.log("error delete many user: ", error);
    } finally {
      table.resetRowSelection();
    }
  };

  return (
    <UserTableContext.Provider
      value={{ userIdEdit, setUserIdEdit, userDelete, setUserDelete }}
    >
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {Object.keys(rowSelection).length > 0 && (
          <div className="ml-10">
            {/* nút xóa tất cả */}
            <Button
              onClick={handleDeleleManyUser}
              disabled={table.getSelectedRowModel().rows.length === 0}
              variant="outline"
              className="ml-auto text-red-500 hover:text-red-500"
            >
              Xóa tất cả
            </Button>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <AddUser />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <EditUser
            id={userIdEdit}
            setId={setUserIdEdit}
            onSubmitSuccess={() => {}}
          />
        </div>

        <AlertDialogDeleteAccount
          userDelete={userDelete}
          setUserDelete={setUserDelete}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Select columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagi */}
      <DataTablePagination table={table} />
    </UserTableContext.Provider>
  );
}
