/**
 * Login Component
 * 
 * This component handles user authentication for the Restaurant POS system.
 * It provides separate login flows for staff and admin users.
 * 
 * @module Login
 */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { Settings } from 'lucide-react';
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
 * Login functional component
 * Handles user authentication and redirection based on user role
 * 
 * @returns {JSX.Element} The login component
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  /**
   * Handles form submission
   * Authenticates user and redirects to appropriate dashboard based on user role
   * 
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Log in specifically as non-admin staff user
      const response = await dispatch(login({ email, password, role: 'staff' })).unwrap();
      
      // Redirect based on user role
      switch (response.user.role) {
        case UserRole.HOST:
          navigate('/tables');
          break;
        case UserRole.WAITER:
        case UserRole.MANAGER:
        case UserRole.OWNER:
          navigate('/dashboard');
          break;
        case UserRole.CHEF:
          navigate('/kitchen');
          break;
        case UserRole.ADMIN:
          navigate('/system');
          break;
        default:
          navigate('/dashboard');
      }
      
      toast({
        title: "Login successful",
        description: `Welcome, ${response.user.name}!`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: typeof err === 'string' ? err : "Invalid credentials",
      });
    }
  };

  /**
   * Navigate to admin login page
   */
  const handleAdminLogin = () => {
    navigate('/admin');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAdminLogin}
          title="Admin Login"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground font-poppins">Mag7 POS</h1>
            <p className="text-muted-foreground mt-2">Staff Sign In</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="youremail@example.com"
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
              className="w-full font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
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

export default Login;