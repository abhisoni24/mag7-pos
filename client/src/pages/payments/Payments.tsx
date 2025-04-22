import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, Order, createPayment } from '../../redux/orderSlice';
import { fetchTables } from '../../redux/tableSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Receipt } from 'lucide-react';

const Payments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const { tables } = useSelector((state: RootState) => state.tables);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [activeTab, setActiveTab] = useState('pending');
  
  const { toast } = useToast();
  
  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchTables());
  }, [dispatch]);
  
  // Filter orders
  const pendingPaymentOrders = orders.filter(order => 
    (order.status === OrderStatus.DONE || order.status === OrderStatus.DELIVERED) &&
    // Filter by current user if they're a waiter
    (user?.role !== 'waiter' || order.waiterId === user.id)
  );
  
  const paidOrders = orders.filter(order => 
    order.status === OrderStatus.PAID &&
    // Filter by current user if they're a waiter
    (user?.role !== 'waiter' || order.waiterId === user.id)
  );
  
  // Sort orders by date (newest first)
  const sortedPendingOrders = [...pendingPaymentOrders].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  const sortedPaidOrders = [...paidOrders].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Get table info
  const getTableInfo = (tableId: string) => {
    const table = tables.find(t => t._id === tableId);
    return table ? `Table ${table.number}` : 'Unknown Table';
  };
  
  // Calculate order total
  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  const handleOpenPaymentModal = (order: Order) => {
    setSelectedOrder(order);
    const total = calculateOrderTotal(order);
    setPaymentAmount(total.toFixed(2));
    setTipAmount('0.00');
    setIsPaymentModalOpen(true);
  };
  
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
    setPaymentAmount('');
    setTipAmount('');
  };
  
  const handleProcessPayment = async () => {
    if (!selectedOrder || !paymentAmount) return;
    
    try {
      await dispatch(createPayment({
        orderId: selectedOrder._id as string,
        amount: parseFloat(paymentAmount),
        tip: parseFloat(tipAmount || '0'),
        paymentMethod
      })).unwrap();
      
      toast({
        title: "Payment processed",
        description: `Payment for order #${selectedOrder._id?.substring(0, 4)} has been processed successfully.`,
      });
      
      handleClosePaymentModal();
      dispatch(fetchOrders());
      dispatch(fetchTables());
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error as string || "Failed to process payment",
      });
    }
  };
  
  const renderOrdersTable = (ordersToDisplay: Order[]) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersToDisplay.map(order => {
            const total = calculateOrderTotal(order);
            
            return (
              <TableRow key={order._id}>
                <TableCell className="font-medium">#{order._id?.substring(0, 4)}</TableCell>
                <TableCell>{getTableInfo(order.tableId)}</TableCell>
                <TableCell>{new Date(order.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>${total.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
                <TableCell className="text-right">
                  {order.status !== OrderStatus.PAID ? (
                    <Button 
                      size="sm"
                      onClick={() => handleOpenPaymentModal(order)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Payment
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      variant="outline"
                      disabled
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          
          {ordersToDisplay.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="p-4 bg-gray-100">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="paid">Paid Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {renderOrdersTable(sortedPendingOrders)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paid">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {renderOrdersTable(sortedPaidOrders)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <span>Order #{selectedOrder._id?.substring(0, 4)} - {getTableInfo(selectedOrder.tableId)}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Order Summary</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                      <TableCell className="text-right font-medium">${calculateOrderTotal(selectedOrder).toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Payment Amount</Label>
                  <Input
                    id="payment-amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tip-amount">Tip Amount</Label>
                  <Input
                    id="tip-amount"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                      <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="py-2 flex justify-between font-medium">
                  <span>Total Payment:</span>
                  <span>${(parseFloat(paymentAmount || '0') + parseFloat(tipAmount || '0')).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleClosePaymentModal}>Cancel</Button>
            <Button onClick={handleProcessPayment}>Process Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
