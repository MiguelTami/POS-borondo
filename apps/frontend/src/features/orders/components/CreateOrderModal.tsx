import { useState, useEffect } from "react";
import { X, Plus, Minus, Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { tableService, type Table } from "../../tables/services/table.service";
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
}

export function CreateOrderModal({ onClose, onSuccess }: Props) {
  const [tables, setTables] = useState<Table[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTableId, setSelectedTableId] = useState<number | "">("");
  const [subOrders, setSubOrders] = useState<LocalSubOrder[]>([
    { id: "1", label: "Mesa Completa", items: [] },
  ]);
  const [activeSubOrderId, setActiveSubOrderId] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);

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
      alert("Error cargando datos iniciales");
    }
  };

  const handleAddSuborder = () => {
    const label = prompt("¿Nombre de quien pide (Sub-orden)?");
    if (!label) return;
    const newId = Date.now().toString();
    setSubOrders([...subOrders, { id: newId, label, items: [] }]);
    setActiveSubOrderId(newId);
  };

  const handleAddToCart = (product: Product) => {
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

  const handleChangeQuantity = (productId: number, delta: number) => {
    setSubOrders((prev) =>
      prev.map((sub) => {
        if (sub.id !== activeSubOrderId) return sub;
        return {
          ...sub,
          items: sub.items
            .map((i) => {
              if (i.product.id === productId) {
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
    subOrders.find((s) => s.id === activeSubOrderId) || subOrders[0];

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
    if (!selectedTableId) {
      alert("Por favor selecciona una mesa primero.");
      return;
    }

    const totalItems = subOrders.reduce(
      (acc, sub) => acc + sub.items.length,
      0,
    );
    if (totalItems === 0) {
      alert("La orden no tiene productos.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create order
      const newOrder = await orderService.createOrder(Number(selectedTableId));

      // 2. Create suborders & items
      for (const sub of subOrders) {
        if (sub.items.length === 0) continue; // Skip empty suborders
        const createdSubOrder = await orderService.createSubOrder(
          newOrder.id,
          sub.label,
        );

        for (const item of sub.items) {
          await orderService.createOrderItem(
            newOrder.id,
            createdSubOrder.id,
            item.product.id,
            item.quantity,
          );
        }
      }

      // 3. Send to cashier
      await orderService.sendOrderToCashier(newOrder.id);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.error || "Error al crear la orden y enviarla.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#f0f2f5] w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold text-gray-900">Crear Orden</h2>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-800 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedTableId}
              onChange={(e) =>
                setSelectedTableId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">-- Seleccionar Mesa --</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  Mesa {t.number} ({t.status})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
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
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <h3 className="font-bold text-gray-800 break-words line-clamp-2 mb-2 leading-tight">
                      {product.name}
                    </h3>
                    <div className="text-blue-600 font-black text-lg mt-auto">
                      ${Number(product.price).toFixed(2)}
                    </div>
                  </div>
                ))}
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
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                title="Añadir Sub-orden"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Header */}
            <div className="p-5 flex justify-between items-center">
              <h3 className="font-black text-gray-800 tracking-tight uppercase text-sm">
                Carrito Actual
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
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <button
                        onClick={() =>
                          handleChangeQuantity(item.product.id, -1)
                        }
                        className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-800 min-w-[2.5rem] text-center border-x border-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleChangeQuantity(item.product.id, 1)}
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
                  Carrito vacío en "{activeSubOrder.label}"
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
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
          </div>
        </div>
      </div>
    </div>
  );
}
