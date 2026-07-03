import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/app-shell";

export const Route = createFileRoute("/_app/money-mood")({
  head: () => ({
    meta: [
      { title: "Money Mood — SBI Life Moments AI" },
      {
        name: "description",
        content: "Your financial wellness, felt emotionally. Today you're in Calm Mode.",
      },
      { property: "og:title", content: "Money Mood — SBI Life Moments AI" },
      { property: "og:description", content: "Emotional wellness for your finances." },
    ],
  }),
  component: MoodPage,
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
  // big ring
  const size = 280;
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const value = 84;
  const off = c - (value / 100) * c;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sbi-blue)]">
          Money Mood
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--sbi-navy)] sm:text-4xl">
          You are in Calm Mode
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Great job! You're making healthy financial choices this week.
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
            <div className="text-7xl">😊</div>
            <div className="mt-1 text-sm font-semibold text-muted-foreground">Calm Mode</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{value}/100 wellness</div>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mood History
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
            <ThumbsUp className="h-4 w-4" /> Positive Habits
          </div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            <li>• 4 months of consistent SIP top-ups</li>
            <li>• Dining out down 18% vs last month</li>
            <li>• Emergency fund reached 92% of target</li>
          </ul>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--warning)]">
            <ThumbsDown className="h-4 w-4" /> Watch Out
          </div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            <li>• Subscriptions creeping up — ₹4,200/mo</li>
            <li>• Credit utilisation touched 38% briefly</li>
            <li>• 2 impulse purchases over ₹10K this month</li>
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
              <TrendingUp className="h-3 w-3" /> Future You
            </div>
            <div className="mt-1 text-lg font-bold text-[var(--sbi-navy)]">
              Stay in Calm Mode for 3 more months
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              You'll unlock a ₹38,000 buffer and your retirement readiness moves from 64% → 71%.
            </p>
            <button className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sbi-blue)]">
              See how <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
