"use client";
import { useEffect, useState } from "react";
import { interestApi } from "@/lib/api/interest.api";
import { InterestCard } from "@/components/cards/InterestCard";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Interest } from "@/types";

export default function InterestsPage() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [items, setItems] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (t: "received" | "sent") => {
    setLoading(true);
    try {
      const res = t === "received" ? await interestApi.received() : await interestApi.sent();
      setItems(res.interests);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(tab); }, [tab]);

  const respond = async (id: string, action: "ACCEPT" | "REJECT") => {
    await interestApi.respond(id, action);
    load(tab);
  };

  return (
    <div>
      <h1 className="gold-line font-display text-2xl md:text-3xl text-maroon mb-5">Interests</h1>
      <div className="flex gap-2 mb-5">
        {(["received", "sent"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${tab === t ? "bg-maroon text-white" : "bg-white border border-line text-ink"}`}>
            {t}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : items.length === 0 ? (
        <p className="text-center text-muted py-12">No {tab} interests yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => <InterestCard key={it.id} interest={it} type={tab} onRespond={respond} />)}
        </div>
      )}
    </div>
  );
}
