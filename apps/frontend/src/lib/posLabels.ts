export const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  CASHIER: "Cajero",
  WAITER: "Mesero",
};

export const orderStatusLabels: Record<string, string> = {
  OPEN: "Abierta",
  SENT_TO_CASHIER: "En caja",
  SENT_TO_KITCHEN: "En cocina",
  PAID: "Pagada",
  CANCELLED: "Cancelada",
};

export const subOrderStatusLabels: Record<string, string> = {
  OPEN: "Abierta",
  SENT_TO_CASHIER: "Por enviar a cocina",
  SENT_TO_KITCHEN: "En cocina / por cobrar",
  PAID: "Pagada",
  CANCELLED: "Cancelada",
};

export const tableStatusLabels: Record<string, string> = {
  AVAILABLE: "Disponible",
  OCCUPIED: "Ocupada",
  RESERVED: "Reservada",
  OUT_OF_SERVICE: "Fuera de servicio",
};

export const paymentMethodLabels: Record<string, string> = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  MOBILE_PAYMENT: "Pago móvil",
};

export function formatRole(role?: string | null) {
  if (!role) return "";
  return roleLabels[role] || role;
}

export function formatOrderStatus(status?: string | null) {
  if (!status) return "";
  return orderStatusLabels[status] || status;
}

export function formatSubOrderStatus(status?: string | null) {
  if (!status) return "";
  return subOrderStatusLabels[status] || status;
}

export function formatTableStatus(status?: string | null) {
  if (!status) return "";
  return tableStatusLabels[status] || status;
}

export function formatPaymentMethod(method?: string | null) {
  if (!method) return "";
  return paymentMethodLabels[method] || method;
}
