"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

// App load pe localStorage se auth state restore karta hai (ek baar).
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);
  return <>{children}</>;
}
