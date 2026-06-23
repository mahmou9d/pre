/* eslint-disable @typescript-eslint/no-explicit-any */
// Facebook Pixel helper utilities
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const PIXEL_ID = "1494212422307605";

type StandardEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Search"
  | "Lead"
  | "CompleteRegistration";

export const fbTrack = (event: StandardEvent, data?: Record<string, any>) => {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    if (data) window.fbq("track", event, data);
    else window.fbq("track", event);
  } catch {
    // silent
  }
};

export const fbTrackCustom = (
  event: string,
  data?: Record<string, any>,
) => {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    if (data) window.fbq("trackCustom", event, data);
    else window.fbq("trackCustom", event);
  } catch {
    // silent
  }
};
