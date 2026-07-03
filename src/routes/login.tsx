import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — SBI Life Moments AI" },
      { name: "description", content: "Access your AI-first banking companion safely." },
    ],
  }),
  component: LoginPage,
});

function SbiLogoIcon({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} text-[#0055A5]`} fill="currentColor">
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" />
      {/* Inner hole */}
      <circle cx="12" cy="12" r="3.5" fill="white" />
      {/* Slit at the bottom */}
      <rect x="11" y="12" width="2" height="10" fill="white" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Step 1: Preparing intelligence (0 - 800ms)
      // Step 2: Fading into dashboard (800ms - 1500ms)
      const timer = setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7FBFF] px-4 font-sans selection:bg-[#00adef]/20">
        {/* Subtle background grids/mesh */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#00adef05_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,173,239,0.06),transparent_60%)]" />

        <div className="flex flex-col items-center text-center max-w-sm animate-[fadeIn_0.6s_ease-out]">
          {/* Glowing Animated SBI logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-[#00adef]/20 blur-xl animate-[ping_2s_infinite]" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(27,20,100,0.08)] border border-[#00adef]/10 animate-[pulse_1.5s_infinite]">
              <SbiLogoIcon className="h-14 w-14 animate-[spin_12s_linear_infinite]" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#1B1464] tracking-tight">
            Preparing your financial intelligence...
          </h2>
          <p className="mt-3 text-sm text-muted-foreground/80 font-normal leading-relaxed">
            Structuring your personalized life events and securing your connection.
          </p>

          {/* Simple premium loading bar */}
          <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-slate-200/60">
            <div className="h-full rounded-full bg-gradient-to-r from-[#0055A5] to-[#00ADEF] w-0 animate-[loadingProgress_1.8s_ease-in-out_forwards]" />
          </div>
        </div>

        <style>{`
          @keyframes loadingProgress {
            0% { width: 0%; }
            50% { width: 60%; }
            100% { width: 100%; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen lg:h-screen flex-col justify-between bg-[#F7FBFF] px-4 py-4 md:py-6 font-sans selection:bg-[#00adef]/20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#00adef06_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,173,239,0.04),transparent_70%)]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,85,165,0.03),transparent_70%)]" />

      {/* Header */}
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between pb-3 border-b border-slate-100 animate-[fadeIn_0.5s_ease-out]">
        <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <SbiLogoIcon className="h-9 w-9" />
          <div className="leading-tight text-left">
            <div className="text-lg font-bold tracking-tight text-[#1B1464]">SBI</div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Life Moments
              </span>
              <span className="rounded-md bg-[#00adef]/10 px-1 py-0.2 text-[8px] font-bold text-[#00adef] border border-[#00adef]/20 uppercase">
                AI
              </span>
            </div>
          </div>
        </a>
        <a
          href="/"
          className="text-xs font-semibold text-[#0055A5] hover:text-[#00ADEF] transition-colors"
        >
          Back to Homepage
        </a>
      </header>

      {/* Main card section */}
      <main className="flex-1 flex items-center justify-center py-4 md:py-6">
        <div className="w-full max-w-[420px] rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_12px_40px_-12px_rgba(27,20,100,0.04)] animate-[slideUp_0.6s_ease-out]">
          <div className="text-center mb-5">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0055A5]/5 text-[#0055A5]">
              <Shield className="h-5.5 w-5.5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1B1464]">Welcome back</h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              Sign in to access your intelligent bank accounts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/30 text-sm outline-none transition focus:border-[#00ADEF] focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold tracking-wider uppercase text-slate-500">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium text-[#0055A5] hover:text-[#00ADEF] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/30 text-sm outline-none transition focus:border-[#00ADEF] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0055A5] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,85,165,0.15)] transition-all hover:bg-[#00adef] hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(0,173,239,0.25)] active:translate-y-0"
            >
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setEmail("aarav.sharma@sbi.co.in");
                setPassword("demo1234");
                setIsLoading(true);
              }}
              className="w-full py-2 rounded-2xl border border-dashed border-[#0055A5]/30 text-xs font-semibold text-[#0055A5] bg-[#0055A5]/5 hover:bg-[#0055A5]/10 hover:border-[#0055A5]/50 transition-all text-center block"
            >
              💡 One-click Demo Login
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground/75 border-t border-slate-100/60 pt-4 pb-2 max-w-5xl mx-auto w-full animate-[fadeIn_0.5s_ease-out]">
        <p>© {new Date().getFullYear()} State Bank of India. Safe, Secure, & Regulated.</p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
