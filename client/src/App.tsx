import { Switch, Route, Router } from "wouter";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Tables from "./pages/tables/Tables";
import Orders from "./pages/orders/Orders";
import Kitchen from "./pages/kitchen/Kitchen";
import Payments from "./pages/payments/Payments";
import MenuManagement from "./pages/menu/MenuManagement";
import StaffManagement from "./pages/staff/StaffManagement";
import Reports from "./pages/reports/Reports";
import SystemAdmin from "./pages/system/SystemAdmin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

/**
 * @function App
 * @description The main component of the application.
 * It sets up the Redux store, React Query, routing, and UI providers.
 * It also defines the routes for different pages and protects them based on user roles.
 * @returns {JSX.Element} - The main application element.
 */
function App() {
  // Set up light mode by default
  useEffect(() => {
    document.body.classList.remove("dark");
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <Switch>
              {/* Auth Routes */}
              <Route path="/" component={Login} />
              <Route path="/admin" component={AdminLogin} />

              {/* Protected Routes with Layout */}
              <Route path="/dashboard">
                <ProtectedRoute roles={["waiter", "manager", "owner", "admin"]}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              </Route>

              <Route path="/tables">
                <ProtectedRoute
                  roles={["host", "waiter", "manager", "owner", "admin"]}
                >
                  <Layout>
                    <Tables />
                  </Layout>
                </ProtectedRoute>
              </Route>

              <Route path="/orders">
                <ProtectedRoute roles={["waiter", "manager", "owner", "admin"]}>
                  <Layout>
                    <Orders />
                  </Layout>
                </ProtectedRoute>
              </Route>

              <Route path="/kitchen">
                <ProtectedRoute roles={["chef", "admin"]}>
                  <Layout>
                    <Kitchen />
                  </Layout>
                </ProtectedRoute>
              </Route>

              <Route path="/payments">
                <ProtectedRoute roles={["waiter", "manager", "owner", "admin"]}>
                  <Layout>
                    <Payments />
                  </Layout>
                </ProtectedRoute>
              </Route>

              <Route path="/menu">
                <ProtectedRoute roles={["manager", "owner", "admin"]}>
                  <Layout>
                    <MenuManagement />
                  </Layout>
                </ProtectedRoute>
              </Route>

              <Route path="/staff">
                <ProtectedRoute roles={["manager", "owner", "admin"]}>
                  <Layout>
                    <StaffManagement />
                  </Layout>
                </ProtectedRoute>
              </Route>

              <Route path="/reports">
                <ProtectedRoute roles={["owner", "admin"]}>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              </Route>

              <Route path="/system">
                <ProtectedRoute roles={["admin"]}>
                  <Layout>
                    <SystemAdmin />
                  </Layout>
                </ProtectedRoute>
              </Route>

              {/* Fallback to 404 */}
              <Route component={NotFound} />
            </Switch>
          </Router>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
