import {
  pgTable,
  uuid,
  bigint,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../utils/drizzle";

export enum GameStatus {
  PLAYED = "PLAYED",
  ACTIVE = "ACTIVE",
}

const gameStatusEnum = pgEnum("game_status", enumToPgEnum(GameStatus));

export const gameSessions = pgTable("game_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: gameStatusEnum("status").notNull(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  playerData: jsonb("player_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type GameSession = typeof gameSessions.$inferSelect;
export type NewGameSession = typeof gameSessions.$inferInsert;
