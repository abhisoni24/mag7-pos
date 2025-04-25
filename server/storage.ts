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

  // ... (rest of the IStorage interface)
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

  /**
   * Fetches a user by their ID.
   * @param id - The ID of the user.
   * @returns A promise resolving to the user or null if not found.
   */
  async getUser(id: string): Promise<MongoUser | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    const user = await this.db.collection<MongoUser>("users").findOne({
      _id: new ObjectId(id),
    });
    return user ? { ...user, _id: user._id.toString() } : null;
  }

  /**
   * Fetches a user by their email.
   * @param email - The email of the user.
   * @returns A promise resolving to the user or null if not found.
   */
  async getUserByEmail(email: string): Promise<MongoUser | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    const user = await this.db
      .collection<MongoUser>("users")
      .findOne({ email });
    return user ? { ...user, _id: user._id.toString() } : null;
  }

  /**
   * Creates a new user.
   * @param user - The user data to insert.
   * @returns A promise resolving to the created user.
   */
  async createUser(user: InsertUser): Promise<MongoUser> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<InsertUser>("users")
      .insertOne(user);

    const newUser = { ...user, _id: result.insertedId.toString() };

    return newUser as MongoUser;
  }

  /**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param user - The partial user data to update.
   * @returns A promise resolving to the updated user or null if not found.
   */
  async updateUser(
    id: string,
    user: Partial<MongoUser>
  ): Promise<MongoUser | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoUser>("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: user },
        { returnDocument: "after" }
      );

    if (!result) {
      return null;
    }

    const updatedUser = { ...result, _id: result._id.toString() };

    return updatedUser;
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns A promise resolving to true if the user was deleted, false otherwise.
   */
  async deleteUser(id: string): Promise<boolean> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoUser>("users")
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  }

  /**
   * Fetches all users.
   * @returns A promise resolving to an array of users.
   */
  async getUsers(): Promise<MongoUser[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const users = await this.db.collection<MongoUser>("users").find().toArray();

    return users.map((user) => ({ ...user, _id: user._id.toString() }));
  }

  /**
   * Fetches users by their role.
   * @param role - The role to filter users by.
   * @returns A promise resolving to an array of users with the specified role.
   */
  async getUsersByRole(role: string): Promise<MongoUser[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const users = await this.db
      .collection<MongoUser>("users")
      .find({ role: role })
      .toArray();

    return users.map((user) => ({ ...user, _id: user._id.toString() }));
  }

  /**
   * Fetches a table by its ID.
   * @param id - The ID of the table.
   * @returns A promise resolving to the table or null if not found.
   */
  async getTable(id: string): Promise<MongoTable | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const table = await this.db.collection<MongoTable>("tables").findOne({
      _id: new ObjectId(id),
    });

    return table ? { ...table, _id: table._id.toString() } : null;
  }

  /**
   * Fetches all tables.
   * @returns A promise resolving to an array of tables.
   */
  async getTables(): Promise<MongoTable[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const tables = await this.db
      .collection<MongoTable>("tables")
      .find()
      .toArray();

    return tables.map((table) => ({ ...table, _id: table._id.toString() }));
  }

  /**
   * Fetches tables by their status.
   * @param status - The status to filter tables by.
   * @returns A promise resolving to an array of tables with the specified status.
   */
  async getTablesByStatus(status: string): Promise<MongoTable[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const tables = await this.db
      .collection<MongoTable>("tables")
      .find({ status: status })
      .toArray();

    return tables.map((table) => ({ ...table, _id: table._id.toString() }));
  }

  /**
   * Fetches tables assigned to a specific waiter.
   * @param waiterId - The ID of the waiter.
   * @returns A promise resolving to an array of tables assigned to the waiter.
   */
  async getTablesByWaiter(waiterId: string): Promise<MongoTable[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const tables = await this.db
      .collection<MongoTable>("tables")
      .find({ waiterId: waiterId })
      .toArray();

    return tables.map((table) => ({ ...table, _id: table._id.toString() }));
  }

  /**
   * Fetches tables on a specific floor.
   * @param floor - The floor number.
   * @returns A promise resolving to an array of tables on the specified floor.
   */
  async getTablesByFloor(floor: number): Promise<MongoTable[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const tables = await this.db
      .collection<MongoTable>("tables")
      .find({ floor: floor })
      .toArray();

    return tables.map((table) => ({ ...table, _id: table._id.toString() }));
  }

  /**
   * Creates a new table.
   * @param table - The table data to insert.
   * @returns A promise resolving to the created table.
   */
  async createTable(table: InsertTable): Promise<MongoTable> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<InsertTable>("tables")
      .insertOne(table);

    const newTable = { ...table, _id: result.insertedId.toString() };

    return newTable as MongoTable;
  }

  /**
   * Updates an existing table.
   * @param id - The ID of the table to update.
   * @param table - The partial table data to update.
   * @returns A promise resolving to the updated table or null if not found.
   */
  async updateTable(
    id: string,
    table: Partial<MongoTable>
  ): Promise<MongoTable | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoTable>("tables")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: table },
        { returnDocument: "after" }
      );

    if (!result) {
      return null;
    }

    const updatedTable = { ...result, _id: result._id.toString() };

    return updatedTable;
  }

  /**
   * Fetches a menu item by its ID.
   * @param id - The ID of the menu item.
   * @returns A promise resolving to the menu item or null if not found.
   */
  async getMenuItem(id: string): Promise<MongoMenuItem | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const menuItem = await this.db
      .collection<MongoMenuItem>("menu_items")
      .findOne({
        _id: new ObjectId(id),
      });

    return menuItem ? { ...menuItem, _id: menuItem._id.toString() } : null;
  }

  /**
   * Fetches all menu items.
   * @returns A promise resolving to an array of menu items.
   */
  async getMenuItems(): Promise<MongoMenuItem[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const menuItems = await this.db
      .collection<MongoMenuItem>("menu_items")
      .find()
      .toArray();

    return menuItems.map((menuItem) => ({
      ...menuItem,
      _id: menuItem._id.toString(),
    }));
  }

  /**
   * Fetches menu items by their category.
   * @param category - The category to filter menu items by.
   * @returns A promise resolving to an array of menu items in the specified category.
   */
  async getMenuItemsByCategory(category: string): Promise<MongoMenuItem[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const menuItems = await this.db
      .collection<MongoMenuItem>("menu_items")
      .find({ category: category })
      .toArray();

    return menuItems.map((menuItem) => ({
      ...menuItem,
      _id: menuItem._id.toString(),
    }));
  }

  /**
   * Creates a new menu item.
   * @param item - The menu item data to insert.
   * @returns A promise resolving to the created menu item.
   */
  async createMenuItem(item: InsertMenuItem): Promise<MongoMenuItem> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<InsertMenuItem>("menu_items")
      .insertOne(item);

    const newMenuItem = { ...item, _id: result.insertedId.toString() };

    return newMenuItem as MongoMenuItem;
  }

  /**
   * Updates an existing menu item.
   * @param id - The ID of the menu item to update.
   * @param item - The partial menu item data to update.
   * @returns A promise resolving to the updated menu item or null if not found.
   */
  async updateMenuItem(
    id: string,
    item: Partial<MongoMenuItem>
  ): Promise<MongoMenuItem | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoMenuItem>("menu_items")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: item },
        { returnDocument: "after" }
      );

    if (!result) {
      return null;
    }

    const updatedMenuItem = { ...result, _id: result._id.toString() };

    return updatedMenuItem;
  }

  /**
   * Deletes a menu item by its ID.
   * @param id - The ID of the menu item to delete.
   * @returns A promise resolving to true if the menu item was deleted, false otherwise.
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoMenuItem>("menu_items")
      .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  }

  /**
   * Fetches an order by its ID.
   * @param id - The ID of the order.
   * @returns A promise resolving to the order or null if not found.
   */
  async getOrder(id: string): Promise<MongoOrder | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const order = await this.db.collection<MongoOrder>("orders").findOne({
      _id: new ObjectId(id),
    });

    return order ? { ...order, _id: order._id.toString() } : null;
  }

  /**
   * Fetches all orders.
   * @returns A promise resolving to an array of orders.
   */
  async getOrders(): Promise<MongoOrder[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const orders = await this.db
      .collection<MongoOrder>("orders")
      .find()
      .toArray();

    return orders.map((order) => ({ ...order, _id: order._id.toString() }));
  }

  /**
   * Fetches orders by their status.
   * @param status - The status to filter orders by.
   * @returns A promise resolving to an array of orders with the specified status.
   */
  async getOrdersByStatus(status: string): Promise<MongoOrder[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const orders = await this.db
      .collection<MongoOrder>("orders")
      .find({ status: status })
      .toArray();

    return orders.map((order) => ({ ...order, _id: order._id.toString() }));
  }

  /**
   * Fetches orders for a specific table.
   * @param tableId - The ID of the table.
   * @returns A promise resolving to an array of orders for the specified table.
   */
  async getOrdersByTable(tableId: string): Promise<MongoOrder[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const orders = await this.db
      .collection<MongoOrder>("orders")
      .find({ tableId: tableId })
      .toArray();

    return orders.map((order) => ({ ...order, _id: order._id.toString() }));
  }

  /**
   * Fetches orders assigned to a specific waiter.
   * @param waiterId - The ID of the waiter.
   * @returns A promise resolving to an array of orders assigned to the waiter.
   */
  async getOrdersByWaiter(waiterId: string): Promise<MongoOrder[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const orders = await this.db
      .collection<MongoOrder>("orders")
      .find({ waiterId: waiterId })
      .toArray();

    return orders.map((order) => ({ ...order, _id: order._id.toString() }));
  }

  /**
   * Creates a new order.
   * @param order - The order data to insert.
   * @returns A promise resolving to the created order.
   */
  async createOrder(order: InsertOrder): Promise<MongoOrder> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<InsertOrder>("orders")
      .insertOne(order);

    const newOrder = { ...order, _id: result.insertedId.toString() };

    return newOrder as MongoOrder;
  }

  /**
   * Updates an existing order.
   * @param id - The ID of the order to update.
   * @param order - The partial order data to update.
   * @returns A promise resolving to the updated order or null if not found.
   */
  async updateOrder(
    id: string,
    order: Partial<MongoOrder>
  ): Promise<MongoOrder | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoOrder>("orders")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: order },
        { returnDocument: "after" }
      );

    if (!result) {
      return null;
    }

    const updatedOrder = { ...result, _id: result._id.toString() };

    return updatedOrder;
  }

  /**
   * Updates the status of an order.
   * @param id - The ID of the order to update.
   * @param status - The new status of the order.
   * @returns A promise resolving to the updated order or null if not found.
   */
  async updateOrderStatus(
    id: string,
    status: string
  ): Promise<MongoOrder | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoOrder>("orders")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: status } },
        { returnDocument: "after" }
      );

    if (!result) {
      return null;
    }

    const updatedOrder = { ...result, _id: result._id.toString() };

    return updatedOrder;
  }

  /**
   * Adds an item to an existing order.
   * @param orderId - The ID of the order.
   * @param item - The item to add to the order.
   * @returns A promise resolving to the updated order or null if not found.
   */
  async addItemToOrder(orderId: string, item: any): Promise<MongoOrder | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoOrder>("orders")
      .findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        { $push: { items: item } },
        { returnDocument: "after" }
      );

    if (!result) {
      return null;
    }

    const updatedOrder = { ...result, _id: result._id.toString() };

    return updatedOrder;
  }

  /**
   * Updates an item in an existing order.
   * @param orderId - The ID of the order.
   * @param itemId - The ID of the item to update.
   * @param item - The partial item data to update.
   * @returns A promise resolving to the updated order or null if not found.
   */
  async updateOrderItem(
    orderId: string,
    itemId: string,
    item: any
  ): Promise<MongoOrder | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoOrder>("orders")
      .findOneAndUpdate(
        { _id: new ObjectId(orderId), "items._id": new ObjectId(itemId) },
        { $set: { "items.$": item } },
        { returnDocument: "after" }
      );

    if (!result) {
      return null;
    }

    const updatedOrder = { ...result, _id: result._id.toString() };

    return updatedOrder;
  }

  /**
   * Fetches a payment by its ID.
   * @param id - The ID of the payment.
   * @returns A promise resolving to the payment or null if not found.
   */
  async getPayment(id: string): Promise<MongoPayment | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const payment = await this.db.collection<MongoPayment>("payments").findOne({
      _id: new ObjectId(id),
    });

    return payment ? { ...payment, _id: payment._id.toString() } : null;
  }

  /**
   * Fetches a payment by its associated order ID.
   * @param orderId - The ID of the order.
   * @returns A promise resolving to the payment or null if not found.
   */
  async getPaymentByOrder(orderId: string): Promise<MongoPayment | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const payment = await this.db
      .collection<MongoPayment>("payments")
      .findOne({ orderId: orderId });

    return payment ? { ...payment, _id: payment._id.toString() } : null;
  }

  /**
   * Creates a new payment.
   * @param payment - The payment data to insert.
   * @returns A promise resolving to the created payment.
   */
  async createPayment(payment: InsertPayment): Promise<MongoPayment> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<InsertPayment>("payments")
      .insertOne(payment);

    const newPayment = { ...payment, _id: result.insertedId.toString() };

    return newPayment as MongoPayment;
  }

  /**
   * Fetches all payments.
   * @returns A promise resolving to an array of payments.
   */
  async getAllPayments(): Promise<MongoPayment[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const payments = await this.db
      .collection<MongoPayment>("payments")
      .find()
      .toArray();

    return payments.map((payment) => ({
      ...payment,
      _id: payment._id.toString(),
    }));
  }

  /**
   * Fetches orders within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of orders within the date range.
   */
  async getOrdersByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<MongoOrder[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const orders = await this.db
      .collection<MongoOrder>("orders")
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .toArray();

    return orders.map((order) => ({ ...order, _id: order._id.toString() }));
  }

  /**
   * Fetches payments within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of payments within the date range.
   */
  async getPaymentsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<MongoPayment[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const payments = await this.db
      .collection<MongoPayment>("payments")
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .toArray();

    return payments.map((payment) => ({
      ...payment,
      _id: payment._id.toString(),
    }));
  }

  /**
   * Fetches the frequency of menu items ordered within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of menu item frequencies.
   */
  async getItemOrderFrequency(
    startDate: Date,
    endDate: Date
  ): Promise<{ menuItemId: string; name: string; count: number }[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoOrder>("orders")
      .aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: "$items.menuItemId",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "menu_items",
            localField: "_id",
            foreignField: "_id",
            as: "menuItem",
          },
        },
        {
          $unwind: "$menuItem",
        },
        {
          $project: {
            _id: 0,
            menuItemId: "$_id",
            name: "$menuItem.name",
            count: 1,
          },
        },
      ])
      .toArray();

    return result as { menuItemId: string; name: string; count: number }[];
  }

  /**
   * Fetches the total revenue within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to the total revenue.
   */
  async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const result = await this.db
      .collection<MongoPayment>("payments")
      .aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
          },
        },
      ])
      .toArray();

    if (result.length === 0) {
      return 0;
    }

    return result[0].totalRevenue;
  }
}

// Using MongoDB connection string as specified in the requirements
// Use environment variable for MongoDB URI with a fallback
const MONGODB_URI = process.env.MONGODB_URI;
// console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

/**
 * The storage instance for interacting with the database.
 */
export const storage = new MongoDBStorage(MONGODB_URI);

// Initialize the database connection
storage
  .initialize()
  .then(() => console.log("Storage initialized successfully"))
  .catch((err) => console.error("Failed to initialize storage:", err));
