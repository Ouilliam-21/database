import { z } from "zod";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { users } from "../tables/users.js";

export const UserSelectSchema = createSelectSchema(users);
export type UserSelect = z.infer<typeof UserSelectSchema>;

export const UserInsertSchema = createInsertSchema(users);
export type UserInsert = z.infer<typeof UserInsertSchema>;

export const UserUpdateSchema = createUpdateSchema(users);
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
