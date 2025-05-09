import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  Order,
  OrderItem,
  updateOrderStatus,
} from "../../redux/orderSlice";
import { fetchTables } from "../../redux/tableSlice";
import { fetchStaff } from "../../redux/staffSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { OrderStatus } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Clock, Utensils, User } from "lucide-react";

/**
 * @component Kitchen
 * @description A page component that displays the kitchen interface for managing orders.
 * It shows incoming, in-progress, and completed orders, and allows kitchen staff to update order statuses.
 * @returns {JSX.Element} - The kitchen page element.
 */
const Kitchen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const { tables, loading: tablesLoading } = useSelector(
    (state: RootState) => state.tables
  );
  const { staff } = useSelector((state: RootState) => state.staff);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const { toast } = useToast();

  // Track if initial loading is complete
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Track which order types have loaded
  const [orderTypesLoaded, setOrderTypesLoaded] = useState({
    new: false,
    inProgress: false,
    done: false,
  });

  /**
   * @function fetchOrdersByStatus
   * @description Fetches orders by a specific status and updates the loaded state.
   * @param {string} status - The status of the orders to fetch.
   * @returns {Promise<void>} - A promise that resolves when the orders are fetched and state is updated.
   */
  const fetchOrdersByStatus = async (status: string) => {
    try {
      const results = await dispatch(fetchOrders({ status })).unwrap();
      console.log(`Orders with status ${status}:`, results);

      // Update which order types have loaded
      setOrderTypesLoaded((prev) => ({
        ...prev,
        [status === OrderStatus.NEW
          ? "new"
          : status === OrderStatus.IN_PROGRESS
          ? "inProgress"
          : "done"]: true,
      }));
    } catch (error) {
      console.error(`Error fetching ${status} orders:`, error);
    }
  };

  /**
   * @function fetchAllKitchenOrders
   * @description Fetches all kitchen-related data, including tables, staff, and orders with different statuses.
   * It also handles setting the initial loading state and refreshing the data.
   * @returns {Promise<void>} - A promise that resolves when all data is fetched and state is updated.
   */
  const fetchAllKitchenOrders = async () => {
    console.log("Fetching kitchen orders...");
    setIsRefreshing(true);

    try {
      // Reset loaded states
      setOrderTypesLoaded({
        new: false,
        inProgress: false,
        done: false,
      });

      // Fetch tables and staff first
      await dispatch(fetchTables({})).unwrap();
      await dispatch(fetchStaff("waiter")).unwrap();

      // Fetch orders in sequence to avoid race conditions
      await fetchOrdersByStatus(OrderStatus.NEW);
      await fetchOrdersByStatus(OrderStatus.IN_PROGRESS);
      await fetchOrdersByStatus(OrderStatus.DONE);

      setInitialLoadComplete(true);
    } catch (error) {
      console.error("Error in fetchAllKitchenOrders:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * @useEffect
   * @description Fetches initial data and sets up polling for new orders on component mount.
   */
  useEffect(() => {
    // Fetch immediately on component mount
    fetchAllKitchenOrders();

    // Set up polling for new orders
    const interval = setInterval(() => {
      fetchAllKitchenOrders();
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  /**
   * @function handleRefresh
   * @description Manually refreshes the kitchen display with the latest orders.
   */
  const handleRefresh = () => {
    fetchAllKitchenOrders();
    toast({
      title: "Refreshing...",
      description: "Kitchen display updating with latest orders",
    });
  };

  // Derived state
  const incomingOrders = orders.filter(
    (order) => order.status === OrderStatus.NEW
  );
  const inProgressOrders = orders.filter(
    (order) => order.status === OrderStatus.IN_PROGRESS
  );
  const completedOrders = orders.filter(
    (order) => order.status === OrderStatus.DONE
  );

  // Debug the filtered orders
  useEffect(() => {
    console.log("Orders in Redux state:", orders.length);
    console.log("OrderStatus.NEW =", OrderStatus.NEW);
    console.log("OrderStatus.IN_PROGRESS =", OrderStatus.IN_PROGRESS);

    // Log each order status to debug
    orders.forEach((order) => {
      console.log(
        `Order ID ${order._id?.substring(order._id.length - 4)}, status: "${
          order.status
        }"`
      );
    });

    console.log("Incoming orders:", incomingOrders.length);
    console.log("In-progress orders:", inProgressOrders.length);
    console.log("Completed orders:", completedOrders.length);
  }, [orders]);

  // Determine if we're still in the loading state
  // Only show loading if we're actually loading or refreshing and don't have orders yet
  const isLoading =
    (loading || tablesLoading || isRefreshing) &&
    incomingOrders.length === 0 &&
    inProgressOrders.length === 0;

  /**
   * @function getTableNumber
   * @description Gets the table number from the table ID.
   * @param {string} tableId - The ID of the table.
   * @returns {string} - The table number, or 'Unknown' if not found.
   */
  const getTableNumber = (tableId: string) => {
    const table = tables.find((t) => t._id === tableId);
    return table ? table.number : "Unknown";
  };

  /**
   * @function getTimeElapsed
   * @description Calculates the time elapsed since the order was created.
   * @param {string} createdAt - The creation timestamp of the order.
   * @returns {string} - A string representing the time elapsed (e.g., "Just now", "1 minute ago", "5m ago").
   */
  const getTimeElapsed = (createdAt: string) => {
    const orderTime = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const elapsed = now - orderTime;

    const minutes = Math.floor(elapsed / 60000);

    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    return `${minutes}m ago`;
  };

  /**
   * @function handleStartOrder
   * @description Updates the order status to 'in_progress'.
   * @param {Order} order - The order to start.
   */
  const handleStartOrder = async (order: Order) => {
    try {
      await dispatch(
        updateOrderStatus({
          id: order._id as string,
          status: OrderStatus.IN_PROGRESS,
        })
      ).unwrap();

      const orderId = order._id
        ? order._id.substring(order._id.length - 4)
        : "N/A";
      toast({
        title: "Order started",
        description: `Order #${orderId} is now in progress`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: (error as string) || "Failed to update order status",
      });
    }
  };

  /**
   * @function handleCompleteOrder
   * @description Updates the order status to 'done'.
   * @param {Order} order - The order to complete.
   */
  const handleCompleteOrder = async (order: Order) => {
    try {
      await dispatch(
        updateOrderStatus({
          id: order._id as string,
          status: OrderStatus.DONE,
        })
      ).unwrap();

      const orderId = order._id
        ? order._id.substring(order._id.length - 4)
        : "N/A";
      toast({
        title: "Order completed",
        description: `Order #${orderId} is now ready for delivery`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: (error as string) || "Failed to update order status",
      });
    }
  };

  /**
   * @function showOrderDetails
   * @description Sets the selected order to display its details in a modal.
   * @param {Order} order - The order to display.
   */
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  /**
   * @function renderOrderCard
   * @description Renders a card component for an order.
   * @param {Order} order - The order to render.
   * @param {'new' | 'in_progress'} status - The status of the order.
   * @returns {JSX.Element} - The order card element.
   */
  const renderOrderCard = (order: Order, status: "new" | "in_progress") => {
    const tableNumber = getTableNumber(order.tableId);
    const timeElapsed = getTimeElapsed(order.createdAt);
    const orderItems = order.items;
    const orderId = order._id
      ? order._id.substring(order._id.length - 4)
      : "N/A";
    const assignedWaiter = order.waiterId
      ? staff.find((s) => s.id === order.waiterId)
      : null;

    const borderColor = status === "new" ? "border-blue-500" : "border-warning";
    const statusBgColor =
      status === "new"
        ? "bg-blue-100 text-blue-800"
        : "bg-yellow-100 text-yellow-800";
    const statusText = status === "new" ? "New" : "In Progress";
    const actionBtnColor =
      status === "new" ? "bg-warning text-white" : "bg-success text-white";
    const actionBtnText = status === "new" ? "Start" : "Complete";
    const actionHandler =
      status === "new"
        ? () => handleStartOrder(order)
        : () => handleCompleteOrder(order);

    return (
      <Card key={order._id} className={`border-l-4 ${borderColor}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-lg">Order #{orderId}</span>
            <span className={`text-sm ${statusBgColor} py-1 px-2 rounded-full`}>
              {statusText}
            </span>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600">
              <Clock className="inline-block w-4 h-4 mr-1" /> {timeElapsed}
            </p>
            <p className="text-sm text-gray-600">
              <Utensils className="inline-block w-4 h-4 mr-1" /> Table{" "}
              {tableNumber}
            </p>
            {order.waiterId && (
              <p className="text-xs text-gray-500">
                <User className="inline-block w-3 h-3 mr-1" /> Waiter:{" "}
                {assignedWaiter?.name || "Assigned"}
              </p>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.notes && (
                    <p className="text-sm text-gray-600">{item.notes}</p>
                  )}
                </div>
                <span className="text-sm">x{item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => showOrderDetails(order)}
              className="flex-1"
            >
              Details
            </Button>
            <Button
              className={`flex-1 font-semibold text-white ${
                status === "new"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={actionHandler}
            >
              {actionBtnText}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-800">Incoming Orders</h3>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-refresh-cw"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomingOrders.map((order) => renderOrderCard(order, "new"))}
            {inProgressOrders.map((order) =>
              renderOrderCard(order, "in_progress")
            )}

            {incomingOrders.length === 0 && inProgressOrders.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="flex justify-center items-center h-40">
                    <p className="text-gray-500">
                      No orders to prepare at this time
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium">Completed Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Time Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedOrders.map((order) => {
                  const startTime = new Date(order.createdAt);
                  const completeTime = new Date(order.updatedAt);
                  const timeTaken = Math.round(
                    (completeTime.getTime() - startTime.getTime()) / 60000
                  ); // in minutes
                  const orderId = order._id
                    ? order._id.substring(order._id.length - 4)
                    : "N/A";

                  return (
                    <TableRow key={order._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">#{orderId}</TableCell>
                      <TableCell>
                        Table {getTableNumber(order.tableId)}
                      </TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>
                        {startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        {completeTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{timeTaken} min</TableCell>
                    </TableRow>
                  );
                })}

                {completedOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-gray-500"
                    >
                      No completed orders
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Order #
                {selectedOrder._id?.substring(selectedOrder._id.length - 4)}{" "}
                Details
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </Button>
            </div>

            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Order Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Table</p>
                      <p>Table {getTableNumber(selectedOrder.tableId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="capitalize">{selectedOrder.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p>
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p>
                        {new Date(selectedOrder.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedOrder.waiterId && (
                      <div>
                        <p className="text-sm text-gray-500">Waiter</p>
                        <p>
                          {staff.find((s) => s.id === selectedOrder.waiterId)
                            ?.name || "Assigned"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Items</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.notes || "-"}</TableCell>
                          <TableCell className="capitalize">
                            {item.status}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </Button>
                  {selectedOrder.status === OrderStatus.NEW && (
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      onClick={() => {
                        handleStartOrder(selectedOrder);
                        setSelectedOrder(null);
                      }}
                    >
                      Start Preparing
                    </Button>
                  )}
                  {selectedOrder.status === OrderStatus.IN_PROGRESS && (
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                      onClick={() => {
                        handleCompleteOrder(selectedOrder);
                        setSelectedOrder(null);
                      }}
                    >
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Kitchen;
