# Documentation for `src\lib\pdf.ts`

---
```ts
/**
 * @function generateRevenueReport
 * @description Generates a revenue report in PDF format.
 * @param {Date} startDate - The start date for the report.
 * @param {Date} endDate - The end date for the report.
 * @param {object} data - The revenue data.
 * @param {number} data.totalRevenue - The total revenue for the period.
 * @param {object} data.revenueByMethod - The revenue by payment method.
 * @param {number} data.totalTips - The total tips for the period.
 * @param {object} data.dailyRevenue - The daily revenue for the period.
 * @returns {jsPDF} - The jsPDF object containing the generated report.
 */
```

---
```ts
/**
 * @function generateItemFrequencyReport
 * @description Generates an item frequency report in PDF format.
 * @param {Date} startDate - The start date for the report.
 * @param {Date} endDate - The end date for the report.
 * @param {object[]} data - The item frequency data.
 * @param {string} data[].menuItemId - The ID of the menu item.
 * @param {string} data[].name - The name of the menu item.
 * @param {number} data[].count - The order count of the menu item.
 * @returns {jsPDF} - The jsPDF object containing the generated report.
 */
```

---
```ts
/**
 * @function generateOrderStatisticsReport
 * @description Generates an order statistics report in PDF format.
 * @param {Date} startDate - The start date for the report.
 * @param {Date} endDate - The end date for the report.
 * @param {object} data - The order statistics data.
 * @param {number} data.totalOrders - The total number of orders for the period.
 * @param {object} data.ordersByStatus - The number of orders by status.
 * @param {number} data.averageOrderAmount - The average order amount for the period.
 * @param {object} data.ordersByDayOfWeek - The number of orders by day of week.
 * @returns {jsPDF} - The jsPDF object containing the generated report.
 */
```
