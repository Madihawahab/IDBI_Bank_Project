import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Plane, CreditCard, Shield, Gift, ChevronDown } from "lucide-react";
import { TrustBadge, SignalChip, ConfidenceRing, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/_app/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Rewards — SBI Life Moments AI" },
      {
        name: "description",
        content: "Benefits chosen for your life events, goals and eligibility.",
      },
      { property: "og:title", content: "Offers & Rewards — SBI Life Moments AI" },
      { property: "og:description", content: "Only offers that are relevant — never generic." },
    ],
  }),
  component: OffersPage,
});

const offers = [
  {
    id: "home",
    icon: Home,
    title: "Pre-approved Home Loan",
    headline: "@ 8.40% p.a.",
    savings: "₹1,24,000",
    desc: "vs your current rate",
    why: "Based on your salary, credit score 812, and stable employment for 3 years.",
    signals: ["Income stability", "Credit score 812", "Goal: Home 2026", "Low EMI burden"],
    confidence: 92,
    match: "92% Match",
    cta: "View Loan",
    tint: "from-[var(--sbi-blue)]/15 to-[var(--sbi-royal)]/10",
  },
  {
    id: "travel",
    icon: Plane,
    title: "International Travel Card",
    headline: "Zero forex markup",
    savings: "₹8,400",
    desc: "saved per ₹1L spent abroad",
    why: "You searched flights to Europe twice and topped up forex last month.",
    signals: ["Flight searches", "Forex top-up", "Visa fee"],
    confidence: 84,
    match: "84% Match",
    cta: "Apply Now",
    tint: "from-[var(--success)]/15 to-[var(--sbi-blue)]/10",
  },
  {
    id: "card",
    icon: CreditCard,
    title: "SBI Cashback Card",
    headline: "5% Cashback",
    savings: "₹18,000",
    desc: "annual cashback at your spend pattern",
    why: "Your online spend is ₹30K/mo — this card pays back 5% vs current 1%.",
    signals: ["Online spend dominant", "On-time payments", "Active shopper"],
    confidence: 88,
    match: "88% Match",
    cta: "Get Card",
    tint: "from-[var(--gold)]/15 to-[var(--warning)]/10",
  },
  {
    id: "ins",
    icon: Shield,
    title: "Top-Up Health Cover",
    headline: "₹15L for ₹220/mo",
    savings: "₹2,640",
    desc: "annual premium vs market average",
    why: "Family floater used ₹2.4L last year — top-up adds runway at a low cost.",
    signals: ["Recent claim", "Family floater", "Age band 30-40"],
    confidence: 81,
    match: "81% Match",
    cta: "Add Cover",
    tint: "from-[var(--sbi-blue)]/10 to-[var(--sbi-navy)]/10",
  },
];

function OffersPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div>
      <PageHeader
        eyebrow="Offers & Rewards"
        title="Built for your moments."
        subtitle="No generic banners — every offer is matched to your life events, goals and eligibility."
        action={
          <button className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-medium">
            For You
          </button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {offers.map((o) => {
          const isOpen = open === o.id;
          return (
            <div
              key={o.id}
              className="overflow-hidden rounded-3xl border border-border bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            >
              <div className={`relative bg-gradient-to-br p-6 ${o.tint}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <o.icon className="h-5 w-5 text-[var(--sbi-royal)]" />
                      </div>
                      <h3 className="text-lg font-bold text-[var(--sbi-navy)]">{o.title}</h3>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">You can save up to</div>
                    <div className="mt-1 text-3xl font-bold text-[var(--sbi-navy)]">
                      {o.savings}
                    </div>
                    <div className="text-xs text-muted-foreground">{o.desc}</div>
                  </div>
                  <ConfidenceRing value={o.confidence} size={56} />
                </div>
              </div>

              <div className="space-y-3 p-5">
                <div className="flex flex-wrap gap-2">
                  <TrustBadge />
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--sbi-blue)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--sbi-royal)]">
                    <Gift className="h-3 w-3" /> {o.match}
                  </span>
                </div>

                <div className="text-sm font-semibold text-foreground">{o.headline}</div>

                <button
                  onClick={() => setOpen(isOpen ? null : o.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--sbi-blue)]"
                >
                  {isOpen ? "Hide why" : "Why this offer?"}
                  <ChevronDown className={`h-3 w-3 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="space-y-2 rounded-2xl bg-[var(--sbi-sky)] p-3 text-sm">
                    <p className="text-foreground/80">{o.why}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {o.signals.map((s) => (
                        <SignalChip key={s}>{s}</SignalChip>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full rounded-full bg-[var(--sbi-blue)] py-2.5 text-sm font-semibold text-white shadow-[0_6px_18px_-6px_rgba(0,173,239,0.6)] transition hover:opacity-95">
                  {o.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
