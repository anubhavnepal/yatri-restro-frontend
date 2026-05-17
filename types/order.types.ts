import type { CurrencyCode } from "@/types/common.types";

export type OrderType = "DINE_IN" | "DELIVERY";

export type PaymentMethod = "COD" | "PAY_AT_RESTAURANT";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type CartItemInput = {
  menu_item_id: string;
  quantity: number;
  variant_id?: string;
  addon_ids?: string[];
  note?: string;
};

export type DeliveryAddressInput = {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postal_code: string;
};

export type OrderSubmissionInput = {
  order_type: OrderType;
  payment_method: PaymentMethod;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address?: DeliveryAddressInput;
  items: CartItemInput[];
  special_request?: string;
};

export type OrderPricingPreview = {
  currency: CurrencyCode;
  subtotal: number;
  estimated_total: number;
  is_estimated: true;
};

export type OrderSubmissionResult = {
  id: string;
  order_reference?: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  pricing_preview?: OrderPricingPreview;
  message?: string;
};
