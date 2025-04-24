import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticate } from "./middleware/auth";
import { checkRole, checkPermission, hasPermission, isHost, isWaiter, isChef, isManager, isOwner, isAdmin } from "./middleware/roleCheck";
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
  apiRouter.get("/tables", authenticate, checkPermission('tables'), tableController.getTables); // All staff can view tables
  apiRouter.get("/tables/:id", authenticate, checkPermission('tables'), tableController.getTable); // All staff can view table details
  apiRouter.post("/tables", authenticate, isManager, tableController.createTable); // Only managers can create tables
  apiRouter.put("/tables/:id", authenticate, checkPermission('tables'), tableController.updateTable); // All staff can update table status (Host marks as occupied/available)
  
  // Separate route for assigning waiters to tables (Manager function)
  apiRouter.put("/tables/:id/assign", authenticate, isManager, async (req, res) => {
    try {
      const { id } = req.params;
      const { waiterId } = req.body;
      
      // Update the table with the assigned waiter
      const updatedTable = await storage.updateTable(id, { waiterId });
      
      if (!updatedTable) {
        return res.status(404).json({ message: 'Table not found' });
      }
      
      res.json({ table: updatedTable });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // Menu routes
  apiRouter.get("/menu", authenticate, checkPermission('menu'), menuController.getMenuItems); // All staff can view menu
  apiRouter.get("/menu/:id", authenticate, checkPermission('menu'), menuController.getMenuItem); // All staff can view menu item details
  apiRouter.post("/menu", authenticate, isManager, menuController.createMenuItem); // Only managers can add menu items
  apiRouter.put("/menu/:id", authenticate, isManager, menuController.updateMenuItem); // Only managers can update menu items
  apiRouter.delete("/menu/:id", authenticate, isManager, menuController.deleteMenuItem); // Only managers can delete menu items
  
  // Special route for marking menu items as specials (Manager function)
  apiRouter.put("/menu/:id/special", authenticate, isManager, async (req, res) => {
    try {
      const { id } = req.params;
      const { isSpecial, price } = req.body;
      
      // Update the menu item
      const updatedItem = await storage.updateMenuItem(id, { isSpecial, price });
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      res.json({ menuItem: updatedItem });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // Order routes
  apiRouter.get("/orders", authenticate, checkPermission('orders'), async (req, res) => {
    // Allow waiters to see all orders (removed the filtering)
    // Only filter if they explicitly requested their own orders
    return orderController.getOrders(req, res);
  }); // All staff with orders permission can view orders
  apiRouter.get("/orders/:id", authenticate, checkPermission('orders'), orderController.getOrder); // All staff with orders permission can view order details
  apiRouter.post("/orders", authenticate, checkPermission('orders'), orderController.createOrder); // Waiters and above can create orders
  
  // Restricted route for updating order status (Only Chef can mark as in-progress/done)
  apiRouter.put("/orders/:id/status", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // First check if the user has basic orders permission
      if (req.user && (
          req.user.role === UserRole.WAITER || 
          req.user.role === UserRole.CHEF || 
          req.user.role === UserRole.MANAGER || 
          req.user.role === UserRole.OWNER || 
          req.user.role === UserRole.ADMIN)) {
        // These roles can manage orders
      } else {
        return res.status(403).json({ 
          message: 'Access denied. You do not have permission to manage orders.' 
        });
      }
      
      // If updating to in-progress or done, only chef or higher can do it
      if ((status === 'in-progress' || status === 'done') && 
          req.user && req.user.role !== UserRole.CHEF && 
          !['manager', 'owner', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ 
          message: 'Only chefs, managers, or owners can update order status to in-progress or done' 
        });
      }
      
      const order = await orderController.updateOrderStatus(req, res);
      return order;
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  apiRouter.post("/orders/:id/items", authenticate, checkPermission('orders'), orderController.addItemToOrder); // Waiters can add items to orders
  apiRouter.put("/orders/:orderId/items/:itemId", authenticate, checkPermission('orders'), orderController.updateOrderItem); // Waiters can update order items
  
  // Staff routes
  // Allow hosts to view waiters for table assignment
  apiRouter.get("/staff", authenticate, async (req, res) => {
    try {
      // If role is host and they're requesting only waiters, allow it
      const { role } = req.query;
      if (req.user && req.user.role === UserRole.HOST && role === 'waiter') {
        return staffController.getStaff(req, res);
      }
      
      // If requesting only waiters, any authenticated user can see them
      if (role === 'waiter') {
        return staffController.getStaff(req, res);
      }
      
      // Otherwise, enforce manager permission
      if (req.user && 
          (req.user.role === UserRole.MANAGER || 
           req.user.role === UserRole.OWNER || 
           req.user.role === UserRole.ADMIN)) {
        return staffController.getStaff(req, res);
      }
      
      return res.status(403).json({ 
        message: 'Access denied. You do not have the required permission.' 
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  apiRouter.get("/staff/:id", authenticate, isManager, staffController.getStaffMember); // Managers and up can view staff details
  
  // Create staff members - with role validation
  apiRouter.post("/staff", authenticate, isManager, async (req, res) => {
    try {
      const userData = req.body;
      
      // If creating a manager, only owner or admin can do it
      if (userData.role === UserRole.MANAGER && 
          req.user && req.user.role !== UserRole.OWNER && 
          req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ 
          message: 'Only owners or admins can create manager accounts' 
        });
      }
      
      // If creating lower level staff, managers can do it
      return staffController.createStaffMember(req, res);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // Update staff members - with role validation
  apiRouter.put("/staff/:id", authenticate, isManager, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Get current staff member to check role
      const currentStaff = await storage.getUser(id);
      
      // If target is a manager or being promoted to manager, only owner/admin can modify
      if ((currentStaff && currentStaff.role === UserRole.MANAGER) || updates.role === UserRole.MANAGER) {
        if (req.user && req.user.role !== UserRole.OWNER && req.user.role !== UserRole.ADMIN) {
          return res.status(403).json({ 
            message: 'Only owners or admins can modify manager accounts' 
          });
        }
      }
      
      // For other staff, managers can update
      return staffController.updateStaffMember(req, res);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // Delete staff members - with role validation
  apiRouter.delete("/staff/:id", authenticate, isManager, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get current staff member to check role
      const currentStaff = await storage.getUser(id);
      
      // If target is a manager, only owner/admin can delete
      if (currentStaff && currentStaff.role === UserRole.MANAGER) {
        if (req.user && req.user.role !== UserRole.OWNER && req.user.role !== UserRole.ADMIN) {
          return res.status(403).json({ 
            message: 'Only owners or admins can delete manager accounts' 
          });
        }
      }
      
      // For other staff, managers can delete
      return staffController.deleteStaffMember(req, res);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // Report routes
  apiRouter.get("/reports/item-frequency", authenticate, isOwner, reportController.getItemOrderFrequency);
  apiRouter.get("/reports/revenue", authenticate, isOwner, reportController.getRevenue);
  apiRouter.get("/reports/order-statistics", authenticate, isOwner, reportController.getOrderStatistics);
  
  // Admin routes
  apiRouter.post("/admin/register", authenticate, isAdmin, authController.register);
  
  // Payment routes
  const paymentsRouter = express.Router();
  apiRouter.use("/payments", authenticate, checkPermission('payments'), paymentsRouter);
  
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
      
      // Get table information to check assigned waiter
      const table = await storage.getTable(order.tableId);
      
      console.log('Payment request:', {
        userRole: req.user?.role,
        userId: req.user?.id,
        tableWaiterId: table?.waiterId,
        orderId: orderId,
        orderTableId: order.tableId
      });
      
      // Permission check: Allow all waiters to process payments for now
      if (req.user) {
        const isHigherRole = ['manager', 'owner', 'admin'].includes(req.user.role);
        const isWaiter = req.user.role === UserRole.WAITER;
        
        // Allow all waiters to process payments
        if (!isHigherRole && !isWaiter) {
          return res.status(403).json({ 
            message: 'Only waiters, managers, or owners can process payments' 
          });
        }
      }
      
      // Validate payment method is cash (waiters can only accept cash)
      if (req.user && req.user.role === UserRole.WAITER && paymentMethod !== 'cash') {
        return res.status(400).json({
          message: 'Waiters can only accept cash payments'
        });
      }
      
      // Create payment
      const payment = await storage.createPayment({
        orderId,
        amount,
        tip: tip || 0,
        paymentMethod
      });
      
      // Update order status to paid
      await storage.updateOrderStatus(orderId, 'paid');
      
      // Update table status if this was the last order for the table
      const tableOrders = await storage.getOrdersByTable(order.tableId);
      const unpaidOrders = tableOrders.filter(o => o.status !== 'paid' && o._id !== orderId);
      
      if (unpaidOrders.length === 0) {
        // Mark table as available
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
