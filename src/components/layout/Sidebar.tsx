"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Heart, User, CreditCard, Settings } from "lucide-react";

// App-area sidebar (desktop). Mobile pe BottomNav use hota hai.
const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/interests", label: "Interests", icon: Heart },
  { href: "/my-profile", label: "My Profile", icon: User },
  { href: "/membership", label: "Membership", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-line min-h-[calc(100vh-72px)] p-4 gap-1">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-maroon/10 text-maroon" : "text-ink hover:bg-cream"}`}>
            <Icon size={18} /> {label}
          </Link>
        );
      })}
    </aside>
  );
}
