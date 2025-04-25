import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { logout } from "../../redux/authSlice";
import {
  LayoutDashboard,
  LayoutGrid,
  Utensils,
  Flame,
  CreditCard,
  BookOpen,
  Users,
  BarChart2,
  Cog,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

/**
 * @interface SidebarProps
 * @description Interface for the props of the Sidebar component.
 * @param {boolean} isMobileSidebarOpen - A boolean indicating whether the mobile sidebar is open.
 * @param {function} setIsMobileSidebarOpen - A function to set the state of the mobile sidebar.
 */
interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

/**
 * @component Sidebar
 * @description A sidebar component that provides navigation links and user information.
 *              It displays different navigation items based on the user's role and provides a logout button.
 * @param {SidebarProps} props - The props for the Sidebar component.
 * @returns {JSX.Element} - The sidebar element with navigation links and user information.
 */
const Sidebar = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}: SidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  /**
   * @function handleNavigation
   * @description Navigates to the specified path and closes the mobile sidebar if it is open.
   * @param {string} path - The path to navigate to.
   */
  const handleNavigation = (path: string) => {
    navigate(path);
    // Close mobile sidebar when navigating
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  /**
   * @function handleLogout
   * @description Logs the user out and navigates to the login page.
   */
  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out.",
      });
    }
  };

  /**
   * @function getRoleColorClass
   * @description Returns a CSS class name based on the user's role.
   * @param {string} role - The user's role.
   * @returns {string} - The CSS class name for the role.
   */
  const getRoleColorClass = (role?: string): string => {
    switch (role) {
      case UserRole.HOST:
        return "bg-host";
      case UserRole.WAITER:
        return "bg-waiter";
      case UserRole.CHEF:
        return "bg-chef";
      case UserRole.MANAGER:
        return "bg-manager";
      case UserRole.OWNER:
        return "bg-owner";
      case UserRole.ADMIN:
        return "bg-admin";
      default:
        return "bg-gray-600";
    }
  };

  /**
   * @function hasAccess
   * @description Checks if the user has access to a specific navigation item based on their role.
   * @param {string[]} roles - An array of roles that have access to the navigation item.
   * @returns {boolean} - True if the user has access, false otherwise.
   */
  const hasAccess = (roles: string[]): boolean => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  /**
   * @function getInitials
   * @description Returns the initials of the user's name.
   * @param {string} name - The user's name.
   * @returns {string} - The initials of the user's name.
   */
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  /**
   * @constant navigationItems
   * @description An array of navigation items with their names, paths, icons, and roles.
   */
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-6" />,
      roles: [
        UserRole.WAITER,
        UserRole.MANAGER,
        UserRole.OWNER,
        UserRole.ADMIN,
      ],
    },
    {
      name: "Tables",
      path: "/tables",
      icon: <LayoutGrid className="w-6" />,
      roles: [
        UserRole.HOST,
        UserRole.WAITER,
        UserRole.MANAGER,
        UserRole.OWNER,
        UserRole.ADMIN,
      ],
    },
    {
      name: "Orders",
      path: "/orders",
      icon: <Utensils className="w-6" />,
      roles: [
        UserRole.WAITER,
        UserRole.MANAGER,
        UserRole.OWNER,
        UserRole.ADMIN,
      ],
    },
    {
      name: "Kitchen",
      path: "/kitchen",
      icon: <Flame className="w-6" />,
      roles: [UserRole.CHEF, UserRole.ADMIN],
    },
    {
      name: "Payments",
      path: "/payments",
      icon: <CreditCard className="w-6" />,
      roles: [
        UserRole.WAITER,
        UserRole.MANAGER,
        UserRole.OWNER,
        UserRole.ADMIN,
      ],
    },
    {
      name: "Menu",
      path: "/menu",
      icon: <BookOpen className="w-6" />,
      roles: [
        UserRole.WAITER,
        UserRole.CHEF,
        UserRole.MANAGER,
        UserRole.OWNER,
        UserRole.ADMIN,
      ],
    },
    {
      name: "Staff",
      path: "/staff",
      icon: <Users className="w-6" />,
      roles: [UserRole.MANAGER, UserRole.OWNER, UserRole.ADMIN],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart2 className="w-6" />,
      roles: [UserRole.OWNER, UserRole.ADMIN],
    },
    {
      name: "System",
      path: "/system",
      icon: <Cog className="w-6" />,
      roles: [UserRole.ADMIN],
    },
  ];

  /**
   * @constant filteredNavItems
   * @description Filters the navigation items based on the user's role.
   */
  const filteredNavItems = navigationItems.filter((item) =>
    hasAccess(item.roles)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white w-64 flex-shrink-0 h-full hidden md:block">
        <div className="p-4 bg-slate-950 dark:bg-black">
          <h1 className="text-xl font-poppins font-semibold">Mag7 POS</h1>
        </div>

        <div className="user-info p-4 border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full ${getRoleColorClass(
                user?.role
              )} flex items-center justify-center text-lg font-medium mr-3`}
            >
              {user?.name ? getInitials(user.name) : "U"}
            </div>
            <div>
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {user?.role || "Guest"}
              </p>
            </div>
          </div>
        </div>

        <nav className="py-4">
          <ul>
            {filteredNavItems.map((item) => (
              <li
                key={item.path}
                className="px-4 py-2 hover:bg-slate-800 dark:hover:bg-slate-900 cursor-pointer"
              >
                <a
                  href={item.path}
                  className={cn(
                    "flex items-center",
                    location === item.path
                      ? "text-white"
                      : "text-slate-300 dark:text-slate-400"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-slate-700 dark:border-slate-800">
          <Button
            variant="ghost"
            className="w-full py-2 text-center text-slate-300 dark:text-slate-400 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900 dark:bg-slate-950 bg-opacity-50 z-20 md:hidden transition-opacity duration-200",
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      >
        <div
          className={cn(
            "bg-slate-900 dark:bg-slate-950 text-white w-64 h-full overflow-y-auto transform transition-transform duration-200",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 bg-slate-950 dark:bg-black flex justify-between items-center">
            <h1 className="text-xl font-poppins font-semibold">Mag7 POS</h1>
            <button
              className="text-slate-400 dark:text-slate-500 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <ChevronRight />
            </button>
          </div>

          <div className="user-info p-4 border-b border-slate-700 dark:border-slate-800">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full ${getRoleColorClass(
                  user?.role
                )} flex items-center justify-center text-lg font-medium mr-3`}
              >
                {user?.name ? getInitials(user.name) : "U"}
              </div>
              <div>
                <p className="font-medium">{user?.name || "User"}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  {user?.role || "Guest"}
                </p>
              </div>
            </div>
          </div>

          <nav className="py-4">
            <ul>
              {filteredNavItems.map((item) => (
                <li
                  key={item.path}
                  className="px-4 py-2 hover:bg-slate-800 dark:hover:bg-slate-900 cursor-pointer"
                >
                  <a
                    href={item.path}
                    className={cn(
                      "flex items-center",
                      location === item.path
                        ? "text-white"
                        : "text-slate-300 dark:text-slate-400"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.path);
                    }}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-slate-700 dark:border-slate-800">
            <Button
              variant="ghost"
              className="w-full py-2 text-center text-slate-300 dark:text-slate-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
