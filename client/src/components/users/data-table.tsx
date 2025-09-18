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
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import FireworksEffect from "../Fireworks";

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
  const deleteUserTranslation = useTranslations("deleteUser");
  const notifyTranslation = useTranslations("notify");
  const deleteUser = async () => {
    if (userDelete) {
      try {
        const result = await mutateAsync(userDelete.id);
        setUserDelete(undefined);
        toast(notifyTranslation("title"), {
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
          <AlertDialogTitle>{deleteUserTranslation("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {deleteUserTranslation("leftDes")}{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {userDelete?.name}
            </span>{" "}
            {deleteUserTranslation("rightDes")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {deleteUserTranslation("buttonCancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={deleteUser}>
            {deleteUserTranslation("buttonContinue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  //- define state
  const [userIdEdit, setUserIdEdit] = useState<string | undefined>();
  const [userDelete, setUserDelete] = useState<User | undefined>();

  //- phao hoa
  const [fireworks, setFireWorks] = useState(false);

  const detaleManyUser = useDeleteManyUserMutation();

  const headerTranslation = useTranslations("header");
  const columnShowTranslation = useTranslations("valueColumnShow");
  const notifyTranslation = useTranslations("notify");
  const deleteManyTranslation = useTranslations("deleteMany");

  //- cái này phải được ánh xạ đúng với các gía trị sẽ xuất hiện trên columns table nó phải khớp với accessorKey trong columns
  type ValueColumnKeys = "id" | "name" | "age" | "email" | "action";

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
      toast(notifyTranslation("title"), {
        description: "Xóa người dùng thành công!",
      });
    } catch (error) {
      console.log("error delete many user: ", error);
    } finally {
      table.resetRowSelection();
    }
  };

  //- listen socket
  useEffect(() => {
    // Kết nối
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    // Lắng nghe sự kiện userCreated
    socket.on("create_user", (newUser) => {
      if(newUser) setFireWorks(true);
      console.log("User created:", newUser);
    });

    // Cleanup khi component unmount
    return () => {
      socket.off("create_user");
      socket.off("connect");
    };
  }, []);

  return (
    <UserTableContext.Provider
      value={{ userIdEdit, setUserIdEdit, userDelete, setUserDelete }}
    >
      {fireworks && (
        <FireworksEffect fireworks={fireworks} setFireworks={setFireWorks} />
      )}
      <div className="flex items-center py-4">
        <Input
          placeholder={headerTranslation("input")}
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
              {deleteManyTranslation("deleteAll")}
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
              {headerTranslation("selectColumns")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                //- column.id là string, TypeScript không thể chắc chắn nó thuộc tập "id" | "name" | "age" | "email" | "action" nên cần làm thế này
                const key: ValueColumnKeys =
                  column.id === "actions"
                    ? "action"
                    : (column.id as ValueColumnKeys);
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {/* vấn đề là sau này nếu có thêm cột mới mà quên ko viết vào  ValueColumnKeys thì sẽ lại báo đỏ. Không thì để KDL tham số trong columnShowTranslation là any là gọn nhất (nhưng vẫn phải nhớ viết vào message >.<) thì đỡ phải dùng cách viết ValueColumnKeys*/}
                    {columnShowTranslation(key)}
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
