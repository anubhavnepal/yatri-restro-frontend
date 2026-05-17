import { z } from "zod";

import {
  EMAIL_PATTERN,
  FORM_LIMITS,
  getValidationMessages,
  normalizeOptionalText,
  PHONE_NUMBER_PATTERN,
  POSTAL_CODE_PATTERN,
} from "@/lib/schema/shared";
import { submitOrder } from "@/services/order.service";
import type { AppLocale } from "@/types/common.types";
import type { CartItemInput, OrderSubmissionInput, OrderType } from "@/types/order.types";

export type OrderCheckoutCartSelection = {
  menuItemId: string;
  quantity: number;
  variantId?: string;
  addonIds?: string[];
};

export function createOrderCheckoutFormSchema(locale: AppLocale = "en") {
  const messages = getValidationMessages(locale);

  return z
    .object({
      orderType: z.enum(["DINE_IN", "DELIVERY"]),
      paymentMethod: z.enum(["COD", "PAY_AT_RESTAURANT"]),
      customerName: z
        .string()
        .trim()
        .min(1, messages.common.nameRequired)
        .max(FORM_LIMITS.customerNameMaxLength, messages.common.nameTooLong),
      customerPhone: z
        .string()
        .trim()
        .min(1, messages.common.phoneRequired)
        .max(FORM_LIMITS.phoneMaxLength, messages.common.phoneTooLong)
        .regex(PHONE_NUMBER_PATTERN, messages.common.phoneInvalid),
      customerEmail: z
        .string()
        .trim()
        .max(FORM_LIMITS.emailMaxLength, messages.common.emailTooLong)
        .or(z.literal(""))
        .transform((value) => normalizeOptionalText(value))
        .refine(
          (value) => value === undefined || EMAIL_PATTERN.test(value),
          messages.common.emailInvalid,
        ),
      deliveryAddressLine1: z
        .string()
        .trim()
        .max(FORM_LIMITS.shortTextMaxLength, messages.order.addressLine1TooLong)
        .or(z.literal(""))
        .transform((value) => normalizeOptionalText(value)),
      deliveryAddressLine2: z
        .string()
        .trim()
        .max(FORM_LIMITS.shortTextMaxLength, messages.order.addressLine2TooLong)
        .or(z.literal(""))
        .transform((value) => normalizeOptionalText(value)),
      deliveryCity: z
        .string()
        .trim()
        .max(FORM_LIMITS.shortTextMaxLength, messages.order.cityTooLong)
        .or(z.literal(""))
        .transform((value) => normalizeOptionalText(value)),
      deliveryPostalCode: z
        .string()
        .trim()
        .max(FORM_LIMITS.shortTextMaxLength, messages.order.postalCodeTooLong)
        .or(z.literal(""))
        .transform((value) => normalizeOptionalText(value))
        .refine(
          (value) => value === undefined || POSTAL_CODE_PATTERN.test(value),
          messages.order.postalCodeInvalid,
        ),
      specialRequest: z
        .string()
        .trim()
        .max(
          FORM_LIMITS.specialRequestMaxLength,
          messages.common.specialRequestTooLong,
        )
        .or(z.literal(""))
        .transform((value) => normalizeOptionalText(value)),
    })
    .superRefine((value, context) => {
      if (value.orderType !== "DELIVERY") {
        return;
      }

      if (!value.deliveryAddressLine1) {
        context.addIssue({
          code: "custom",
          path: ["deliveryAddressLine1"],
          message: messages.order.addressLine1Required,
        });
      }

      if (!value.deliveryCity) {
        context.addIssue({
          code: "custom",
          path: ["deliveryCity"],
          message: messages.order.cityRequired,
        });
      }

      if (!value.deliveryPostalCode) {
        context.addIssue({
          code: "custom",
          path: ["deliveryPostalCode"],
          message: messages.order.postalCodeRequired,
        });
      }
    });
}

export type OrderCheckoutFormInput = z.input<
  ReturnType<typeof createOrderCheckoutFormSchema>
>;

export type OrderCheckoutFormValues = z.output<
  ReturnType<typeof createOrderCheckoutFormSchema>
>;

export type OrderSubmitResult = Awaited<ReturnType<typeof submitOrder>>;

export function createOrderCheckoutFormDefaults(
  orderType: OrderType = "DINE_IN",
): OrderCheckoutFormInput {
  return {
    orderType,
    paymentMethod: orderType === "DELIVERY" ? "COD" : "PAY_AT_RESTAURANT",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddressLine1: "",
    deliveryAddressLine2: "",
    deliveryCity: "",
    deliveryPostalCode: "",
    specialRequest: "",
  };
}

export function mapCartSelectionToOrderItemInput(
  item: OrderCheckoutCartSelection,
): CartItemInput {
  return {
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    variant_id: item.variantId,
    addon_ids: item.addonIds && item.addonIds.length > 0 ? item.addonIds : undefined,
  };
}

export function mapCartSelectionsToOrderItemInputs(
  items: OrderCheckoutCartSelection[],
): CartItemInput[] {
  return items.map(mapCartSelectionToOrderItemInput);
}

export function mapOrderCheckoutFormValuesToSubmissionInput(
  values: OrderCheckoutFormValues,
  items: OrderCheckoutCartSelection[],
): OrderSubmissionInput {
  return {
    order_type: values.orderType,
    payment_method: values.paymentMethod,
    customer_name: values.customerName,
    customer_phone: values.customerPhone,
    customer_email: values.customerEmail,
    delivery_address:
      values.orderType === "DELIVERY"
        ? {
            address_line_1: values.deliveryAddressLine1 ?? "",
            address_line_2: values.deliveryAddressLine2,
            city: values.deliveryCity ?? "",
            postal_code: values.deliveryPostalCode ?? "",
          }
        : undefined,
    items: mapCartSelectionsToOrderItemInputs(items),
    special_request: values.specialRequest,
  };
}

export function submitOrderCheckoutForm(
  values: OrderCheckoutFormValues,
  items: OrderCheckoutCartSelection[],
): Promise<OrderSubmitResult> {
  return submitOrder(mapOrderCheckoutFormValuesToSubmissionInput(values, items));
}
