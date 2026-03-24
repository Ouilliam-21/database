import { z } from "zod";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { gameSessions } from "../tables/gameSessions";

export const GameSessionSelectSchema = createSelectSchema(gameSessions);
export type GameSessionSelect = z.infer<typeof GameSessionSelectSchema>;

export const GameSessionInsertSchema = createInsertSchema(gameSessions);
export type GameSessionInsert = z.infer<typeof GameSessionInsertSchema>;

export const GameSessionUpdateSchema = createUpdateSchema(gameSessions);
export type GameSessionUpdate = z.infer<typeof GameSessionUpdateSchema>;
