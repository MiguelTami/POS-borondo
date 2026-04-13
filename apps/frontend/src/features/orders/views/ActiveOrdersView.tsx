import { useState, useEffect, Fragment } from "react";
import {
  Lock,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useShiftStore } from "../../shifts/slices/shiftStore";
import { shiftService } from "../../shifts/services/shift.service";
import { paymentService } from "../../payments/services/payment.service";
import {
  orderService,
  type Order,
  type SubOrder,
} from "../services/order.service";

export function ActiveOrdersView() {
  const { activeShift, setActiveShift, isLoading, setLoading } =
    useShiftStore();
  const [filter, setFilter] = useState("All Orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [openingShift, setOpeningShift] = useState(false);

  // Payment Modal State
  const [paymentSubOrder, setPaymentSubOrder] = useState<SubOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "CARD" | "MOBILE_PAYMENT"
  >("CASH");
  const [processingPayment, setProcessingPayment] = useState(false);

  // View SubOrder Mode State
  const [viewSubOrder, setViewSubOrder] = useState<SubOrder | null>(null);

  useEffect(() => {
    const initShift = async () => {
      try {
        if (!activeShift) {
          const currentShift = await shiftService.getActiveShift();
          setActiveShift(currentShift);
        }
      } catch (err) {
        console.error("Error validando turno", err);
      } finally {
        setLoading(false);
      }
    };
    initShift();
  }, []);

  useEffect(() => {
    if (activeShift) {
      fetchOrders();
    }
  }, [activeShift]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getOrders(activeShift?.id);
      console.log("Raw orders from API:", JSON.stringify(data, null, 2));
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

  const [confirmCancelOrder, setConfirmCancelOrder] = useState<number | null>(
    null,
  );

  const handleCancelOrder = async (orderId: number) => {
    try {
      await orderService.cancelOrder(orderId);
      setConfirmCancelOrder(null);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    }
  };

  const [confirmPayOrder, setConfirmPayOrder] = useState<number | null>(null);

  const handlePayOrder = async (orderId: number) => {
    try {
      await orderService.payOrder(orderId);
      setConfirmPayOrder(null);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to pay order");
    }
  };

  const calculateSubOrderTotal = (sub: SubOrder) => {
    if (!sub.orderItems || sub.orderItems.length === 0) return 0;
    return sub.orderItems.reduce(
      (acc, item) => acc + Number(item.totalPriceSnapshot || 0),
      0,
    );
  };

  const handleProcessSubOrderPayment = async () => {
    if (!paymentSubOrder || !activeShift) return;

    try {
      setProcessingPayment(true);
      await paymentService.createPayment({
        subOrderId: paymentSubOrder.id,
        shiftId: activeShift.id,
        method: paymentMethod,
      });
      // Optionally could mark subOrder as paid directly on front or refetch
      await fetchOrders();
      setPaymentSubOrder(null);
      setPaymentMethod("CASH");
    } catch (error: any) {
      console.error("Payment error", error);
      alert(error?.response?.data?.error || "Error al procesar el pago");
    } finally {
      setProcessingPayment(false);
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
  // Nota: validamos con .toString() por si acaso hay un desajuste de tipos (string vs number)
  const shiftOrders = orders.filter(
    (o) => o.shiftId?.toString() === activeShift?.id?.toString(),
  );

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
                No hay órdenes pendientes en este turno. (Si crees que es un
                error, verifica la terminal/consola F12).
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isPaid = order.status === "PAID";
                // Calcular el total global sumando los subTotales de las orderItems (totalPriceSnapshot)
                const calculatedGlobalTotal =
                  order.subOrders?.reduce(
                    (acc, sub) => acc + calculateSubOrderTotal(sub),
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
                            onClick={() => setConfirmCancelOrder(order.id)}
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
                        const isPayable =
                          !subPaid && sub.status === "SENT_TO_CASHIER";
                        const subTotalCalc = calculateSubOrderTotal(sub);

                        return (
                          <div
                            key={sub.id}
                            className={`rounded-xl p-4 flex items-center justify-between border transition-colors cursor-pointer ${
                              isPayable
                                ? "bg-white hover:bg-gray-50 border-gray-200"
                                : "bg-[#F8F9FB] border-transparent"
                            }`}
                            onClick={() => setViewSubOrder(sub)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${subPaid ? "bg-blue-500" : "bg-orange-500"}`}
                              />
                              <div>
                                <h4 className="text-sm font-bold text-gray-900 leading-snug">
                                  {sub.label || `Sub-orden #${sub.id}`}
                                </h4>
                                <span className="text-[13px] text-gray-500 font-semibold block mt-1">
                                  Total:{" "}
                                  <span className="text-gray-900">
                                    ${subTotalCalc.toFixed(0)}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div
                                  className={`text-[10px] font-bold tracking-wider uppercase mt-1 ${!subPaid ? "text-orange-600" : "text-blue-600"}`}
                                >
                                  {sub.status === "SENT_TO_CASHIER"
                                    ? "POR COBRAR"
                                    : sub.status}
                                </div>
                              </div>
                              {!subPaid ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    isPayable && setPaymentSubOrder(sub);
                                  }}
                                  className="px-3 py-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 text-xs font-bold rounded-lg shadow-sm"
                                >
                                  Pagar Item
                                </button>
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
                          onClick={() => setConfirmPayOrder(order.id)}
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
      {viewSubOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl flex flex-col p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Detalle de Sub-orden
              </h2>
              <button
                onClick={() => setViewSubOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-3">
                Items Incluidos
              </div>
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-64 overflow-y-auto">
                {viewSubOrder.orderItems?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start text-sm"
                  >
                    <div className="flex-1 pr-4">
                      <span className="font-bold text-gray-800">
                        {item.quantity}x
                      </span>{" "}
                      <span className="text-gray-600">
                        {item.product?.name || "Producto N/A"}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${Number(item.totalPriceSnapshot).toFixed(0)}
                    </div>
                  </div>
                ))}
                {(!viewSubOrder.orderItems ||
                  viewSubOrder.orderItems.length === 0) && (
                  <div className="text-gray-500 italic text-sm">
                    Sin items
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center py-4 mt-auto border-t border-gray-100">
              <span className="text-gray-500 font-bold">Total Reportado</span>
              <span className="text-3xl font-black text-gray-900">
                ${calculateSubOrderTotal(viewSubOrder).toFixed(0)}
              </span>
            </div>

            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setViewSubOrder(null)}
                className="w-full h-12 font-semibold"
              >
                Cerrar Pantalla
              </Button>
            </div>
          </div>
        </div>
      )}
      {paymentSubOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          {(() => {
            console.log(
              "PAYMENT MODAL SUBORDER:",
              JSON.stringify(paymentSubOrder, null, 2),
            );
            return null;
          })()}
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                Confirmar Pago
              </h2>
              <button
                onClick={() => setPaymentSubOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-3">
                  Detalle de Consumo
                </div>
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-48 overflow-y-auto">
                  {paymentSubOrder.orderItems?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="flex-1 pr-4">
                        <span className="font-bold text-gray-800">
                          {item.quantity}x
                        </span>{" "}
                        <span className="text-gray-600">
                          {item.product?.name || "Producto N/A"}
                        </span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        ${Number(item.totalPriceSnapshot).toFixed(0)}
                      </div>
                    </div>
                  ))}
                  {(!paymentSubOrder.orderItems ||
                    paymentSubOrder.orderItems.length === 0) && (
                    <div className="text-gray-500 italic text-sm">
                      No items found
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-b border-gray-100 mb-6">
                <span className="text-gray-500 font-bold">Total a Cobrar</span>
                <span className="text-3xl font-black text-gray-900">
                  ${calculateSubOrderTotal(paymentSubOrder).toFixed(0)}
                </span>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-3">
                  Método de Pago
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod("CASH")}
                    className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === "CASH"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Banknote className="w-6 h-6" />
                    <span className="text-[10px] font-bold">EFECTIVO</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("CARD")}
                    className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === "CARD"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-[10px] font-bold">TARJETA</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("MOBILE_PAYMENT")}
                    className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === "MOBILE_PAYMENT"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-[10px] font-bold">MÓVIL</span>
                  </button>
                </div>
              </div>

              <Button
                onClick={handleProcessSubOrderPayment}
                disabled={processingPayment}
                className="w-full h-14 text-lg font-bold rounded-xl shadow-sm bg-blue-600 hover:bg-blue-700"
              >
                {processingPayment ? "Procesando Pago..." : "Confirmar Pago"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmPayOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl flex flex-col p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              ¿Confirmar Pago de Orden?
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Estás a punto de marcar toda la orden #{confirmPayOrder} como
              pagada.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setConfirmPayOrder(null)}
                className="w-full max-w-[150px] h-12 font-semibold"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handlePayOrder(confirmPayOrder)}
                className="w-full max-w-[200px] h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Confirmar Pago
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmCancelOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl flex flex-col p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              ¿Cancelar Orden?
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Estás a punto de cancelar toda la orden #{confirmCancelOrder}.
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setConfirmCancelOrder(null)}
                className="w-full max-w-[150px] h-12 font-semibold"
              >
                Regresar
              </Button>
              <Button
                onClick={() => handleCancelOrder(confirmCancelOrder)}
                className="w-full max-w-[200px] h-12 bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Cancelar Orden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
