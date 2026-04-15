import { useState } from "react";
import { FinancesView } from "./FinancesView";
import { ShiftOrdersView } from "./ShiftOrdersView";
import { TopProductsView } from "./TopProductsView";

export function StatisticsView() {
  const [activeTab, setActiveTab] = useState<
    "finances" | "shifts" | "products"
  >("finances");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Estadísticas y Reportes
        </h1>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("finances")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "finances"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Finanzas
          </button>
          <button
            onClick={() => setActiveTab("shifts")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "shifts"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Órdenes por Turno
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "products"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Productos Top
          </button>
        </div>
      </div>

      <div className="pt-2 min-h-[500px]">
        {activeTab === "finances" && <FinancesView />}
        {activeTab === "shifts" && <ShiftOrdersView />}
        {activeTab === "products" && <TopProductsView />}
      </div>
    </div>
  );
}
