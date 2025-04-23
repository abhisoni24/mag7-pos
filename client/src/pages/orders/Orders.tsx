import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, Order, updateOrderStatus } from '../../redux/orderSlice';
import { fetchTables } from '../../redux/tableSlice';
import { fetchStaff, StaffMember } from '../../redux/staffSlice';
import { AppDispatch, RootState } from '../../redux/store';
import OrderItem from '../../components/orders/OrderItem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@shared/schema';
import CreateOrderModal from '../../components/modals/CreateOrderModal';
import { useToast } from '@/hooks/use-toast';

const Orders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const { tables } = useSelector((state: RootState) => state.tables);
  const { staff } = useSelector((state: RootState) => state.staff);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch all orders regardless of role
    dispatch(fetchOrders({}));
    dispatch(fetchTables({}));
    // Fetch waiters for order assignment info
    dispatch(fetchStaff('waiter'));
  }, [dispatch]);
  
  const filteredOrders = orders.filter(order => {
    // Filter by tab - no need to filter by waiter ID here since we already do it in API call
    if (activeTab === 'all') return true;
    if (activeTab === 'new') return order.status === OrderStatus.NEW;
    if (activeTab === 'in_progress') return order.status === OrderStatus.IN_PROGRESS;
    if (activeTab === 'done') return order.status === OrderStatus.DONE;
    if (activeTab === 'paid') return order.status === OrderStatus.PAID;
    return true;
  });
  
  // Sort orders by creation date (newest first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  
  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };
  
  const handleUpdateStatus = async (order: Order, newStatus: string) => {
    try {
      await dispatch(updateOrderStatus({ id: order._id as string, status: newStatus })).unwrap();
      toast({
        title: "Status updated",
        description: `Order #${order._id?.substring(0, 4)} is now ${newStatus}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error as string || "Failed to update order status",
      });
    }
  };
  
  return (
    <div className="p-4 bg-gray-100">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </CardContent>
            </Card>
          ) : sortedOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedOrders.map(order => {
                const assignedWaiter = order.waiterId 
                  ? staff.find(s => s.id === order.waiterId) || null
                  : null;
                  
                return (
                  <OrderItem
                    key={order._id}
                    order={order}
                    table={tables.find(table => table._id === order.tableId)}
                    waiter={assignedWaiter}
                    onViewDetails={() => handleViewOrderDetails(order)}
                    onUpdateStatus={(status) => handleUpdateStatus(order, status)}
                  />
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col justify-center items-center h-40">
                <p className="text-gray-500 mb-4">No orders found</p>
                <Button onClick={() => setShowOrderDetails(true)}>Create New Order</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Order Details Modal */}
      {showOrderDetails && (
        <CreateOrderModal
          isOpen={showOrderDetails}
          onClose={handleCloseOrderDetails}
          table={selectedOrder ? tables.find(table => table._id === selectedOrder.tableId) || null : null}
          existingOrder={selectedOrder}
        />
      )}
    </div>
  );
};

export default Orders;
