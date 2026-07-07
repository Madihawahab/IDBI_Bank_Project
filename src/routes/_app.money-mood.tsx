import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, TrendingUp, ThumbsUp, ThumbsDown, ArrowRight, AlertCircle, X, Loader2, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/app-shell";
import { useQuery } from "@tanstack/react-query";
import { moneyMoodApi } from "@/lib/api";
import { MoneyMood } from "../types/api";
import { useTranslation } from "@/lib/translations";

function MoneyMoodErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
      <h3 className="font-bold text-red-800">Failed to load Money Mood</h3>
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

export const Route = createFileRoute("/_app/money-mood")({
  head: () => ({
    meta: [
      { title: "Money Mood — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "Your financial wellness, felt emotionally. Today you're in Calm Mode.",
      },
      { property: "og:title", content: "Money Mood — IDBI BANK Life Moments AI" },
      { property: "og:description", content: "Emotional wellness for your finances." },
    ],
  }),
  component: MoodPage,
  errorComponent: (props) => <MoneyMoodErrorFallback {...props} />,
});

const days = [
  { d: "M", v: 70 },
  { d: "T", v: 60 },
  { d: "W", v: 75 },
  { d: "T", v: 85 },
  { d: "F", v: 80 },
  { d: "S", v: 88 },
  { d: "S", v: 92 },
];

function MoodPage() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [explanation, setExplanation] = useState<{ why: string; how: string[] } | null>(null);
  const [explLoading, setExplLoading] = useState(false);
  const [explError, setExplError] = useState<string | null>(null);

  const fetchExplanation = async () => {
    setExplLoading(true);
    setExplError(null);
    try {
      const res = await moneyMoodApi.explainFutureYou();
      setExplanation(res);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("idbi_future_you_explanation", JSON.stringify(res));
      }
    } catch (err: any) {
      setExplError(err.message || "Failed to load dynamic explanation.");
    } finally {
      setExplLoading(false);
    }
  };

  const handleSeeHowClick = () => {
    setModalOpen(true);
    if (!explanation) {
      if (typeof window !== "undefined") {
        const cached = sessionStorage.getItem("idbi_future_you_explanation");
        if (cached) {
          try {
            setExplanation(JSON.parse(cached));
            return;
          } catch (e) {
            // ignore
          }
        }
      }
      fetchExplanation();
    }
  };

  // Query Money Mood
  const { data, isLoading, error, refetch } = useQuery<MoneyMood>({
    queryKey: ["money-mood"],
    queryFn: moneyMoodApi.getMoneyMood,
  });

  const size = 280;
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl mx-auto" />

        {/* Big circular wheel skeleton */}
        <div className="h-64 w-64 bg-slate-200 rounded-full mx-auto my-6" />

        {/* Graph skeleton */}
        <div className="h-44 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800">Failed to load Money Mood</h3>
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

  const value = data?.mood_score ?? 88;
  const off = c - (value / 100) * c;
  const label = data?.mood_label ?? "Calm Mode";
  const insight = data?.personalized_insight ?? "Great job! You're making healthy financial choices this week.";
  const emoji = label === "Calm Mode" ? "😊" : label === "Balanced Mode" ? "🙂" : "😐";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sbi-blue)]">
          {t("menu.money_mood")}
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--sbi-navy)] sm:text-4xl">
          {t("money_mood.title")} {label === "Calm Mode" ? t("money_mood.stay_calm", "Calm Mode") : label}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          {insight}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--success)]/10 to-[var(--sbi-blue)]/10 blur-2xl" />
          <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="rgba(0,200,83,0.12)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="var(--success)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={off}
              style={{ transition: "stroke-dashoffset 1000ms ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-7xl">{emoji}</div>
            <div className="mt-1 text-sm font-semibold text-muted-foreground">{label === "Calm Mode" ? t("money_mood.stay_calm", "Calm Mode") : label}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{value}/100 {t("money_mood.wellness")}</div>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("money_mood.history")}
        </div>
        <div className="flex h-32 items-end gap-3">
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="text-lg">{d.v > 85 ? "😊" : d.v > 70 ? "🙂" : "😐"}</div>
              <div className="w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="rounded-full bg-gradient-to-t from-[var(--success)] to-[var(--sbi-blue)]"
                  style={{ height: `${(d.v / 100) * 70}px`, minHeight: 6 }}
                />
              </div>
              <div className="text-[11px] font-medium text-muted-foreground">{d.d}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--success)]">
            <ThumbsUp className="h-4 w-4" /> {t("money_mood.positive_habits")}
          </div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            {data?.positive_habits?.map((h: string, i: number) => (
              <li key={i}>• {h}</li>
            )) || (
              <>
                <li>• 4 months of consistent SIP top-ups</li>
                <li>• Dining out down 18% vs last month</li>
                <li>• Emergency fund reached 92% of target</li>
              </>
            )}
          </ul>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--warning)]">
            <ThumbsDown className="h-4 w-4" /> {t("money_mood.watch_out")}
          </div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            {data?.watch_out?.map((w: string, i: number) => (
              <li key={i}>• {w}</li>
            )) || (
              <>
                <li>• Subscriptions creeping up — ₹4,200/mo</li>
                <li>• Credit utilisation touched 38% briefly</li>
                <li>• 2 impulse purchases over ₹10K this month</li>
              </>
            )}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="bg-gradient-to-br from-[var(--sbi-blue)]/5 to-white">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--sbi-blue)] to-[var(--sbi-royal)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--sbi-blue)]">
              <TrendingUp className="h-3 w-3" /> {t("money_mood.future_you")}
            </div>
            <div className="mt-1 text-lg font-bold text-[var(--sbi-navy)]">
              {data?.future_you_title ?? `${t("money_mood.stay_calm")} for 3 more months`}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {data?.future_you_desc ?? "You'll unlock a ₹38,000 buffer and your retirement readiness moves from 64% → 71%."}
            </p>
            <button
              onClick={handleSeeHowClick}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sbi-blue)] cursor-pointer hover:underline hover:opacity-85 transition-all"
            >
              {t("offers.why_seeing", "See how")} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </GlassCard>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md animate-[scaleUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)] dark:bg-slate-900/95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--sbi-blue)] to-[var(--sbi-royal)]">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-[var(--sbi-navy)] dark:text-white">
                  {t("money_mood.future_you")} Strategy
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-2 max-h-[60vh] scrollbar-thin">
              {explLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-[var(--sbi-blue)]" />
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    Analyzing financial status and generating personalized advice...
                  </p>
                </div>
              ) : explError ? (
                <div className="rounded-2xl bg-red-50 p-4 text-center dark:bg-red-950/20">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    {explError}
                  </p>
                  <button
                    onClick={fetchExplanation}
                    className="mt-3 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : explanation ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--sbi-blue)] mb-1.5">
                      {t("offers.why_seeing", "Why it matters")}
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {explanation.why}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--sbi-blue)] mb-2">
                      {t("life_events.apply_rec", "How to achieve it")}
                    </h4>
                    <ul className="space-y-2.5">
                      {explanation.how.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                           <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[var(--success)] mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full bg-[var(--sbi-blue)] px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-[var(--sbi-royal)] transition-all cursor-pointer"
              >
                {t("life_events.applied", "Got it")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
