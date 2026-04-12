import { useEffect, useState } from "react";
import { useShiftStore } from "../slices/shiftStore";
import { shiftService } from "../services/shift.service";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../auth/slices/authStore";

export const ShiftGuard = () => {
  const { activeShift, setActiveShift, isLoading, setLoading } =
    useShiftStore();
  const { user } = useAuthStore();
  const [fetching, setFetching] = useState(isLoading);

  useEffect(() => {
    const checkActiveShift = async () => {
      try {
        if (!activeShift) {
          const shift = await shiftService.getActiveShift();
          if (shift) {
            setActiveShift(shift);
          }
        }
      } catch (error) {
        console.error("Error validando turno activo", error);
      } finally {
        setFetching(false);
      }
    };

    checkActiveShift();
  }, [activeShift, setActiveShift]);

  if (fetching) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        Verificando estado de la caja...
      </div>
    );
  }

  if (!activeShift) {
    if (user?.role === "WAITER") {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold text-gray-800">Caja Cerrada</h2>
          <p className="mt-2 text-gray-500 text-center">
            Un Cajero o Administrador debe iniciar el turno en el sistema.
          </p>
        </div>
      );
    }
    // Redirect to shift open view for Cashier / Admin
    return <Navigate to="/pos/open-shift" replace />;
  }

  // If shift exists, render child routes normally
  return <Outlet />;
};
