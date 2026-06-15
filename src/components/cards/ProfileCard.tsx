"use client";
import Link from "next/link";
import { Lock, Heart, BadgeCheck, MapPin } from "lucide-react";
import type { Profile } from "@/types";
import { Button } from "@/components/ui/Button";

// Search result card — photo jharokha-arch frame me (is design ki pehchaan).
// Photo lock backend ki privacy ke hisaab se (photoLocked).
export function ProfileCard({ profile, onInterest }: {
  profile: Profile;
  onInterest?: (id: string) => void;
}) {
  const photo = profile.photos?.[0];
  const locked = profile.photoLocked || !photo;

  return (
    <div className="card card-hover overflow-hidden">
      <Link href={`/profile/${profile.id}`}>
        {/* Arch frame — upar se gol, mandap jaisa */}
        <div className="pt-5 px-5">
          <div className="arch overflow-hidden h-52 bg-gradient-to-br from-[#EFE2CC] to-[#DEC9AE] grid place-items-center text-maroon text-5xl relative border-[3px] border-gold-light/60">
            {locked ? (
              <>
                {profile.gender === "FEMALE" ? "👰" : "🤵"}
                <div className="absolute inset-0 bg-maroon-deep/45 backdrop-blur-sm grid place-items-center text-white">
                  <div className="text-center">
                    <Lock className="mx-auto" size={20} />
                    <span className="text-[11px] bg-gold text-[#3A2A10] px-3 py-1 rounded-full font-semibold mt-2 inline-block">Premium to view</span>
                  </div>
                </div>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={profile.name} className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      </Link>

      <div className="p-5 pt-3.5 text-center">
        <h4 className="font-display text-lg flex items-center justify-center gap-1">
          {profile.name}
          {profile.isPremiumMember && (
            <BadgeCheck size={16} className="text-sky-500 shrink-0" aria-label="Premium verified member" />
          )}
        </h4>
        <div className="text-[13px] text-muted mt-0.5 mb-3 flex items-center justify-center gap-1">
          {profile.age ? `${profile.age} yrs` : ""}
          {profile.city && (
            <>
              <span className="text-line">·</span>
              <MapPin size={12} className="shrink-0" /> {profile.city}
            </>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap justify-center mb-4">
          {profile.religion && <Tag>{profile.religion}</Tag>}
          {profile.jobTitle && <Tag>{profile.jobTitle}</Tag>}
          {profile.maritalStatus && <Tag>{profile.maritalStatus.replace(/_/g, " ")}</Tag>}
        </div>
        {onInterest && (
          <Button variant="primary" className="w-full text-sm py-2 press" onClick={() => onInterest(profile.id)}>
            <Heart size={15} /> Express Interest
          </Button>
        )}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="text-[11.5px] bg-maroon/10 text-maroon px-2.5 py-0.5 rounded-full font-medium">{children}</span>;
}
