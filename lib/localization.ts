import type { AppLocale } from "@/types/common.types";

export function getLocalizedField<TBase extends string>(
  record: Record<`${TBase}_${AppLocale}`, string | null | undefined>,
  base: TBase,
  locale: AppLocale,
): string {
  const localizedKey = `${base}_${locale}` as `${TBase}_${AppLocale}`;
  const fallbackKey = `${base}_en` as `${TBase}_${AppLocale}`;

  return record[localizedKey] ?? record[fallbackKey] ?? "";
}

export function getLocalizedOptionalField<TBase extends string>(
  record: Partial<Record<`${TBase}_${AppLocale}`, string | null | undefined>>,
  base: TBase,
  locale: AppLocale,
): string | undefined {
  const localizedKey = `${base}_${locale}` as `${TBase}_${AppLocale}`;
  const fallbackKey = `${base}_en` as `${TBase}_${AppLocale}`;

  return record[localizedKey] ?? record[fallbackKey] ?? undefined;
}
