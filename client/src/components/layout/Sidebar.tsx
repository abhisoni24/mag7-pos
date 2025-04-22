import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { logout } from '../../redux/authSlice';
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
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserRole } from '@shared/schema';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }: SidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    // Close mobile sidebar when navigating
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/');
      
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
  
  // Get role-specific color class
  const getRoleColorClass = (role?: string): string => {
    switch (role) {
      case UserRole.HOST:
        return 'bg-host';
      case UserRole.WAITER:
        return 'bg-waiter';
      case UserRole.CHEF:
        return 'bg-chef';
      case UserRole.MANAGER:
        return 'bg-manager';
      case UserRole.OWNER:
        return 'bg-owner';
      case UserRole.ADMIN:
        return 'bg-admin';
      default:
        return 'bg-gray-600';
    }
  };
  
  // Check if the user has access to a specific navigation item
  const hasAccess = (roles: string[]): boolean => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };
  
  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  // Navigation items with role permissions
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-6" />,
      roles: [UserRole.WAITER, UserRole.MANAGER, UserRole.OWNER]
    },
    {
      name: 'Tables',
      path: '/tables',
      icon: <LayoutGrid className="w-6" />,
      roles: [UserRole.HOST, UserRole.WAITER, UserRole.MANAGER, UserRole.OWNER]
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: <Utensils className="w-6" />,
      roles: [UserRole.WAITER, UserRole.MANAGER, UserRole.OWNER]
    },
    {
      name: 'Kitchen',
      path: '/kitchen',
      icon: <Flame className="w-6" />,
      roles: [UserRole.CHEF]
    },
    {
      name: 'Payments',
      path: '/payments',
      icon: <CreditCard className="w-6" />,
      roles: [UserRole.WAITER, UserRole.MANAGER, UserRole.OWNER]
    },
    {
      name: 'Menu',
      path: '/menu',
      icon: <BookOpen className="w-6" />,
      roles: [UserRole.MANAGER, UserRole.OWNER]
    },
    {
      name: 'Staff',
      path: '/staff',
      icon: <Users className="w-6" />,
      roles: [UserRole.MANAGER, UserRole.OWNER]
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BarChart2 className="w-6" />,
      roles: [UserRole.OWNER]
    },
    {
      name: 'System',
      path: '/system',
      icon: <Cog className="w-6" />,
      roles: [UserRole.ADMIN]
    }
  ];
  
  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => hasAccess(item.roles));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="bg-gray-800 text-white w-64 flex-shrink-0 h-full hidden md:block">
        <div className="p-4 bg-gray-900">
          <h1 className="text-xl font-poppins font-semibold">Restaurant POS</h1>
        </div>
        
        <div className="user-info p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${getRoleColorClass(user?.role)} flex items-center justify-center text-lg font-medium mr-3`}>
              {user?.name ? getInitials(user.name) : 'U'}
            </div>
            <div>
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-400">{user?.role || 'Guest'}</p>
            </div>
          </div>
        </div>
        
        <nav className="py-4">
          <ul>
            {filteredNavItems.map((item) => (
              <li key={item.path} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                <a 
                  href={item.path} 
                  className={cn(
                    "flex items-center",
                    location === item.path ? "text-white" : "text-gray-300"
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
        
        <div className="mt-auto p-4 border-t border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full py-2 text-center text-gray-300 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "fixed inset-0 bg-gray-900 bg-opacity-50 z-20 md:hidden transition-opacity duration-200",
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      >
        <div 
          className={cn(
            "bg-gray-800 text-white w-64 h-full overflow-y-auto transform transition-transform duration-200",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 bg-gray-900 flex justify-between items-center">
            <h1 className="text-xl font-poppins font-semibold">Restaurant POS</h1>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <ChevronRight />
            </button>
          </div>
          
          <div className="user-info p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${getRoleColorClass(user?.role)} flex items-center justify-center text-lg font-medium mr-3`}>
                {user?.name ? getInitials(user.name) : 'U'}
              </div>
              <div>
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-400">{user?.role || 'Guest'}</p>
              </div>
            </div>
          </div>
          
          <nav className="py-4">
            <ul>
              {filteredNavItems.map((item) => (
                <li key={item.path} className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <a 
                    href={item.path} 
                    className={cn(
                      "flex items-center",
                      location === item.path ? "text-white" : "text-gray-300"
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
          
          <div className="mt-auto p-4 border-t border-gray-700">
            <Button 
              variant="ghost" 
              className="w-full py-2 text-center text-gray-300 hover:text-white"
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
