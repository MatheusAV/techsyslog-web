export interface RegisterDeliveryRequest {
  orderNumber: string;
  deliveredAt?: string | null; // ISO string
}
