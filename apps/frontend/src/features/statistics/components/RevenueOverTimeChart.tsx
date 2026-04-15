import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RevenueOverTimeChartProps {
  data: { date: string; amount: number }[];
}

export function RevenueOverTimeChart({ data }: RevenueOverTimeChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border flex flex-col min-h-[300px]">
      <h2 className="text-xl font-bold mb-4">Flujo de Ingresos</h2>
      {data && data.length > 0 ? (
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Ingresos",
                ]}
                labelStyle={{ color: "#374151", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No hay datos para este periodo
        </div>
      )}
    </div>
  );
}
