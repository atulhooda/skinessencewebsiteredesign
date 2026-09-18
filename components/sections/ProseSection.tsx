import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionCard } from "@/components/ui/SectionCard";

type Props = { id: string; eyebrow: string; title: string; paragraphs: string[]; tone?: "white" | "muted"; aside?: ReactNode };

/** Heading + body paragraphs, with an optional sticky aside on the right. */
export function ProseSection({ id, eyebrow, title, paragraphs, tone = "white", aside }: Props) {
  const body = (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={`${id}-heading`} className="mt-4 text-2xl font-medium leading-[1.15] sm:text-3xl md:text-4xl">
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-2 md:text-lg">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
    </div>
  );
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container size={aside ? "default" : "narrow"}>
        {aside ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
            {body}
            <aside className="self-start lg:sticky lg:top-6">{aside}</aside>
          </div>
        ) : (
          body
        )}
      </Container>
    </SectionCard>
  );
}
