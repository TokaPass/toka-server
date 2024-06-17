import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core"

const users = sqliteTable("users", {
  id: integer("id").primaryKey()
})