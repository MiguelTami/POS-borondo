import api from "../../../services/api";

export interface CreatePaymentPayload {
  subOrderId: number;
  shiftId: number;
  method: "CASH" | "CARD" | "MOBILE_PAYMENT";
}

export const paymentService = {
  createPayment: async (payload: CreatePaymentPayload) => {
    const response = await api.post("/payments", payload);
    return response.data;
  },
};
