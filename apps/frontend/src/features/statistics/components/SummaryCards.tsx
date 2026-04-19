import { DollarSign, ListOrdered, FileClock, Users } from "lucide-react";
import { type SummaryData } from "../types/statistics.types";

interface SummaryCardsProps {
  summary: SummaryData;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Ingreso Real
            </p>
            <DollarSign className="w-6 h-6 text-green-500 opacity-80" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-2">
            ${summary.totalRevenue?.toLocaleString()}
          </h3>
          <div className="text-xs text-gray-500 font-semibold space-y-1">
            <div className="flex justify-between">
              <span>Esperado:</span>
              <span className="text-gray-900">
                ${summary.expectedRevenue?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Registrado:</span>
              <span className="text-gray-900">
                ${summary.declaredCash?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between border-t pt-1 mt-1">
              <span>Descuadre / Dif:</span>
              <span
                className={
                  summary.difference < 0
                    ? "text-red-500 font-bold"
                    : "text-green-500 font-bold"
                }
              >
                ${summary.difference?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Pedidos Totales
            </p>
            <ListOrdered className="w-6 h-6 text-blue-500 opacity-80" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {summary.ordersCount}
          </h3>
          <p className="text-xs text-gray-500 mt-2">
            En el período seleccionado
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Turnos
            </p>
            <FileClock className="w-6 h-6 text-purple-500 opacity-80" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {summary.shiftsCount}
          </h3>
          <p className="text-xs text-gray-500 mt-2">
            Turnos operados en el periodo
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Ticket Promedio
            </p>
            <Users className="w-6 h-6 text-orange-500 opacity-80" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            $
            {summary.averageOrderValue?.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h3>
          <p className="text-xs text-gray-500 mt-2">
            Valor promedio por orden global
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Ticket Medio (Sub)
            </p>
            <Users className="w-6 h-6 text-yellow-500 opacity-80" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            $
            {summary.averageSubOrderValue?.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h3>
          <p className="text-xs text-gray-500 mt-2">
            Valor promedio por cliente (suborden)
          </p>
        </div>
      </div>
    </>
  );
}
