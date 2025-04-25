# Documentation for `src\pages\reports\Reports.tsx`

---
```ts
/**
 * @constant CHART_COLORS
 * @description An array of colors used for charts in the reports.
 */
```

---
```ts
/**
 * @component Reports
 * @description A page component that displays various reports and analytics related to restaurant operations.
 * It includes revenue reports, item frequency reports, and order statistics, each displayed in its own tab.
 * @returns {JSX.Element} - The reports page element.
 */
```

---
```ts
/**
   * @useEffect
   * @description Fetches report data based on the active tab and date range.
   */
```

---
```ts
/**
   * @function handleApplyDateRange
   * @description Applies the selected date range to the reports.
   * It validates the date range and dispatches the setDateRange action to update the Redux store.
   */
```

---
```ts
/**
   * @function handleExportPDF
   * @description Exports the currently displayed report as a PDF file.
   * It generates the PDF document using the appropriate function based on the active tab and saves it with a descriptive filename.
   */
```

---
```ts
/**
   * @constant revenueChartData
   * @description Prepares data for the revenue chart, mapping daily revenue data to a format suitable for the chart component.
   */
```

---
```ts
/**
   * @constant paymentMethodChartData
   * @description Prepares data for the payment method pie chart, mapping revenue by payment method to a format suitable for the chart component.
   */
```

---
```ts
/**
   * @constant itemFrequencyChartData
   * @description Prepares data for the item frequency chart, sorting items by order count and limiting the chart to the top 10 items.
   */
```

---
```ts
/**
   * @function getCategory
   * @description Infers the category of a menu item based on its name.
   * @param {string} itemName - The name of the menu item.
   * @returns {string} - The inferred category of the menu item.
   */
```

---
```ts
/**
   * @constant itemsByCategory
   * @description Aggregates item frequency data by category.
   */
```

---
```ts
/**
   * @constant itemsByCategoryChartData
   * @description Prepares data for the items by category chart.
   */
```

---
```ts
/**
   * @constant ordersByDayChartData
   * @description Prepares data for the orders by day of week chart.
   */
```

---
```ts
/**
   * @constant ordersByStatusChartData
   * @description Prepares data for the orders by status pie chart.
   */
```
