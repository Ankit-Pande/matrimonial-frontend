"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, UserPlus, CreditCard, LogOut, Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";

// Admin area — sirf ADMIN aur SUPER_ADMIN. Baaki ko bhaga do.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isReady } = useAuthStore();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!user) router.replace("/login");
    else if (user.role === "USER") router.replace("/dashboard");
  }, [user, isReady, router]);

  if (!isReady || !user || user.role === "USER") {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="w-10 h-10 rounded-full border-2 border-maroon border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile top bar — sidebar choti screen pe yahan se khulta hai */}
      <div className="md:hidden flex items-center justify-between bg-maroon text-white px-4 py-3 sticky top-0 z-20">
        <span className="font-display">Admin Panel</span>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar — desktop pe hamesha, mobile pe toggle */}
        <aside className={`${open ? "block" : "hidden"} md:block w-full md:w-60 bg-maroon text-white md:min-h-screen py-6 px-4 shrink-0 absolute md:static z-10`}>
          <div className="hidden md:block font-display text-lg mb-1">Var Kanya Parichay</div>
          <div className="hidden md:block text-xs text-gold mb-8">Admin Panel</div>
          <nav className="space-y-1">
            <AdminLink href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setOpen(false)} />
            <AdminLink href="/admin/users" icon={<Users size={18} />} label="Users" onClick={() => setOpen(false)} />
            <AdminLink href="/admin/add-profile" icon={<UserPlus size={18} />} label="Add Profile" onClick={() => setOpen(false)} />
            <AdminLink href="/admin/plans" icon={<CreditCard size={18} />} label="Plans" onClick={() => setOpen(false)} />
          </nav>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-white/80 hover:text-white py-2 mt-4">
            <LogOut size={18} /> Logout
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1 p-5 md:p-10 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}

function AdminLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/85 hover:bg-white/10 transition-colors">
      {icon} {label}
    </Link>
  );
}
