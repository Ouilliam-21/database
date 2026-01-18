import {
  pgTable,
  uuid,
  timestamp,
  pgEnum,
  text,
  varchar,
  decimal,
} from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../utils/drizzle.js";
import { riotEvents } from "./riotEvents.js";

export enum ProcessingRiotEventStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

const processingRiotEventStatusEnum = pgEnum(
  "processing_riot_event_status",
  enumToPgEnum(ProcessingRiotEventStatus)
);

export const processingRiotEventsJobs = pgTable("processing_riot_events_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  riotEventId: uuid("riot_event_id")
    .notNull()
    .references(() => riotEvents.id),
  status: processingRiotEventStatusEnum("status").notNull(),
  inputText: text("input_text").notNull(),
  llmText: text("llm_text"),
  errorMessage: text("error_message"),
  llmStartedAt: timestamp("llm_started_at"),
  llmCompletedAt: timestamp("llm_completed_at"),
  llmModelName: varchar("llm_model_name"),
  ttsStartedAt: timestamp("tts_started_at"),
  ttsCompletedAt: timestamp("tts_completed_at"),
  ttsModelName: varchar("tts_model_name"),
  audioUrl: text("audio_url"),
  audioDuration: decimal("audio_duration"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ProcessingJob = typeof processingRiotEventsJobs.$inferSelect;
export type NewProcessingJob = typeof processingRiotEventsJobs.$inferInsert;
