import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMenuItems, 
  MenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../../redux/menuSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { MenuItemCategory } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const MenuManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.menu);
  const [activeTab, setActiveTab] = useState(MenuItemCategory.APPETIZER);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: MenuItemCategory.APPETIZER,
    available: true,
    isSpecial: false
  });
  
  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);
  
  // Filter items by category
  const filteredItems = items.filter(item => item.category === activeTab);
  
  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: activeTab,
      available: true,
      isSpecial: false
    });
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (item: MenuItem) => {
    setIsEditing(true);
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      available: item.available,
      isSpecial: item.isSpecial
    });
    setIsDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: formData.price, // Keep it as a string to match the backend expectation
        category: formData.category,
        available: formData.available,
        isSpecial: formData.isSpecial
      };
      
      if (isEditing && selectedItem) {
        await dispatch(updateMenuItem({ 
          id: selectedItem._id, 
          data: menuItemData 
        })).unwrap();
        
        toast({
          title: "Menu item updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        await dispatch(createMenuItem(menuItemData)).unwrap();
        
        toast({
          title: "Menu item created",
          description: `${formData.name} has been added to the menu.`,
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
    if (!selectedItem) return;
    
    try {
      await dispatch(deleteMenuItem(selectedItem._id)).unwrap();
      
      toast({
        title: "Menu item deleted",
        description: `${selectedItem.name} has been removed from the menu.`,
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
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case MenuItemCategory.APPETIZER:
        return 'Appetizer';
      case MenuItemCategory.MAIN_COURSE:
        return 'Main Course';
      case MenuItemCategory.SIDE:
        return 'Side';
      case MenuItemCategory.DESSERT:
        return 'Dessert';
      case MenuItemCategory.DRINK:
        return 'Drink';
      default:
        return category;
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Menu Management</CardTitle>
          <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value={MenuItemCategory.APPETIZER}>Appetizers</TabsTrigger>
              <TabsTrigger value={MenuItemCategory.MAIN_COURSE}>Main Courses</TabsTrigger>
              <TabsTrigger value={MenuItemCategory.SIDE}>Sides</TabsTrigger>
              <TabsTrigger value={MenuItemCategory.DESSERT}>Desserts</TabsTrigger>
              <TabsTrigger value={MenuItemCategory.DRINK}>Drinks</TabsTrigger>
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
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Special</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map(item => (
                        <TableRow key={item._id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.description || '-'}</TableCell>
                          <TableCell>${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</TableCell>
                          <TableCell>
                            {item.available ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Yes</span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">No</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.isSpecial ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Yes</span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">No</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenEditDialog(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleOpenDeleteDialog(item)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {filteredItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No items found in this category. Add an item to get started.
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
      
      {/* Add/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Item name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Item description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MenuItemCategory.APPETIZER}>Appetizer</SelectItem>
                  <SelectItem value={MenuItemCategory.MAIN_COURSE}>Main Course</SelectItem>
                  <SelectItem value={MenuItemCategory.SIDE}>Side</SelectItem>
                  <SelectItem value={MenuItemCategory.DESSERT}>Dessert</SelectItem>
                  <SelectItem value={MenuItemCategory.DRINK}>Drink</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => handleSwitchChange('available', checked)}
              />
              <Label htmlFor="available">Available</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isSpecial"
                checked={formData.isSpecial}
                onCheckedChange={(checked) => handleSwitchChange('isSpecial', checked)}
              />
              <Label htmlFor="isSpecial">Mark as Special</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Update Item' : 'Add Item'}
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
              This will remove {selectedItem?.name} from the menu. This action cannot be undone.
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

export default MenuManagement;
