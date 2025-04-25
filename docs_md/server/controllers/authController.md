# Documentation for `controllers\authController.ts`

---
```ts
/**
 * Authentication Controller
 * 
 * This module handles user authentication functions including login, registration,
 * and fetching user profiles.
 * 
 * @module controllers/authController
 */
```

---
```ts
/**
 * Authenticates a user and returns a JWT token
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
```

---
```ts
/**
 * Registers a new user
 * This endpoint is restricted to managers, owners, or admins
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
```

---
```ts
/**
 * Retrieves the authenticated user's profile
 * 
 * @param {Request} req - Express request object with user property from auth middleware
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 */
```
