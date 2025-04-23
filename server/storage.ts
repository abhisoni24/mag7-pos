import { MongoClient, Db, ObjectId } from "mongodb";
import { 
  MongoUser, MongoTable, MongoMenuItem, MongoOrder, MongoPayment,
  InsertUser, User, InsertTable, Table, InsertMenuItem, MenuItem,
  InsertOrder, Order, InsertOrderItem, InsertPayment, Payment,
  OrderStatus, TableStatus
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<MongoUser | null>;
  getUserByEmail(email: string): Promise<MongoUser | null>;
  createUser(user: InsertUser): Promise<MongoUser>;
  updateUser(id: string, user: Partial<MongoUser>): Promise<MongoUser | null>;
  deleteUser(id: string): Promise<boolean>;
  getUsers(): Promise<MongoUser[]>;
  getUsersByRole(role: string): Promise<MongoUser[]>;
  
  // Table operations
  getTable(id: string): Promise<MongoTable | null>;
  getTables(): Promise<MongoTable[]>;
  getTablesByStatus(status: string): Promise<MongoTable[]>;
  getTablesByWaiter(waiterId: string): Promise<MongoTable[]>;
  getTablesByFloor(floor: number): Promise<MongoTable[]>;
  createTable(table: InsertTable): Promise<MongoTable>;
  updateTable(id: string, table: Partial<MongoTable>): Promise<MongoTable | null>;
  
  // Menu operations
  getMenuItem(id: string): Promise<MongoMenuItem | null>;
  getMenuItems(): Promise<MongoMenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MongoMenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MongoMenuItem>;
  updateMenuItem(id: string, item: Partial<MongoMenuItem>): Promise<MongoMenuItem | null>;
  deleteMenuItem(id: string): Promise<boolean>;
  
  // Order operations
  getOrder(id: string): Promise<MongoOrder | null>;
  getOrders(): Promise<MongoOrder[]>;
  getOrdersByStatus(status: string): Promise<MongoOrder[]>;
  getOrdersByTable(tableId: string): Promise<MongoOrder[]>;
  getOrdersByWaiter(waiterId: string): Promise<MongoOrder[]>;
  createOrder(order: InsertOrder): Promise<MongoOrder>;
  updateOrder(id: string, order: Partial<MongoOrder>): Promise<MongoOrder | null>;
  updateOrderStatus(id: string, status: string): Promise<MongoOrder | null>;
  addItemToOrder(orderId: string, item: any): Promise<MongoOrder | null>;
  updateOrderItem(orderId: string, itemId: string, item: any): Promise<MongoOrder | null>;

  // Payment operations
  getPayment(id: string): Promise<MongoPayment | null>;
  getPaymentByOrder(orderId: string): Promise<MongoPayment | null>;
  createPayment(payment: InsertPayment): Promise<MongoPayment>;
  
  // Reporting operations
  getOrdersByDateRange(startDate: Date, endDate: Date): Promise<MongoOrder[]>;
  getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<MongoPayment[]>;
  getItemOrderFrequency(startDate: Date, endDate: Date): Promise<{ menuItemId: string, name: string, count: number }[]>;
  getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number>;
}

