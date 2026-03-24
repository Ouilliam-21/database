/**
 * generate-mermaid.ts
 *
 * Generates a Mermaid ER diagram from the drizzle-orm schema and writes
 * the result to SCHEMA.md at the project root.
 *
 * Usage: bun scripts/generate-mermaid.ts
 */

import { getTableConfig } from "drizzle-orm/pg-core";
import { getTableName } from "drizzle-orm";
import { writeFileSync } from "node:fs";

import {
  config,
  gameSessions,
  processingRiotEventsJobs,
  riotEvents,
  users,
} from "../schema";

const TABLES = [
  users,
  config,
  gameSessions,
  riotEvents,
  processingRiotEventsJobs,
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Replaces any character that is NOT [a-zA-Z0-9_] with an underscore. */
function sanitizeName(s: string): string {
  return s.replace(/[^a-zA-Z0-9_]/g, "_");
}

// Convenience aliases for internal column / constraint shapes we cast to
type ColLike = { name: string; notNull: boolean };

// ---------------------------------------------------------------------------
// Diagram generator
// ---------------------------------------------------------------------------

/**
 * Builds and returns a complete Mermaid `erDiagram` string derived from the
 * drizzle-orm table configs.
 */
function generateErDiagram(): string {
  const lines: string[] = ["erDiagram"];

  // ── Entity blocks ──────────────────────────────────────────────────────────
  for (const table of TABLES) {
    const { name, columns, foreignKeys, primaryKeys, uniqueConstraints } =
      getTableConfig(table);

    // Build set of PK column names:
    //   • columns with col.primary === true (inline .primaryKey())
    //   • columns listed in composite primaryKeys[]
    const pkNames = new Set<string>();
    for (const col of columns) {
      if ((col as unknown as { primary: boolean }).primary) {
        pkNames.add(col.name);
      }
    }
    for (const pk of primaryKeys) {
      for (const col of pk.columns as unknown as ColLike[]) {
        pkNames.add(col.name);
      }
    }

    // Build set of FK column names (local side of each foreign key reference)
    const fkNames = new Set<string>();
    for (const fk of foreignKeys) {
      const ref = fk.reference() as unknown as {
        columns: ColLike[];
        foreignTable: object;
        foreignColumns: ColLike[];
      };
      for (const col of ref.columns) {
        fkNames.add(col.name);
      }
    }

    // Build set of UK column names:
    //   • columns with col.isUnique === true (inline .unique())
    //   • single-column uniqueConstraints[]
    const ukNames = new Set<string>();
    for (const col of columns) {
      if ((col as unknown as { isUnique: boolean }).isUnique) {
        ukNames.add(col.name);
      }
    }
    for (const uc of uniqueConstraints) {
      const ucCols = uc.columns as unknown as ColLike[];
      if (ucCols.length === 1) {
        ukNames.add(ucCols[0].name);
      }
    }

    // ── Emit entity block ───────────────────────────────────────────────────
    lines.push(`    ${name} {`);

    for (const col of columns) {
      // SQL type sanitised to a valid Mermaid identifier
      const sqlType = sanitizeName(
        (col as unknown as { getSQLType(): string }).getSQLType(),
      );
      const colName = col.name;

      // PK wins > FK wins > UK wins > no annotation
      let annotation = "";
      if (pkNames.has(colName)) {
        annotation = " PK";
      } else if (fkNames.has(colName)) {
        annotation = " FK";
      } else if (ukNames.has(colName)) {
        annotation = " UK";
      }

      lines.push(`        ${sqlType} ${colName}${annotation}`);
    }

    lines.push(`    }`);
  }

  // ── Relationship lines ─────────────────────────────────────────────────────
  for (const table of TABLES) {
    const { name: tableName, foreignKeys } = getTableConfig(table);

    for (const fk of foreignKeys) {
      const ref = fk.reference() as unknown as {
        columns: ColLike[];
        foreignTable: Parameters<typeof getTableName>[0];
        foreignColumns: ColLike[];
      };

      const foreignTableName = getTableName(ref.foreignTable);

      // Comma-separated local FK column name(s)
      const colNames = ref.columns.map((c) => c.name).join(", ");

      // If ANY local FK column is nullable → "|o" (zero-or-one on the left),
      // otherwise "||" (exactly-one).
      const hasNullable = ref.columns.some((c) => !c.notNull);
      const leftCard = hasNullable ? "|o" : "||";

      // e.g.  game_sessions ||--o{ riot_events : "game_session_id"
      lines.push(
        `    ${foreignTableName} ${leftCard}--o{ ${tableName} : "${colNames}"`,
      );
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const diagram = generateErDiagram();
const timestamp = new Date().toISOString();

// Build the markdown file content without embedding raw backtick fences inside
// a template literal (avoids accidental escaping issues).
const fence = "```";
const markdown = [
  "# Database Schema",
  "",
  "> Auto-generated on each push \u2013 do not edit manually.",
  "",
  `**Last updated:** ${timestamp}`,
  "",
  `${fence}mermaid`,
  diagram,
  fence,
  "", // trailing newline
].join("\n");

// Resolve path relative to this script's location → project root/SCHEMA.md
const outPath = new URL("../SCHEMA.md", import.meta.url);
writeFileSync(outPath, markdown);

console.log("✅  SCHEMA.md updated.");
