import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticate } from "./middleware/auth";
import {
  checkRole,
  checkPermission,
  hasPermission,
  isHost,
  isWaiter,
  isChef,
  isManager,
  isOwner,
  isAdmin,
} from "./middleware/roleCheck";
import { initializeDatabase } from "./utils/db";
import { UserRole } from "@shared/schema";

// Import controllers
import * as authController from "./controllers/authController";
import * as tableController from "./controllers/tableController";
import * as menuController from "./controllers/menuController";
import * as orderController from "./controllers/orderController";
import * as staffController from "./controllers/staffController";
import * as reportController from "./controllers/reportController";

/**
 * Registers all application routes and initializes the database.
 *
 * This function sets up the Express application with API routes for
 * authentication, tables, menu, orders, staff, reports, and payments.
 * It also initializes the database with sample data and configures
 * middleware for role-based access control.
 *
 * @param app - The Express application instance.
 * @returns A promise that resolves to the HTTP server instance.
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database with sample data
  await initializeDatabase();

  /**
   * Base API router for all application routes.
   */
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  /**
   * Authentication routes.
   *
   * - POST /auth/login: Logs in a user.
   * - GET /auth/profile: Retrieves the authenticated user's profile.
   */
  apiRouter.post("/auth/login", authController.login);
  apiRouter.get("/auth/profile", authenticate, authController.getProfile);

  /**
   * Table routes.
   *
   * - GET /tables: Retrieves all tables (requires `tables` permission).
   * - GET /tables/:id: Retrieves details of a specific table.
   * - POST /tables: Creates a new table (manager-only).
   * - PUT /tables/:id: Updates the status of a table.
   * - PUT /tables/:id/assign: Assigns a waiter to a table (manager-only).
   */
  apiRouter.get(
    "/tables",
    authenticate,
    checkPermission("tables"),
    tableController.getTables
  );
  apiRouter.get(
    "/tables/:id",
    authenticate,
    checkPermission("tables"),
    tableController.getTable
  );
  apiRouter.post(
    "/tables",
    authenticate,
    isManager,
    tableController.createTable
  );
  apiRouter.put(
    "/tables/:id",
    authenticate,
    checkPermission("tables"),
    tableController.updateTable
  );
  apiRouter.put(
    "/tables/:id/assign",
    authenticate,
    isManager,
    async (req, res) => {
      try {
        const { id } = req.params;
        const { waiterId } = req.body;

        // Update the table with the assigned waiter
        const updatedTable = await storage.updateTable(id, { waiterId });

        if (!updatedTable) {
          return res.status(404).json({ message: "Table not found" });
        }

        res.json({ table: updatedTable });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "An unexpected error occurred" });
        }
      }
    }
  );

  /**
   * Menu routes.
   *
   * - GET /menu: Retrieves all menu items (requires `menu` permission).
   * - GET /menu/:id: Retrieves details of a specific menu item.
   * - POST /menu: Creates a new menu item (manager-only).
   * - PUT /menu/:id: Updates a menu item (manager-only).
   * - DELETE /menu/:id: Deletes a menu item (manager-only).
   * - PUT /menu/:id/special: Marks a menu item as a special (manager-only).
   */
  apiRouter.get(
    "/menu",
    authenticate,
    checkPermission("menu"),
    menuController.getMenuItems
  );
  apiRouter.get(
    "/menu/:id",
    authenticate,
    checkPermission("menu"),
    menuController.getMenuItem
  );
  apiRouter.post(
    "/menu",
    authenticate,
    isManager,
    menuController.createMenuItem
  );
  apiRouter.put(
    "/menu/:id",
    authenticate,
    isManager,
    menuController.updateMenuItem
  );
  apiRouter.delete(
    "/menu/:id",
    authenticate,
    isManager,
    menuController.deleteMenuItem
  );
  apiRouter.put(
    "/menu/:id/special",
    authenticate,
    isManager,
    async (req, res) => {
      try {
        const { id } = req.params;
        const { isSpecial, price } = req.body;

        // Update the menu item
        const updatedItem = await storage.updateMenuItem(id, {
          isSpecial,
          price,
        });

        if (!updatedItem) {
          return res.status(404).json({ message: "Menu item not found" });
        }

        res.json({ menuItem: updatedItem });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "An unexpected error occurred" });
        }
      }
    }
  );

  /**
   * Order routes.
   *
   * - GET /orders: Retrieves all orders (requires `orders` permission).
   * - GET /orders/:id: Retrieves details of a specific order.
   * - POST /orders: Creates a new order.
   * - PUT /orders/:id/status: Updates the status of an order.
   * - POST /orders/:id/items: Adds an item to an order.
   * - PUT /orders/:orderId/items/:itemId: Updates an item in an order.
   */
  apiRouter.get(
    "/orders",
    authenticate,
    checkPermission("orders"),
    orderController.getOrders
  );
  apiRouter.get(
    "/orders/:id",
    authenticate,
    checkPermission("orders"),
    orderController.getOrder
  );
  apiRouter.post(
    "/orders",
    authenticate,
    checkPermission("orders"),
    orderController.createOrder
  );
  apiRouter.put("/orders/:id/status", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Permission checks and status updates
      const order = await orderController.updateOrderStatus(req, res);
      return order;
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
  apiRouter.post(
    "/orders/:id/items",
    authenticate,
    checkPermission("orders"),
    orderController.addItemToOrder
  );
  apiRouter.put(
    "/orders/:orderId/items/:itemId",
    authenticate,
    checkPermission("orders"),
    orderController.updateOrderItem
  );

  /**
   * Staff routes.
   *
   * - GET /staff: Retrieves all staff members.
   * - GET /staff/:id: Retrieves details of a specific staff member.
   * - POST /staff: Creates a new staff member (manager-only).
   * - PUT /staff/:id: Updates a staff member (manager-only).
   * - DELETE /staff/:id: Deletes a staff member (manager-only).
   */
  apiRouter.get("/staff", authenticate, staffController.getStaff);
  apiRouter.get(
    "/staff/:id",
    authenticate,
    isManager,
    staffController.getStaffMember
  );
  apiRouter.post(
    "/staff",
    authenticate,
    isManager,
    staffController.createStaffMember
  );
  apiRouter.put(
    "/staff/:id",
    authenticate,
    isManager,
    staffController.updateStaffMember
  );
  apiRouter.delete(
    "/staff/:id",
    authenticate,
    isManager,
    staffController.deleteStaffMember
  );

  /**
   * Report routes.
   *
   * - GET /reports/item-frequency: Retrieves item order frequency (owner-only).
   * - GET /reports/revenue: Retrieves revenue data (owner-only).
   * - GET /reports/order-statistics: Retrieves order statistics (owner-only).
   */
  apiRouter.get(
    "/reports/item-frequency",
    authenticate,
    isOwner,
    reportController.getItemOrderFrequency
  );
  apiRouter.get(
    "/reports/revenue",
    authenticate,
    isOwner,
    reportController.getRevenue
  );
  apiRouter.get(
    "/reports/order-statistics",
    authenticate,
    isOwner,
    reportController.getOrderStatistics
  );

  /**
   * Admin routes.
   *
   * - POST /admin/register: Registers a new admin user (admin-only).
   */
  apiRouter.post(
    "/admin/register",
    authenticate,
    isAdmin,
    authController.register
  );

  /**
   * Payment routes.
   *
   * - POST /payments: Processes a payment for an order.
   * - GET /payments: Retrieves payment details.
   */
  const paymentsRouter = express.Router();
  apiRouter.use(
    "/payments",
    authenticate,
    checkPermission("payments"),
    paymentsRouter
  );

  paymentsRouter.post("/", async (req, res) => {
    try {
      const { orderId, amount, tip, paymentMethod } = req.body;

      // Process payment logic
      const payment = await storage.createPayment({
        orderId,
        amount,
        tip: tip || 0,
        paymentMethod,
      });

      res.status(201).json({ payment });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
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

      res.status(501).json({ message: "Listing all payments not implemented" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });

  /**
   * Create and return the HTTP server instance.
   */
  const httpServer = createServer(app);
  return httpServer;
}
