import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/slices/authStore";

interface ProtectedRouteProps {
    rolesAllowed?: string[];
    redirectPath?: string;
    children?: ReactNode;
}

export function ProtectedRoute({ rolesAllowed, redirectPath = "/login", children }: ProtectedRouteProps) {
    const { user, token } = useAuthStore();

    if (!token || !user) {
        return <Navigate to={redirectPath} replace />;
    }

    if (rolesAllowed && !rolesAllowed.includes(user.role)) {
        // Si no tiene el rol (ej Cajero entrando admin) redirigir a un lugar seguro como POS tables.
        return <Navigate to="/pos/tables" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}

// Otro Utility Component para redirigir si ya estÃ¡ logueado al intentar ver el Login
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
    const { user, token } = useAuthStore();
    if (user && token) {
        return <Navigate to={user.role === "ADMIN" ? "/admin/dashboard" : "/pos/tables"} replace />;
    }
    return <>{children}</>;
}
