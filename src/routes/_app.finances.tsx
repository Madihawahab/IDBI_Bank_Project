import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  Receipt,
  Landmark,
  Target,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { PageHeader, GlassCard } from "@/components/app-shell";

export const Route = createFileRoute("/_app/finances")({
  head: () => ({
    meta: [
      { title: "Finances — SBI Life Moments AI" },
      {
        name: "description",
        content: "Your accounts, income, expenses, investments and goals — all in one place.",
      },
      { property: "og:title", content: "Finances — SBI Life Moments AI" },
      { property: "og:description", content: "Complete money management for the modern customer." },
    ],
  }),
  component: FinancesPage,
});

const accounts = [
  { name: "Savings — XXXX 4421", bal: "₹4,82,350", trend: "+₹12,840", up: true },
  { name: "Salary — XXXX 2210", bal: "₹85,400", trend: "+₹85,000", up: true },
  { name: "Credit Card — Cashback", bal: "− ₹18,420", trend: "Due 28 Jul", up: false },
  { name: "Fixed Deposit", bal: "₹3,00,000", trend: "6.8% p.a.", up: true },
];

const investments = [
  { name: "Axis Bluechip SIP", amt: "₹2,84,500", change: "+12.4%" },
  { name: "Mirae ELSS", amt: "₹1,42,200", change: "+8.7%" },
  { name: "PPF", amt: "₹6,20,000", change: "+7.1%" },
  { name: "Gold ETF", amt: "₹48,900", change: "+15.2%" },
];

const bars = [60, 75, 45, 90, 70, 85, 55, 95, 65, 80, 72, 88];

function FinancesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finances"
        title="Your money, organised."
        subtitle="Net worth, cash flow, investments, loans and goals — across every account."
      />

      {/* Net worth hero */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div
          className="relative overflow-hidden rounded-3xl p-7 text-white shadow-[var(--shadow-hero)] lg:col-span-2"
          style={{ background: "var(--gradient-navy)" }}
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--sbi-blue)]/30 blur-3xl" />
          <div className="relative">
            <div className="text-sm text-white/80">Total Net Worth</div>
            <div className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">₹18,76,450</div>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
              <ArrowUpRight className="h-3 w-3" /> ₹1,45,230 (8.4%) vs last month
            </div>

            <div className="mt-8 flex h-24 items-end gap-1.5">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-[var(--sbi-blue)]/40 to-[var(--sbi-blue)]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-white/60">
              {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <KPI
            icon={ArrowUpRight}
            label="Income (This Month)"
            value="₹1,85,000"
            tone="success"
            sub="+ ₹15K vs avg"
          />
          <KPI
            icon={ArrowDownRight}
            label="Expenses"
            value="₹82,150"
            tone="error"
            sub="− 6% vs avg"
          />
          <KPI
            icon={Wallet}
            label="Monthly Cash Flow"
            value="+ ₹1,02,850"
            tone="success"
            sub="Healthy"
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle icon={Landmark}>Accounts</SectionTitle>
          <div className="mt-4 divide-y divide-border">
            {accounts.map((a) => (
              <div key={a.name} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-semibold">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">{a.trend}</div>
                </div>
                <div
                  className={`text-base font-bold ${a.up ? "text-[var(--sbi-navy)]" : "text-[var(--error)]"}`}
                >
                  {a.bal}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle icon={TrendingUp}>Investments</SectionTitle>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {investments.map((i) => (
              <div key={i.name} className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground">{i.name}</div>
                <div className="mt-1 text-lg font-bold text-[var(--sbi-navy)]">{i.amt}</div>
                <div className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--success)]">
                  <ArrowUpRight className="h-2.5 w-2.5" /> {i.change}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard>
          <SectionTitle icon={Receipt}>Bills & EMIs</SectionTitle>
          <div className="mt-4 space-y-3">
            {[
              { n: "Credit Card", a: "₹18,420", d: "28 Jul" },
              { n: "Home Loan EMI", a: "₹42,800", d: "5 Aug" },
              { n: "Electricity", a: "₹2,140", d: "12 Aug" },
            ].map((b) => (
              <div
                key={b.n}
                className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5"
              >
                <div>
                  <div className="text-sm font-semibold">{b.n}</div>
                  <div className="text-[11px] text-muted-foreground">Due {b.d}</div>
                </div>
                <div className="text-sm font-bold">{b.a}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle icon={Shield}>Insurance</SectionTitle>
          <div className="mt-4 space-y-3">
            {[
              { n: "Term Life", a: "₹1 Cr", s: "Active" },
              { n: "Health Family", a: "₹10L", s: "Active" },
              { n: "Car", a: "Comprehensive", s: "Renew Sep" },
            ].map((b) => (
              <div
                key={b.n}
                className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5"
              >
                <div>
                  <div className="text-sm font-semibold">{b.n}</div>
                  <div className="text-[11px] text-muted-foreground">{b.s}</div>
                </div>
                <div className="text-sm font-bold">{b.a}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionTitle icon={Target}>Goals</SectionTitle>
          <div className="mt-4 space-y-4">
            {[
              { g: "Home Down Payment", p: 73 },
              { g: "Emergency Fund", p: 92 },
              { g: "Europe Trip", p: 48 },
            ].map((g) => (
              <div key={g.g}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{g.g}</span>
                  <span className="font-semibold text-[var(--sbi-royal)]">{g.p}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--sbi-blue)] to-[var(--sbi-royal)]"
                    style={{ width: `${g.p}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
  tone,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "success" | "error";
  sub: string;
}) {
  const color = tone === "success" ? "var(--success)" : "var(--error)";
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold text-[var(--sbi-navy)]">{value}</div>
          <div className="text-[11px] text-muted-foreground">{sub}</div>
        </div>
      </div>
    </GlassCard>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[var(--sbi-blue)]" />
      <span className="font-semibold text-[var(--sbi-navy)]">{children}</span>
    </div>
  );
}
