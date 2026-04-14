import React, { useState, useMemo, useEffect } from "react";
import {
  productService,
  type Product,
  type Category,
} from "../services/product.service";
import { ProductModal } from "../components/ProductModal";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { CategoryModal } from "../components/CategoryModal";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  Package,
  Filter,
  ArchiveRestore,
} from "lucide-react";

type FilterMode = "ALL" | "ACTIVE" | "INACTIVE";

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("ALL");
  const [categoryIdFilter, setCategoryIdFilter] = useState<
    number | undefined
  >();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedProductDetail, setSelectedProductDetail] = useState<
    Product | undefined
  >();

  const fetchCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const prods = await productService.getProducts({
        categoryId: categoryIdFilter,
      });
      setProducts(prods);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryIdFilter]);

  const handleCreateProduct = () => {
    setSelectedProduct(undefined);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      if (product.isActive) {
        await productService.deactivateProduct(product.id);
      } else {
        await productService.reactivateProduct(product.id);
      }
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const totalProducts = products.length;
  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filterMode === "ACTIVE") {
      filtered = filtered.filter((p) => p.isActive);
    } else if (filterMode === "INACTIVE") {
      filtered = filtered.filter((p) => !p.isActive);
    }

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }

    return filtered;
  }, [products, filterMode, search]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] p-4 sm:p-8 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Productos & Menú
          </h1>
          <p className="text-gray-500 text-sm">
            Administra el catálogo de productos y sus recetas de ingredientes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-gray-200 rounded-xl"
            />
          </div>
          <Button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl shadow-sm px-6 font-semibold shrink-0"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" /> Categoría
          </Button>
          <Button
            onClick={handleCreateProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-6 font-semibold shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo Producto
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-4 items-center">
        <select
          className="border border-gray-200 rounded-xl p-2 bg-white text-gray-700 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[200px]"
          value={categoryIdFilter || ""}
          onChange={(e) =>
            setCategoryIdFilter(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
        >
          <option value="">Todas las Categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <button
          onClick={() => setFilterMode("ALL")}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterMode === "ALL"
              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="h-3 w-3" /> Todos
            </div>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {totalProducts}
          </div>
        </button>

        <button
          onClick={() => setFilterMode("ACTIVE")}
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
          onClick={() => setFilterMode("INACTIVE")}
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

      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Cargando productos...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-1">
              No hay resultados
            </h3>
            <p className="text-gray-500 font-medium mb-4 text-sm text-center">
              No encontramos productos para este filtro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {filteredProducts.map((p) => {
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md relative group flex flex-col cursor-pointer ${
                    !p.isActive
                      ? "border-gray-200 opacity-60 bg-gray-50/50"
                      : "border-gray-100"
                  }`}
                  onClick={() => setSelectedProductDetail(p)}
                >
                  <div className="hidden md:flex absolute top-3 right-3 gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-sm bg-white hover:bg-gray-50 border border-gray-100 text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProduct(p);
                      }}
                      title="Editar Producto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className={`h-8 w-8 rounded-full shadow-sm bg-white border border-gray-100 ${p.isActive ? "hover:bg-red-50 text-red-600" : "hover:bg-green-50 text-green-600"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProductStatus(p);
                      }}
                      title={p.isActive ? "Desactivar" : "Activar"}
                    >
                      {p.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <ArchiveRestore className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          p.isActive
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight truncate px-1 max-w-[200px]">
                          {p.name}
                        </h3>
                        <p className="text-xs font-medium text-gray-500">
                          {p.category?.name || "Sin Categoría"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div className="text-xs font-bold text-gray-500">
                        Precio
                      </div>
                      <div className="text-sm font-black text-gray-800">
                        ${Number(p.price).toFixed(2)}
                      </div>
                    </div>
                    {p.recipes && p.recipes.length > 0 && (
                      <div className="flex justify-between items-center">
                        <div className="text-xs font-medium text-gray-500">
                          Ingredientes ({p.recipes.length})
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isProductModalOpen && (
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSaved={() => {
            setIsProductModalOpen(false);
            fetchProducts();
          }}
          productToEdit={selectedProduct}
          categories={categories}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSaved={() => {
            setIsCategoryModalOpen(false);
            fetchCategories();
          }}
        />
      )}

      {selectedProductDetail && (
        <ProductDetailModal
          isOpen={!!selectedProductDetail}
          onClose={() => setSelectedProductDetail(undefined)}
          product={selectedProductDetail}
        />
      )}
    </div>
  );
};
