# Documentation for `utils\jwt.ts`

---
```ts
/**
 * JWT Authentication Utilities
 * 
 * This module provides utilities for generating and verifying JSON Web Tokens (JWT)
 * for user authentication in the Mag7 POS system.
 * 
 * @module utils/jwt
 */
```

---
```ts
/**
 * JWT Payload interface
 */
```

---
```ts
/**
 * Generates a JWT token for authenticated users
 * 
 * @param {MongoUser} user - The authenticated user object
 * @returns {string} The signed JWT token
 */
```

---
```ts
/**
 * Verifies a JWT token and returns the decoded payload
 * 
 * @param {string} token - The JWT token to verify
 * @returns {JWTPayload} The decoded token payload
 * @throws {Error} If the token is invalid or expired
 */
```
