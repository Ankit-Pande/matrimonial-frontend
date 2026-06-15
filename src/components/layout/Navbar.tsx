"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

// Public + top navbar. Login state pe links badalte hain.
export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Find Partner" },
    { href: "/membership", label: "Membership" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="glass border-b border-line/70 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-11 arch-sm bg-gradient-to-b from-maroon to-maroon-deep grid place-items-center text-gold-light text-xl border border-gold/40">वि</div>
          <div className="leading-tight">
            <div className="font-display font-bold text-maroon text-lg">Var Kanya Parichay</div>
            <div className="text-[10px] tracking-widest text-muted uppercase">Marriage Bureau</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7 font-medium text-[15px]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="relative hover:text-maroon transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gold after:transition-all hover:after:w-full">{l.label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role !== "USER" && (
                <Link href="/admin"><Button variant="gold">Admin Panel</Button></Link>
              )}
              <Link href="/dashboard"><Button variant="ghost">Dashboard</Button></Link>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost">Login</Button></Link>
              <Link href="/login"><Button variant="gold">Register Free</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden text-maroon" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-white px-5 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-1" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {user ? (
            <>
              {user.role !== "USER" && (
                <Link href="/admin" className="block py-1 font-semibold text-maroon" onClick={() => setOpen(false)}>Admin Panel</Link>
              )}
              <Link href="/dashboard" className="block py-1" onClick={() => setOpen(false)}>Dashboard</Link>
              <Button variant="primary" className="w-full" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Link href="/login"><Button variant="gold" className="w-full">Register / Login</Button></Link>
          )}
        </div>
      )}
    </nav>
  );
}
