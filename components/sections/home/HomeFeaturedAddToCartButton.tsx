'use client';

import { Check, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useCartStore } from "@/store/cart.store";

type HomeFeaturedAddToCartButtonProps = {
  defaultVariantId?: string;
  isAvailable: boolean;
  menuItemId: string;
  unavailableLabel: string;
};

export function HomeFeaturedAddToCartButton({
  defaultVariantId,
  isAvailable,
  menuItemId,
  unavailableLabel,
}: HomeFeaturedAddToCartButtonProps) {
  const tCommon = useTranslations("common");
  const addItem = useCartStore((state) => state.addItem);
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false);
  const addFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addFeedbackTimeoutRef.current) {
        clearTimeout(addFeedbackTimeoutRef.current);
      }
    };
  }, []);

  function handleAddToCart() {
    addItem({
      addonIds: [],
      menuItemId,
      quantity: 1,
      variantId: defaultVariantId,
    });

    if (addFeedbackTimeoutRef.current) {
      clearTimeout(addFeedbackTimeoutRef.current);
    }

    setIsRecentlyAdded(true);

    addFeedbackTimeoutRef.current = setTimeout(() => {
      setIsRecentlyAdded(false);
    }, 2400);
  }

  return (
    <button
      aria-label={
        isAvailable
          ? isRecentlyAdded
            ? tCommon("added")
            : tCommon("addToCart")
          : unavailableLabel
      }
      className={
        isAvailable
          ? "button-primary button-cart-action w-full sm:w-auto"
          : "button-secondary w-full opacity-60 sm:w-auto"
      }
      data-added={isAvailable && isRecentlyAdded ? "true" : "false"}
      disabled={!isAvailable}
      onClick={handleAddToCart}
      type="button"
    >
      {isAvailable ? (
        <>
          {isRecentlyAdded ? (
            <Check aria-hidden="true" size={16} strokeWidth={2.25} />
          ) : (
            <ShoppingCart aria-hidden="true" size={16} strokeWidth={2.1} />
          )}
          <span className="inline-flex min-w-[8.75rem] items-center justify-center whitespace-nowrap">
            {isRecentlyAdded ? tCommon("added") : tCommon("addToCart")}
          </span>
          <span aria-live="polite" className="sr-only">
            {isRecentlyAdded ? tCommon("added") : ""}
          </span>
        </>
      ) : (
        unavailableLabel
      )}
    </button>
  );
}
