"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lock, Phone, Heart, BadgeCheck } from "lucide-react";
import { searchApi } from "@/lib/api/search.api";
import { interestApi } from "@/lib/api/interest.api";
import { getApiError } from "@/lib/api/client";
import { Toast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import type { Profile } from "@/types";

export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    (async () => {
      try { setProfile(await searchApi.getProfile(id)); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="space-y-4 max-w-3xl"><Skeleton className="h-72" /><Skeleton className="h-40" /></div>;
  if (!profile) return <p className="text-center text-muted py-12">Profile not found.</p>;

  const photo = profile.photos?.[0];
  const sendInterest = async () => {
    try {
      await interestApi.send(profile.id);
      setToast("Interest sent!");
    } catch (err) {
      setToast(getApiError(err));
    }
  };

  const Field = ({ label, value }: { label: string; value?: string | number | null }) =>
    value ? (
      <div className="flex justify-between py-2.5 border-b border-line last:border-0">
        <span className="text-muted text-sm">{label}</span>
        <span className="font-medium text-sm">{value}</span>
      </div>
    ) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <Toast message={toast} onClose={() => setToast("")} />
      <div className="card overflow-hidden">
        <div className="arch overflow-hidden mx-auto mt-6 max-w-sm h-80 bg-gradient-to-br from-[#EFE2CC] to-[#DEC9AE] grid place-items-center text-maroon text-6xl relative border-[3px] border-gold-light/60">
          {profile.photoLocked || !photo ? (
            <>
              <span className="font-display text-7xl text-maroon/30">{profile.name?.[0]?.toUpperCase() || "?"}</span>
              <div className="absolute inset-0 bg-maroon-deep/40 backdrop-blur-sm grid place-items-center text-white">
                <div className="text-center"><Lock className="mx-auto" /><span className="text-xs bg-gold text-[#3A2A10] px-3 py-1 rounded-full font-semibold mt-2 inline-block">Premium to view photo</span></div>
              </div>
            </>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={profile.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="p-6">
          <h1 className="font-display text-2xl text-maroon flex items-center gap-1.5">{profile.name}{profile.isPremiumMember && <BadgeCheck size={20} className="text-sky-500" aria-label="Premium verified member" />}</h1>
          <p className="text-muted text-sm mt-1">{profile.age} yrs • {profile.city}, {profile.state}</p>

          {/* Contact (premium gated by backend serializer) */}
          <div className="mt-4 mb-5">
            {profile.contactLocked ? (
              <div className="flex items-center gap-2 bg-cream rounded-lg px-4 py-3 text-muted text-sm">
                <Lock size={16} /> Contact number visible to premium members
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-green-50 rounded-lg px-4 py-3 text-green-700 text-sm font-medium">
                <Phone size={16} /> {profile.contactNumber}
              </div>
            )}
          </div>

          <Button variant="primary" onClick={sendInterest}><Heart size={16} /> Express Interest</Button>

          {profile.aboutMe && <p className="text-muted text-sm mt-5 leading-relaxed">{profile.aboutMe}</p>}

          <div className="grid md:grid-cols-2 gap-x-8 mt-6">
            <div>
              <h3 className="font-display text-maroon mb-1 mt-4">Basic Details</h3>
              <Field label="Religion" value={profile.religion} />
              <Field label="Caste" value={profile.caste} />
              <Field label="Gotra" value={profile.gotra} />
              <Field label="Manglik" value={profile.manglikStatus?.replace(/_/g, " ")} />
              <Field label="Diet" value={profile.diet?.replace(/_/g, " ")} />
              <Field label="Marital Status" value={profile.maritalStatus?.replace(/_/g, " ")} />
              <Field label="Mother Tongue" value={profile.motherTongue} />
            </div>
            <div>
              <h3 className="font-display text-maroon mb-1 mt-4">Professional</h3>
              <Field label="Job" value={profile.jobTitle} />
              <Field label="Company" value={profile.companyName} />
              <Field label="Profession" value={profile.professionType?.replace(/_/g, " ")} />
              <Field label="Height" value={profile.height ? `${profile.height} cm` : null} />
              <Field label="Weight" value={profile.weight ? `${profile.weight} kg` : null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}