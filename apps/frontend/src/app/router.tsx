import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginView } from "../features/auth/views/LoginView";
import { ProtectedRoute } from "../layouts/ProtectedRoute";
import { PosLayout } from "../layouts/PosLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { useAuthStore } from "../features/auth/slices/authStore";

// Un AuthRedirect base para que la raÃ­z (/) mande a donde deba
const RootRedirect = () => {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
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
      <ProtectedRoute rolesAllowed={["ADMIN", "CASHIER", "WAITER"]} redirectPath="/login">
        <PosLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "tables",
        element: <div className="text-2xl font-bold flex justify-center items-center h-full">Mapas de Mesas PrÃ³ximamente...</div>,
      },
      {
        path: "order/:tableId",
        element: <div className="text-2xl font-bold flex justify-center items-center h-full">Terminal POS PrÃ³ximamente...</div>,
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
        element: <div className="text-2xl font-bold">Dashboard PrÃ³ximamente...</div>,
      },
      {
        path: "products",
        element: <div className="text-2xl font-bold">Productos PrÃ³ximamente...</div>,
      },
      {
        path: "inventory",
        element: <div className="text-2xl font-bold">Inventario PrÃ³ximamente...</div>,
      },
      {
        path: "tables",
        element: <div className="text-2xl font-bold">Mesas PrÃ³ximamente...</div>,
      },
      {
        path: "users",
        element: <div className="text-2xl font-bold">Usuarios PrÃ³ximamente...</div>,
      },
      {
        path: "settings",
        element: <div className="text-2xl font-bold">ConfiguraciÃ³n PrÃ³ximamente...</div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
