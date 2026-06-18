"use client";
import { useEffect, useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { interestApi } from "@/lib/api/interest.api";
import { getApiError } from "@/lib/api/client";
import { ProfileCard } from "@/components/cards/ProfileCard";
import { ProfileCardSkeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PROFESSION } from "@/config/constants";
import type { SearchParams } from "@/lib/api/search.api";

export default function SearchPage() {
  const { profiles, loading, error, hasMore, runSearch, loadMore } = useSearch();
  const [filters, setFilters] = useState<SearchParams>({});
  const [toast, setToast] = useState("");

  // Pehli baar page khulte hi saare profiles dikha do.
  useEffect(() => {
    runSearch({});
  }, [runSearch]);

  // Filter value set karo (khaali ho to us filter ko hata do).
  const setFilter = (key: keyof SearchParams, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  // Kisi profile me interest bhejo.
  const sendInterest = async (id: string) => {
    try {
      await interestApi.send(id);
      setToast("Interest sent!");
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  return (
    <div>
      <Toast message={toast} onClose={() => setToast("")} />

      <h1 className="gold-line font-display text-2xl md:text-3xl text-maroon mb-5">
        Find Your Match
      </h1>

      {/* Filters - simple: city, state, profession, caste */}
      <div className="card p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Input label="City" placeholder="Any" onChange={(e) => setFilter("city", e.target.value)} />
        <Input label="State" placeholder="Any" onChange={(e) => setFilter("state", e.target.value)} />
        <Select label="Profession" options={PROFESSION} placeholder="Any" onChange={(e) => setFilter("professionType", e.target.value)} />
        <Input label="Caste" placeholder="Any" onChange={(e) => setFilter("caste", e.target.value)} />
        <div className="col-span-2 md:col-span-4">
          <Button variant="primary" onClick={() => runSearch(filters)}>
            Apply Filters
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading && profiles.length === 0
          ? Array.from({ length: 6 }).map((_, i) => <ProfileCardSkeleton key={i} />)
          : profiles.map((p) => (
              <ProfileCard key={p.id} profile={p} onInterest={sendInterest} />
            ))}
      </div>

      {!loading && profiles.length === 0 && (
        <p className="text-center text-muted py-12">
          No profiles found. Try changing the filters.
        </p>
      )}

      {hasMore && (
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={loadMore} loading={loading}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
