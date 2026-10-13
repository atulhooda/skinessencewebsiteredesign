"use client";

import { sendGAEvent } from "@next/third-parties/google";
import type { ReactNode } from "react";

/**
 * A plain link that also records a Google Analytics event on click.
 * Used on the ad landing page for the call and WhatsApp buttons, so the ads
 * can be measured on contacts as well as form submissions.
 */
export function TrackedLink({
  href,
  event,
  className,
  external = false,
  children,
}: {
  href: string;
  /** GA event name, e.g. "click_call". */
  event: string;
  className?: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => sendGAEvent("event", event, { link_url: href, page_path: "/lp/treatments" })}
    >
      {children}
    </a>
  );
}
