import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalContent } from "@/components/sections/LegalContent";
import { PageHero } from "@/components/sections/PageHero";
import { getLegalPage } from "@/lib/content";
import { routes } from "@/lib/links";
import { breadcrumbJsonLd, type Crumb } from "@/lib/schema-org";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getLegalPage("privacy-policy");
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: routes.privacy });
}

export default function PrivacyPolicyPage() {
  const page = getLegalPage("privacy-policy");
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home },
    { name: page.title, path: routes.privacy },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Skin Essence" title={page.title} description={page.intro} />
      <LegalContent page={page} />
    </>
  );
}
