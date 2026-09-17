import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  wide: "max-w-[1280px]",
  default: "max-w-[1180px]",
  narrow: "max-w-[860px]",
};

export function Container({
  children,
  size = "default",
  className,
}: {
  children: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full", sizes[size], className)}>{children}</div>;
}
