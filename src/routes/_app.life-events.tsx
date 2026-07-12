import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  X,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/translations";

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
  status: "Upcoming" | "On Track" | "Completed";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("Upcoming");
  const [open, setOpen] = useState<string | null>("1"); // Set first event open by default

  // Add Goal Form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newExplanation, setNewExplanation] = useState("");

  // Recommendation applying state
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  // Simulation sweep rate
  const [sweepRate, setSweepRate] = useState(15000);

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

  const getShiftedDate = (baseMonthIndex: number, rate: number) => {
    // baseMonthIndex is months from July 2024 (July 2024 = 0)
    const baseShift = Math.round((rate - 15000) / 2500); // 2500 per month
    const finalMonthIndex = Math.max(3, baseMonthIndex - baseShift);
    const date = new Date(2024, 6 + finalMonthIndex, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const addGoalMutation = useMutation({
    mutationFn: lifeEventsApi.createLifeEvent,
    onSuccess: () => {
      toast.success("Goal added successfully!");
      setIsAddOpen(false);
      setNewTitle("");
      setNewDate("");
      setNewExplanation("");
      queryClient.invalidateQueries({ queryKey: ["life-events"] });
    },
    onError: () => {
      toast.error("Failed to create goal. Please try again.");
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a goal title.");
      return;
    }
    if (!newDate.trim()) {
      toast.error("Please enter a target date.");
      return;
    }
    addGoalMutation.mutate({
      title: newTitle,
      prediction_date: newDate,
      explanation: newExplanation || "User-defined financial target plan."
    });
  };

  const handleApplyRecommendation = (e: MappedLifeEvent) => {
    setApplyingId(e.id);
    setTimeout(() => {
      setApplyingId(null);
      setAppliedIds(prev => [...prev, e.id]);
      toast.success(`Savings optimization plan applied for "${e.title}"! Auto-sweep and SIP adjustments completed.`);
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["finances"] });
      queryClient.invalidateQueries({ queryKey: ["life-events"] });
    }, 1500);
  };

  const handleTalkToAdvisor = (e: MappedLifeEvent) => {
    const prompt = `I want to discuss my life goal '${e.title}' predicted for ${e.when}. Why is my readiness score at ${e.readiness}% and what specific actions do you recommend to meet it?`;
    sessionStorage.setItem("idbi_pending_prompt", prompt);
    navigate({ to: "/ai-advisor" });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />
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
  const dbEvents = (eventsData || []).map((e: LifeEvent): MappedLifeEvent => {
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

    const isApplied = appliedIds.includes(String(e.id));
    const readiness = isApplied ? 100 : e.confidence;
    const status = isApplied ? "On Track" : (readiness >= 85 ? "On Track" : "Upcoming");

    // Dynamic signals simulation
    let signals = ["Income stable", "Budget surplus", "Target allocation"];
    let baseMonthIndex = 20; // Default Home

    if (iconKey === "Home") {
      baseMonthIndex = 20;
      signals = [
        "Rising SIP contributions",
        "Property search browsing",
        "Savings velocity",
        "Mortgage rate research",
      ];
    } else if (iconKey === "GraduationCap") {
      baseMonthIndex = 26;
      signals = [
        "School fee escalation",
        "Education insurance enquiry",
        "Sukanya deposits",
        "Coaching expenses",
      ];
    } else if (iconKey === "Plane") {
      baseMonthIndex = 25;
    }

    // Shift predicted date dynamically based on sweepRate for upcoming / on track events
    let dynamicWhen = e.prediction_date;
    if (status !== "Completed") {
      dynamicWhen = getShiftedDate(baseMonthIndex, sweepRate);
    }

    return {
      id: String(e.id),
      icon: icons[iconKey] || Heart,
      title: e.title,
      when: dynamicWhen,
      confidence: e.confidence,
      readiness,
      summary: e.explanation
        ? e.explanation.split(".")[0]
        : "Based on your spending & savings trends.",
      signals,
      reasoning: e.explanation,
      alternatives: e.alternative_options || "Invest in tax-saving ELSS schemes.",
      future: e.future_projection || "You are on track to meet this goal comfortably.",
      tint,
      status: status as "Upcoming" | "On Track" | "Completed",
    };
  });

  const completedEvents: MappedLifeEvent[] = [
    {
      id: "comp-1",
      icon: CheckCircle2,
      title: "Emergency Fund Setup",
      when: "Completed: May 2026",
      confidence: 100,
      readiness: 100,
      summary: "You successfully built a 6-month emergency buffer in a Fixed Deposit.",
      signals: ["Emergency FD active", "Auto-sweep configured", "Savings rate sustained"],
      reasoning: "Your savings account and fixed deposit balance successfully crossed your target emergency threshold of ₹4.0L.",
      alternatives: "Keep maintaining this buffer; do not draw down except for unplanned critical emergencies.",
      future: "Your emergency buffer provides solid insulation, allowing you to invest in long-term equity with peace of mind.",
      tint: "from-[var(--success)]/15 to-[var(--sbi-blue)]/10",
      status: "Completed",
    },
    {
      id: "comp-2",
      icon: Car,
      title: "Credit Card Debt Payoff",
      when: "Completed: Jan 2026",
      confidence: 100,
      readiness: 100,
      summary: "Paid off outstanding high-interest balance, optimizing your debt ratio.",
      signals: ["Credit utilization < 30%", "Zero interest paid", "On-time credit card bills"],
      reasoning: "You cleared all credit card balances on time, improving your credit utilization to a healthy 18%.",
      alternatives: "Maintain credit card autopay to avoid future interest costs.",
      future: "Your debt payoff has boosted your credit score, making you eligible for premium loan rates.",
      tint: "from-[var(--sbi-royal)]/15 to-[var(--sbi-navy)]/10",
      status: "Completed",
    }
  ];

  const events = [...dbEvents, ...completedEvents];

  // Filter events based on active tab
  const filteredEvents = events.filter((e) => {
    if (filter === "All Events") return true;
    return e.status === filter;
  });

  return (
    <div>
      <PageHeader
        eyebrow={t("menu.life_events")}
        title={t("life_events.title", "AI predicts. You plan. We partner.")}
        subtitle={t("life_events.subtitle", "Major life moments we see ahead, with the signals we used and the financial readiness to meet them.")}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sbi-blue)] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,173,239,0.6)] transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> {t("life_events.add_event", "Add Goal")}
          </button>
        }
      />

      {/* Interactive What-If Goal Projection Slider */}
      <div className="mb-6 rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] animate-scaleUp">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[var(--sbi-navy)] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[var(--sbi-blue)] animate-pulse" />
              IDBI Wealth Projection Simulator
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drag the slider to adjust your monthly **Auto-Sweep rate** and see how it pulls your life goals forward.
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--sbi-sky)] px-4 py-2 border border-emerald-50/50 flex items-center gap-2 self-start sm:self-auto">
            <div className="text-[10px] font-bold text-muted-foreground uppercase">Projected Sweep</div>
            <div className="text-sm font-bold text-[var(--sbi-royal)]">₹{sweepRate.toLocaleString("en-IN")}/mo</div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max="30000"
              step="2500"
              value={sweepRate}
              onChange={(e) => setSweepRate(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--sbi-blue)] outline-none"
            />
          </div>

          {/* Timeline Nodes track */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="rounded-2xl bg-slate-50/60 p-3 border border-slate-100">
              <div className="text-[9px] font-bold text-slate-400 uppercase">Home Purchase</div>
              <div className="text-xs font-bold text-[var(--sbi-navy)] mt-0.5 transition-all duration-300">
                {getShiftedDate(20, sweepRate)}
              </div>
              <div className="text-[9px] text-green-600 font-semibold mt-1">
                {sweepRate > 15000 ? `${Math.round((sweepRate - 15000) / 2500)} Months Sooner!` : sweepRate === 15000 ? "On Track" : "Delayed Plan"}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50/60 p-3 border border-slate-100">
              <div className="text-[9px] font-bold text-slate-400 uppercase">Europe Vacation</div>
              <div className="text-xs font-bold text-[var(--sbi-navy)] mt-0.5 transition-all duration-300">
                {getShiftedDate(25, sweepRate)}
              </div>
              <div className="text-[9px] text-green-600 font-semibold mt-1">
                {sweepRate > 15000 ? `${Math.round((sweepRate - 15000) / 2500)} Months Sooner!` : sweepRate === 15000 ? "On Track" : "Delayed Plan"}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50/60 p-3 border border-slate-100">
              <div className="text-[9px] font-bold text-slate-400 uppercase">Kids Education</div>
              <div className="text-xs font-bold text-[var(--sbi-navy)] mt-0.5 transition-all duration-300">
                {getShiftedDate(26, sweepRate)}
              </div>
              <div className="text-[9px] text-green-600 font-semibold mt-1">
                {sweepRate > 15000 ? `${Math.round((sweepRate - 15000) / 2500)} Months Sooner!` : sweepRate === 15000 ? "On Track" : "Delayed Plan"}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-emerald-50/20 border border-emerald-100 rounded-2xl px-4 py-3">
            <p className="text-[11px] leading-relaxed text-emerald-800 font-medium">
              {sweepRate > 15000 
                ? `Saving ₹${sweepRate.toLocaleString()} monthly pulls your goals forward by ${Math.round((sweepRate - 15000) / 2500)} months.` 
                : sweepRate === 15000 
                ? "Your current savings schedule matches predicted expectations." 
                : "Reducing your savings schedule will push your target achievement dates further out."
              }
            </p>
            {sweepRate !== 15000 && (
              <button
                onClick={() => {
                  toast.success(`Success! Saved ₹${sweepRate.toLocaleString()}/mo Sweep Schedule in Core Banking.`);
                  setSweepRate(15000);
                }}
                className="rounded-xl bg-[var(--sbi-blue)] px-3 py-1.5 text-[10px] font-bold text-white shadow-md active:scale-95 transition"
              >
                Apply Sweep Schedule
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f) => {
          const filterKeys: Record<string, string> = {
            "All Events": "life_events.all_events",
            "Upcoming": "life_events.upcoming",
            "On Track": "life_events.on_track",
            "Completed": "life_events.completed"
          };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? "bg-[var(--sbi-blue)] text-white shadow-[0_6px_16px_-6px_rgba(0,173,239,0.6)]"
                  : "bg-white text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(filterKeys[f] || f, f)}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-white shadow-[var(--shadow-soft)]">
            <Sparkles className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-[var(--sbi-navy)]">No goals in {filter}</h3>
            <p className="text-sm text-muted-foreground mt-1">There are no life events currently in this category.</p>
          </div>
        ) : (
          filteredEvents.map((e: MappedLifeEvent) => {
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
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          e.status === "Completed"
                            ? "bg-[var(--success)]/10 text-[var(--success)]"
                            : e.status === "On Track"
                            ? "bg-[var(--sbi-blue)]/10 text-[var(--sbi-blue)]"
                            : "bg-[var(--gold)]/10 text-[var(--gold)]"
                        }`}>
                          {e.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Predicted: <span className="font-medium text-foreground">{e.when}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{e.summary}</p>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-muted-foreground">
                            {t("life_events.savings_target", "Financial Readiness")}
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
                        {t("offers.match", "Confidence")}
                      </div>
                      <ConfidenceRing value={e.confidence} size={68} />
                    </div>
                  </div>

                  <button
                    onClick={() => setOpen(isOpen ? null : e.id)}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sbi-blue)]"
                  >
                    {isOpen ? t("offers.hide_details") : t("offers.why_seeing")}
                    <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {isOpen && (
                  <div className="border-t border-border bg-[var(--sbi-sky)]/60 p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("offers.signals", "Observed Signals")}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {e.signals.map((s: string) => (
                            <SignalChip key={s}>{s}</SignalChip>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("offers.recommendation", "Reasoning")}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                          {e.reasoning}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {t("trust_ledger.why_not", "Alternative Possibilities")}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                          {e.alternatives}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--sbi-blue)]">
                          <Sparkles className="h-3 w-3" /> {t("money_mood.future_you", "Future You")}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed">{e.future}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {e.status !== "Completed" && (
                        appliedIds.includes(e.id) ? (
                          <button
                            disabled
                            className="rounded-full bg-emerald-600/10 border border-emerald-600/20 px-4 py-2 text-sm font-semibold text-emerald-600 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="h-4 w-4" /> {t("life_events.applied", "Applied")}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApplyRecommendation(e)}
                            disabled={applyingId === e.id}
                            className="rounded-full bg-[var(--sbi-blue)] px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-50"
                          >
                            {applyingId === e.id ? "Applying..." : t("life_events.apply_rec", "Apply Recommendation")}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handleTalkToAdvisor(e)}
                        className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
                      >
                        {t("life_events.talk_advisor", "Talk to Advisor")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Custom Add Goal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-slate-100 text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-[var(--sbi-navy)]">Add New Life Goal</h2>
            <p className="text-xs text-muted-foreground mt-1">Specify your future milestone to align your financial preparedness track.</p>
            
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dream Home Downpayment, Kids College Fund"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--sbi-blue)]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Date</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dec 2027"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--sbi-blue)]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Explanation / Signal Details</label>
                <textarea
                  placeholder="Why is this goal anticipated, or what signals indicate this?"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-border bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--sbi-blue)]/50"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addGoalMutation.isPending}
                  className="rounded-full bg-[var(--sbi-blue)] px-6 py-2 text-sm font-bold text-white shadow-[0_6px_20px_-8px_rgba(0,173,239,0.6)] hover:opacity-95 disabled:opacity-50"
                >
                  {addGoalMutation.isPending ? "Adding..." : "Add Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
