# Documentation for `src\components\modals\CreateOrderModal.tsx`

---
```ts
/**
 * @interface CreateOrderModalProps
 * @description Interface for the props of the CreateOrderModal component.
 * @param {boolean} isOpen - A boolean indicating whether the modal is open.
 * @param {function} onClose - A function to close the modal.
 * @param {Table | null} table - The table for which the order is being created.
 * @param {Order | null} [existingOrder] - An optional existing order to edit.
 */
```

---
```ts
/**
 * @component CreateOrderModal
 * @description A modal component that allows users to create or edit orders.
 *              It displays menu items, allows searching and filtering, and manages order items.
 * @param {CreateOrderModalProps} props - The props for the CreateOrderModal component.
 * @returns {JSX.Element} - The modal element with menu items, order summary, and action buttons.
 */
```

---
```ts
/**
   * @useEffect
   * @description Loads menu items on mount.
   */
```

---
```ts
/**
   * @useEffect
   * @description Updates order items when existing order changes.
   */
```

---
```ts
/**
   * @useEffect
   * @description Calculates total amount whenever order items change.
   */
```

---
```ts
/**
   * @constant filteredMenuItems
   * @description Filters menu items based on category and search query.
   */
```

---
```ts
/**
   * @function scrollToBottom
   * @description Scrolls to bottom of the order items list.
   */
```

---
```ts
/**
   * @function handleAddItem
   * @description Adds item to order.
   * @param {MenuItem} item - The menu item to add.
   */
```

---
```ts
/**
   * @function handleUpdateQuantity
   * @description Updates item quantity.
   * @param {number} index - The index of the item to update.
   * @param {number} change - The amount to change the quantity by.
   */
```

---
```ts
/**
   * @function handleUpdateNotes
   * @description Updates item notes.
   * @param {number} index - The index of the item to update.
   * @param {string} notes - The new notes for the item.
   */
```

---
```ts
/**
   * @function handleRemoveItem
   * @description Removes item from order.
   * @param {number} index - The index of the item to remove.
   */
```

---
```ts
/**
   * @function handleSubmitOrder
   * @description Submits order.
   */
```

---
```ts
/**
   * @function handleSaveDraft
   * @description Saves order as draft (just close for now, actual implementation would save to localStorage or backend).
   */
```

---
```ts
/**
   * @function getCategoryDisplayName
   * @description Gets category display name.
   * @param {string} category - The menu item category.
   * @returns {string} - The display name of the category.
   */
```
