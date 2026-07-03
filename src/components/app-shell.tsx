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
import { cn } from "@/lib/utils";

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
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--sbi-blue)] shadow-[0_4px_16px_-2px_rgba(0,173,239,0.5)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-[var(--sbi-navy)]">SBI</div>
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

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

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
              {label}
            </Link>
          ))}
        </nav>
        <div className="m-3 flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--sbi-blue)] to-[var(--sbi-royal)] text-sm font-semibold text-white">
            AS
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Aarav Sharma</div>
            <div className="truncate text-[11px] text-muted-foreground">Premium Customer</div>
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
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop top bar */}
      <div className="sticky top-0 z-10 hidden h-16 items-center gap-4 border-b border-border bg-white/80 px-8 backdrop-blur-xl lg:flex lg:pl-[260px]">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search anything..."
            className="w-full rounded-full border border-border bg-muted/40 py-2 pl-9 pr-12 text-sm outline-none transition focus:border-[var(--sbi-blue)] focus:bg-white"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--error)] ring-2 ring-white" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--sbi-blue)] to-[var(--sbi-royal)] text-xs font-semibold text-white">
          AS
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
                  {label}
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
