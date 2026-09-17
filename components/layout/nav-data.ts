import type { Image } from "@/content/schema";

/** Serialisable navigation model passed from the server Header to the client menu. */
export type NavLink = { label: string; href: string };

export type NavData = {
  brand: string;
  logo: Image;
  logoMono?: Image;
  primary: NavLink[];
  categories: { name: string; slug: string; treatments: NavLink[] }[];
  concerns: NavLink[];
  locations: NavLink[];
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  positioning: string;
};
