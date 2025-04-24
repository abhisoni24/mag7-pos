/**
 * Admin Login Component
 * 
 * This component provides authentication specifically for users with admin privileges.
 * It redirects to the system administration dashboard on successful login.
 * 
 * @module AdminLogin
 */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@shared/schema';
import { login } from '../../redux/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

/**
 * AdminLogin functional component
 * Handles authentication for users with admin privileges
 * 
 * @returns {JSX.Element} The admin login component
 */
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  /**
   * Handles form submission
   * Authenticates admin user and redirects to the system dashboard
   * 
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Login with admin role explicitly to restrict access
      const response = await dispatch(login({ 
        email, 
        password, 
        role: 'admin'  // Explicitly check for admin role
      })).unwrap();
      
      if (response.user.role === UserRole.ADMIN) {
        navigate('/system');
        toast({
          title: "Login successful",
          description: `Welcome, ${response.user.name}!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "You do not have admin privileges",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: typeof err === 'string' ? err : "Invalid credentials",
      });
    }
  };

  /**
   * Navigates back to the regular staff login page
   */
  const handleGoToStaffLogin = () => {
    navigate('/');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground font-poppins">Mag7 POS</h1>
            <p className="text-muted-foreground mt-2">Admin Sign In</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 justify-center mb-4">
              <Button 
                type="button"
                variant="outline"
                onClick={handleGoToStaffLogin}
                className="rounded-full text-sm px-4"
              >
                Staff Login
              </Button>
              <Button 
                type="button"
                variant="default"
                className="rounded-full text-sm px-4"
              >
                Admin Login
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              variant="default"
              className="w-full font-medium bg-admin hover:bg-admin/90"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In as Admin"}
            </Button>
            
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-primary hover:text-primary-dark">
                Forgot password?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
