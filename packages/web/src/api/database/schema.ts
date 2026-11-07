import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export * from "./auth-schema";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  client: text("client").notNull().default(""),
  year: text("year").notNull().default(""),
  cover: text("cover").notNull().default(""),
  media: text("media", { mode: "json" })
    .$type<{ url: string; type: "image" | "video"; alt: string; captions?: string }[]>()
    .notNull()
    .default([]),
  active: integer("active", { mode: "boolean" }).notNull().default(false),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});
export const siteContent = sqliteTable("site_content", {
  id: text("id").primaryKey(),
  data: text("data", { mode: "json" }).$type<Record<string, string>>().notNull(),
});
export const adminUsers = sqliteTable("admin_users", {
  userId: text("user_id").primaryKey(),
});

/**
 * Define your database schema here, then apply it with `bun run db:push`
 * (from packages/web). Re-export any generated schema from this file
 * (e.g. Better Auth's auth-schema.ts) so drizzle generates complete migrations.
 * Table patterns and conventions: skills/app/references/api.md
 */

export const installationLock = sqliteTable("installation_lock", { id: text("id").primaryKey() });
