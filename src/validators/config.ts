import { z } from "zod";
import { GPUStatus, ConfigKey } from "../tables/config.js";

export const AppConfigValueSchema = z.object({
  idDroplet: z.string().nullable().optional(),
  ip: z.string().nullable().optional(),
  status: z.enum(GPUStatus),
});
export type AppConfigValue = z.infer<typeof AppConfigValueSchema>;

export const DiscordConfigValueSchema = z.object({
  isConnected: z.boolean(),
  channelId: z.string().nullable(),
  channelName: z.string().nullable(),
});
export type DiscordConfigValue = z.infer<typeof DiscordConfigValueSchema>;

const baseConfigFields = {
  id: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
};


export const AppConfigRowSchema = z.object({
  ...baseConfigFields,
  key: z.literal(ConfigKey.APP),
  value: AppConfigValueSchema,
});
export type AppConfigRow = z.infer<typeof AppConfigRowSchema>;

export const DiscordConfigRowSchema = z.object({
  ...baseConfigFields,
  key: z.literal(ConfigKey.DISCORD),
  value: DiscordConfigValueSchema,
});
export type DiscordConfigRow = z.infer<typeof DiscordConfigRowSchema>;

export const ConfigRowSchema = z.discriminatedUnion("key", [
  AppConfigRowSchema,
  DiscordConfigRowSchema,
]);
export type ConfigRow = z.infer<typeof ConfigRowSchema>;

export const InsertAppConfigSchema = z.object({
  key: z.literal(ConfigKey.APP),
  value: AppConfigValueSchema,
});
export type InsertAppConfig = z.infer<typeof InsertAppConfigSchema>;

export const InsertDiscordConfigSchema = z.object({
  key: z.literal(ConfigKey.DISCORD),
  value: DiscordConfigValueSchema,
});
export type InsertDiscordConfig = z.infer<typeof InsertDiscordConfigSchema>;

export const InsertConfigSchema = z.discriminatedUnion("key", [
  InsertAppConfigSchema,
  InsertDiscordConfigSchema,
]);
export type InsertConfig = z.infer<typeof InsertConfigSchema>;
