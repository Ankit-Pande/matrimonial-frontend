"use client";
import { useEffect, useState } from "react";
import { Check, Crown, BadgeCheck } from "lucide-react";
import { membershipApi } from "@/lib/api/membership.api";
import { getApiError } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import type { Plan } from "@/types";

// Razorpay popup ka type (window pe Razorpay aata hai script load hone par).
// Payment success pe Razorpay ye deta hai — isi se verify hota hai.
interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayPaymentResponse) => void;
  theme: { color: string };
  // Kaun se payment method allow honge.
  method: {
    upi: boolean;
    card: boolean;
    netbanking: boolean;
    wallet: boolean;
    emi: boolean;
    paylater: boolean;
  };
  // Kaun se payment method dikhenge ye yahan set hota hai.
  config: {
    display: {
      blocks: {
        [key: string]: {
          name: string;
          instruments: { method: string }[];
        };
      };
      sequence: string[];
      preferences: { show_default_blocks: boolean };
    };
  };
}
interface RazorpayInstance {
  open: () => void;
}
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// Plan ki har line me ye sab milta hai premium me.
// Free member kya kar sakta hai.
const FREE_FEATURES = [
  "Search & browse all profiles",
  "View basic profile details",
  "Send up to 3 interests",
];

// Premium member ko kya extra milta hai.
const PREMIUM_FEATURES = [
  "View contact numbers",
  "See all profile photos",
  "Unlimited interests",
  "Priority customer support",
];

export default function MembershipPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);

  // Plans backend se lao (price/discount DB se aate hain).
  useEffect(() => {
    membershipApi
      .listPlans()
      .then((p) => setPlans(p))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoadingPlans(false));
  }, []);

  // Razorpay ka script ek baar load karo.
  useEffect(() => {
    if (document.getElementById("razorpay-sdk")) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
  }, []);

  // Plan kharidne par Razorpay popup kholo.
  const buyPlan = async (planId: string, planName: string) => {
    if (!scriptReady) {
      setError("Payment is loading, please wait...");
      return;
    }
    setBuyingPlan(planId);
    setError("");
    try {
      const order = await membershipApi.createOrder(planId);
      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Var Kanya Parichay Kendra",
        description: `${planName} Membership`,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            // Signature verify — sahi hua to turant premium ban jaata hai.
            await membershipApi.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            window.location.href = "/dashboard?premium=1";
          } catch {
            setError("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#8B1E3F" },
        // Sirf UPI (GPay/PhonePe/Paytm) aur card allow karo.
        // method config se baaki (netbanking, wallet, emi, paylater) band.
        method: {
          upi: true,
          card: true,
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
        },
        config: {
          display: {
            blocks: {
              upiblock: {
                name: "Pay using UPI (GPay, PhonePe, Paytm)",
                instruments: [{ method: "upi" }],
              },
              cardblock: {
                name: "Credit / Debit Card",
                instruments: [{ method: "card" }],
              },
            },
            sequence: ["block.upiblock", "block.cardblock"],
            preferences: { show_default_blocks: false },
          },
        },
      });
      razorpay.open();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setBuyingPlan(null);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="gold-line gold-line-center inline-block font-display text-3xl text-maroon">Choose Your Plan</h1>
        <p className="text-muted mt-2">Upgrade to premium and unlock all features.</p>
      </div>

      {/* Free vs Premium - saaf saaf kaun kya kar sakta hai */}
      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
        <div className="card p-5">
          <h3 className="font-display text-lg text-ink mb-3">Free Member</h3>
          <ul className="space-y-2">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted">
                <Check size={16} className="text-green-600" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-maroon rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-display text-lg">Premium Member</h3>
            <BadgeCheck size={18} className="text-sky-300" />
          </div>
          <ul className="space-y-2">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/90">
                <Check size={16} className="text-gold-light" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

      {/* Plans load hone tak skeleton */}
      {loadingPlans ? (
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const hasDiscount = plan.discountPercent > 0;
            const price = plan.finalPricePaise / 100;
            const original = plan.pricePaise / 100;
            // Sabse lambe duration wale plan ko "Best Value" badge.
            const isBest = plan.durationDays === Math.max(...plans.map((p) => p.durationDays));

            return (
              <div
                key={plan.id}
                className={`card card-hover p-7 relative ${isBest ? "shadow-gold border-gold/40" : ""}`}
              >
                {isBest && (
                  <span className="absolute top-5 right-5 text-[11px] bg-gold text-[#3A2A10] px-3 py-1 rounded-full font-semibold">
                    Best Value
                  </span>
                )}
                <Crown className="text-gold mb-3" />
                <h3 className="font-display text-xl text-maroon">{plan.name}</h3>
                <p className="text-xs text-muted">{plan.durationDays} days access</p>

                <div className="my-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-ink">₹{price}</span>
                  {hasDiscount && (
                    <span className="text-sm text-muted line-through">₹{original}</span>
                  )}
                </div>

                {hasDiscount && (
                  <span className="inline-block text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-semibold mb-3">
                    {plan.discountPercent}% OFF
                  </span>
                )}

                <ul className="space-y-2 mb-6 mt-2">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted">
                      <Check size={16} className="text-green-600" /> {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isBest ? "gold" : "primary"}
                  className="w-full"
                  loading={buyingPlan === plan.id}
                  onClick={() => buyPlan(plan.id, plan.name)}
                >
                  Choose Plan
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
