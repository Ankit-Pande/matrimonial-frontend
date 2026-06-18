import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";

// Social aur contact links ek jagah — baad me sirf yahan URL/number badalna hai.
// (Abhi placeholder hain; client ke real links yahin daal dena.)
const SOCIAL = [
  { icon: Instagram, url: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, url: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, url: "https://x.com", label: "X (Twitter)" },
  { icon: Youtube, url: "https://youtube.com", label: "YouTube" },
];

const CONTACT = {
  phone: "+91 98765 43210",
  email: "info@varkanya.com",
  address: "Pune, Maharashtra",
};

export function Footer() {
  return (
    <footer className="bg-maroon-deep text-[#D8C4B4] pt-14">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 pb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-11 arch-sm bg-gradient-to-b from-maroon to-maroon-dark grid place-items-center text-gold-light text-xl border border-gold/40">वि</div>
            <div className="font-display font-bold text-white">Var Kanya Parichay</div>
          </div>
          <p className="text-sm opacity-80 max-w-xs">India&apos;s trusted marriage bureau — verified profiles, complete privacy, and a personal touch for every family.</p>
          <div className="flex gap-2.5 mt-4">
            {SOCIAL.map(({ icon: Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-gold/10 grid place-items-center hover:bg-gold hover:text-maroon-deep transition-colors"
              >
                <Icon size={16} />
              </a>
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
            <li><Link href="/about" className="opacity-80 hover:opacity-100">Privacy Policy</Link></li>
            <li><Link href="/about" className="opacity-80 hover:opacity-100">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-gold-light text-xs tracking-widest uppercase mb-4">Contact</h5>
          <ul className="space-y-3 text-sm opacity-80">
            <li>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:opacity-100">
                <Phone size={14} /> {CONTACT.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:opacity-100">
                <Mail size={14} /> {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} /> {CONTACT.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/20 py-5 text-center text-sm opacity-70">
        © 2026 Var Kanya Parichay Kendra · Trusted matchmaking · Made with ♥ in India
      </div>
    </footer>
  );
}