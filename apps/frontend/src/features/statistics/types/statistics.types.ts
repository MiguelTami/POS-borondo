export interface SummaryData {
  totalRevenue: number;
  ordersCount: number;
  shiftsCount: number;
  averageOrderValue: number;
  revenueByMethod: Record<string, number>;
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
