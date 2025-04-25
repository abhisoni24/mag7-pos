import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaff,
  StaffMember,
  createStaffMember,
  updateStaffMember,
} from "../../redux/staffSlice";
import { AppDispatch, RootState } from "../../redux/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  Users,
  Database,
  ShieldCheck,
  Settings,
  UploadCloud,
  DownloadCloud,
  RefreshCw,
} from "lucide-react";

/**
 * @component SystemAdmin
 * @description A page component for system administrators to manage users, database, security, and system settings.
 * It provides tabs for managing admin users, backing up/restoring/resetting the database, configuring security settings, and setting system-wide configurations.
 * @returns {JSX.Element} - The system administration page element.
 */
const SystemAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { staff, loading } = useSelector((state: RootState) => state.staff);
  const [activeTab, setActiveTab] = useState("users");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isResettingDB, setIsResettingDB] = useState(false);
  const { toast } = useToast();

  /**
   * @interface FormState
   * @description Interface for the form state used in the add admin user dialog.
   * @param {string} name - The full name of the admin user.
   * @param {string} email - The email address of the admin user.
   * @param {string} password - The password for the admin user.
   * @param {string} role - The role of the admin user (always UserRole.ADMIN).
   */
  interface FormState {
    name: string;
    email: string;
    password: string;
    role: string;
  }

  // Form state
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    role: UserRole.ADMIN,
  });

  /**
   * @useEffect
   * @description Fetches staff data from the Redux store on component mount.
   */
  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  /**
   * @function handleOpenAddUserDialog
   * @description Opens the add admin user dialog and resets the form state.
   */
  const handleOpenAddUserDialog = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: UserRole.ADMIN,
    });
    setIsUserDialogOpen(true);
  };

  /**
   * @function handleInputChange
   * @description Handles changes to input fields in the add admin user dialog.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @function handleSelectChange
   * @description Handles changes to select components in the add admin user dialog.
   * @param {string} name - The name of the form field to update.
   * @param {string} value - The new value of the select component.
   */
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @function handleCreateUser
   * @description Handles the creation of a new admin user.
   * It dispatches the createStaffMember action and displays a toast notification.
   */
  const handleCreateUser = async () => {
    try {
      // Validate form
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.role
      ) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: "Please fill in all required fields.",
        });
        return;
      }

      await dispatch(
        createStaffMember({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        })
      ).unwrap();

      toast({
        title: "User created",
        description: `${formData.name} has been created successfully.`,
      });

      setIsUserDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: (error as string) || "An error occurred",
      });
    }
  };

  /**
   * @function simulateDBBackup
   * @description Simulates a database backup process.
   * In a real-world scenario, this would call an API endpoint to backup the database.
   */
  const simulateDBBackup = async () => {
    try {
      // This would typically call an API endpoint to backup the database
      // For now, we'll just simulate with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Backup successful",
        description: "Database has been backed up successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Backup failed",
        description: (error as string) || "An error occurred",
      });
    }
  };

  /**
   * @function simulateDBRestore
   * @description Simulates a database restore process.
   * In a real-world scenario, this would call an API endpoint to restore the database from a backup.
   */
  const simulateDBRestore = async () => {
    try {
      // This would typically call an API endpoint to restore the database
      // For now, we'll just simulate with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Restore successful",
        description: "Database has been restored successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Restore failed",
        description: (error as string) || "An error occurred",
      });
    }
  };

  /**
   * @function simulateDBReset
   * @description Simulates a database reset process.
   * In a real-world scenario, this would call an API endpoint to reset the database to its initial state.
   */
  const simulateDBReset = async () => {
    setIsResettingDB(true);
    try {
      // This would typically call an API endpoint to reset the database
      // For now, we'll just simulate with a delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast({
        title: "Reset successful",
        description: "Database has been reset to initial state.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: (error as string) || "An error occurred",
      });
    } finally {
      setIsResettingDB(false);
    }
  };

  /**
   * @function getRoleDisplayName
   * @description Helper function to get the display name for a given user role.
   * @param {string} role - The user role.
   * @returns {string} - The display name of the role.
   */
  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case UserRole.HOST:
        return "Host";
      case UserRole.WAITER:
        return "Waiter";
      case UserRole.CHEF:
        return "Chef";
      case UserRole.MANAGER:
        return "Manager";
      case UserRole.OWNER:
        return "Owner";
      case UserRole.ADMIN:
        return "Admin";
      default:
        return role;
    }
  };

  /**
   * @constant adminUsers
   * @description Filters the staff data to only include admin users.
   */
  const adminUsers = staff.filter((user) => user.role === UserRole.ADMIN);

  return (
    <div className="p-4 bg-gray-100">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">
                  System Administrators
                </CardTitle>
                <CardDescription>
                  Manage system administrators with full access
                </CardDescription>
              </div>

              <Button onClick={handleOpenAddUserDialog}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </CardHeader>
            <CardContent>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-admin text-white rounded-full text-xs">
                              {getRoleDisplayName(user.role)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.active ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                Inactive
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}

                      {adminUsers.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-gray-500"
                          >
                            No admin users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Backup Database</CardTitle>
                <CardDescription>
                  Create a backup of the current database
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button className="w-full" onClick={simulateDBBackup}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Backup Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restore Database</CardTitle>
                <CardDescription>
                  Restore the database from a backup
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button className="w-full" onClick={simulateDBRestore}>
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Restore
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reset Database</CardTitle>
                <CardDescription>
                  Reset the database to its initial state
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={simulateDBReset}
                  disabled={isResettingDB}
                >
                  {isResettingDB ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure system security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jwt-secret">JWT Secret Key</Label>
                    <div className="flex mt-1">
                      <Input
                        id="jwt-secret"
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        readOnly
                        className="font-mono"
                      />
                      <Button variant="outline" className="ml-2">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="jwt-expiry">JWT Expiry Time (hours)</Label>
                    <Input
                      id="jwt-expiry"
                      type="number"
                      value="24"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Select password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">
                        Simple (min 6 characters)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (min 8 chars, 1 number)
                      </SelectItem>
                      <SelectItem value="strong">
                        Strong (min 8 chars, numbers, symbols)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button>Save Security Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Access Logs</CardTitle>
              <CardDescription>Recent system access attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{new Date().toLocaleString()}</TableCell>
                      <TableCell>admin@restaurant.com</TableCell>
                      <TableCell>192.168.1.1</TableCell>
                      <TableCell>Login</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Success
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {new Date(Date.now() - 3600000).toLocaleString()}
                      </TableCell>
                      <TableCell>unknown@example.com</TableCell>
                      <TableCell>192.168.1.2</TableCell>
                      <TableCell>Login</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Failed
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure general system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <Input
                      id="restaurant-name"
                      defaultValue="Mag7 POS"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="america_new_york">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america_new_york">
                          America/New York
                        </SelectItem>
                        <SelectItem value="america_los_angeles">
                          America/Los Angeles
                        </SelectItem>
                        <SelectItem value="america_chicago">
                          America/Chicago
                        </SelectItem>
                        <SelectItem value="europe_london">
                          Europe/London
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mm_dd_yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy_mm_dd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save System Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Version</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Last Updated</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">NodeJS Version</span>
                  <span>v18.x</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">MongoDB Version</span>
                  <span>5.0</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Server Status</span>
                  <span className="text-green-600">Running</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create Admin User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemAdmin;
