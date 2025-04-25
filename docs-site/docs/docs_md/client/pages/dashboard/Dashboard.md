# Documentation for `src\pages\dashboard\Dashboard.tsx`

---
```ts
/**
 * @interface ActivityItem
 * @description Interface for an activity item displayed on the dashboard.
 * @param {string} id - The unique identifier for the activity item.
 * @param {string} type - The type of activity (e.g., 'new_order', 'completed_order', 'payment', 'new_customers').
 * @param {string} title - The title of the activity.
 * @param {string} detail - The detailed description of the activity.
 * @param {string} time - The time the activity occurred.
 * @param {Date} timestamp - The timestamp of the activity.
 */
```

---
```ts
/**
 * @function getActivityIcon
 * @description Returns an icon component based on the activity type.
 * @param {string} type - The type of activity.
 * @returns {JSX.Element | null} - The icon component for the activity type, or null if no icon is found.
 */
```

---
```ts
/**
 * @component Dashboard
 * @description A dashboard component that displays key metrics and recent activities.
 * @returns {JSX.Element} - The dashboard element with statistics, recent activities, and current orders.
 */
```

---
```ts
/**
   * @useEffect
   * @description Fetches tables and orders data on component mount.
   */
```

---
```ts
/**
   * @useEffect
   * @description Generates recent activities from orders and sorts them by timestamp.
   */
```
