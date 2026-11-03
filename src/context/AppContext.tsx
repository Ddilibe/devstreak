import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import type { AppNotification, Task } from "@/lib/types";
import { notifications as seedNotifications, tasks as seedTasks } from "@/lib/data";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info" | "error";
interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface AppContextValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  tasks: Task[];
  addTask: (task: Task) => void;
  verifyTask: (id: string) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toast: (t: Omit<Toast, "id">) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("devstreak-theme") as "dark" | "light") || "dark";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.style.colorScheme = theme;
    localStorage.setItem("devstreak-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4800);
  }, []);

  const addTask = useCallback(
    (task: Task) => {
      setTasks((prev) => [task, ...prev]);
      toast({
        tone: "success",
        title: "Daily commitment created",
        description: `“${task.title}” is now scheduled and ready for verification.`,
      });
    },
    [toast],
  );

  const verifyTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                status: "verified",
                commitmentMet: true,
                evidence: [
                  ...task.evidence,
                  {
                    id: `manual-${Date.now()}`,
                    type: "merge",
                    label: "Commitment verified",
                    detail: "Verification criteria satisfied · recorded just now",
                    platform: "manual",
                    time: new Date().toISOString(),
                    qualified: true,
                  },
                ],
              }
            : task,
        ),
      );
      const task = seedTasks.find((t) => t.id === id);
      toast({
        tone: "success",
        title: "Commitment verified",
        description: task ? `“${task.title}” now counts toward today's streak.` : undefined,
      });
    },
    [toast],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      sidebarCollapsed,
      setSidebarCollapsed,
      commandOpen,
      setCommandOpen,
      tasks,
      addTask,
      verifyTask,
      notifications,
      unreadCount,
      markNotificationRead,
      markAllNotificationsRead,
      toast,
    }),
    [theme, sidebarCollapsed, commandOpen, tasks, addTask, verifyTask, notifications, unreadCount, markNotificationRead, markAllNotificationsRead, toast],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex animate-fade-in-up items-start gap-3 rounded-xl border border-line bg-elevated p-3.5 shadow-lift"
          >
            <span
              className={cn(
                "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                t.tone === "success" && "bg-accent/12 text-accent-bright",
                t.tone === "info" && "bg-blue/12 text-blue",
                t.tone === "error" && "bg-danger/12 text-danger",
              )}
            >
              {t.tone === "success" && <CheckCircle2 className="h-4 w-4" />}
              {t.tone === "info" && <Info className="h-4 w-4" />}
              {t.tone === "error" && <AlertTriangle className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-ink">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{t.description}</p>
              )}
            </div>
            <button
              aria-label="Dismiss notification"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="rounded-md p-1 text-faint transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
