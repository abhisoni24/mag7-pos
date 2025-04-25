# Documentation for `src\pages\kitchen\Kitchen.tsx`

---
```ts
/**
 * @component Kitchen
 * @description A page component that displays the kitchen interface for managing orders.
 * It shows incoming, in-progress, and completed orders, and allows kitchen staff to update order statuses.
 * @returns {JSX.Element} - The kitchen page element.
 */
```

---
```ts
/**
   * @function fetchOrdersByStatus
   * @description Fetches orders by a specific status and updates the loaded state.
   * @param {string} status - The status of the orders to fetch.
   * @returns {Promise<void>} - A promise that resolves when the orders are fetched and state is updated.
   */
```

---
```ts
/**
   * @function fetchAllKitchenOrders
   * @description Fetches all kitchen-related data, including tables, staff, and orders with different statuses.
   * It also handles setting the initial loading state and refreshing the data.
   * @returns {Promise<void>} - A promise that resolves when all data is fetched and state is updated.
   */
```

---
```ts
/**
   * @useEffect
   * @description Fetches initial data and sets up polling for new orders on component mount.
   */
```

---
```ts
/**
   * @function handleRefresh
   * @description Manually refreshes the kitchen display with the latest orders.
   */
```

---
```ts
/**
   * @function getTableNumber
   * @description Gets the table number from the table ID.
   * @param {string} tableId - The ID of the table.
   * @returns {string} - The table number, or 'Unknown' if not found.
   */
```

---
```ts
/**
   * @function getTimeElapsed
   * @description Calculates the time elapsed since the order was created.
   * @param {string} createdAt - The creation timestamp of the order.
   * @returns {string} - A string representing the time elapsed (e.g., "Just now", "1 minute ago", "5m ago").
   */
```

---
```ts
/**
   * @function handleStartOrder
   * @description Updates the order status to 'in_progress'.
   * @param {Order} order - The order to start.
   */
```

---
```ts
/**
   * @function handleCompleteOrder
   * @description Updates the order status to 'done'.
   * @param {Order} order - The order to complete.
   */
```

---
```ts
/**
   * @function showOrderDetails
   * @description Sets the selected order to display its details in a modal.
   * @param {Order} order - The order to display.
   */
```

---
```ts
/**
   * @function renderOrderCard
   * @description Renders a card component for an order.
   * @param {Order} order - The order to render.
   * @param {'new' | 'in_progress'} status - The status of the order.
   * @returns {JSX.Element} - The order card element.
   */
```
