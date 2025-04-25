import { MongoClient, Db, ObjectId } from "mongodb";
import {
  MongoUser,
  MongoTable,
  MongoMenuItem,
  MongoOrder,
  MongoPayment,
  InsertUser,
  User,
  InsertTable,
  Table,
  InsertMenuItem,
  MenuItem,
  InsertOrder,
  Order,
  InsertOrderItem,
  InsertPayment,
  Payment,
  OrderStatus,
  TableStatus,
} from "@shared/schema";

import dotenv from "dotenv";
dotenv.config();

process.env.MONGODB_URI = process.env.MONGODB_URI || "default_value";

/**
 * Interface defining the storage operations for the restaurant POS system.
 */
export interface IStorage {
  /**
   * Fetches a user by their ID.
   * @param id - The ID of the user.
   * @returns A promise resolving to the user or null if not found.
   */
  getUser(id: string): Promise<MongoUser | null>;

  /**
   * Fetches a user by their email.
   * @param email - The email of the user.
   * @returns A promise resolving to the user or null if not found.
   */
  getUserByEmail(email: string): Promise<MongoUser | null>;

  /**
   * Creates a new user.
   * @param user - The user data to insert.
   * @returns A promise resolving to the created user.
   */
  createUser(user: InsertUser): Promise<MongoUser>;

  /**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param user - The partial user data to update.
   * @returns A promise resolving to the updated user or null if not found.
   */
  updateUser(id: string, user: Partial<MongoUser>): Promise<MongoUser | null>;

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns A promise resolving to true if the user was deleted, false otherwise.
   */
  deleteUser(id: string): Promise<boolean>;

  /**
   * Fetches all users.
   * @returns A promise resolving to an array of users.
   */
  getUsers(): Promise<MongoUser[]>;

  /**
   * Fetches users by their role.
   * @param role - The role to filter users by.
   * @returns A promise resolving to an array of users with the specified role.
   */
  getUsersByRole(role: string): Promise<MongoUser[]>;

  // Table operations

  /**
   * Fetches a table by its ID.
   * @param id - The ID of the table.
   * @returns A promise resolving to the table or null if not found.
   */
  getTable(id: string): Promise<MongoTable | null>;

  /**
   * Fetches all tables.
   * @returns A promise resolving to an array of tables.
   */
  getTables(): Promise<MongoTable[]>;

  /**
   * Fetches tables by their status.
   * @param status - The status to filter tables by.
   * @returns A promise resolving to an array of tables with the specified status.
   */
  getTablesByStatus(status: string): Promise<MongoTable[]>;

  /**
   * Fetches tables assigned to a specific waiter.
   * @param waiterId - The ID of the waiter.
   * @returns A promise resolving to an array of tables assigned to the waiter.
   */
  getTablesByWaiter(waiterId: string): Promise<MongoTable[]>;

  /**
   * Fetches tables on a specific floor.
   * @param floor - The floor number.
   * @returns A promise resolving to an array of tables on the specified floor.
   */
  getTablesByFloor(floor: number): Promise<MongoTable[]>;

  /**
   * Creates a new table.
   * @param table - The table data to insert.
   * @returns A promise resolving to the created table.
   */
  createTable(table: InsertTable): Promise<MongoTable>;

  /**
   * Updates an existing table.
   * @param id - The ID of the table to update.
   * @param table - The partial table data to update.
   * @returns A promise resolving to the updated table or null if not found.
   */
  updateTable(
    id: string,
    table: Partial<MongoTable>
  ): Promise<MongoTable | null>;

  // Menu operations

  /**
   * Fetches a menu item by its ID.
   * @param id - The ID of the menu item.
   * @returns A promise resolving to the menu item or null if not found.
   */
  getMenuItem(id: string): Promise<MongoMenuItem | null>;

  /**
   * Fetches all menu items.
   * @returns A promise resolving to an array of menu items.
   */
  getMenuItems(): Promise<MongoMenuItem[]>;

  /**
   * Fetches menu items by their category.
   * @param category - The category to filter menu items by.
   * @returns A promise resolving to an array of menu items in the specified category.
   */
  getMenuItemsByCategory(category: string): Promise<MongoMenuItem[]>;

  /**
   * Creates a new menu item.
   * @param item - The menu item data to insert.
   * @returns A promise resolving to the created menu item.
   */
  createMenuItem(item: InsertMenuItem): Promise<MongoMenuItem>;

  /**
   * Updates an existing menu item.
   * @param id - The ID of the menu item to update.
   * @param item - The partial menu item data to update.
   * @returns A promise resolving to the updated menu item or null if not found.
   */
  updateMenuItem(
    id: string,
    item: Partial<MongoMenuItem>
  ): Promise<MongoMenuItem | null>;

  /**
   * Deletes a menu item by its ID.
   * @param id - The ID of the menu item to delete.
   * @returns A promise resolving to true if the menu item was deleted, false otherwise.
   */
  deleteMenuItem(id: string): Promise<boolean>;

