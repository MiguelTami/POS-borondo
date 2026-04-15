import { DollarSign, ListOrdered, FileClock, Users } from "lucide-react";
import { type SummaryData } from "../types/statistics.types";

interface SummaryCardsProps {
  summary: SummaryData;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow border flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
          <h3 className="text-2xl font-bold">
            ${summary.totalRevenue?.toLocaleString()}
          </h3>
        </div>
        <DollarSign className="w-8 h-8 text-green-500 opacity-80" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow border flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Pedidos Totales</p>
          <h3 className="text-2xl font-bold">{summary.ordersCount}</h3>
        </div>
        <ListOrdered className="w-8 h-8 text-blue-500 opacity-80" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow border flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Turnos Activos</p>
          <h3 className="text-2xl font-bold">{summary.shiftsCount}</h3>
        </div>
        <FileClock className="w-8 h-8 text-purple-500 opacity-80" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow border flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Ticket Promedio</p>
          <h3 className="text-2xl font-bold">
            $
            {summary.averageOrderValue?.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h3>
        </div>
        <Users className="w-8 h-8 text-orange-500 opacity-80" />
      </div>
    </div>
  );
}
