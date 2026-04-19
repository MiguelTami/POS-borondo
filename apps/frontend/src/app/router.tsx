import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginView } from "../features/auth/views/LoginView";
import { OpenShiftView } from "../features/shifts/views/OpenShiftView";
import { ProtectedRoute } from "../layouts/ProtectedRoute";
import { PosLayout } from "../layouts/PosLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { useAuthStore } from "../features/auth/slices/authStore";
import { ShiftGuard } from "../features/shifts/layouts/ShiftGuard";
import { ActiveOrdersView } from "../features/orders/views/ActiveOrdersView";
import { WaiterOrdersView } from "../features/orders/views/WaiterOrdersView";
import { InventoryView } from "../features/inventory/views/InventoryView";
import { ProductsView } from "../features/products/views/ProductsView";
import { StatisticsView } from "../features/statistics/views/StatisticsView";
import { UsersView } from "../features/users/views/UsersView";
import { TablesView } from "../features/tables/views/TablesView";

const RootRedirect = () => {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN" || user.role === "CASHIER")
    return <Navigate to="/pos/orders" replace />;
  return <Navigate to="/pos/tables" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/pos",
    element: (
      <ProtectedRoute
        rolesAllowed={["ADMIN", "CASHIER", "WAITER"]}
        redirectPath="/login"
      >
        <PosLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "open-shift",
        element: <OpenShiftView />,
      },
      {
        path: "orders",
        element: <ActiveOrdersView />,
      },
      {
        element: <ShiftGuard />,
        children: [
          {
            path: "tables",
            element: <WaiterOrdersView />,
          },
          {
            path: "order/:tableId",
            element: (
              <div className="text-2xl font-bold flex justify-center items-center h-full">
                Terminal POS Próximamente...
              </div>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute rolesAllowed={["ADMIN"]} redirectPath="/pos/tables">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <StatisticsView />,
      },
      {
        path: "products",
        element: <ProductsView />,
      },
      {
        path: "inventory",
        element: <InventoryView />,
      },
      {
        path: "tables",
        element: <TablesView />,
      },
      {
        path: "users",
        element: <UsersView />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
