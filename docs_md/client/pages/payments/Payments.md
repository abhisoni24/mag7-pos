# Documentation for `src\pages\payments\Payments.tsx`

---
```ts
/**
 * @component Payments
 * @description A page component for processing payments for orders.
 * It displays a list of pending and paid orders, allows filtering by status, and provides a modal for processing payments.
 */
```

---
```ts
/**
   * @useEffect
   * @description Fetches orders and tables data from the Redux store on component mount.
   */
```

---
```ts
/**
   * @constant pendingPaymentOrders
   * @description Filters the orders to only include those that are pending payment (status is 'done' or 'delivered').
   */
```

---
```ts
/**
   * @constant paidOrders
   * @description Filters the orders to only include those that have been paid (status is 'paid').
   */
```

---
```ts
/**
   * @constant sortedPendingOrders
   * @description Sorts the pending payment orders by update date (newest first).
   */
```

---
```ts
/**
   * @constant sortedPaidOrders
   * @description Sorts the paid orders by update date (newest first).
   */
```

---
```ts
/**
   * @function getTableInfo
   * @description Retrieves table information based on the table ID.
   * @param {string} tableId - The ID of the table.
   * @returns {string} - A string containing the table number, or 'Unknown Table' if not found.
   */
```

---
```ts
/**
   * @function calculateOrderTotal
   * @description Calculates the total amount for an order based on the price and quantity of each item.
   * @param {Order} order - The order to calculate the total for.
   * @returns {number} - The total amount for the order.
   */
```

---
```ts
/**
   * @function handleOpenPaymentModal
   * @description Opens the payment modal for a specific order.
   * @param {Order} order - The order to process the payment for.
   */
```

---
```ts
/**
   * @function handleClosePaymentModal
   * @description Closes the payment modal and resets the state.
   */
```

---
```ts
/**
   * @function handleProcessPayment
   * @description Processes the payment for the selected order.
   * It dispatches the createPayment action and displays a toast notification.
   */
```

---
```ts
/**
   * @function renderOrdersTable
   * @description Renders a table of orders.
   * @param {Order[]} ordersToDisplay - The array of orders to display in the table.
   * @returns {JSX.Element} - The table element.
   */
```
