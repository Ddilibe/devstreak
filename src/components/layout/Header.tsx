import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NotificationPanel } from "./NotificationPanel";
import { Avatar } from "@/components/ui/Avatar";
import { Kbd } from "@/components/ui/Badge";
import { Logo } from "@/components/brand/Logo";
import { currentUser } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header({
  onOpenMobileNav,
}: {
  onOpenMobileNav: () => void;
}) {
  const { unreadCount, theme, toggleTheme, setCommandOpen } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-[60] flex h-[60px] shrink-0 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-xl sm:px-6">
        <button
          onClick={onOpenMobileNav}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/dashboard" className="flex items-center lg:hidden" aria-label="DevStreak">
          <Logo compact markClassName="h-7 w-7" />
          <span className="ml-2 text-[15px] font-bold tracking-tight text-ink">DevStreak</span>
        </Link>

        <button
          onClick={() => setCommandOpen(true)}
          className="hidden h-9 w-full max-w-[320px] items-center gap-2.5 rounded-xl border border-line bg-surface px-3 text-left text-[12.5px] text-faint transition-colors hover:border-faint/50 hover:text-muted sm:flex"
          aria-label="Search DevStreak"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1">Search tasks, groups, activity…</span>
          <span className="flex items-center gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <div className="flex-1" />

        <div className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 md:flex">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent-bright" />
          <span className="text-[10.5px] font-medium text-muted">Synced 1m ago</span>
        </div>

        <button
          onClick={() => setCommandOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink sm:hidden"
          aria-label="Search"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>

        <button
          onClick={toggleTheme}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <Sun className="h-[17px] w-[17px]" /> : <Moon className="h-[17px] w-[17px]" />}
        </button>

        <button
          onClick={() => setNotifOpen(true)}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="h-[17px] w-[17px]" />
          {unreadCount > 0 && (
            <>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber ring-2 ring-canvas" />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-ping rounded-full bg-amber/40" />
            </>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full p-0.5 transition-colors hover:bg-ink/5"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
          >
            <Avatar person={currentUser} size="sm" />
            <ChevronDown className={cn("h-3.5 w-3.5 text-faint transition-transform", profileOpen && "rotate-180")} />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-[65]" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+10px)] z-[66] w-60 animate-scale-in overflow-hidden rounded-xl border border-line bg-card shadow-lift">
                <div className="border-b border-line-soft px-3.5 py-3">
                  <p className="text-[12.5px] font-semibold text-ink">{currentUser.name}</p>
                  <p className="truncate font-mono text-[10.5px] text-faint">@{currentUser.handle}</p>
                  <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber/10 px-1.5 py-0.5 text-[10px] font-medium text-amber">
                    🔥 12-day streak
                  </p>
                </div>
                <div className="p-1">
                  {[
                    { label: "Profile & settings", icon: User, to: "/settings" },
                    { label: "Account preferences", icon: Settings, to: "/settings" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setProfileOpen(false);
                        navigate(item.to);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium text-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  ))}
                  <div className="my-1 h-px bg-line-soft" />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/login");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
