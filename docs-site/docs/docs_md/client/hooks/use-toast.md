# Documentation for `src\hooks\use-toast.ts`

---
```ts
/**
 * @constant TOAST_LIMIT
 * @description Maximum number of toasts that can be displayed simultaneously
 */
```

---
```ts
/**
 * @constant TOAST_REMOVE_DELAY
 * @description Delay in milliseconds before removing a toast from the DOM
 */
```

---
```ts
/**
 * @type ToasterToast
 * @description Extended type for toast properties including id and optional elements
 */
```

---
```ts
/**
 * @constant actionTypes
 * @description Available action types for toast state management
 */
```

---
```ts
/**
 * @function genId
 * @description Generates a unique ID for each toast
 * @returns {string} A unique identifier
 */
```

---
```ts
/**
 * @type Action
 * @description Union type for all possible toast actions
 */
```

---
```ts
/**
 * @interface State
 * @description Interface for the toast state
 */
```

---
```ts
/**
 * @constant toastTimeouts
 * @description Map to store timeout IDs for toast removal
 */
```

---
```ts
/**
 * @function addToRemoveQueue
 * @description Adds a toast to the removal queue
 * @param {string} toastId - ID of the toast to be removed
 */
```

---
```ts
/**
 * @function reducer
 * @description Reducer function for managing toast state
 * @param {State} state - Current state
 * @param {Action} action - Action to be performed
 * @returns {State} New state
 */
```

---
```ts
/**
 * @constant listeners
 * @description Array of state change listeners
 */
```

---
```ts
/**
 * @constant memoryState
 * @description In-memory state storage for toasts
 */
```

---
```ts
/**
 * @function dispatch
 * @description Dispatches an action to update toast state
 * @param {Action} action - Action to dispatch
 */
```

---
```ts
/**
 * @type Toast
 * @description Type for toast properties excluding the ID
 */
```

---
```ts
/**
 * @function toast
 * @description Creates and shows a new toast
 * @param {Toast} props - Toast properties
 * @returns {object} Toast controls (id, dismiss, update)
 */
```

---
```ts
/**
 * @function useToast
 * @description Custom hook for managing toasts
 * @returns {object} Toast state and control methods
 */
```
