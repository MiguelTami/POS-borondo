import { useState, useEffect } from "react";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, setISOWeek } from "date-fns";

export type PeriodType = "daily" | "weekly" | "monthly" | "yearly" | "all";

interface TimeFilterProps {
  onFilterChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export function TimeFilter({ onFilterChange }: TimeFilterProps) {
  const [period, setPeriod] = useState<PeriodType>("daily");
  const [dateValue, setDateValue] = useState(format(new Date(), "yyyy-MM-dd"));
  const [weekValue, setWeekValue] = useState(() => {
    const d = new Date();
    const w = format(d, "I"); // ISO week number
    const y = format(d, "R"); // ISO week year
    return `${y}-W${w.padStart(2, '0')}`;
  });
  const [monthValue, setMonthValue] = useState(format(new Date(), "yyyy-MM"));
  const [yearValue, setYearValue] = useState(format(new Date(), "yyyy"));

  useEffect(() => {
    applyFilter();
  }, [period, dateValue, weekValue, monthValue, yearValue]);

  const applyFilter = () => {
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined;

    try {
      if (period === "daily") {
        let d = now;
        if (dateValue) {
          const [y, m, day] = dateValue.split("-").map(Number);
          d = new Date(y, m - 1, day);
        }
        start = startOfDay(d);
        end = endOfDay(d);
      } else if (period === "weekly") {
        if (weekValue) {
          const [yearStr, weekStr] = weekValue.split("-W");
          let d = new Date();
          d.setFullYear(Number(yearStr), 0, 1);
          d = setISOWeek(d, Number(weekStr));
          start = startOfWeek(d, { weekStartsOn: 1 });
          end = endOfWeek(d, { weekStartsOn: 1 });
        } else {
          start = startOfWeek(now, { weekStartsOn: 1 });
          end = endOfWeek(now, { weekStartsOn: 1 });
        }
      } else if (period === "monthly") {
        let d = now;
        if (monthValue) {
          const [y, m] = monthValue.split("-").map(Number);
          d = new Date(y, m - 1, 1);
        }
        start = startOfMonth(d);
        end = endOfMonth(d);
      } else if (period === "yearly") {
        let d = now;
        if (yearValue) {
          d = new Date();
          d.setFullYear(Number(yearValue), 0, 1);
        }
        start = startOfYear(d);
        end = endOfYear(d);
      } else if (period === "all") {
        start = startOfDay(new Date(2000, 0, 1));
        end = endOfDay(new Date(2099, 11, 31));
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      start = startOfDay(now);
      end = endOfDay(now);
    }
    
    onFilterChange(start, end);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex flex-wrap bg-gray-100 p-1 rounded-lg">
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${period === "daily" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setPeriod("daily")}
        >
          Día
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${period === "weekly" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setPeriod("weekly")}
        >
          Semana
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${period === "monthly" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setPeriod("monthly")}
        >
          Mes
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${period === "yearly" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setPeriod("yearly")}
        >
          Año
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${period === "all" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setPeriod("all")}
        >
          Historial
        </button>
      </div>

      <div className="flex items-center">
        {period === "daily" && (
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-auto"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        )}
        {period === "weekly" && (
          <input
            type="week"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-auto"
            value={weekValue}
            onChange={(e) => setWeekValue(e.target.value)}
          />
        )}
        {period === "monthly" && (
          <input
            type="month"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-auto"
            value={monthValue}
            onChange={(e) => setMonthValue(e.target.value)}
          />
        )}
        {period === "yearly" && (
          <input
            type="number"
            min="2000"
            max="2099"
            placeholder="YYYY"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-[120px]"
            value={yearValue}
            onChange={(e) => setYearValue(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
