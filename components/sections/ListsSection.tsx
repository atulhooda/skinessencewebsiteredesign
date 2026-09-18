import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/ui/icons";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type ListBlock = { heading: string; items: string[]; marker?: "check" | "dot" };

type Props = { id: string; eyebrow: string; title: string; lists: ListBlock[]; tone?: "white" | "muted" };

/** Two or three titled bullet lists side by side, each in its own card. */
export function ListsSection({ id, eyebrow, title, lists, tone = "muted" }: Props) {
  const blocks = lists.filter((l) => l.items.length > 0);
  if (!blocks.length) return null;
  return (
    <SectionCard id={id} headingId={`${id}-heading`} tone={tone}>
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} align="left" size="md" />
        <div className={`mt-10 grid gap-4 ${blocks.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {blocks.map((block) => (
            <div key={block.heading} className={`rounded-3xl border border-brand-100 p-6 md:p-8 ${tone === "white" ? "bg-surface-2" : "bg-white"}`}>
              <h3 className="text-lg font-semibold">{block.heading}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    {block.marker === "dot" ? (
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600" />
                    ) : (
                      <CheckIcon className="mt-1 size-4 shrink-0 text-brand-600" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </SectionCard>
  );
}
