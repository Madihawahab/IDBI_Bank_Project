import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ChevronDown, Shield, Bot, UserCheck } from "lucide-react";
import { TrustBadge, SignalChip } from "@/components/app-shell";
import { useMutation } from "@tanstack/react-query";
import { aiAdvisorApi } from "@/lib/api";

export const Route = createFileRoute("/_app/ai-advisor")({
  head: () => ({
    meta: [
      { title: "AI Advisor — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "Talk to your customer-first AI advisor with explainable, transparent reasoning.",
      },
      { property: "og:title", content: "AI Advisor — IDBI BANK Life Moments AI" },
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
        "₹4.82L current balance",
        "Savings rate trending up 14% YoY",
        "Stable income — 3 yrs same employer",
        "Existing EMIs under 22% of income",
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
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("idbi_chat_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return seed;
        }
      }
    }
    return seed;
  });
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState<number | null>(1);
  const [isThinking, setIsThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Save history to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("idbi_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Reset Chat Mutation
  const resetChatMutation = useMutation({
    mutationFn: aiAdvisorApi.resetChat,
    onSuccess: () => {
      setMessages([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("idbi_chat_history");
      }
    },
  });

  // Send Message Mutation
  const chatMutation = useMutation({
    mutationFn: aiAdvisorApi.chat,
    onSuccess: (data) => {
      setIsThinking(false);
      setMessages((m) => {
        const newMessages: Msg[] = [
          ...m,
          {
            role: "ai",
            text: data.reply,
            detailed: data.detailed || undefined,
          },
        ];
        // Auto-expand reasoning for the new response
        setExpanded(newMessages.length - 1);
        return newMessages;
      });
    },
    onError: (err) => {
      setIsThinking(false);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "I'm having trouble connecting to my intelligence base right now. Please try again in a few moments.",
        },
      ]);
    },
  });

  const send = (text: string) => {
    if (!text.trim() || chatMutation.isPending || isThinking) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setIsThinking(true);
    chatMutation.mutate(text);
  };

  // Auto-send pending prompt from dashboard if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pending = sessionStorage.getItem("idbi_pending_prompt");
      if (pending) {
        sessionStorage.removeItem("idbi_pending_prompt");
        send(pending);
      }
    }
  }, []);

  const renderMarkdown = (text: string) => {
    const html = text.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-[var(--sbi-navy)] font-bold">$1</strong>',
    );

    const lines = html.split("\n");
    let inList = false;
    const processedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.substring(2);
        let prefix = "";
        if (!inList) {
          inList = true;
          prefix = '<ul class="list-disc pl-5 my-1.5 space-y-1">';
        }
        return `${prefix}<li>${content}</li>`;
      } else {
        let suffix = "";
        if (inList) {
          inList = false;
          suffix = "</ul>";
        }
        return `${suffix}${line}`;
      }
    });

    if (inList) {
      processedLines.push("</ul>");
    }

    return processedLines.join("\n");
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
        <button
          onClick={() => resetChatMutation.mutate()}
          className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium hover:bg-slate-50 transition"
        >
          Reset Chat
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
                      __html: renderMarkdown(m.text),
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
                        <span className="text-[10px] text-muted-foreground">Just now</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="flex w-full max-w-[88%] gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--sbi-blue)]/20 to-[var(--sbi-royal)]/20 animate-pulse">
                <Sparkles className="h-4 w-4 text-[var(--sbi-royal)] animate-spin" />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-sm border border-border bg-slate-50/50 p-4 shadow-[var(--shadow-soft)] max-w-xs">
                <div className="flex space-x-1.5 items-center py-1">
                  <div
                    className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="rounded-3xl border border-border bg-white p-3 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={chatMutation.isPending || isThinking}
              className="whitespace-nowrap rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            disabled={chatMutation.isPending || isThinking}
            placeholder="Ask me anything about your finances..."
            rows={1}
            className="flex-1 rounded-2xl bg-muted/50 px-4 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--sbi-blue)]/30 resize-none max-h-24 overflow-y-auto disabled:opacity-50"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || chatMutation.isPending || isThinking}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--sbi-blue)] text-white shadow-[0_8px_20px_-6px_rgba(0,173,239,0.6)] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
