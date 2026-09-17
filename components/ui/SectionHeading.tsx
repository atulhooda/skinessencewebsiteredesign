import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

const sizes = {
  display: "text-5xl sm:text-6xl md:text-7xl font-medium leading-[0.98]",
  lg: "text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.08]",
  md: "text-2xl sm:text-3xl md:text-4xl font-medium leading-[1.12]",
};

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  size?: keyof typeof sizes;
  tone?: "default" | "light";
  className?: string;
};

/**
 * Section header in the reference layout: eyebrow bottom-left, big centred
 * title, optional action pill on the right. `align="left"` stacks them.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  align = "center",
  as: Tag = "h2",
  size = "lg",
  tone = "default",
  className,
}: SectionHeadingProps) {
  const heading = (
    <Tag id={id} className={cn(sizes[size], tone === "light" && "text-white")}>
      {title}
    </Tag>
  );
  const desc = description && (
    <p className={cn("mt-4 max-w-xl text-base", tone === "light" ? "text-white/80" : "text-muted")}>{description}</p>
  );

  if (align === "left") {
    return (
      <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
        <div className="max-w-3xl">
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          <div className="mt-4">{heading}</div>
          {desc}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }

  return (
    <div className={cn("grid items-end gap-6 text-center lg:grid-cols-[1fr_auto_1fr] lg:text-left", className)}>
      <Eyebrow tone={tone} className="justify-center lg:justify-start lg:pb-3">
        {eyebrow}
      </Eyebrow>
      <div className="lg:text-center">
        {heading}
        {desc && <div className="mx-auto">{desc}</div>}
      </div>
      <div className="flex justify-center lg:justify-end lg:pb-2">{action}</div>
    </div>
  );
}
