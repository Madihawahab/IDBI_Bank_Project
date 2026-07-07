import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — IDBI BANK Life Moments AI" },
      { name: "description", content: "Access your AI-first banking companion safely." },
    ],
  }),
  component: LoginPage,
});

function SbiLogoIcon({ className = "h-12 w-12" }: { className?: string }) {
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

interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface AxiosErrorLike {
  response?: {
    status: number;
    data?: {
      detail?: string | ValidationErrorDetail[];
    };
  };
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordRef = useRef<HTMLInputElement>(null);

  // Authenticated redirect loop guard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        navigate({ to: "/dashboard" });
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        navigate({ to: "/dashboard" });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, navigate]);

  const handleLogin = async (
    e?: React.FormEvent,
    customEmail?: string,
    customPassword?: string,
  ) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    setEmailError("");
    setPasswordError("");

    let hasError = false;
    if (!loginEmail || !loginEmail.includes("@")) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }
    if (!loginPassword || loginPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters.");
      hasError = true;
    }
    if (hasError) return;

    setIsPending(true);
    console.log(`Login attempt: ${loginEmail}`);
    try {
      const data = await authApi.login({
        email: loginEmail,
        password: loginPassword,
      });

      console.log(`Login success: ${loginEmail}`);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      sessionStorage.removeItem("idbi_future_you_explanation");

      toast.success("Login successful. Welcome back!");
      setIsLoading(true);
    } catch (error: unknown) {
      setIsPending(false);
      const err = error as AxiosErrorLike;

      if (!err.response) {
        console.log(`Server unavailable: ${loginEmail}`);
        toast.error("Login failed. Please check your credentials.");
        setPasswordError("Unable to connect to the server. Please try again.");
        return;
      }

      const status = err.response.status;
      const detail = err.response.data?.detail;

      if (status === 401) {
        console.log(`Login failed (401): ${loginEmail}`);
        toast.error("Login failed. Please check your credentials.");
        setPasswordError("Invalid email or password.");
        setPassword("");
        setTimeout(() => passwordRef.current?.focus(), 50);
      } else if (status === 422) {
        console.log(`Validation error (422) during login: ${loginEmail}`);
        toast.error("Login failed. Please check your credentials.");

        if (Array.isArray(detail)) {
          const emailDetail = detail.find((d: ValidationErrorDetail) => d.loc?.includes("email"));
          const pwdDetail = detail.find((d: ValidationErrorDetail) => d.loc?.includes("password"));

          if (emailDetail) {
            setEmailError(emailDetail.msg);
          }
          if (pwdDetail) {
            setPasswordError(pwdDetail.msg);
            setPassword("");
            setTimeout(() => passwordRef.current?.focus(), 50);
          }
        } else if (typeof detail === "string") {
          setPasswordError(detail);
          setPassword("");
          setTimeout(() => passwordRef.current?.focus(), 50);
        } else {
          setPasswordError("Validation failed. Please verify your details.");
          setPassword("");
          setTimeout(() => passwordRef.current?.focus(), 50);
        }
      } else if (status === 500) {
        console.log(`Server error (500) during login: ${loginEmail}`);
        toast.error("Login failed. Please check your credentials.");
        setPasswordError("Something went wrong. Please try again later.");
      } else {
        console.log(`Unexpected error status (${status}) during login: ${loginEmail}`);
        toast.error("Login failed. Please check your credentials.");
        const msg =
          typeof detail === "string" ? detail : "Something went wrong. Please try again later.";
        setPasswordError(msg);
        setPassword("");
        setTimeout(() => passwordRef.current?.focus(), 50);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    handleLogin(e);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--sbi-sky)] px-4 font-sans selection:bg-[var(--sbi-blue)]/20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(var(--sbi-blue)_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px]" />
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,131,108,0.04),transparent_60%)]" />

        <div className="flex flex-col items-center text-center max-w-sm animate-[fadeIn_0.6s_ease-out]">
          {/* Glowing Animated SBI logo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-[var(--sbi-blue)]/20 blur-xl animate-[ping_2s_infinite]" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(0,45,37,0.08)] border border-[var(--sbi-blue)]/10 animate-[pulse_1.5s_infinite]">
              <SbiLogoIcon className="h-14 w-14 animate-[spin_12s_linear_infinite]" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[var(--sbi-navy)] tracking-tight">
            Preparing your financial intelligence...
          </h2>
          <p className="mt-3 text-sm text-muted-foreground/80 font-normal leading-relaxed">
            Structuring your personalized life events and securing your connection.
          </p>

          {/* Simple premium loading bar */}
          <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-slate-200/60">
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--sbi-blue)] to-[var(--sbi-royal)] w-0 animate-[loadingProgress_1.8s_ease-in-out_forwards]" />
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
    <div className="relative flex min-h-screen lg:h-screen flex-col justify-between bg-[var(--sbi-sky)] px-4 py-4 md:py-6 font-sans selection:bg-[var(--sbi-blue)]/20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(var(--sbi-blue)_1px,transparent_1px)] opacity-[0.03] [background-size:24px_24px]" />
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,131,108,0.04),transparent_70%)]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,131,108,0.03),transparent_70%)]" />

      {/* Header */}
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between pb-3 border-b border-slate-100 animate-[fadeIn_0.5s_ease-out]">
        <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <SbiLogoIcon className="h-9 w-9" />
          <div className="leading-tight text-left">
            <div className="text-lg font-bold tracking-tight text-[var(--sbi-navy)]">IDBI BANK</div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Life Moments
              </span>
              <span className="rounded-md bg-[var(--sbi-blue)]/10 px-1 py-0.2 text-[8px] font-bold text-[var(--sbi-blue)] border border-[var(--sbi-blue)]/20 uppercase">
                AI
              </span>
            </div>
          </div>
        </a>
        <a
          href="/"
          className="text-xs font-semibold text-[var(--sbi-blue)] hover:text-[var(--sbi-royal)] transition-colors"
        >
          Back to Homepage
        </a>
      </header>

      {/* Main card section */}
      <main className="flex-1 flex items-center justify-center py-4 md:py-6">
        <div className="w-full max-w-[420px] rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_12px_40px_-12px_rgba(0,45,37,0.04)] animate-[slideUp_0.6s_ease-out]">
          <div className="text-center mb-5">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--sbi-blue)]/5 text-[var(--sbi-blue)]">
              <Shield className="h-5.5 w-5.5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--sbi-navy)]">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
              Sign in to access your intelligent bank accounts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={isPending}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/30 text-sm outline-none transition focus:border-[var(--sbi-blue)] focus:bg-white disabled:opacity-50"
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-500 font-medium text-left">{emailError}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold tracking-wider uppercase text-slate-500"
                >
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium text-[var(--sbi-blue)] hover:text-[var(--sbi-royal)] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isPending}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/30 text-sm outline-none transition focus:border-[var(--sbi-blue)] focus:bg-white disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-red-500 font-medium text-left">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--sbi-blue)] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,131,108,0.15)] transition-all hover:bg-[var(--sbi-blue)]/90 hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(0,131,108,0.25)] active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--sbi-blue)] hover:text-[var(--sbi-royal)] transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Quick Demo Helper */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                handleLogin(undefined, "aarav.sharma@idbi.co.in", "demo1234");
              }}
              className="w-full py-2 rounded-2xl border border-dashed border-[var(--sbi-blue)]/30 text-xs font-semibold text-[var(--sbi-blue)] bg-[var(--sbi-blue)]/5 hover:bg-[var(--sbi-blue)]/10 hover:border-[var(--sbi-blue)]/50 transition-all text-center block disabled:opacity-50"
            >
              💡 One-click Demo Login
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground/75 border-t border-slate-100/60 pt-4 pb-2 max-w-5xl mx-auto w-full animate-[fadeIn_0.5s_ease-out]">
        <p>© {new Date().getFullYear()} IDBI Bank. Safe, Secure, & Regulated.</p>
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
