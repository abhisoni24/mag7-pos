# Documentation for `src\lib\queryClient.ts`

---
```ts
/**
 * @async
 * @function throwIfResNotOk
 * @description Checks if the response status is not OK and throws an error with the status and message.
 * @param {Response} res - The response object to check.
 * @throws {Error} - If the response status is not OK, an error is thrown with the status and message.
 */
```

---
```ts
/**
 * @async
 * @function apiRequest
 * @description Makes an API request with the specified method, URL, and data.
 * @param {string} method - The HTTP method to use for the request (e.g., "GET", "POST", "PUT", "DELETE").
 * @param {string} url - The URL to make the request to.
 * @param {unknown | undefined} [data] - The data to send with the request (optional).
 * @returns {Promise<Response>} - A promise that resolves with the response object.
 */
```

---
```ts
/**
 * @typedef {"returnNull" | "throw"} UnauthorizedBehavior
 * @description Defines the behavior when an unauthorized (401) response is received.
 * - `"returnNull"`: Returns null when a 401 response is received.
 * - `"throw"`: Throws an error when a 401 response is received.
 */
```

---
```ts
/**
 * @function getQueryFn
 * @description Creates a query function for use with react-query that handles unauthorized responses based on the provided behavior.
 * @param {object} options - Configuration options for the query function.
 * @param {UnauthorizedBehavior} options.on401 - The behavior to use when a 401 response is received.
 * @returns {QueryFunction<T>} - A query function that can be used with react-query.
 */
```

---
```ts
/**
 * @constant queryClient
 * @description A new QueryClient instance configured with default options for queries and mutations.
 * Queries are configured with:
 * - `queryFn`: A function to fetch data, using `getQueryFn` with `"throw"` as the default `on401` behavior.
 * - `refetchInterval`: `false` to disable automatic refetching.
 * - `refetchOnWindowFocus`: `false` to prevent refetching when the window gains focus.
 * - `staleTime`: `Infinity` to prevent data from ever being considered stale.
 * - `retry`: `false` to disable retries on query failure.
 * Mutations are configured with:
 * - `retry`: `false` to disable retries on mutation failure.
 */
```
