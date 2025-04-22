import { useState } from 'react';
import { Order, OrderItem as OrderItemType } from '../../redux/orderSlice';
import { Table } from '../../redux/tableSlice';
import { OrderStatus } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Check, Clock, CreditCard, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderItemProps {
  order: Order;
  table?: Table;
  onViewDetails: () => void;
  onUpdateStatus: (status: string) => void;
}

const OrderItem = ({ order, table, onViewDetails, onUpdateStatus }: OrderItemProps) => {
  // Calculate total order amount
  const calculateTotal = (items: OrderItemType[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Format time distance (e.g., "5 minutes ago")
  const getTimeDistance = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get status color and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case OrderStatus.NEW:
        return {
          color: 'bg-blue-100 text-blue-800',
          text: 'New'
        };
      case OrderStatus.IN_PROGRESS:
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'In Progress'
        };
      case OrderStatus.DONE:
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Ready'
        };
      case OrderStatus.DELIVERED:
        return {
          color: 'bg-purple-100 text-purple-800',
          text: 'Delivered'
        };
      case OrderStatus.PAID:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Paid'
        };
      case OrderStatus.CANCELLED:
        return {
          color: 'bg-red-100 text-red-800',
          text: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: status
        };
    }
  };
  
  // Get available next statuses based on current status
  const getNextStatuses = (currentStatus: string): { value: string; label: string }[] => {
    switch (currentStatus) {
      case OrderStatus.NEW:
        return [
          { value: OrderStatus.IN_PROGRESS, label: 'Mark as In Progress' },
          { value: OrderStatus.CANCELLED, label: 'Cancel Order' }
        ];
      case OrderStatus.IN_PROGRESS:
        return [
          { value: OrderStatus.DONE, label: 'Mark as Ready' },
          { value: OrderStatus.CANCELLED, label: 'Cancel Order' }
        ];
      case OrderStatus.DONE:
        return [
          { value: OrderStatus.DELIVERED, label: 'Mark as Delivered' },
          { value: OrderStatus.CANCELLED, label: 'Cancel Order' }
        ];
      case OrderStatus.DELIVERED:
        return [
          { value: OrderStatus.PAID, label: 'Mark as Paid' },
          { value: OrderStatus.CANCELLED, label: 'Cancel Order' }
        ];
      default:
        return [];
    }
  };
  
  const { color, text } = getStatusInfo(order.status);
  const total = calculateTotal(order.items);
  const tableNumber = table ? table.number : 'Unknown';
  const timeAgo = getTimeDistance(order.createdAt);
  const nextStatuses = getNextStatuses(order.status);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="font-medium text-lg">Order #{order._id?.substring(0, 4)}</span>
            <Badge className={color + " ml-2"}>
              {text}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              {nextStatuses.map((status) => (
                <DropdownMenuItem key={status.value} onClick={() => onUpdateStatus(status.value)}>
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Table {tableNumber}
            </div>
            <div className="text-sm font-medium">${total.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="space-y-1 mb-4">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity}× {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="text-sm text-gray-500">
              +{order.items.length - 3} more items
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={onViewDetails}
          >
            View Order
          </Button>
          
          {order.status === OrderStatus.DONE && (
            <Button 
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onUpdateStatus(OrderStatus.DELIVERED)}
            >
              <Check className="h-4 w-4 mr-1" /> Deliver
            </Button>
          )}
          
          {order.status === OrderStatus.DELIVERED && (
            <Button 
              size="sm"
              className="flex-1"
              onClick={() => onUpdateStatus(OrderStatus.PAID)}
            >
              <CreditCard className="h-4 w-4 mr-1" /> Pay
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItem;
