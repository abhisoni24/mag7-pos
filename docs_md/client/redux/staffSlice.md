# Documentation for `src\redux\staffSlice.ts`

---
```ts
/**
 * @interface StaffMember
 * @description Interface representing a staff member.
 * @param {string} id - The unique identifier of the staff member.
 * @param {string} name - The name of the staff member.
 * @param {string} email - The email address of the staff member.
 * @param {string} role - The role of the staff member.
 * @param {boolean} active - Whether the staff member is active.
 */
```

---
```ts
/**
 * @interface StaffState
 * @description Interface representing the staff state in the Redux store.
 * @param {StaffMember[]} staff - An array of staff members.
 * @param {StaffMember | null} selectedStaff - The currently selected staff member, or null if none is selected.
 * @param {boolean} loading - Indicates whether the staff data is currently being loaded.
 * @param {string | null} error - Any error message that occurred while loading the staff data, or null if there was no error.
 */
```

---
```ts
/**
 * @asyncThunk fetchStaff
 * @description Async thunk action to fetch staff members from the server.
 * @param {string} role - Optional role to filter staff members by.
 * @returns {Promise<StaffMember[]>} - A promise that resolves with an array of staff members.
 */
```

---
```ts
/**
 * @asyncThunk getStaffMember
 * @description Async thunk action to get a single staff member by ID from the server.
 * @param {string} id - The ID of the staff member to fetch.
 * @returns {Promise<StaffMember>} - A promise that resolves with the staff member.
 */
```

---
```ts
/**
 * @asyncThunk createStaffMember
 * @description Async thunk action to create a new staff member on the server.
 * @param {Object} data - The data for the new staff member.
 * @param {string} data.name - The name of the staff member.
 * @param {string} data.email - The email address of the staff member.
 * @param {string} data.password - The password of the staff member.
 * @param {string} data.role - The role of the staff member.
 * @returns {Promise<StaffMember>} - A promise that resolves with the newly created staff member.
 */
```

---
```ts
/**
 * @asyncThunk updateStaffMember
 * @description Async thunk action to update an existing staff member on the server.
 * @param {Object} params - An object containing the ID of the staff member to update and the updated data.
 * @param {string} params.id - The ID of the staff member to update.
 * @param {Object} params.data - The updated data for the staff member.
 * @returns {Promise<StaffMember>} - A promise that resolves with the updated staff member.
 */
```

---
```ts
/**
 * @asyncThunk deleteStaffMember
 * @description Async thunk action to delete a staff member from the server.
 * @param {string} id - The ID of the staff member to delete.
 * @returns {Promise<string>} - A promise that resolves with the ID of the deleted staff member.
 */
```

---
```ts
/**
 * @slice staffSlice
 * @description Redux slice for managing staff members.
 */
```

---
```ts
/**
     * @reducer selectStaffMember
     * @description Reducer to select a staff member.
     * @param {StaffState} state - The current staff state.
     * @param {PayloadAction<StaffMember>} action - The action containing the staff member to select.
     */
```

---
```ts
/**
     * @reducer clearSelectedStaffMember
     * @description Reducer to clear the selected staff member.
     * @param {StaffState} state - The current staff state.
     */
```
