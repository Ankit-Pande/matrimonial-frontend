import { api } from "./client";
import type { LoginResponse } from "@/types";

export const authApi = {
  sendOtp: (phone: string) =>
    api.post("/auth/send-otp", { phone }).then((r) => r.data as { demoOtp?: string }),
  verifyOtp: (phone: string, otp: string) =>
    api.post<LoginResponse>("/auth/verify-otp", { phone, otp }).then((r) => r.data),
  logout: (refreshToken: string) =>
    api.post("/auth/logout", { refreshToken }).then((r) => r.data),
};
