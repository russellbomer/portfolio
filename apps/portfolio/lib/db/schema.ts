/**
 * Database Schema for Portfolio Site
 *
 * Minimal schema for contact form submissions and activity logging.
 * Auth/payment tables removed as part of Phase C cleanup.
 */
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Contact form submissions
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Activity logs for analytics
 */
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
  metadata: text("metadata"), // JSON string for additional context
});

// Type exports
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export enum ActivityType {
  CONTACT_FORM_SUBMIT = "CONTACT_FORM_SUBMIT",
  PAGE_VIEW = "PAGE_VIEW",
  DEMO_START = "DEMO_START",
  DEMO_END = "DEMO_END",
  FILE_DOWNLOAD = "FILE_DOWNLOAD",
}
