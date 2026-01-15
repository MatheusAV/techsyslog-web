export interface CreateOrderRequest {
  orderNumber: string;
  description: string;
  value: number;
  cep: string;
  number: string;
}

export interface OrderResponse {
  orderNumber: string;
  description: string;
  value: number;
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  status: string;
  createdAt: string;
}
