import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";

export const postgres = drizzlePostgres({
  connection: {
    ssl: false,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});
