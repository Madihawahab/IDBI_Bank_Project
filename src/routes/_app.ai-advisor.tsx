import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ChevronDown, Shield, Bot, UserCheck } from "lucide-react";
import { TrustBadge, SignalChip } from "@/components/app-shell";

export const Route = createFileRoute("/_app/ai-advisor")({
  head: () => ({
    meta: [
      { title: "AI Advisor — SBI Life Moments AI" },
      {
        name: "description",
        content: "Talk to your customer-first AI advisor with explainable, transparent reasoning.",
      },
      { property: "og:title", content: "AI Advisor — SBI Life Moments AI" },
      {
        property: "og:description",
        content: "Explainable, customer-first AI for your financial life.",
      },
    ],
  }),
  component: AdvisorPage,
});

type Msg = {
  role: "user" | "ai";
  text: string;
  detailed?: {
    signals: string[];
    reasoning: string;
    alternatives: string;
    confidence: number;
    humanReview?: boolean;
  };
};

const seed: Msg[] = [
  { role: "user", text: "When can I buy a home?" },
  {
    role: "ai",
    text: "Based on my analysis, you can plan to buy a home by **March 2026**.",
    detailed: {
      signals: [
        "₹5.2L saved of ₹6L down payment target",
        "Savings rate trending up 14% YoY",
        "Stable income — 3 yrs same employer",
        "Existing EMIs under 22% of income",
        "Active property browsing on partner sites",
      ],
      reasoning:
        "Your savings velocity, low debt load, and stable income create a comfortable runway. By Mar 2026 you'd cover the down payment plus 6 months of EMI buffer.",
      alternatives:
        "Delay 6 months and lock a lower mortgage rate (forecasted), or buy earlier with parental co-applicant for higher loan eligibility.",
      confidence: 92,
    },
  },
];

const suggestions = [
  "Should I increase my SIP?",
  "Best home loan for me?",
  "Can I afford a Europe trip?",
  "Plan my retirement",
];

function AdvisorPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState<number | null>(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const isHighRisk = /loan|home|invest|retire/i.test(text);
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "ai",
        text: `Here's my read on **"${text.trim()}"** — based on your transaction patterns and goals.`,
        detailed: {
          signals: [
            "Income stability",
            "Recent spend trend",
            "Goal: Home by 2026",
            "Liquidity buffer ₹2.4L",
          ],
          reasoning:
            "Your cash flow supports this decision with a moderate buffer. The trade-off is opportunity cost on long-term equity returns.",
          alternatives:
            "A more conservative path: phase the change over 3 months. An aggressive path: act now and rebalance quarterly.",
          confidence: 84,
          humanReview: isHighRisk,
        },
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col lg:h-[calc(100vh-7rem)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--sbi-blue)] to-[var(--sbi-royal)] shadow-[0_6px_16px_-4px_rgba(0,85,165,0.5)]">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--sbi-navy)]">AI Advisor</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              Always here to help
            </div>
          </div>
        </div>
        <button className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium">
          New Chat
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-1 pb-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "user" ? (
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[var(--sbi-blue)] px-4 py-3 text-sm font-medium text-white shadow-[0_6px_20px_-8px_rgba(0,173,239,0.6)]">
                {m.text}
              </div>
            ) : (
              <div className="flex w-full max-w-[88%] gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--sbi-blue)]/20 to-[var(--sbi-royal)]/20">
                  <Sparkles className="h-4 w-4 text-[var(--sbi-royal)]" />
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm border border-border bg-white p-4 shadow-[var(--shadow-soft)]">
                  <p
                    className="text-sm leading-relaxed text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: m.text.replace(
                        /\*\*(.+?)\*\*/g,
                        '<strong class="text-[var(--sbi-navy)]">$1</strong>',
                      ),
                    }}
                  />

                  {m.detailed && (
                    <>
                      {m.detailed.humanReview && (
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--warning)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--warning)]">
                          <UserCheck className="h-3 w-3" /> Requires Relationship Manager Review
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <Stat
                          label="Confidence"
                          value={`${m.detailed.confidence}%`}
                          tone="success"
                        />
                        <Stat label="Signals" value={`${m.detailed.signals.length}`} tone="blue" />
                        <Stat label="Alternatives" value="2" tone="blue" />
                        <Stat label="Trust" value="High" tone="success" />
                      </div>

                      <button
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--sbi-blue)]"
                      >
                        {expanded === i ? "Hide reasoning" : "Show reasoning"}
                        <ChevronDown
                          className={`h-3 w-3 transition ${expanded === i ? "rotate-180" : ""}`}
                        />
                      </button>

                      {expanded === i && (
                        <div className="mt-3 space-y-3 rounded-2xl bg-[var(--sbi-sky)] p-4">
                          <Section title="Observed Signals">
                            <div className="flex flex-wrap gap-1.5">
                              {m.detailed.signals.map((s) => (
                                <SignalChip key={s}>{s}</SignalChip>
                              ))}
                            </div>
                          </Section>
                          <Section title="Reasoning">
                            <p className="text-sm text-foreground/80">{m.detailed.reasoning}</p>
                          </Section>
                          <Section title="Alternative Possibilities">
                            <p className="text-sm text-foreground/80">{m.detailed.alternatives}</p>
                          </Section>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <TrustBadge />
                        <span className="text-[10px] text-muted-foreground">10:31 AM</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="rounded-3xl border border-border bg-white p-3 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="whitespace-nowrap rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask me anything about your finances..."
            className="flex-1 rounded-full bg-muted/50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--sbi-blue)]/30"
          />
          <button
            onClick={() => send(input)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sbi-blue)] text-white shadow-[0_8px_20px_-6px_rgba(0,173,239,0.6)] transition hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "success" | "blue" }) {
  const color = tone === "success" ? "var(--success)" : "var(--sbi-royal)";
  return (
    <div className="rounded-xl border border-border bg-white px-3 py-2">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}
