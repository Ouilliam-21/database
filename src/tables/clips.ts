import {
    integer, pgEnum, pgTable, text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";

import { enumToPgEnum } from "../utils/drizzle.js";
export enum Lang {
    FR = "FR",
    EN = "EN",
}

const lanEnum = pgEnum("lang", enumToPgEnum(Lang));

export const clips = pgTable("clips", {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: text("filename").notNull(),
    s3Path: text("s3_path").notNull(),
    transcription: text("transcription").notNull(),
    language: lanEnum("language").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Clips = typeof clips.$inferSelect;
export type NewClips = typeof clips.$inferInsert;
