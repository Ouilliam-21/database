import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

import {
  config,
  gameSessions,
  GameStatus,
  processingRiotEventsJobs,
  ProcessingRiotEventStatus,
  riotEvents,
  GPUStatus,
  users,
  UserRole,
  ConfigKey,
} from "./schema";

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: false,
});

const db = drizzle(pool);

async function seed() {
  // Keep it idempotent for local dev
  await db.delete(processingRiotEventsJobs);
  await db.delete(riotEvents);
  await db.delete(config);
  await db.delete(gameSessions);
  await db.delete(users);

  const gameSessionId = uuidv4();
  const riotEventId = uuidv4();
  const processingJobId = uuidv4();
  const configId = process.env.GPU_ID ?? uuidv4();
  const clipId = uuidv4();

  await db.insert(gameSessions).values({
    id: gameSessionId,
    status: GameStatus.ACTIVE,
    playerData: {
      summonerName: "MockPlayer",
      champion: "Ahri",
      level: 12,
      team: "BLUE",
    },
  });

  await db.insert(riotEvents).values({
    id: riotEventId,
    gameSessionId,
    riotEventId: 1001,
    eventName: "CHAMPION_KILL",
    eventData: {
      killer: "MockPlayer",
      victim: "EnemyPlayer",
      assists: ["SupportPlayer"],
    },
  });

  await db.insert(processingRiotEventsJobs).values({
    id: processingJobId,
    riotEventId,
    status: ProcessingRiotEventStatus.COMPLETED,
    inputText: "MockPlayer killed EnemyPlayer with assistance.",
    llmText: "MockPlayer secures a kill with team support.",
    llmModelName: "Qwen/Qwen3-0.6B",
    ttsModelName: "facebook/mms-tts-eng",
    audioUrl: "http://localhost:9000/ouilliam-audio/mock-clip.wav",
    audioDuration: "2.40",
  });

  await db.insert(users).values({
    tokenType: "Bearer",
    accessToken: "mock_access_token",
    expireAt: Date.now() + 3600_000,
    refreshToken: "mock_refresh_token",
    scope: "identify",
    discordId: "123456789012345678",
    username: "mock_user",
    avatar: "mock_avatar",
    globalName: "Mock User",
    role: UserRole.ADMIN,
    decorationAsset: null,
    decorationSkuId: null,
  });

  await db.insert(config).values({
    id: configId,
    key: ConfigKey.APP,
    value: {
      idDroplet: "mock-droplet-id",
      ip: "127.0.0.1",
      status: GPUStatus.RUNNING,
    },
  });


  console.log("Seed complete: inserted at least one row per table.");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });