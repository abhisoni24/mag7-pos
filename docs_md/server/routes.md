# Documentation for `routes.ts`

---
```ts
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
```

---
```ts
/**
   * Base API router for all application routes.
   */
```

---
```ts
/**
   * Authentication routes.
   *
   * - POST /auth/login: Logs in a user.
   * - GET /auth/profile: Retrieves the authenticated user's profile.
   */
```

---
```ts
/**
   * Table routes.
   *
   * - GET /tables: Retrieves all tables (requires `tables` permission).
   * - GET /tables/:id: Retrieves details of a specific table.
   * - POST /tables: Creates a new table (manager-only).
   * - PUT /tables/:id: Updates the status of a table.
   * - PUT /tables/:id/assign: Assigns a waiter to a table (manager-only).
   */
```

---
```ts
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
```

---
```ts
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
```

---
```ts
/**
   * Staff routes.
   *
   * - GET /staff: Retrieves all staff members.
   * - GET /staff/:id: Retrieves details of a specific staff member.
   * - POST /staff: Creates a new staff member (manager-only).
   * - PUT /staff/:id: Updates a staff member (manager-only).
   * - DELETE /staff/:id: Deletes a staff member (manager-only).
   */
```

---
```ts
/**
   * Report routes.
   *
   * - GET /reports/item-frequency: Retrieves item order frequency (owner-only).
   * - GET /reports/revenue: Retrieves revenue data (owner-only).
   * - GET /reports/order-statistics: Retrieves order statistics (owner-only).
   */
```

---
```ts
/**
   * Admin routes.
   *
   * - POST /admin/register: Registers a new admin user (admin-only).
   */
```

---
```ts
/**
   * Payment routes.
   *
   * - POST /payments: Processes a payment for an order.
   * - GET /payments: Retrieves payment details.
   */
```

---
```ts
/**
   * Create and return the HTTP server instance.
   */
```
