import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Blog post bodies are .mdx files in /content/blog, imported by app/blog/[slug].
  pageExtensions: ["ts", "tsx", "mdx"],
  // Every page is statically generated (generateStaticParams + no dynamic APIs),
  // so the site is `output: "export"` compatible. Leave `output` unset on Vercel
  // because /api/lead (POST) needs a serverless function and `redirects()` below
  // needs the Next server (with a pure export, move them to vercel.json).
  // output: "export",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
  },
  poweredByHeader: false,
  /** 301s from the old WordPress URLs (brief 9.13). "/#Services" is a hash and cannot be redirected server-side. */
  async redirects() {
    return [
      { source: "/about/", destination: "/about", permanent: true },
      { source: "/know-your-doctor", destination: "/dr-daksha-patel", permanent: true },
      { source: "/know-your-doctor/", destination: "/dr-daksha-patel", permanent: true },
      { source: "/clinic", destination: "/dermatologist-in-kalyani-nagar", permanent: true },
      { source: "/clinic/", destination: "/dermatologist-in-kalyani-nagar", permanent: true },
      { source: "/services", destination: "/treatments", permanent: true },
      { source: "/services/", destination: "/treatments", permanent: true },
      // Renamed to match the client's service list (Sep 2026).
      { source: "/treatments/facial-rejuvenation", destination: "/treatments/skin-glow-treatment", permanent: true },
      { source: "/treatments/body-contouring", destination: "/treatments/fat-reduction", permanent: true },
      // Unpublished pending the client's confirmation that these are not offered.
      { source: "/treatments/hair-transplant", destination: "/treatments/hair-loss-treatment", permanent: false },
      { source: "/treatments/tattoo-removal", destination: "/treatments/pigmentation-treatment", permanent: false },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
