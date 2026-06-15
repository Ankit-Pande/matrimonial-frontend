import Link from "next/link";
import { Sparkles, ShieldCheck, Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Homepage — SEO landing (server component). Mockup wala design.
export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-maroon-deep via-maroon to-maroon-dark overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-gold-light/10 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center py-16 md:py-20 relative z-10">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 bg-gold-light/10 border border-gold-light/30 text-gold-light px-4 py-1.5 rounded-full text-[13px] mb-5">✦ Trusted by 1000+ families</span>
            <h1 className="font-display text-white text-4xl md:text-5xl font-semibold leading-tight">
              Find Your <em className="text-gold-light not-italic font-medium italic">Life Partner</em> the Trusted Way
            </h1>
            <p className="text-[#EAD9C9] text-lg mt-5 mb-7 max-w-md">
              Verified profiles, complete privacy, and a personal touch from a marriage bureau your family can trust.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/login"><Button variant="gold">Register Now — It&apos;s Free</Button></Link>
              <Link href="/search"><Button variant="ghost" className="!text-white !border-white/30">Browse Profiles</Button></Link>
            </div>
            <div className="flex gap-8 mt-9">
              {[["1000+", "Verified Profiles"], ["250+", "Happy Marriages"], ["100%", "Privacy Assured"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl text-gold-light font-semibold">{n}</div>
                  <div className="text-xs text-[#D8C4B4]">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal hidden md:block" style={{ animationDelay: ".15s" }}>
            {/* Signature visual — do jharokha arch, beech me sunehra dhaaga (bandhan) */}
            <div className="relative flex items-end justify-center gap-6 py-4">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-56 h-[2px] bg-gradient-to-r from-transparent via-gold-light/70 to-transparent" />
              <div className="arch w-40 h-56 bg-gradient-to-b from-gold-light/25 to-gold/10 border-2 border-gold-light/50 grid place-items-center text-6xl backdrop-blur-sm relative z-10 -rotate-3">🤵</div>
              <div className="arch w-40 h-56 bg-gradient-to-b from-gold-light/25 to-gold/10 border-2 border-gold-light/50 grid place-items-center text-6xl backdrop-blur-sm relative z-10 rotate-3 mt-8">👰</div>
            </div>
            <p className="text-center text-gold-light font-display text-xl mt-6">Where families meet,<br />and stories begin.</p>
          </div>
        </div>
      </section>

      {/* Trust */}
      <div className="bg-white border-y border-line">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 py-9">
          <TrustItem icon={<Sparkles size={22} />} title="Best Matches" sub="Curated for you" />
          <TrustItem icon={<ShieldCheck size={22} />} title="Verified Profiles" sub="Admin approved" />
          <TrustItem icon={<Lock size={22} />} title="100% Privacy" sub="Contact protected" />
          <TrustItem icon={<MessageCircle size={22} />} title="Direct Inquiry" sub="Express interest" />
        </div>
      </div>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-11">
            <div className="text-gold font-semibold tracking-widest uppercase text-xs">Simple Process</div>
            <h2 className="font-display text-3xl md:text-4xl text-maroon mt-2.5">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[["01", "Register Free", "Sign up with mobile + OTP. Create your detailed profile."], ["02", "Search & Connect", "Filter by caste, profession, city, age. Express interest."], ["03", "Find Your Match", "Upgrade to premium to view contacts and connect."]].map(([n, t, d]) => (
              <div key={n} className="card card-hover p-8">
                <div className="font-display text-5xl text-gold-light font-bold">{n}</div>
                <h3 className="font-display text-xl text-maroon mt-2 mb-2">{t}</h3>
                <p className="text-muted text-[14.5px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section className="py-16 bg-gradient-to-b from-cream to-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-11">
            <div className="text-gold font-semibold tracking-widest uppercase text-xs">Happy Endings</div>
            <h2 className="font-display text-3xl md:text-4xl text-maroon mt-2.5">Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[["Jayanti & Rohit", "MARRIED 2025", "This bureau helped me meet my loving life partner. Truly grateful."], ["Sneha & Karan", "MARRIED 2025", "Verified profiles and privacy made the process comfortable."], ["Pooja & Vivek", "MARRIED 2024", "We found each other within two months. Easy and trustworthy."]].map(([n, w, q]) => (
              <div key={n} className="card card-hover p-7 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-maroon to-maroon-dark grid place-items-center text-white font-display text-xl">
                  {n.split(" & ").map((x) => x[0]).join("")}
                </div>
                <h4 className="font-display text-maroon text-lg">{n}</h4>
                <div className="text-xs text-gold font-semibold tracking-wide my-1">{w}</div>
                <p className="text-sm text-muted italic">&quot;{q}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-br from-maroon to-maroon-dark relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 text-center py-14 relative z-10">
          <h2 className="font-display text-white text-3xl md:text-4xl font-semibold">Your Perfect Match Awaits</h2>
          <p className="text-[#EAD9C9] mt-3.5 mb-6 text-lg">Join hundreds of families who found happiness. Registration is free.</p>
          <Link href="/login"><Button variant="gold">Create Free Profile</Button></Link>
        </div>
      </div>
    </>
  );
}

// Trust strip ka ek item.
function TrustItem({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3.5 justify-center">
      <div className="w-12 h-12 rounded-xl bg-maroon/10 grid place-items-center text-maroon shrink-0">{icon}</div>
      <div><b className="font-display text-maroon block">{title}</b><span className="text-xs text-muted">{sub}</span></div>
    </div>
  );
}
