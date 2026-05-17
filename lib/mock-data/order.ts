import { createMockApiResponse } from "@/lib/mock-data/shared";
import type { ApiResponse } from "@/types/api.types";
import type {
  CartItemInput,
  OrderPricingPreview,
  OrderSubmissionInput,
  OrderSubmissionResult,
} from "@/types/order.types";

const mockBasePrices: Record<string, number> = {
  "item-sekuwa": 2480,
  "item-thakali": 3200,
  "item-momo": 1880,
  "item-kheer": 980,
};

const mockVariantPrices: Record<string, number> = {
  "variant-sekuwa-regular": 2480,
  "variant-sekuwa-large": 3180,
};

const mockAddonPrices: Record<string, number> = {
  "addon-sekuwa-achaar": 280,
  "addon-thakali-rice": 220,
};

function getCartItemUnitPrice(item: CartItemInput): number {
  const variantPrice =
    item.variant_id !== undefined ? mockVariantPrices[item.variant_id] : undefined;

  return variantPrice ?? mockBasePrices[item.menu_item_id] ?? 0;
}

function getAddonTotal(item: CartItemInput): number {
  return (item.addon_ids ?? []).reduce((total, addonId) => {
    return total + (mockAddonPrices[addonId] ?? 0);
  }, 0);
}

function buildPricingPreview(items: CartItemInput[]): OrderPricingPreview {
  const subtotal = items.reduce((total, item) => {
    const unitPrice = getCartItemUnitPrice(item);
    const addonTotal = getAddonTotal(item);

    return total + (unitPrice + addonTotal) * item.quantity;
  }, 0);

  return {
    currency: "JPY",
    subtotal,
    estimated_total: subtotal,
    is_estimated: true,
  };
}

export async function submitMockOrder(
  payload: OrderSubmissionInput,
): Promise<ApiResponse<OrderSubmissionResult>> {
  return createMockApiResponse("Mock order request submitted.", {
    id: `mock-order-${payload.order_type.toLowerCase()}`,
    order_reference: `ORD-${payload.order_type}-${payload.items.length}`,
    order_status: "PENDING",
    payment_status: "PENDING",
    pricing_preview: buildPricingPreview(payload.items),
    message:
      "This is a demo order response. Backend pricing, fees, payment status, and acceptance remain authoritative.",
  });
}
