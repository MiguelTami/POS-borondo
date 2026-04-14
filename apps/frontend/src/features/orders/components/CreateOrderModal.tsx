import { useState, useEffect } from "react";
import { X, Plus, Minus, Search, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { tableService } from "../../tables/services/table.service";
import type { Table } from "../../tables/types/table.types";
import {
  productService,
  type Category,
  type Product,
} from "../../products/services/product.service";
import { orderService } from "../services/order.service";

interface LocalOrderItem {
  product: Product;
  quantity: number;
}

interface LocalSubOrder {
  id: string;
  label: string;
  items: LocalOrderItem[];
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  existingOrderId?: number;
  existingTableId?: number;
}

export function CreateOrderModal({
  onClose,
  onSuccess,
  existingOrderId,
  existingTableId,
}: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTableId, setSelectedTableId] = useState<number | "">(
    existingTableId || "",
  );
  const [subOrders, setSubOrders] = useState<LocalSubOrder[]>([]);
  const [activeSubOrderId, setActiveSubOrderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal para el nombre de suborden
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [newSubOrderName, setNewSubOrderName] = useState("");
  const [pendingProductToAdd, setPendingProductToAdd] =
    useState<Product | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [fetchedTables, fetchedCategories, fetchedProducts] =
        await Promise.all([
          tableService.getTables(),
          productService.getCategories(),
          productService.getProducts(),
        ]);
      setTables(fetchedTables);
      setCategories(fetchedCategories);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error(err);
      setError("Error cargando datos iniciales");
    }
  };

  const handleAddSuborder = () => {
    setIsNameModalOpen(true);
    setNewSubOrderName("");
  };

  const confirmAddSuborder = () => {
    if (!newSubOrderName.trim()) return;
    const newId = Date.now().toString();
    const newSubOrderItems = pendingProductToAdd
      ? [{ product: pendingProductToAdd, quantity: 1 }]
      : [];

    setSubOrders([
      ...subOrders,
      { id: newId, label: newSubOrderName.trim(), items: newSubOrderItems },
    ]);
    setActiveSubOrderId(newId);
    setIsNameModalOpen(false);
    setPendingProductToAdd(null);
  };

  const handleAddToCart = (product: Product) => {
    const maxQty = getMaxProductQuantity(product);
    const inCart = getCartProductQuantity(product.id);

    if (inCart >= maxQty) return;

    if (!activeSubOrderId) {
      setPendingProductToAdd(product);
      setIsNameModalOpen(true);
      setNewSubOrderName("");
      return;
    }
    setSubOrders((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubOrderId) return sub;
        const existing = sub.items.find((i) => i.product.id === product.id);
        if (existing) {
          return {
            ...sub,
            items: sub.items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          };
        }
        return {
          ...sub,
          items: [...sub.items, { product, quantity: 1 }],
        };
      }),
    );
  };

  const handleChangeQuantity = (product: Product, delta: number) => {
    if (delta > 0) {
      const maxQty = getMaxProductQuantity(product);
      const inCart = getCartProductQuantity(product.id);
      if (inCart >= maxQty) return;
    }

    setSubOrders((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubOrderId) return sub;
        return {
          ...sub,
          items: sub.items
            .map((i) => {
              if (i.product.id === product.id) {
                return { ...i, quantity: Math.max(0, i.quantity + delta) };
              }
              return i;
            })
            .filter((i) => i.quantity > 0),
        };
      }),
    );
  };

  const activeSubOrder =
    subOrders.find((s) => s.id === activeSubOrderId) || null;

  const getMaxProductQuantity = (product: Product) => {
    if (!product.recipes || product.recipes.length === 0) return Infinity; // No ingredients limit
    let minPossible = Infinity;
    for (const r of product.recipes) {
      const req = Number(r.quantityRequired);
      const stock = Number(r.ingredient.stock);
      if (req > 0) {
        const possible = Math.floor(stock / req);
        if (possible < minPossible) minPossible = possible;
      }
    }
    return minPossible;
  };

  const getCartProductQuantity = (productId: number) => {
    let total = 0;
    for (const sub of subOrders) {
      const it = sub.items.find((i) => i.product.id === productId);
      if (it) total += it.quantity;
    }
    return total;
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategoryId === "ALL" || p.categoryId === selectedCategoryId;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getSubOrderTotal = (sub: LocalSubOrder) => {
    return sub.items.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0,
    );
  };

  const handleSubmitOrder = async () => {
    setError(null);
    if (!existingOrderId && !selectedTableId) {
      setError("Por favor selecciona una mesa primero.");
      return;
    }

    const totalItems = subOrders.reduce(
      (acc, sub) => acc + sub.items.length,
      0,
    );
    if (totalItems === 0) {
      setError("La orden no tiene productos.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create order if it doesn't exist
      const orderId =
        existingOrderId ||
        (await orderService.createOrder(Number(selectedTableId))).id;

      // 2. Create suborders & items
      for (const sub of subOrders) {
        if (sub.items.length === 0) continue; // Skip empty suborders
        const createdSubOrder = await orderService.createSubOrder(
          orderId,
          sub.label,
        );

        for (const item of sub.items) {
          await orderService.createOrderItem(
            orderId,
            createdSubOrder.id,
            item.product.id,
            item.quantity,
          );
        }

        // Si estamos agregando a una orden existente, enviamos directamente la nueva suborden
        if (existingOrderId) {
          await orderService.sendSubOrderToCashier(orderId, createdSubOrder.id);
        }
      }

      // 3. Si es una orden nueva, enviamos la orden entera
      if (!existingOrderId) {
        await orderService.sendOrderToCashier(orderId);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error || "Error al crear la orden y enviarla.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#f0f2f5] w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md animate-in slide-in-from-top-4 fade-in">
            <Alert
              variant="destructive"
              className="bg-white shadow-lg border-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                {error}
              </AlertDescription>
              <button
                onClick={() => setError(null)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </Alert>
          </div>
        )}

        {/* Header */}
        <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-200 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {existingOrderId
                  ? `Agregar a la Orden #${existingOrderId}`
                  : "Crear Orden"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!existingOrderId && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold tracking-tight uppercase text-gray-500">
                Seleccionar Mesa{" "}
                {selectedTableId
                  ? `(Mesa ${tables.find((t) => t.id === selectedTableId)?.id})`
                  : ""}
              </h3>
              <div className="flex gap-3 overflow-x-auto p-2 pb-4 scrollbar-hide">
                {tables.map((t) => {
                  const isSelected = selectedTableId === t.id;
                  const isAvailable = t.status === "AVAILABLE";
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTableId(t.id)}
                      className={`px-3 py-1.5 text-sm rounded-xl font-bold whitespace-nowrap transition-all border border-transparent flex-shrink-0 ${
                        isSelected
                          ? "ring-2 ring-blue-500 ring-offset-2 shadow-md transform scale-105 "
                          : "hover:bg-opacity-80 "
                      } ${
                        isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Mesa {t.id} {isAvailable ? "" : "(Ocupada)"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Body content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel: Products explorer */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Search & Categories */}
            <div className="mb-6 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white rounded-xl shadow-sm border-none shadow-sm"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategoryId("ALL")}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${selectedCategoryId === "ALL" ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${selectedCategoryId === cat.id ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto pr-2 pb-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const maxQty = getMaxProductQuantity(product);
                  const inCart = getCartProductQuantity(product.id);
                  const exhausted = inCart >= maxQty;

                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (!exhausted) handleAddToCart(product);
                      }}
                      className={`bg-white p-5 rounded-2xl shadow-sm border transition-all flex flex-col justify-between relative overflow-hidden ${
                        exhausted
                          ? "opacity-60 cursor-not-allowed border-red-200 bg-red-50/20"
                          : "border-gray-100 hover:border-blue-300 hover:shadow-md cursor-pointer"
                      }`}
                    >
                      <h3 className="font-bold text-gray-800 break-words line-clamp-2 mb-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="text-blue-600 font-black text-lg mt-auto">
                        ${Number(product.price).toFixed(2)}
                      </div>

                      {exhausted && (
                        <div className="absolute top-0 right-0 bg-red-100 border-l border-b border-red-200 text-red-700 px-2 py-1 text-[10px] font-black rounded-bl-lg">
                          SIN STOCK
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-400 font-medium">
                  No se encontraron productos.
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Active Cart & Suborders */}
          <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col">
            {/* Suborders Tabs */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
              {subOrders.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubOrderId(sub.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeSubOrderId === sub.id ? "bg-blue-100 text-blue-700 shadow-sm border border-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                >
                  {sub.label}
                </button>
              ))}
              <button
                onClick={handleAddSuborder}
                className="px-3 h-9 shrink-0 flex items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 transition-colors gap-1 text-sm font-bold"
                title="Añadir Sub-orden"
              >
                <Plus className="w-4 h-4" /> Nueva
              </button>
            </div>

            {/* Cart Header */}
            {activeSubOrder ? (
              <>
                <div className="p-5 flex justify-between items-center">
                  <h3 className="font-black text-gray-800 tracking-tight uppercase text-sm">
                    Carrito: {activeSubOrder.label}
                  </h3>
                  {activeSubOrder.items.length > 0 && (
                    <button
                      onClick={() => {
                        setSubOrders((prev) =>
                          prev.map((s) =>
                            s.id === activeSubOrderId ? { ...s, items: [] } : s,
                          ),
                        );
                      }}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      LIMPIAR
                    </button>
                  )}
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-6">
                  {activeSubOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex flex-col p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-gray-800 flex-1 pr-2">
                          {item.product.name}
                        </span>
                        <span className="font-bold text-gray-900">
                          $
                          {(Number(item.product.price) * item.quantity).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <button
                            onClick={() =>
                              handleChangeQuantity(item.product, -1)
                            }
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 font-bold text-gray-800 min-w-[2.5rem] text-center border-x border-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleChangeQuantity(item.product, 1)
                            }
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeSubOrder.items.length === 0 && (
                    <div className="text-center text-gray-400 py-10 text-sm">
                      Carrito vacío. Selecciona productos.
                    </div>
                  )}
                </div>

                {/* Footer Summary */}
                <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] mt-auto">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 font-semibold text-sm">
                      Subtotal ({activeSubOrder.label})
                    </span>
                    <span className="text-gray-800 font-bold">
                      ${getSubOrderTotal(activeSubOrder).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-gray-900 font-black text-lg">
                      Total Global{" "}
                      <span className="text-xs font-normal text-gray-500 block">
                        Todas las subórdenes
                      </span>
                    </span>
                    <span className="text-blue-600 font-black text-2xl">
                      $
                      {subOrders
                        .reduce((acc, sub) => acc + getSubOrderTotal(sub), 0)
                        .toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={handleSubmitOrder}
                    disabled={isLoading || selectedTableId === ""}
                    className="w-full h-14 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transition-all"
                  >
                    {isLoading ? "Enviando..." : "Enviar Pedido"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex justify-center items-center mb-4">
                  <Plus className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-700 mb-2 text-lg">
                  Inicia una Sub-orden
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Debes crear al menos una suborden (nombre del cliente) para
                  empezar a agregar productos.
                </p>
                <Button
                  onClick={handleAddSuborder}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold px-6 border-none shadow-none"
                >
                  <Plus className="w-4 h-4 mr-2" /> Agregar Nueva
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isNameModalOpen && (
        <div className="fixed inset-0 z-[60] flex justify-center items-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Nueva Suborden
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Ingresa el nombre del cliente o etiqueta para agrupar sus
                productos.
              </p>
            </div>
            <div className="p-6">
              <Input
                autoFocus
                placeholder="Ej. Juan Pérez, Mesa 3"
                value={newSubOrderName}
                onChange={(e) => setNewSubOrderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmAddSuborder();
                }}
                className="h-12 w-full text-lg"
              />
              <div className="flex gap-3 justify-end mt-6">
                <Button
                  variant="outline"
                  className="px-6"
                  onClick={() => {
                    setIsNameModalOpen(false);
                    setPendingProductToAdd(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={confirmAddSuborder}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
