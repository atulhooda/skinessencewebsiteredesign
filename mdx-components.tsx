import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/** Styles for blog post bodies written in MDX (content/blog/*.mdx). Required by @next/mdx in the App Router. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => <h2 className="mt-12 text-2xl font-medium leading-tight md:text-3xl" {...props} />,
    h3: (props) => <h3 className="mt-8 text-xl font-semibold" {...props} />,
    p: (props) => <p className="mt-5 text-base leading-relaxed text-ink-2 md:text-lg" {...props} />,
    ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink-2 marker:text-brand-600 md:text-lg" {...props} />,
    ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-base leading-relaxed text-ink-2 marker:font-semibold marker:text-brand-700 md:text-lg" {...props} />,
    li: (props) => <li className="pl-1" {...props} />,
    strong: (props) => <strong className="font-semibold text-ink" {...props} />,
    blockquote: (props) => <blockquote className="mt-6 rounded-2xl border-l-4 border-brand-600 bg-brand-50 px-5 py-4 text-ink-2 [&>p]:mt-0" {...props} />,
    a: ({ href = "", children, ...rest }) =>
      href.startsWith("/") ? (
        <Link href={href} className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-900">
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-900" {...rest}>
          {children}
        </a>
      ),
    ...components,
  };
}
