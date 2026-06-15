"use client";
import { useEffect, useState } from "react";
import { Users, Crown, Clock, Ban } from "lucide-react";
import { adminApi } from "@/lib/api/admin.api";
import { getApiError } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AdminStats } from "@/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .stats()
      .then((s) => setStats(s))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="gold-line font-display text-2xl md:text-3xl text-maroon mb-6">Dashboard</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card icon={<Users />} label="Total Users" value={stats.total} />
          <Card icon={<Crown />} label="Premium" value={stats.premium} />
          <Card icon={<Clock />} label="Pending Approval" value={stats.pending} />
          <Card icon={<Ban />} label="Blocked" value={stats.blocked} />
        </div>
      ) : null}
    </div>
  );
}

function Card({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="card p-5">
      <div className="text-gold-dark mb-3">{icon}</div>
      <div className="font-display text-3xl text-maroon">{value}</div>
      <div className="text-muted text-sm mt-1">{label}</div>
    </div>
  );
}
