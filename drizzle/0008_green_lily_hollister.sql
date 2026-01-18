CREATE TYPE "lang" AS ENUM('FR', 'EN');

CREATE TABLE "clips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"s3_path" text NOT NULL,
	"transcription" text NOT NULL,
	"language" "lang" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
