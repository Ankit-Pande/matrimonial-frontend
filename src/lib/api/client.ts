import axios from "axios";
import { API_URL } from "@/config/constants";

// Token localStorage me (backend header-based hai, cookie nahi).
const ACCESS = "accessToken";
const REFRESH = "refreshToken";

export const tokenStore = {
  getAccess: () => (typeof window !== "undefined" ? localStorage.getItem(ACCESS) : null),
  getRefresh: () => (typeof window !== "undefined" ? localStorage.getItem(REFRESH) : null),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS, access);
    localStorage.setItem(REFRESH, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Har request pe access token header me attach.
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 pe ek baar refresh try karo, phir original request dobara.
// Refresh bhi fail -> logout (token clear, login pe bhej do).
let refreshing = false;
let queue: ((token: string | null) => void)[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Sirf /auth/me ya /user/me pe "user not found" aaye to logout (apna account gaya).
    // Dusre profile/interest pe "User not found" se logout NAHI karna.
    const msg = error.response?.data?.message || "";
    const url = original?.url || "";
    const isOwnAccountCheck = url.includes("/user/me") || url.includes("/auth/me");
    if (error.response?.status === 404 && isOwnAccountCheck && /user not found/i.test(msg)) {
      tokenStore.clear();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      tokenStore.clear();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(error);
    }

    original._retry = true;

    // Parallel 401s -> ek hi refresh chale, baaki wait karein.
    if (refreshing) {
      return new Promise((resolve, reject) => {
        queue.push((token) => {
          if (token) {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          } else reject(error);
        });
      });
    }

    refreshing = true;
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
        refreshToken,
      });
      tokenStore.set(data.accessToken, data.refreshToken);
      queue.forEach((cb) => cb(data.accessToken));
      queue = [];
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (err) {
      queue.forEach((cb) => cb(null));
      queue = [];
      tokenStore.clear();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      refreshing = false;
    }
  }
);

// Backend error message nikalne ka helper.
export const getApiError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || "Something went wrong";
  }
  return "Something went wrong";
};
