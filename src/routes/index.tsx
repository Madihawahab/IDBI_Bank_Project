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
      { title: "IDBI BANK Life Moments AI — The Bank that Understands Your Life" },
      {
        name: "description",
        content:
          "IDBI BANK Life Moments AI understands your financial behaviour, predicts important life events, and provides proactive guidance before you even ask.",
      },
    ],
  }),
  component: LandingPage,
});

function SbiLogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 11.9986C24 18.6274 18.6291 24.0002 11.999 24.0002C5.37283 24.0002 0 18.6274 0 11.9986C0 5.37502 5.37283 -0.000387192 11.999 -0.000387192C18.6291 -0.000387192 24 5.37502 24 11.9986Z"
        fill="white"
      />
      <path
        d="M11.9118 20.9804C13.0407 20.9824 14.1753 20.6762 15.1285 20.0658C15.7055 19.7312 16.2202 19.283 16.642 18.7668C16.9223 18.466 17.1242 18.1103 17.3402 17.763C17.6985 17.0675 17.9638 16.3169 18.0365 15.5336C18.1408 14.6599 18.057 13.7647 17.8044 12.9233C17.6193 12.2838 17.3258 11.6782 16.9558 11.1253C16.4466 10.3738 15.7892 9.70942 15.0033 9.25277C14.8263 9.14221 14.6744 9.03086 14.4955 8.92184C14.2322 8.73969 13.8065 8.51125 13.4941 8.75465C13.1765 9.06717 13.1914 9.55942 13.1639 9.97918C13.1619 12.9503 13.1481 15.921 13.1542 18.8923C13.1357 19.1417 13.213 19.4441 12.9572 19.5901C12.6925 19.7507 12.3955 19.8554 12.0862 19.904C11.8326 19.9767 11.5932 19.8667 11.3458 19.82C11.1346 19.7468 10.9043 19.6552 10.7501 19.508C10.5263 19.3107 10.6608 18.9626 10.6242 18.6861C10.6203 15.6471 10.6319 12.6074 10.6183 9.56883C10.574 9.24259 10.5382 8.84352 10.2334 8.64869C10.0924 8.57688 9.93538 8.58665 9.79088 8.64739C9.44521 8.74852 9.1515 9.04093 8.85855 9.2146C8.34889 9.51449 7.87897 9.88591 7.48287 10.3294C7.13288 10.6828 6.85536 11.0979 6.59924 11.5244C6.23356 12.1899 5.9549 12.9059 5.82862 13.6567C5.70065 14.3503 5.68773 15.063 5.79676 15.7613C5.96123 16.8243 6.42086 17.8383 7.08888 18.6786C7.74985 19.5204 8.65847 20.1381 9.63776 20.5566C10.3635 20.8247 11.1345 20.9902 11.9118 20.9804Z"
        fill="#F58220"
      />
      <path
        d="M11.935 7.06129C12.0184 7.05806 12.1045 7.0704 12.1847 7.04966C12.2356 7.04643 12.2811 7.00849 12.3349 7.01799C12.3694 6.99021 12.4082 6.96144 12.4524 6.95983C12.4929 6.93482 12.5561 6.94386 12.5766 6.8894C12.6211 6.87383 12.6574 6.84834 12.6978 6.82579C12.7364 6.80699 12.7649 6.76645 12.8015 6.74133C12.8582 6.71716 12.8765 6.65267 12.9309 6.62515C12.9587 6.59059 12.9832 6.55368 13.0185 6.52436C13.0533 6.47306 13.089 6.42359 13.1096 6.36414C13.1452 6.33668 13.1513 6.28793 13.1755 6.25081C13.1942 6.20946 13.2189 6.17302 13.228 6.12892C13.2464 6.09061 13.2636 6.05143 13.2582 6.0075C13.2784 5.95433 13.264 5.89272 13.3015 5.84468C13.2989 5.72193 13.3067 5.59639 13.2976 5.47539C13.2577 5.42467 13.2775 5.35821 13.2583 5.30054C13.2525 5.25854 13.244 5.21358 13.2183 5.17932C13.1876 5.06035 13.1095 4.96238 13.0545 4.85509C13.0274 4.81911 13.0133 4.78164 12.9738 4.7573C12.9362 4.70458 12.8798 4.66914 12.8499 4.61065C12.7957 4.60742 12.7685 4.55166 12.7267 4.52496C12.6976 4.49427 12.6518 4.48116 12.6196 4.45603C12.5808 4.4402 12.5615 4.39936 12.5129 4.40098C12.4443 4.37197 12.3779 4.32902 12.3021 4.31537C12.2605 4.29547 12.2259 4.26756 12.1763 4.27984C12.1221 4.27854 12.0691 4.26678 12.0145 4.26678C11.921 4.25561 11.8261 4.26807 11.7332 4.27195C11.6765 4.29301 11.6083 4.25983 11.559 4.30531C11.4993 4.33438 11.4321 4.33747 11.3749 4.37128C11.3379 4.39984 11.2861 4.39754 11.2574 4.43591C11.2073 4.44515 11.1728 4.48695 11.1251 4.5037C11.0853 4.53652 11.0426 4.57441 11.0066 4.60718C10.9555 4.60071 10.947 4.66597 10.9111 4.69239C10.873 4.71946 10.8642 4.76488 10.8284 4.79188C10.7608 4.86784 10.7024 4.95508 10.6631 5.04958C10.6567 5.09474 10.6162 5.12057 10.6144 5.16753C10.5936 5.21146 10.5743 5.24879 10.565 5.29494C10.5538 5.34223 10.5676 5.39698 10.5331 5.43927C10.5382 5.55108 10.511 5.66316 10.5331 5.77406C10.5311 5.83337 10.5285 5.89295 10.5589 5.94642C10.5521 6.01992 10.5838 6.08596 10.6145 6.14986C10.6099 6.20142 10.6551 6.21984 10.662 6.26489C10.6784 6.30339 10.689 6.34473 10.7158 6.3785C10.7391 6.45592 10.8057 6.50362 10.8534 6.56431C10.8845 6.59209 10.8933 6.64094 10.9356 6.66037C10.9654 6.693 10.9881 6.73173 11.0332 6.7476C11.0591 6.7894 11.1144 6.799 11.1444 6.83944C11.1919 6.88266 11.2658 6.87543 11.3036 6.93183C11.337 6.95535 11.3887 6.95058 11.4195 6.97138C11.4533 6.98954 11.4976 7.00065 11.5335 7.01764C11.5852 7.02151 11.6268 7.05809 11.6792 7.0493C11.76 7.07437 11.8508 7.05483 11.935 7.06129Z"
        fill="#F58220"
      />
      <path
        d="M14.951 4.56996C15.1056 4.2297 15.5148 3.96972 15.8626 4.22944C16.551 4.66832 17.0729 5.3338 17.6692 5.89075C18.4468 6.64569 19.1546 7.48997 19.6404 8.46553C20.1458 9.4644 20.4434 10.5639 20.4801 11.6846C20.598 12.8163 20.4078 13.9768 20.0705 15.0584C19.3768 17.0928 17.9439 18.8954 16.0441 19.9247C13.4161 21.4092 10.0118 21.3104 7.44763 19.7369C5.00687 18.2802 3.42343 15.5333 3.29889 12.7028C3.23341 11.4022 3.43911 10.0866 3.96177 8.88834C4.46647 7.6904 5.3076 6.66352 6.24628 5.77323C6.77818 5.23831 7.26982 4.64823 7.90092 4.23461C8.16887 4.02883 8.59963 4.06738 8.74279 4.39227C9.05962 4.89412 9.27827 5.51674 9.26027 6.12699C9.18185 7.13206 8.30168 7.74832 7.59921 8.34565C6.76662 9.03143 6.18567 9.96527 5.70426 10.9222C5.2692 11.8553 5.04047 12.8773 5.07368 13.9235C5.07949 16.1648 6.1848 18.3869 7.99847 19.7141C9.18783 20.5469 10.6282 21.0281 12.0888 20.9804C14.0856 20.955 15.998 19.9192 17.2006 18.3444C18.2762 16.9567 18.8241 15.1698 18.7099 13.4152C18.6621 12.345 18.3283 11.3069 17.8312 10.3782C17.3686 9.54303 16.7405 8.7903 16.0009 8.1902C15.4489 7.67659 14.7741 7.1925 14.5963 6.42223C14.4628 5.78812 14.6802 5.13978 14.951 4.56996Z"
        fill="#F58220"
      />
    </svg>
  );
}

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    }
  }, []);

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
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--sbi-sky)] text-[var(--sbi-navy)] font-sans overflow-x-hidden selection:bg-[var(--sbi-blue)]/20">
      {/* 3. Hero Background (Mesh, Grid, Radial gradients) */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        {/* Extremely light dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--sbi-blue)05_1px,transparent_1px)] [background-size:32px_32px] opacity-75" />

        {/* Soft radial gradients */}
        <div className="absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,131,108,0.04),transparent_65%)]" />
        <div className="absolute top-[20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,130,32,0.03),transparent_65%)]" />
        <div className="absolute bottom-[10%] right-[-5%] h-[900px] w-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,131,108,0.03),transparent_65%)]" />

        {/* Tiny floating particle animations */}
        <div className="absolute top-[15%] left-[20%] h-1.5 w-1.5 rounded-full bg-[var(--sbi-blue)]/25 animate-[pulse_3s_infinite]" />
        <div className="absolute top-[45%] right-[25%] h-2 w-2 rounded-full bg-[var(--sbi-royal)]/15 animate-[pulse_4s_infinite_delay-1s]" />
        <div className="absolute bottom-[35%] left-[15%] h-1 w-1 rounded-full bg-[var(--sbi-blue)]/20 animate-[pulse_2.5s_infinite_delay-2s]" />
      </div>

      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md py-4 shadow-[0_2px_20px_-10px_rgba(0,45,37,0.08)] border-b border-slate-100"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3"
          >
            <SbiLogoIcon className="h-8 w-8" />
            <div className="leading-tight text-left">
              <div className="text-lg font-bold tracking-tight text-[var(--sbi-navy)]">
                IDBI BANK
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Life Moments
                </span>
                <span className="rounded bg-[var(--sbi-blue)]/10 px-1 py-0.2 text-[8px] font-bold text-[var(--sbi-blue)] border border-[var(--sbi-blue)]/20 uppercase">
                  AI
                </span>
              </div>
            </div>
          </a>

          {/* Links Center */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-[14px] font-medium text-slate-600 hover:text-[var(--sbi-royal)] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-[14px] font-medium text-slate-600 hover:text-[var(--sbi-royal)] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("trust")}
              className="text-[14px] font-medium text-slate-600 hover:text-[var(--sbi-royal)] transition-colors"
            >
              Trust
            </button>
            <button
              onClick={() => scrollToSection("why-us")}
              className="text-[14px] font-medium text-slate-600 hover:text-[var(--sbi-royal)] transition-colors"
            >
              About
            </button>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-slate-600 hover:text-[var(--sbi-navy)] cursor-pointer transition-colors">
              <Globe className="h-4.5 w-4.5" />
              <span className="text-[13px] font-semibold">EN</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </div>
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="rounded-full bg-[var(--sbi-royal)] px-5 py-2 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(0,131,108,0.12)] transition-all hover:bg-[var(--sbi-blue)] hover:translate-y-[-1px] hover:shadow-[0_6px_16px_rgba(245,130,32,0.2)] active:translate-y-0"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
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
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="mt-3 block text-center rounded-2xl bg-[var(--sbi-royal)] py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,131,108,0.12)]"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col md:flex-row items-center gap-12 md:gap-8">
        {/* Hero Left Side */}
        <div className="flex-1 flex flex-col items-start text-left max-w-xl animate-[slideUpHero_0.7s_ease-out_forwards]">
          {/* Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sbi-blue)]/10 border border-[var(--sbi-blue)]/20 px-3.5 py-1 text-[11px] font-bold tracking-[0.14em] text-[var(--sbi-blue)] uppercase mb-8">
            <span className="text-[10px]">✦</span> AI-FIRST BANKING
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--sbi-navy)] leading-[1.08] mb-4">
            The bank that{" "}
            <span className="bg-gradient-to-r from-[var(--sbi-royal)] via-[var(--sbi-blue)] to-[var(--sbi-royal)] bg-clip-text text-transparent bg-[size:200%] animate-[gradientShift_6s_linear_infinite] inline-block font-extrabold">
              understands
            </span>{" "}
            your life before you ask.
          </h1>

          {/* Supporting line */}
          <p className="text-lg sm:text-xl font-medium tracking-tight text-[var(--sbi-royal)]/80 mb-6">
            Powered by Explainable AI, built on trust, designed for people.
          </p>

          {/* Short paragraph */}
          <p className="text-base text-slate-500 font-normal leading-relaxed mb-8 max-w-md">
            IDBI BANK Life Moments AI understands your financial behaviour, predicts important life
            events, and provides proactive guidance before you even ask.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-8">
            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--sbi-royal)] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgba(0,131,108,0.15)] transition-all hover:bg-[var(--sbi-blue)] hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(245,130,32,0.25)] active:translate-y-0 group"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started"}
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
              <span className="text-[#00C853] text-[14px]">✓</span> Built by IDBI BANK
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
            <div className="absolute w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,131,108,0.12),transparent_70%)] animate-[pulse_3s_infinite]" />
            <div className="absolute w-[80px] h-[80px] rounded-full bg-[var(--sbi-royal)]/10 blur-xl animate-[pulse_2.5s_infinite]" />

            {/* Orbit paths connectors (Subtle SVG Network lines) */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full opacity-[0.25] pointer-events-none"
            >
              <line
                x1="50"
                y1="50"
                x2="35"
                y2="18"
                stroke="var(--sbi-royal)"
                strokeWidth="0.25"
                strokeDasharray="1"
              />
              <line
                x1="50"
                y1="50"
                x2="68"
                y2="24"
                stroke="var(--sbi-royal)"
                strokeWidth="0.25"
                strokeDasharray="1"
              />
              <line
                x1="50"
                y1="50"
                x2="20"
                y2="52"
                stroke="var(--sbi-royal)"
                strokeWidth="0.25"
                strokeDasharray="1"
              />
              <line
                x1="50"
                y1="50"
                x2="80"
                y2="48"
                stroke="var(--sbi-royal)"
                strokeWidth="0.25"
                strokeDasharray="1"
              />
              <line
                x1="50"
                y1="50"
                x2="32"
                y2="82"
                stroke="var(--sbi-royal)"
                strokeWidth="0.25"
                strokeDasharray="1"
              />
              <line
                x1="50"
                y1="50"
                x2="72"
                y2="78"
                stroke="var(--sbi-royal)"
                strokeWidth="0.25"
                strokeDasharray="1"
              />
              <circle cx="35" cy="18" r="0.6" fill="var(--sbi-blue)" />
              <circle cx="68" cy="24" r="0.6" fill="var(--sbi-royal)" />
              <circle cx="20" cy="52" r="0.6" fill="var(--sbi-blue)" />
              <circle cx="80" cy="48" r="0.6" fill="var(--sbi-royal)" />
              <circle cx="32" cy="82" r="0.6" fill="var(--sbi-blue)" />
              <circle cx="72" cy="78" r="0.6" fill="var(--sbi-royal)" />
            </svg>

            {/* Central Glowing Logo */}
            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_12px_36px_rgba(0,45,37,0.06)] border border-[var(--sbi-royal)]/10 select-none">
              <SbiLogoIcon className="h-14 w-14" />
            </div>

            {/* Animated data particles along orbits */}
            <div className="absolute w-2 h-2 rounded-full bg-[var(--sbi-blue)] shadow-[0_0_8px_var(--sbi-blue)] animate-[particleOrbit1_8s_linear_infinite]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-[var(--sbi-royal)] shadow-[0_0_6px_var(--sbi-royal)] animate-[particleOrbit2_12s_linear_infinite]" />

            {/* 6 Floating Feature Chips */}
            {/* ✨ AI Predicts */}
            <div className="absolute top-[8%] left-[10%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(0,45,37,0.03)] select-none hover:border-[var(--sbi-blue)]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,45,37,0.05)] transition-all animate-[floatChip1_4s_ease-in-out_infinite]">
              <span className="text-[12px]">✨</span>
              <span className="text-xs font-semibold text-[var(--sbi-navy)]">AI Predicts</span>
            </div>

            {/* 🧠 Explainable AI */}
            <div className="absolute top-[16%] right-[8%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(0,45,37,0.03)] select-none hover:border-[var(--sbi-blue)]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,45,37,0.05)] transition-all animate-[floatChip2_4.5s_ease-in-out_infinite_0.4s]">
              <span className="text-[12px]">🧠</span>
              <span className="text-xs font-semibold text-[var(--sbi-navy)]">Explainable AI</span>
            </div>

            {/* 🛡 Customer Advocate */}
            <div className="absolute top-[48%] left-[-8%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(0,45,37,0.03)] select-none hover:border-[var(--sbi-blue)]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,45,37,0.05)] transition-all animate-[floatChip3_5s_ease-in-out_infinite_0.8s]">
              <span className="text-[12px]">🛡</span>
              <span className="text-xs font-semibold text-[var(--sbi-navy)]">
                Customer Advocate
              </span>
            </div>

            {/* 📖 Trust Ledger */}
            <div className="absolute top-[45%] right-[-6%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(0,45,37,0.03)] select-none hover:border-[var(--sbi-blue)]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,45,37,0.05)] transition-all animate-[floatChip1_4.2s_ease-in-out_infinite_1.2s]">
              <span className="text-[12px]">📖</span>
              <span className="text-xs font-semibold text-[var(--sbi-navy)]">Trust Ledger</span>
            </div>

            {/* 📈 Future You */}
            <div className="absolute bottom-[10%] left-[8%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(0,45,37,0.03)] select-none hover:border-[var(--sbi-blue)]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,45,37,0.05)] transition-all animate-[floatChip2_4.8s_ease-in-out_infinite_1.6s]">
              <span className="text-[12px]">📈</span>
              <span className="text-xs font-semibold text-[var(--sbi-navy)]">Future You</span>
            </div>

            {/* 👤 Human Review */}
            <div className="absolute bottom-[14%] right-[10%] z-20 bg-white border border-slate-100/90 rounded-2xl px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_20px_rgba(0,45,37,0.03)] select-none hover:border-[var(--sbi-blue)]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,45,37,0.05)] transition-all animate-[floatChip3_5.2s_ease-in-out_infinite_2s]">
              <span className="text-[12px]">👤</span>
              <span className="text-xs font-semibold text-[var(--sbi-navy)]">Human Review</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Powered By Small Capability Badges (Right Below Hero) */}
      <div className="max-w-7xl mx-auto px-6 pb-10 md:pb-12 animate-[fadeIn_0.8s_ease-out_0.3s_both]">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 py-3 border-y border-slate-100/80 max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            Powered by
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold text-[var(--sbi-royal)]/80 hover:text-[var(--sbi-royal)] transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--sbi-blue)]" /> Multi-Signal
            Intelligence
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold text-[var(--sbi-royal)]/80 hover:text-[var(--sbi-royal)] transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--sbi-blue)]" /> Customer Advocate
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold text-[var(--sbi-royal)]/80 hover:text-[var(--sbi-royal)] transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--sbi-blue)]" /> Trust Ledger
          </span>
        </div>
      </div>

      {/* Trust Strip */}
      <section id="trust" className="max-w-7xl mx-auto px-6 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-white border border-slate-100 p-8 sm:p-10 shadow-[0_12px_45px_-12px_rgba(0,45,37,0.04)] animate-[slideUp_0.8s_ease-out_0.2s_both]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
            {/* 1. Explainable AI */}
            <div className="flex items-start gap-4 lg:px-4 pt-4 sm:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--sbi-blue)]/5 text-[var(--sbi-blue)]">
                <Brain className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-bold text-[var(--sbi-navy)]">Explainable AI</h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed font-normal">
                  Know exactly why every action is recommended.
                </p>
              </div>
            </div>

            {/* 2. Human Review */}
            <div className="flex items-start gap-4 lg:px-6 pt-6 sm:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffc107]/10 text-[#ffc107]">
                <UserCheck className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-bold text-[var(--sbi-navy)]">Human Review</h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed font-normal">
                  Recommendations validated by experts.
                </p>
              </div>
            </div>

            {/* 3. Bank-grade Security */}
            <div className="flex items-start gap-4 lg:px-6 pt-6 lg:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00C853]/10 text-[#00C853]">
                <Lock className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-bold text-[var(--sbi-navy)]">
                  Bank-grade Security
                </h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed font-normal">
                  State Bank safeguards protect your assets.
                </p>
              </div>
            </div>

            {/* 4. Customer-first Decisions */}
            <div className="flex items-start gap-4 lg:px-6 pt-6 lg:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <Heart className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[15px] font-bold text-[var(--sbi-navy)]">Customer-first</h3>
                <p className="mt-1 text-[13px] text-slate-500 leading-relaxed font-normal">
                  AI optimized for your wellbeing, not bank profits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-t border-slate-100/80"
      >
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sbi-blue)]/10 border border-[var(--sbi-blue)]/20 px-3.5 py-1 text-[10px] font-bold tracking-[0.14em] text-[var(--sbi-blue)] uppercase mb-4">
            PROCESS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--sbi-navy)]">
            How IDBI BANK Life Moments AI Works
          </h2>
        </div>

        {/* 5 Card Process Layout */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting dashed line behind cards */}
          <div className="hidden lg:block absolute top-[60px] left-[6%] right-[6%] h-[1px] border-t border-dashed border-slate-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,45,37,0.015)] hover:border-[var(--sbi-blue)]/10 hover:shadow-[0_12px_40px_-12px_rgba(0,45,37,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--sbi-royal)]/5 text-[var(--sbi-royal)] mb-5 group-hover:bg-[var(--sbi-royal)]/10 transition-colors">
                <Activity className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Step 01
              </div>
              <h3 className="text-base font-bold text-[var(--sbi-navy)] mb-2 leading-snug">
                Transactions
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Normal spending feed flows securely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,45,37,0.015)] hover:border-[var(--sbi-blue)]/10 hover:shadow-[0_12px_40px_-12px_rgba(0,45,37,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--sbi-blue)]/5 text-[var(--sbi-blue)] mb-5 group-hover:bg-[var(--sbi-blue)]/10 transition-colors">
                <Brain className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Step 02
              </div>
              <h3 className="text-base font-bold text-[var(--sbi-navy)] mb-2 leading-snug">
                AI understands patterns
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Understands your underlying habits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,45,37,0.015)] hover:border-[var(--sbi-blue)]/10 hover:shadow-[0_12px_40px_-12px_rgba(0,45,37,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffc107]/10 text-[#ffc107] mb-5 group-hover:bg-[#ffc107]/15 transition-colors">
                <Zap className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Step 03
              </div>
              <h3 className="text-base font-bold text-[var(--sbi-navy)] mb-2 leading-snug">
                Predicts Life Events
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Identifies key milestones early.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,45,37,0.015)] hover:border-[var(--sbi-blue)]/10 hover:shadow-[0_12px_40px_-12px_rgba(0,45,37,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00C853]/10 text-[#00C853] mb-5 group-hover:bg-[#00C853]/15 transition-colors">
                <Compass className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Step 04
              </div>
              <h3 className="text-base font-bold text-[var(--sbi-navy)] mb-2 leading-snug">
                Explains Advice
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Provides clear and simple logic.
              </p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,45,37,0.015)] hover:border-[var(--sbi-blue)]/10 hover:shadow-[0_12px_40px_-12px_rgba(0,45,37,0.04)] transition-all hover:translate-y-[-2px] group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-5 group-hover:bg-rose-100 transition-colors">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Step 05
              </div>
              <h3 className="text-base font-bold text-[var(--sbi-navy)] mb-2 leading-snug">
                You Stay Ahead
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Smooth financial growth unlocked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Why IDBI BANK Life Moments AI? */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-t border-slate-100/80"
      >
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sbi-blue)]/10 border border-[var(--sbi-blue)]/20 px-3.5 py-1 text-[10px] font-bold tracking-[0.14em] text-[var(--sbi-blue)] uppercase mb-4">
            BENEFITS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--sbi-navy)]">
            Why IDBI BANK Life Moments AI?
          </h2>
        </div>

        {/* Three Large Cards Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 - Predict */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-8 lg:p-10 shadow-[0_12px_40px_-12px_rgba(0,45,37,0.03)] hover:border-[var(--sbi-blue)]/10 hover:shadow-[0_16px_45px_-12px_rgba(0,45,37,0.06)] transition-all hover:translate-y-[-3px] text-left">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--sbi-royal)]/5 text-[var(--sbi-royal)] mb-6">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--sbi-navy)] tracking-tight">Predict</h3>
              <p className="mt-4 text-[14px] text-slate-500 font-normal leading-relaxed">
                Multi-signal life event prediction checks your deposits, transaction spikes, and
                monthly habits to map out major financial needs up to 6 months in advance.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 text-[13px] font-bold text-[var(--sbi-royal)]">
              Real-time Analysis Engine
            </div>
          </div>

          {/* Card 2 - Explain */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-8 lg:p-10 shadow-[0_12px_40px_-12px_rgba(0,45,37,0.03)] hover:border-[var(--sbi-blue)]/10 hover:shadow-[0_16px_45px_-12px_rgba(0,45,37,0.06)] transition-all hover:translate-y-[-3px] text-left">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--sbi-blue)]/5 text-[var(--sbi-blue)] mb-6">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--sbi-navy)] tracking-tight">Explain</h3>
              <p className="mt-4 text-[14px] text-slate-500 font-normal leading-relaxed">
                Transparent AI reasoning describes exactly why it suggested an investment, savings
                plan, or loan. No mysterious algorithms or hidden factors.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 text-[13px] font-bold text-[var(--sbi-royal)]">
              Explainable Decision Matrix
            </div>
          </div>

          {/* Card 3 - Protect */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-8 lg:p-10 shadow-[0_12px_40px_-12px_rgba(0,45,37,0.03)] hover:border-[var(--sbi-blue)]/10 hover:shadow-[0_16px_45px_-12px_rgba(0,45,37,0.06)] transition-all hover:translate-y-[-3px] text-left">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00C853]/5 text-[#00C853] mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--sbi-navy)] tracking-tight">Protect</h3>
              <p className="mt-4 text-[14px] text-slate-500 font-normal leading-relaxed">
                Customer-first AI ensures you are safe. Built-in Trust Ledger records
                recommendations, and crucial decisions trigger automatic human review.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 text-[13px] font-bold text-[var(--sbi-royal)]">
              Guaranteed Accountability
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-[var(--sbi-royal)] via-[var(--sbi-blue)] to-[var(--sbi-royal)] bg-[size:150%] p-12 sm:p-16 text-center text-white shadow-[0_24px_50px_-20px_rgba(245,130,32,0.3)] select-none">
          {/* Subtle overlay gradients */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
          <div className="absolute -top-32 -left-32 h-[350px] w-[350px] rounded-full bg-white/10 blur-3xl animate-[pulse_4s_infinite]" />
          <div className="absolute -bottom-32 -right-32 h-[350px] w-[350px] rounded-full bg-white/10 blur-3xl animate-[pulse_4s_infinite_delay-2s]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Ready for banking that understands your life?
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-normal mb-8 max-w-md mx-auto">
              Get proactive insights and complete financial transparency starting today. Secure
              setup in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isLoggedIn ? "/dashboard" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[var(--sbi-royal)] transition-all hover:bg-slate-50 hover:translate-y-[-1.5px] hover:shadow-lg active:translate-y-0"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
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
                  <div className="text-lg font-bold tracking-tight text-[var(--sbi-navy)]">
                    IDBI BANK
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold tracking-[0.08em] text-slate-500 uppercase">
                      Life Moments
                    </span>
                    <span className="rounded bg-[var(--sbi-blue)]/10 px-1 py-0.2 text-[8px] font-bold text-[var(--sbi-blue)] border border-[var(--sbi-blue)]/20 uppercase">
                      AI
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400/90 tracking-wider uppercase mt-4">
                IDBI Bank
              </p>
              {/* Moved 185+ Years of Trust here */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--sbi-royal)]/5 px-3 py-1 text-xs font-bold text-[var(--sbi-royal)] border border-[var(--sbi-royal)]/10 mt-1">
                <span className="text-[14px]">🏛</span> 185+ Years of Trust
              </div>
            </div>

            {/* Links Block 1 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--sbi-navy)]/60 mb-4">
                Product
              </h4>
              <ul className="space-y-3 text-xs font-medium text-slate-500">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("features");
                    }}
                    className="hover:text-[var(--sbi-royal)] transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("how-it-works");
                    }}
                    className="hover:text-[var(--sbi-royal)] transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("trust");
                    }}
                    className="hover:text-[var(--sbi-royal)] transition-colors"
                  >
                    Safety Ledger
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Block 2 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--sbi-navy)]/60 mb-4">
                Legal & Support
              </h4>
              <ul className="space-y-3 text-xs font-medium text-slate-500">
                <li>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[var(--sbi-royal)] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[var(--sbi-royal)] transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[var(--sbi-royal)] transition-colors"
                  >
                    Security Rules
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[var(--sbi-royal)] transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright section */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} IDBI Bank. All rights reserved.</p>
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
