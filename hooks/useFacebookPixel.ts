import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { fbTrack } from "@/lib/fbpixel";

/**
 * Tracks a PageView on every client-side route change (SPA).
 * The initial PageView is fired from index.html.
 */
export const useFacebookPixel = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fbTrack("PageView");
  }, [pathname, searchParams]);
};
