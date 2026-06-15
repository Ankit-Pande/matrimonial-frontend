import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-maroon-deep text-[#D8C4B4] pt-14">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 pb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon to-maroon-dark grid place-items-center text-gold-light text-xl">वि</div>
            <div className="font-display font-bold text-white">Var Kanya Parichay</div>
          </div>
          <p className="text-sm opacity-80 max-w-xs">India&apos;s trusted marriage bureau — verified profiles, complete privacy, and a personal touch for every family.</p>
          <div className="flex gap-2.5 mt-4">
            {[Facebook, Twitter, Linkedin, Youtube].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gold/10 grid place-items-center hover:bg-gold hover:text-maroon-deep transition-colors"><I size={16} /></a>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-gold-light text-xs tracking-widest uppercase mb-4">Quick Links</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="opacity-80 hover:opacity-100">Home</Link></li>
            <li><Link href="/search" className="opacity-80 hover:opacity-100">Find Partner</Link></li>
            <li><Link href="/membership" className="opacity-80 hover:opacity-100">Membership</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-gold-light text-xs tracking-widest uppercase mb-4">Company</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="opacity-80 hover:opacity-100">About Us</Link></li>
            <li><Link href="#" className="opacity-80 hover:opacity-100">Privacy Policy</Link></li>
            <li><Link href="#" className="opacity-80 hover:opacity-100">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-gold-light text-xs tracking-widest uppercase mb-4">Contact</h5>
          <ul className="space-y-2.5 text-sm opacity-80">
            <li>📞 +91 98765 43210</li>
            <li>✉ info@varkanya.com</li>
            <li>📍 Pune, Maharashtra</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/20 py-5 text-center text-sm opacity-70">
        © 2026 Var Kanya Parichay Kendra · Trusted matchmaking · Made with ♥ in India
      </div>
    </footer>
  );
}