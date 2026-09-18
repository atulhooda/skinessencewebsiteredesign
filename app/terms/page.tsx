import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { LegalContent } from "@/components/sections/LegalContent";
import { PageHero } from "@/components/sections/PageHero";
import { getLegalPage } from "@/lib/content";
import { routes } from "@/lib/links";
import { breadcrumbJsonLd, type Crumb } from "@/lib/schema-org";
import { buildMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const page = getLegalPage("terms");
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: routes.terms });
}

export default function TermsPage() {
  const page = getLegalPage("terms");
  const crumbs: Crumb[] = [
    { name: "Home", path: routes.home },
    { name: page.title, path: routes.terms },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Skin Essence" title={page.title} description={page.intro} />
      <LegalContent page={page} />
    </>
  );
}
