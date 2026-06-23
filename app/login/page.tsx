"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { FaChrome } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin, useSignup, usePasswordReset } from "@/hooks/useAuth";
import { useHandleGoogleSuccess } from "@/lib/handleGoogleSuccess";

/**
 * Design tokens — streetwear / bold (matches Nav, Hero, Shop, Product, Cart, Checkout)
 * Color: #0A0A0A (ink), #FAFAF7 (paper), #D4FF3D (acid lime), #FF4D00 (signal orange)
 * Signature: split layout — left half is a full-bleed black brand panel with
 * the rotated wordmark tag (echoes Nav logo), right half is the form on paper.
 * On mobile collapses to single column, brand panel shrinks to a header strip.
 */

const inputClass = (hasError: string | null) =>
  [
    "w-full bg-[#FAFAF7] border-3 px-4 py-3 text-[14px] font-bold text-[#0A0A0A]",
    "placeholder:text-[#0A0A0A]/35 outline-none transition-shadow",
    hasError
      ? "border-[#FF4D00] focus:shadow-[3px_3px_0_0_#FF4D00]"
      : "border-[#0A0A0A] focus:shadow-[3px_3px_0_0_#0A0A0A]",
  ].join(" ");

const TABS = ["Login", "Sign up"];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/50 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-[11px] font-black uppercase text-[#FF4D00]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync: login, isPending: isLoginPending } = useLogin();
  const { mutateAsync: signup, isPending: isSignupPending } = useSignup();
  const { mutateAsync: resetPassword, isPending: isResetPending } =
    usePasswordReset();

  const isPending = isLoginPending || isSignupPending || isResetPending;

  const [tab, setTab] = useState("Login");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");   // Login only
  const [password1, setPassword1] = useState(""); // Sign up only
  const [password2, setPassword2] = useState(""); // Sign up only
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const handleGoogleSuccess = useHandleGoogleSuccess(
    (msg: string, type: "success" | "error") => {
      if (type === "success") toast.success(msg);
      else toast.error(msg);
    },
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email.includes("@")) next.email = "Enter a valid email";
    if (forgotMode)
      return Object.keys(next).length === 0
        ? (setErrors(next), true)
        : (setErrors(next), false);
    if (tab === "Login") {
      if (password.length < 6) next.password = "Min. 6 characters";
    } else {
      if (!fullName.trim()) next.fullName = "Enter your full name";
      if (password1.length < 6) next.password1 = "Min. 6 characters";
      if (password2 !== password1) next.password2 = "Passwords don't match";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (forgotMode) {
      try {
        await resetPassword(email);
        setForgotSent(true);
      } catch {
        toast.error("فشل إرسال رابط إعادة التعيين، حاول مجدداً");
      }
      return;
    }

    try {
      if (tab === "Login") {
        await login({ email, password });
        toast.success("تم تسجيل الدخول بنجاح ✓");
      } else {
        await signup({ full_name: fullName, email, password1, password2 });
        toast.success("تم إنشاء الحساب بنجاح ✓");
      }
      router.push("/");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.non_field_errors ||
        (tab === "Login"
          ? "فشل تسجيل الدخول، تحقق من البيانات"
          : "فشل إنشاء الحساب، حاول مجدداً");
      toast.error(String(msg));
    }
  };

  const switchTab = (t: string) => {
    setTab(t);
    setErrors({});
    setEmail("");
    setFullName("");
    setPassword("");
    setPassword1("");
    setPassword2("");
    setForgotMode(false);
    setForgotSent(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0A0A0A] p-12 relative overflow-hidden">
        {/* Diagonal stripe texture */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg,#D4FF3D 0px,#D4FF3D 2px,transparent 2px,transparent 36px)",
          }}
        />

        {/* Logo tag */}
        <Link href="/" className="relative inline-block self-start">
          <div
            className="-rotate-2 bg-[#D4FF3D] px-4 py-1.5 border-3 border-[#D4FF3D] inline-block"
            style={{ borderWidth: 3 }}
          >
            <span
              className="block text-[22px] leading-none text-[#0A0A0A] font-black tracking-tighter"
              style={{
                fontFamily: "'Arial Black','Helvetica Neue',sans-serif",
              }}
            >
              RIOT CO.
            </span>
          </div>
        </Link>

        {/* Middle copy */}
        <div className="relative">
          <span className="inline-block bg-[#FF4D00] text-[#0A0A0A] text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rotate-1 mb-5">
            Drop 004 — live now
          </span>
          <h2
            className="text-[#FAFAF7] font-black uppercase leading-[0.85] tracking-tighter"
            style={{
              fontFamily: "'Arial Black','Helvetica Neue',sans-serif",
              fontSize: "clamp(2.5rem,4vw,4rem)",
            }}
          >
            Members get
            <br />
            <span className="text-[#D4FF3D]">first dibs</span>
            <br />
            every drop
          </h2>
          <p className="mt-5 text-[13px] font-bold text-[#FAFAF7]/50 uppercase tracking-wide max-w-xs">
            Early access, restock alerts, and exclusive member pricing. No inbox
            spam.
          </p>
        </div>

        {/* Bottom stamp */}
        <div className="relative">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#FAFAF7]/30">
            © 2026 Riot Co.
          </span>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-14">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden inline-block self-start mb-10">
          <div
            className="-rotate-2 bg-[#0A0A0A] px-4 py-1.5 inline-block"
            style={{ border: "3px solid #0A0A0A" }}
          >
            <span
              className="block text-[20px] leading-none text-[#FAFAF7] font-black tracking-tighter"
              style={{ fontFamily: "'Arial Black',sans-serif" }}
            >
              RIOT<span className="text-[#D4FF3D]">CO.</span>
            </span>
          </div>
        </Link>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {false ? (
            /* ── Success state ── */
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto bg-[#D4FF3D] border-3 border-[#0A0A0A] rounded-full flex items-center justify-center mb-5"
                style={{ borderWidth: 3 }}
              >
                <ArrowRight
                  size={24}
                  strokeWidth={3}
                  className="text-[#0A0A0A]"
                />
              </div>
              <h1 className="text-[22px] font-black uppercase text-[#0A0A0A] mb-2">
                {tab === "Login" ? "You're in" : "Account created"}
              </h1>
              <p className="text-[13px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide">
                Redirecting you to the drop…
              </p>
            </div>
          ) : forgotMode ? (
            /* ── Forgot password ── */
            <>
              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setForgotSent(false);
                  setErrors({});
                }}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]/50 hover:text-[#0A0A0A] mb-6 transition-colors"
              >
                <X size={13} strokeWidth={3} /> Back to login
              </button>
              <h1
                className="text-[28px] font-black uppercase leading-[0.9] tracking-tighter text-[#0A0A0A] mb-1"
                style={{ fontFamily: "'Arial Black',sans-serif" }}
              >
                Reset password
              </h1>
              <p className="text-[13px] font-bold text-[#0A0A0A]/50 uppercase tracking-wide mb-8">
                We&apos;ll send a reset link to your inbox.
              </p>
              {forgotSent ? (
                <div
                  className="bg-[#D4FF3D] border-3 border-[#0A0A0A] px-4 py-3 text-[13px] font-black uppercase"
                  style={{ borderWidth: 3 }}
                >
                  Link sent — check your inbox.
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <Field label="Email" error={errors.email}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({});
                      }}
                      placeholder="your@email.com"
                      className={inputClass(errors.email)}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 bg-[#0A0A0A] text-[#FAFAF7] py-3.5 text-[13px] font-black uppercase tracking-wide hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  >
                    Send reset link <ArrowRight size={15} strokeWidth={3} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ── Login / Sign up ── */
            <>
              <h1
                className="text-[32px] sm:text-[36px] font-black uppercase leading-[0.85] tracking-tighter text-[#0A0A0A] mb-8"
                style={{
                  fontFamily: "'Arial Black','Helvetica Neue',sans-serif",
                }}
              >
                {tab === "Login" ? "Welcome back." : "Join the crew."}
              </h1>

              {/* Tab switcher */}
              <div
                className="flex border-3 border-[#0A0A0A] mb-8"
                style={{ borderWidth: 3 }}
              >
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => switchTab(t)}
                    className={[
                      "flex-1 py-2.5 text-[12px] font-black uppercase tracking-wide transition-colors",
                      tab === t
                        ? "bg-[#0A0A0A] text-[#D4FF3D]"
                        : "bg-[#FAFAF7] text-[#0A0A0A] hover:bg-[#0A0A0A]/5",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Social login */}
              <div className="flex flex-col gap-3 mb-7">
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={(res) =>
                      res.credential && handleGoogleSuccess(res.credential)
                    }
                    onError={() => toast.error("فشل تسجيل الدخول بـ Google")}
                    theme="outline"
                    shape="rectangular"
                    width="360"
                  />
                </div>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 border-3 border-[#0A0A0A] py-3 text-[12px] font-black uppercase tracking-wide text-[#0A0A0A] hover:bg-[#0A0A0A]/5 active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  style={{ borderWidth: 3 }}
                >
                  {/* Apple icon (SVG inline, no external dep) */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.28.07 2.18.78 2.97.79.96-.17 1.88-.79 3.07-.68 1.28.12 2.37.63 3.03 1.62-2.82 1.65-2.13 5.44.93 6.36-.48 1.49-1.11 2.97-2 3.77ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
                  </svg>
                  Continue with Apple
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-7">
                <span className="flex-1 h-px bg-[#0A0A0A]/10" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0A0A0A]/40">
                  or
                </span>
                <span className="flex-1 h-px bg-[#0A0A0A]/10" />
              </div>

              {/* Email + password form */}
              <div className="flex flex-col gap-5">
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((p) => ({ ...p, email: null }));
                    }}
                    placeholder="your@email.com"
                    className={inputClass(errors.email)}
                  />
                </Field>

                {/* Full name — Sign up only */}
                {tab === "Sign up" && (
                  <Field label="Full name" error={errors.fullName}>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors((p) => ({ ...p, fullName: null }));
                      }}
                      placeholder="Ahmed Mohamed"
                      className={inputClass(errors.fullName)}
                    />
                  </Field>
                )}

                {/* Password — Login uses `password`, Sign up uses `password1` */}
                <Field
                  label="Password"
                  error={tab === "Sign up" ? errors.password1 : errors.password}
                >
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={tab === "Sign up" ? password1 : password}
                      onChange={(e) => {
                        if (tab === "Sign up") {
                          setPassword1(e.target.value);
                          setErrors((p) => ({ ...p, password1: null }));
                        } else {
                          setPassword(e.target.value);
                          setErrors((p) => ({ ...p, password: null }));
                        }
                      }}
                      placeholder="Min. 6 characters"
                      className={[
                        inputClass(tab === "Sign up" ? errors.password1 : errors.password),
                        "pr-12",
                      ].join(" ")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? (
                        <EyeOff size={17} strokeWidth={2} />
                      ) : (
                        <Eye size={17} strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </Field>

                {/* Confirm password — Sign up only */}
                {tab === "Sign up" && (
                  <Field label="Confirm password" error={errors.password2}>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={password2}
                        onChange={(e) => {
                          setPassword2(e.target.value);
                          setErrors((p) => ({ ...p, password2: null }));
                        }}
                        placeholder="Same password again"
                        className={[inputClass(errors.password2), "pr-12"].join(" ")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? (
                          <EyeOff size={17} strokeWidth={2} />
                        ) : (
                          <Eye size={17} strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </Field>
                )}

                {tab === "Login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(true);
                      setErrors({});
                    }}
                    className="self-start text-[11px] font-black uppercase tracking-wide text-[#0A0A0A]/50 hover:text-[#FF4D00] transition-colors -mt-2"
                  >
                    Forgot password?
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 bg-[#0A0A0A] text-[#FAFAF7] py-3.5 text-[13px] font-black uppercase tracking-wide hover:bg-[#FF4D00] hover:text-[#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isPending
                    ? "جاري..."
                    : tab === "Login"
                      ? "Log in"
                      : "Create account"}
                  <ArrowRight size={15} strokeWidth={3} />
                </button>

                {tab === "Sign up" && (
                  <p className="text-[10px] font-bold text-[#0A0A0A]/40 uppercase tracking-wide text-center">
                    By signing up you agree to our Terms and Privacy policy.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
