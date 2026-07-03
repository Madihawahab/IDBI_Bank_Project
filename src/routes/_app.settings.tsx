import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Lock,
  Bot,
  Bell,
  Palette,
  Languages,
  Link2,
  Gauge,
  UserCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { PageHeader, GlassCard } from "@/components/app-shell";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SBI Life Moments AI" },
      {
        name: "description",
        content: "Control your privacy, AI preferences, notifications and review preferences.",
      },
      { property: "og:title", content: "Settings — SBI Life Moments AI" },
      { property: "og:description", content: "Stay in control. Always." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [throttle, setThrottle] = useState(true);
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Settings"
        title="Stay in control."
        subtitle="Privacy, AI, notifications — all on your terms."
      />

      <GlassCard className="p-0">
        <Row icon={User} label="Profile & Preferences" sub="Name, contact, photo" />
        <Row icon={Lock} label="Privacy & Consent" sub="Manage data sharing" />
        <Row icon={Bot} label="AI Preferences" sub="Choose how proactive the AI is" />
        <Row
          icon={Bell}
          label="Notifications"
          sub="Push, email and SMS"
          toggle
          value={notif}
          onToggle={setNotif}
        />
        <Row icon={Link2} label="Connected Accounts" sub="HDFC, Axis, Karvy" />
        <Row
          icon={UserCheck}
          label="Human Review Preferences"
          sub="When should an advisor weigh in?"
        />
        <Row
          icon={Gauge}
          label="Self-Throttling (AI)"
          sub="AI quiets down when you ignore suggestions"
          toggle
          value={throttle}
          onToggle={setThrottle}
          rightLabel="Adaptive"
        />
        <Row
          icon={Palette}
          label="Theme"
          sub="Light · Dark · System"
          toggle
          value={dark}
          onToggle={setDark}
          rightLabel={dark ? "Dark" : "Light"}
        />
        <Row icon={Languages} label="Language" sub="English (India)" rightLabel="English" />
      </GlassCard>

      <div className="mt-6 rounded-3xl border border-[var(--sbi-blue)]/20 bg-[var(--sbi-blue)]/5 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--sbi-blue)] text-white">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-[var(--sbi-navy)]">Self-Throttling is active</div>
            <p className="mt-1 text-sm text-muted-foreground">
              You've ignored 3 SIP nudges this month — the AI will reduce frequency until you engage
              again. You can override anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  sub,
  toggle,
  value,
  onToggle,
  rightLabel,
}: {
  icon: LucideIcon;
  label: string;
  sub?: string;
  toggle?: boolean;
  value?: boolean;
  onToggle?: (v: boolean) => void;
  rightLabel?: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--sbi-blue)]/10 text-[var(--sbi-royal)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{label}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
      {toggle ? (
        <div className="flex items-center gap-2">
          {rightLabel && (
            <span className="text-xs font-medium text-muted-foreground">{rightLabel}</span>
          )}
          <button
            onClick={() => onToggle?.(!value)}
            className={`relative h-6 w-11 rounded-full transition ${value ? "bg-[var(--sbi-blue)]" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${value ? "left-5" : "left-0.5"}`}
            />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {rightLabel && (
            <span className="text-xs font-medium text-muted-foreground">{rightLabel}</span>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
