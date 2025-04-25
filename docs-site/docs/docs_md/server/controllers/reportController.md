# Documentation for `controllers\reportController.ts`

---
```ts
/**
 * Report Controller
 * 
 * This module handles generating various reports and analytics for the restaurant,
 * including item frequency, revenue, and order statistics.
 * 
 * @module controllers/reportController
 */
```

---
```ts
/**
 * GET /reports/item-frequency
 * Get frequency of ordered menu items within a date range
 * 
 * @param {Request} req - Express request object with startDate and endDate query params
 * @param {Response} res - Express response object
 * @returns {Array} Array of items with their order frequencies
 * @throws {400} If date params are missing or invalid
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * GET /reports/revenue
 * Get revenue statistics within a date range
 * 
 * @param {Request} req - Express request object with startDate and endDate query params
 * @param {Response} res - Express response object
 * @returns {Object} Revenue data including total, by payment method, tips, and daily breakdown
 * @throws {400} If date params are missing or invalid
 * @throws {500} If there's a server error
 */
```

---
```ts
/**
 * GET /reports/order-statistics
 * Get comprehensive order statistics within a date range
 * 
 * @param {Request} req - Express request object with startDate and endDate query params
 * @param {Response} res - Express response object
 * @returns {Object} Order statistics including total count, breakdown by status,
 *                   average order amount, and distribution by day of week
 * @throws {400} If date params are missing or invalid
 * @throws {500} If there's a server error
 */
```
