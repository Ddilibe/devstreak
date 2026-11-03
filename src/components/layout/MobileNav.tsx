import { Link, useLocation } from "react-router-dom";
import { Flame, LayoutDashboard, ListChecks, Menu, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { currentUser } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/streaks", label: "Streaks", icon: Flame },
  { to: "/accountability", label: "Groups", icon: Users },
];

export function MobileNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { pathname } = useLocation();
  const { unreadCount } = useApp();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-stretch">
        {items.map((item) => {
          const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                active ? "text-accent-bright" : "text-faint",
              )}
            >
              <span className="relative">
                <item.icon className="h-[19px] w-[19px]" strokeWidth={active ? 2.2 : 1.9} />
                {item.to === "/accountability" && unreadCount > 0 && (
                  <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-amber" />
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={onOpenMenu}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium text-faint"
        >
          <Avatar person={currentUser} size="xs" className="h-[19px] w-[19px] text-[8px]" />
          More
        </button>
      </div>
      <button
        onClick={onOpenMenu}
        className="absolute -top-14 right-4 grid h-11 w-11 place-items-center rounded-full border border-line bg-elevated text-muted shadow-lift"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </nav>
  );
}
