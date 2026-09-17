import { GoogleTagManager } from "@next/third-parties/google";

/** Google Tag Manager slot. Renders nothing until NEXT_PUBLIC_GTM_ID is set (brief 9.12). */
export function Gtm() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;
  return <GoogleTagManager gtmId={id} />;
}
