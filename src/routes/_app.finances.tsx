import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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
  AlertCircle,
} from "lucide-react";
import { PageHeader, GlassCard } from "@/components/app-shell";
import { dashboardApi, transactionsApi } from "@/lib/api";
import { DashboardData, Transaction } from "../types/api";

export const Route = createFileRoute("/_app/finances")({
  head: () => ({
    meta: [
      { title: "Finances — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "Your accounts, income, expenses, investments and goals — all in one place.",
      },
      { property: "og:title", content: "Finances — IDBI BANK Life Moments AI" },
      { property: "og:description", content: "Complete money management for the modern customer." },
    ],
  }),
  component: FinancesPage,
});

const investments = [
  { name: "Axis Bluechip SIP", amt: "₹2,84,500", change: "+12.4%" },
  { name: "Mirae ELSS", amt: "₹1,42,200", change: "+8.7%" },
  { name: "PPF", amt: "₹6,20,000", change: "+7.1%" },
  { name: "Gold ETF", amt: "₹48,900", change: "+15.2%" },
];

const bars = [60, 75, 45, 90, 70, 85, 55, 95, 65, 80, 72, 88];

function FinancesPage() {
  // Fetch Dashboard Data
  const {
    data: dashboardData,
    isLoading: isDashLoading,
    error: dashError,
    refetch: refetchDash,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboard,
  });

  // Fetch Transactions List
  const {
    data: transactionsList,
    isLoading: isTxLoading,
    error: txError,
    refetch: refetchTx,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => transactionsApi.getTransactions(),
  });

  const handleRetry = () => {
    refetchDash();
    refetchTx();
  };

  const { incomeThisMonth, expensesThisMonth } = useMemo(() => {
    if (!transactionsList) return { incomeThisMonth: 185000, expensesThisMonth: 82150 };

    let inc = 0;
    let exp = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    transactionsList.forEach((t) => {
      const txDate = new Date(t.timestamp);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (t.receiver_name === "Aarav Sharma") {
          inc += t.amount;
        } else {
          exp += t.amount;
        }
      }
    });

    return {
      incomeThisMonth: inc > 0 ? inc : 185000,
      expensesThisMonth: exp > 0 ? exp : 82150,
    };
  }, [transactionsList]);

  const cashFlow = incomeThisMonth - expensesThisMonth;

  if (isDashLoading || isTxLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />

        {/* Hero Section Skeletons */}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="h-56 bg-slate-200 rounded-3xl lg:col-span-2" />
          <div className="space-y-3">
            <div className="h-16 bg-slate-200 rounded-3xl" />
            <div className="h-16 bg-slate-200 rounded-3xl" />
            <div className="h-16 bg-slate-200 rounded-3xl" />
          </div>
        </div>

        {/* Double Column Skeletons */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (dashError || txError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800">Failed to load finances</h3>
        <p className="text-sm text-red-600 mt-1">Please try again.</p>
        <button
          onClick={handleRetry}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const accounts = dashboardData?.accounts || [];

  // Calculate total balance across Savings, Salary, Fixed Deposit (positive) and Credit Card (liability/negative)
  const netWorthBalance = accounts.reduce((acc, account) => {
    if (account.account_type === "Credit Card") {
      return acc - account.balance;
    }
    return acc + account.balance;
  }, 0);

  // PPF, Mirae ELSS, Axis Bluechip SIP, Gold ETF (10,95,600)
  const totalInvestments = 284500 + 142200 + 620000 + 48900;
  const totalNetWorth = netWorthBalance + totalInvestments;

  const accountsList = accounts.map((acc) => {
    const isCreditCard = acc.account_type === "Credit Card";
    const formattedBal = `${isCreditCard ? "− " : ""}₹${acc.balance.toLocaleString("en-IN")}`;

    let trend = "+₹12,840";
    let up = true;
    if (acc.account_type === "Savings") {
      trend = "+₹12,840";
    } else if (acc.account_type === "Salary") {
      trend = "+₹85,000";
    } else if (acc.account_type === "Credit Card") {
      trend = "Due 28 Jul";
      up = false;
    } else if (acc.account_type === "Fixed Deposit") {
      trend = "6.8% p.a.";
    }

    return {
      name: `${acc.account_type} — XXXX ${acc.account_number.slice(-4)}`,
      bal: formattedBal,
      trend,
      up,
    };
  });

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
            <div className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
              ₹{totalNetWorth.toLocaleString("en-IN")}
            </div>
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
            value={`₹${incomeThisMonth.toLocaleString("en-IN")}`}
            tone="success"
            sub="+ ₹15K vs avg"
          />
          <KPI
            icon={ArrowDownRight}
            label="Expenses"
            value={`₹${expensesThisMonth.toLocaleString("en-IN")}`}
            tone="error"
            sub="− 6% vs avg"
          />
          <KPI
            icon={Wallet}
            label="Monthly Cash Flow"
            value={`${cashFlow >= 0 ? "+" : "−"} ₹${Math.abs(cashFlow).toLocaleString("en-IN")}`}
            tone={cashFlow >= 0 ? "success" : "error"}
            sub={cashFlow >= 0 ? "Healthy" : "Deficit"}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <SectionTitle icon={Landmark}>Accounts</SectionTitle>
          <div className="mt-4 divide-y divide-border">
            {accountsList.map((a) => (
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

// Reusable SectionTitle
function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[var(--sbi-blue)]" />
      <span className="font-semibold text-[var(--sbi-navy)]">{children}</span>
    </div>
  );
}
