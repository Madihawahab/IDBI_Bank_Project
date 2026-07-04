import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

interface MappedLifeEvent {
  id: string;
  icon: LucideIcon;
  title: string;
  when: string;
  confidence: number;
  readiness: number;
  summary: string;
  signals: string[];
  reasoning: string;
  alternatives: string;
  future: string;
  tint: string;
}
import { ConfidenceRing, TrustBadge, SignalChip, PageHeader } from "@/components/app-shell";
import { lifeEventsApi } from "@/lib/api";
import { LifeEvent } from "../types/api";

function LifeEventsErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
      <h3 className="font-bold text-red-800">Failed to load Life Events</h3>
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

export const Route = createFileRoute("/_app/life-events")({
  head: () => ({
    meta: [
      { title: "Life Events — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "AI predicts the life events ahead so you can prepare with confidence.",
      },
      { property: "og:title", content: "Life Events — IDBI BANK Life Moments AI" },
      {
        property: "og:description",
        content: "Predicted life events with confidence, signals, and readiness.",
      },
    ],
  }),
  component: LifeEventsPage,
  errorComponent: (props) => <LifeEventsErrorFallback {...props} />,
});

const icons: Record<string, LucideIcon> = {
  Home,
  GraduationCap,
  Plane,
  Heart,
  Baby,
  Car,
};

const filters = ["All Events", "Upcoming", "On Track", "Completed"];

function LifeEventsPage() {
  const [filter, setFilter] = useState("Upcoming");
  const [open, setOpen] = useState<string | null>("1"); // Set home/first event open by default

  // Fetch Predicted Life Events
  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
  } = useQuery<LifeEvent[]>({
    queryKey: ["life-events"],
    queryFn: lifeEventsApi.getLifeEvents,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />

        {/* Events Cards Skeletons */}
        <div className="space-y-4">
          <div className="h-44 bg-slate-200 rounded-3xl" />
          <div className="h-44 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800">Failed to load Life Events</h3>
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
  const events = (eventsData || []).map((e: LifeEvent): MappedLifeEvent => {
    let iconKey = "Heart";
    let tint = "from-[var(--success)]/15 to-[var(--sbi-blue)]/10";
    const titleLower = e.title.toLowerCase();

    if (titleLower.includes("home") || titleLower.includes("purchase")) {
      iconKey = "Home";
      tint = "from-[var(--sbi-blue)]/15 to-[var(--sbi-royal)]/10";
    } else if (
      titleLower.includes("education") ||
      titleLower.includes("school") ||
      titleLower.includes("college")
    ) {
      iconKey = "GraduationCap";
      tint = "from-[var(--gold)]/15 to-[var(--warning)]/10";
    } else if (
      titleLower.includes("trip") ||
      titleLower.includes("vacation") ||
      titleLower.includes("travel")
    ) {
      iconKey = "Plane";
      tint = "from-[var(--success)]/15 to-[var(--sbi-blue)]/10";
    } else if (titleLower.includes("car")) {
      iconKey = "Car";
      tint = "from-[var(--sbi-royal)]/15 to-[var(--sbi-navy)]/10";
    } else if (titleLower.includes("wedding") || titleLower.includes("marriage")) {
      iconKey = "Heart";
      tint = "from-pink-500/15 to-purple-500/10";
    }

    // Dynamic signals simulation
    let signals = ["Income stable", "Budget surplus", "Target allocation"];
    if (iconKey === "Home") {
      signals = [
        "Rising SIP contributions",
        "Property search browsing",
        "Savings velocity",
        "Mortgage rate research",
      ];
    } else if (iconKey === "GraduationCap") {
      signals = [
        "School fee escalation",
        "Education insurance enquiry",
        "Sukanya deposits",
        "Coaching expenses",
      ];
    }

    return {
      id: String(e.id),
      icon: icons[iconKey] || Heart,
      title: e.title,
      when: e.prediction_date,
      confidence: e.confidence,
      readiness: e.readiness_score,
      summary: e.explanation
        ? e.explanation.split(".")[0]
        : "Based on your spending & savings trends.",
      signals,
      reasoning: e.explanation,
      alternatives: e.alternative_options || "Invest in tax-saving ELSS schemes.",
      future: e.future_projection || "You are on track to meet this goal comfortably.",
      tint,
    };
  });

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
        {events.map((e: MappedLifeEvent) => {
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
                        {e.signals.map((s: string) => (
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
