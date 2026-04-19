export interface SummaryData {
  totalRevenue: number;
  expectedRevenue: number;
  declaredCash: number;
  difference: number;
  ordersCount: number;
  shiftsCount: number;
  averageOrderValue: number;
  averageSubOrderValue: number;
  revenueByMethod: Record<string, number>;
  revenueOverTime: { date: string; amount: number }[];
}

export interface TopProduct {
  id: number;
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
}

export interface TopIngredient {
  id: number;
  name: string;
  unit: string;
  quantityUsed: number;
}

export interface ShiftSubOrderData {
  id: number;
  label: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
  payments: any[];
}

export interface ShiftOrderData {
  id: number;
  dailyOrderNumber: number;
  status: string;
  createdAt: string;
  waiter: string;
  table: number;
  total: number;
  payments: any[];
  items: any[];
  subOrders: ShiftSubOrderData[];
}

export interface ShiftOrdersResponse {
  shiftId: number;
  openedAt: string;
  closedAt: string | null;
  orders: ShiftOrderData[];
}

export interface StatisticsFilters {
  startDate?: string;
  endDate?: string;
  limit?: number;
}
