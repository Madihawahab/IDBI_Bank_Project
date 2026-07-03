import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Globe,
  Menu,
  X,
  ArrowRight,
  Shield,
  Brain,
  UserCheck,
  Zap,
  Activity,
  Compass,
  FileCheck2,
  Lock,
  Heart,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SBI Life Moments AI — The Bank that Understands Your Life" },
      {
        name: "description",
        content:
          "SBI Life Moments AI understands your financial behaviour, predicts important life events, and provides proactive guidance before you even ask.",
      },
    ],
  }),
  component: LandingPage,
});

function SbiLogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} text-[#0055A5]`} fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3.5" fill="white" />
      <rect x="11" y="12" width="2" height="10" fill="white" />
    </svg>
  );
}

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7FBFF] text-[#1B1464] font-sans overflow-x-hidden selection:bg-[#00adef]/20">
      
      {/* 3. Hero Background (Mesh, Grid, Radial gradients) */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        {/* Extremely light dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#00adef05_1px,transparent_1px)] [background-size:32px_32px] opacity-75" />
        
        {/* Soft radial gradients */}
        <div className="absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,173,239,0.04),transparent_65%)]" />
        <div className="absolute top-[20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,85,165,0.03),transparent_65%)]" />
        <div className="absolute bottom-[10%] right-[-5%] h-[900px] w-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,173,239,0.03),transparent_65%)]" />
        
        {/* Tiny floating particle animations */}
        <div className="absolute top-[15%] left-[20%] h-1.5 w-1.5 rounded-full bg-[#00ADEF]/25 animate-[pulse_3s_infinite]" />
        <div className="absolute top-[45%] right-[25%] h-2 w-2 rounded-full bg-[#0055A5]/15 animate-[pulse_4s_infinite_delay-1s]" />
        <div className="absolute bottom-[35%] left-[15%] h-1 w-1 rounded-full bg-[#00ADEF]/20 animate-[pulse_2.5s_infinite_delay-2s]" />
      </div>

      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md py-4 shadow-[0_2px_20px_-10px_rgba(27,20,100,0.08)] border-b border-slate-100"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-3">
            <SbiLogoIcon className="h-8 w-8" />
            <div className="leading-tight text-left">
              <div className="text-lg font-bold tracking-tight text-[#1B1464]">SBI</div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Life Moments
                </span>
                <span className="rounded bg-[#00adef]/10 px-1 py-0.2 text-[8px] font-bold text-[#00adef] border border-[#00adef]/20 uppercase">
                  AI
                </span>
              </div>
            </div>
          </a>

          {/* Links Center */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-[14px] font-medium text-slate-600 hover:text-[#0055A5] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-[14px] font-medium text-slate-600 hover:text-[#0055A5] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("trust")}
              className="text-[14px] font-medium text-slate-600 hover:text-[#0055A5] transition-colors"
            >
              Trust
            </button>
            <button
              onClick={() => scrollToSection("why-us")}
              className="text-[14px] font-medium text-slate-600 hover:text-[#0055A5] transition-colors"
            >
              About
            </button>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-slate-600 hover:text-[#1B1464] cursor-pointer transition-colors">
              <Globe className="h-4.5 w-4.5" />
              <span className="text-[13px] font-semibold">EN</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </div>
            <Link
              to="/login"
              className="rounded-full bg-[#0055A5] px-5 py-2 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(0,85,165,0.12)] transition-all hover:bg-[#00adef] hover:translate-y-[-1px] hover:shadow-[0_6px_16px_rgba(0,173,239,0.2)] active:translate-y-0"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white"
          >
            {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Mobile menu modal */}
        {isMobileMenuOpen && (
          <div className="absolute top-[64px] left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-[slideUpNav_0.2s_ease-out]">
            <button
              onClick={() => scrollToSection("features")}
              className="text-left py-2 text-sm font-semibold text-slate-600 border-b border-slate-50"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-left py-2 text-sm font-semibold text-slate-600 border-b border-slate-50"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("trust")}
              className="text-left py-2 text-sm font-semibold text-slate-600 border-b border-slate-50"
            >
              Trust
            </button>
            <button
              onClick={() => scrollToSection("why-us")}
              className="text-left py-2 text-sm font-semibold text-slate-600 border-b border-slate-50"
            >
              About
            </button>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Globe className="h-4.5 w-4.5" />
                <span className="text-[13px] font-semibold">EN (English)</span>
              </div>
            </div>
            <Link
              to="/login"
              className="mt-3 block text-center rounded-2xl bg-[#0055A5] py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,85,165,0.12)]"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col md:flex-row items-center gap-12 md:gap-8">
        
        {/* Hero Left Side */}
        <div className="flex-1 flex flex-col items-start text-left max-w-xl animate-[slideUpHero_0.7s_ease-out_forwards]">
          {/* Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00adef]/10 border border-[#00adef]/20 px-3.5 py-1 text-[11px] font-bold tracking-[0.14em] text-[#00adef] uppercase mb-8">
            <span className="text-[10px]">✦</span> AI-FIRST BANKING
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B1464] leading-[1.08] mb-4">
            The bank that{" "}
            <span className="bg-gradient-to-r from-[#0055A5] via-[#00ADEF] to-[#0055A5] bg-clip-text text-transparent bg-[size:200%] animate-[gradientShift_6s_linear_infinite] inline-block font-extrabold">
              understands
            </span>{" "}
            your life before you ask.
          </h1>

          {/* Supporting line */}
          <p className="text-lg sm:text-xl font-medium tracking-tight text-[#0055A5]/80 mb-6">
            Powered by Explainable AI, built on trust, designed for people.
          </p>

          {/* Short paragraph */}
          <p className="text-base text-slate-500 font-normal leading-relaxed mb-8 max-w-md">
            SBI Life Moments AI understands your financial behaviour, predicts important life events, and provides proactive guidance before you even ask.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-8">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0055A5] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(0,85,165,0.15)] transition-all hover:bg-[#00adef] hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(0,173,239,0.25)] active:translate-y-0 group"
            >
              Get Started
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-[15px] font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:translate-y-[-1px] active:translate-y-0"
            >
              See AI in Action
            </button>
          </div>

          {/* Trust strip (Beneath CTA) */}
          <div className="flex items-center gap-5 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="text-[#00C853] text-[14px]">✓</span> Secure
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#00C853] text-[14px]">✓</span> Private
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#00C853] text-[14px]">✓</span> Built by SBI
            </span>
          </div>
        </div>

        {/* Hero Right Side - AI Intelligence Engine */}
        <div className="flex-1 w-full flex items-center justify-center relative min-h-[380px] sm:min-h-[460px] animate-[fadeInHero_0.9s_ease-out_forwards]">
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
            
            {/* Concentric orbital rings */}
            <div className="absolute rounded-full border border-slate-200/30 w-[140px] h-[140px] animate-[pulse_4s_infinite]" />
            <div className="absolute rounded-full border border-dashed border-slate-200/50 w-[240px] h-[240px] animate-[spin_60s_linear_infinite]" />
            <div className="absolute rounded-full border border-dotted border-slate-300/40 w-[340px] h-[340px] animate-[spin_120s_linear_infinite_reverse]" />

            {/* Glowing background circles behind center */}
            <div className="absolute w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,173,239,0.12),transparent_70%)] animate-[pulse_3s_infinite]" />
            <div className="absolute w-[80px] h-[80px] rounded-full bg-[#0055A5]/10 blur-xl animate-[pulse_2.5s_infinite]" />

            {/* Orbit paths connectors (Subtle SVG Network lines) */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-[0.25] pointer-events-none">
              <line x1="50" y1="50" x2="35" y2="18" stroke="#0055A5" strokeWidth="0.25" strokeDasharray="1" />
              <line x1="50" y1="50" x2="68" y2="24" stroke="#0055A5" strokeWidth="0.25" strokeDasharray="1" />
              <line x1="50" y1="50" x2="20" y2="52" stroke="#0055A5" strokeWidth="0.25" strokeDasharray="1" />
              <line x1="50" y1="50" x2="80" y2="48" stroke="#0055A5" strokeWidth="0.25" strokeDasharray="1" />
              <line x1="50" y1="50" x2="32" y2="82" stroke="#0055A5" strokeWidth="0.25" strokeDasharray="1" />
              <line x1="50" y1="50" x2="72" y2="78" stroke="#0055A5" strokeWidth="0.25" strokeDasharray="1" />
              <circle cx="35" cy="18" r="0.6" fill="#00ADEF" />
              <circle cx="68" cy="24" r="0.6" fill="#0055A5" />
              <circle cx="20" cy="52" r="0.6" fill="#00ADEF" />
              <circle cx="80" cy="48" r="0.6" fill="#0055A5" />
              <circle cx="32" cy="82" r="0.6" fill="#00ADEF" />
              <circle cx="72" cy="78" r="0.6" fill="#0055A5" />
            </svg>

            {/* Central Glowing Logo */}
            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_12px_36px_rgba(27,20,100,0.06)] border border-[#0055A5]/10 select-none">
              <SbiLogoIcon className="h-14 w-14" />
            </div>

            {/* Animated data particles along orbits */}
            <div className="absolute w-2 h-2 rounded-full bg-[#00ADEF] shadow-[0_0_8px_#00ADEF] animate-[particleOrbit1_8s_linear_infinite]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-[#0055A5] shadow-[0_0_6px_#0055A5] animate-[particleOrbit2_12s_linear_infinite]" />

            {/* 6 Floating Feature Chips */}
            {/* ✨ AI Predicts */}
            <div className="absolute top-[8%] left-[10%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(27,20,100,0.03)] select-none hover:border-[#00adef]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(27,20,100,0.05)] transition-all animate-[floatChip1_4s_ease-in-out_infinite]">
              <span className="text-[12px]">✨</span>
              <span className="text-xs font-semibold text-[#1B1464]">AI Predicts</span>
            </div>

            {/* 🧠 Explainable AI */}
            <div className="absolute top-[16%] right-[8%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(27,20,100,0.03)] select-none hover:border-[#00adef]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(27,20,100,0.05)] transition-all animate-[floatChip2_4.5s_ease-in-out_infinite_0.4s]">
              <span className="text-[12px]">🧠</span>
              <span className="text-xs font-semibold text-[#1B1464]">Explainable AI</span>
            </div>

            {/* 🛡 Customer Advocate */}
            <div className="absolute top-[48%] left-[-8%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(27,20,100,0.03)] select-none hover:border-[#00adef]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(27,20,100,0.05)] transition-all animate-[floatChip3_5s_ease-in-out_infinite_0.8s]">
              <span className="text-[12px]">🛡</span>
              <span className="text-xs font-semibold text-[#1B1464]">Customer Advocate</span>
            </div>

            {/* 📖 Trust Ledger */}
            <div className="absolute top-[45%] right-[-6%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(27,20,100,0.03)] select-none hover:border-[#00adef]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(27,20,100,0.05)] transition-all animate-[floatChip1_4.2s_ease-in-out_infinite_1.2s]">
              <span className="text-[12px]">📖</span>
              <span className="text-xs font-semibold text-[#1B1464]">Trust Ledger</span>
            </div>

            {/* 📈 Future You */}
            <div className="absolute bottom-[10%] left-[8%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(27,20,100,0.03)] select-none hover:border-[#00adef]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(27,20,100,0.05)] transition-all animate-[floatChip2_4.8s_ease-in-out_infinite_1.6s]">
              <span className="text-[12px]">📈</span>
              <span className="text-xs font-semibold text-[#1B1464]">Future You</span>
            </div>

            {/* 👤 Human Review */}
            <div className="absolute bottom-[14%] right-[10%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(27,20,100,0.03)] select-none hover:border-[#00adef]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(27,20,100,0.05)] transition-all animate-[floatChip3_5.2s_ease-in-out_infinite_2s]">
              <span className="text-[12px]">👤</span>
              <span className="text-xs font-semibold text-[#1B1464]">Human Review</span>
            </div>

          </div>
        </div>

      </section>

      {/* 6. Powered By Small Capability Badges (Right Below Hero) */}
      <div className="max-w-7xl mx-auto px-6 pb-10 md:pb-12 animate-[fadeIn_0.8s_ease-out_0.3s_both]">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 py-3 border-y border-slate-100/80 max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Powered by</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-[#0055A5]/80 hover:text-[#0055A5] transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00ADEF]" /> Multi-Signal Intelligence
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold text-[#0055A5]/80 hover:text-[#0055A5] transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00ADEF]" /> Customer Advocate
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold text-[#0055A5]/80 hover:text-[#0055A5] transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00ADEF]" /> Trust Ledger
          </span>
        </div>
      </div>

      {/* Trust Strip */}
      <section id="trust" className="max-w-7xl mx-auto px-6 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-white border border-slate-100 p-8 sm:p-10 shadow-[0_12px_45px_-12px_rgba(27,20,100,0.04)] animate-[slideUp_0.8s_ease-out_0.2s_both]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
            {/* 1. Explainable AI */}
            <div className="flex items-start gap-4 lg:px-4 pt-4 sm:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00adef]/5 text-[#00adef]">
                <Brain className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-bold text-[#1B1464]">Explainable AI</h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed font-normal">Know exactly why every action is recommended.</p>
              </div>
            </div>

            {/* 2. Human Review */}
            <div className="flex items-start gap-4 lg:px-6 pt-6 sm:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffc107]/10 text-[#ffc107]">
                <UserCheck className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-bold text-[#1B1464]">Human Review</h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed font-normal">Recommendations validated by experts.</p>
              </div>
            </div>

            {/* 3. Bank-grade Security */}
            <div className="flex items-start gap-4 lg:px-6 pt-6 lg:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00C853]/10 text-[#00C853]">
                <Lock className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-bold text-[#1B1464]">Bank-grade Security</h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed font-normal">State Bank safeguards protect your assets.</p>
              </div>
            </div>

            {/* 4. Customer-first Decisions */}
            <div className="flex items-start gap-4 lg:px-6 pt-6 lg:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <Heart className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-bold text-[#1B1464]">Customer-first</h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed font-normal">AI optimized for your wellbeing, not bank profits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-t border-slate-100/80">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00adef]/10 border border-[#00adef]/20 px-3.5 py-1 text-[10px] font-bold tracking-[0.14em] text-[#00adef] uppercase mb-4">
            PROCESS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1B1464]">
            How SBI Life Moments AI Works
          </h2>
        </div>

        {/* 5 Card Process Layout */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting dashed line behind cards */}
          <div className="hidden lg:block absolute top-[60px] left-[6%] right-[6%] h-[1px] border-t border-dashed border-slate-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(27,20,100,0.015)] hover:border-[#00adef]/10 hover:shadow-[0_12px_40px_-12px_rgba(27,20,100,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0055A5]/5 text-[#0055A5] mb-5 group-hover:bg-[#0055A5]/10 transition-colors">
                <Activity className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Step 01</div>
              <h3 className="text-base font-bold text-[#1B1464] mb-2 leading-snug">Transactions</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Normal spending feed flows securely.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(27,20,100,0.015)] hover:border-[#00adef]/10 hover:shadow-[0_12px_40px_-12px_rgba(27,20,100,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00adef]/5 text-[#00adef] mb-5 group-hover:bg-[#00adef]/10 transition-colors">
                <Brain className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Step 02</div>
              <h3 className="text-base font-bold text-[#1B1464] mb-2 leading-snug">AI understands patterns</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Understands your underlying habits.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(27,20,100,0.015)] hover:border-[#00adef]/10 hover:shadow-[0_12px_40px_-12px_rgba(27,20,100,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc107]/10 text-[#ffc107] mb-5 group-hover:bg-[#ffc107]/15 transition-colors">
                <Zap className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Step 03</div>
              <h3 className="text-base font-bold text-[#1B1464] mb-2 leading-snug">Predicts Life Events</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Identifies key milestones early.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(27,20,100,0.015)] hover:border-[#00adef]/10 hover:shadow-[0_12px_40px_-12px_rgba(27,20,100,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00C853]/10 text-[#00C853] mb-5 group-hover:bg-[#00C853]/15 transition-colors">
                <Compass className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Step 04</div>
              <h3 className="text-base font-bold text-[#1B1464] mb-2 leading-snug">Explains Advice</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Provides clear and simple logic.</p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(27,20,100,0.015)] hover:border-[#00adef]/10 hover:shadow-[0_12px_40px_-12px_rgba(27,20,100,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-5 group-hover:bg-rose-100 transition-colors">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Step 05</div>
              <h3 className="text-base font-bold text-[#1B1464] mb-2 leading-snug">You Stay Ahead</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Smooth financial growth unlocked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Why SBI Life Moments AI? */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-t border-slate-100/80">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00adef]/10 border border-[#00adef]/20 px-3.5 py-1 text-[10px] font-bold tracking-[0.14em] text-[#00adef] uppercase mb-4">
            BENEFITS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1B1464]">
            Why SBI Life Moments AI?
          </h2>
        </div>

        {/* Three Large Cards Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 - Predict */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-8 lg:p-10 shadow-[0_12px_40px_-12px_rgba(27,20,100,0.03)] hover:border-[#00adef]/10 hover:shadow-[0_16px_45px_-12px_rgba(27,20,100,0.06)] transition-all hover:translate-y-[-3px] text-left">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0055A5]/5 text-[#0055A5] mb-6">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1B1464] tracking-tight">Predict</h3>
              <p className="mt-4 text-[14px] text-slate-500 font-normal leading-relaxed">
                Multi-signal life event prediction checks your deposits, transaction spikes, and monthly habits to map out major financial needs up to 6 months in advance.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 text-[13px] font-bold text-[#0055A5]">
              Real-time Analysis Engine
            </div>
          </div>

          {/* Card 2 - Explain */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-8 lg:p-10 shadow-[0_12px_40px_-12px_rgba(27,20,100,0.03)] hover:border-[#00adef]/10 hover:shadow-[0_16px_45px_-12px_rgba(27,20,100,0.06)] transition-all hover:translate-y-[-3px] text-left">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00adef]/5 text-[#00adef] mb-6">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1B1464] tracking-tight">Explain</h3>
              <p className="mt-4 text-[14px] text-slate-500 font-normal leading-relaxed">
                Transparent AI reasoning describes exactly why it suggested an investment, savings plan, or loan. No mysterious algorithms or hidden factors.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 text-[13px] font-bold text-[#0055A5]">
              Explainable Decision Matrix
            </div>
          </div>

          {/* Card 3 - Protect */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-8 lg:p-10 shadow-[0_12px_40px_-12px_rgba(27,20,100,0.03)] hover:border-[#00adef]/10 hover:shadow-[0_16px_45px_-12px_rgba(27,20,100,0.06)] transition-all hover:translate-y-[-3px] text-left">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00C853]/5 text-[#00C853] mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1B1464] tracking-tight">Protect</h3>
              <p className="mt-4 text-[14px] text-slate-500 font-normal leading-relaxed">
                Customer-first AI ensures you are safe. Built-in Trust Ledger records recommendations, and crucial decisions trigger automatic human review.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 text-[13px] font-bold text-[#0055A5]">
              Guaranteed Accountability
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-[#0055A5] via-[#00ADEF] to-[#0055A5] bg-[size:150%] p-12 sm:p-16 text-center text-white shadow-[0_24px_50px_-20px_rgba(0,173,239,0.3)] select-none">
          {/* Subtle overlay gradients */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
          <div className="absolute -top-32 -left-32 h-[350px] w-[350px] rounded-full bg-white/10 blur-3xl animate-[pulse_4s_infinite]" />
          <div className="absolute -bottom-32 -right-32 h-[350px] w-[350px] rounded-full bg-white/10 blur-3xl animate-[pulse_4s_infinite_delay-2s]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Ready for banking that understands your life?
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-normal mb-8 max-w-md mx-auto">
              Get proactive insights and complete financial transparency starting today. Secure setup in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0055A5] transition-all hover:bg-slate-50 hover:translate-y-[-1.5px] hover:shadow-lg active:translate-y-0"
              >
                Get Started
              </Link>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:translate-y-[-1px] active:translate-y-0"
              >
                See AI in Action
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="why-us" className="bg-white border-t border-slate-100 py-10 md:py-16 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12 md:mb-16">
            
            {/* Logo and company detail */}
            <div className="md:col-span-2 flex flex-col items-start gap-4">
              <div className="flex items-center gap-3">
                <SbiLogoIcon className="h-8 w-8" />
                <div className="leading-tight">
                  <div className="text-lg font-bold tracking-tight text-[#1B1464]">SBI</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold tracking-[0.08em] text-slate-500 uppercase">
                      Life Moments
                    </span>
                    <span className="rounded bg-[#00adef]/10 px-1 py-0.2 text-[8px] font-bold text-[#00adef] border border-[#00adef]/20 uppercase">
                      AI
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400/90 tracking-wider uppercase mt-4">
                State Bank of India
              </p>
              {/* Moved 185+ Years of Trust here */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0055A5]/5 px-3 py-1 text-xs font-bold text-[#0055A5] border border-[#0055A5]/10 mt-1">
                <span className="text-[14px]">🏛</span> 185+ Years of Trust
              </div>
            </div>

            {/* Links Block 1 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B1464]/60 mb-4">Product</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-500">
                <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }} className="hover:text-[#0055A5] transition-colors">Features</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection("how-it-works"); }} className="hover:text-[#0055A5] transition-colors">How It Works</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection("trust"); }} className="hover:text-[#0055A5] transition-colors">Safety Ledger</a></li>
              </ul>
            </div>

            {/* Links Block 2 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B1464]/60 mb-4">Legal & Support</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-500">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0055A5] transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0055A5] transition-colors">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0055A5] transition-colors">Security Rules</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#0055A5] transition-colors">Contact Support</a></li>
              </ul>
            </div>

          </div>

          {/* Copyright section */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} State Bank of India. All rights reserved.</p>
            <p>RBI Regulated & Compliant. Fully Protected.</p>
          </div>
        </div>
      </footer>

      {/* Global CSS animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes slideUpHero {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInHero {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpNav {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Floating animations for the 6 chips */
        @keyframes floatChip1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.5deg); }
        }
        @keyframes floatChip2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-0.5deg); }
        }
        @keyframes floatChip3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(0.3deg); }
        }

        /* Particle Orbiting animations */
        @keyframes particleOrbit1 {
          0% { transform: rotate(0deg) translate(120px) rotate(0deg); }
          100% { transform: rotate(360deg) translate(120px) rotate(-360deg); }
        }
        @keyframes particleOrbit2 {
          0% { transform: rotate(180deg) translate(170px) rotate(-180deg); }
          100% { transform: rotate(540deg) translate(170px) rotate(-540deg); }
        }
      `}</style>
    </div>
  );
}
