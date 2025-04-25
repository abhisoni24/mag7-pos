# Documentation for `src\components\modals\TableDetailsModal.tsx`

---
```ts
/**
 * @interface TableDetailsModalProps
 * @description Interface for the props of the TableDetailsModal component.
 * @param {boolean} isOpen - A boolean indicating whether the modal is open.
 * @param {function} onClose - A function to close the modal.
 * @param {TableType} table - The table to display details for.
 * @param {StaffMember[]} waiters - An array of staff members to assign as waiters.
 * @param {function} onCreateOrder - A function to handle creating an order for the table.
 * @param {boolean} canChangeStatus - A boolean indicating whether the user can change the table status.
 */
```

---
```ts
/**
 * @component TableDetailsModal
 * @description A modal component that displays and allows editing of table details.
 *              It allows changing the table status, assigning a waiter, and setting reservation details.
 * @param {TableDetailsModalProps} props - The props for the TableDetailsModal component.
 * @returns {JSX.Element} - The modal element with table details and action buttons.
 */
```

---
```ts
/**
   * @useEffect
   * @description Resets form when table changes.
   */
```

---
```ts
/**
   * @function handleStatusChange
   * @description Handles status change.
   * @param {string} value - The new status value.
   */
```

---
```ts
/**
   * @function handleSave
   * @description Handles save.
   */
```
