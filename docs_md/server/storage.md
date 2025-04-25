# Documentation for `storage.ts`

---
```ts
/**
 * Interface defining the storage operations for the restaurant POS system.
 */
```

---
```ts
/**
   * Fetches a user by their ID.
   * @param id - The ID of the user.
   * @returns A promise resolving to the user or null if not found.
   */
```

---
```ts
/**
   * Fetches a user by their email.
   * @param email - The email of the user.
   * @returns A promise resolving to the user or null if not found.
   */
```

---
```ts
/**
   * Creates a new user.
   * @param user - The user data to insert.
   * @returns A promise resolving to the created user.
   */
```

---
```ts
/**
 * MongoDB-based implementation of the IStorage interface.
 */
```

---
```ts
/**
   * Creates an instance of MongoDBStorage.
   * @param connectionString - The MongoDB connection string.
   */
```

---
```ts
/**
   * Initializes the MongoDB connection and sets up indexes.
   */
```

---
```ts
/**
   * Fetches a user by their ID.
   * @param id - The ID of the user.
   * @returns A promise resolving to the user or null if not found.
   */
```

---
```ts
/**
   * Fetches a user by their email.
   * @param email - The email of the user.
   * @returns A promise resolving to the user or null if not found.
   */
```

---
```ts
/**
   * Creates a new user.
   * @param user - The user data to insert.
   * @returns A promise resolving to the created user.
   */
```

---
```ts
/**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param user - The partial user data to update.
   * @returns A promise resolving to the updated user or null if not found.
   */
```

---
```ts
/**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns A promise resolving to true if the user was deleted, false otherwise.
   */
```

---
```ts
/**
   * Fetches all users.
   * @returns A promise resolving to an array of users.
   */
```

---
```ts
/**
   * Fetches users by their role.
   * @param role - The role to filter users by.
   * @returns A promise resolving to an array of users with the specified role.
   */
```

---
```ts
/**
   * Fetches a table by its ID.
   * @param id - The ID of the table.
   * @returns A promise resolving to the table or null if not found.
   */
```

---
```ts
/**
   * Fetches all tables.
   * @returns A promise resolving to an array of tables.
   */
```

---
```ts
/**
   * Fetches tables by their status.
   * @param status - The status to filter tables by.
   * @returns A promise resolving to an array of tables with the specified status.
   */
```

---
```ts
/**
   * Fetches tables assigned to a specific waiter.
   * @param waiterId - The ID of the waiter.
   * @returns A promise resolving to an array of tables assigned to the waiter.
   */
```

---
```ts
/**
   * Fetches tables on a specific floor.
   * @param floor - The floor number.
   * @returns A promise resolving to an array of tables on the specified floor.
   */
```

---
```ts
/**
   * Creates a new table.
   * @param table - The table data to insert.
   * @returns A promise resolving to the created table.
   */
```

---
```ts
/**
   * Updates an existing table.
   * @param id - The ID of the table to update.
   * @param table - The partial table data to update.
   * @returns A promise resolving to the updated table or null if not found.
   */
```

---
```ts
/**
   * Fetches a menu item by its ID.
   * @param id - The ID of the menu item.
   * @returns A promise resolving to the menu item or null if not found.
   */
```

---
```ts
/**
   * Fetches all menu items.
   * @returns A promise resolving to an array of menu items.
   */
```

---
```ts
/**
   * Fetches menu items by their category.
   * @param category - The category to filter menu items by.
   * @returns A promise resolving to an array of menu items in the specified category.
   */
```

---
```ts
/**
   * Creates a new menu item.
   * @param item - The menu item data to insert.
   * @returns A promise resolving to the created menu item.
   */
```

---
```ts
/**
   * Updates an existing menu item.
   * @param id - The ID of the menu item to update.
   * @param item - The partial menu item data to update.
   * @returns A promise resolving to the updated menu item or null if not found.
   */
```

---
```ts
/**
   * Deletes a menu item by its ID.
   * @param id - The ID of the menu item to delete.
   * @returns A promise resolving to true if the menu item was deleted, false otherwise.
   */
```

---
```ts
/**
   * Fetches an order by its ID.
   * @param id - The ID of the order.
   * @returns A promise resolving to the order or null if not found.
   */
```

---
```ts
/**
   * Fetches all orders.
   * @returns A promise resolving to an array of orders.
   */
```

---
```ts
/**
   * Fetches orders by their status.
   * @param status - The status to filter orders by.
   * @returns A promise resolving to an array of orders with the specified status.
   */
```

---
```ts
/**
   * Fetches orders for a specific table.
   * @param tableId - The ID of the table.
   * @returns A promise resolving to an array of orders for the specified table.
   */
```

---
```ts
/**
   * Fetches orders assigned to a specific waiter.
   * @param waiterId - The ID of the waiter.
   * @returns A promise resolving to an array of orders assigned to the waiter.
   */
```

---
```ts
/**
   * Creates a new order.
   * @param order - The order data to insert.
   * @returns A promise resolving to the created order.
   */
```

---
```ts
/**
   * Updates an existing order.
   * @param id - The ID of the order to update.
   * @param order - The partial order data to update.
   * @returns A promise resolving to the updated order or null if not found.
   */
```

---
```ts
/**
   * Updates the status of an order.
   * @param id - The ID of the order to update.
   * @param status - The new status of the order.
   * @returns A promise resolving to the updated order or null if not found.
   */
```

---
```ts
/**
   * Adds an item to an existing order.
   * @param orderId - The ID of the order.
   * @param item - The item to add to the order.
   * @returns A promise resolving to the updated order or null if not found.
   */
```

---
```ts
/**
   * Updates an item in an existing order.
   * @param orderId - The ID of the order.
   * @param itemId - The ID of the item to update.
   * @param item - The partial item data to update.
   * @returns A promise resolving to the updated order or null if not found.
   */
```

---
```ts
/**
   * Fetches a payment by its ID.
   * @param id - The ID of the payment.
   * @returns A promise resolving to the payment or null if not found.
   */
```

---
```ts
/**
   * Fetches a payment by its associated order ID.
   * @param orderId - The ID of the order.
   * @returns A promise resolving to the payment or null if not found.
   */
```

---
```ts
/**
   * Creates a new payment.
   * @param payment - The payment data to insert.
   * @returns A promise resolving to the created payment.
   */
```

---
```ts
/**
   * Fetches all payments.
   * @returns A promise resolving to an array of payments.
   */
```

---
```ts
/**
   * Fetches orders within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of orders within the date range.
   */
```

---
```ts
/**
   * Fetches payments within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of payments within the date range.
   */
```

---
```ts
/**
   * Fetches the frequency of menu items ordered within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to an array of menu item frequencies.
   */
```

---
```ts
/**
   * Fetches the total revenue within a specific date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns A promise resolving to the total revenue.
   */
```

---
```ts
/**
 * The storage instance for interacting with the database.
 */
```
