export const AnalyticsEvents = {
  DemoViewed: "demo_view",
  CaseStudyRead: "case_study_read",
  ContactInitiated: "contact_initiated",
  NewsletterSubscribed: "newsletter_subscribed",
} as const;

export type AnalyticsEventKey = keyof typeof AnalyticsEvents;
export type AnalyticsEventValue = (typeof AnalyticsEvents)[AnalyticsEventKey];

// Helper to assert valid event
export function isAnalyticsEvent(value: string): value is AnalyticsEventValue {
  return Object.values(AnalyticsEvents).includes(value as AnalyticsEventValue);
}
