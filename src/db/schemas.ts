import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { createMany } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const logins = sqliteTable("logins", {
  id: integer("id").primaryKey(),
  url: text("url").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const userLogins = createMany(logins);
