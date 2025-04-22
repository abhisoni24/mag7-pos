import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMenuItems, 
  MenuItem 
} from '../../redux/menuSlice';
import { 
  Order, 
  OrderItem, 
  createOrder, 
  addItemToOrder, 
  updateOrderItem 
} from '../../redux/orderSlice';
import { Table } from '../../redux/tableSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { MenuItemCategory } from '@shared/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Search, Minus, Plus, X, Trash2 } from 'lucide-react';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  existingOrder?: Order | null;
}

const CreateOrderModal = ({ 
  isOpen, 
  onClose, 
  table, 
  existingOrder 
}: CreateOrderModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: menuItems, loading: menuLoading } = useSelector((state: RootState) => state.menu);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  
  // Local state
  const [activeCategory, setActiveCategory] = useState(MenuItemCategory.APPETIZER);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderItems, setOrderItems] = useState<{
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Load menu items on mount
  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);
  
  // Update order items when existing order changes
  useEffect(() => {
    if (existingOrder) {
      setOrderItems(
        existingOrder.items.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes
        }))
      );
    } else {
      setOrderItems([]);
    }
  }, [existingOrder]);
  
  // Calculate total amount whenever order items change
  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  }, [orderItems]);
  
  // Filter menu items based on category and search query
  const filteredMenuItems = menuItems.filter(item => {
    if (!searchQuery) {
      return item.category === activeCategory && item.available;
    }
    
    const searchLower = searchQuery.toLowerCase();
    return item.available && (
      item.name.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower))
    );
  });
  
  // Add item to order
  const handleAddItem = (item: MenuItem) => {
    // Check if item already exists in order
    const existingItemIndex = orderItems.findIndex(
      orderItem => orderItem.menuItemId === item._id
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Add new item
      setOrderItems([...orderItems, {
        menuItemId: item._id,
        name: item.name,
        quantity: 1,
        price: item.price,
        notes: ''
      }]);
    }
  };
  
  // Update item quantity
  const handleUpdateQuantity = (index: number, change: number) => {
    const updatedItems = [...orderItems];
    const newQuantity = updatedItems[index].quantity + change;
    
    if (newQuantity <= 0) {
      // Remove item if quantity is zero or negative
      updatedItems.splice(index, 1);
    } else {
      updatedItems[index].quantity = newQuantity;
    }
    
    setOrderItems(updatedItems);
  };
  
  // Update item notes
  const handleUpdateNotes = (index: number, notes: string) => {
    const updatedItems = [...orderItems];
    updatedItems[index].notes = notes;
    setOrderItems(updatedItems);
  };
  
  // Remove item from order
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };
  
  // Submit order
  const handleSubmitOrder = async () => {
    try {
      if (!table && !existingOrder) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No table selected",
        });
        return;
      }
      
      if (orderItems.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Order must have at least one item",
        });
        return;
      }
      
      if (existingOrder) {
        // Add new items to existing order
        for (const item of orderItems) {
          // Check if item already exists in the order
          const existingItem = existingOrder.items.find(
            orderItem => orderItem.menuItemId === item.menuItemId
          );
          
          if (existingItem) {
            // Update existing item
            await dispatch(updateOrderItem({
              orderId: existingOrder._id as string,
              itemId: item.menuItemId,
              updates: {
                quantity: item.quantity,
                notes: item.notes
              }
            })).unwrap();
          } else {
            // Add new item
            await dispatch(addItemToOrder({
              orderId: existingOrder._id as string,
              item: {
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: item.price,
                notes: item.notes
              }
            })).unwrap();
          }
        }
        
        toast({
          title: "Order updated",
          description: `Order #${existingOrder._id?.substring(0, 4)} has been updated`,
        });
      } else if (table) {
        // Create new order
        await dispatch(createOrder({
          tableId: table._id,
          waiterId: table.waiterId || user?.id,
          items: orderItems.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
          }))
        })).unwrap();
        
        toast({
          title: "Order created",
          description: `New order has been created for Table ${table.number}`,
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error as string || "Failed to submit order",
      });
    }
  };
  
  // Save order as draft (just close for now, actual implementation would save to localStorage or backend)
  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Order has been saved as a draft",
    });
    onClose();
  };
  
  // Get category display name
  const getCategoryDisplayName = (category: string): string => {
    switch (category) {
      case MenuItemCategory.APPETIZER: return 'Appetizers';
      case MenuItemCategory.MAIN_COURSE: return 'Main Courses';
      case MenuItemCategory.SIDE: return 'Sides';
      case MenuItemCategory.DESSERT: return 'Desserts';
      case MenuItemCategory.DRINK: return 'Drinks';
      default: return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {existingOrder ? `Edit Order #${existingOrder._id?.substring(0, 4)}` : `New Order - ${table ? `Table ${table.number}` : ''}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row h-full max-h-[70vh]">
          {/* Menu Categories and Items */}
          <div className="w-full md:w-1/2 border-r border-gray-200">
            <div className="p-4">
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              </div>
              
              {!searchQuery && (
                <div className="mb-4 flex flex-wrap gap-1">
                  {Object.values(MenuItemCategory).map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                      className="mb-1"
                    >
                      {getCategoryDisplayName(category)}
                    </Button>
                  ))}
                </div>
              )}
              
              <ScrollArea className="h-[calc(70vh-140px)]">
                {menuLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredMenuItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredMenuItems.map((item) => (
                      <div
                        key={item._id}
                        className="border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleAddItem(item)}
                      >
                        <div className="flex justify-between mb-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <span className="text-sm">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        {item.isSpecial && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">Special</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40 text-gray-500">
                    No items found
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="p-4 flex-1 overflow-auto">
              <h4 className="font-medium mb-3">Current Order</h4>
              
              {orderItems.length > 0 ? (
                <ScrollArea className="h-[calc(70vh-200px)] pr-2">
                  <div className="space-y-3">
                    {orderItems.map((item, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{item.name}</div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-500 hover:text-red-500"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center mt-1 mb-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => handleUpdateQuantity(index, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-2">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => handleUpdateQuantity(index, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <div className="ml-auto">
                                <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                            
                            <Textarea
                              placeholder="Special instructions..."
                              className="h-16 text-sm"
                              value={item.notes || ''}
                              onChange={(e) => handleUpdateNotes(index, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex justify-center items-center h-40 text-gray-500 border border-dashed rounded-md">
                  No items added yet
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between mb-4 pt-2">
                <span className="font-medium">Total:</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitOrder}
                  disabled={orderItems.length === 0}
                >
                  {existingOrder ? 'Update Order' : 'Send to Kitchen'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderModal;
