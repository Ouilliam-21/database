ALTER TYPE "processing_riot_event_status" RENAME VALUE 'pending' TO 'PENDING';
--> statement-breakpoint
ALTER TYPE "processing_riot_event_status" RENAME VALUE 'processing' TO 'PROCESSING';
--> statement-breakpoint
ALTER TYPE "processing_riot_event_status" RENAME VALUE 'completed' TO 'COMPLETED';
--> statement-breakpoint
ALTER TYPE "processing_riot_event_status" RENAME VALUE 'failed' TO 'FAILED';