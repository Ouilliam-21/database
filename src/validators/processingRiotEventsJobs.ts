import { z } from "zod";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { processingRiotEventsJobs } from "../tables/processingRiotEventsJobs.js";

export const ProcessingJobSelectSchema = createSelectSchema(processingRiotEventsJobs);
export type ProcessingJobSelect = z.infer<typeof ProcessingJobSelectSchema>;

export const ProcessingJobInsertSchema = createInsertSchema(processingRiotEventsJobs);
export type ProcessingJobInsert = z.infer<typeof ProcessingJobInsertSchema>;

export const ProcessingJobUpdateSchema = createUpdateSchema(processingRiotEventsJobs);
export type ProcessingJobUpdate = z.infer<typeof ProcessingJobUpdateSchema>;
