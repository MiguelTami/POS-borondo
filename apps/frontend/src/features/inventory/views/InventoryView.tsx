import { useState, useEffect, useMemo } from "react";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  Plus,
  Search,
  Edit,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Eye,
  Filter,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  inventoryService,
  type Ingredient,
} from "../services/inventory.service";
import { IngredientModal } from "../components/IngredientModal";
import { StockAdjustModal } from "../components/StockAdjustModal";

type FilterMode = "ALL" | "LOW_STOCK" | "OUT_OF_STOCK" | "ACTIVE" | "INACTIVE";

const ITEMS_PER_PAGE = 12;

export function InventoryView() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [stockErrorPopup, setStockErrorPopup] = useState<string | null>(null);

  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<
    Ingredient | undefined
  >();

  const [adjustIngredient, setAdjustIngredient] = useState<
    Ingredient | undefined
  >();

  const [confirmToggleIngredient, setConfirmToggleIngredient] = useState<
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

  const handleRequestToggleActive = (ingredient: Ingredient) => {
    setStockErrorPopup(null);
    if (ingredient.isActive && Number(ingredient.stock) > 0) {
      setStockErrorPopup(
        "No se puede desactivar un ingrediente con stock disponible.",
      );
      return;
    }
    setConfirmToggleIngredient(ingredient);
  };

  const executeToggleActive = async () => {
    if (!confirmToggleIngredient) return;
    const ingredient = confirmToggleIngredient;
    setStockErrorPopup(null);
    try {
      if (ingredient.isActive) {
        await inventoryService.deactivateIngredient(ingredient.id);
      } else {
        await inventoryService.activateIngredient(ingredient.id);
      }
      setConfirmToggleIngredient(undefined);
      fetchIngredients();
    } catch (error: any) {
      console.error("Error toggling exact ingredient", error);
      setStockErrorPopup(
        error.response?.data?.message ||
          "Error al cambiar el estado del ingrediente.",
      );
      setConfirmToggleIngredient(undefined);
    }
  };

  // Computations for Stats Filters
  const totalItems = ingredients.length;
  const activeCount = ingredients.filter((i) => i.isActive).length;
  const inactiveCount = ingredients.filter((i) => !i.isActive).length;
  const lowStockCount = ingredients.filter(
    (i) => Number(i.stock) <= i.minStockAlert && Number(i.stock) > 0,
  ).length;
  // Keep the frontend count for the stats UI, but we could also get it from backend if needed
  const outOfStockCount = ingredients.filter(
    (i) => Number(i.stock) <= 0,
  ).length;

  // Filter application
  const filteredAndSearchedIngredients = useMemo(() => {
    let filtered = ingredients;

    // Apply FilterMode
    if (filterMode === "ACTIVE") {
      filtered = filtered.filter((i) => i.isActive);
    } else if (filterMode === "INACTIVE") {
      filtered = filtered.filter((i) => !i.isActive);
    } else if (filterMode === "LOW_STOCK") {
      filtered = filtered.filter(
        (i) => Number(i.stock) <= i.minStockAlert && Number(i.stock) > 0,
      );
    } else if (filterMode === "OUT_OF_STOCK") {
      filtered = filtered.filter((i) => Number(i.stock) <= 0);
    }

    // Apply Search
    if (search.trim()) {
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }, [ingredients, filterMode, search]);

  // Pagination bounds
  const totalPages = Math.ceil(
    filteredAndSearchedIngredients.length / ITEMS_PER_PAGE,
  );

  // Prevent page overflow when filtering changes bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredAndSearchedIngredients, currentPage, totalPages]);

  const pagedIngredients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSearchedIngredients.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredAndSearchedIngredients, currentPage]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] p-4 sm:p-8 overflow-y-auto">
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
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-6 font-semibold shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo
          </Button>
        </div>
      </div>

      {stockErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 border-t-4 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Acción no permitida
              </h3>
            </div>
            <p className="text-gray-600 mb-6">{stockErrorPopup}</p>
            <div className="flex justify-end">
              <Button
                className="bg-gray-800 hover:bg-gray-900"
                onClick={() => setStockErrorPopup(null)}
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Stats Cards (Filter buttons) - 5 columns */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <button
          onClick={() => {
            setFilterMode("ALL");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "ALL"
              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Totales
            </div>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalItems}</div>
        </button>

        <button
          onClick={() => {
            setFilterMode("ACTIVE");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "ACTIVE"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Activos
            </div>
            <Eye className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">{activeCount}</div>
        </button>

        <button
          onClick={() => {
            setFilterMode("LOW_STOCK");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "LOW_STOCK"
              ? "border-orange-500 ring-2 ring-orange-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Bajo Stock
            </div>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {lowStockCount}
          </div>
        </button>

        <button
          onClick={() => {
            setFilterMode("OUT_OF_STOCK");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "OUT_OF_STOCK"
              ? "border-red-500 ring-2 ring-red-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Sin Stock
            </div>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {outOfStockCount}
          </div>
        </button>

        <button
          onClick={() => {
            setFilterMode("INACTIVE");
            setCurrentPage(1);
          }}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "INACTIVE"
              ? "border-gray-500 ring-2 ring-gray-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Inactivos
            </div>
            <EyeOff className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {inactiveCount}
          </div>
        </button>
      </div>

      {/* Grid of Ingredients */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Cargando ingredientes...
          </div>
        ) : pagedIngredients.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-1">
              No hay resultados
            </h3>
            <p className="text-gray-500 font-medium mb-4 text-sm text-center">
              No encontramos ingredientes para este filtro.
            </p>
            {filterMode !== "ALL" && (
              <Button
                onClick={() => setFilterMode("ALL")}
                variant="outline"
                className="text-gray-600"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {pagedIngredients.map((ing) => {
              // Calculate percentage ratio for gradient clipping
              // Use minStockAlert * 2 to represent a "fully healthy" bar
              const thresholdForMax =
                ing.minStockAlert > 0 ? ing.minStockAlert * 2 : 100;
              const safeStock = Math.min(Number(ing.stock), thresholdForMax);
              const percent =
                thresholdForMax === 0 ? 0 : (safeStock / thresholdForMax) * 100;

              return (
                <div
                  key={ing.id}
                  className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md relative group flex flex-col ${
                    !ing.isActive
                      ? "border-gray-200 opacity-60 bg-gray-50/50"
                      : "border-gray-100"
                  }`}
                >
                  {/* Hover Actions (Desktop) */}
                  <div className="hidden md:flex absolute top-3 right-3 gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {ing.isActive && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-sm bg-white hover:bg-gray-50 border border-gray-100 text-gray-600"
                        onClick={() => handleAdjustStock(ing)}
                        title="Ajustar Stock"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-sm bg-white hover:bg-gray-50 border border-gray-100 text-blue-600"
                      onClick={() => handleEdit(ing)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-sm bg-white hover:bg-gray-50 border border-gray-100 text-red-500"
                      onClick={() => handleRequestToggleActive(ing)}
                      title={ing.isActive ? "Desactivar" : "Activar"}
                    >
                      {ing.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex justify-between items-start mb-6 pr-16 md:pr-0 transition-opacity group-hover:md:pr-24">
                    <div>
                      <h3
                        className={`font-bold text-lg leading-tight mb-1 line-clamp-2 ${
                          !ing.isActive
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {ing.name}
                      </h3>
                      <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 uppercase tracking-wider">
                        Umbral: {ing.minStockAlert}{" "}
                        {ing.unit === "UNIT" ? "U" : ing.unit}
                      </span>
                    </div>
                  </div>

                  {/* Stock UI Footer */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-2xl font-black text-gray-800 tracking-tight">
                        {ing.stock}{" "}
                        <span className="font-semibold text-gray-400 text-sm tracking-normal">
                          {ing.unit}
                        </span>
                      </span>
                      {Number(ing.stock) <= 0 && (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded">
                          Agotado
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      {/* By keeping a 100% width gradient and using clipPath, we only reveal the left part of the gradient depending on the stock %. Left is red, Right is blue */}
                      <div
                        className="absolute inset-0 h-full w-full bg-gradient-to-r from-red-500 via-orange-400 to-blue-500 rounded-full origin-left transition-all duration-500"
                        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
                      />
                    </div>
                  </div>

                  {/* Actions (Mobile) */}
                  <div className="flex md:hidden mt-5 gap-2 pt-4 border-t border-gray-100">
                    {ing.isActive && (
                      <Button
                        variant="outline"
                        className="flex-1 text-xs px-1"
                        onClick={() => handleAdjustStock(ing)}
                      >
                        <ArrowRightLeft className="h-3 w-3 mr-1" /> Ajustar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="flex-1 text-xs px-1"
                      onClick={() => handleEdit(ing)}
                    >
                      <Edit className="h-3 w-3 mr-1" /> Editar
                    </Button>
                    <Button
                      variant={ing.isActive ? "outline" : "default"}
                      className={`flex-1 text-xs px-1 ${ing.isActive ? "text-red-500 border-red-200 hover:bg-red-50" : "bg-emerald-600"}`}
                      onClick={() => handleRequestToggleActive(ing)}
                    >
                      {ing.isActive ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Activar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-auto pt-4 pb-2 flex items-center justify-between border-t border-gray-200/60 text-sm">
          <span className="text-gray-500 font-medium">
            Página {currentPage} de {totalPages} (
            {filteredAndSearchedIngredients.length} resultados)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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

      {confirmToggleIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Confirmar acción
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas{" "}
              <strong>
                {confirmToggleIngredient.isActive ? "desactivar" : "activar"}
              </strong>{" "}
              el ingrediente{" "}
              <span className="font-bold text-gray-900">
                {confirmToggleIngredient.name}
              </span>
              ?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmToggleIngredient(undefined)}
              >
                Cancelar
              </Button>
              <Button
                className={
                  confirmToggleIngredient.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }
                onClick={executeToggleActive}
              >
                {confirmToggleIngredient.isActive ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
