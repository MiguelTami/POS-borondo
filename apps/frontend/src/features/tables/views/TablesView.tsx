import React, { useState, useEffect, useMemo } from "react";
import { tableService } from "../services/table.service";
import type { Table as TableType } from "../types/table.types";
import { TableModal } from "../components/TableModal";
import { Button } from "../../../components/ui/button";
import { Search, Plus, Edit, Hash, Utensils, Info } from "lucide-react";
import { Input } from "../../../components/ui/input";

type FilterStatus =
  | "ALL"
  | "AVAILABLE"
  | "OCCUPIED"
  | "RESERVED"
  | "OUT_OF_SERVICE";

export const TablesView: React.FC = () => {
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableType | undefined>();

  const fetchTables = async () => {
    setLoading(true);
    try {
      const data = await tableService.getTables();
      setTables(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreate = () => {
    setSelectedTable(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (table: TableType) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchTables();
  };

  const filteredTables = useMemo(() => {
    let filtered = tables;
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }
    if (search.trim()) {
      filtered = filtered.filter((t) =>
        t.number.toString().includes(search.trim()),
      );
    }
    return filtered;
  }, [tables, filterStatus, search]);

  const totalTables = tables.length;
  const availableTables = tables.filter((t) => t.status === "AVAILABLE").length;
  const occupiedTables = tables.filter((t) => t.status === "OCCUPIED").length;
  const otherTables = totalTables - availableTables - occupiedTables;

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-emerald-500/20">
            Disponible
          </span>
        );
      case "OCCUPIED":
        return (
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-blue-500/20">
            Ocupada
          </span>
        );
      case "RESERVED":
        return (
          <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-amber-500/20">
            Reservada
          </span>
        );
      case "OUT_OF_SERVICE":
        return (
          <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-rose-500/20">
            Fuera de Serv.
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] p-4 sm:p-8 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mesas</h1>
          <p className="text-gray-500 text-sm">
            Administra la distribución y estado de las mesas del restaurante.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar mesa por número..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-gray-200 rounded-xl"
            />
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-6 font-semibold shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" /> Nueva Mesa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <button
          onClick={() => setFilterStatus("ALL")}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterStatus === "ALL"
              ? "border-gray-900 ring-2 ring-gray-900/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Todas
            </div>
            <Hash className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalTables}</div>
        </button>

        <button
          onClick={() => setFilterStatus("AVAILABLE")}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterStatus === "AVAILABLE"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider">
              Libres
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {availableTables}
          </div>
        </button>

        <button
          onClick={() => setFilterStatus("OCCUPIED")}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md ${
            filterStatus === "OCCUPIED"
              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-blue-600 text-xs font-bold uppercase tracking-wider">
              Ocupadas
            </div>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600">
            {occupiedTables}
          </div>
        </button>

        <button
          onClick={() => setFilterStatus("OUT_OF_SERVICE")}
          className={`bg-white rounded-xl p-4 border text-left transition-all hover:shadow-md border-gray-200`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-rose-600 text-xs font-bold uppercase tracking-wider">
              Otras
            </div>
            <Info className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-600">{otherTables}</div>
        </button>
      </div>

      {loading && tables.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <Utensils className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-gray-900 leading-none">
                      #{table.number}
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">
                      Mesa
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(table)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-2">
                <StatusBadge status={table.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <TableModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          table={selectedTable}
        />
      )}
    </div>
  );
};
