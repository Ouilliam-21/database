import { z } from "zod";

export const DiscordWsConfigSchema = z.object({
  primary: z.object({
    url: z.string().url().startsWith("wss://"),
    label: z.string().optional(),
  }),
  secondary: z.object({
    url: z.string().url().startsWith("wss://"),
    label: z.string().optional(),
  }),
  autoReconnect: z.boolean().default(false),
  status: z
    .enum(["connected", "disconnected", "error"])
    .default("disconnected"),
});

export type DiscordWsConfig = z.infer<typeof DiscordWsConfigSchema>;

// Key used in AppConfig table
export const DISCORD_WS_CONFIG_KEY = "discord.ws.config";
