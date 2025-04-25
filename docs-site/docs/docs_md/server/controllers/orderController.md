# Documentation for `controllers\orderController.ts`

---
```ts
/**
 * GET /orders
 * Fetch orders based on query parameters
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Array} List of order documents
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * GET /orders/:id
 * Fetch a specific order by ID
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Order document
 * @throws {404} If order is not found
 */
```

---
```ts
/**
 * POST /orders
 * Create a new order or add to an existing active order for a table
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Created or updated order
 * @throws {400} If table is not occupied or there's a validation error
 * @throws {404} If table or menu item is not found
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * PUT /orders/:id/status
 * Update the status of an existing order
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Updated order document
 * @throws {400} If status is invalid or there's a validation error
 * @throws {404} If order is not found
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * POST /orders/:id/items
 * Add a new item to an existing order
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Updated order with the new item
 * @throws {400} If order is already paid or there's a validation error
 * @throws {404} If order or menu item is not found
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * PUT /orders/:orderId/items/:itemId
 * Update an existing item in an order
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Updated order with the modified item
 * @throws {400} If there's a validation error
 * @throws {404} If order or item is not found
 * @throws {500} If there's a server error
 */
```
