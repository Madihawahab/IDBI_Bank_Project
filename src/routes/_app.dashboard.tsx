import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
  Eye,
  Send,
  Receipt,
  ScanLine,
  TrendingUp,
  Shield,
  MoreHorizontal,
  Sparkles,
  Home as HomeIcon,
  Briefcase,
  Utensils,
  Zap,
  PiggyBank,
} from "lucide-react";
import { GlassCard } from "@/components/app-shell";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Home — SBI Life Moments AI" },
      {
        name: "description",
        content: "What should I know today? Your essential financial briefing.",
      },
      { property: "og:title", content: "SBI Life Moments AI" },
      { property: "og:description", content: "Your AI-first banking home." },
    ],
  }),
  component: HomePage,
});

const transactions = [
  {
    icon: Briefcase,
    label: "Salary Credit",
    sub: "HDFC Payroll",
    amount: "+ ₹85,000",
    today: "Today",
    positive: true,
  },
  { icon: Utensils, label: "Swiggy", sub: "Food Delivery", amount: "− ₹420", today: "Today" },
  { icon: Zap, label: "Electricity Bill", sub: "BESCOM", amount: "− ₹1,840", today: "Yesterday" },
  {
    icon: PiggyBank,
    label: "SIP — Axis Bluechip",
    sub: "Investment",
    amount: "− ₹25,000",
    today: "Yesterday",
  },
];

const actions = [
  { icon: Send, label: "Transfer" },
  { icon: Receipt, label: "Pay Bills" },
  { icon: ScanLine, label: "Scan & Pay" },
  { icon: TrendingUp, label: "Invest" },
  { icon: Shield, label: "Insurance" },
  { icon: MoreHorizontal, label: "More" },
];

function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--sbi-navy)] sm:text-4xl">
            Good morning, Aarav <span className="ml-1">👋</span>
          </h1>
          <p className="mt-1 text-muted-foreground">Here's what's important today</p>
        </div>
      </div>

      {/* Hero balance + upcoming life event */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div
          className="relative overflow-hidden rounded-3xl p-7 text-white shadow-[var(--shadow-hero)] lg:col-span-2"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[var(--sbi-navy)]/30 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm text-white/80">
              Total Available Balance <Eye className="h-4 w-4" />
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight sm:text-6xl">₹4,82,350</span>
              <span className="text-2xl font-semibold text-white/80">.45</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
              <ArrowUpRight className="h-3 w-3" /> ₹12,840 vs last month
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Transfer", "Pay Bills", "Scan & Pay", "More"].map((a) => (
                <button
                  key={a}
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-md transition hover:bg-white/25"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <GlassCard className="relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--sbi-blue)]/10 blur-2xl" />
          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sbi-blue)]">
              Upcoming Life Event
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-xl font-bold text-[var(--sbi-navy)]">Home Purchase</div>
                <div className="mt-1 text-xs text-muted-foreground">Predicted: Mar 2026</div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--sbi-blue)]/20 to-[var(--sbi-royal)]/20">
                <HomeIcon className="h-7 w-7 text-[var(--sbi-royal)]" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--success)]/10 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--success)]">Confidence</span>
                <span className="font-bold text-[var(--success)]">92%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[var(--success)]" style={{ width: "92%" }} />
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">You are financially on track!</p>
            <button className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sbi-blue)]">
              View Details <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* AI insight + transactions */}
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard className="bg-gradient-to-br from-[var(--sbi-blue)]/5 to-white">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--sbi-blue)] to-[var(--sbi-royal)] shadow-[0_8px_24px_-8px_rgba(0,85,165,0.5)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sbi-blue)]">
                Today's AI Insight
              </div>
              <div className="mt-1.5 text-lg font-bold text-[var(--sbi-navy)]">
                You're 20% closer to your Home Purchase goal
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Consider increasing SIP by ₹3,000 to reach your target faster.
              </p>
              <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sbi-blue)]">
                View Recommendation <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold text-[var(--sbi-navy)]">Recent Transactions</div>
            <button className="text-xs font-semibold text-[var(--sbi-blue)]">View All</button>
          </div>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <t.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{t.label}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.sub}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${t.positive ? "text-[var(--success)]" : ""}`}>
                    {t.amount}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{t.today}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Quick actions */}
      <GlassCard>
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {actions.map((a) => (
            <button
              key={a.label}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 transition hover:-translate-y-0.5 hover:border-border hover:bg-muted/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--sbi-blue)]/10 text-[var(--sbi-royal)] transition group-hover:bg-[var(--sbi-blue)] group-hover:text-white">
                <a.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
