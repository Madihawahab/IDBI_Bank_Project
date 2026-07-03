import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Shield,
  UserCheck,
  GitCommit,
  ChevronDown,
  Filter,
} from "lucide-react";
import { PageHeader, SignalChip } from "@/components/app-shell";

export const Route = createFileRoute("/_app/trust-ledger")({
  head: () => ({
    meta: [
      { title: "Trust Ledger — SBI Life Moments AI" },
      {
        name: "description",
        content: "An immutable record of every AI recommendation, signal and outcome.",
      },
      { property: "og:title", content: "Trust Ledger — SBI Life Moments AI" },
      {
        property: "og:description",
        content: "Transparency for every decision the AI makes for you.",
      },
    ],
  }),
  component: LedgerPage,
});

const entries = [
  {
    id: "rec-1042",
    title: "Home Purchase Recommendation",
    when: "Mar 12, 2025 · 10:30 AM",
    confidence: 92,
    impact: "High",
    outcome: "Customer Reviewed",
    signals: ["SIP momentum", "Savings velocity", "Property browsing", "Stable income"],
    reason: "Down payment runway aligns with Q1 2026 — opportune to lock pre-approval.",
    alternatives: "Rent + invest for 18 mo; co-applicant loan",
    feedback: "Acted on",
    trust: "+12",
    human: true,
  },
  {
    id: "rec-1041",
    title: "SIP Increase Suggestion",
    when: "Mar 10, 2025 · 09:15 AM",
    confidence: 89,
    impact: "Medium",
    outcome: "Acknowledged",
    signals: ["Salary hike", "Lower discretionary spend", "Goal lag"],
    reason: "₹3K/mo SIP top-up closes Home goal gap by 5 months.",
    alternatives: "Lumpsum ₹50K once; rebalance equity",
    feedback: "Pending",
    trust: "+6",
    human: false,
  },
  {
    id: "rec-1040",
    title: "Credit Card Limit Increase",
    when: "Mar 8, 2025 · 04:45 PM",
    confidence: 75,
    impact: "Low",
    outcome: "Declined by customer",
    signals: ["Utilisation rising", "On-time history"],
    reason: "Available headroom reduces utilisation ratio — protects credit score.",
    alternatives: "Lower limit by 10%; add second card",
    feedback: "Declined",
    trust: "−2",
    human: false,
  },
  {
    id: "rec-1039",
    title: "Travel Insurance Suggestion",
    when: "Mar 5, 2025 · 11:20 AM",
    confidence: 88,
    impact: "Medium",
    outcome: "Auto-applied",
    signals: ["Flight booking", "Forex top-up", "Visa fee"],
    reason: "International travel detected — ₹1,200 cover protects ₹2L+ trip.",
    alternatives: "Group cover via card; standalone medical only",
    feedback: "Acted on",
    trust: "+9",
    human: false,
  },
  {
    id: "rec-1038",
    title: "Tax-Saving ELSS Nudge",
    when: "Feb 28, 2025 · 02:10 PM",
    confidence: 81,
    impact: "Medium",
    outcome: "Acted on",
    signals: ["80C headroom ₹40K", "Equity comfort", "Year-end"],
    reason: "Fills 80C with potential 12% CAGR — beats traditional saver.",
    alternatives: "PPF top-up; NPS additional ₹50K",
    feedback: "Acted on",
    trust: "+7",
    human: false,
  },
];

function LedgerPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const list = entries.filter((e) => e.title.toLowerCase().includes(q.toLowerCase()));

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

        {list.map((e) => {
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
                          {e.signals.map((s) => (
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
                        <p className="mt-1 text-xs text-foreground/80">
                          Reviewed for your benefit — passes our customer-first guardrails.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mx-4 border-t border-border last:border-0" />
            </div>
          );
        })}
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
  tone: "success" | "blue" | "warn" | "muted" | "error";
}) {
  const colors: Record<string, string> = {
    success: "var(--success)",
    blue: "var(--sbi-royal)",
    warn: "var(--warning)",
    error: "var(--error)",
    muted: "var(--muted-foreground)",
  };
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-bold" style={{ color: colors[tone] }}>
        {value}
      </div>
    </div>
  );
}

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="text-sm text-foreground/80">{children}</div>
    </div>
  );
}
