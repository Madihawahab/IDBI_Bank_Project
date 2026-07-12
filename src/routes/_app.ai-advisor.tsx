import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ChevronDown, Shield, Bot, UserCheck, Mic, MicOff, Volume2, VolumeX, ArrowRightLeft, Lock, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { TrustBadge, SignalChip } from "@/components/app-shell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiAdvisorApi, transactionsApi } from "@/lib/api";
import { useTranslation } from "@/lib/translations";
import { AvatarWidget, AvatarState, AvatarPersona } from "@/components/AvatarWidget";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/ai-advisor")({
  head: () => ({
    meta: [
      { title: "Life Moments Avatar — IDBI BANK Life Moments AI" },
      {
        name: "description",
        content: "Talk to your customer-first AI advisor with explainable, transparent reasoning.",
      },
      { property: "og:title", content: "Life Moments Avatar — IDBI BANK" },
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
    text: "Based on my analysis, you can plan to buy a home by **March 2026**. I suggest setting up an auto-sweep of ₹15,000 to your Fixed Deposit account to build your down payment buffer faster.",
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

const tips = [
  "Setting up an auto-sweep deposit is a great way to earn up to 7.2% yield on your idle savings.",
  "Consider increasing your monthly mutual fund SIP by just 10% to secure your house downpayment 6 months earlier.",
  "Your current credit card utilization is at a healthy 18%. Let's keep it under 30% to maintain your high credit score.",
  "I noticed a 15% increase in your utility bills this month. Would you like to review utility savings options?",
  "Based on your savings velocity of 22%, you can comfortably build a ₹38,000 emergency buffer in 3 months."
];

function AdvisorPage() {
  const { t, lang } = useTranslation();
  const queryClient = useQueryClient();
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
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [avatarPersona, setAvatarPersona] = useState<AvatarPersona>("companion");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  // Action sandbox state
  const [activeAction, setActiveAction] = useState<"sweep" | "sip" | "emergency" | null>("sweep");
  const [actionAmount, setActionAmount] = useState<number>(15000);
  
  // Consent Modal Overlay State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [consentError, setConsentError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-detect sandbox actions from conversation history
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "ai") {
      const text = lastMsg.text.toLowerCase();
      if (text.includes("sweep") || text.includes("fixed deposit")) {
        setActiveAction("sweep");
        setActionAmount(15000);
      } else if (text.includes("sip") || text.includes("mutual fund") || text.includes("invest")) {
        setActiveAction("sip");
        setActionAmount(3000);
      } else if (text.includes("emergency") || text.includes("buffer") || text.includes("vault")) {
        setActiveAction("emergency");
        setActionAmount(38000);
      } else {
        setActiveAction(null);
      }
    }
  }, [messages]);

  // Initialize Speech Recognition (STT)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";

      rec.onstart = () => {
        setIsListening(true);
        setAvatarState("speaking");
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setAvatarState("idle");
      };

      rec.onend = () => {
        setIsListening(false);
        setAvatarState("idle");
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Multilingual Voice Speech synthesis helper (TTS)
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel(); // cancel any active reading
    if (!voiceEnabled) return;

    // Remove markdown symbols for cleaner speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/-(.*?)\n/g, "$1. ")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1");

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Resolve current selected language to TTS locale mapping
    const localeMap: Record<string, string> = {
      English: "en-IN",
      Hindi: "hi-IN",
      Tamil: "ta-IN",
      Telugu: "te-IN",
      Marathi: "mr-IN",
      Gujarati: "gu-IN",
      Bengali: "bn-IN",
      Kannada: "kn-IN",
      Malayalam: "ml-IN",
      Punjabi: "pa-IN",
    };

    const targetLang = localeMap[lang] || "en-US";
    const voices = window.speechSynthesis.getVoices();
    
    // Attempt matching target language
    const langVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes(targetLang.toLowerCase()) ||
        v.lang.toLowerCase().includes(targetLang.split("-")[0])
    );
    const fallbackVoice = voices.find(
      (v) => v.lang.includes("en-IN") || v.lang.includes("en-US")
    );

    utterance.voice = langVoice || fallbackVoice || null;
    if (langVoice) {
      utterance.lang = targetLang;
    }

    utterance.onstart = () => {
      setAvatarState("speaking");
    };
    utterance.onend = () => {
      setAvatarState("idle");
    };
    utterance.onerror = () => {
      setAvatarState("idle");
    };

    window.speechSynthesis.speak(utterance);
  };

  // Click on Avatar Easter Egg
  const handleAvatarClick = () => {
    setAvatarState("celebrating");
    setTimeout(() => {
      setAvatarState("idle");
    }, 1000);

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    speak(`Here is a quick financial tip: ${randomTip}`);
  };

  // Toggle Microphone dictation
  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Save history to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("idbi_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Cancel voice when unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reset Chat Mutation
  const resetChatMutation = useMutation({
    mutationFn: aiAdvisorApi.resetChat,
    onSuccess: () => {
      setMessages([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("idbi_chat_history");
        window.speechSynthesis.cancel();
      }
      setAvatarState("celebrating");
      setActiveAction("sweep");
      setActionAmount(15000);
      setTimeout(() => setAvatarState("idle"), 1500);
    },
  });

  // Transfer execution mutation (real banking transaction)
  const executeTransferMutation = useMutation({
    mutationFn: transactionsApi.transfer,
    onSuccess: (data) => {
      setAvatarState("celebrating");
      toast.success(`Success! Transferred ₹${data.amount.toLocaleString()} securely.`);
      speak(`Excellent Aarav! I have securely processed your transfer of ${data.amount} rupees to ${data.receiver_name}. Your account balances are now fully synchronized.`);
      
      // Invalidate queries so that other tabs like Finances and Dashboard update automatically!
      queryClient.invalidateQueries({ queryKey: ["money-mood"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["userMe"] });

      // Clear the active action
      setActiveAction(null);
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.detail || "Execution failed";
      toast.error(`Transaction failed: ${errorMsg}`);
      speak(`I was unable to complete the transfer due to: ${errorMsg}. Please verify your savings balance.`);
      setAvatarState("idle");
    }
  });

  // Handle Sandbox Trigger (Opens PIN Overlay)
  const handleSandboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (executeTransferMutation.isPending) return;
    setEnteredPin("");
    setConsentError(null);
    setShowConsentModal(true);
  };

  // Confirm PIN Consent Submission
  const handleConsentConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === "1234") {
      setShowConsentModal(false);
      
      let recipientAccount = "";
      let category = "Transfer";

      if (activeAction === "sweep") {
        recipientAccount = "6677889900"; // Fixed Deposit
        category = "Savings Sweep";
      } else if (activeAction === "sip") {
        recipientAccount = "5544332211"; // Investment Account
        category = "SIP Boost";
      } else if (activeAction === "emergency") {
        recipientAccount = "9876542210"; // Salary Account
        category = "Emergency Buffer";
      }

      executeTransferMutation.mutate({
        recipient_account: recipientAccount,
        amount: actionAmount,
        category: category
      });
    } else {
      setConsentError("Incorrect Secure PIN code. Please try again. (Hint: 1234)");
    }
  };

  // Bypass PIN using FaceID Simulation
  const handleBiometricMock = () => {
    setEnteredPin("1234");
    setConsentError(null);
    toast.success("FaceID Verified!");
  };

  // Send Message Mutation
  const chatMutation = useMutation({
    mutationFn: aiAdvisorApi.chat,
    onSuccess: (data) => {
      setIsThinking(false);
      speak(data.reply);
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
      setAvatarState("idle");
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
    setAvatarState("thinking");
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
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
      {/* Top Header */}
      <div className="mb-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <AvatarWidget state={avatarState} persona={avatarPersona} size="sm" className="h-10 w-10 shrink-0" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--sbi-navy)]">
              {t("menu.ai_advisor", "Life Moments Avatar")}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {avatarState === "idle" && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  {t("ai_advisor.subtitle", "Always here to help")}
                </>
              )}
              {avatarState === "thinking" && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--sbi-royal)] animate-ping" />
                  <span className="text-[var(--sbi-royal)] font-medium">Analyzing transactions & forecasting...</span>
                </>
              )}
              {avatarState === "speaking" && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00836c] animate-pulse" />
                  <span className="text-[#00836c] font-medium">Sharing personalized recommendations...</span>
                </>
              )}
              {avatarState === "celebrating" && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-bounce" />
                  <span className="text-green-500 font-semibold">Goal updated successfully!</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => resetChatMutation.mutate()}
          className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium hover:bg-slate-50 transition"
        >
          {t("ai_advisor.reset")}
        </button>
      </div>

      {/* Grid Layout splits screen into Dual Pane on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Interactive Avatar Center (Visible on MD and larger screens) */}
        <div className="hidden md:flex md:col-span-4 flex-col gap-4 rounded-3xl border border-border bg-white p-5 shadow-[var(--shadow-card)] overflow-y-auto">
          <div className="text-center relative">
            <div className="absolute right-0 top-0">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={cn(
                  "p-2 rounded-full border transition active:scale-95",
                  voiceEnabled ? "border-green-200 bg-green-50 text-[var(--success)]" : "border-slate-200 bg-slate-50 text-slate-400"
                )}
                title={voiceEnabled ? "Mute Voice Advice" : "Unmute Voice Advice"}
              >
                {voiceEnabled ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
              </button>
            </div>
            
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">
              Interactive Advisor
            </div>

            <AvatarWidget
              state={avatarState}
              persona={avatarPersona}
              size="lg"
              className="mx-auto my-3"
              onClick={handleAvatarClick}
            />

            {/* Speaking/Thought bubble overlay on the avatar card */}
            <div className="mt-3 relative rounded-2xl bg-[var(--sbi-sky)] px-4 py-3 border border-emerald-50/50 shadow-sm">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--sbi-sky)] rotate-45 border-l border-t border-emerald-50/50" />
              <p className="relative z-10 text-xs font-semibold leading-relaxed text-[var(--sbi-navy)] text-center">
                {avatarState === "idle" && "Hello Aarav! Ask me anything about your finances, or click on my face for a quick financial tip."}
                {avatarState === "thinking" && "Compiling and analyzing real-time financial signals to generate trust-based reasoning..."}
                {avatarState === "speaking" && "Voicing your personalized advisor feedback. Speak back using the microphone button!"}
                {avatarState === "celebrating" && "Woohoo! Applying updates directly into your IDBI secure ledger."}
              </p>
            </div>
          </div>

          <hr className="border-border my-1" />

          {/* Vibe/Persona toggler */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Select Companion Persona
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
              {(["companion", "advisor", "assistant"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setAvatarPersona(p)}
                  className={cn(
                    "rounded-lg py-1.5 text-xs font-bold capitalize transition-all",
                    avatarPersona === p
                      ? "bg-white text-[var(--sbi-navy)] shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC SANDBOX EXECUTION (Bridging Advisory & Action) */}
          {activeAction && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4 animate-scaleUp">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <ArrowRightLeft className="h-4 w-4 text-[var(--sbi-blue)] animate-pulse" />
                AI Execution Sandbox
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                The Avatar has prepared a secure action based on your chat context. Execute it directly into your account:
              </p>
              
              <form onSubmit={handleSandboxSubmit} className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white border border-slate-100 p-2 text-center">
                    <div className="text-[9px] text-muted-foreground uppercase">Source</div>
                    <div className="text-xs font-bold mt-0.5 truncate">Savings Acc</div>
                  </div>
                  <div className="rounded-lg bg-white border border-slate-100 p-2 text-center">
                    <div className="text-[9px] text-muted-foreground uppercase">Destination</div>
                    <div className="text-xs font-bold mt-0.5 truncate">
                      {activeAction === "sweep" && "FD Sweep"}
                      {activeAction === "sip" && "SIP Vault"}
                      {activeAction === "emergency" && "Salary Vault"}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={actionAmount}
                    onChange={(e) => setActionAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-7 pr-3 text-sm font-bold outline-none focus:border-[var(--sbi-blue)]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={executeTransferMutation.isPending}
                  className="w-full rounded-xl bg-gradient-to-r from-[var(--sbi-blue)] to-[var(--sbi-royal)] py-2 text-xs font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50"
                >
                  {executeTransferMutation.isPending ? "Processing..." : "Approve & Execute via IDBI Secure"}
                </button>
              </form>
            </div>
          )}

          {/* Persona Descriptions */}
          <div className="mt-auto rounded-2xl border border-border bg-slate-50/50 p-3">
            <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Vibe Configuration
            </div>
            <div className="text-xs font-semibold text-[var(--sbi-navy)] flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
              {avatarPersona === "companion" && "Friendly Wealth Coach"}
              {avatarPersona === "advisor" && "Executive Financial Planner"}
              {avatarPersona === "assistant" && "Tech Data Assistant"}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
              {avatarPersona === "companion" && "Uses approachable, encouraging coaching strategies optimized for younger and retail banking savers."}
              {avatarPersona === "advisor" && "Focuses on strategic wealth creation, tax optimization, and long-term milestone planning."}
              {avatarPersona === "assistant" && "High-speed analytical outputs with detailed trust parameters, statistics, and graphs."}
            </p>
          </div>
        </div>

        {/* Right Column: Chat Feed & Inputs */}
        <div className="col-span-1 md:col-span-8 flex flex-col h-full bg-slate-50/20 rounded-3xl border border-border p-4 overflow-hidden">
          {/* Scrollable Conversation Stream */}
          <div className="flex-1 space-y-5 overflow-y-auto px-1 pb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "user" ? (
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[var(--sbi-blue)] px-4 py-3 text-sm font-medium text-white shadow-[0_6px_20px_-8px_rgba(0,173,239,0.6)]">
                    {m.text}
                  </div>
                ) : (
                  <div className="flex w-full max-w-[92%] gap-3">
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
                              <UserCheck className="h-3 w-3" /> {t("settings.human_review", "RM Review Required")}
                            </div>
                          )}

                          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <Stat
                              label={t("offers.match", "Confidence")}
                              value={`${m.detailed.confidence}%`}
                              tone="success"
                            />
                            <Stat label={t("offers.signals", "Signals")} value={`${m.detailed.signals.length}`} tone="blue" />
                            <Stat label={t("trust_ledger.why_not", "Alternatives")} value="2" tone="blue" />
                            <Stat label={t("trust_ledger.trust_score", "Trust")} value="High" tone="success" />
                          </div>

                          <button
                            onClick={() => setExpanded(expanded === i ? null : i)}
                            className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--sbi-blue)]"
                          >
                            {expanded === i ? t("offers.hide_details") : t("offers.why_seeing")}
                            <ChevronDown
                              className={`h-3 w-3 transition ${expanded === i ? "rotate-180" : ""}`}
                            />
                          </button>

                          {expanded === i && (
                            <div className="mt-3 space-y-3 rounded-2xl bg-[var(--sbi-sky)] p-4">
                              <Section title={t("offers.signals", "Observed Signals")}>
                                <div className="flex flex-wrap gap-1.5">
                                  {m.detailed.signals.map((s) => (
                                    <SignalChip key={s}>{s}</SignalChip>
                                  ))}
                                </div>
                              </Section>
                              <Section title={t("offers.recommendation", "Reasoning")}>
                                <p className="text-sm text-foreground/80">{m.detailed.reasoning}</p>
                              </Section>
                              <Section title={t("trust_ledger.why_not", "Alternative Possibilities")}>
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

          {/* Quick Suggestions & Input Controls */}
          <div className="rounded-3xl border border-border bg-white p-3 shadow-[var(--shadow-card)] shrink-0 mt-2">
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
              {recognitionRef.current && (
                <button
                  onClick={toggleListen}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition active:scale-95",
                    isListening
                      ? "border-red-200 bg-red-50 text-red-500 animate-pulse"
                      : "border-border hover:bg-muted text-muted-foreground"
                  )}
                  title={isListening ? "Stop listening" : "Start voice dictation"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
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
                placeholder={t("ai_advisor.placeholder", "Ask me anything about your finances...")}
                rows={1}
                className="flex-1 rounded-2xl bg-muted/50 px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[var(--sbi-blue)]/30 resize-none max-h-24 overflow-y-auto disabled:opacity-50"
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
      </div>

      {/* IDBI SECURE TRANSACTION CONSENT MODAL (PIN OVERLAY) */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)] animate-scaleUp">
            <div className="flex justify-center mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Lock className="h-6 w-6" />
              </div>
            </div>

            <h3 className="text-center text-lg font-bold text-[var(--sbi-navy)]">
              IDBI Transaction Security
            </h3>
            <p className="text-center text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Verify your identity to authorize a transaction of <strong className="text-emerald-700">₹{actionAmount.toLocaleString()}</strong>.
            </p>

            <form onSubmit={handleConsentConfirm} className="mt-4 space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => {
                    setConsentError(null);
                    setEnteredPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                  }}
                  placeholder="Enter 4-Digit Secure PIN"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-center text-sm font-bold tracking-[0.4em] outline-none focus:border-[var(--sbi-blue)] focus:bg-white"
                  required
                />
              </div>

              {consentError && (
                <div className="flex gap-2 rounded-xl bg-red-50 p-2.5 text-[10px] font-semibold text-red-600 border border-red-100">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{consentError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleBiometricMock}
                  className="rounded-xl border border-border bg-white py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition active:scale-95"
                >
                  Verify FaceID
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[var(--sbi-blue)] to-[var(--sbi-royal)] py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
                >
                  Confirm PIN
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition mt-1"
              >
                Cancel Authorization
              </button>
            </form>
          </div>
        </div>
      )}
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
