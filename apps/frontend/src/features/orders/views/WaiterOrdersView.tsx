import { useState, useEffect } from "react";
import { Plus, Coffee, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  orderService,
  type Order,
  type SubOrder,
} from "../services/order.service";
import { CreateOrderModal } from "../components/CreateOrderModal";
import { useAuthStore } from "../../auth/slices/authStore";
import { tableService } from "@/features/tables/services/table.service";
import type { Table } from "@/features/tables/types/table.types";

export function WaiterOrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // For adding to existing order
  const [existingOrderTarget, setExistingOrderTarget] = useState<{
    id: number;
    tableId: number | null;
  } | null>(null);

  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    tableService.getTables().then(setTables);
  }, []);

  function getTableNumber(tableId: number | null) {
    return tables.find((t) => t.id === tableId)?.number || "N/A";
  }

  // For viewing suborder details
  const [viewSubOrder, setViewSubOrder] = useState<SubOrder | null>(null);

  useAuthStore(); // eslint-disable-next-line

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders(false);
    }, 5000); // Fetch orders every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const data = await orderService.getOrders();
      // Optional: Filter orders created by this waiter if needed. Or just display all.
      // Currently displaying all orders
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) setLoading(false);
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
                    {getTableNumber(order.tableId) || "?"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">
                    Orden #{order.id}
                  </span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">
                    $
                    {Number(
                      order.subOrders?.reduce((accSub, sub) => {
                        const subT =
                          sub.orderItems?.reduce(
                            (accItem, item) =>
                              accItem + Number(item.totalPriceSnapshot || 0),
                            0,
                          ) || 0;
                        return accSub + subT;
                      }, 0) || 0,
                    ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 my-4">
                {order.subOrders?.map((sub) => {
                  const calculatedSubTotal =
                    sub.orderItems?.reduce(
                      (accItem, item) =>
                        accItem + Number(item.totalPriceSnapshot || 0),
                      0,
                    ) || 0;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setViewSubOrder(sub)}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all"
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
                          $
                          {Number(calculatedSubTotal).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 0 },
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Estado
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
                {order.status !== "PAID" && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setExistingOrderTarget({
                        id: order.id,
                        tableId: order.tableId,
                      })
                    }
                    className="w-full mt-2 font-bold text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Agregar Suborden
                  </Button>
                )}
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

      {existingOrderTarget && (
        <CreateOrderModal
          existingOrderId={existingOrderTarget.id}
          existingTableId={existingOrderTarget.tableId || undefined}
          onClose={() => setExistingOrderTarget(null)}
          onSuccess={fetchOrders}
        />
      )}

      {viewSubOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-gray-900 border-b-2 border-blue-500 pb-1 inline-block">
                  Sub-orden: {viewSubOrder.label || "Sin Nombre"}
                </h3>
              </div>
              <button
                onClick={() => setViewSubOrder(null)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {viewSubOrder.orderItems?.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {viewSubOrder.orderItems.map((item: any) => (
                    <li
                      key={item.id}
                      className="py-3 px-4 flex flex-col bg-white rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">
                            {item.product?.name || "Ref."}
                          </span>
                          <span className="text-gray-500 text-xs font-medium mt-1">
                            Cantidad: {item.quantity}
                          </span>
                        </div>
                        <span className="font-black text-gray-900 bg-gray-50 px-2 py-1 rounded">
                          $
                          {Number(item.totalPriceSnapshot).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 0 },
                          )}
                        </span>
                      </div>

                      {item.notes && (
                        <div className="pl-4 mt-2 text-xs text-amber-600 font-medium italic relative flex items-center">
                          <span className="absolute left-1.5 top-0 bottom-0 w-px bg-amber-200"></span>
                          Nota: {item.notes}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-sm font-medium text-gray-400">
                  No hay items en esta sub-orden.
                </div>
              )}
            </div>

            <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-2xl">
              <span className="font-bold text-gray-400 text-sm">
                TOTAL SUBORDEN
              </span>
              <span className="font-black text-blue-600 text-2xl">
                $
                {Number(
                  viewSubOrder.orderItems?.reduce(
                    (acc: number, item: any) =>
                      acc + Number(item.totalPriceSnapshot || 0),
                    0,
                  ) || 0,
                ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
