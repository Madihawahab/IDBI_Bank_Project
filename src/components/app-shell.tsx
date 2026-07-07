import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Sparkles,
  Bot,
  Wallet,
  Shield,
  Smile,
  Gift,
  Settings,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { api, authApi } from "@/lib/api";
import { toast } from "sonner";
import { Notification } from "../types/api";
import { useTranslation } from "@/lib/translations";

const NAV_KEYS: Record<string, string> = {
  "Home": "menu.home",
  "Life Events": "menu.life_events",
  "AI Advisor": "menu.ai_advisor",
  "Finances": "menu.finances",
  "Trust Ledger": "menu.trust_ledger",
  "Money Mood": "menu.money_mood",
  "Offers": "menu.offers",
  "Settings": "menu.settings"
};

const MOBILE_NAV_KEYS: Record<string, string> = {
  "Home": "menu.home",
  "Events": "menu.events_mobile",
  "AI": "menu.ai_mobile",
  "Money": "menu.money_mobile",
  "Mood": "menu.mood_mobile"
};

const NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/life-events", label: "Life Events", icon: Sparkles },
  { to: "/ai-advisor", label: "AI Advisor", icon: Bot },
  { to: "/finances", label: "Finances", icon: Wallet },
  { to: "/trust-ledger", label: "Trust Ledger", icon: Shield },
  { to: "/money-mood", label: "Money Mood", icon: Smile },
  { to: "/offers", label: "Offers", icon: Gift },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const MOBILE_NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/life-events", label: "Events", icon: Sparkles },
  { to: "/ai-advisor", label: "AI", icon: Bot },
  { to: "/finances", label: "Money", icon: Wallet },
  { to: "/money-mood", label: "Mood", icon: Smile },
] as const;

function SbiLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,131,108,0.12)]">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24 11.9986C24 18.6274 18.6291 24.0002 11.999 24.0002C5.37283 24.0002 0 18.6274 0 11.9986C0 5.37502 5.37283 -0.000387192 11.999 -0.000387192C18.6291 -0.000387192 24 5.37502 24 11.9986Z"
            fill="white"
          />
          <path
            d="M11.9118 20.9804C13.0407 20.9824 14.1753 20.6762 15.1285 20.0658C15.7055 19.7312 16.2202 19.283 16.642 18.7668C16.9223 18.466 17.1242 18.1103 17.3402 17.763C17.6985 17.0675 17.9638 16.3169 18.0365 15.5336C18.1408 14.6599 18.057 13.7647 17.8044 12.9233C17.6193 12.2838 17.3258 11.6782 16.9558 11.1253C16.4466 10.3738 15.7892 9.70942 15.0033 9.25277C14.8263 9.14221 14.6744 9.03086 14.4955 8.92184C14.2322 8.73969 13.8065 8.51125 13.4941 8.75465C13.1765 9.06717 13.1914 9.55942 13.1639 9.97918C13.1619 12.9503 13.1481 15.921 13.1542 18.8923C13.1357 19.1417 13.213 19.4441 12.9572 19.5901C12.6925 19.7507 12.3955 19.8554 12.0862 19.904C11.8326 19.9767 11.5932 19.8667 11.3458 19.82C11.1346 19.7468 10.9043 19.6552 10.7501 19.508C10.5263 19.3107 10.6608 18.9626 10.6242 18.6861C10.6203 15.6471 10.6319 12.6074 10.6183 9.56883C10.574 9.24259 10.5382 8.84352 10.2334 8.64869C10.0924 8.57688 9.93538 8.58665 9.79088 8.64739C9.44521 8.74852 9.1515 9.04093 8.85855 9.2146C8.34889 9.51449 7.87897 9.88591 7.48287 10.3294C7.13288 10.6828 6.85536 11.0979 6.59924 11.5244C6.23356 12.1899 5.9549 12.9059 5.82862 13.6567C5.70065 14.3503 5.68773 15.063 5.79676 15.7613C5.96123 16.8243 6.42086 17.8383 7.08888 18.6786C7.74985 19.5204 8.65847 20.1381 9.63776 20.5566C10.3635 20.8247 11.1345 20.9902 11.9118 20.9804Z"
            fill="#F58220"
          />
          <path
            d="M11.935 7.06129C12.0184 7.05806 12.1045 7.0704 12.1847 7.04966C12.2356 7.04643 12.2811 7.00849 12.3349 7.01799C12.3694 6.99021 12.4082 6.96144 12.4524 6.95983C12.4929 6.93482 12.5561 6.94386 12.5766 6.8894C12.6211 6.87383 12.6574 6.84834 12.6978 6.82579C12.7364 6.80699 12.7649 6.76645 12.8015 6.74133C12.8582 6.71716 12.8765 6.65267 12.9309 6.62515C12.9587 6.59059 12.9832 6.55368 13.0185 6.52436C13.0533 6.47306 13.089 6.42359 13.1096 6.36414C13.1452 6.33668 13.1513 6.28793 13.1755 6.25081C13.1942 6.20946 13.2189 6.17302 13.228 6.12892C13.2464 6.09061 13.2636 6.05143 13.2582 6.0075C13.2784 5.95433 13.264 5.89272 13.3015 5.84468C13.2989 5.72193 13.3067 5.59639 13.2976 5.47539C13.2577 5.42467 13.2775 5.35821 13.2583 5.30054C13.2525 5.25854 13.244 5.21358 13.2183 5.17932C13.1876 5.06035 13.1095 4.96238 13.0545 4.85509C13.0274 4.81911 13.0133 4.78164 12.9738 4.7573C12.9362 4.70458 12.8798 4.66914 12.8499 4.61065C12.7957 4.60742 12.7685 4.55166 12.7267 4.52496C12.6976 4.49427 12.6518 4.48116 12.6196 4.45603C12.5808 4.4402 12.5615 4.39936 12.5129 4.40098C12.4443 4.37197 12.3779 4.32902 12.3021 4.31537C12.2605 4.29547 12.2259 4.26756 12.1763 4.27984C12.1221 4.27854 12.0691 4.26678 12.0145 4.26678C11.921 4.25561 11.8261 4.26807 11.7332 4.27195C11.6765 4.29301 11.6083 4.25983 11.559 4.30531C11.4993 4.33438 11.4321 4.33747 11.3749 4.37128C11.3379 4.39984 11.2861 4.39754 11.2574 4.43591C11.2073 4.44515 11.1728 4.48695 11.1251 4.5037C11.0853 4.53652 11.0426 4.57441 11.0066 4.60718C10.9555 4.60071 10.947 4.66597 10.9111 4.69239C10.873 4.71946 10.8642 4.76488 10.8284 4.79188C10.7608 4.86784 10.7024 4.95508 10.6631 5.04958C10.6567 5.09474 10.6162 5.12057 10.6144 5.16753C10.5936 5.21146 10.5743 5.24879 10.565 5.29494C10.5538 5.34223 10.5676 5.39698 10.5331 5.43927C10.5382 5.55108 10.511 5.66316 10.5331 5.77406C10.5311 5.83337 10.5285 5.89295 10.5589 5.94642C10.5521 6.01992 10.5838 6.08596 10.6145 6.14986C10.6099 6.20142 10.6551 6.21984 10.662 6.26489C10.6784 6.30339 10.689 6.34473 10.7158 6.3785C10.7391 6.45592 10.8057 6.50362 10.8534 6.56431C10.8845 6.59209 10.8933 6.64094 10.9356 6.66037C10.9654 6.693 10.9881 6.73173 11.0332 6.7476C11.0591 6.7894 11.1144 6.799 11.1444 6.83944C11.1919 6.88266 11.2658 6.87543 11.3036 6.93183C11.337 6.95535 11.3887 6.95058 11.4195 6.97138C11.4533 6.98954 11.4976 7.00065 11.5335 7.01764C11.5852 7.02151 11.6268 7.05809 11.6792 7.0493C11.76 7.07437 11.8508 7.05483 11.935 7.06129Z"
            fill="#F58220"
          />
          <path
            d="M14.951 4.56996C15.1056 4.2297 15.5148 3.96972 15.8626 4.22944C16.551 4.66832 17.0729 5.3338 17.6692 5.89075C18.4468 6.64569 19.1546 7.48997 19.6404 8.46553C20.1458 9.4644 20.4434 10.5639 20.4801 11.6846C20.598 12.8163 20.4078 13.9768 20.0705 15.0584C19.3768 17.0928 17.9439 18.8954 16.0441 19.9247C13.4161 21.4092 10.0118 21.3104 7.44763 19.7369C5.00687 18.2802 3.42343 15.5333 3.29889 12.7028C3.23341 11.4022 3.43911 10.0866 3.96177 8.88834C4.46647 7.6904 5.3076 6.66352 6.24628 5.77323C6.77818 5.23831 7.26982 4.64823 7.90092 4.23461C8.16887 4.02883 8.59963 4.06738 8.74279 4.39227C9.05962 4.89412 9.27827 5.51674 9.26027 6.12699C9.18185 7.13206 8.30168 7.74832 7.59921 8.34565C6.76662 9.03143 6.18567 9.96527 5.70426 10.9222C5.2692 11.8553 5.04047 12.8773 5.07368 13.9235C5.07949 16.1648 6.1848 18.3869 7.99847 19.7141C9.18783 20.5469 10.6282 21.0281 12.0888 20.9804C14.0856 20.955 15.998 19.9192 17.2006 18.3444C18.2762 16.9567 18.8241 15.1698 18.7099 13.4152C18.6621 12.345 18.3283 11.3069 17.8312 10.3782C17.3686 9.54303 16.7405 8.7903 16.0009 8.1902C15.4489 7.67659 14.7741 7.1925 14.5963 6.42223C14.4628 5.78812 14.6802 5.13978 14.951 4.56996Z"
            fill="#F58220"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-[var(--sbi-navy)]">IDBI BANK</div>
        <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Life Moments
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const queryClient = useQueryClient();

  const { t } = useTranslation();
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  // Query User Profile dynamically
  const { data: userProfile } = useQuery({
    queryKey: ["userMe"],
    queryFn: async () => {
      try {
        return await authApi.getMe();
      } catch (e) {
        return null;
      }
    },
  });

  const userName = userProfile?.name || "Aarav Sharma";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("");
  const userRole =
    userProfile?.role === "Customer" ? "Premium Customer" : userProfile?.role || "Premium Customer";
  const translatedRole = userRole === "Premium Customer" ? t("menu.premium_customer") : userRole;

  // Query Notifications count from backend
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await api.get("/notifications");
        return response.data;
      } catch (e) {
        return [];
      }
    },
    refetchInterval: 10000, // Poll every 10 seconds for real-time notifications
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      return api.patch("/notifications/read");
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["finances"] });
      queryClient.invalidateQueries({ queryKey: ["money-mood"] });
      queryClient.invalidateQueries({ queryKey: ["life-events"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return authApi.logout();
    },
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        queryClient.clear();
        toast.success("Logged out successfully");
        window.location.href = "/login";
      }
    },
    onError: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        queryClient.clear();
        window.location.href = "/login";
      }
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const unreadCount = (notifications || []).filter((n: Notification) => !n.read).length;

  return (
    <div className="min-h-screen bg-[var(--sbi-sky)]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-border bg-white lg:flex">
        <div className="px-6 pt-6 pb-4">
          <SbiLogo />
        </div>
        <nav className="flex-1 px-3 py-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "group mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive(to)
                  ? "bg-[var(--sbi-blue)]/10 text-[var(--sbi-royal)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px]", isActive(to) && "text-[var(--sbi-blue)]")} />
              {t(NAV_KEYS[label] || label, label)}
            </Link>
          ))}
        </nav>
        <div
          onClick={handleLogout}
          className="m-3 flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3 cursor-pointer hover:bg-muted transition-all"
          title="Click to Log Out"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--sbi-blue)] to-[var(--sbi-royal)] text-sm font-semibold text-white">
            {userInitials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{userName}</div>
            <div className="truncate text-[11px] text-muted-foreground">{translatedRole}</div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-white/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <SbiLogo />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-[57px] z-20 border-b border-border bg-white p-3 lg:hidden">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                isActive(to)
                  ? "bg-[var(--sbi-blue)]/10 text-[var(--sbi-royal)]"
                  : "text-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {t(NAV_KEYS[label] || label, label)}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop top bar */}
      <div className="sticky top-0 z-10 hidden h-16 items-center gap-4 border-b border-border bg-white/80 px-8 backdrop-blur-xl lg:flex lg:pl-[260px]">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder={t("dashboard.search_placeholder")}
            className="w-full rounded-full border border-border bg-muted/40 py-2 pl-9 pr-12 text-sm outline-none transition focus:border-[var(--sbi-blue)] focus:bg-white"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
        <button
          onClick={() => unreadCount > 0 && markReadMutation.mutate()}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--error)] ring-2 ring-white" />
          )}
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--sbi-blue)] to-[var(--sbi-royal)] text-xs font-semibold text-white">
          {userInitials}
        </div>
      </div>

      {/* Main */}
      <main className="pb-24 lg:pb-8 lg:pl-[244px]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition",
                    active &&
                      "bg-[var(--sbi-blue)] text-white shadow-[0_6px_16px_-4px_rgba(0,173,239,0.6)]",
                  )}
                >
                  <Icon className={cn("h-4 w-4", !active && "text-muted-foreground")} />
                </div>
                <span className={cn(active ? "text-[var(--sbi-royal)]" : "text-muted-foreground")}>
                  {t(MOBILE_NAV_KEYS[label] || label, label)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// Reusable UI primitives

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--sbi-blue)]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--sbi-navy)] sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-hero)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TrustBadge({ label = "Reviewed for Your Benefit" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--success)]">
      <Shield className="h-3 w-3" />
      {label}
    </div>
  );
}

export function ConfidenceRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const color = value >= 80 ? "var(--success)" : value >= 60 ? "var(--sbi-blue)" : "var(--warning)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--muted)"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 800ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[13px] font-bold" style={{ color }}>
          {value}%
        </div>
      </div>
    </div>
  );
}

export function SignalChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}
