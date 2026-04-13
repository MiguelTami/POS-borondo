import { useState, useEffect } from "react";
import { Plus, Search, Coffee } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { orderService, type Order } from "../services/order.service";
import { CreateOrderModal } from "../components/CreateOrderModal";
import { useAuthStore } from "../../auth/slices/authStore";

export function WaiterOrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      // Optional: Filter orders created by this waiter if needed. Or just display all.
      // Currently displaying all orders
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingOrders = orders.filter(
    (o) => o.status !== "PAID" && o.status !== "CANCELLED",
  );

  return (
    <div className="flex flex-col h-full bg-[#f8f9fb] p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Mis Órdenes
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Gestión de pedidos para la jornada actual.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg font-bold"
        >
          <Plus className="w-6 h-6" />
          Nueva Orden
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1 text-gray-400 font-medium">
          Cargando órdenes...
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Coffee className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No tienes órdenes activas
          </h2>
          <p className="text-gray-500 text-center max-w-sm mb-8">
            Cuando crees un pedido y lo envíes al cajero, aparecerá en esta
            pantalla hasta que sea procesado.
          </p>
          <Button
            onClick={() => setCreateModalOpen(true)}
            variant="outline"
            className="px-8 py-6 border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 font-bold rounded-2xl transition-colors"
          >
            Iniciar Nueva Orden
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pendingOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-xl flex flex-col items-center justify-center font-black">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                    Mesa
                  </span>
                  <span className="text-xl leading-none">
                    {order.tableId || "?"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">
                    Orden
                  </span>
                  <span className="text-lg font-black text-gray-800">
                    #{order.id}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 my-4">
                {order.subOrders?.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <div className="text-sm font-bold text-gray-700">
                      {sub.label || "Sin Etiqueta"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>
                        {sub.status === "SENT_TO_CASHIER"
                          ? "Por Cobrar"
                          : sub.status}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${Number(sub.subTotal).toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-end mt-auto">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Estado
                </span>
                <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateOrderModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
