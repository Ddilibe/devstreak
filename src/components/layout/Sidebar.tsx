import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Flame,
  LayoutDashboard,
  ListChecks,
  Plug,
  Plus,
  Settings,
  Sparkles,
  Users,
  Copy,
  Check,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Overlay";
import { Input } from "@/components/ui/Input";
import { useApp } from "@/context/AppContext";
import { currentUser } from "@/lib/data";
import { cn } from "@/lib/utils";

const workspaceNav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/tasks", label: "My Tasks", icon: ListChecks, badge: "1" },
  { to: "/streaks", label: "My Streaks", icon: Flame },
  { to: "/accountability", label: "Accountability", icon: Users, badge: "2" },
];

const insightNav = [
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

function InviteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useApp();
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const link = "devstreak.app/join/alex-9f3k";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite an accountability partner"
      description="Partners see your daily completion status — not your private tasks. You can have as many partners as you want."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!email.trim()}
            onClick={() => {
              toast({
                tone: "success",
                title: "Invitation sent",
                description: `We sent an invite to ${email}. It expires in 7 days.`,
              });
              setEmail("");
              onClose();
            }}
          >
            Send invitation
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-medium text-ink" htmlFor="invite-email">
            Email address
          </label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="partner@example.com"
            autoFocus
          />
        </div>
        <div className="rounded-xl border border-line bg-canvas p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wide text-faint">
              Or share an invite link
            </span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`https://${link}`).catch(() => {});
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1800);
              }}
              className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent-bright hover:underline"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          <code className="block truncate rounded-lg border border-line bg-surface px-2.5 py-2 font-mono text-[11.5px] text-muted">
            {link}
          </code>
        </div>
        <p className="text-[11.5px] leading-relaxed text-faint">
          Invitations are private. Groups you share will see completion status and streak health only.
        </p>
      </div>
    </Modal>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  badge,
  collapsed,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-colors duration-150",
          collapsed && "justify-center px-0",
          isActive
            ? "bg-accent/[0.09] text-ink"
            : "text-muted hover:bg-ink/[0.04] hover:text-ink",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-r-full bg-accent-bright transition-opacity",
              isActive ? "opacity-100" : "opacity-0",
            )}
          />
          <Icon
            className={cn(
              "h-[17px] w-[17px] shrink-0 transition-colors",
              isActive ? "text-accent-bright" : "text-faint group-hover:text-muted",
            )}
            strokeWidth={1.9}
          />
          {!collapsed && <span className="flex-1 truncate">{label}</span>}
          {!collapsed && badge && (
            <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink/[0.06] px-1 font-mono text-[10px] font-medium text-muted">
              {badge}
            </span>
          )}
          {collapsed && badge && (
            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-amber" />
          )}
        </>
      )}
    </NavLink>
  );
}

export function SidebarContent({
  collapsed,
  onNavigate,
  onCloseMobile,
  onCollapse,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onCloseMobile?: () => void;
  onCollapse?: () => void;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-[60px] shrink-0 items-center border-b border-line-soft px-4",
          collapsed ? "justify-center px-0" : "justify-between",
        )}
      >
        <Link to="/dashboard" onClick={onNavigate} aria-label="DevStreak home">
          <Logo compact={collapsed} />
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-ink/5 hover:text-ink lg:hidden"
            aria-label="Close navigation"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className={cn("px-3 pt-4", collapsed && "px-2")}>
        <Button
          variant="primary"
          size={collapsed ? "icon" : "md"}
          onClick={() => setInviteOpen(true)}
          title="Invite a partner"
          className={cn("w-full", collapsed && "w-10")}
        >
          <Plus className="h-4 w-4" strokeWidth={2.4} />
          {!collapsed && <span>Invite partner</span>}
        </Button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 no-scrollbar" aria-label="Main navigation">
        <div>
          {!collapsed && (
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-faint">
              Workspace
            </p>
          )}
          <div className="space-y-0.5">
            {workspaceNav.map((item) => (
              <NavItem
                key={item.to}
                {...item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
        <div>
          {!collapsed && (
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-faint">
              Insights
            </p>
          )}
          <div className="space-y-0.5">
            {insightNav.map((item) => (
              <NavItem
                key={item.to}
                {...item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className={cn("px-3 pb-3", collapsed && "px-2")}>
        {!collapsed ? (
          <div className="mb-3 rounded-xl border border-line bg-gradient-to-br from-amber/[0.08] via-transparent to-transparent p-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted">
                <Flame className="h-3.5 w-3.5 text-amber" />
                Personal streak
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-accent-bright">
                <Sparkles className="h-3 w-3" /> Best 34
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="number text-xl font-semibold text-ink">12</span>
              <span className="text-[11px] text-faint">days · 3 commitments left today</span>
            </div>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    i < 5 ? "bg-amber/80" : i === 5 ? "bg-amber/30" : "bg-ink/10",
                  )}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-3 grid place-items-center rounded-xl border border-line py-2" title="12-day streak">
            <Flame className="h-4 w-4 text-amber" />
            <span className="mt-0.5 number text-[10px] font-semibold text-ink">12</span>
          </div>
        )}

        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-colors",
              collapsed && "justify-center px-0",
              isActive ? "bg-accent/[0.09] text-ink" : "text-muted hover:bg-ink/[0.04] hover:text-ink",
            )
          }
        >
          <Settings className="h-[17px] w-[17px] text-faint group-hover:text-muted" strokeWidth={1.9} />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <div className="my-3 h-px bg-line-soft" />

        <Link
          to="/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-ink/[0.04]",
            collapsed && "justify-center",
          )}
        >
          <Avatar person={currentUser} size={collapsed ? "sm" : "md"} status="online" />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-ink">{currentUser.name}</p>
                <p className="truncate font-mono text-[10.5px] text-faint">@{currentUser.handle}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-faint" />
            </>
          )}
        </Link>
      </div>

      {onCollapse && (
        <button
          onClick={onCollapse}
          className="hidden h-9 shrink-0 items-center justify-center gap-1.5 border-t border-line-soft text-[11px] font-medium text-faint transition-colors hover:bg-ink/[0.03] hover:text-ink lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <>
              <ChevronLeft className="h-3.5 w-3.5" /> Collapse
            </>
          )}
        </button>
      )}

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden shrink-0 border-r border-line bg-surface transition-[width] duration-300 ease-out lg:flex",
        sidebarCollapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      <div className="w-full">
        <SidebarContent
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
    </aside>
  );
}

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 left-0 w-[280px] animate-fade-in border-r border-line bg-surface shadow-lift">
        <div className="mb-2 flex items-center justify-between border-b border-line-soft px-4 py-3">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="text-[15px] font-bold tracking-tight text-ink">DevStreak</span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-ink/5 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-53px)]">
          <SidebarContent collapsed={false} onNavigate={onClose} onCloseMobile={onClose} />
        </div>
      </div>
    </div>
  );
}
