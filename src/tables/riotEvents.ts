import {
  pgTable,
  uuid,
  bigint,
  jsonb,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { gameSessions } from "./gameSessions";

export const riotEvents = pgTable("riot_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameSessionId: uuid("game_session_id")
    .notNull()
    .references(() => gameSessions.id),
  riotEventId: bigint("riot_event_id", { mode: "number" }).notNull(),
  eventName: varchar("event_name").notNull(),
  eventData: jsonb("event_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type RiotEvent = typeof riotEvents.$inferSelect;
export type NewRiotEvent = typeof riotEvents.$inferInsert;
