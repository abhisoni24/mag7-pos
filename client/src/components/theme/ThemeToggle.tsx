import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

/**
 * @interface ThemeToggleProps
 * @description Interface for the props of the ThemeToggle component.
 * @param {string} [variant] - The variant of the button.
 * @param {string} [size] - The size of the button.
 */
interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * @component ThemeToggle
 * @description A button component that toggles the theme between light and dark mode.
 * @param {ThemeToggleProps} props - The props for the ThemeToggle component.
 * @returns {JSX.Element} - The theme toggle button element.
 */
export function ThemeToggle({
  variant = "outline",
  size = "icon",
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
