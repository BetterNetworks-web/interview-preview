export const GA_MEASUREMENT_ID = "G-GSWYLTSHYB";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export function event(action: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params);
  }
}