export class MongoDBStorage implements IStorage {
  private client: MongoClient;
  private db: Db | null = null;
  private initialized: boolean = false;

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
  }

  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.client.connect();
      this.db = this.client.db("mag7_pos");
      this.initialized = true;
      console.log("MongoDB connected");
      
      // Create indexes
      await this.db.collection("users").createIndex({ email: 1 }, { unique: true });
      await this.db.collection("tables").createIndex({ number: 1 }, { unique: true });
    }
  }

  // User operations
  async getUser(id: string): Promise<MongoUser | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("users").findOne<MongoUser>({ _id: new ObjectId(id) }) as Promise<MongoUser | null>;
  }

  async getUserByEmail(email: string): Promise<MongoUser | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("users").findOne<MongoUser>({ email }) as Promise<MongoUser | null>;
  }

  async createUser(user: InsertUser): Promise<MongoUser> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const result = await this.db.collection("users").insertOne(user as unknown as MongoUser);
    return { ...user, _id: result.insertedId.toString() } as MongoUser;
  }

  async updateUser(id: string, user: Partial<MongoUser>): Promise<MongoUser | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const result = await this.db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: user },
      { returnDocument: "after" }
    );
    
    return result as unknown as MongoUser | null;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const result = await this.db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async getUsers(): Promise<MongoUser[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("users").find<MongoUser>({}).toArray();
  }

  async getUsersByRole(role: string): Promise<MongoUser[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("users").find<MongoUser>({ role }).toArray();
  }

  // Table operations
  async getTable(id: string): Promise<MongoTable | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("tables").findOne<MongoTable>({ _id: new ObjectId(id) }) as Promise<MongoTable | null>;
  }

  async getTables(): Promise<MongoTable[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("tables").find<MongoTable>({}).toArray();
  }

  async getTablesByStatus(status: string): Promise<MongoTable[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("tables").find<MongoTable>({ status }).toArray();
  }

  async getTablesByWaiter(waiterId: string): Promise<MongoTable[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("tables").find<MongoTable>({ waiterId }).toArray();
  }

  async getTablesByFloor(floor: number): Promise<MongoTable[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("tables").find<MongoTable>({ floor }).toArray();
  }

  async createTable(table: InsertTable): Promise<MongoTable> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const result = await this.db.collection("tables").insertOne(table as unknown as MongoTable);
    return { ...table, _id: result.insertedId.toString() } as MongoTable;
  }

  async updateTable(id: string, table: Partial<MongoTable>): Promise<MongoTable | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const result = await this.db.collection("tables").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: table },
      { returnDocument: "after" }
    );
    
    return result as unknown as MongoTable | null;
  }

  // Menu operations
  async getMenuItem(id: string): Promise<MongoMenuItem | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("menuItems").findOne<MongoMenuItem>({ _id: new ObjectId(id) }) as Promise<MongoMenuItem | null>;
  }

  async getMenuItems(): Promise<MongoMenuItem[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("menuItems").find<MongoMenuItem>({}).toArray();
  }

  async getMenuItemsByCategory(category: string): Promise<MongoMenuItem[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("menuItems").find<MongoMenuItem>({ category }).toArray();
  }

  async createMenuItem(item: InsertMenuItem): Promise<MongoMenuItem> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const result = await this.db.collection("menuItems").insertOne(item as unknown as MongoMenuItem);
    return { ...item, _id: result.insertedId.toString() } as MongoMenuItem;
  }

  async updateMenuItem(id: string, item: Partial<MongoMenuItem>): Promise<MongoMenuItem | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const result = await this.db.collection("menuItems").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: item },
      { returnDocument: "after" }
    );
    
    return result as unknown as MongoMenuItem | null;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const result = await this.db.collection("menuItems").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Order operations
  async getOrder(id: string): Promise<MongoOrder | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("orders").findOne<MongoOrder>({ _id: new ObjectId(id) }) as Promise<MongoOrder | null>;
  }

  async getOrders(): Promise<MongoOrder[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("orders").find<MongoOrder>({}).toArray();
  }

  async getOrdersByStatus(status: string): Promise<MongoOrder[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("orders").find<MongoOrder>({ status }).toArray();
  }

  async getOrdersByTable(tableId: string): Promise<MongoOrder[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("orders").find<MongoOrder>({ tableId }).toArray();
  }

  async getOrdersByWaiter(waiterId: string): Promise<MongoOrder[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("orders").find<MongoOrder>({ waiterId }).toArray();
  }

  async createOrder(order: InsertOrder): Promise<MongoOrder> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const now = new Date();
    const mongoOrder: MongoOrder = {
      ...order as unknown as MongoOrder,
      createdAt: now,
      updatedAt: now,
      items: []
    };
    
    const result = await this.db.collection("orders").insertOne(mongoOrder);
    return { ...mongoOrder, _id: result.insertedId.toString() };
  }

  async updateOrder(id: string, order: Partial<MongoOrder>): Promise<MongoOrder | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const updates = { ...order, updatedAt: new Date() };
    
    const result = await this.db.collection("orders").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" }
    );
    
    return result as unknown as MongoOrder | null;
  }

  async updateOrderStatus(id: string, status: string): Promise<MongoOrder | null> {
    return this.updateOrder(id, { status } as Partial<MongoOrder>);
  }

  async addItemToOrder(orderId: string, item: any): Promise<MongoOrder | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    // Get the menu item to include its name
    const menuItem = await this.getMenuItem(item.menuItemId.toString());
    if (!menuItem) throw new Error("Menu item not found");
    
    const orderItem = {
      menuItemId: item.menuItemId.toString(),
      name: menuItem.name,
      quantity: item.quantity || 1,
      price: typeof item.price === 'number' ? item.price : menuItem.price,
      notes: item.notes || null,
      status: item.status || OrderStatus.NEW
    };
    
    const result = await this.db.collection("orders").findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { 
        $push: { items: orderItem },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: "after" }
    );
    
    return result as unknown as MongoOrder | null;
  }

  async updateOrderItem(orderId: string, itemId: string, updates: any): Promise<MongoOrder | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const order = await this.getOrder(orderId);
    if (!order) throw new Error("Order not found");
    
    // Update the specific item in the items array
    const updatedItems = order.items.map(item => {
      if (item.menuItemId === itemId) {
        return { ...item, ...updates };
      }
      return item;
    });
    
    return this.updateOrder(orderId, { 
      items: updatedItems,
      updatedAt: new Date()
    } as Partial<MongoOrder>);
  }

  // Payment operations
  async getPayment(id: string): Promise<MongoPayment | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("payments").findOne<MongoPayment>({ _id: new ObjectId(id) }) as Promise<MongoPayment | null>;
  }

  async getPaymentByOrder(orderId: string): Promise<MongoPayment | null> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("payments").findOne<MongoPayment>({ orderId }) as Promise<MongoPayment | null>;
  }

  async createPayment(payment: InsertPayment): Promise<MongoPayment> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const mongoPayment: MongoPayment = {
      ...payment as unknown as MongoPayment,
      paymentDate: new Date()
    };
    
    const result = await this.db.collection("payments").insertOne(mongoPayment);
    
    // Update the order status to PAID
    await this.updateOrderStatus(payment.orderId.toString(), OrderStatus.PAID);
    
    return { ...mongoPayment, _id: result.insertedId.toString() };
  }

  // Reporting operations
  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<MongoOrder[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    return this.db.collection("orders").find<MongoOrder>({
      createdAt: { $gte: startDate, $lte: endDate }
    }).toArray();
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<MongoPayment[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    // Log the query criteria
    console.log("Payments query:", { 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString()
    });
    
    // Get all payments from the database to debug
    const allPayments = await this.db.collection("payments").find().toArray();
    console.log("All payments in DB:", allPayments);
    
    return this.db.collection("payments").find<MongoPayment>({
      paymentDate: { $gte: startDate, $lte: endDate }
    }).toArray();
  }

  async getItemOrderFrequency(startDate: Date, endDate: Date): Promise<{ menuItemId: string, name: string, count: number }[]> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const orders = await this.getOrdersByDateRange(startDate, endDate);
    
    const itemFrequency: Record<string, { menuItemId: string, name: string, count: number }> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemFrequency[item.menuItemId]) {
          itemFrequency[item.menuItemId] = {
            menuItemId: item.menuItemId,
            name: item.name,
            count: 0
          };
        }
        itemFrequency[item.menuItemId].count += item.quantity;
      });
    });
    
    return Object.values(itemFrequency);
  }

  async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number> {
    await this.initialize();
    if (!this.db) throw new Error("Database not initialized");
    
    const payments = await this.getPaymentsByDateRange(startDate, endDate);
    
    return payments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0);
  }
}

// Using MongoDB connection string as specified in the requirements
// Use environment variable for MongoDB URI with a fallback
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://asoni24:admin@cluster0.mpqcvei.mongodb.net/";

export const storage = new MongoDBStorage(MONGODB_URI);
