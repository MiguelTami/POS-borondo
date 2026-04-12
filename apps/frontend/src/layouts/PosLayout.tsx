import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "../features/auth/slices/authStore";
import { useShiftStore } from "../features/shifts/slices/shiftStore";
import { CloseShiftModal } from "../features/shifts/components/CloseShiftModal";
import { useState } from "react";

export function PosLayout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { activeShift } = useShiftStore();
  const [isCloseModalOpen, setCloseModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isCashier = user?.role === "CASHIER" || user?.role === "ADMIN";
  const isWaiter = user?.role === "WAITER" || user?.role === "ADMIN";

  return (
    <div className="min-w-full min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow z-10 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 w-full">
            <div className="flex flex-1 items-center">
              <div className="flex-shrink-0 flex items-center pr-6">
                <span className="text-2xl font-black text-blue-600 tracking-tight">
                  KPRICHOS<span className="text-gray-300">POS</span>
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 h-full">
                {isCashier && (
                  <Link
                    to="/pos/orders"
                    className={`${
                      location.pathname.includes("/orders")
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 border-b-2 text-[15px] font-semibold transition-colors duration-200 tracking-wide`}
                  >
                    Órdenes Activas
                  </Link>
                )}
                {isWaiter && (
                  <Link
                    to="/pos/tables"
                    className={`${
                      location.pathname.includes("/tables")
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 border-b-2 text-[15px] font-semibold transition-colors duration-200 tracking-wide`}
                  >
                    Mesas / Toma de Pedidos
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              {isCashier && activeShift && (
                <button
                  onClick={() => setCloseModalOpen(true)}
                  className="text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 mt-[-2px] rounded-xl transition-colors shadow-sm border border-red-100 flex items-center justify-center"
                >
                  Cerrar Turno Actual
                </button>
              )}
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200 h-10">
                <span className="text-sm font-bold text-gray-700 flex items-center gap-2 bg-gray-50 py-1.5 px-3 rounded-full">
                  <UserIcon className="w-4 h-4 text-blue-500" />{" "}
                  {user?.name || "Usuario"} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[#F6F7F9] overflow-hidden flex flex-col">
        <Outlet />
      </main>

      {isCloseModalOpen && (
        <CloseShiftModal onClose={() => setCloseModalOpen(false)} />
      )}
    </div>
  );
}
