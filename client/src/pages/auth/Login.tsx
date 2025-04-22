import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@shared/schema';
import { login } from '../../redux/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isStaffLogin, setIsStaffLogin] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await dispatch(login({ email, password, role })).unwrap();
      
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

  const handleToggleLoginType = () => {
    setIsStaffLogin(!isStaffLogin);
    setRole('');
    if (!isStaffLogin) {
      navigate('/admin');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground font-poppins">Restaurant POS</h1>
            <p className="text-muted-foreground mt-2">Sign in to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 justify-center mb-4">
              <Button 
                type="button"
                variant={isStaffLogin ? "default" : "outline"}
                onClick={() => setIsStaffLogin(true)}
                className="rounded-full text-sm px-4"
              >
                Staff Login
              </Button>
              <Button 
                type="button"
                variant={!isStaffLogin ? "default" : "outline"}
                onClick={handleToggleLoginType}
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
              
              {isStaffLogin && (
                <div>
                  <Label htmlFor="role">Select Role</Label>
                  <Select value={role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.HOST}>Host</SelectItem>
                      <SelectItem value={UserRole.WAITER}>Waiter</SelectItem>
                      <SelectItem value={UserRole.CHEF}>Chef</SelectItem>
                      <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                      <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
