import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import api from "../../../services/api";
import { statisticsService } from "../services/statistics.service";
import { ChevronDown, ChevronRight, FileText, ReceiptText } from "lucide-react";
import type {
  ShiftOrdersResponse,
  ShiftOrderData,
  ShiftSubOrderData,
} from "../types/statistics.types";

interface Shift {
  id: number;
  openedAt: string;
  closedAt: string | null;
  openedBy: { name: string };
}

export function ShiftOrdersView() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShiftId, setSelectedShiftId] = useState<number | "">("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [shiftData, setShiftData] = useState<ShiftOrdersResponse | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ShiftOrderData | null>(
    null,
  );
  const [selectedSubOrder, setSelectedSubOrder] =
    useState<ShiftSubOrderData | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchShifts();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedShiftId) {
      loadShiftData(Number(selectedShiftId));
      setExpandedOrders([]); // Reset expanded when changing shift
    } else {
      setShiftData(null);
    }
  }, [selectedShiftId]);

  const fetchShifts = async () => {
    try {
      const res = await api.get<Shift[]>("/shifts");
      setShifts(res.data);
      // Select the latest shift by default (assuming sorted desc)
      if (res.data.length > 0 && selectedShiftId === "") {
        setSelectedShiftId(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadShiftData = async (shiftId: number) => {
    try {
      const data = await statisticsService.getShiftOrders(shiftId);
      setShiftData(data);
    } catch (e) {
      console.error(e);
      setShiftData(null);
    }
  };

  const toggleOrderExpand = (orderId: number) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders((prev) => prev.filter((id) => id !== orderId));
    } else {
      setExpandedOrders((prev) => [...prev, orderId]);
    }
  };

  // Helper to get formatted select text
  const selectedShiftLabel = selectedShiftId
    ? (() => {
        const s = shifts.find((sh) => sh.id === selectedShiftId);
        if (!s) return "Turno Desconocido";
        return `Turno #${s.id} - ${format(new Date(s.openedAt), "dd/MM/yyyy HH:mm")} ${s.closedAt ? "(Cerrado)" : "(Abierto)"}`;
      })()
    : "-- Seleccionar un turno --";

  // Common styles for modals
  const ModalContainer = ({
    onClose,
    title,
    children,
    totalLabel,
    totalValue,
  }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 font-bold text-xl h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">{children}</div>

        <div className="p-6 border-t bg-gray-50 flex justify-between items-center rounded-b-xl shrink-0">
          <span className="text-lg font-medium text-gray-700">
            {totalLabel}
          </span>
          <span className="text-2xl font-bold text-gray-900">
            ${totalValue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Subórdenes y órdenes por Turno</h2>
        <p className="text-sm text-gray-500">
          Maneja y analiza las subórdenes dentro de cada orden registrada en los
          turnos.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6 relative" ref={dropdownRef}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Turno Seleccionado
          </label>
          <div
            className="w-full md:w-1/2 border border-gray-300 flex justify-between items-center focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="font-medium text-gray-700">
              {selectedShiftLabel}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute z-20 mt-2 w-full md:w-1/2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden py-1 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
              {shifts.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm text-center">
                  Cargando turnos...
                </div>
              ) : (
                shifts.map((s) => (
                  <div
                    key={s.id}
                    className={`px-4 py-3 cursor-pointer text-sm transition-colors border-l-2 ${selectedShiftId === s.id ? "bg-blue-50 border-blue-500 text-blue-700 font-medium" : "border-transparent hover:bg-gray-50 text-gray-700"}`}
                    onClick={() => {
                      setSelectedShiftId(s.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Turno #{s.id} -{" "}
                    {format(new Date(s.openedAt), "dd/MM/yyyy HH:mm")}
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${s.closedAt ? "bg-gray-200 text-gray-600" : "bg-green-100 text-green-700"}`}
                    >
                      {s.closedAt ? "Cerrado" : "Abierto"}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {shiftData && (
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {shiftData.orders.length > 0 ? (
              <div className="w-full text-left">
                <div className="grid grid-cols-12 bg-gray-50 text-gray-500 text-sm font-semibold border-b">
                  <div className="col-span-1 p-4"></div>
                  <div className="col-span-2 p-4"># Orden</div>
                  <div className="col-span-2 p-4">Mesero</div>
                  <div className="col-span-2 p-4">Mesa</div>
                  <div className="col-span-2 p-4">Estado</div>
                  <div className="col-span-1 p-4">Total</div>
                  <div className="col-span-2 p-4 text-right">Acción</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {shiftData.orders.map((o) => (
                    <div key={o.id} className="flex flex-col">
                      <div
                        className={`grid grid-cols-12 items-center cursor-pointer transition-colors ${expandedOrders.includes(o.id) ? "bg-blue-50/30" : "hover:bg-gray-50"}`}
                        onClick={() => toggleOrderExpand(o.id)}
                      >
                        <div className="col-span-1 p-4 flex justify-center text-gray-400">
                          <ChevronRight
                            className={`w-5 h-5 transition-transform duration-200 ${expandedOrders.includes(o.id) ? "rotate-90 text-blue-500" : ""}`}
                          />
                        </div>
                        <div className="col-span-2 p-4 font-medium text-gray-800">
                          #{o.dailyOrderNumber}
                        </div>
                        <div className="col-span-2 p-4 text-gray-600">
                          {o.waiter}
                        </div>
                        <div className="col-span-2 p-4 text-gray-600">
                          Mesa {o.table}
                        </div>
                        <div className="col-span-2 p-4 flex items-center">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                              o.status === "PAID"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : o.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                        <div className="col-span-1 p-4 font-semibold text-gray-800">
                          ${o.total.toLocaleString()}
                        </div>
                        <div className="col-span-2 p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(o);
                            }}
                            className="inline-flex items-center text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded shadow-sm transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            Ver Orden
                          </button>
                        </div>
                      </div>

                      {expandedOrders.includes(o.id) && (
                        <div className="bg-gray-50/50 border-t border-dashed border-gray-200 pl-16 pr-4 py-4 animate-in slide-in-from-top-2 duration-500 ease-in-out">
                          {o.subOrders && o.subOrders.length > 0 ? (
                            <table className="w-full text-sm">
                              <thead className="text-xs text-gray-500 uppercase bg-gray-100/50">
                                <tr>
                                  <th className="px-4 py-2 text-left font-medium rounded-l-md">
                                    Pedido por
                                  </th>
                                  <th className="px-4 py-2 text-left font-medium">
                                    Hora
                                  </th>
                                  <th className="px-4 py-2 text-left font-medium">
                                    Estado
                                  </th>
                                  <th className="px-4 py-2 text-left font-medium">
                                    Items
                                  </th>
                                  <th className="px-4 py-2 text-center font-medium">
                                    Total
                                  </th>
                                  <th className="px-4 py-2 text-right font-medium rounded-r-md">
                                    Detalle
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {o.subOrders.map((sub) => (
                                  <tr
                                    key={sub.id}
                                    className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors group"
                                  >
                                    <td className="px-4 py-3 font-medium text-gray-700 group-hover:text-blue-600">
                                      {sub.label}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                      {format(new Date(sub.createdAt), "HH:mm")}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                          sub.status === "PAID"
                                            ? "text-green-700 bg-green-50"
                                            : sub.status === "CANCELLED"
                                              ? "text-red-700 bg-red-50"
                                              : "text-yellow-700 bg-yellow-50"
                                        }`}
                                      >
                                        {sub.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                      {sub.items.length} items
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-gray-700 text-center">
                                      ${sub.total.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <button
                                        onClick={() => setSelectedSubOrder(sub)}
                                        className="text-xs font-medium text-gray-600 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-300 px-3 py-1.5 rounded transition-colors group-hover:shadow-sm"
                                      >
                                        <ReceiptText className="w-3.5 h-3.5 inline mr-1" />
                                        Suborden
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="text-center py-4 text-sm text-gray-400 font-medium">
                              Sin sub-órdenes
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Sin órdenes
                </h3>
                <p className="text-gray-500">
                  No hay órdenes registradas en este turno.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <ModalContainer
          title={`Detalles Orden #${selectedOrder.dailyOrderNumber}`}
          onClose={() => setSelectedOrder(null)}
          totalLabel="Total General de la Orden"
          totalValue={selectedOrder.total}
        >
          <div className="grid grid-cols-3 gap-4 bg-gray-50/80 border border-gray-100 p-4 rounded-xl shadow-sm">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Mesa
              </p>
              <p className="font-semibold text-gray-800 text-lg">
                {selectedOrder.table}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Atendido por
              </p>
              <p className="font-semibold text-gray-800 text-lg">
                {selectedOrder.waiter}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Hora de Creación
              </p>
              <p className="font-semibold text-gray-800 text-lg">
                {format(new Date(selectedOrder.createdAt), "HH:mm")}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">
                Todos los Productos
              </h4>
              <span className="ml-3 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                {selectedOrder.items.length} totales
              </span>
            </div>
            <div className="space-y-3 bg-white border border-gray-100 rounded-xl p-2 shadow-sm">
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-3">
                    <span className="flex items-center justify-center bg-gray-100 text-gray-600 font-bold h-8 w-8 rounded-md text-sm shrink-0">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.productName}
                      </p>
                      {(item.notes || item.modifiers?.length > 0) && (
                        <div className="mt-1.5 space-y-1">
                          {item.notes && (
                            <p className="text-sm text-gray-500 italic">
                              "{item.notes}"
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {item.modifiers?.map((m: string, i: number) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">
                      ${item.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      ${item.unitPrice.toLocaleString()}/u
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold border-b border-gray-100 pb-3 mb-4 text-gray-800">
              Pagos Registrados
            </h4>
            {selectedOrder.payments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedOrder.payments.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-blue-50 p-4 rounded-xl border border-blue-100/60 items-center"
                  >
                    <span className="font-semibold text-blue-800">
                      {p.method}
                    </span>
                    <span className="font-black text-blue-900 text-lg">
                      ${Number(p.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 text-gray-500 p-4 rounded-xl text-center text-sm font-medium border border-dashed border-gray-200">
                Sin pagos registrados aún en el total de la orden
              </div>
            )}
          </div>
        </ModalContainer>
      )}

      {/* SubOrder Modal */}
      {selectedSubOrder && (
        <ModalContainer
          title="Detalles de la Suborden"
          onClose={() => setSelectedSubOrder(null)}
          totalLabel="Total Suborden"
          totalValue={selectedSubOrder.total}
        >
          <div className="grid grid-cols-2 gap-4 bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Hora Solicitada
              </p>
              <p className="font-semibold text-gray-800 text-lg">
                {format(new Date(selectedSubOrder.createdAt), "HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Estado de Pago
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-md text-sm font-bold mt-1 ${
                  selectedSubOrder.status === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {selectedSubOrder.status}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-bold border-b border-gray-100 pb-2 mb-3 text-gray-800">
              Tickets / Items Solicitados
            </h4>
            <div className="space-y-3">
              {selectedSubOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 pl-2"
                >
                  <div className="flex gap-3 items-center">
                    <span className="bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded text-sm">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.productName}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-gray-500">"{item.notes}"</p>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-gray-800">
                    ${item.totalPrice.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedSubOrder.payments &&
            selectedSubOrder.payments.length > 0 && (
              <div className="mt-8">
                <h4 className="font-bold border-b border-gray-100 pb-2 mb-3 text-gray-800">
                  Cobro
                </h4>
                <div className="space-y-2">
                  {selectedSubOrder.payments.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-100"
                    >
                      <span className="font-medium text-gray-600">
                        {p.method}
                      </span>
                      <span className="font-bold text-gray-800">
                        ${Number(p.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </ModalContainer>
      )}
    </div>
  );
}
