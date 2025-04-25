# Documentation for `middleware\roleCheck.ts`

---
```ts
/**
 * Role hierarchy for authorization.
 * Defines the hierarchy of roles with numeric levels for comparison.
 */
```

---
```ts
/**
 * Role-specific permissions matrix.
 * Maps each role to the list of permissions they have access to.
 */
```

---
```ts
/**
 * Middleware to check if the user has the required role.
 *
 * @param requiredRole - The role required to access the resource.
 * @returns Middleware function to validate the user's role.
 */
```

---
```ts
/**
 * Helper function to check if a user has a specific permission.
 *
 * @param userRole - The role of the user.
 * @param permission - The permission to check.
 * @returns True if the user has the permission, false otherwise.
 */
```

---
```ts
/**
 * Middleware to check if the user has a specific permission.
 *
 * @param permission - The permission required to access the resource.
 * @returns Middleware function to validate the user's permission.
 */
```

---
```ts
/**
 * Middleware to check if the user is a waiter or higher.
 */
```

---
```ts
/**
 * Middleware to check if the user is a chef.
 */
```

---
```ts
/**
 * Middleware to check if the user is a host.
 */
```

---
```ts
/**
 * Middleware to check if the user is a manager or higher.
 */
```

---
```ts
/**
 * Middleware to check if the user is an owner or higher.
 */
```

---
```ts
/**
 * Middleware to check if the user is an admin.
 */
```
