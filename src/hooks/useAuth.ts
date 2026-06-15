"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth.api";
import { tokenStore } from "@/lib/api/client";

// Auth actions ek jagah — components seedha ye use karein.
export function useAuth() {
  const router = useRouter();
  const { user, isReady, setAuth, logout: clearAuth } = useAuthStore();

  const logout = async () => {
    const refresh = tokenStore.getRefresh();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // ignore — local clear anyway
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return { user, isReady, setAuth, logout };
}
