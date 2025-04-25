# Documentation for `src\components\auth\ProtectedRoute.tsx`

---
```ts
/**
 * @interface ProtectedRouteProps
 * @description Interface for the props of the ProtectedRoute component.
 * @param {React.ReactNode} children - The child components to render if the user is authorized.
 * @param {string[]} [roles] - An optional array of roles that are allowed to access the route. If empty, all authenticated users are allowed.
 */
```

---
```ts
/**
 * @component ProtectedRoute
 * @description A higher-order component that protects routes based on user authentication and roles.
 *              It checks if the user is authenticated and has the required roles before rendering the child components.
 * @param {ProtectedRouteProps} props - The props for the ProtectedRoute component.
 * @returns {JSX.Element|null} - Returns the child components if the user is authorized, otherwise redirects to the login page or an appropriate page based on the user's role.
 */
```
