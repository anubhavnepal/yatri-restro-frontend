'use client';

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";

import { createZodResolver } from "@/lib/schema/react-hook-form";
import {
  createReservationFormDefaults,
  createReservationFormSchema,
  submitReservationForm,
  type ReservationFormInput,
} from "@/lib/schema/reservation.schema";
import { getReservationAvailability } from "@/services/reservation.service";
import { useReservationStore } from "@/store/reservation.store";
import type { AppLocale } from "@/types/common.types";
import type {
  ReservationAvailabilityResult,
  ReservationTimeSlotDTO,
} from "@/types/reservation.types";

type AvailabilityState =
  | { status: "idle"; data: null; message: null }
  | { status: "loading"; data: null; message: null }
  | { status: "success"; data: ReservationAvailabilityResult; message: string | null }
  | { status: "error"; data: null; message: string };

function getFieldErrorId(fieldName: string) {
  return `${fieldName}-error`;
}

export function ReservationShell() {
  const t = useTranslations("ReservationPage");
  const locale = useLocale() as AppLocale;
  const reservationSchema = useMemo(
    () => createReservationFormSchema(locale),
    [locale],
  );
  const availabilitySchema = useMemo(
    () =>
      z.object({
        date: reservationSchema.shape.date,
        guestCount: reservationSchema.shape.guestCount,
      }),
    [reservationSchema],
  );

  const date = useReservationStore((state) => state.date);
  const guestCount = useReservationStore((state) => state.guestCount);
  const timeSlotId = useReservationStore((state) => state.timeSlotId);
  const setPrefill = useReservationStore((state) => state.setPrefill);

  const [availabilityState, setAvailabilityState] = useState<AvailabilityState>({
    status: "idle",
    data: null,
    message: null,
  });
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionReference, setSubmissionReference] = useState<string | null>(null);

  const defaultValues = useMemo(
    () =>
      createReservationFormDefaults({
        date,
        guestCount,
        timeSlotId,
      }),
    [date, guestCount, timeSlotId],
  );

  const form = useForm<ReservationFormInput>({
    defaultValues,
    mode: "onBlur",
    resolver: createZodResolver<ReservationFormInput>(reservationSchema),
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const watchedDate = useWatch({
    control: form.control,
    name: "date",
  });
  const watchedGuestCount = useWatch({
    control: form.control,
    name: "guestCount",
  });
  const watchedTimeSlotId = useWatch({
    control: form.control,
    name: "timeSlotId",
  });

  useEffect(() => {
    setPrefill({
      date: watchedDate || undefined,
      guestCount:
        typeof watchedGuestCount === "number" && Number.isFinite(watchedGuestCount)
          ? watchedGuestCount
          : undefined,
      timeSlotId: watchedTimeSlotId || undefined,
    });
  }, [setPrefill, watchedDate, watchedGuestCount, watchedTimeSlotId]);

  const availableTimeSlots: ReservationTimeSlotDTO[] =
    availabilityState.status === "success"
      ? availabilityState.data.time_slots
      : [];

  async function handleAvailabilityPreview() {
    setSubmissionError(null);
    setSubmissionMessage(null);

    const validation = availabilitySchema.safeParse({
      date: form.getValues("date"),
      guestCount: form.getValues("guestCount"),
    });

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string") {
          form.setError(fieldName as keyof ReservationFormInput, {
            type: issue.code,
            message: issue.message,
          });
        }
      }

      return;
    }

    setAvailabilityState({
      status: "loading",
      data: null,
      message: null,
    });

    try {
      const response = await getReservationAvailability({
        date: validation.data.date,
        guest_count: validation.data.guestCount,
      });

      if (!response.success) {
        setAvailabilityState({
          status: "error",
          data: null,
          message: response.message,
        });
        return;
      }

      setAvailabilityState({
        status: "success",
        data: response.data,
        message: response.message,
      });
    } catch {
      setAvailabilityState({
        status: "error",
        data: null,
        message: t("previewError"),
      });
    }
  }

  const onSubmit = form.handleSubmit(async (rawValues) => {
    setSubmissionMessage(null);
    setSubmissionError(null);
    setSubmissionReference(null);

    try {
      const parsedValues = reservationSchema.parse(rawValues);
      const response = await submitReservationForm(parsedValues);

      if (!response.success) {
        setSubmissionError(response.message);
        return;
      }

      setSubmissionMessage(response.data.message ?? response.message);
      setSubmissionReference(response.data.reservation_reference ?? null);
    } catch {
      setSubmissionError(t("submitError"));
    }
  });

  return (
    <div className="grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.85fr)]">
      <div className="surface-panel flex flex-col gap-[var(--space-6)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] sm:py-[var(--space-8)]">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="font-serif text-3xl leading-tight tracking-[0.04em] sm:text-4xl">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-foreground-muted)] sm:text-base">
            {t("description")}
          </p>
        </div>

        <div className="section-card text-sm leading-7 text-[color:var(--color-foreground-muted)]">
          <p className="font-medium text-[color:var(--color-foreground)]">
            {t("previewTitle")}
          </p>
          <p>{t("previewDescription")}</p>
        </div>

        <form className="flex flex-col gap-[var(--space-5)]" noValidate onSubmit={onSubmit}>
          <div className="section-card gap-[var(--space-5)]">
            <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("dateLabel")}
                </span>
                <input
                  aria-describedby={
                    form.formState.errors.date ? getFieldErrorId("reservation-date") : undefined
                  }
                  className="form-control"
                  type="date"
                  {...form.register("date")}
                />
                {form.formState.errors.date ? (
                  <span
                    className="field-error"
                    id={getFieldErrorId("reservation-date")}
                    role="alert"
                  >
                    {form.formState.errors.date.message}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("guestCountLabel")}
                </span>
                <input
                  aria-describedby={
                    form.formState.errors.guestCount
                      ? getFieldErrorId("reservation-guest-count")
                      : undefined
                  }
                  className="form-control"
                  min={1}
                  step={1}
                  type="number"
                  {...form.register("guestCount", { valueAsNumber: true })}
                />
                {form.formState.errors.guestCount ? (
                  <span
                    className="field-error"
                    id={getFieldErrorId("reservation-guest-count")}
                    role="alert"
                  >
                    {form.formState.errors.guestCount.message}
                  </span>
                ) : null}
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                className="button-secondary"
                onClick={handleAvailabilityPreview}
                type="button"
              >
                {availabilityState.status === "loading"
                  ? t("previewLoading")
                  : t("previewCta")}
              </button>
              <span className="text-sm leading-7 text-[color:var(--color-foreground-soft)]">
                {t("finalAuthorityNote")}
              </span>
            </div>
          </div>

          <fieldset className="section-card gap-3">
            <legend className="text-sm font-medium text-[color:var(--color-foreground)]">
              {t("timeSlotLabel")}
            </legend>

            {availableTimeSlots.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {availableTimeSlots.map((slot) => (
                  <label
                    className="selection-card flex-col items-start justify-start gap-2 px-[var(--space-4)] py-[var(--space-4)] text-left hover:border-[color:var(--color-border-strong)]"
                    key={slot.id}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      value={slot.id}
                      {...form.register("timeSlotId")}
                    />
                    <span className="flex items-center justify-between gap-4">
                      <span className="font-medium text-[color:var(--color-foreground)]">
                        {slot.label}
                      </span>
                      <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                        {t("previewBadge")}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm text-[color:var(--color-foreground-muted)]">
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-border)] px-[var(--space-4)] py-[var(--space-4)] text-sm leading-7 text-[color:var(--color-foreground-soft)]">
                {t("timeSlotPlaceholder")}
              </p>
            )}

            {form.formState.errors.timeSlotId ? (
              <span
                className="field-error"
                id={getFieldErrorId("reservation-time-slot")}
                role="alert"
              >
                {form.formState.errors.timeSlotId.message}
              </span>
            ) : null}
          </fieldset>

          <div className="section-card gap-[var(--space-5)]">
            <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("nameLabel")}
                </span>
                <input className="form-control" type="text" {...form.register("customerName")} />
                {form.formState.errors.customerName ? (
                  <span className="field-error" role="alert">
                    {form.formState.errors.customerName.message}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("emailLabel")}
                </span>
                <input className="form-control" type="email" {...form.register("customerEmail")} />
                {form.formState.errors.customerEmail ? (
                  <span className="field-error" role="alert">
                    {form.formState.errors.customerEmail.message}
                  </span>
                ) : null}
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("phoneLabel")}
              </span>
              <input className="form-control" type="tel" {...form.register("customerPhone")} />
              {form.formState.errors.customerPhone ? (
                <span className="field-error" role="alert">
                  {form.formState.errors.customerPhone.message}
                </span>
              ) : null}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("specialRequestLabel")}
              </span>
              <textarea
                className="form-control min-h-28 resize-y"
                {...form.register("specialRequest")}
              />
              <span className="field-hint">{t("specialRequestHint")}</span>
              {form.formState.errors.specialRequest ? (
                <span className="field-error" role="alert">
                  {form.formState.errors.specialRequest.message}
                </span>
              ) : null}
            </label>
          </div>

          <div className="divider-top flex flex-col gap-3">
            <button className="button-primary w-full sm:w-fit" type="submit">
              {form.formState.isSubmitting ? t("submitLoading") : t("submitCta")}
            </button>

            <div aria-live="polite" className="min-h-6 text-sm">
              {submissionMessage ? (
                <p className="text-[color:var(--color-accent-strong)]">
                  {submissionMessage}
                </p>
              ) : null}
              {submissionReference ? (
                <p className="text-[color:var(--color-foreground-muted)]">
                  {t("referenceLabel")}: <span className="font-medium">{submissionReference}</span>
                </p>
              ) : null}
              {submissionError ? (
                <p className="field-error" role="alert">
                  {submissionError}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      </div>

      <aside className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] lg:sticky lg:top-[var(--space-6)] lg:self-start">
        <h2 className="font-serif text-2xl tracking-[0.04em]">{t("sidebarTitle")}</h2>
        <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
          {t("sidebarDescription")}
        </p>

        <div
          aria-busy={availabilityState.status === "loading"}
          aria-live="polite"
          className="section-card"
        >
          {availabilityState.status === "success" ? (
            <div className="flex flex-col gap-2 text-sm leading-7">
              <p className="font-medium text-[color:var(--color-foreground)]">
                {availabilityState.data.available
                  ? t("previewAvailable")
                  : t("previewUnavailable")}
              </p>
              <p className="text-[color:var(--color-foreground-muted)]">
                {availabilityState.data.note ?? availabilityState.message}
              </p>
            </div>
          ) : null}

          {availabilityState.status === "loading" ? (
            <p className="text-sm text-[color:var(--color-foreground-muted)]">
              {t("previewLoading")}
            </p>
          ) : null}

          {availabilityState.status === "error" ? (
            <p className="field-error" role="alert">
              {availabilityState.message}
            </p>
          ) : null}

          {availabilityState.status === "idle" ? (
            <p className="text-sm text-[color:var(--color-foreground-soft)]">
              {t("previewIdle")}
            </p>
          ) : null}
        </div>

        <div className="support-note">
          <p className="support-note-title">
            {t("confirmationTitle")}
          </p>
          <p>{t("confirmationDescription")}</p>
        </div>
      </aside>
    </div>
  );
}
