# Documentation for `src\redux\menuSlice.ts`

---
```ts
/**
 * @interface MenuItem
 * @description Interface for a menu item.
 * @param {string} _id - The unique identifier of the menu item.
 * @param {string} name - The name of the menu item.
 * @param {string} description - A description of the menu item (optional).
 * @param {number} price - The price of the menu item.
 * @param {string} category - The category of the menu item.
 * @param {boolean} available - Whether the menu item is currently available.
 * @param {boolean} isSpecial - Whether the menu item is a special item.
 */
```

---
```ts
/**
 * @interface MenuState
 * @description Interface for the menu state.
 * @param {MenuItem[]} items - An array of menu items.
 * @param {MenuItem | null} selectedItem - The currently selected menu item, or null if none is selected.
 * @param {boolean} loading - Whether the menu data is currently being loaded.
 * @param {string | null} error - Any error message that occurred while loading the menu data, or null if there was no error.
 */
```

---
```ts
/**
 * @asyncThunk fetchMenuItems
 * @description Async thunk action to fetch menu items.
 * @param {string} category - The category to filter menu items by (optional).
 * @returns {Promise<MenuItem[]>} - A promise that resolves with an array of menu items.
 */
```

---
```ts
/**
 * @asyncThunk getMenuItemById
 * @description Async thunk action to get a menu item by its ID.
 * @param {string} id - The ID of the menu item to fetch.
 * @returns {Promise<MenuItem>} - A promise that resolves with the menu item.
 */
```

---
```ts
/**
 * @asyncThunk createMenuItem
 * @description Async thunk action to create a new menu item.
 * @param {Omit<MenuItem, '_id'>} data - The data for the new menu item, excluding the ID.
 * @returns {Promise<MenuItem>} - A promise that resolves with the newly created menu item.
 */
```

---
```ts
/**
 * @asyncThunk updateMenuItem
 * @description Async thunk action to update an existing menu item.
 * @param {string} id - The ID of the menu item to update.
 * @param {Partial<MenuItem>} data - The data to update for the menu item.
 * @returns {Promise<MenuItem>} - A promise that resolves with the updated menu item.
 */
```

---
```ts
/**
 * @asyncThunk deleteMenuItem
 * @description Async thunk action to delete a menu item.
 * @param {string} id - The ID of the menu item to delete.
 * @returns {Promise<string>} - A promise that resolves with the ID of the deleted menu item.
 */
```

---
```ts
/**
 * @slice menuSlice
 * @description Redux slice for managing menu items.
 */
```

---
```ts
/**
     * @reducer selectMenuItem
     * @description Reducer to select a menu item.
     * @param {MenuState} state - The current menu state.
     * @param {PayloadAction<MenuItem>} action - The action containing the menu item to select.
     */
```

---
```ts
/**
     * @reducer clearSelectedMenuItem
     * @description Reducer to clear the selected menu item.
     * @param {MenuState} state - The current menu state.
     */
```
