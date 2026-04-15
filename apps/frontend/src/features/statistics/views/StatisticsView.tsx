import { useState, useEffect } from "react";
import { format, subDays, startOfMonth, startOfDay, endOfDay } from "date-fns";
import type {
  SummaryData,
  TopProduct,
  StatisticsFilters,
} from "../types/statistics.types";
import { statisticsService } from "../services/statistics.service";
import { SummaryCards } from "../components/SummaryCards";
import { TopProductsChart } from "../components/TopProductsChart";
import { RevenueByMethodChart } from "../components/RevenueByMethodChart";

export function StatisticsView() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [period, setPeriod] = useState("daily");

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      const now = new Date();
      let startDate: Date;
      const endDate = endOfDay(now);

      if (period === "weekly") {
        startDate = startOfDay(subDays(now, 7));
      } else if (period === "monthly") {
        startDate = startOfDay(startOfMonth(now));
      } else {
        startDate = startOfDay(now);
      }

      const params: StatisticsFilters = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const pSummary = await statisticsService.getSummary(params);
      setSummary(pSummary);

      const pProducts = await statisticsService.getTopProducts(params);
      setTopProducts(pProducts);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Estadísticas y Reportes
        </h1>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 bg-white"
          >
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
      </div>

      {summary && <SummaryCards summary={summary} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart data={topProducts} />
        <RevenueByMethodChart
          revenueByMethod={summary?.revenueByMethod || {}}
        />
      </div>
    </div>
  );
}
