import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { PageHeader, GlassCard } from "@/components/app-shell";
import { settingsApi } from "@/lib/api";
import { Settings } from "../types/api";
import { toast } from "sonner";

function SettingsErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
      <h3 className="font-bold text-red-800">Failed to load Settings</h3>
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

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "Control your privacy, AI preferences, notifications and review preferences.",
      },
      { property: "og:title", content: "Settings — IDBI BANK Life Moments AI" },
      { property: "og:description", content: "Stay in control. Always." },
    ],
  }),
  component: SettingsPage,
  errorComponent: (props) => <SettingsErrorFallback {...props} />,
});

function SettingsPage() {
  const queryClient = useQueryClient();

  // Fetch Settings
  const {
    data: settingsData,
    isLoading,
    error,
    refetch,
  } = useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: settingsApi.getSettings,
  });

  // Update Settings Mutation
  const updateSettingsMutation = useMutation({
    mutationFn: settingsApi.updateSettings,
    onSuccess: () => {
      toast.success("Settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => {
      toast.error("Failed to update settings.");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 w-1/3 bg-slate-200 rounded-2xl" />

        {/* Settings Box Skeleton */}
        <div className="h-[400px] bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800">Failed to load Settings</h3>
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

  const settings = settingsData || {
    language: "English",
    notifications_enabled: true,
    biometrics_enabled: false,
  };

  const handleToggleNotif = (val: boolean) => {
    updateSettingsMutation.mutate({
      language: settings.language,
      notifications_enabled: val,
      biometrics_enabled: settings.biometrics_enabled,
    });
  };

  const handleToggleBiometrics = (val: boolean) => {
    updateSettingsMutation.mutate({
      language: settings.language,
      notifications_enabled: settings.notifications_enabled,
      biometrics_enabled: val,
    });
  };

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
          value={settings.notifications_enabled}
          onToggle={handleToggleNotif}
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
          value={settings.biometrics_enabled}
          onToggle={handleToggleBiometrics}
          rightLabel={settings.biometrics_enabled ? "Active" : "Disabled"}
        />
        <Row
          icon={Languages}
          label="Language"
          sub={`${settings.language} (India)`}
          rightLabel={settings.language}
        />
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
  sub: string;
  toggle?: boolean;
  value?: boolean;
  onToggle?: (v: boolean) => void;
  rightLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border p-4 last:border-0 hover:bg-slate-50/50 transition">
      <div className="flex items-center gap-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="leading-tight text-left">
          <div className="text-sm font-semibold text-[var(--sbi-navy)]">{label}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {rightLabel && (
          <span className="text-xs text-muted-foreground font-medium mr-1">{rightLabel}</span>
        )}
        {toggle ? (
          <button
            onClick={() => onToggle?.(!value)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              value ? "bg-[var(--sbi-blue)]" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                value ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
        )}
      </div>
    </div>
  );
}
