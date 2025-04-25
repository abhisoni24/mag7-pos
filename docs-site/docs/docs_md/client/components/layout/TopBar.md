# Documentation for `src\components\layout\TopBar.tsx`

---
```ts
/**
 * @interface TopBarProps
 * @description Interface for the props of the TopBar component.
 * @param {string} pageTitle - The title of the current page.
 * @param {function} toggleMobileSidebar - A function to toggle the mobile sidebar.
 */
```

---
```ts
/**
 * @component TopBar
 * @description A top bar component that displays the page title, current time, theme toggle, and notification button.
 * @param {TopBarProps} props - The props for the TopBar component.
 * @returns {JSX.Element} - The top bar element with the page title, current time, theme toggle, and notification button.
 */
```

---
```ts
/**
   * @useEffect
   * @description Updates the current time every minute.
   */
```

---
```ts
/**
   * @function getCurrentTimeString
   * @description Returns the current time as a formatted string.
   * @returns {string} - The current time as a formatted string.
   */
```
