import api from "../../../services/api";

export interface Order {
  id: number;
  tableId: number | null;
  shiftId: number | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  subOrders: SubOrder[];
}

export interface SubOrder {
  id: number;
  label: string | null;
  status: string;
  subTotal: number;
  paidAmount: number;
  orderItems: any[];
}

export const orderService = {
  getOrders: async (shiftId?: number): Promise<Order[]> => {
    // Si pasamos el shiftId, filtramos por él, si el backend lo soporta, o podemos filtrar desde el front if need be.
    const params = shiftId ? { shiftId } : {};
    const response = await api.get<Order[]>("/orders", { params });
    return response.data;
  },

  payOrder: async (orderId: number): Promise<any> => {
    const response = await api.patch(`/orders/${orderId}/pay`);
    return response.data;
  },

  cancelOrder: async (orderId: number): Promise<any> => {
    const response = await api.patch(`/orders/${orderId}/cancel`);
    return response.data;
  },
};
