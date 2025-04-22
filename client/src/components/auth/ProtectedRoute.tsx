import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getProfile } from '../../redux/authSlice';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!token && !isAuthenticated && !loading) {
      navigate('/');
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
          navigate('/');
        });
    }
  }, [token, isAuthenticated, user, loading, dispatch, navigate, toast]);
  
  // Check if user has the required role
  const hasRequiredRole = () => {
    if (!user || !user.role) return false;
    
    if (roles.length === 0) return true;
    
    return roles.includes(user.role);
  };
  
  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!isAuthenticated || !token) {
    navigate('/');
    return null;
  }
  
  // Check if user has required role
  if (!hasRequiredRole()) {
    toast({
      variant: "destructive",
      title: "Access denied",
      description: "You don't have permission to access this page.",
    });
    
    // Redirect to appropriate page based on user role
    if (user?.role === 'host') {
      navigate('/tables');
    } else if (user?.role === 'chef') {
      navigate('/kitchen');
    } else if (user?.role === 'admin') {
      navigate('/system');
    } else {
      navigate('/dashboard');
    }
    
    return null;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
