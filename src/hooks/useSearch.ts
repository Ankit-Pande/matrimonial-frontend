"use client";
import { useState, useCallback } from "react";
import { searchApi, SearchParams } from "@/lib/api/search.api";
import { getApiError } from "@/lib/api/client";
import type { Profile } from "@/types";

// Search logic: filters, cursor pagination (load more), loading/error state.
export function useSearch() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<SearchParams>({});

  // Pehli search (filters apply) — list reset.
  const runSearch = useCallback(async (newFilters: SearchParams) => {
    setLoading(true); setError(""); setFilters(newFilters);
    try {
      const res = await searchApi.search({ ...newFilters, limit: 20 });
      setProfiles(res.profiles);
      setCursor(res.nextCursor);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more (cursor pagination) — list me append.
  const loadMore = useCallback(async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const res = await searchApi.search({ ...filters, cursor, limit: 20 });
      setProfiles((prev) => [...prev, ...res.profiles]);
      setCursor(res.nextCursor);
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, filters]);

  return { profiles, loading, error, hasMore: !!cursor, runSearch, loadMore };
}
