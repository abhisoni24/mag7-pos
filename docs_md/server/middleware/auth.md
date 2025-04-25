# Documentation for `middleware\auth.ts`

---
```ts
/**
       * Custom user object added to the Express Request interface.
       * Populated after successful token verification.
       */
```

---
```ts
/**
 * Middleware to authenticate requests using a JWT token.
 *
 * This middleware checks for the presence of a valid JWT token in the
 * `Authorization` header of the incoming request. If the token is valid,
 * it decodes the token and attaches the user information to the request object.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * @throws Returns a 401 status code if:
 * - The `Authorization` header is missing or improperly formatted.
 * - The token is invalid or expired.
 */
```
