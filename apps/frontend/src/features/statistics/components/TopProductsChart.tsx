import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type TopProduct } from "../types/statistics.types";

interface TopProductsChartProps {
  data: TopProduct[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h2 className="text-xl font-bold mb-4">Top 5 Productos Más Vendidos</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantitySold" fill="#3b82f6" name="Cant. Vendida" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
