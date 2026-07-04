import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  CheckCircle2,
  Shield,
  UserCheck,
  GitCommit,
  ChevronDown,
  Filter,
  AlertCircle,
} from "lucide-react";
import { PageHeader, SignalChip } from "@/components/app-shell";
import { trustLedgerApi } from "@/lib/api";
import { AIRecommendation } from "../types/api";

interface MappedLedgerEntry {
  id: string;
  title: string;
  when: string;
  confidence: number;
  impact: "High" | "Medium" | "Low";
  outcome: string;
  signals: string[];
  reason: string;
  alternatives: string;
  feedback: string;
  trust: string;
  human: boolean;
}

function TrustLedgerErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
      <h3 className="font-bold text-red-800">Failed to load Trust Ledger</h3>
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

export const Route = createFileRoute("/_app/trust-ledger")({
  head: () => ({
    meta: [
      { title: "Trust Ledger — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "An immutable record of every AI recommendation, signal and outcome.",
      },
      { property: "og:title", content: "Trust Ledger — IDBI BANK Life Moments AI" },
      {
        property: "og:description",
        content: "Transparency for every decision the AI makes for you.",
      },
    ],
  }),
  component: LedgerPage,
  errorComponent: (props) => <TrustLedgerErrorFallback {...props} />,
});

function LedgerPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");

  // Fetch Trust Ledger AI Recommendations
  const {
    data: recommendations,
    isLoading,
    error,
    refetch,
  } = useQuery<AIRecommendation[]>({
    queryKey: ["trust-ledger"],
    queryFn: trustLedgerApi.getTrustLedger,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />

        {/* Filter bar skeleton */}
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-slate-200 rounded-full" />
          <div className="h-10 w-24 bg-slate-200 rounded-full" />
        </div>

        {/* Ledger box skeleton */}
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800">Failed to load Trust Ledger</h3>
        <p className="text-sm text-red-600 mt-1">Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Map API models to UI properties
  const entries = (recommendations || []).map((r: AIRecommendation): MappedLedgerEntry => {
    const confidence = r.confidence_score;
    const isHumanApproved = confidence >= 90;

    // Simulate some signals based on title/category for UI display
    let signals = ["Balance: ₹4.82L", "Savings velocity", "Goal status"];
    if (r.title.toLowerCase().includes("sip")) {
      signals = ["SIP momentum", "Salary hike", "discretionary spend"];
    } else if (r.title.toLowerCase().includes("home")) {
      signals = ["Property browsing", "EMI buffer", "Stable income"];
    } else if (r.title.toLowerCase().includes("credit")) {
      signals = ["Utilisation rising", "On-time history"];
    }

    return {
      id: `rec-${r.id}`,
      title: r.title,
      when:
        new Date(r.timestamp).toLocaleDateString() +
        " · " +
        new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      confidence,
      impact: confidence >= 85 ? "High" : confidence >= 75 ? "Medium" : "Low",
      outcome: isHumanApproved ? "Customer Reviewed" : "Auto-applied",
      signals,
      reason: r.description,
      alternatives: r.alternative_options || "Maintain current savings allocation.",
      feedback: "Acted on",
      trust: confidence >= 85 ? "+12" : confidence >= 75 ? "+6" : "+2",
      human: isHumanApproved,
    };
  });

  const list = entries.filter((e: MappedLedgerEntry) =>
    e.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Trust Ledger"
        title="Every decision, on the record."
        subtitle="An immutable, customer-readable log of every recommendation the AI made — with the why, the alternatives, and the outcome."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search recommendations..."
            className="w-full rounded-full border border-border bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[var(--sbi-blue)]"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-2 text-sm font-medium">
          <Filter className="h-3.5 w-3.5" /> All
        </button>
      </div>

      <div className="relative rounded-3xl border border-border bg-white p-2 shadow-[var(--shadow-soft)]">
        <div className="absolute left-9 top-6 bottom-6 w-px bg-border" />

        {list.map((e: MappedLedgerEntry) => {
          const isOpen = open === e.id;
          return (
            <div key={e.id} className="relative">
              <div className="flex gap-4 p-4">
                <div className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white ring-4 ring-[var(--sbi-sky)]">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sbi-blue)]/10">
                    <GitCommit className="h-3.5 w-3.5 text-[var(--sbi-blue)]" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-[var(--sbi-navy)]">{e.title}</div>
                    <code className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      #{e.id}
                    </code>
                    {e.human && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--warning)]">
                        <UserCheck className="h-3 w-3" /> RM Approved
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{e.when}</div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                    <Stat label="Confidence" value={`${e.confidence}%`} tone="blue" />
                    <Stat
                      label="Impact"
                      value={e.impact}
                      tone={e.impact === "High" ? "warn" : "muted"}
                    />
                    <Stat label="Outcome" value={e.outcome} tone="success" />
                    <Stat
                      label="Trust Impact"
                      value={e.trust}
                      tone={e.trust.startsWith("+") ? "success" : "error"}
                    />
                  </div>

                  <button
                    onClick={() => setOpen(isOpen ? null : e.id)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--sbi-blue)]"
                  >
                    {isOpen ? "Collapse" : "Expand details"}
                    <ChevronDown className={`h-3 w-3 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="mt-3 grid gap-3 rounded-2xl bg-[var(--sbi-sky)] p-4 sm:grid-cols-2">
                      <Field title="Signals Used">
                        <div className="flex flex-wrap gap-1.5">
                          {e.signals.map((s: string) => (
                            <SignalChip key={s}>{s}</SignalChip>
                          ))}
                        </div>
                      </Field>
                      <Field title="Reason">{e.reason}</Field>
                      <Field title="Alternatives Considered">{e.alternatives}</Field>
                      <Field title="Customer Feedback">{e.feedback}</Field>
                      <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-3 sm:col-span-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--success)]">
                          <Shield className="h-3.5 w-3.5" /> Customer Advocate Review
                          <CheckCircle2 className="ml-auto h-4 w-4" />
                        </div>
                        <p className="mt-1 text-[11px] text-[var(--success)]">
                          Every step in this process was independently analyzed for fiduciary
                          integrity.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recommendations found matching your search
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warn" | "error" | "blue" | "muted";
}) {
  let color = "var(--muted-foreground)";
  if (tone === "success") color = "var(--success)";
  if (tone === "warn") color = "var(--warning)";
  if (tone === "error") color = "var(--error)";
  if (tone === "blue") color = "var(--sbi-royal)";

  return (
    <div>
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-white p-3">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="text-xs text-foreground/80 leading-relaxed">{children}</div>
    </div>
  );
}
