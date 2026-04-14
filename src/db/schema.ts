import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const collectionModeEnum = pgEnum("collection_mode", [
  "text_only",
  "text_and_video",
]);

export const testimonialStatusEnum = pgEnum("testimonial_status", [
  "pending",
  "approved",
  "rejected",
  "archived",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  businessName: text("business_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    publicSlug: text("public_slug").notNull(),
    collectionMode: collectionModeEnum("collection_mode")
      .notNull()
      .default("text_and_video"),
    isActive: boolean("is_active").notNull().default(true),
    customQuestions: jsonb("custom_questions")
      .notNull()
      .default(sql`'[]'::jsonb`),
    thankYouHeadline: text("thank_you_headline"),
    thankYouBody: text("thank_you_body"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    /** When set, campaign is hidden from the active list; collect URL shows archived state. */
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("campaigns_public_slug_unique").on(t.publicSlug),
    index("campaigns_user_id_idx").on(t.userId),
    index("campaigns_user_id_created_at_idx").on(t.userId, t.createdAt),
    index("campaigns_user_id_archived_at_idx").on(t.userId, t.archivedAt),
  ],
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    status: testimonialStatusEnum("status").notNull().default("pending"),
    authorName: text("author_name").notNull(),
    authorTitle: text("author_title"),
    rating: smallint("rating").notNull(),
    body: text("body").notNull(),
    videoR2ObjectKey: text("video_r2_object_key"),
    videoDurationSec: smallint("video_duration_sec"),
    videoByteLength: bigint("video_byte_length", { mode: "number" }),
    videoContentType: text("video_content_type"),
    extraAnswers: jsonb("extra_answers")
      .notNull()
      .default(sql`'{}'::jsonb`),
    displayOrder: integer("display_order"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedByUserId: uuid("reviewed_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    moderationNote: text("moderation_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("testimonials_campaign_id_status_idx").on(t.campaignId, t.status),
    index("testimonials_campaign_id_created_at_idx").on(
      t.campaignId,
      t.createdAt,
    ),
  ],
);
