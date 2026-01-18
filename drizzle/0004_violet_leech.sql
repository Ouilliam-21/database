CREATE TYPE "gpu_status" AS ENUM('STARTING', 'SHUTDOWN', 'RUNNING');

CREATE TABLE "config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip" varchar,
	"status" "gpu_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
