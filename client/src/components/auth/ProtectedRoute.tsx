import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getProfile } from "../../redux/authSlice";
import { useToast } from "@/hooks/use-toast";

/**
 * @interface ProtectedRouteProps
 * @description Interface for the props of the ProtectedRoute component.
 * @param {React.ReactNode} children - The child components to render if the user is authorized.
 * @param {string[]} [roles] - An optional array of roles that are allowed to access the route. If empty, all authenticated users are allowed.
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

/**
 * @component ProtectedRoute
 * @description A higher-order component that protects routes based on user authentication and roles.
 *              It checks if the user is authenticated and has the required roles before rendering the child components.
 * @param {ProtectedRouteProps} props - The props for the ProtectedRoute component.
 * @returns {JSX.Element|null} - Returns the child components if the user is authorized, otherwise redirects to the login page or an appropriate page based on the user's role.
 */
const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [checked, setChecked] = useState(false);

  // Effect for authentication check and redirects
  useEffect(() => {
    // Prevent running the effect multiple times for the same check
    if (checked) return;

    // If not authenticated, redirect to login
    if (!token && !isAuthenticated && !loading) {
      navigate("/");
      return;
    }

    // If authenticated but no user data, fetch profile
    if (token && isAuthenticated && !user && !loading) {
      dispatch(getProfile())
        .unwrap()
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Authentication error",
            description: "Your session has expired. Please login again.",
          });
          navigate("/");
        });
      return;
    }

    // If user is loaded, check role permissions
    if (user && !loading) {
      // First check if user has required role
      const hasRequiredRole =
        roles.length === 0 || (user.role && roles.includes(user.role));

      if (!hasRequiredRole) {
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "You don't have permission to access this page.",
        });

        // Redirect to appropriate page based on user role
        if (user.role === "host") {
          navigate("/tables");
        } else if (user.role === "chef") {
          navigate("/kitchen");
        } else if (user.role === "admin") {
          // Admin should have access to all pages, but just in case there are future role restrictions
          navigate("/system");
        } else {
          navigate("/dashboard");
        }
        return;
      }

      // Mark as checked to prevent re-running
      setChecked(true);
    }
  }, [
    token,
    isAuthenticated,
    user,
    loading,
    dispatch,
    navigate,
    toast,
    roles,
    checked,
  ]);

  // Show loading indicator while checking authentication
  if (loading || (!checked && token)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated and not loading, show nothing (redirect happens in useEffect)
  if (!isAuthenticated || !token) {
    return null;
  }

  // If all checks pass and the user is authenticated with the right role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
