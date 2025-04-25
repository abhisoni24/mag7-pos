# Documentation for `src\pages\staff\StaffManagement.tsx`

---
```ts
/**
 * @function getRoleDisplayName
 * @description Helper function to get the display name for a given user role.
 * @param {string} role - The user role.
 * @returns {string} - The display name of the role.
 */
```

---
```ts
/**
 * @function getRoleBadgeStyle
 * @description Helper function to get the badge style for a given user role.
 * @param {string} role - The user role.
 * @returns {string} - The CSS class names for the badge style.
 */
```

---
```ts
/**
 * @component StaffManagement
 * @description A page component for managing staff members, allowing users to add, edit, and delete staff.
 * It displays staff members in a table, categorized by role, and provides dialogs for staff creation, modification, and deletion.
 * @returns {JSX.Element} - The staff management page element.
 */
```

---
```ts
/**
   * @interface FormState
   * @description Interface for the form state used in the add/edit staff member dialog.
   * @param {string} name - The name of the staff member.
   * @param {string} email - The email of the staff member.
   * @param {string} password - The password of the staff member.
   * @param {string} role - The role of the staff member.
   * @param {boolean} active - Whether the staff member is currently active.
   */
```

---
```ts
/**
   * @useEffect
   * @description Fetches staff data from the Redux store on component mount.
   */
```

---
```ts
/**
   * @function canManageRole
   * @description Checks if the current user has permission to manage a given role.
   * @param {string} role - The role to check.
   * @returns {boolean} - True if the user can manage the role, false otherwise.
   */
```

---
```ts
/**
   * @function getAvailableRoles
   * @description Gets the available roles that can be managed by the current user.
   * @returns {UserRole[]} - An array of available roles.
   */
```

---
```ts
/**
   * @function handleOpenAddDialog
   * @description Opens the add staff member dialog and resets the form state.
   */
```

---
```ts
/**
   * @function handleOpenEditDialog
   * @description Opens the edit staff member dialog and populates the form with the selected staff member's data.
   * @param {StaffMember} member - The staff member to edit.
   */
```

---
```ts
/**
   * @function handleOpenDeleteDialog
   * @description Opens the delete confirmation dialog for the selected staff member.
   * @param {StaffMember} member - The staff member to delete.
   */
```

---
```ts
/**
   * @function handleInputChange
   * @description Handles changes to input fields in the add/edit staff member dialog.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
```

---
```ts
/**
   * @function handleSwitchChange
   * @description Handles changes to switch components in the add/edit staff member dialog.
   * @param {string} name - The name of the form field to update.
   * @param {boolean} checked - The new value of the switch.
   */
```

---
```ts
/**
   * @function handleSelectChange
   * @description Handles changes to select components in the add/edit staff member dialog.
   * @param {string} name - The name of the form field to update.
   * @param {string} value - The new value of the select component.
   */
```

---
```ts
/**
   * @function handleSubmit
   * @description Handles the submission of the add/edit staff member form.
   * It dispatches the appropriate Redux action to create or update the staff member.
   */
```

---
```ts
/**
   * @function handleDelete
   * @description Handles the deletion of a staff member.
   * It dispatches the deleteStaffMember Redux action and displays a toast notification.
   */
```
