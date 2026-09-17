import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Logo preview", robots: { index: false, follow: false } };

const nav = ["Treatments", "About", "Dr. Daksha Patel", "Blog", "Contact"];

function Strip({ label, note, children, band = false }: { label: string; note: string; children: React.ReactNode; band?: boolean }) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft">
      <p className="mb-3 text-sm">
        <span className="mr-2 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">{label}</span>
        <span className="text-muted">{note}</span>
      </p>
      <div
        className={band ? "relative overflow-hidden rounded-2xl bg-signage" : "relative overflow-hidden rounded-2xl bg-[radial-gradient(120%_90%_at_75%_15%,#1d909a_0%,#106d76_45%,#08444a_100%)]"}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-5 text-white">
          <span className="flex items-center gap-3">{children}</span>
          <span className="grid size-10 place-items-center rounded-full border border-white/45 bg-white/10 text-xl leading-none">+</span>
          <ul className="hidden justify-self-end gap-6 text-sm text-white/85 lg:flex">
            {nav.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
        {!band && <div className="h-24 bg-gradient-to-b from-transparent to-brand-900/30" />}
      </div>
    </section>
  );
}

/** Temporary side-by-side of header logo treatments. Returns 404 in production. */
export default function LogoPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const site = getSite();
  const gold = site.logo;
  const white = site.logoMono ?? site.logo;
  const word = <span className="text-xl font-semibold tracking-tight">{site.name}</span>;
  return (
    <div className="mx-auto max-w-5xl space-y-5 py-24">
      <h1 className="text-2xl font-semibold">Header logo options</h1>
      <p className="text-sm text-muted">Pick a letter. This page is dev-only and disappears in production builds.</p>
      <Strip label="A" note="Deep-green disc with the gold mark (previous version)">
        <span className="grid size-14 place-items-center rounded-full bg-signage ring-1 ring-white/25">
          <Image src={gold.src} alt="" width={gold.width} height={gold.height} className="h-11 w-auto" sizes="64px" />
        </span>
        {word}
      </Strip>
      <Strip label="B" note="White single-colour mark, no disc (live now)">
        <Image src={white.src} alt="" width={white.width} height={white.height} className="h-12 w-auto" sizes="64px" />
        {word}
      </Strip>
      <Strip label="C" note="Gold mark straight on the teal, larger">
        <Image src={gold.src} alt="" width={gold.width} height={gold.height} className="h-14 w-auto" sizes="64px" />
        {word}
      </Strip>
      <Strip label="D" note="Solid deep-green header band with the gold mark (like the clinic signage)" band>
        <Image src={gold.src} alt="" width={gold.width} height={gold.height} className="h-12 w-auto" sizes="64px" />
        {word}
      </Strip>
    </div>
  );
}
