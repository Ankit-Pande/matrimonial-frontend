"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Heart, User, CreditCard } from "lucide-react";

// Mobile app-area bottom tab bar (Android jaisa feel). Desktop pe hidden.
const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/interests", label: "Interests", icon: Heart },
  { href: "/membership", label: "Premium", icon: CreditCard },
  { href: "/my-profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-line flex">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${active ? "text-maroon" : "text-muted"}`}>
            <Icon size={20} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
