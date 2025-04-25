# Documentation for `index.ts`

---
```ts
/**
 * Middleware to log API requests and responses.
 *
 * This middleware logs the HTTP method, path, status code, and response time
 * for API requests. If the response is JSON, it also logs the response body.
 */
```

---
```ts
/**
 * Main application entry point.
 *
 * This function initializes the Express application, registers routes,
 * sets up error handling, and starts the server. In development mode,
 * it also sets up Vite for hot module reloading.
 */
```

---
```ts
/**
   * Global error-handling middleware.
   *
   * This middleware catches errors thrown in the application and sends
   * a JSON response with the error status and message.
   *
   * @param err - The error object.
   * @param _req - The Express request object (unused).
   * @param res - The Express response object.
   * @param _next - The next middleware function (unused).
   */
```

---
```ts
/**
   * Setup Vite for development or serve static files for production.
   *
   * In development mode, Vite is used for hot module reloading.
   * In production mode, static files are served.
   */
```

---
```ts
/**
   * Start the server.
   *
   * The server listens on the port specified in the environment variable `PORT`,
   * or defaults to port 5000. It binds to all network interfaces (host: "0.0.0.0").
   */
```
