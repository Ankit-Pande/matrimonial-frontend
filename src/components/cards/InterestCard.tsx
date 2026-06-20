"use client";
import Link from "next/link";
import type { Interest } from "@/types";
import { Button } from "@/components/ui/Button";

// Sent/received interest card. received pe accept/reject buttons.
export function InterestCard({ interest, type, onRespond }: {
  interest: Interest;
  type: "sent" | "received";
  onRespond?: (id: string, action: "ACCEPT" | "REJECT") => void;
}) {
  const other = type === "sent" ? interest.toUser : interest.fromUser;
  const name = other?.profile?.name || "Member";
  const photo = other?.profile?.photos?.[0];

  const statusColor = {
    PENDING: "text-gold", ACCEPTED: "text-green-600", REJECTED: "text-red-500",
  }[interest.status];

  return (
    <div className="card card-hover p-4 flex items-center gap-4">
      <div className="arch-sm w-14 h-16 border-2 border-gold-light/60 bg-gradient-to-b from-[#EFE2CC] to-[#DEC9AE] grid place-items-center text-2xl overflow-hidden shrink-0">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : <span className="font-display text-maroon/40">{name[0]?.toUpperCase()}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/profile/${other?.profile?.id}`} className="font-display text-base hover:text-maroon">{name}</Link>
        <div className={`text-xs font-semibold ${statusColor}`}>{interest.status}</div>
      </div>
      {type === "received" && interest.status === "PENDING" && onRespond && (
        <div className="flex gap-2">
          <Button variant="primary" className="text-xs py-1.5 px-3" onClick={() => onRespond(interest.id, "ACCEPT")}>Accept</Button>
          <Button variant="ghost" className="text-xs py-1.5 px-3" onClick={() => onRespond(interest.id, "REJECT")}>Reject</Button>
        </div>
      )}
    </div>
  );
}
