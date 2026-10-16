/**
 * Blog publishing rules (docs/BEHAVIOR_SPEC.md, "Blog publishing").
 *
 * - A post is live only with `"status": "published"`. A missing status is a
 *   draft, so a post the AI writer adds stays off the live site until someone
 *   publishes it. Drafts render only on Vercel preview deployments, for review.
 * - Publishing a post that is not in `legacy` (content/blog-policy.json) needs
 *   the doctor's recorded approval: `approvedBy` and `approvedOn`.
 * - A published post must not contain a Group A term anywhere: title, meta,
 *   excerpt, image alt or file name, body or link URLs. The build FAILS if one
 *   does, so the post cannot go live. Only posts listed in `groupAHold` (older
 *   posts awaiting the doctor's decision) are exempt.
 *
 * No React or Next.js imports: this also runs from scripts/validate-content.ts.
 */

/** Google Ads "Group A": prescription drug and injectable brand names. Whole words, any case. */
export const GROUP_A_TERMS = [
  "botox",
  "botulinum",
  "dysport",
  "xeomin",
  "accutane",
  "isotretinoin",
  "minoxidil",
  "finasteride",
  "tretinoin",
  "adapalene",
  "hydroquinone",
  "triamcinolone",
  "benzoyl peroxide",
] as const;

const GROUP_A = new RegExp(`(?<![a-z])(${GROUP_A_TERMS.map((t) => t.replace(/ /g, "[\\s_-]+")).join("|")})(?![a-z])`, "gi");

/** Each Group A term in `text`, lower-cased, once. */
export function groupATerms(text: string): string[] {
  return [...new Set([...text.matchAll(GROUP_A)].map((m) => m[0].toLowerCase().replace(/[\s_-]+/g, " ")))];
}

export type BlogPolicy = {
  /** Posts published before the approval process (16 Oct 2026). They need no approvedBy/approvedOn. */
  legacy: string[];
  /** Older posts allowed to keep Group A terms until the doctor decides, with the reason. */
  groupAHold: Record<string, string>;
};

type PostForPolicy = {
  slug: string;
  status: "draft" | "published";
  approvedBy?: string;
  approvedOn?: string;
};

/** Why `post` may not be published; empty if it may. `raw` is the post's JSON text plus its MDX body. */
export function publishProblems(post: PostForPolicy, raw: string, policy: BlogPolicy): string[] {
  if (post.status !== "published") return [];
  const problems: string[] = [];
  if (!policy.legacy.includes(post.slug) && (!post.approvedBy?.trim() || !post.approvedOn)) {
    problems.push(`published without the doctor's approval: set "approvedBy" and "approvedOn" once she has approved it, or set "status": "draft"`);
  }
  const terms = groupATerms(raw);
  if (terms.length && !(post.slug in policy.groupAHold)) {
    problems.push(`contains Group A term(s) ${terms.map((t) => `"${t}"`).join(", ")}: remove them or set "status": "draft"`);
  }
  return problems;
}
