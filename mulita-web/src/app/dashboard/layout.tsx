"use client";

import { ReactNode, useState } from "react";
import SidebarDashboard from "@/components/ui/dashboard/SidebarDashboard";
import HeaderDashboard from "@/components/ui/dashboard/HeaderDashboard";
import BackButton from "@/components/ui/dashboard/BackButton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f9fafb]">
      <SidebarDashboard isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex flex-col flex-1 ml-0 md:ml-60 transition-all duration-300">
        <HeaderDashboard onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <BackButton />
          {children}
        </main>
      </div>
    </div>
  );
}