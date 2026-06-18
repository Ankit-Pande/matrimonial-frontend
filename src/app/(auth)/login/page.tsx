"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/authStore";
import { getApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Login/Register — ek hi OTP flow (backend find-or-create karta hai).
export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  const sendOtp = async () => {
    setError(""); setLoading(true);
    try {
      const res = await authApi.sendOtp(phone);
      // Demo deploy (bina SMS service) — OTP yahin dikha do.
      if (res?.demoOtp) setDemoOtp(res.demoOtp);
      setStep("otp");
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setError(""); setLoading(true);
    try {
      const res = await authApi.verifyOtp(phone, otp);
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.replace("/dashboard");
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* left brand panel */}
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-maroon-deep via-maroon to-maroon-dark p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 arch w-28 h-40 border-2 border-gold-light/30 pointer-events-none" />
        <Link href="/" className="font-display text-2xl text-gold-light mb-auto">Var Kanya Parichay</Link>
        <div>
          <h2 className="font-display text-4xl leading-tight">Begin your journey to <span className="text-gold-light italic">forever</span>.</h2>
          <p className="text-[#EAD9C9] mt-4 max-w-sm">Join a trusted community where families find the right match with privacy and care.</p>
        </div>
        <div className="mt-auto text-[#D8C4B4] text-sm">✦ 1000+ verified profiles · 100% privacy</div>
      </div>

      {/* right form */}
      <div className="flex items-center justify-center p-6 bg-cream">
        <div className="w-full max-w-sm">
          {/* Mobile pe arch logo + brand (left panel hidden hota hai) */}
          <Link href="/" className="md:hidden flex flex-col items-center mb-6">
            <div className="w-14 h-16 arch bg-gradient-to-b from-maroon to-maroon-deep grid place-items-center text-gold-light text-2xl border border-gold/40 mb-2">वि</div>
            <span className="font-display text-xl text-maroon">Var Kanya Parichay</span>
          </Link>

          <div className="card p-6 md:p-7 shadow-lift">
            <h1 className="font-display text-3xl text-maroon mb-2">
              {step === "phone" ? "Login / Register" : "Verify OTP"}
            </h1>
            <p className="text-muted text-sm mb-6">
              {step === "phone" ? "Enter your mobile number to continue" : `OTP sent to ${phone}`}
            </p>

            {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

            {step === "phone" ? (
              <div className="space-y-4">
                <Input label="Mobile Number" placeholder="9876543210" value={phone}
                  onChange={(e) => setPhone(e.target.value)} inputMode="numeric" />
                <Button variant="gold" className="w-full" loading={loading}
                  onClick={sendOtp} disabled={phone.length < 10}>Send OTP</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {demoOtp && (
                  <div className="bg-gold/10 border border-gold/40 rounded-xl px-4 py-3 text-center">
                    <p className="text-xs text-muted">Demo mode — your OTP is</p>
                    <p className="font-display text-2xl text-maroon tracking-widest">{demoOtp}</p>
                  </div>
                )}
                <Input label="Enter 6-digit OTP" placeholder="••••••" value={otp}
                  onChange={(e) => setOtp(e.target.value)} inputMode="numeric" maxLength={6} />
                <Button variant="gold" className="w-full" loading={loading}
                  onClick={verify} disabled={otp.length !== 6}>Verify & Continue</Button>
                <button onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                  className="text-sm text-muted hover:text-maroon w-full text-center">← Change number</button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted mt-5">
            By continuing you agree to our terms & privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
