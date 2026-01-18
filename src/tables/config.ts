import { enumToPgEnum } from "../utils/drizzle.js";
import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export enum GPUStatus {
  STARTING = "STARTING",
  SHUTDOWN = "SHUTDOWN",
  RUNNING = "RUNNING",
}

const gpuStatusEnum = pgEnum("gpu_status", enumToPgEnum(GPUStatus));
export const config = pgTable("config", {
  id: uuid("id").primaryKey().defaultRandom(),
  idDroplet: varchar("id_droplet"),
  ip: varchar("ip"),
  status: gpuStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
