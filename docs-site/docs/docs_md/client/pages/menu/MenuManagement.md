# Documentation for `src\pages\menu\MenuManagement.tsx`

---
```ts
/**
 * @component MenuManagement
 * @description A page component for managing menu items, allowing users to add, edit, and delete items.
 * It displays menu items in a table, categorized by type, and provides dialogs for item creation, modification, and deletion.
 * @returns {JSX.Element} - The menu management page element.
 */
```

---
```ts
/**
   * @interface FormState
   * @description Interface for the form state used in the add/edit menu item dialog.
   * @param {string} name - The name of the menu item.
   * @param {string} description - The description of the menu item.
   * @param {string} price - The price of the menu item.
   * @param {MenuItemCategory} category - The category of the menu item.
   * @param {boolean} available - Whether the menu item is currently available.
   * @param {boolean} isSpecial - Whether the menu item is marked as special.
   */
```

---
```ts
/**
   * @useEffect
   * @description Fetches menu items from the Redux store on component mount.
   */
```

---
```ts
/**
   * @function handleOpenAddDialog
   * @description Opens the add menu item dialog and resets the form state.
   */
```

---
```ts
/**
   * @function handleOpenEditDialog
   * @description Opens the edit menu item dialog and populates the form with the selected item's data.
   * @param {MenuItem} item - The menu item to edit.
   */
```

---
```ts
/**
   * @function handleOpenDeleteDialog
   * @description Opens the delete confirmation dialog for the selected menu item.
   * @param {MenuItem} item - The menu item to delete.
   */
```

---
```ts
/**
   * @function handleInputChange
   * @description Handles changes to input fields in the add/edit menu item dialog.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The change event.
   */
```

---
```ts
/**
   * @function handleSwitchChange
   * @description Handles changes to switch components in the add/edit menu item dialog.
   * @param {string} name - The name of the form field to update.
   * @param {boolean} checked - The new value of the switch.
   */
```

---
```ts
/**
   * @function handleSelectChange
   * @description Handles changes to select components in the add/edit menu item dialog.
   * @param {string} name - The name of the form field to update.
   * @param {string} value - The new value of the select component.
   */
```

---
```ts
/**
   * @function handleSubmit
   * @description Handles the submission of the add/edit menu item form.
   * It dispatches the appropriate Redux action to create or update the menu item.
   */
```

---
```ts
/**
   * @function handleDelete
   * @description Handles the deletion of a menu item.
   * It dispatches the deleteMenuItem Redux action and displays a toast notification.
   */
```

---
```ts
/**
   * @function getCategoryLabel
   * @description Returns a user-friendly label for a menu item category.
   * @param {string} category - The menu item category.
   * @returns {string} - The user-friendly label for the category.
   */
```
