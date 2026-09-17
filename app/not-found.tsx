import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/links";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <PageHero
      crumbs={[{ name: "Home", path: routes.home }]}
      eyebrow="404"
      title="We Couldn't Find That Page"
      description="The link may be out of date. Browse our treatments or get in touch and we will point you in the right direction."
      actions={
        <>
          <Button href={routes.home} variant="light" icon="arrow-right">
            Back To Home
          </Button>
          <Button href={routes.treatments} variant="outline" icon="arrow-up-right">
            Browse Treatments
          </Button>
        </>
      }
    />
  );
}
