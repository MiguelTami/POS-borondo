import { useState, useCallback } from "react";
import { SummaryCards } from "../components/SummaryCards";
import { RevenueByMethodChart } from "../components/RevenueByMethodChart";
import { RevenueOverTimeChart } from "../components/RevenueOverTimeChart";
import { statisticsService } from "../services/statistics.service";
import { TimeFilter } from "../components/TimeFilter";
import type { SummaryData, StatisticsFilters } from "../types/statistics.types";

export function FinancesView() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(
    async (startDate: Date | undefined, endDate: Date | undefined) => {
      if (!startDate || !endDate) return;
      setIsLoading(true);
      try {
        const params: StatisticsFilters = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        const pSummary = await statisticsService.getSummary(params);
        setSummary(pSummary);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-xl font-bold">Resumen Financiero</h2>
        <TimeFilter onFilterChange={fetchStats} />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-gray-500">
          Cargando finanzas...
        </div>
      ) : summary ? (
        <>
          <SummaryCards summary={summary} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueByMethodChart
              revenueByMethod={summary.revenueByMethod || {}}
            />
            <RevenueOverTimeChart data={summary.revenueOverTime} />
          </div>
        </>
      ) : (
        <div className="text-gray-500">No se pudieron cargar los datos</div>
      )}
    </div>
  );
}
