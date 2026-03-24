import { enumToPgEnum } from "../utils/drizzle";
import { pgTable, uuid, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";

export enum GPUStatus {
  STARTING = "STARTING",
  SHUTDOWN = "SHUTDOWN",
  RUNNING = "RUNNING",
}

export enum ConfigKey {
  APP = "app",
  DISCORD = "discord",
}

const configKeyEnum = pgEnum("config_key", enumToPgEnum(ConfigKey));

export const config = pgTable("config", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: configKeyEnum("key").notNull().unique(),
  value: jsonb("value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Config = typeof config.$inferSelect;
export type NewConfig = typeof config.$inferInsert;
