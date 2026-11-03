import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, MobileDrawer } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <MobileDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300 ease-out",
          sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[260px]",
        )}
      >
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-7 lg:pb-10">
          <div className="mx-auto w-full max-w-[1280px]">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav onOpenMenu={() => setMobileNavOpen(true)} />
      <CommandPalette />
    </div>
  );
}
