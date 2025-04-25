import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * @interface ThemeProviderProps
 * @description Interface for the props of the ThemeProvider component.
 * @param {React.ReactNode} children - The content to be rendered within the theme provider.
 */
type ThemeProviderProps = {
  children: React.ReactNode;
};

/**
 * @component ThemeProvider
 * @description Provides a theme context for the application, allowing components to access and update the current theme.
 *              It uses the `next-themes` library to manage the theme and ensures that the component is mounted before rendering to avoid hydration issues.
 * @param {ThemeProviderProps} props - The props for the ThemeProvider component.
 * @returns {JSX.Element} - The theme provider element with the provided children.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
