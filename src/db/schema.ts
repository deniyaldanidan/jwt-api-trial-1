import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import {
  orderStatusEnum,
  userRolesEnum,
  userRolesObj,
} from "../helpers/constants";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: userRolesEnum }).default(userRolesObj.user),
});

export const userAddresses = sqliteTable("user_address", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  pincode: text("pincode").notNull(),
  city: text("city").notNull(),
  doorno: text("doorno").notNull(),
  street: text("street").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  district: text("district").notNull(),
  locality: text("locality"),
  contact: text("contact").notNull(),
});

export const sessions = sqliteTable("session", {
  refresh_token: text("refresh_token").primaryKey().notNull(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const itemCategories = sqliteTable("category", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const items = sqliteTable("item", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: integer("price", { mode: "number" }).notNull(),
  description: text("description").notNull(),
  item_qty: integer("item_qty", { mode: "number" }).notNull(),
  item_unit: text("item_unit").notNull(),
  veg: integer("veg", { mode: "boolean" }).default(true),
  category_id: integer("category_id", { mode: "number" })
    .notNull()
    .references(() => itemCategories.id, { onDelete: "cascade" }),
});

export const wishlists = sqliteTable("wishlist", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  item_id: integer("item_id", { mode: "number" })
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
});

export const carts = sqliteTable("cart", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  item_id: integer("item_id", { mode: "number" })
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  count: integer("count", { mode: "number" }).default(1),
});

export const orders = sqliteTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status", { enum: orderStatusEnum }).default("created"),
  total_price: integer("total_price", { mode: "number" }).notNull(),
  created: integer("created", { mode: "timestamp_ms" }).notNull(),
  shipped: integer("shipped", { mode: "timestamp_ms" }),
  delivered: integer("delivered", { mode: "timestamp_ms" }),
  cancelled: integer("cancelled", { mode: "timestamp_ms" }),
  returned: integer("returned", { mode: "timestamp_ms" }),
});

export const orderItems = sqliteTable("order_item", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  order_id: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  item_id: integer("item_id", { mode: "number" })
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  count: integer("count", { mode: "number" }).default(1),
});
