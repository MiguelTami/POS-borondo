import { useState, useEffect } from "react";
import {
  Lock,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useShiftStore } from "../../shifts/slices/shiftStore";
import { shiftService } from "../../shifts/services/shift.service";
import { orderService, type Order } from "../services/order.service";

export function ActiveOrdersView() {
  const { activeShift, setActiveShift, isLoading } = useShiftStore();
  const [filter, setFilter] = useState("All Orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [openingShift, setOpeningShift] = useState(false);

  useEffect(() => {
    if (activeShift) {
      fetchOrders();
    }
  }, [activeShift]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getOrders(activeShift?.id);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleOpenShift = async () => {
    try {
      setOpeningShift(true);
      const newShift = await shiftService.openShift();
      setActiveShift(newShift);
    } catch (err: any) {
      console.error("Error abriendo el turno:", err);
      alert(err?.response?.data?.error || "Error al abrir la caja");
    } finally {
      setOpeningShift(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderService.cancelOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    }
  };

  const handlePayOrder = async (orderId: number) => {
    try {
      await orderService.payOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to pay order");
    }
  };

  // VISTA 1: CAJA CERRADA
  if (!activeShift && !isLoading) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-[#F6F7F9]">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Caja Cerrada
          </h1>
          <p className="mb-8 text-sm text-gray-500 leading-relaxed">
            Actualmente no hay ningún turno activo. Debes abrir un nuevo turno
            en caja para empezar a ver, gestionar y cobrar órdenes.
          </p>
          <Button
            onClick={handleOpenShift}
            disabled={openingShift}
            className="w-full h-14 text-md font-bold rounded-xl shadow-sm bg-blue-600 hover:bg-blue-700"
          >
            {openingShift ? "Abriendo Turno..." : "Abrir Nuevo Turno"}
          </Button>
        </div>
      </div>
    );
  }

  // VISTA 2: CAJA ABIERTA (DASHBOARD ORDENES)
  // Filtrar SOLAMENTE por el turno activo
  const shiftOrders = orders.filter((o) => o.shiftId === activeShift?.id);

  const filteredOrders = shiftOrders
    .map((order) => {
      // Filtramos las subórdenes para que el cajero solo vea las pertinentes
      const visibleSubOrders = (order.subOrders || []).filter((sub) => {
        if (filter === "Pending") return sub.status === "SENT_TO_CASHIER";
        if (filter === "Paid") return sub.status === "PAID";
        // All Orders: mostrar ambas
        return sub.status === "SENT_TO_CASHIER" || sub.status === "PAID";
      });

      return { ...order, subOrders: visibleSubOrders };
    })
    .filter((order) => order.subOrders.length > 0); // Mostrar la órden solo si tiene subórdenes válidas para el cajero

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F6F7F9]">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Órdenes Activas
            </h1>
            <p className="text-gray-500 text-sm">
              Manejando actualmente{" "}
              <span className="font-semibold text-blue-600">
                {filteredOrders.length} documentos
              </span>{" "}
              en el sistema.
            </p>
          </div>
          <div className="inline-flex items-center bg-white p-1 rounded-full shadow-sm">
            {["All Orders", "Pending", "Paid"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  filter === tab
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loadingOrders ? (
          <div className="flex justify-center p-12 text-gray-500">
            Cargando órdenes...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-400">
                No hay órdenes para mostrar con el filtro actual.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isPaid = order.status === "PAID";
                // Calcular el total global sumando los subTotales (o usando order.totalAmount si viene correctamente del backend)
                // Por requerimiento sumamos explícitamente los subtotales:
                const calculatedGlobalTotal =
                  order.subOrders?.reduce(
                    (acc, sub) => acc + Number(sub.subTotal || 0),
                    0,
                  ) || 0;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-xl border border-gray-200 flex flex-col items-center justify-center bg-gray-50/50">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            Mesa
                          </span>
                          <span className="text-xl font-bold text-gray-800 leading-tight">
                            {order.tableId || "T/A"}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Orden #{order.id}
                          </h3>
                          <div className="flex items-center text-sm mt-1 font-semibold uppercase tracking-wider text-gray-500">
                            <span
                              className={`px-2 py-1 rounded text-[10px] ${isPaid ? "bg-blue-100 text-blue-700" : order.status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {!isPaid && order.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-xs text-red-500 hover:bg-red-50 py-1 rounded px-2 font-semibold transition-colors mr-2"
                          >
                            CANCELAR
                          </button>
                        )}
                        <button className="text-gray-400 hover:text-gray-900 transition-colors p-2">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Suborders list */}
                    <div className="flex-1 space-y-3 mt-2">
                      {order.subOrders?.map((sub) => {
                        const subPaid = sub.status === "PAID";

                        return (
                          <div
                            key={sub.id}
                            className="bg-[#F8F9FB] rounded-xl p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${subPaid ? "bg-blue-500" : "bg-red-500"}`}
                              />
                              <div>
                                <h4 className="text-sm font-bold text-gray-900 leading-snug">
                                  {sub.label || `Sub-orden #${sub.id}`}
                                </h4>
                                <span className="text-[13px] text-gray-500 font-semibold block mt-1">
                                  Subtotal:{" "}
                                  <span className="text-gray-900">
                                    ${Number(sub.subTotal).toFixed(0)}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div
                                  className={`text-[10px] font-bold tracking-wider uppercase mt-1 ${!subPaid ? "text-red-500" : "text-blue-600"}`}
                                >
                                  {sub.status}
                                </div>
                              </div>
                              {!subPaid ? (
                                <div className="px-3 py-1 bg-white border border-gray-200 text-gray-400 text-xs font-bold rounded-lg shadow-sm">
                                  Pendiente
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {(!order.subOrders || order.subOrders.length === 0) && (
                        <div className="text-gray-400 text-sm italic">
                          Sin items pendientes...
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 flex items-end justify-between border-t border-gray-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                          Total Global
                        </span>
                        <div className="text-3xl font-bold text-gray-900 mt-1">
                          ${calculatedGlobalTotal.toFixed(0)}
                        </div>
                      </div>
                      {!isPaid && order.status !== "CANCELLED" && (
                        <button
                          onClick={() => handlePayOrder(order.id)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm"
                        >
                          Pagar Orden
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
