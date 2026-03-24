import { z } from "zod";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { riotEvents } from "../tables/riotEvents";

export const RiotEventSelectSchema = createSelectSchema(riotEvents);
export type RiotEventSelect = z.infer<typeof RiotEventSelectSchema>;

export const RiotEventInsertSchema = createInsertSchema(riotEvents);
export type RiotEventInsert = z.infer<typeof RiotEventInsertSchema>;

export const RiotEventUpdateSchema = createUpdateSchema(riotEvents);
export type RiotEventUpdate = z.infer<typeof RiotEventUpdateSchema>;
