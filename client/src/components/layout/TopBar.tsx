import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Menu } from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";

/**
 * @interface TopBarProps
 * @description Interface for the props of the TopBar component.
 * @param {string} pageTitle - The title of the current page.
 * @param {function} toggleMobileSidebar - A function to toggle the mobile sidebar.
 */
interface TopBarProps {
  pageTitle: string;
  toggleMobileSidebar: () => void;
}

/**
 * @component TopBar
 * @description A top bar component that displays the page title, current time, theme toggle, and notification button.
 * @param {TopBarProps} props - The props for the TopBar component.
 * @returns {JSX.Element} - The top bar element with the page title, current time, theme toggle, and notification button.
 */
const TopBar = ({ pageTitle, toggleMobileSidebar }: TopBarProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());

  /**
   * @useEffect
   * @description Updates the current time every minute.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  /**
   * @function getCurrentTimeString
   * @description Returns the current time as a formatted string.
   * @returns {string} - The current time as a formatted string.
   */
  function getCurrentTimeString() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <div className="bg-background border-b shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button
          className="mr-4 md:hidden text-muted-foreground hover:text-foreground"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-poppins font-semibold text-foreground">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center mr-4">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{currentTime}</span>
        </div>

        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="relative p-2 rounded-full hover:bg-accent text-muted-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 bg-destructive w-2 h-2 rounded-full"></span>
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
