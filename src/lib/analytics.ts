type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("bighorn:analytics", { detail: { eventName, params } }));
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (gtag) gtag("event", eventName, params);
  if (fbq) fbq("trackCustom", eventName, params);
}