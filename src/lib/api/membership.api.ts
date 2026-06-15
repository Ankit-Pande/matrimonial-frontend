import { api } from "./client";
import type { Plan, Membership } from "@/types";

// Razorpay order ka jawab.
interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export const membershipApi = {
  // Active plans (price + discount) - membership page dikhane ke liye.
  listPlans: () =>
    api.get("/membership/plans").then((r) => r.data.plans as Plan[]),

  // Razorpay order banao (payment popup ke liye).
  createOrder: (planId: string) =>
    api.post("/membership/order", { planId }).then((r) => r.data as OrderResponse),

  // Payment hote hi signature verify — turant premium.
  verifyPayment: (orderId: string, paymentId: string, signature: string) =>
    api
      .post("/membership/verify", { orderId, paymentId, signature })
      .then((r) => r.data.membership as Membership),

  // Mera premium status.
  myMembership: () =>
    api.get("/membership/me").then((r) => r.data.membership as Membership),
};
