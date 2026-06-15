"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

// App-area pages ko wrap karta hai. Login nahi to /login bhej do.
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isReady } = useAuthStore();

  useEffect(() => {
    if (!isReady) return;
    if (!user) router.replace("/login");
  }, [user, isReady, router]);

  if (!isReady || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="w-10 h-10 rounded-full border-2 border-maroon border-t-transparent animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
