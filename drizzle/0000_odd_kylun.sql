CREATE TYPE "public"."collection_mode" AS ENUM('text_only', 'text_and_video');--> statement-breakpoint
CREATE TYPE "public"."testimonial_status" AS ENUM('pending', 'approved', 'rejected', 'archived');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"public_slug" text NOT NULL,
	"collection_mode" "collection_mode" DEFAULT 'text_and_video' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"custom_questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"thank_you_headline" text,
	"thank_you_body" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"status" "testimonial_status" DEFAULT 'pending' NOT NULL,
	"author_name" text NOT NULL,
	"author_title" text,
	"rating" smallint NOT NULL,
	"body" text NOT NULL,
	"video_r2_object_key" text,
	"video_duration_sec" smallint,
	"video_byte_length" bigint,
	"video_content_type" text,
	"extra_answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"display_order" integer,
	"reviewed_at" timestamp with time zone,
	"reviewed_by_user_id" uuid,
	"moderation_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"business_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_reviewed_by_user_id_users_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "campaigns_public_slug_unique" ON "campaigns" USING btree ("public_slug");--> statement-breakpoint
CREATE INDEX "campaigns_user_id_idx" ON "campaigns" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "campaigns_user_id_created_at_idx" ON "campaigns" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "testimonials_campaign_id_status_idx" ON "testimonials" USING btree ("campaign_id","status");--> statement-breakpoint
CREATE INDEX "testimonials_campaign_id_created_at_idx" ON "testimonials" USING btree ("campaign_id","created_at");