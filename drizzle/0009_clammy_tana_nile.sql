ALTER TABLE "clips" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "clips" CASCADE;--> statement-breakpoint
CREATE TYPE "config_key" AS ENUM('app', 'discord');

ALTER TABLE "config" ADD COLUMN "key" "config_key" NOT NULL;--> statement-breakpoint
ALTER TABLE "config" ADD COLUMN "value" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "config" DROP COLUMN "id_droplet";--> statement-breakpoint
ALTER TABLE "config" DROP COLUMN "ip";--> statement-breakpoint
ALTER TABLE "config" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "config" ADD CONSTRAINT "config_key_unique" UNIQUE("key");