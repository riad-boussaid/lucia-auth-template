import { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnums = pgEnum("role", ["ADMIN", "USER"]);

export const usersTable = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    // firstName: varchar("first_name", { length: 255 }),
    // lastName: varchar("last_name", { length: 255 }),

    username: varchar("username", { length: 255 }),
    avatar: text("avatar"),

    email: varchar("email", { length: 255 }).unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),

    hashedPassword: varchar("hashed_password", { length: 255 }),

    role: roleEnums("role").default("USER").notNull(),

    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
  })
);

export type User = InferSelectModel<typeof usersTable>;

export const accountsTable = pgTable("accounts", {
  // providerId: text("provider_id").notNull().unique(),
  // providerUserId: text("provider_user_id").notNull().unique(),
  // userId: text("user_id")
  //   .notNull()
  //   .references(() => usersTable.id),

  // PRIMARY KEY (provider_id, provider_user_id),

  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  provider: text("provider").notNull(), // google, github
  providerUserId: text("provider_user_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});