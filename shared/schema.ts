import { pgTable, text, serial, integer, boolean, jsonb, timestamp, numeric, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define user roles
export const UserRole = {
  HOST: "host",
  WAITER: "waiter",
  CHEF: "chef",
  MANAGER: "manager",
  OWNER: "owner",
  ADMIN: "admin",
} as const;

// Define table statuses
export const TableStatus = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved",
} as const;

// Define order statuses
export const OrderStatus = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  DONE: "done",
  DELIVERED: "delivered",
  PAID: "paid",
  CANCELLED: "cancelled",
} as const;

// Define item categories
export const MenuItemCategory = {
  APPETIZER: "appetizer",
  MAIN_COURSE: "main_course",
  SIDE: "side",
  DESSERT: "dessert",
  DRINK: "drink",
} as const;

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default(UserRole.WAITER),
  active: boolean("active").default(true),
});

// Table model
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

// Menu items
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  available: boolean("available").default(true),
  isSpecial: boolean("is_special").default(false),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tableId: integer("table_id").notNull().references(() => tables.id),
  waiterId: integer("waiter_id").references(() => users.id),
  status: text("status").notNull().default(OrderStatus.NEW),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  menuItemId: integer("menu_item_id").notNull().references(() => menuItems.id),
  quantity: integer("quantity").notNull().default(1),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  status: text("status").notNull().default(OrderStatus.NEW),
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  tip: numeric("tip", { precision: 10, scale: 2 }).default("0"),
  paymentMethod: text("payment_method").notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertTableSchema = createInsertSchema(tables).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, paymentDate: true });

// Types for insert
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// Types for select
export type User = typeof users.$inferSelect;
export type Table = typeof tables.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;

// MongoDB Models (since we're using MongoDB as specified)
// These will be used for our actual storage implementation

export interface MongoUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

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

export interface MongoMenuItem {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  isSpecial: boolean;
}

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

export interface MongoOrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: string;
}

export interface MongoPayment {
  _id?: string;
  orderId: string;
  amount: number;
  tip: number;
  paymentMethod: string;
  paymentDate: Date;
  timestamp?: number; // Added for better filtering in report queries
}

// Login schema for validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
