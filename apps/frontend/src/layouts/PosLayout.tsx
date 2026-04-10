import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "../features/auth/slices/authStore";

export function PosLayout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold text-blue-600">POS</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <span className="border-blue-500 text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium">
                    Mesas
                    </span>
                    <span className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 border-b-2 text-sm font-medium">
                    Turno
                    </span>
                </div>
                </div>
                <div className="flex items-center">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                    <UserIcon className="w-4 h-4" /> {user?.name || 'Usuario'}
                    </span>
                    <button
                    onClick={handleLogout}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500"
                    aria-label="Cerrar SesiÃ³n"
                    >
                    <LogOut className="w-5 h-5" />
                    </button>
                </div>
                </div>
            </div>
            </div>
        </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-gray-50 p-6 overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
