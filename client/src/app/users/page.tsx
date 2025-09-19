"use client";

import { useSidebar } from "@/components/ui/sidebar";
import DemoPage from "@/components/users/page";
import React from "react";

export default function PageTableUsers() {
  //- use context in file sidebar.tsx
  const { state, open, toggleSidebar } = useSidebar();
  console.log(state, open, toggleSidebar);
  return (
    <div className="px-5">
      <DemoPage />
    </div>
  );
}
