import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  LogOut,
  Home,
  Package,
  Users,
  Settings,
  Tag,
  Table as TableIcon,
} from "lucide-react";
import { useAuthStore } from "../features/auth/slices/authStore";

export function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Estadísticas", to: "/admin/dashboard", icon: Home },
    { name: "Productos", to: "/admin/products", icon: Tag },
    { name: "Inventario", to: "/admin/inventory", icon: Package },
    { name: "Mesas", to: "/admin/tables", icon: TableIcon },
    { name: "Usuarios", to: "/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar para Admin */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex min-h-screen shadow-lg">
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <span className="text-xl font-bold tracking-wider text-white px-6">
            KPRICHOS Admin
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  // Si estÃ¡ activa bg-blue-600, si no opacidad
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="rounded-full bg-slate-700 p-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full justify-center items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-slate-50 flex flex-col h-screen overflow-hidden">
        {/* Aqui el header mobile y otros breadcrumbs si deseas */}
        <header className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex text-white items-center justify-between">
          <span className="font-bold">KPRICHOS Admin</span>
          <button onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
