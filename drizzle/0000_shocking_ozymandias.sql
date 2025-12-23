CREATE TYPE "game_status" AS ENUM('PLAYED', 'ACTIVE');
CREATE TYPE "processing_riot_event_status" AS ENUM('pending', 'processing', 'completed', 'failed');
CREATE TYPE "user_role" AS ENUM('admin', 'user');


CREATE TABLE "game_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"riot_game_id" bigint NOT NULL,
	"status" "game_status" NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"player_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "riot_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_session_id" uuid NOT NULL,
	"riot_event_id" bigint NOT NULL,
	"event_name" varchar NOT NULL,
	"event_data" jsonb NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "processing_riot_events_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"riot_event_id" uuid NOT NULL,
	"status" "processing_riot_event_status" NOT NULL,
	"input_text" text NOT NULL,
	"llm_text" text,
	"error_message" text,
	"llm_started_at" timestamp,
	"llm_completed_at" timestamp,
	"llm_model_name" varchar,
	"tts_started_at" timestamp,
	"tts_completed_at" timestamp,
	"tts_model_name" varchar,
	"audio_url" text,
	"audio_duration" numeric,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"token_type" text NOT NULL,
	"access_token" text NOT NULL,
	"expire_at" bigint NOT NULL,
	"refresh_token" text NOT NULL,
	"scope" text NOT NULL,
	"discord_id" text NOT NULL,
	"username" text NOT NULL,
	"avatar" text NOT NULL,
	"global_name" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"decoration_asset" text,
	"decoration_sku_id" text
);
--> statement-breakpoint
ALTER TABLE "riot_events" ADD CONSTRAINT "riot_events_game_session_id_game_sessions_id_fk" FOREIGN KEY ("game_session_id") REFERENCES "public"."game_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processing_riot_events_jobs" ADD CONSTRAINT "processing_riot_events_jobs_riot_event_id_riot_events_id_fk" FOREIGN KEY ("riot_event_id") REFERENCES "public"."riot_events"("id") ON DELETE no action ON UPDATE no action;