"use client";

import { useUserColumns } from "./columns";
import { DataTable } from "./data-table";
import { useUserListQuery } from "@/queries/useUser";

export default function DemoPage() {
  const listUser = useUserListQuery();
  const data = listUser.data?.data.users || [];
  const columns = useUserColumns();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
