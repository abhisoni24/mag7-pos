# Documentation for `src\redux\reportSlice.ts`

---
```ts
/**
 * @interface ItemFrequency
 * @description Interface for item frequency data.
 * @param {string} menuItemId - The ID of the menu item.
 * @param {string} name - The name of the menu item.
 * @param {number} count - The frequency count of the menu item.
 */
```

---
```ts
/**
 * @interface RevenueData
 * @description Interface for revenue data.
 * @param {number} totalRevenue - The total revenue.
 * @param {Record<string, number>} revenueByMethod - The revenue by payment method.
 * @param {number} totalTips - The total tips.
 * @param {Record<string, number>} dailyRevenue - The daily revenue.
 */
```

---
```ts
/**
 * @interface OrderStatistics
 * @description Interface for order statistics.
 * @param {number} totalOrders - The total number of orders.
 * @param {Record<string, number>} ordersByStatus - The number of orders by status.
 * @param {number} averageOrderAmount - The average order amount.
 * @param {Record<string, number>} ordersByDayOfWeek - The number of orders by day of the week.
 */
```

---
```ts
/**
 * @interface ReportState
 * @description Interface for the report state.
 * @param {ItemFrequency[]} itemFrequency - The item frequency data.
 * @param {RevenueData | null} revenueData - The revenue data.
 * @param {OrderStatistics | null} orderStatistics - The order statistics.
 * @param {string} startDate - The start date for the report.
 * @param {string} endDate - The end date for the report.
 * @param {boolean} loading - Whether the report data is currently being loaded.
 * @param {string | null} error - Any error message that occurred while loading the report data, or null if there was no error.
 */
```

---
```ts
/**
 * @asyncThunk fetchItemFrequency
 * @description Async thunk action to fetch item frequency data.
 * @param {Object} params - An object containing the start and end dates for the report.
 * @param {string} params.startDate - The start date for the report.
 * @param {string} params.endDate - The end date for the report.
 * @returns {Promise<ItemFrequency[]>} - A promise that resolves with the item frequency data.
 */
```

---
```ts
/**
 * @asyncThunk fetchRevenueData
 * @description Async thunk action to fetch revenue data.
 * @param {Object} params - An object containing the start and end dates for the report.
 * @param {string} params.startDate - The start date for the report.
 * @param {string} params.endDate - The end date for the report.
 * @returns {Promise<RevenueData>} - A promise that resolves with the revenue data.
 */
```

---
```ts
/**
 * @asyncThunk fetchOrderStatistics
 * @description Async thunk action to fetch order statistics.
 * @param {Object} params - An object containing the start and end dates for the report.
 * @param {string} params.startDate - The start date for the report.
 * @param {string} params.endDate - The end date for the report.
 * @returns {Promise<OrderStatistics>} - A promise that resolves with the order statistics.
 */
```

---
```ts
/**
 * @slice reportSlice
 * @description Redux slice for managing reports.
 */
```

---
```ts
/**
     * @reducer setDateRange
     * @description Reducer to set the date range for the report.
     * @param {ReportState} state - The current report state.
     * @param {PayloadAction<{ startDate: string; endDate: string }>} action - The action containing the start and end dates.
     */
```
