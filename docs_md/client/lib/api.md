# Documentation for `src\lib\api.ts`

---
```ts
/**
 * @function login
 * @description Authenticates a user with the provided credentials.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} [role] - The user's role (optional).
 * @returns {Promise<any>} - A promise that resolves with the login response.
 */
```

---
```ts
/**
 * @function getProfile
 * @description Retrieves the user's profile information.
 * @returns {Promise<any>} - A promise that resolves with the user's profile data.
 */
```

---
```ts
/**
 * @function getTables
 * @description Retrieves a list of tables based on the provided parameters.
 * @param {object} [params] - An object containing filter parameters.
 * @param {string} [params.status] - The status of the tables to retrieve.
 * @param {number} [params.floor] - The floor number to filter tables by.
 * @param {string} [params.waiterId] - The ID of the waiter assigned to the tables.
 * @returns {Promise<any>} - A promise that resolves with the list of tables.
 */
```

---
```ts
/**
 * @function getTable
 * @description Retrieves a single table by its ID.
 * @param {string} id - The ID of the table to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the table data.
 */
```

---
```ts
/**
 * @function createTable
 * @description Creates a new table with the provided data.
 * @param {object} data - The data for the new table.
 * @param {number} data.number - The table number.
 * @param {number} data.capacity - The table capacity.
 * @param {number} [data.floor] - The floor number (optional).
 * @returns {Promise<any>} - A promise that resolves with the created table data.
 */
```

---
```ts
/**
 * @function updateTable
 * @description Updates an existing table with the provided data.
 * @param {string} id - The ID of the table to update.
 * @param {object} data - The data to update the table with.
 * @returns {Promise<any>} - A promise that resolves with the updated table data.
 */
```

---
```ts
/**
 * @function getMenuItems
 * @description Retrieves a list of menu items, optionally filtered by category.
 * @param {string} [category] - The category to filter menu items by (optional).
 * @returns {Promise<any>} - A promise that resolves with the list of menu items.
 */
```

---
```ts
/**
 * @function getMenuItem
 * @description Retrieves a single menu item by its ID.
 * @param {string} id - The ID of the menu item to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the menu item data.
 */
```

---
```ts
/**
 * @function createMenuItem
 * @description Creates a new menu item with the provided data.
 * @param {object} data - The data for the new menu item.
 * @returns {Promise<any>} - A promise that resolves with the created menu item data.
 */
```

---
```ts
/**
 * @function updateMenuItem
 * @description Updates an existing menu item with the provided data.
 * @param {string} id - The ID of the menu item to update.
 * @param {object} data - The data to update the menu item with.
 * @returns {Promise<any>} - A promise that resolves with the updated menu item data.
 */
```

---
```ts
/**
 * @function deleteMenuItem
 * @description Deletes a menu item by its ID.
 * @param {string} id - The ID of the menu item to delete.
 * @returns {Promise<any>} - A promise that resolves with the deletion response.
 */
```

---
```ts
/**
 * @function getOrders
 * @description Retrieves a list of orders based on the provided parameters.
 * @param {object} [params] - An object containing filter parameters.
 * @param {string} [params.status] - The status of the orders to retrieve.
 * @param {string} [params.tableId] - The ID of the table to filter orders by.
 * @param {string} [params.waiterId] - The ID of the waiter assigned to the orders.
 * @returns {Promise<any>} - A promise that resolves with the list of orders.
 */
```

---
```ts
/**
 * @function getOrder
 * @description Retrieves a single order by its ID.
 * @param {string} id - The ID of the order to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the order data.
 */
```

---
```ts
/**
 * @function createOrder
 * @description Creates a new order with the provided data.
 * @param {object} data - The data for the new order.
 * @param {string} data.tableId - The ID of the table for the order.
 * @param {string} [data.waiterId] - The ID of the waiter assigned to the order (optional).
 * @param {any[]} [data.items] - The items included in the order (optional).
 * @returns {Promise<any>} - A promise that resolves with the created order data.
 */
```

---
```ts
/**
 * @function updateOrderStatus
 * @description Updates the status of an existing order.
 * @param {string} id - The ID of the order to update.
 * @param {string} status - The new status for the order.
 * @returns {Promise<any>} - A promise that resolves with the updated order data.
 */
```

---
```ts
/**
 * @function addItemToOrder
 * @description Adds a new item to an existing order.
 * @param {string} orderId - The ID of the order to add the item to.
 * @param {object} item - The item to add to the order.
 * @returns {Promise<any>} - A promise that resolves with the updated order data.
 */
```

---
```ts
/**
 * @function updateOrderItem
 * @description Updates an item in an existing order.
 * @param {string} orderId - The ID of the order containing the item.
 * @param {string} itemId - The ID of the item to update.
 * @param {object} updates - The updates to apply to the item.
 * @returns {Promise<any>} - A promise that resolves with the updated order data.
 */
```

---
```ts
/**
 * @function getStaff
 * @description Retrieves a list of staff members, optionally filtered by role.
 * @param {string} [role] - The role to filter staff members by (optional).
 * @returns {Promise<any>} - A promise that resolves with the list of staff members.
 */
```

---
```ts
/**
 * @function getStaffMember
 * @description Retrieves a single staff member by their ID.
 * @param {string} id - The ID of the staff member to retrieve.
 * @returns {Promise<any>} - A promise that resolves with the staff member data.
 */
```

---
```ts
/**
 * @function createStaffMember
 * @description Creates a new staff member with the provided data.
 * @param {object} data - The data for the new staff member.
 * @returns {Promise<any>} - A promise that resolves with the created staff member data.
 */
```

---
```ts
/**
 * @function updateStaffMember
 * @description Updates an existing staff member with the provided data.
 * @param {string} id - The ID of the staff member to update.
 * @param {object} data - The data to update the staff member with.
 * @returns {Promise<any>} - A promise that resolves with the updated staff member data.
 */
```

---
```ts
/**
 * @function deleteStaffMember
 * @description Deletes a staff member by their ID.
 * @param {string} id - The ID of the staff member to delete.
 * @returns {Promise<any>} - A promise that resolves with the deletion response.
 */
```

---
```ts
/**
 * @function createPayment
 * @description Creates a new payment record.
 * @param {object} data - The data for the new payment.
 * @param {string} data.orderId - The ID of the order the payment is for.
 * @param {number} data.amount - The amount paid.
 * @param {number} [data.tip] - The tip amount (optional).
 * @param {string} data.paymentMethod - The payment method used.
 * @returns {Promise<any>} - A promise that resolves with the created payment data.
 */
```

---
```ts
/**
 * @function getPaymentByOrder
 * @description Retrieves payment information for a specific order.
 * @param {string} orderId - The ID of the order to retrieve payment information for.
 * @returns {Promise<any>} - A promise that resolves with the payment data.
 */
```

---
```ts
/**
 * @function getItemOrderFrequency
 * @description Retrieves the order frequency of items within a specified date range.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 * @returns {Promise<any>} - A promise that resolves with the item order frequency data.
 */
```

---
```ts
/**
 * @function getRevenue
 * @description Retrieves revenue data within a specified date range.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 * @returns {Promise<any>} - A promise that resolves with the revenue data.
 */
```

---
```ts
/**
 * @function getOrderStatistics
 * @description Retrieves order statistics within a specified date range.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 * @returns {Promise<any>} - A promise that resolves with the order statistics data.
 */
```

---
```ts
/**
 * @function registerUser
 * @description Registers a new user (Admin API).
 * @param {object} data - The data for the new user.
 * @returns {Promise<any>} - A promise that resolves with the registration response.
 */
```
