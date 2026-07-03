import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Home,
  GraduationCap,
  Plane,
  Heart,
  Baby,
  Car,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { ConfidenceRing, TrustBadge, SignalChip, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_app/life-events")({
  head: () => ({
    meta: [
      { title: "Life Events — SBI Life Moments AI" },
      {
        name: "description",
        content: "AI predicts the life events ahead so you can prepare with confidence.",
      },
      { property: "og:title", content: "Life Events — SBI Life Moments AI" },
      {
        property: "og:description",
        content: "Predicted life events with confidence, signals, and readiness.",
      },
    ],
  }),
  component: LifeEventsPage,
});

const events = [
  {
    id: "home",
    icon: Home,
    title: "Home Purchase",
    when: "Mar 2026",
    confidence: 92,
    readiness: 73,
    summary: "Based on your savings & spending pattern",
    signals: [
      "Rising SIP contributions",
      "Property search browsing",
      "Increased savings velocity",
      "Mortgage rate research",
    ],
    reasoning:
      "You've consistently increased your SIP for 6 months and added ₹2.4L to your home goal account. Your stable income and low debt-to-income ratio support readiness by Q1 2026.",
    alternatives:
      "You could rent for 18 more months and invest the down payment for higher returns, or buy now with a higher EMI but lock current rates.",
    future: "If you maintain pace, projected down payment ₹12L by Mar 2026 — 87% of target.",
    tint: "from-[var(--sbi-blue)]/15 to-[var(--sbi-royal)]/10",
  },
  {
    id: "edu",
    icon: GraduationCap,
    title: "Higher Education",
    when: "Aug 2027",
    confidence: 78,
    readiness: 54,
    summary: "Building your child's future",
    signals: [
      "School fee escalation",
      "Education insurance enquiry",
      "Sukanya deposits",
      "Coaching expenses",
    ],
    reasoning:
      "Recurring school payments and increasing tuition costs combined with your Sukanya Samriddhi pattern suggest a higher-education milestone in ~3 years.",
    alternatives:
      "Switch a portion of equity SIP into a dedicated child education plan, or take an education loan at the time and continue current investments.",
    future: "Education corpus could reach ₹18L by Aug 2027 with a ₹4,000 monthly top-up.",
    tint: "from-[var(--gold)]/15 to-[var(--warning)]/10",
  },
  {
    id: "vacay",
    icon: Plane,
    title: "International Vacation",
    when: "Dec 2025",
    confidence: 66,
    readiness: 48,
    summary: "Goa or Europe? You're getting there!",
    signals: [
      "Flight searches",
      "Forex card top-up",
      "Visa fee payment",
      "Travel insurance browsing",
    ],
    reasoning:
      "Repeated travel research and your December bonus cycle indicate a year-end international trip.",
    alternatives:
      "Domestic luxury escape (Andamans/Ladakh) at 40% the cost, or split trip across two short weekends.",
    future: "A ₹15,000 monthly travel SIP gets you to ₹2.1L by Nov 2025 — fully funded.",
    tint: "from-[var(--success)]/15 to-[var(--sbi-blue)]/10",
  },
  {
    id: "car",
    icon: Car,
    title: "Car Upgrade",
    when: "Jul 2026",
    confidence: 71,
    readiness: 61,
    summary: "Time for an SUV?",
    signals: [
      "Service costs rising",
      "Test drive bookings",
      "Auto loan calculator visits",
      "Insurance renewal soon",
    ],
    reasoning:
      "Your current car is 7 years old with rising service expense — replacement window opens mid-2026.",
    alternatives: "Pre-owned premium car at 60% cost, or extend current car's warranty by 2 years.",
    future: "Down payment of ₹4L feasible with a ₹12,000 monthly auto-fund SIP.",
    tint: "from-[var(--sbi-royal)]/15 to-[var(--sbi-navy)]/10",
  },
];

const filters = ["All Events", "Upcoming", "On Track", "Completed"];

function LifeEventsPage() {
  const [filter, setFilter] = useState("Upcoming");
  const [open, setOpen] = useState<string | null>("home");

  return (
    <div>
      <PageHeader
        eyebrow="Life Events"
        title="AI predicts. You plan. We partner."
        subtitle="Major life moments we see ahead, with the signals we used and the financial readiness to meet them."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sbi-blue)] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,173,239,0.6)] transition hover:opacity-95">
            <Plus className="h-4 w-4" /> Add Goal
          </button>
        }
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f
                ? "bg-[var(--sbi-blue)] text-white shadow-[0_6px_16px_-6px_rgba(0,173,239,0.6)]"
                : "bg-white text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {events.map((e) => {
          const isOpen = open === e.id;
          return (
            <div
              key={e.id}
              className="overflow-hidden rounded-3xl border border-border bg-white shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-start gap-5">
                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${e.tint}`}
                  >
                    <e.icon className="h-9 w-9 text-[var(--sbi-royal)]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-[var(--sbi-navy)]">{e.title}</h3>
                      <TrustBadge />
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Predicted: <span className="font-medium text-foreground">{e.when}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{e.summary}</p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-muted-foreground">
                          Financial Readiness
                        </span>
                        <span className="font-bold text-[var(--sbi-royal)]">{e.readiness}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--sbi-blue)] to-[var(--sbi-royal)]"
                          style={{ width: `${e.readiness}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Confidence
                    </div>
                    <ConfidenceRing value={e.confidence} size={68} />
                  </div>
                </div>

                <button
                  onClick={() => setOpen(isOpen ? null : e.id)}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sbi-blue)]"
                >
                  {isOpen ? "Hide Details" : "View Details"}
                  <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-border bg-[var(--sbi-sky)]/60 p-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Observed Signals
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {e.signals.map((s) => (
                          <SignalChip key={s}>{s}</SignalChip>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Reasoning
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                        {e.reasoning}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Alternative Possibilities
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                        {e.alternatives}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--sbi-blue)]">
                        <Sparkles className="h-3 w-3" /> Future You
                      </div>
                      <p className="mt-2 text-sm leading-relaxed">{e.future}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button className="rounded-full bg-[var(--sbi-blue)] px-4 py-2 text-sm font-semibold text-white">
                      Apply Recommendation
                    </button>
                    <button className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium">
                      Talk to Advisor
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
