import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStaff,
  StaffMember,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember
} from '../../redux/staffSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, UserCircle } from 'lucide-react';

// Helper function to get role display name
const getRoleDisplayName = (role: string): string => {
  switch(role) {
    case UserRole.HOST: return 'Host';
    case UserRole.WAITER: return 'Waiter';
    case UserRole.CHEF: return 'Chef';
    case UserRole.MANAGER: return 'Manager';
    case UserRole.OWNER: return 'Owner';
    case UserRole.ADMIN: return 'Admin';
    default: return role;
  }
};

// Helper to get role badge style
const getRoleBadgeStyle = (role: string): string => {
  switch(role) {
    case UserRole.HOST: return 'bg-host text-white';
    case UserRole.WAITER: return 'bg-waiter text-white';
    case UserRole.CHEF: return 'bg-chef text-white';
    case UserRole.MANAGER: return 'bg-manager text-white';
    case UserRole.OWNER: return 'bg-owner text-white';
    case UserRole.ADMIN: return 'bg-admin text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const StaffManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff, loading } = useSelector((state: RootState) => state.staff);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    active: true
  });
  
  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);
  
  // Filter staff by role
  const filteredStaff = staff.filter(member => {
    if (activeTab === 'all') return true;
    return member.role === activeTab;
  });
  
  // Check if current user can manage this role
  const canManageRole = (role: string): boolean => {
    if (!user) return false;
    
    // Admin can manage all roles
    if (user.role === UserRole.ADMIN) return true;
    
    // Owner can manage all except admin and other owners
    if (user.role === UserRole.OWNER) {
      return role !== UserRole.ADMIN && role !== UserRole.OWNER;
    }
    
    // Manager can manage waiters, hosts, and chefs
    if (user.role === UserRole.MANAGER) {
      return [UserRole.WAITER, UserRole.HOST, UserRole.CHEF].includes(role as UserRole);
    }
    
    return false;
  };
  
  // Get available roles that can be managed
  const getAvailableRoles = (): UserRole[] => {
    if (!user) return [];
    
    if (user.role === UserRole.ADMIN) {
      return [UserRole.HOST, UserRole.WAITER, UserRole.CHEF, UserRole.MANAGER, UserRole.OWNER, UserRole.ADMIN];
    }
    
    if (user.role === UserRole.OWNER) {
      return [UserRole.HOST, UserRole.WAITER, UserRole.CHEF, UserRole.MANAGER];
    }
    
    if (user.role === UserRole.MANAGER) {
      return [UserRole.HOST, UserRole.WAITER, UserRole.CHEF];
    }
    
    return [];
  };
  
  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setSelectedStaff(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: getAvailableRoles()[0],
      active: true
    });
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (member: StaffMember) => {
    if (!canManageRole(member.role)) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: `You don't have permission to edit ${getRoleDisplayName(member.role)}s.`,
      });
      return;
    }
    
    setIsEditing(true);
    setSelectedStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '', // Don't include current password
      role: member.role,
      active: member.active
    });
    setIsDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (member: StaffMember) => {
    if (!canManageRole(member.role)) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: `You don't have permission to delete ${getRoleDisplayName(member.role)}s.`,
      });
      return;
    }
    
    setSelectedStaff(member);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.email || (!isEditing && !formData.password) || !formData.role) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "Please fill in all required fields.",
        });
        return;
      }
      
      if (!canManageRole(formData.role)) {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: `You don't have permission to manage ${getRoleDisplayName(formData.role)}s.`,
        });
        return;
      }
      
      if (isEditing && selectedStaff) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          active: formData.active
        };
        
        // Only include password if it was changed
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await dispatch(updateStaffMember({ 
          id: selectedStaff.id, 
          data: updateData 
        })).unwrap();
        
        toast({
          title: "Staff member updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        await dispatch(createStaffMember({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })).unwrap();
        
        toast({
          title: "Staff member created",
          description: `${formData.name} has been added to the staff.`,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: isEditing ? "Update failed" : "Creation failed",
        description: error as string || "An error occurred",
      });
    }
  };
  
  const handleDelete = async () => {
    if (!selectedStaff) return;
    
    try {
      await dispatch(deleteStaffMember(selectedStaff.id)).unwrap();
      
      toast({
        title: "Staff member deleted",
        description: `${selectedStaff.name} has been removed from the staff.`,
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error as string || "An error occurred",
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Staff Management</CardTitle>
          <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value={UserRole.HOST}>Hosts</TabsTrigger>
              <TabsTrigger value={UserRole.WAITER}>Waiters</TabsTrigger>
              <TabsTrigger value={UserRole.CHEF}>Chefs</TabsTrigger>
              <TabsTrigger value={UserRole.MANAGER}>Managers</TabsTrigger>
              {user?.role === UserRole.OWNER && (
                <TabsTrigger value={UserRole.OWNER}>Owners</TabsTrigger>
              )}
              {user?.role === UserRole.ADMIN && (
                <TabsTrigger value={UserRole.ADMIN}>Admins</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map(member => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                <UserCircle className="h-5 w-5 text-gray-500" />
                              </div>
                              {member.name}
                            </div>
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeStyle(member.role)}`}>
                              {getRoleDisplayName(member.role)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {member.active ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Inactive</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditDialog(member)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleOpenDeleteDialog(member)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {filteredStaff.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No staff members found. Add a staff member to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add/Edit Staff Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {isEditing ? 'New Password (leave empty to keep current)' : 'Password'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isEditing ? 'Leave blank to keep current password' : 'Create a password'}
                required={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleSelectChange('role', value)}
                disabled={isEditing && !canManageRole(formData.role)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map(role => (
                    <SelectItem key={role} value={role}>{getRoleDisplayName(role)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isEditing && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleSwitchChange('active', checked)}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Update Staff' : 'Add Staff'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedStaff?.name} from the staff. They will no longer have access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;
