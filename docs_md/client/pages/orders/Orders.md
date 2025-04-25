# Documentation for `src\pages\orders\Orders.tsx`

---
```ts
/**
 * @component Orders
 * @description A page component that displays a list of orders, allows filtering by status, and provides functionality to view order details and create new orders.
 * It fetches orders, tables, and staff data from the Redux store and renders them in a tabbed interface.
 * @returns {JSX.Element} - The orders page element.
 */
```

---
```ts
/**
   * @useEffect
   * @description Fetches orders, tables, and staff data from the Redux store on component mount.
   */
```

---
```ts
/**
   * @constant filteredOrders
   * @description Filters the orders based on the active tab (order status).
   */
```

---
```ts
/**
   * @constant sortedOrders
   * @description Sorts the filtered orders by creation date (newest first).
   */
```

---
```ts
/**
   * @function handleViewOrderDetails
   * @description Sets the selected order and opens the order details modal.
   * @param {Order} order - The order to view details for.
   */
```

---
```ts
/**
   * @function handleCloseOrderDetails
   * @description Closes the order details modal and clears the selected order.
   */
```

---
```ts
/**
   * @function handleUpdateStatus
   * @description Updates the status of an order and displays a toast notification.
   * @param {Order} order - The order to update.
   * @param {string} newStatus - The new status to set for the order.
   */
```
