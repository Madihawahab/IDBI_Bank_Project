import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  AlertCircle,
  QrCode,
  type LucideIcon,
} from "lucide-react";
import { GlassCard } from "@/components/app-shell";
import { dashboardApi, transactionsApi, authApi } from "@/lib/api";
import { toast } from "sonner";
import { DashboardData, Transaction } from "../types/api";

function DashboardErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
      <h3 className="font-bold text-red-800">Something went wrong on the dashboard</h3>
      <p className="text-sm text-red-600 mt-1">{error.message || "Please try again."}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Home — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "What should I know today? Your essential financial briefing.",
      },
      { property: "og:title", content: "IDBI BANK Life Moments AI" },
      { property: "og:description", content: "Your AI-first banking home." },
    ],
  }),
  component: HomePage,
  errorComponent: (props) => <DashboardErrorFallback {...props} />,
});

const categoryIcons: Record<string, LucideIcon> = {
  Salary: Briefcase,
  Food: Utensils,
  Utilities: Zap,
  Investment: PiggyBank,
};

function HomePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Modals state
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isPayBillsOpen, setIsPayBillsOpen] = useState(false);
  const [isScanPayOpen, setIsScanPayOpen] = useState(false);
  const [isAllTxOpen, setIsAllTxOpen] = useState(false);

  // Form states
  const [recipientAccount, setRecipientAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferCategory, setTransferCategory] = useState("Transfer");

  const [billType, setBillType] = useState("Electricity");
  const [billerName, setBillerName] = useState("");
  const [billAmount, setBillAmount] = useState("");

  const [qrData, setQrData] = useState("");
  const [scanAmount, setScanAmount] = useState("");

  // Search/Filter/Sort for Transactions Modal
  const [txSearch, setTxSearch] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState<"All" | "Debit" | "Credit">("All");
  const [txSortBy, setTxSortBy] = useState<"DateDesc" | "DateAsc" | "AmtDesc" | "AmtAsc">(
    "DateDesc",
  );

  // Fetch Dashboard Data (Polls every 30 seconds)
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getDashboard,
    refetchInterval: 30000,
  });

  // Fetch Current User Details (for personalized greeting)
  const { data: userProfile } = useQuery({
    queryKey: ["userMe"],
    queryFn: authApi.getMe,
  });
  const firstName = userProfile?.name ? userProfile.name.split(" ")[0] : "Aarav";

  // Fetch Full Transactions (only when Transactions modal is open)
  const {
    data: fullTransactions,
    isLoading: isTxLoading,
    error: txError,
    refetch: refetchTx,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => transactionsApi.getTransactions(),
    enabled: isAllTxOpen,
  });

  // Filter/Search/Sort transactions in-memory
  const filteredAndSortedTx = useMemo(() => {
    if (!fullTransactions) return [];

    return fullTransactions
      .filter((t) => {
        const isReceived = t.receiver_name === userProfile?.name;
        const amountStr = String(t.amount);
        const searchTarget =
          `${t.merchant || ""} ${t.receiver_name} ${t.sender_name} ${t.category} ${t.type}`.toLowerCase();

        const matchesSearch =
          searchTarget.includes(txSearch.toLowerCase()) || amountStr.includes(txSearch);
        if (!matchesSearch) return false;

        if (txTypeFilter === "Debit") return !isReceived;
        if (txTypeFilter === "Credit") return isReceived;
        return true;
      })
      .sort((a, b) => {
        if (txSortBy === "DateDesc")
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (txSortBy === "DateAsc")
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        if (txSortBy === "AmtDesc") return b.amount - a.amount;
        if (txSortBy === "AmtAsc") return a.amount - b.amount;
        return 0;
      });
  }, [fullTransactions, txSearch, txTypeFilter, txSortBy, userProfile]);

  // Transfer Mutation with Optimistic Updates & Rollbacks
  const transferMutation = useMutation({
    mutationFn: transactionsApi.transfer,
    onMutate: async (newTransfer) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousDashboard = queryClient.getQueryData<DashboardData>(["dashboard"]);
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions"]);

      if (previousDashboard) {
        const updatedAccounts = previousDashboard.accounts.map((acc) => {
          if (acc.account_type === "Savings") {
            return { ...acc, balance: acc.balance - newTransfer.amount };
          }
          return acc;
        });

        const optimisticTx: Transaction = {
          id: Math.random(),
          sender_id: userProfile?.id,
          receiver_id: undefined,
          sender_name: userProfile?.name || "Aarav Sharma",
          receiver_name: `Account ${newTransfer.recipient_account}`,
          amount: newTransfer.amount,
          type: "transfer",
          category: newTransfer.category || "Transfer",
          timestamp: new Date().toISOString(),
          status: "Success",
        };

        queryClient.setQueryData<DashboardData>(["dashboard"], {
          ...previousDashboard,
          balance: previousDashboard.balance - newTransfer.amount,
          accounts: updatedAccounts,
          recent_transactions: [optimisticTx, ...previousDashboard.recent_transactions.slice(0, 3)],
        });
      }

      if (previousTransactions) {
        const optimisticTx: Transaction = {
          id: Math.random(),
          sender_id: userProfile?.id,
          receiver_id: undefined,
          sender_name: userProfile?.name || "Aarav Sharma",
          receiver_name: `Account ${newTransfer.recipient_account}`,
          amount: newTransfer.amount,
          type: "transfer",
          category: newTransfer.category || "Transfer",
          timestamp: new Date().toISOString(),
          status: "Success",
        };
        queryClient.setQueryData<Transaction[]>(
          ["transactions"],
          [optimisticTx, ...previousTransactions],
        );
      }

      return { previousDashboard, previousTransactions };
    },
    onError: (err: unknown, newTransfer, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard"], context.previousDashboard);
      }
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || "Transfer failed. Please try again.");
    },
    onSuccess: (data) => {
      toast.success(
        `Successfully transferred ₹${data.amount.toLocaleString()} to ${data.receiver_name}`,
      );
      setIsTransferOpen(false);
      setRecipientAccount("");
      setTransferAmount("");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["finances"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["life-events"] });
      queryClient.invalidateQueries({ queryKey: ["money-mood"] });
    },
  });

  // Pay Bill Mutation with Optimistic Updates & Rollbacks
  const payBillMutation = useMutation({
    mutationFn: transactionsApi.payBill,
    onMutate: async (newBill) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousDashboard = queryClient.getQueryData<DashboardData>(["dashboard"]);
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions"]);

      if (previousDashboard) {
        const updatedAccounts = previousDashboard.accounts.map((acc) => {
          if (acc.account_type === "Savings") {
            return { ...acc, balance: acc.balance - newBill.amount };
          }
          return acc;
        });

        const optimisticTx: Transaction = {
          id: Math.random(),
          sender_name: userProfile?.name || "Aarav Sharma",
          receiver_name: newBill.biller_name,
          amount: newBill.amount,
          type: "pay-bill",
          category: newBill.bill_type || "Utilities",
          timestamp: new Date().toISOString(),
          status: "Success",
          merchant: newBill.biller_name,
        };

        queryClient.setQueryData<DashboardData>(["dashboard"], {
          ...previousDashboard,
          balance: previousDashboard.balance - newBill.amount,
          accounts: updatedAccounts,
          recent_transactions: [optimisticTx, ...previousDashboard.recent_transactions.slice(0, 3)],
        });
      }

      if (previousTransactions) {
        const optimisticTx: Transaction = {
          id: Math.random(),
          sender_name: userProfile?.name || "Aarav Sharma",
          receiver_name: newBill.biller_name,
          amount: newBill.amount,
          type: "pay-bill",
          category: newBill.bill_type || "Utilities",
          timestamp: new Date().toISOString(),
          status: "Success",
          merchant: newBill.biller_name,
        };
        queryClient.setQueryData<Transaction[]>(
          ["transactions"],
          [optimisticTx, ...previousTransactions],
        );
      }

      return { previousDashboard, previousTransactions };
    },
    onError: (err: unknown, newBill, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard"], context.previousDashboard);
      }
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || "Payment failed. Please try again.");
    },
    onSuccess: (data) => {
      toast.success(
        `Successfully paid bill of ₹${data.amount.toLocaleString()} to ${data.receiver_name}`,
      );
      setIsPayBillsOpen(false);
      setBillerName("");
      setBillAmount("");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["finances"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["life-events"] });
      queryClient.invalidateQueries({ queryKey: ["money-mood"] });
    },
  });

  // Scan & Pay Mutation with Optimistic Updates & Rollbacks
  const scanPayMutation = useMutation({
    mutationFn: transactionsApi.scanPay,
    onMutate: async (newScan) => {
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousDashboard = queryClient.getQueryData<DashboardData>(["dashboard"]);
      const previousTransactions = queryClient.getQueryData<Transaction[]>(["transactions"]);

      let merchantName = newScan.qr_data;
      if (newScan.qr_data.includes("pn=")) {
        const parts = newScan.qr_data.split("pn=");
        if (parts.length > 1) {
          merchantName = parts[1].split("&")[0].replace(/%20/g, " ").replace(/\+/g, " ");
        }
      }

      if (previousDashboard) {
        const updatedAccounts = previousDashboard.accounts.map((acc) => {
          if (acc.account_type === "Savings") {
            return { ...acc, balance: acc.balance - newScan.amount };
          }
          return acc;
        });

        const optimisticTx: Transaction = {
          id: Math.random(),
          sender_name: userProfile?.name || "Aarav Sharma",
          receiver_name: merchantName,
          amount: newScan.amount,
          type: "scan-pay",
          category: "Shopping",
          timestamp: new Date().toISOString(),
          status: "Success",
          merchant: merchantName,
        };

        queryClient.setQueryData<DashboardData>(["dashboard"], {
          ...previousDashboard,
          balance: previousDashboard.balance - newScan.amount,
          accounts: updatedAccounts,
          recent_transactions: [optimisticTx, ...previousDashboard.recent_transactions.slice(0, 3)],
        });
      }

      if (previousTransactions) {
        const optimisticTx: Transaction = {
          id: Math.random(),
          sender_name: userProfile?.name || "Aarav Sharma",
          receiver_name: merchantName,
          amount: newScan.amount,
          type: "scan-pay",
          category: "Shopping",
          timestamp: new Date().toISOString(),
          status: "Success",
          merchant: merchantName,
        };
        queryClient.setQueryData<Transaction[]>(
          ["transactions"],
          [optimisticTx, ...previousTransactions],
        );
      }

      return { previousDashboard, previousTransactions };
    },
    onError: (err: unknown, newScan, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard"], context.previousDashboard);
      }
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions"], context.previousTransactions);
      }
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || "Payment failed. Please try again.");
    },
    onSuccess: (data) => {
      toast.success(
        `Payment of ₹${data.amount.toLocaleString()} to ${data.receiver_name} successful!`,
      );
      setIsScanPayOpen(false);
      setQrData("");
      setScanAmount("");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["finances"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["life-events"] });
      queryClient.invalidateQueries({ queryKey: ["money-mood"] });
    },
  });

  // Form submit handlers with local validations
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAccount || recipientAccount.length < 8) {
      toast.error("Please enter a valid recipient account number.");
      return;
    }
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid transfer amount.");
      return;
    }
    const currentBalance = data?.balance ?? 0;
    if (amt > currentBalance) {
      toast.error("Insufficient balance to perform this transfer.");
      return;
    }
    transferMutation.mutate({
      recipient_account: recipientAccount,
      amount: amt,
      category: transferCategory,
    });
  };

  const handlePayBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billerName.trim()) {
      toast.error("Please enter a valid biller name.");
      return;
    }
    const amt = parseFloat(billAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid bill payment amount.");
      return;
    }
    const currentBalance = data?.balance ?? 0;
    if (amt > currentBalance) {
      toast.error("Insufficient balance to pay this bill.");
      return;
    }
    payBillMutation.mutate({
      bill_type: billType,
      biller_name: billerName,
      amount: amt,
    });
  };

  const handleScanPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qrPayload = qrData || "upi://pay?pa=merchant@upi&pn=Merchant";
    const amt = parseFloat(scanAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }
    const currentBalance = data?.balance ?? 0;
    if (amt > currentBalance) {
      toast.error("Insufficient balance to pay.");
      return;
    }
    scanPayMutation.mutate({
      qr_data: qrPayload,
      amount: amt,
    });
  };
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />

        {/* Hero Section Skeletons */}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="h-48 bg-slate-200 rounded-3xl lg:col-span-2" />
          <div className="h-48 bg-slate-200 rounded-3xl" />
        </div>

        {/* Insight + Transactions Skeletons */}
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-48 bg-slate-200 rounded-3xl" />
          <div className="h-48 bg-slate-200 rounded-3xl" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="h-28 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800">Failed to load dashboard</h3>
        <p className="text-sm text-red-600 mt-1">Please check your connection and try again.</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["dashboard"] })}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const balance = data?.balance ?? 482350.45;
  const balanceInt = Math.floor(balance);
  const balanceDec = (balance % 1).toFixed(2).slice(1);

  // Quick Action mappings
  const handleQuickAction = (label: string) => {
    if (label === "Transfer") setIsTransferOpen(true);
    if (label === "Pay Bills") setIsPayBillsOpen(true);
    if (label === "Scan & Pay") setIsScanPayOpen(true);
    if (label === "Invest") navigate({ to: "/finances" });
    if (label === "Insurance") navigate({ to: "/finances" });
    if (label === "More") navigate({ to: "/settings" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--sbi-navy)] sm:text-4xl">
            Good morning, {firstName} <span className="ml-1">👋</span>
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
              <span className="text-5xl font-bold tracking-tight sm:text-6xl">
                ₹{balanceInt.toLocaleString("en-IN")}
              </span>
              <span className="text-2xl font-semibold text-white/80">{balanceDec}</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
              <ArrowUpRight className="h-3 w-3" /> ₹12,840 vs last month
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Transfer", "Pay Bills", "Scan & Pay", "More"].map((a) => (
                <button
                  key={a}
                  onClick={() => handleQuickAction(a)}
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
                <div className="text-xl font-bold text-[var(--sbi-navy)]">
                  {data?.upcoming_life_event?.title ?? "Home Purchase"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Predicted: {data?.upcoming_life_event?.prediction_date ?? "Mar 2026"}
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--sbi-blue)]/20 to-[var(--sbi-royal)]/20">
                <HomeIcon className="h-7 w-7 text-[var(--sbi-royal)]" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--success)]/10 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--success)]">Confidence</span>
                <span className="font-bold text-[var(--success)]">
                  {data?.upcoming_life_event?.confidence ?? 92}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[var(--success)]"
                  style={{ width: `${data?.upcoming_life_event?.confidence ?? 92}%` }}
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {data?.upcoming_life_event?.explanation ?? "You are financially on track!"}
            </p>
            <button
              onClick={() => navigate({ to: "/life-events" })}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sbi-blue)]"
            >
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
                {data?.ai_insight?.title ?? "Increase SIP by ₹3,000"}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {data?.ai_insight?.description ??
                  "Consider increasing mutual fund SIP by ₹3,000 to reach your target faster."}
              </p>
              <button
                onClick={() => {
                  const title = data?.ai_insight?.title || "Increase SIP by ₹3,000";
                  const prompt = `Tell me more about the recommendation: "${title}". Why is it useful and how confident are you about it?`;
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("idbi_pending_prompt", prompt);
                  }
                  navigate({ to: "/ai-advisor" });
                }}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sbi-blue)]"
              >
                View Recommendation <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold text-[var(--sbi-navy)]">Recent Transactions</div>
            <button
              onClick={() => setIsAllTxOpen(true)}
              className="text-xs font-semibold text-[var(--sbi-blue)]"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {data?.recent_transactions?.map((t: Transaction) => {
              const isReceived = t.receiver_name === userProfile?.name;
              const Icon = categoryIcons[t.category] || ArrowUpRight;
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {isReceived ? t.sender_name : t.receiver_name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t.category} ({t.type})
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${isReceived ? "text-[var(--success)]" : ""}`}
                    >
                      {isReceived ? "+" : "−"} ₹{t.amount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(t.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
            {(!data?.recent_transactions || data.recent_transactions.length === 0) && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No recent transactions
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Quick actions menu */}
      <GlassCard>
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { icon: Send, label: "Transfer" },
            { icon: Receipt, label: "Pay Bills" },
            { icon: ScanLine, label: "Scan & Pay" },
            { icon: TrendingUp, label: "Invest" },
            { icon: Shield, label: "Insurance" },
            { icon: MoreHorizontal, label: "More" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => handleQuickAction(a.label)}
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

      {/* ========================================================
          FUNCTIONAL MODALS (STYLING MATCHES DESIGN SYSTEM PERFECTLY)
         ======================================================== */}

      {/* 1. Transfer Modal */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <h2 className="text-xl font-bold text-[var(--sbi-navy)] mb-4">Transfer Money</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                transferMutation.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Recipient Account Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1234567890"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <select
                  value={transferCategory}
                  onChange={(e) => setTransferCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)] focus:bg-white"
                >
                  <option value="Transfer">General Transfer</option>
                  <option value="Investment">Investment</option>
                  <option value="Rent">Rent</option>
                  <option value="Family">Family Support</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferMutation.isPending}
                  className="px-5 py-2 rounded-full bg-[var(--sbi-blue)] text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {transferMutation.isPending ? "Transferring..." : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Pay Bills Modal */}
      {isPayBillsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <h2 className="text-xl font-bold text-[var(--sbi-navy)] mb-4">Pay Utility Bills</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                payBillMutation.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Bill Type</label>
                <select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)]"
                >
                  <option value="Electricity">Electricity Bill</option>
                  <option value="Mobile">Mobile Recharge</option>
                  <option value="Water">Water Bill</option>
                  <option value="Internet">Broadband/DTH</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Biller Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BESCOM, Airtel, Tata Play"
                  value={billerName}
                  onChange={(e) => setBillerName(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)] focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)] focus:bg-white"
                />
              </div>
              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsPayBillsOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payBillMutation.isPending}
                  className="px-5 py-2 rounded-full bg-[var(--sbi-blue)] text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {payBillMutation.isPending ? "Processing..." : "Pay Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Scan & Pay Modal */}
      {isScanPayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <h2 className="text-xl font-bold text-[var(--sbi-navy)] mb-2">Scan & Pay QR</h2>
            <p className="text-xs text-muted-foreground mb-4">Simulate QR scan payment below.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                scanPayMutation.mutate();
              }}
              className="space-y-4"
            >
              {/* QR Camera Placeholder */}
              <div className="relative h-44 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden flex flex-col items-center justify-center text-white/50">
                <QrCode className="h-10 w-10 animate-pulse mb-2 text-[var(--sbi-royal)]" />
                <div className="text-xs font-medium uppercase tracking-widest text-[var(--sbi-royal)]">
                  QR Camera Scanner
                </div>
                <div className="absolute inset-x-0 h-0.5 bg-green-500/80 animate-[scannerBar_2s_infinite]" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Select Mock Merchant QR
                </label>
                <select
                  onChange={(e) => setQrData(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)]"
                >
                  <option value="upi://pay?pa=starbucks@upi&pn=Starbucks%20Coffee">
                    Starbucks Coffee
                  </option>
                  <option value="upi://pay?pa=reliancedigital@upi&pn=Reliance%20Digital">
                    Reliance Digital
                  </option>
                  <option value="upi://pay?pa=hppetrol@upi&pn=HP%20Petrol%20Pump">
                    HP Petrol Pump
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 250"
                  value={scanAmount}
                  onChange={(e) => setScanAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)] focus:bg-white"
                />
              </div>
              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsScanPayOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scanPayMutation.isPending}
                  className="px-5 py-2 rounded-full bg-[var(--sbi-blue)] text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {scanPayMutation.isPending ? "Paying..." : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. All Transactions Modal */}
      {isAllTxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--sbi-navy)]">Transaction History</h2>
              <button
                onClick={() => setIsAllTxOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-4 shrink-0">
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Search merchant, category, amount..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)] focus:bg-white"
                />
                <select
                  value={txSortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setTxSortBy(e.target.value as "DateDesc" | "DateAsc" | "AmtDesc" | "AmtAsc")
                  }
                  className="px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[var(--sbi-blue)]"
                >
                  <option value="DateDesc">Newest First</option>
                  <option value="DateAsc">Oldest First</option>
                  <option value="AmtDesc">Amount: High to Low</option>
                  <option value="AmtAsc">Amount: Low to High</option>
                </select>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                {(["All", "Debit", "Credit"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTxTypeFilter(type)}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                      txTypeFilter === type
                        ? "border-[var(--sbi-blue)] text-[var(--sbi-royal)]"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {type} Transactions
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto min-h-[300px] divide-y divide-slate-100 pr-1">
              {isTxLoading ? (
                <div className="space-y-3 py-4 animate-pulse">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-slate-200 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/4" />
                      </div>
                      <div className="h-4 bg-slate-200 rounded w-1/6" />
                    </div>
                  ))}
                </div>
              ) : txError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    Failed to load transactions
                  </p>
                  <button
                    onClick={() => refetchTx()}
                    className="mt-3 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredAndSortedTx.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No matching transactions found.
                </div>
              ) : (
                filteredAndSortedTx.map((t: Transaction) => {
                  const isReceived = t.receiver_name === userProfile?.name;
                  const Icon = categoryIcons[t.category] || ArrowUpRight;
                  return (
                    <div key={t.id} className="flex items-center gap-3 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-[var(--sbi-navy)]">
                          {isReceived ? t.sender_name : t.receiver_name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {t.category} ({t.type})
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-bold ${isReceived ? "text-[var(--success)]" : "text-slate-700"}`}
                        >
                          {isReceived ? "+" : "−"} ₹{t.amount.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(t.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scannerBar {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
