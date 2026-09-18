import type { LegalPage } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { formatPostDate } from "./BlogGrid";

/** Body of the privacy policy and terms pages. */
export function LegalContent({ page }: { page: LegalPage }) {
  return (
    <SectionCard id="legal" headingId="legal-heading" tone="white">
      <Container size="narrow">
        <h2 id="legal-heading" className="sr-only">
          {page.title}
        </h2>
        <p className="text-sm text-muted">Last updated: {formatPostDate(page.updated)}</p>
        <p className="mt-5 text-base leading-relaxed text-ink-2 md:text-lg">{page.intro}</p>
        {page.sections.map((section) => (
          <section key={section.heading} aria-label={section.heading} className="mt-10">
            <h3 className="text-xl font-semibold">{section.heading}</h3>
            <div className="mt-3 space-y-4 text-base leading-relaxed text-ink-2">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </Container>
    </SectionCard>
  );
}
