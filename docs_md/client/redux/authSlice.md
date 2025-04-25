# Documentation for `src\redux\authSlice.ts`

---
```ts
/**
 * @interface User
 * @description Interface for the user object.
 * @param {string} id - The user ID.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} role - The user's role.
 */
```

---
```ts
/**
 * @interface AuthState
 * @description Interface for the authentication state.
 * @param {User | null} user - The authenticated user, or null if not authenticated.
 * @param {string | null} token - The authentication token, or null if not authenticated.
 * @param {boolean} isAuthenticated - Whether the user is authenticated.
 * @param {boolean} loading - Whether the authentication state is loading.
 * @param {string | null} error - Any authentication error message, or null if no error.
 */
```

---
```ts
/**
 * @asyncThunk login
 * @description Async thunk action to log in a user.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} role - The user's role (optional).
 * @returns {Promise<any>} - A promise that resolves with the login response or rejects with an error.
 */
```

---
```ts
/**
 * @asyncThunk getProfile
 * @description Async thunk action to get the user profile.
 * @returns {Promise<any>} - A promise that resolves with the profile response or rejects with an error.
 */
```

---
```ts
/**
 * @asyncThunk logout
 * @description Async thunk action to log out a user.
 * @returns {Promise<null>} - A promise that resolves with null after removing the token from local storage.
 */
```

---
```ts
/**
 * @slice authSlice
 * @description Redux slice for authentication.
 */
```

---
```ts
/**
     * @reducer clearError
     * @description Reducer to clear the error message.
     * @param {AuthState} state - The current authentication state.
     */
```
