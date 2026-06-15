"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Phone, ShieldCheck, HelpCircle, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { membershipApi } from "@/lib/api/membership.api";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Membership } from "@/types";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  // Premium status backend se lao.
  useEffect(() => {
    membershipApi
      .myMembership()
      .then((m) => setMembership(m))
      .catch(() => setMembership(null))
      .finally(() => setLoading(false));
  }, []);

  // Premium kab tak hai, padhne layak date.
  const expiryText = membership?.subscriptionExpiresAt
    ? new Date(membership.subscriptionExpiresAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <div className="max-w-lg">
      <h1 className="gold-line font-display text-2xl md:text-3xl text-maroon mb-2">Settings</h1>
      <p className="text-muted text-sm mb-5">Manage your account and membership.</p>

      {/* Account */}
      <div className="card p-5 mb-4">
        <h3 className="font-display text-maroon mb-3">Account</h3>
        <Row icon={<Phone size={16} />} label="Mobile" value={user?.phone ?? "—"} />
        <Row icon={<ShieldCheck size={16} />} label="Account Type" value={user?.role ?? "USER"} />
      </div>

      {/* Membership */}
      <div className="card p-5 mb-4">
        <h3 className="font-display text-maroon mb-3">Membership</h3>
        {loading ? (
          <Skeleton className="h-12" />
        ) : membership?.isPremium ? (
          <div className="flex items-center justify-between bg-gold/10 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-maroon font-medium text-sm">
              <Crown size={18} className="text-gold-dark" /> Premium Member
            </div>
            {expiryText && <span className="text-xs text-muted">Valid till {expiryText}</span>}
          </div>
        ) : (
          <div className="flex items-center justify-between bg-cream rounded-xl px-4 py-3">
            <span className="text-sm text-muted">Free Member</span>
            <Link href="/membership">
              <Button variant="gold" className="text-sm py-1.5 px-4">Upgrade</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Help */}
      <div className="card p-5 mb-4">
        <h3 className="font-display text-maroon mb-3">Help & Info</h3>
        <Link href="/about" className="flex items-center gap-3 py-2.5 border-b border-line text-sm hover:text-maroon">
          <HelpCircle size={16} /> About Us
        </Link>
        <a href="mailto:info@varkanya.com" className="flex items-center gap-3 py-2.5 border-b border-line text-sm hover:text-maroon">
          <Phone size={16} /> Contact Support
        </a>
        <Link href="/about" className="flex items-center gap-3 py-2.5 text-sm hover:text-maroon">
          <FileText size={16} /> Privacy & Terms
        </Link>
      </div>

      <Button variant="danger" className="w-full" onClick={logout}>
        <LogOut size={16} /> Logout
      </Button>
    </div>
  );
}

// Ek account detail line.
function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line last:border-0">
      <span className="flex items-center gap-2 text-muted text-sm">{icon} {label}</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}
