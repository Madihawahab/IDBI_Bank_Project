import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Plane,
  CreditCard,
  Shield,
  Gift,
  ChevronDown,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { TrustBadge, SignalChip, ConfidenceRing, PageHeader } from "@/components/app-shell";

interface MappedOffer {
  id: string;
  icon: LucideIcon;
  title: string;
  headline: string;
  savings: string;
  desc: string;
  why: string;
  eligibility: string;
  signals: string[];
  confidence: number;
  match: string;
  cta: string;
  tint: string;
}
import { offersApi } from "@/lib/api";
import { Offer } from "../types/api";
import { useTranslation } from "@/lib/translations";

function OffersErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
      <h3 className="font-bold text-red-800">Failed to load Offers</h3>
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

export const Route = createFileRoute("/_app/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Rewards — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "Benefits chosen for your life events, goals and eligibility.",
      },
      { property: "og:title", content: "Offers & Rewards — IDBI BANK Life Moments AI" },
      { property: "og:description", content: "Only offers that are relevant — never generic." },
    ],
  }),
  component: OffersPage,
  errorComponent: (props) => <OffersErrorFallback {...props} />,
});

const icons: Record<string, LucideIcon> = {
  Home,
  Plane,
  CreditCard,
  Shield,
  Gift,
};

function OffersPage() {
  const [open, setOpen] = useState<string | null>(null);
  const { t } = useTranslation();

  // Fetch Offers
  const {
    data: offersData,
    isLoading,
    error,
    refetch,
  } = useQuery<Offer[]>({
    queryKey: ["offers"],
    queryFn: offersApi.getOffers,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />

        {/* Offers Cards Skeletons */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="h-48 bg-slate-200 rounded-3xl" />
          <div className="h-48 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800">Failed to load Offers</h3>
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
  const offers = (offersData || []).map((o: Offer): MappedOffer => {
    let iconKey = "Gift";
    let tint = "from-[var(--gold)]/15 to-[var(--warning)]/10";
    const titleLower = o.title.toLowerCase();

    if (titleLower.includes("home") || titleLower.includes("loan")) {
      iconKey = "Home";
      tint = "from-[var(--sbi-blue)]/15 to-[var(--sbi-royal)]/10";
    } else if (titleLower.includes("travel") || titleLower.includes("forex")) {
      iconKey = "Plane";
      tint = "from-[var(--success)]/15 to-[var(--sbi-blue)]/10";
    } else if (titleLower.includes("card") || titleLower.includes("cashback")) {
      iconKey = "CreditCard";
      tint = "from-[var(--gold)]/15 to-[var(--warning)]/10";
    } else if (
      titleLower.includes("insurance") ||
      titleLower.includes("health") ||
      titleLower.includes("cover")
    ) {
      iconKey = "Shield";
      tint = "from-[var(--sbi-blue)]/10 to-[var(--sbi-navy)]/10";
    }

    // Dynamic signals simulation
    let signals = ["Online spend", "Credit history", "Steady salary"];
    if (iconKey === "Home") {
      signals = ["Income stability", "Credit score 812", "Goal: Home 2026", "Low EMI burden"];
    } else if (iconKey === "Plane") {
      signals = ["Flight searches", "Forex top-up", "Visa fee"];
    }

    return {
      id: String(o.id),
      icon: icons[iconKey] || Gift,
      title: o.title,
      headline: o.headline,
      savings: o.savings,
      desc: o.description,
      why: o.reasoning,
      eligibility: o.eligibility,
      signals,
      confidence: o.confidence_score,
      match: `${o.confidence_score}% ${t("offers.match_label", "Match")}`,
      cta: o.cta_text,
      tint,
    };
  });

  return (
    <div>
      <PageHeader
        eyebrow={t("menu.offers")}
        title={t("offers.title")}
        subtitle={t("offers.subtitle")}
        action={
          <button className="rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-medium">
            {t("menu.events_mobile", "For You")}
          </button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {offers.map((o: MappedOffer) => {
          const isOpen = open === o.id;
          return (
            <div
              key={o.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${o.tint}`}
                  >
                    <o.icon className="h-7 w-7 text-[var(--sbi-royal)]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-semibold text-[var(--sbi-navy)]">{o.title}</h3>
                      <TrustBadge />
                    </div>
                    <div className="mt-1 text-sm font-bold text-foreground">{o.headline}</div>
                    <div className="mt-1.5 rounded-xl bg-muted/40 p-2.5">
                      <div className="text-xs text-muted-foreground">{t("offers.estimated_savings", "Estimated savings")}</div>
                      <div className="flex items-baseline gap-1 text-[var(--success)]">
                        <span className="text-lg font-bold">{o.savings}</span>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {o.desc}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <button
                    onClick={() => setOpen(isOpen ? null : o.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--sbi-blue)]"
                  >
                    {isOpen ? t("offers.hide_details") : t("offers.why_seeing")}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <span className="text-xs font-bold text-[var(--sbi-royal)]">{o.match}</span>
                </div>

                {isOpen && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4 text-xs">
                    <div>
                      <div className="font-semibold text-[var(--sbi-navy)]">{t("offers.recommendation")}</div>
                      <p className="mt-1 leading-relaxed text-muted-foreground">{o.why}</p>
                    </div>

                    <div>
                      <div className="font-semibold text-[var(--sbi-navy)]">{t("offers.eligibility")}</div>
                      <p className="mt-1 leading-relaxed text-muted-foreground">{o.eligibility}</p>
                    </div>

                    <div>
                      <div className="mb-1.5 font-semibold text-[var(--sbi-navy)]">
                        {t("offers.signals")}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {o.signals.map((s: string) => (
                          <SignalChip key={s}>{s}</SignalChip>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--sbi-navy)]">{t("offers.match")}</span>
                      <ConfidenceRing value={o.confidence} size={32} />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {t("offers.pre_approved")}
                </span>
                <button className="rounded-full bg-[var(--sbi-blue)] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_-4px_rgba(0,173,239,0.5)] hover:opacity-95">
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
