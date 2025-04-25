# Documentation for `src\pages\tables\Tables.tsx`

---
```ts
/**
 * @component Tables
 * @description A page component that displays a list of tables, allows filtering by floor and waiter, and provides functionality to view table details and create new orders.
 * It fetches tables and staff data from the Redux store and renders them in a grid.
 * @returns {JSX.Element} - The tables page element.
 */
```

---
```ts
/**
   * @useEffect
   * @description Fetches tables and staff data from the Redux store on component mount.
   */
```

---
```ts
/**
   * @constant filteredTables
   * @description Filters the tables based on the selected floor and waiter.
   */
```

---
```ts
/**
   * @useEffect
   * @description Sets the default value for the waiter filter based on the user's role.
   */
```

---
```ts
/**
   * @function handleTableClick
   * @description Sets the selected table and opens the table details modal.
   * @param {TableType} table - The table to view details for.
   */
```

---
```ts
/**
   * @function handleTableModalClose
   * @description Closes the table details modal.
   */
```

---
```ts
/**
   * @function handleOrderModalClose
   * @description Closes the create order modal.
   */
```

---
```ts
/**
   * @function handleCreateOrder
   * @description Closes the table details modal and opens the create order modal.
   */
```

---
```ts
/**
   * @function canChangeTableStatus
   * @description Checks if the current user has permission to change the table status.
   * @returns {boolean} - True if the user can change the table status, false otherwise.
   */
```
