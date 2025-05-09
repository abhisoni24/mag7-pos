import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItemFrequency,
  fetchRevenueData,
  fetchOrderStatistics,
  setDateRange,
} from "../../redux/reportSlice";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  generateRevenueReport,
  generateItemFrequencyReport,
  generateOrderStatisticsReport,
} from "../../lib/pdf";
import { useToast } from "@/hooks/use-toast";
import {
  FileDown,
  DollarSign,
  ShoppingBasket,
  PieChart as PieChartIcon,
} from "lucide-react";

/**
 * @constant CHART_COLORS
 * @description An array of colors used for charts in the reports.
 */
const CHART_COLORS = [
  "#1976D2",
  "#FF5722",
  "#4CAF50",
  "#9C27B0",
  "#FF9800",
  "#607D8B",
];

/**
 * @component Reports
 * @description A page component that displays various reports and analytics related to restaurant operations.
 * It includes revenue reports, item frequency reports, and order statistics, each displayed in its own tab.
 * @returns {JSX.Element} - The reports page element.
 */
const Reports = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    itemFrequency,
    revenueData,
    orderStatistics,
    startDate,
    endDate,
    loading,
  } = useSelector((state: RootState) => state.reports);
  const [activeTab, setActiveTab] = useState("revenue");
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const { toast } = useToast();

  /**
   * @useEffect
   * @description Fetches report data based on the active tab and date range.
   */
  useEffect(() => {
    if (activeTab === "revenue") {
      dispatch(fetchRevenueData({ startDate, endDate }));
    } else if (activeTab === "items") {
      dispatch(fetchItemFrequency({ startDate, endDate }));
    } else if (activeTab === "orders") {
      dispatch(fetchOrderStatistics({ startDate, endDate }));
    }
  }, [dispatch, activeTab, startDate, endDate]);

  /**
   * @function handleApplyDateRange
   * @description Applies the selected date range to the reports.
   * It validates the date range and dispatches the setDateRange action to update the Redux store.
   */
  const handleApplyDateRange = () => {
    if (new Date(localEndDate) < new Date(localStartDate)) {
      toast({
        variant: "destructive",
        title: "Invalid date range",
        description: "End date must be after start date",
      });
      return;
    }

    dispatch(
      setDateRange({ startDate: localStartDate, endDate: localEndDate })
    );
  };

  /**
   * @function handleExportPDF
   * @description Exports the currently displayed report as a PDF file.
   * It generates the PDF document using the appropriate function based on the active tab and saves it with a descriptive filename.
   */
  const handleExportPDF = () => {
    let pdfDoc;
    let fileName;

    try {
      if (activeTab === "revenue" && revenueData) {
        pdfDoc = generateRevenueReport(
          new Date(startDate),
          new Date(endDate),
          revenueData
        );
        fileName = "revenue-report.pdf";
      } else if (activeTab === "items" && itemFrequency) {
        pdfDoc = generateItemFrequencyReport(
          new Date(startDate),
          new Date(endDate),
          itemFrequency
        );
        fileName = "item-frequency-report.pdf";
      } else if (activeTab === "orders" && orderStatistics) {
        pdfDoc = generateOrderStatisticsReport(
          new Date(startDate),
          new Date(endDate),
          orderStatistics
        );
        fileName = "order-statistics-report.pdf";
      } else {
        toast({
          variant: "destructive",
          title: "Export failed",
          description: "No data available to export",
        });
        return;
      }

      pdfDoc.save(fileName);

      toast({
        title: "Export successful",
        description: `Report has been exported as ${fileName}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "An error occurred while generating the PDF",
      });
    }
  };

  /**
   * @constant revenueChartData
   * @description Prepares data for the revenue chart, mapping daily revenue data to a format suitable for the chart component.
   */
  const revenueChartData = revenueData?.dailyRevenue
    ? Object.entries(revenueData.dailyRevenue).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: Number(amount.toFixed(2)),
      }))
    : [];

  /**
   * @constant paymentMethodChartData
   * @description Prepares data for the payment method pie chart, mapping revenue by payment method to a format suitable for the chart component.
   */
  const paymentMethodChartData = revenueData?.revenueByMethod
    ? Object.entries(revenueData.revenueByMethod).map(([method, amount]) => ({
        name: method.replace("_", " ").toUpperCase(),
        value: Number(amount.toFixed(2)),
      }))
    : [];

  /**
   * @constant itemFrequencyChartData
   * @description Prepares data for the item frequency chart, sorting items by order count and limiting the chart to the top 10 items.
   */
  const itemFrequencyChartData = itemFrequency
    ? [...itemFrequency]
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map((item) => ({
          name:
            item.name.length > 15
              ? item.name.substring(0, 12) + "..."
              : item.name,
          count: item.count,
        }))
    : [];

  /**
   * @function getCategory
   * @description Infers the category of a menu item based on its name.
   * @param {string} itemName - The name of the menu item.
   * @returns {string} - The inferred category of the menu item.
   */
  const getCategory = (itemName: string): string => {
    const name = itemName.toLowerCase();
    if (name.includes("nachos") || name.includes("appetizer"))
      return "Appetizers";
    if (
      name.includes("cake") ||
      name.includes("pie") ||
      name.includes("sundae")
    )
      return "Desserts";
    if (name.includes("soup") || name.includes("potion")) return "Soups";
    if (
      name.includes("coffee") ||
      name.includes("tea") ||
      name.includes("soda")
    )
      return "Drinks";
    return "Main Course";
  };

  /**
   * @constant itemsByCategory
   * @description Aggregates item frequency data by category.
   */
  const itemsByCategory = itemFrequency.reduce((acc, item) => {
    const category = getCategory(item.name);
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += item.count;
    return acc;
  }, {} as Record<string, number>);

  /**
   * @constant itemsByCategoryChartData
   * @description Prepares data for the items by category chart.
   */
  const itemsByCategoryChartData = Object.entries(itemsByCategory).map(
    ([category, count]) => ({
      name: category,
      count,
    })
  );

  /**
   * @constant ordersByDayChartData
   * @description Prepares data for the orders by day of week chart.
   */
  const ordersByDayChartData = orderStatistics?.ordersByDayOfWeek
    ? [
        { day: "Sun", count: orderStatistics.ordersByDayOfWeek["Sunday"] || 0 },
        { day: "Mon", count: orderStatistics.ordersByDayOfWeek["Monday"] || 0 },
        {
          day: "Tue",
          count: orderStatistics.ordersByDayOfWeek["Tuesday"] || 0,
        },
        {
          day: "Wed",
          count: orderStatistics.ordersByDayOfWeek["Wednesday"] || 0,
        },
        {
          day: "Thu",
          count: orderStatistics.ordersByDayOfWeek["Thursday"] || 0,
        },
        { day: "Fri", count: orderStatistics.ordersByDayOfWeek["Friday"] || 0 },
        {
          day: "Sat",
          count: orderStatistics.ordersByDayOfWeek["Saturday"] || 0,
        },
      ]
    : [];

  /**
   * @constant ordersByStatusChartData
   * @description Prepares data for the orders by status pie chart.
   */
  const ordersByStatusChartData = orderStatistics?.ordersByStatus
    ? Object.entries(orderStatistics.ordersByStatus).map(([status, count]) => ({
        name: status.replace("_", " ").toUpperCase(),
        value: count,
      }))
    : [];

  return (
    <div className="p-4 bg-gray-100">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            Reports & Analytics
          </CardTitle>
          <Button onClick={handleExportPDF}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="start-date" className="mb-1">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date" className="mb-1">
                End Date
              </Label>
              <Input
                id="end-date"
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleApplyDateRange}>Apply</Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="revenue" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-1">
                <ShoppingBasket className="h-4 w-4" />
                Item Frequency
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1">
                <PieChartIcon className="h-4 w-4" />
                Order Statistics
              </TabsTrigger>
            </TabsList>

            {/* Revenue Report */}
            <TabsContent value="revenue">
              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : revenueData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex flex-col items-center">
                          <p className="text-gray-500 text-sm mb-1">
                            Total Revenue
                          </p>
                          <h3 className="text-2xl font-bold">
                            ${revenueData.totalRevenue.toFixed(2)}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex flex-col items-center">
                          <p className="text-gray-500 text-sm mb-1">
                            Total Tips
                          </p>
                          <h3 className="text-2xl font-bold">
                            ${revenueData.totalTips.toFixed(2)}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex flex-col items-center">
                          <p className="text-gray-500 text-sm mb-1">
                            Average Daily Revenue
                          </p>
                          <h3 className="text-2xl font-bold">
                            $
                            {(
                              revenueData.totalRevenue /
                              Object.keys(revenueData.dailyRevenue).length
                            ).toFixed(2)}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [`$${value}`, "Revenue"]}
                              labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Legend />
                            <Bar
                              dataKey="amount"
                              name="Revenue"
                              fill="#1976D2"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={paymentMethodChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {paymentMethodChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`$${value}`, "Amount"]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex justify-center items-center h-60 text-gray-500">
                  No revenue data available for the selected date range
                </div>
              )}
            </TabsContent>

            {/* Item Frequency Report */}
            <TabsContent value="items">
              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : itemFrequency && itemFrequency.length > 0 ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top 10 Most Ordered Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={itemFrequencyChartData}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip
                              formatter={(value) => [`${value}`, "Orders"]}
                            />
                            <Legend />
                            <Bar
                              dataKey="count"
                              name="Order Count"
                              fill="#FF5722"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Item Order Frequency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-auto max-h-96">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order Count
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Percentage
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {itemFrequency
                              .sort((a, b) => b.count - a.count)
                              .map((item, index) => {
                                // Calculate percentage of total orders
                                const totalCount = itemFrequency.reduce(
                                  (sum, item) => sum + item.count,
                                  0
                                );
                                const percentage =
                                  totalCount > 0
                                    ? ((item.count / totalCount) * 100).toFixed(
                                        1
                                      )
                                    : "0";

                                return (
                                  <tr
                                    key={index}
                                    className={
                                      index % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50"
                                    }
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {item.count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <span className="mr-2">
                                          {percentage}%
                                        </span>
                                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                          <div
                                            className="bg-green-600 h-2.5 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Menu Item Popularity Chart */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Menu Item Popularity Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={itemFrequencyChartData}
                              dataKey="count"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              innerRadius={60}
                              paddingAngle={2}
                              fill="#8884d8"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {itemFrequencyChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name, props) => [
                                `${value} orders`,
                                props.payload.name,
                              ]}
                            />
                            <Legend
                              layout="horizontal"
                              verticalAlign="bottom"
                              align="center"
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Item Orders by Category */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Orders by Food Category</CardTitle>
                      <CardDescription>
                        Analysis of order distribution across menu categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={itemsByCategoryChartData}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                              >
                                {itemsByCategoryChartData.map(
                                  (entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={
                                        CHART_COLORS[
                                          (index + 3) % CHART_COLORS.length
                                        ]
                                      }
                                    />
                                  )
                                )}
                              </Pie>
                              <Tooltip
                                formatter={(value, name, props) => [
                                  `${value} orders`,
                                  props.payload.name,
                                ]}
                              />
                              <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={itemsByCategoryChartData}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis
                                dataKey="name"
                                type="category"
                                width={100}
                              />
                              <Tooltip
                                formatter={(value) => [`${value}`, "Orders"]}
                              />
                              <Legend />
                              <Bar
                                dataKey="count"
                                name="Order Count"
                                fill="#4CAF50"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex justify-center items-center h-60 text-gray-500">
                  No item frequency data available for the selected date range
                </div>
              )}
            </TabsContent>

            {/* Order Statistics Report */}
            <TabsContent value="orders">
              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : orderStatistics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex flex-col items-center">
                          <p className="text-gray-500 text-sm mb-1">
                            Total Orders
                          </p>
                          <h3 className="text-2xl font-bold">
                            {orderStatistics.totalOrders}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex flex-col items-center">
                          <p className="text-gray-500 text-sm mb-1">
                            Average Order Amount
                          </p>
                          <h3 className="text-2xl font-bold">
                            ${orderStatistics.averageOrderAmount.toFixed(2)}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex flex-col items-center">
                          <p className="text-gray-500 text-sm mb-1">
                            Orders per Day (Avg)
                          </p>
                          <h3 className="text-2xl font-bold">
                            {(orderStatistics.totalOrders / 7).toFixed(1)}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Orders by Day of Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ordersByDayChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="count"
                              name="Order Count"
                              fill="#9C27B0"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Orders by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={ordersByStatusChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {ordersByStatusChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex justify-center items-center h-60 text-gray-500">
                  No order statistics available for the selected date range
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
