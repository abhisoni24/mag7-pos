import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * @async
 * @function throwIfResNotOk
 * @description Checks if the response status is not OK and throws an error with the status and message.
 * @param {Response} res - The response object to check.
 * @throws {Error} - If the response status is not OK, an error is thrown with the status and message.
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * @async
 * @function apiRequest
 * @description Makes an API request with the specified method, URL, and data.
 * @param {string} method - The HTTP method to use for the request (e.g., "GET", "POST", "PUT", "DELETE").
 * @param {string} url - The URL to make the request to.
 * @param {unknown | undefined} [data] - The data to send with the request (optional).
 * @returns {Promise<Response>} - A promise that resolves with the response object.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  // Get auth token from localStorage
  const token = localStorage.getItem("token");

  // Prepare headers
  const headers: HeadersInit = {};
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * @typedef {"returnNull" | "throw"} UnauthorizedBehavior
 * @description Defines the behavior when an unauthorized (401) response is received.
 * - `"returnNull"`: Returns null when a 401 response is received.
 * - `"throw"`: Throws an error when a 401 response is received.
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * @function getQueryFn
 * @description Creates a query function for use with react-query that handles unauthorized responses based on the provided behavior.
 * @param {object} options - Configuration options for the query function.
 * @param {UnauthorizedBehavior} options.on401 - The behavior to use when a 401 response is received.
 * @returns {QueryFunction<T>} - A query function that can be used with react-query.
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get auth token from localStorage
    const token = localStorage.getItem("token");

    // Prepare headers
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

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
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