  // Order operations

  /**
   * Fetches an order by its ID.
   * @param id - The ID of the order.
   * @returns A promise resolving to the order or null if not found.
   */
  getOrder(id: string): Promise<MongoOrder | null>;

  /**
   * Fetches all orders.
   * @returns A promise resolving to an array of orders.
   */
  getOrders(): Promise<MongoOrder[]>;

  /**
   * Fetches orders by their status.
   * @param status - The status to filter orders by.
   * @returns A promise resolving to an array of orders with the specified status.
   */
  getOrdersByStatus(status: string): Promise<MongoOrder[]>;

  /**
   * Fetches orders for a specific table.
   * @param tableId - The ID of the table.
   * @returns A promise resolving to an array of orders for the specified table.
   */
  getOrdersByTable(tableId: string): Promise<MongoOrder[]>;

  /**
   * Fetches orders assigned to a specific waiter.
   * @param waiterId - The ID of the waiter.
   * @returns A promise resolving to an array of orders assigned to the waiter.
   */
  getOrdersByWaiter(waiterId: string): Promise<MongoOrder[]>;

  /**
   * Creates a new order.
   * @param order - The order data to insert.
   * @returns A promise resolving to the created order.
   */
  createOrder(order: InsertOrder): Promise<MongoOrder>;

  /**
   * Updates an existing order.
   * @param id - The ID of the order to update.
   * @param order - The partial order data to update.
   * @returns A promise resolving to the updated order or null if not found.
   */
  updateOrder(
    id: string,
    order: Partial<MongoOrder>
  ): Promise<MongoOrder | null>;

  /**
   * Updates the status of an order.
   * @param id - The ID of the order to update.
   * @param status - The new status of the order.
   * @returns A promise resolving to the updated order or null if not found.
   */
  updateOrderStatus(id: string, status: string): Promise<MongoOrder | null>;

  /**
   * Adds an item to an existing order.
   * @param orderId - The ID of the order.
   * @param item - The item to add to the order.
   * @returns A promise resolving to the updated order or null if not found.
   */
  addItemToOrder(orderId: string, item: any): Promise<MongoOrder | null>;

  /**
   * Updates an item in an existing order.
   * @param orderId - The ID of the order.
   * @param itemId - The ID of the item to update.
   * @param item - The partial item data to update.
   * @returns A promise resolving to the updated order or null if not found.
   */
  updateOrderItem(
    orderId: string,
    itemId: string,
    item: any
  ): Promise<MongoOrder | null>;

  // Payment operations

  /**
   * Fetches a payment by its ID.
   * @param id - The ID of the payment.
   * @returns A promise resolving to the payment or null if not found.
   */
  getPayment(id: string): Promise<MongoPayment | null>;

  /**
   * Fetches a payment by its associated order ID.
   * @param orderId - The ID of the order.
   * @returns A promise resolving to the payment or null if not found.
   */
  getPaymentByOrder(orderId: string): Promise<MongoPayment | null>;

  /**
   * Creates a new payment.
   * @param payment - The payment data to insert.
   * @returns A promise resolving to the created payment.
   */
  createPayment(payment: InsertPayment): Promise<MongoPayment>;

  /**
   * Fetches all payments.
   * @returns A promise resolving to an array of payments.
   */
  getAllPayments(): Promise<MongoPayment[]>;

  // Reporting operations

  /**
   * Fetches orders within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of orders within the date range.
   */
  getOrdersByDateRange(startDate: Date, endDate: Date): Promise<MongoOrder[]>;

  /**
   * Fetches payments within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of payments within the date range.
   */
  getPaymentsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<MongoPayment[]>;

  /**
   * Fetches the frequency of menu items ordered within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of menu item frequencies.
   */
  getItemOrderFrequency(
    startDate: Date,
    endDate: Date
  ): Promise<{ menuItemId: string; name: string; count: number }[]>;

  /**
   * Fetches the total revenue within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to the total revenue.
   */
  getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number>;
}

/**
 * MongoDB-based implementation of the IStorage interface.
 */
export class MongoDBStorage implements IStorage {
  private client: MongoClient;
  private db: Db | null = null;
  private initialized: boolean = false;

  /**
   * Creates an instance of MongoDBStorage.
   * @param connectionString - The MongoDB connection string.
   */
  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
  }

  /**
   * Initializes the MongoDB connection and sets up indexes.
   */
  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.client.connect();
      this.db = this.client.db("mag7_pos");
      this.initialized = true;
      console.log("MongoDB connected");

      // Create indexes
      await this.db
        .collection("users")
        .createIndex({ email: 1 }, { unique: true });
      await this.db
        .collection("tables")
        .createIndex({ number: 1 }, { unique: true });
    }
  }

  // The rest of the methods already have detailed comments above.
}

// Using MongoDB connection string as specified in the requirements
// Use environment variable for MongoDB URI with a fallback
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

/**
 * The storage instance for interacting with the database.
 */
export const storage = new MongoDBStorage(MONGODB_URI);
