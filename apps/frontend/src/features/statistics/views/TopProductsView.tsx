import { useState, useCallback, useMemo } from "react";
import { TopProductsChart } from "../components/TopProductsChart";
import { statisticsService } from "../services/statistics.service";
import { TimeFilter } from "../components/TimeFilter";
import type { TopProduct, StatisticsFilters } from "../types/statistics.types";

export function TopProductsView() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const fetchProducts = useCallback(
    async (startDate: Date | undefined, endDate: Date | undefined) => {
      if (!startDate || !endDate) return;
      setIsLoading(true);
      try {
        const params: StatisticsFilters = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          limit: 100, // Fetch more to allow proper list viewing
        };

        const pProducts = await statisticsService.getTopProducts(params);
        setTopProducts(pProducts);
        setSelectedCategory("All"); // reset category filter
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(
        topProducts.filter((p) => p.category).map((p) => p.category as string),
      ),
    );
    cats.sort();
    return ["All", ...cats];
  }, [topProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return topProducts;
    return topProducts.filter((p) => p.category === selectedCategory);
  }, [topProducts, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-xl font-bold">Ingredientes y Productos Top</h2>
        <TimeFilter onFilterChange={fetchProducts} />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-gray-500">
          Cargando productos...
        </div>
      ) : topProducts.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow border p-4 xl:col-span-2">
            <TopProductsChart data={topProducts.slice(0, 10)} />
          </div>

          <div className="bg-white rounded-lg shadow border xl:col-span-2 flex flex-col max-h-[800px]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="font-bold text-lg text-gray-800">
                Lista Detallada de Productos
              </h3>
              <select
                className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[200px] text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "Todas las Categorías" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-0 overflow-auto">
              {filteredProducts.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white sticky top-0 shadow-sm">
                    <tr className="border-b text-gray-600">
                      <th className="p-4 font-semibold">Producto</th>
                      <th className="p-4 font-semibold">Categoría</th>
                      <th className="p-4 font-semibold text-right">
                        Cantidad Vendida
                      </th>
                      <th className="p-4 font-semibold text-right">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-b hover:bg-blue-50 transition-colors ${i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
                      >
                        <td className="p-4 font-medium text-gray-800">
                          {p.name}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold">
                            {p.category || "Sin Categoría"}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-blue-600">
                          {p.quantitySold} u.
                        </td>
                        <td className="p-4 text-right font-bold text-green-600">
                          ${p.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No hay productos para la categoría seleccionada.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 text-center text-gray-500 border rounded-lg shadow-sm">
          No hay compras registradas en este periodo.
        </div>
      )}
    </div>
  );
}
