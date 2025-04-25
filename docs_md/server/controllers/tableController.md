# Documentation for `controllers\tableController.ts`

---
```ts
/**
 * Table Controller
 * 
 * This module handles table-related operations including retrieving, creating,
 * and updating tables in the restaurant.
 * 
 * @module controllers/tableController
 */
```

---
```ts
/**
 * GET /tables
 * Fetch tables, optionally filtered by status, floor, or assigned waiter
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Array} List of table documents
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * GET /tables/:id
 * Fetch a specific table by ID
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Table document
 * @throws {404} If table is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * POST /tables
 * Create a new table
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Created table document
 * @throws {400} If table number already exists or there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * PUT /tables/:id
 * Update an existing table
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Updated table document
 * @throws {400} If changing to occupied status without waiterId or there's a validation error
 * @throws {404} If table is not found
 * @throws {500} If there's a server error
 */
```
