"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, Crown, User } from "lucide-react";
import { userApi } from "@/lib/api/user.api";
import { membershipApi } from "@/lib/api/membership.api";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import type { Profile, Membership } from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, m] = await Promise.allSettled([
          userApi.getMyProfile(),
          membershipApi.myMembership(),
        ]);
        if (p.status === "fulfilled") setProfile(p.value);
        else setNoProfile(true);
        if (m.status === "fulfilled") setMembership(m.value);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-40" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="gold-line font-display text-2xl md:text-3xl text-maroon">Welcome back</h1>

      {/* No profile yet */}
      {noProfile && (
        <div className="bg-gold/10 border border-gold/30 rounded-2xl p-6 text-center">
          <p className="font-display text-lg text-maroon mb-2">Complete your profile</p>
          <p className="text-muted text-sm mb-4">Create your profile to start searching and connecting.</p>
          <Link href="/my-profile"><Button variant="gold">Create Profile</Button></Link>
        </div>
      )}

      {/* Premium banner */}
      <div className={`rounded-2xl p-6 ${membership?.isPremium ? "bg-gradient-to-br from-maroon to-maroon-dark text-white" : "bg-white border border-line"}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Crown className={membership?.isPremium ? "text-gold-light" : "text-gold"} />
            <div>
              <p className={`font-display text-lg ${membership?.isPremium ? "text-white" : "text-maroon"}`}>
                {membership?.isPremium ? "Premium Member" : "Free Member"}
              </p>
              <p className={`text-sm ${membership?.isPremium ? "text-[#EAD9C9]" : "text-muted"}`}>
                {membership?.isPremium
                  ? `Valid till ${membership.subscriptionExpiresAt ? new Date(membership.subscriptionExpiresAt).toLocaleDateString() : ""}`
                  : "Upgrade to view contact details"}
              </p>
            </div>
          </div>
          {!membership?.isPremium && <Link href="/membership"><Button variant="gold">Upgrade</Button></Link>}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: "/search", icon: Search, label: "Search" },
          { href: "/interests", icon: Heart, label: "Interests" },
          { href: "/my-profile", icon: User, label: "My Profile" },
          { href: "/membership", icon: Crown, label: "Membership" },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="card card-hover p-5 text-center">
            <Icon className="mx-auto text-maroon mb-2" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
