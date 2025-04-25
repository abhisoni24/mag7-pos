# Documentation for `src\components\orders\OrderItem.tsx`

---
```ts
/**
 * @interface OrderItemProps
 * @description Interface for the props of the OrderItem component.
 * @param {Order} order - The order object to display.
 * @param {Table} [table] - The table associated with the order.
 * @param {object} [waiter] - The waiter assigned to the order.
 * @param {string} waiter.id - The ID of the waiter.
 * @param {string} waiter.name - The name of the waiter.
 * @param {function} onViewDetails - A function to call when the "View Details" button is clicked.
 * @param {function} onUpdateStatus - A function to call when the order status is updated.
 */
```

---
```ts
/**
 * @component OrderItem
 * @description Displays a summary of an order, including its status, items, and actions.
 * @param {OrderItemProps} props - The props for the OrderItem component.
 * @returns {JSX.Element} - The order item element.
 */
```

---
```ts
/**
   * @function calculateTotal
   * @description Calculates the total amount of an order.
   * @param {OrderItemType[]} items - The items in the order.
   * @returns {number} - The total amount of the order.
   */
```

---
```ts
/**
   * @function getTimeDistance
   * @description Formats the time distance between a given date and now.
   * @param {string} dateString - The date string to format.
   * @returns {string} - The formatted time distance.
   */
```

---
```ts
/**
   * @function getStatusInfo
   * @description Gets the status color and text based on the order status.
   * @param {string} status - The order status.
   * @returns {object} - The status color and text.
   */
```

---
```ts
/**
   * @function getNextStatuses
   * @description Gets the available next statuses based on the current status.
   * @param {string} currentStatus - The current order status.
   * @returns {array} - An array of available next statuses.
   */
```
