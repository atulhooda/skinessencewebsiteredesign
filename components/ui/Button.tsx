import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRightIcon, ArrowUpRightIcon } from "./icons";

type Variant = "primary" | "light" | "outline" | "dark" | "urgent";
type IconName = "arrow-right" | "arrow-up-right" | "none";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60";

const sizes: Record<Size, { withIcon: string; plain: string; circle: string; glyph: string }> = {
  sm: { withIcon: "py-1 pl-4 pr-1 text-xs", plain: "px-4 py-2 text-xs", circle: "size-6", glyph: "size-3.5" },
  md: { withIcon: "py-1.5 pl-5 pr-1.5 text-sm", plain: "px-5 py-2.5 text-sm", circle: "size-8", glyph: "size-4" },
  lg: { withIcon: "py-2 pl-6 pr-2 text-base", plain: "px-6 py-3 text-base", circle: "size-9", glyph: "size-4" },
};

const variants: Record<Variant, { pill: string; circle: string }> = {
  primary: {
    pill: "bg-brand-600 text-white shadow-pill hover:bg-brand-700",
    circle: "bg-white text-brand-700",
  },
  light: {
    pill: "border border-line bg-white text-ink shadow-soft hover:border-ink/25",
    circle: "bg-ink text-white transition-colors group-hover:bg-brand-700",
  },
  outline: {
    pill: "border border-white/45 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
    circle: "bg-white text-ink",
  },
  dark: {
    pill: "bg-ink text-white hover:bg-brand-900",
    circle: "bg-white text-ink",
  },
  urgent: {
    pill: "border border-urgent/30 bg-white text-urgent hover:bg-urgent hover:text-white",
    circle: "bg-urgent text-white transition-colors group-hover:bg-white group-hover:text-urgent",
  },
};

type CommonProps = {
  variant?: Variant;
  icon?: IconName;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type NativeProps = CommonProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonProps = LinkProps | NativeProps;

/**
 * Pill button with the reference design's "arrow in a circle" affordance.
 * Renders <Link> for internal paths, <a> for anchors / tel / wa.me / external
 * URLs, and <button> when no href is given.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", icon = "arrow-up-right", size = "md", className, children } = props;
  const s = sizes[size];
  const v = variants[variant];
  const classes = cn(base, v.pill, icon === "none" ? s.plain : s.withIcon, className);
  const Glyph = icon === "arrow-right" ? ArrowRightIcon : ArrowUpRightIcon;
  const content = (
    <>
      <span>{children}</span>
      {icon !== "none" && (
        <span className={cn("grid shrink-0 place-items-center rounded-full", s.circle, v.circle)}>
          <Glyph className={s.glyph} />
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, variant: _v, icon: _i, size: _s, className: _c, children: _ch, ...rest } = props;
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} {...rest}>
          {content}
        </Link>
      );
    }
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  const { variant: _v, icon: _i, size: _s, className: _c, children: _ch, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
