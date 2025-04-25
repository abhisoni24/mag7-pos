# Documentation for `src\components\tables\TableItem.tsx`

---
```ts
/**
 * @interface TableItemProps
 * @description Interface for the props of the TableItem component.
 * @param {Table} table - The table object to display.
 * @param {StaffMember[]} waiters - An array of staff members to assign as waiters.
 * @param {function} onClick - A function to call when the table item is clicked.
 */
```

---
```ts
/**
 * @component TableItem
 * @description Displays a summary of a table, including its status, capacity, and assigned waiter.
 * @param {TableItemProps} props - The props for the TableItem component.
 * @returns {JSX.Element} - The table item element.
 */
```

---
```ts
/**
   * @function getStatusColor
   * @description Gets the background color based on the table status.
   * @param {string} status - The table status.
   * @returns {string} - The background color class name.
   */
```

---
```ts
/**
   * @function getStatusTextColor
   * @description Gets the text color based on the table status.
   * @param {string} status - The table status.
   * @returns {string} - The text color class name.
   */
```

---
```ts
/**
   * @function getWaiterName
   * @description Gets the name of the waiter assigned to the table.
   * @param {string} waiterId - The ID of the waiter.
   * @returns {string} - The name of the waiter, or '-' if no waiter is assigned.
   */
```

---
```ts
/**
   * @function formatReservationTime
   * @description Formats the reservation time.
   * @param {string} timeString - The reservation time string.
   * @returns {string} - The formatted reservation time, or null if the time is invalid.
   */
```

---
```ts
/**
   * @function getStatusDisplayText
   * @description Gets the display text for the table status.
   * @param {string} status - The table status.
   * @returns {string} - The display text for the table status.
   */
```
