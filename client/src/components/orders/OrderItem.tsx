import { useState } from "react";
import { Order, OrderItem as OrderItemType } from "../../redux/orderSlice";
import { Table } from "../../redux/tableSlice";
import { OrderStatus } from "@shared/schema";
import * as api from "../../lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Clock,
  CreditCard,
  MoreHorizontal,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * @interface OrderItemProps
 * @description Interface for the props of the OrderItem component.
 * @param {Order} order - The order object to display.
 * @param {Table} [table] - The table associated with the order.
 * @param {object} [waiter] - The waiter assigned to the order.
 * @param {string} waiter.id - The ID of the waiter.
 * @param {string} waiter.name - The name of the waiter.
 * @param {function} onViewDetails - A function to call when the "View Details" button is clicked.
 * @param {function} onUpdateStatus - A function to call when the order status is updated.
 */
interface OrderItemProps {
  order: Order;
  table?: Table;
  waiter?: { id: string; name: string } | null;
  onViewDetails: () => void;
  onUpdateStatus: (status: string) => void;
}

/**
 * @component OrderItem
 * @description Displays a summary of an order, including its status, items, and actions.
 * @param {OrderItemProps} props - The props for the OrderItem component.
 * @returns {JSX.Element} - The order item element.
 */
const OrderItem = ({
  order,
  table,
  waiter,
  onViewDetails,
  onUpdateStatus,
}: OrderItemProps) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);

  /**
   * @function calculateTotal
   * @description Calculates the total amount of an order.
   * @param {OrderItemType[]} items - The items in the order.
   * @returns {number} - The total amount of the order.
   */
  const calculateTotal = (items: OrderItemType[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  /**
   * @function getTimeDistance
   * @description Formats the time distance between a given date and now.
   * @param {string} dateString - The date string to format.
   * @returns {string} - The formatted time distance.
   */
  const getTimeDistance = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  /**
   * @function getStatusInfo
   * @description Gets the status color and text based on the order status.
   * @param {string} status - The order status.
   * @returns {object} - The status color and text.
   */
  const getStatusInfo = (status: string) => {
    switch (status) {
      case OrderStatus.NEW:
        return {
          color: "bg-blue-100 text-blue-800",
          text: "New",
        };
      case OrderStatus.IN_PROGRESS:
        return {
          color: "bg-yellow-100 text-yellow-800",
          text: "In Progress",
        };
      case OrderStatus.DONE:
        return {
          color: "bg-green-100 text-green-800",
          text: "Ready",
        };
      case OrderStatus.DELIVERED:
        return {
          color: "bg-purple-100 text-purple-800",
          text: "Delivered",
        };
      case OrderStatus.PAID:
        return {
          color: "bg-gray-100 text-gray-800",
          text: "Paid",
        };
      case OrderStatus.CANCELLED:
        return {
          color: "bg-red-100 text-red-800",
          text: "Cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          text: status,
        };
    }
  };

  /**
   * @function getNextStatuses
   * @description Gets the available next statuses based on the current status.
   * @param {string} currentStatus - The current order status.
   * @returns {array} - An array of available next statuses.
   */
  const getNextStatuses = (
    currentStatus: string
  ): { value: string; label: string }[] => {
    switch (currentStatus) {
      case OrderStatus.NEW:
        return [
          { value: OrderStatus.IN_PROGRESS, label: "Mark as In Progress" },
          { value: OrderStatus.CANCELLED, label: "Cancel Order" },
        ];
      case OrderStatus.IN_PROGRESS:
        return [
          { value: OrderStatus.DONE, label: "Mark as Ready" },
          { value: OrderStatus.CANCELLED, label: "Cancel Order" },
        ];
      case OrderStatus.DONE:
        return [
          { value: OrderStatus.DELIVERED, label: "Mark as Delivered" },
          { value: OrderStatus.CANCELLED, label: "Cancel Order" },
        ];
      case OrderStatus.DELIVERED:
        return [
          { value: OrderStatus.PAID, label: "Mark as Paid" },
          { value: OrderStatus.CANCELLED, label: "Cancel Order" },
        ];
      default:
        return [];
    }
  };

  const { color, text } = getStatusInfo(order.status);
  const total = calculateTotal(order.items);
  const tableNumber = table ? table.number : "Unknown";
  const timeAgo = getTimeDistance(order.createdAt);
  const nextStatuses = getNextStatuses(order.status);
  const orderId = order._id ? order._id.substring(order._id.length - 4) : "N/A";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="font-medium text-lg">Order #{orderId}</span>
            <Badge className={color + " ml-2"}>{text}</Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={onViewDetails}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {nextStatuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => onUpdateStatus(status.value)}
                >
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
          <div className="flex justify-between">
            <div className="text-sm text-gray-600 flex flex-col">
              <div>Table {tableNumber}</div>
              {order.waiterId && (
                <div className="text-xs text-gray-500">
                  Waiter: {waiter?.name || "Assigned"}
                </div>
              )}
            </div>
            <div className="text-sm font-medium">${total.toFixed(2)}</div>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.name}
              </span>
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowPaymentDialog(true)}
            >
              <DollarSign className="h-4 w-4 mr-1" /> Take Cash Payment
            </Button>
          )}
        </div>
      </CardContent>

      {/* Cash Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Cash Payment</DialogTitle>
            <DialogDescription>
              Collect the following amount from the customer.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm font-medium">Subtotal:</div>
                <div className="text-sm text-right">${total.toFixed(2)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="text-sm font-medium">Tip:</div>
                <div className="flex gap-1">
                  <Button
                    variant={tipAmount === 0 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTipAmount(0)}
                    className="flex-1 text-xs"
                  >
                    None
                  </Button>
                  <Button
                    variant={
                      tipAmount === Math.round(total * 0.15 * 100) / 100
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setTipAmount(Math.round(total * 0.15 * 100) / 100)
                    }
                    className="flex-1 text-xs"
                  >
                    15%
                  </Button>
                  <Button
                    variant={
                      tipAmount === Math.round(total * 0.2 * 100) / 100
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setTipAmount(Math.round(total * 0.2 * 100) / 100)
                    }
                    className="flex-1 text-xs"
                  >
                    20%
                  </Button>
                </div>
              </div>

              <div className="border-t pt-2 grid grid-cols-2 gap-4">
                <div className="text-base font-bold">Total Due:</div>
                <div className="text-base font-bold text-right">
                  ${(total + tipAmount).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={async () => {
                try {
                  // First create the payment record
                  if (!order._id) {
                    throw new Error("Order ID is missing");
                  }

                  await api.createPayment({
                    orderId: order._id,
                    amount: total,
                    tip: tipAmount,
                    paymentMethod: "cash",
                  });

                  // The payment API will automatically update the order status to paid
                  // So we don't need to call onUpdateStatus(OrderStatus.PAID)

                  // Refresh the orders
                  window.location.reload();

                  setShowPaymentDialog(false);
                } catch (error) {
                  console.error("Error processing payment:", error);
                  alert("Failed to process payment. Please try again.");
                }
              }}
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrderItem;
