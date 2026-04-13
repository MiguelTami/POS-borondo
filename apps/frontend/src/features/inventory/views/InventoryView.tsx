import { useState, useEffect, useMemo } from "react";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  Plus,
  Search,
  Edit,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  inventoryService,
  type Ingredient,
} from "../services/inventory.service";
import { IngredientModal } from "../components/IngredientModal";
import { StockAdjustModal } from "../components/StockAdjustModal";

export function InventoryView() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<
    Ingredient | undefined
  >();

  const [adjustIngredient, setAdjustIngredient] = useState<
    Ingredient | undefined
  >();

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getAllIngredients();
      setIngredients(data);
    } catch (err: any) {
      // It might throw 400 or 404 if none exist, that's fine.
      if (
        err.response?.data?.message === "No hay ingredientes registrados" ||
        err.response?.status === 404
      ) {
        setIngredients([]);
      } else {
        console.error("Error fetching ingredients:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsIngredientModalOpen(true);
  };

  const handleCreate = () => {
    setEditingIngredient(undefined);
    setIsIngredientModalOpen(true);
  };

  const handleAdjustStock = (ingredient: Ingredient) => {
    setAdjustIngredient(ingredient);
  };

  const filteredIngredients = useMemo(() => {
    return ingredients.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [ingredients, search]);

  const totalItems = ingredients.length;
  const lowStockCount = ingredients.filter(
    (i) => i.stock <= i.minStockAlert && i.stock > 0,
  ).length;
  const outOfStockCount = ingredients.filter((i) => i.stock === 0).length;

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Ingredientes & Inventario
          </h1>
          <p className="text-gray-500 text-sm">
            Organiza niveles de stock, alertas y suministros culinarios.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar ingrediente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-gray-200 rounded-xl"
            />
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-6 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo Ingrediente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start justify-between">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {totalItems}
            </div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Total Items
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start justify-between">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {lowStockCount}
            </div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Low Stock Alerts
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-start justify-between">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {outOfStockCount}
            </div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Out of Stock
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100/80">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Nombre del Ingrediente
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Umbral Min.
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    Cargando ingredientes...
                  </td>
                </tr>
              </tbody>
            ) : filteredIngredients.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Package className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      No se encontraron ingredientes.
                    </p>
                    <Button
                      onClick={handleCreate}
                      variant="link"
                      className="text-blue-600 mt-2"
                    >
                      Crear el primero
                    </Button>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-100/80">
                {filteredIngredients.map((ing) => {
                  const stockRatio =
                    ing.minStockAlert > 0 ? ing.stock / ing.minStockAlert : 1;
                  const isOutOfStock = ing.stock <= 0;
                  const isLowStock = !isOutOfStock && stockRatio <= 1;

                  return (
                    <tr
                      key={ing.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${!ing.isActive ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600"}`}
                          >
                            <Package className="h-5 w-5" />
                          </div>
                          <div>
                            <p
                              className={`font-bold text-sm ${!ing.isActive ? "text-gray-400 line-through" : "text-gray-900"}`}
                            >
                              {ing.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {ing.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Stock Status Bar */}
                          <div className="w-20 sm:w-32 h-1.5 rounded-full bg-gray-100 overflow-hidden relative">
                            {ing.stock > 0 && (
                              <div
                                className={`absolute left-0 top-0 bottom-0 rounded-full transition-all ${
                                  isLowStock ? "bg-orange-500" : "bg-blue-600"
                                }`}
                                style={{
                                  width: `${Math.min((stockRatio / 2) * 100, 100)}%`,
                                }}
                              />
                            )}
                          </div>
                          <span
                            className={`font-bold text-sm ${isOutOfStock ? "text-red-500" : isLowStock ? "text-orange-500" : "text-gray-900"}`}
                          >
                            {ing.stock}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 font-medium">
                          {ing.unit}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 font-semibold">
                          {ing.minStockAlert} {ing.unit === "UNIT" ? "U" : ""}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            disabled={!ing.isActive}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleAdjustStock(ing)}
                            title="Ajustar Stock"
                          >
                            <ArrowRightLeft className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleEdit(ing)}
                            title="Editar Ingrediente"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination summary logic */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Mostrando {filteredIngredients.length} ingredientes</span>
        </div>
      </div>

      {isIngredientModalOpen && (
        <IngredientModal
          ingredientToEdit={editingIngredient}
          onClose={() => setIsIngredientModalOpen(false)}
          onSuccess={() => {
            setIsIngredientModalOpen(false);
            fetchIngredients();
          }}
        />
      )}

      {adjustIngredient && (
        <StockAdjustModal
          ingredient={adjustIngredient}
          onClose={() => setAdjustIngredient(undefined)}
          onSuccess={() => {
            setAdjustIngredient(undefined);
            fetchIngredients();
          }}
        />
      )}
    </div>
  );
}
