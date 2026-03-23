import { enumToPgEnum } from "../utils/drizzle.js";
import { pgTable, uuid, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export enum GPUStatus {
  STARTING = "STARTING",
  SHUTDOWN = "SHUTDOWN",
  RUNNING = "RUNNING",
}

export enum AppConfigKey {
  APPLICATION = "APPLICATION",
  WEBSOCKET_DISCORD = "WEBSOCKET_DISCORD",
}

const appConfigKeyEnum = pgEnum(
  "app_config_key",
  enumToPgEnum(AppConfigKey)
);

export const config = pgTable("config", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: appConfigKeyEnum("key").notNull().unique(),
  value: jsonb("value").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ApplicationConfigValueSchema = z.object({
  idDroplet: z.string().nullable().optional(),
  ip: z.string().nullable().optional(),
  status: z.enum(enumToPgEnum(GPUStatus)),
  createdAt: z.union([z.string().datetime(), z.date()]),
  updatedAt: z.union([z.string().datetime(), z.date()]),
});

export type ApplicationConfigValue = z.infer<typeof ApplicationConfigValueSchema>;

export const insertConfigSchema = createInsertSchema(config);
export const selectConfigSchema = createSelectSchema(config);

export type Config = typeof config.$inferSelect;
export type NewConfig = typeof config.$inferInsert;
