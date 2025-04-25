# Documentation for `controllers\staffController.ts`

---
```ts
/**
 * Staff Controller
 * 
 * This module handles staff-related operations including retrieving, creating,
 * updating, and deleting staff members (users with various roles).
 * 
 * @module controllers/staffController
 */
```

---
```ts
/**
 * GET /staff
 * Fetch staff members, optionally filtered by role
 * Excludes admin users unless specifically requested by role
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Array} List of staff members with sanitized information (no passwords)
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * GET /staff/:id
 * Fetch a specific staff member by ID
 * Admin users can only be accessed by other admins
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Object} Staff member details with sanitized information (no password)
 * @throws {403} If trying to access admin user without admin privileges
 * @throws {404} If staff member is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * POST /staff
 * Create a new staff member
 * Permission based on role hierarchy: admin > owner > manager
 * 
 * @param {Request} req - Express request object with authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} Created staff member with sanitized information (no password)
 * @throws {403} If user lacks permission to create staff with specified role
 * @throws {400} If email already exists or there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * PUT /staff/:id
 * Update an existing staff member
 * Permission based on role hierarchy: admin > owner > manager
 * 
 * @param {Request} req - Express request object with authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} Updated staff member with sanitized information (no password)
 * @throws {403} If user lacks permission to update staff to specified role
 * @throws {404} If staff member is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * DELETE /staff/:id
 * Deactivate a staff member (not permanent deletion)
 * Permission based on role hierarchy: admin > owner > manager
 * 
 * @param {Request} req - Express request object with authenticated user
 * @param {Response} res - Express response object
 * @returns {Object} Success message
 * @throws {403} If user lacks permission to delete staff member
 * @throws {404} If staff member is not found
 * @throws {400} If there's a validation error
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * Helper function to validate role permissions based on hierarchy
 * 
 * @param {string} userRole - The role of the authenticated user making the request
 * @param {string} targetRole - The role being assigned to or modified for a staff member
 * @returns {boolean} Whether the user has permission to manage the target role
 */
```
