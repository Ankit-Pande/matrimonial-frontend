import { create } from "zustand";
import { tokenStore } from "@/lib/api/client";
import type { AuthUser } from "@/types";

// Global auth state. Login/logout yahin se. Token localStorage me (client.ts).
interface AuthState {
  user: AuthUser | null;
  isReady: boolean; // app load pe localStorage check hua ya nahi
  setAuth: (user: AuthUser, access: string, refresh: string) => void;
  loadFromStorage: () => void;
  logout: () => void;
}

const USER_KEY = "authUser";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isReady: false,
  setAuth: (user, access, refresh) => {
    tokenStore.set(access, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },
  loadFromStorage: () => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;
    const token = tokenStore.getAccess();
    set({ user: raw && token ? JSON.parse(raw) : null, isReady: true });
  },
  logout: () => {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    set({ user: null });
  },
}));
