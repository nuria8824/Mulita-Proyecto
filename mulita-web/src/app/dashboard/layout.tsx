"use client";

import { ReactNode } from "react";
import SidebarDashboard from "@/components/ui/SidebarDashboard";
import HeaderDashboard from "@/components/ui/HeaderDashboard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar fijo */}
      <SidebarDashboard />

      {/* Contenedor de header + contenido */}
      <div className="flex-1 flex flex-col ml-60">
        {/* Header */}
        <HeaderDashboard />

        {/* Contenido principal */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
