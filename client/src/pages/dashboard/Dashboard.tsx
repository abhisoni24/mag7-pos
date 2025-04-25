import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchTables } from "../../redux/tableSlice";
import { fetchOrders } from "../../redux/orderSlice";
import { UtensilsCrossed, CreditCard, Users } from "lucide-react";

/**
 * @interface ActivityItem
 * @description Interface for an activity item displayed on the dashboard.
 * @param {string} id - The unique identifier for the activity item.
 * @param {string} type - The type of activity (e.g., 'new_order', 'completed_order', 'payment', 'new_customers').
 * @param {string} title - The title of the activity.
 * @param {string} detail - The detailed description of the activity.
 * @param {string} time - The time the activity occurred.
 * @param {Date} timestamp - The timestamp of the activity.
 */
interface ActivityItem {
  id: string;
  type: "new_order" | "completed_order" | "payment" | "new_customers";
  title: string;
  detail: string;
  time: string;
  timestamp: Date;
}

/**
 * @function getActivityIcon
 * @description Returns an icon component based on the activity type.
 * @param {string} type - The type of activity.
 * @returns {JSX.Element | null} - The icon component for the activity type, or null if no icon is found.
 */
const getActivityIcon = (type: string) => {
  switch (type) {
    case "new_order":
      return (
        <div className="rounded-full bg-primary-light bg-opacity-20 p-2 mr-3">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
        </div>
      );
    case "completed_order":
      return (
        <div className="rounded-full bg-success bg-opacity-20 p-2 mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-success"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    case "payment":
      return (
        <div className="rounded-full bg-warning bg-opacity-20 p-2 mr-3">
          <CreditCard className="h-5 w-5 text-warning" />
        </div>
      );
    case "new_customers":
      return (
        <div className="rounded-full bg-host bg-opacity-20 p-2 mr-3">
          <Users className="h-5 w-5 text-host" />
        </div>
      );
    default:
      return null;
  }
};

/**
 * @component Dashboard
 * @description A dashboard component that displays key metrics and recent activities.
 * @returns {JSX.Element} - The dashboard element with statistics, recent activities, and current orders.
 */
const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tables } = useSelector((state: RootState) => state.tables);
  const { orders } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);
  const [_, navigate] = useLocation();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  /**
   * @useEffect
   * @description Fetches tables and orders data on component mount.
   */
  useEffect(() => {
    dispatch(fetchTables());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Derive dashboard data from state
  const activeTables = tables.filter(
    (table) => table.status === "occupied"
  ).length;
  const totalTables = tables.length;
  const activeTablesPercent =
    totalTables > 0 ? (activeTables / totalTables) * 100 : 0;

  const newOrders = orders.filter((order) => order.status === "new").length;
  const inProgressOrders = orders.filter(
    (order) => order.status === "in_progress"
  ).length;
  const openOrders = newOrders + inProgressOrders;

  // Calculate total sales (simplified example)
  const todaySales = orders
    .filter(
      (order) =>
        order.status === "paid" &&
        new Date(order.updatedAt).toDateString() === new Date().toDateString()
    )
    .reduce((total, order) => {
      return (
        total +
        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );
    }, 0);

  const targetSales = 2000;
  const salesPercent = Math.min((todaySales / targetSales) * 100, 100);

  /**
   * @useEffect
   * @description Generates recent activities from orders and sorts them by timestamp.
   */
  useEffect(() => {
    const recentActivities: ActivityItem[] = [];

    // New orders
    orders
      .filter((order) => order.status === "new")
      .slice(0, 3)
      .forEach((order) => {
        recentActivities.push({
          id: `new-${order._id}`,
          type: "new_order",
          title: "New order placed",
          detail: `Table ${
            tables.find((t) => t._id === order.tableId)?.number || "-"
          } - Order #${order._id?.substring(0, 4)}`,
          time: new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(order.createdAt),
        });
      });

    // Completed orders
    orders
      .filter((order) => order.status === "done")
      .slice(0, 2)
      .forEach((order) => {
        recentActivities.push({
          id: `done-${order._id}`,
          type: "completed_order",
          title: "Order completed",
          detail: `Table ${
            tables.find((t) => t._id === order.tableId)?.number || "-"
          } - Order #${order._id?.substring(0, 4)}`,
          time: new Date(order.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(order.updatedAt),
        });
      });

    // Payments (would come from payment records in a real system)
    recentActivities.push({
      id: "payment-1",
      type: "payment",
      title: "Payment received",
      detail: "Table 7 - $78.50",
      time: "10:25 AM",
      timestamp: new Date(),
    });

    // New customers
    tables
      .filter((table) => table.status === "occupied")
      .slice(0, 2)
      .forEach((table) => {
        recentActivities.push({
          id: `customer-${table._id}`,
          type: "new_customers",
          title: "New customers seated",
          detail: `Table ${table.number} - Party of ${table.guestCount || "?"}`,
          time: "10:15 AM",
          timestamp: new Date(),
        });
      });

    // Sort by timestamp
    recentActivities.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    setActivities(recentActivities.slice(0, 4));
  }, [orders, tables]);

  // Current orders for table display
  const currentOrders = orders
    .filter((order) => ["new", "in_progress", "done"].includes(order.status))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-4 bg-gray-100 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Active Tables</h3>
              <span className="text-primary text-lg font-semibold">
                {activeTables}
              </span>
            </div>
            <Progress value={activeTablesPercent} className="h-2.5 mb-2" />
            <p className="text-sm text-gray-500">
              {activeTables} of {totalTables} tables occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Open Orders</h3>
              <span className="text-warning text-lg font-semibold">
                {openOrders}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>New</span>
                <span className="font-medium">{newOrders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>In Progress</span>
                <span className="font-medium">{inProgressOrders}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Today's Sales</h3>
              <span className="text-success text-lg font-semibold">
                ${todaySales.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <div className="flex justify-between mb-1">
                <span>Target</span>
                <span>${targetSales.toFixed(2)}</span>
              </div>
              <Progress
                value={salesPercent}
                className="h-2.5 bg-gray-200"
                indicatorClassName="bg-success"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-medium">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 flex items-start">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{activity.title}</p>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600">{activity.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Orders Summary */}
      <Card>
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium">Current Orders</h3>
          <a
            href="#"
            className="text-primary text-sm hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/orders");
            }}
          >
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => {
                const tableNumber =
                  tables.find((t) => t._id === order.tableId)?.number || "-";
                const itemCount = order.items.length;
                const orderTime = new Date(order.createdAt).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                );
                const total = order.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );

                return (
                  <TableRow key={order._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      #{order._id?.substring(0, 4)}
                    </TableCell>
                    <TableCell>Table {tableNumber}</TableCell>
                    <TableCell>{itemCount} items</TableCell>
                    <TableCell>
                      {order.status === "new" && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                      {order.status === "in_progress" && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      )}
                      {order.status === "done" && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{orderTime}</TableCell>
                    <TableCell>${total.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
              {currentOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-gray-500"
                  >
                    No current orders
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
