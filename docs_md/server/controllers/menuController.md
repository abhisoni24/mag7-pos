# Documentation for `controllers\menuController.ts`

---
```ts
/**
 * Menu Controller
 * 
 * This module handles menu-related operations including retrieving, creating,
 * updating, and deleting menu items.
 * 
 * @module controllers/menuController
 */
```

---
```ts
/**
 * GET /menu
 * Fetch menu items, optionally filtered by category
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Array} List of menu items
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * GET /menu/:id
 * Fetch a specific menu item by ID
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Menu item document
 * @throws {404} If menu item is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * POST /menu
 * Create a new menu item
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Created menu item
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * PUT /menu/:id
 * Update an existing menu item
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Updated menu item
 * @throws {404} If menu item is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * DELETE /menu/:id
 * Delete a menu item
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Success message
 * @throws {404} If menu item is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```
