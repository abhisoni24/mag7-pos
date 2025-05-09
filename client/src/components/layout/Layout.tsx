import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

/**
 * @interface LayoutProps
 * @description Interface for the props of the Layout component.
 * @param {React.ReactNode} children - The content to be rendered within the layout.
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * @component Layout
 * @description Provides a consistent layout structure for the application, including a sidebar and top bar.
 *              It manages the state for the mobile sidebar and updates the page title based on the current route.
 * @param {LayoutProps} props - The props for the Layout component.
 * @returns {JSX.Element} - The layout structure with a sidebar, top bar, and the provided children.
 */
const Layout = ({ children }: LayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [location] = useLocation();

  /**
   * @useEffect
   * @description Updates the page title based on the current route.
   */
  useEffect(() => {
    const pathToTitle: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/tables": "Tables",
      "/orders": "Orders",
      "/kitchen": "Kitchen",
      "/payments": "Payments",
      "/menu": "Menu Management",
      "/staff": "Staff Management",
      "/reports": "Reports & Analytics",
      "/system": "System Administration",
    };

    setPageTitle(pathToTitle[location] || "Dashboard");
  }, [location]);

  /**
   * @function toggleMobileSidebar
   * @description Toggles the visibility of the mobile sidebar.
   */
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <button
          className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          onClick={toggleMobileSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar
          pageTitle={pageTitle}
          toggleMobileSidebar={toggleMobileSidebar}
        />

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
