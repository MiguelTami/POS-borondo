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

export interface OrderItem {
  id: number;
  quantity: number;
  totalPriceSnapshot: string | number;
  notes?: string;
  product: {
    name: string;
  };
}

export interface SubOrder {
  id: number;
  label: string | null;
  status: string;
  subTotal: number;
  paidAmount: number;
  orderItems: OrderItem[];
}

export const orderService = {
  getOrders: async (shiftId?: number): Promise<Order[]> => {
    // Si pasamos el shiftId, filtramos por él, si el backend lo soporta, o podemos filtrar desde el front if need be.
    const params = shiftId ? { shiftId } : {};
    const response = await api.get<Order[]>("/orders", { params });
    return response.data;
  },

  createOrder: async (tableId: number): Promise<Order> => {
    const response = await api.post<Order>("/orders", { tableId });
    return response.data;
  },

  createSubOrder: async (orderId: number, label: string): Promise<SubOrder> => {
    const response = await api.post<SubOrder>(`/orders/${orderId}/sub-orders`, {
      label,
    });
    return response.data;
  },

  createOrderItem: async (
    orderId: number,
    subOrderId: number,
    productId: number,
    quantity: number,
    notes?: string,
  ): Promise<OrderItem> => {
    const response = await api.post<OrderItem>(
      `/orders/${orderId}/sub-orders/${subOrderId}/items`,
      { productId, quantity, notes },
    );
    return response.data;
  },

  sendOrderToCashier: async (orderId: number): Promise<any> => {
    const response = await api.patch(`/orders/${orderId}/send-to-cashier`);
    return response.data;
  },

  sendSubOrderToCashier: async (
    orderId: number,
    subOrderId: number,
  ): Promise<any> => {
    const response = await api.patch(
      `/orders/${orderId}/sub-orders/${subOrderId}/send-to-cashier`,
    );
    return response.data;
  },

  sendSubOrderToKitchen: async (
    orderId: number,
    subOrderId: number,
  ): Promise<any> => {
    const response = await api.patch(
      `/orders/${orderId}/sub-orders/${subOrderId}/send-to-kitchen`,
    );
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
