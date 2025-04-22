import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticate } from "./middleware/auth";
import { checkRole, isManager, isOwner, isAdmin } from "./middleware/roleCheck";
import { initializeDatabase } from "./utils/db";
import { UserRole } from "@shared/schema";

// Import controllers
import * as authController from "./controllers/authController";
import * as tableController from "./controllers/tableController";
import * as menuController from "./controllers/menuController";
import * as orderController from "./controllers/orderController";
import * as staffController from "./controllers/staffController";
import * as reportController from "./controllers/reportController";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database with sample data
  await initializeDatabase();
  
  // Base API route
  const apiRouter = express.Router();
  app.use("/api", apiRouter);
  
  // Auth routes
  apiRouter.post("/auth/login", authController.login);
  apiRouter.get("/auth/profile", authenticate, authController.getProfile);
  
  // Table routes
  apiRouter.get("/tables", authenticate, tableController.getTables);
  apiRouter.get("/tables/:id", authenticate, tableController.getTable);
  apiRouter.post("/tables", authenticate, isManager, tableController.createTable);
  apiRouter.put("/tables/:id", authenticate, tableController.updateTable);
  
  // Menu routes
  apiRouter.get("/menu", authenticate, menuController.getMenuItems);
  apiRouter.get("/menu/:id", authenticate, menuController.getMenuItem);
  apiRouter.post("/menu", authenticate, isManager, menuController.createMenuItem);
  apiRouter.put("/menu/:id", authenticate, isManager, menuController.updateMenuItem);
  apiRouter.delete("/menu/:id", authenticate, isManager, menuController.deleteMenuItem);
  
  // Order routes
  apiRouter.get("/orders", authenticate, orderController.getOrders);
  apiRouter.get("/orders/:id", authenticate, orderController.getOrder);
  apiRouter.post("/orders", authenticate, orderController.createOrder);
  apiRouter.put("/orders/:id/status", authenticate, orderController.updateOrderStatus);
  apiRouter.post("/orders/:id/items", authenticate, orderController.addItemToOrder);
  apiRouter.put("/orders/:orderId/items/:itemId", authenticate, orderController.updateOrderItem);
  
  // Staff routes
  apiRouter.get("/staff", authenticate, isManager, staffController.getStaff);
  apiRouter.get("/staff/:id", authenticate, isManager, staffController.getStaffMember);
  apiRouter.post("/staff", authenticate, isManager, staffController.createStaffMember);
  apiRouter.put("/staff/:id", authenticate, isManager, staffController.updateStaffMember);
  apiRouter.delete("/staff/:id", authenticate, isManager, staffController.deleteStaffMember);
  
  // Report routes
  apiRouter.get("/reports/item-frequency", authenticate, isOwner, reportController.getItemOrderFrequency);
  apiRouter.get("/reports/revenue", authenticate, isOwner, reportController.getRevenue);
  apiRouter.get("/reports/order-statistics", authenticate, isOwner, reportController.getOrderStatistics);
  
  // Admin routes
  apiRouter.post("/admin/register", authenticate, isAdmin, authController.register);
  
  // Payment routes
  const paymentsRouter = express.Router();
  apiRouter.use("/payments", authenticate, paymentsRouter);
  
  paymentsRouter.post("/", async (req, res) => {
    try {
      const { orderId, amount, tip, paymentMethod } = req.body;
      
      // Verify order exists
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Check if order is already paid
      if (order.status === 'paid') {
        return res.status(400).json({ message: 'Order is already paid' });
      }
      
      // Create payment
      const payment = await storage.createPayment({
        orderId,
        amount,
        tip: tip || 0,
        paymentMethod
      });
      
      // Update table status if this was the last order for the table
      const tableOrders = await storage.getOrdersByTable(order.tableId);
      const unpaidOrders = tableOrders.filter(o => o.status !== 'paid' && o._id !== orderId);
      
      if (unpaidOrders.length === 0) {
        // Check if we should clear the table
        await storage.updateTable(order.tableId, { status: 'available', waiterId: undefined, guestCount: undefined });
      }
      
      res.status(201).json({ payment });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  paymentsRouter.get("/", async (req, res) => {
    try {
      const { orderId } = req.query;
      
      if (orderId) {
        const payment = await storage.getPaymentByOrder(orderId as string);
        return res.json({ payment });
      }
      
      // This would need to be implemented in storage.ts
      // For now, return a 501 Not Implemented
      res.status(501).json({ message: 'Listing all payments not implemented' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
