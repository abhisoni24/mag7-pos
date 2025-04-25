import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  jsonb,
  timestamp,
  numeric,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Enum-like object defining user roles in the system.
 */
export const UserRole = {
  HOST: "host",
  WAITER: "waiter",
  CHEF: "chef",
  MANAGER: "manager",
  OWNER: "owner",
  ADMIN: "admin",
} as const;

/**
 * Enum-like object defining table statuses.
 */
export const TableStatus = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved",
} as const;

/**
 * Enum-like object defining order statuses.
 */
export const OrderStatus = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  DONE: "done",
  DELIVERED: "delivered",
  PAID: "paid",
  CANCELLED: "cancelled",
} as const;

/**
 * Enum-like object defining menu item categories.
 */
export const MenuItemCategory = {
  APPETIZER: "appetizer",
  MAIN_COURSE: "main_course",
  SIDE: "side",
  DESSERT: "dessert",
  DRINK: "drink",
} as const;

/**
 * Database table schema for users.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default(UserRole.WAITER),
  active: boolean("active").default(true),
});

/**
 * Database table schema for tables.
 */
export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  capacity: integer("capacity").notNull(),
  status: text("status").notNull().default(TableStatus.AVAILABLE),
  floor: integer("floor").default(1),
  waiterId: integer("waiter_id").references(() => users.id),
  reservationTime: timestamp("reservation_time"),
  reservationName: text("reservation_name"),
  reservationPhone: text("reservation_phone"),
  guestCount: integer("guest_count"),
});

/**
 * Database table schema for menu items.
 */
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  available: boolean("available").default(true),
  isSpecial: boolean("is_special").default(false),
});

/**
 * Database table schema for orders.
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tableId: integer("table_id")
    .notNull()
    .references(() => tables.id),
  waiterId: integer("waiter_id").references(() => users.id),
  status: text("status").notNull().default(OrderStatus.NEW),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Database table schema for order items.
 */
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  menuItemId: integer("menu_item_id")
    .notNull()
    .references(() => menuItems.id),
  quantity: integer("quantity").notNull().default(1),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  status: text("status").notNull().default(OrderStatus.NEW),
});

/**
 * Database table schema for payments.
 */
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  tip: numeric("tip", { precision: 10, scale: 2 }).default("0"),
  paymentMethod: text("payment_method").notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
});

/**
 * Zod schema for inserting a new user.
 */
export const insertUserSchema = createInsertSchema(users).omit({ id: true });

/**
 * Zod schema for inserting a new table.
 */
export const insertTableSchema = createInsertSchema(tables).omit({ id: true });

/**
 * Zod schema for inserting a new menu item.
 */
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

/**
 * Zod schema for inserting a new order.
 */
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for inserting a new order item.
 */
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

/**
 * Zod schema for inserting a new payment.
 */
export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  paymentDate: true,
});

/**
 * Type definition for inserting a new user.
 */
export type InsertUser = z.infer<typeof insertUserSchema>;

/**
 * Type definition for inserting a new table.
 */
export type InsertTable = z.infer<typeof insertTableSchema>;

/**
 * Type definition for inserting a new menu item.
 */
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

/**
 * Type definition for inserting a new order.
 */
export type InsertOrder = z.infer<typeof insertOrderSchema>;

/**
 * Type definition for inserting a new order item.
 */
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

/**
 * Type definition for inserting a new payment.
 */
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

/**
 * Type definition for selecting a user.
 */
export type User = typeof users.$inferSelect;

/**
 * Type definition for selecting a table.
 */
export type Table = typeof tables.$inferSelect;

/**
 * Type definition for selecting a menu item.
 */
export type MenuItem = typeof menuItems.$inferSelect;

/**
 * Type definition for selecting an order.
 */
export type Order = typeof orders.$inferSelect;

/**
 * Type definition for selecting an order item.
 */
export type OrderItem = typeof orderItems.$inferSelect;

/**
 * Type definition for selecting a payment.
 */
export type Payment = typeof payments.$inferSelect;

/**
 * MongoDB model for a user.
 */
export interface MongoUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

/**
 * MongoDB model for a table.
 */
export interface MongoTable {
  _id?: string;
  number: number;
  capacity: number;
  status: string;
  floor: number;
  waiterId?: string;
  reservationTime?: Date;
  reservationName?: string;
  reservationPhone?: string;
  guestCount?: number;
}

/**
 * MongoDB model for a menu item.
 */
export interface MongoMenuItem {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  isSpecial: boolean;
}

/**
 * MongoDB model for an order.
 */
export interface MongoOrder {
  _id?: string;
  tableId: string;
  waiterId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: MongoOrderItem[];
  timestamp?: number; // Added for unique order identification
}

/**
 * MongoDB model for an order item.
 */
export interface MongoOrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: string;
}

/**
 * MongoDB model for a payment.
 */
export interface MongoPayment {
  _id?: string;
  orderId: string;
  amount: number;
  tip: number;
  paymentMethod: string;
  paymentDate: Date;
  timestamp?: number; // Added for better filtering in report queries
}

/**
 * Zod schema for validating login data.
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional(),
});

/**
 * Type definition for login data.
 */
export type LoginData = z.infer<typeof loginSchema>;
