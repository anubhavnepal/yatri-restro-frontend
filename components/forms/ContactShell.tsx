'use client';

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";

import { createZodResolver } from "@/lib/schema/react-hook-form";
import {
  createContactFormDefaults,
  createContactFormSchema,
  submitContactFormValues,
  type ContactFormInputValues,
} from "@/lib/schema/contact.schema";
import {
  createNewsletterFormDefaults,
  createNewsletterFormSchema,
  submitNewsletterFormValues,
  type NewsletterFormInputValues,
} from "@/lib/schema/newsletter.schema";
import type { AppLocale } from "@/types/common.types";

export function ContactShell() {
  const t = useTranslations("ContactPage");
  const locale = useLocale() as AppLocale;
  const [contactMessage, setContactMessage] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  const contactSchema = useMemo(() => createContactFormSchema(locale), [locale]);
  const newsletterSchema = useMemo(
    () => createNewsletterFormSchema(locale),
    [locale],
  );

  const contactForm = useForm<ContactFormInputValues>({
    defaultValues: createContactFormDefaults(),
    mode: "onBlur",
    resolver: createZodResolver<ContactFormInputValues>(contactSchema),
  });

  const newsletterForm = useForm<NewsletterFormInputValues>({
    defaultValues: createNewsletterFormDefaults(locale),
    mode: "onBlur",
    resolver: createZodResolver<NewsletterFormInputValues>(newsletterSchema),
  });

  const onContactSubmit = contactForm.handleSubmit(async (rawValues) => {
    setContactMessage(null);
    setContactError(null);

    try {
      const parsedValues = contactSchema.parse(rawValues);
      const response = await submitContactFormValues(parsedValues);

      if (!response.success) {
        setContactError(response.message);
        return;
      }

      setContactMessage(t("contactSuccess"));
      contactForm.reset(createContactFormDefaults());
    } catch {
      setContactError(t("contactError"));
    }
  });

  const onNewsletterSubmit = newsletterForm.handleSubmit(async (rawValues) => {
    setNewsletterMessage(null);
    setNewsletterError(null);

    try {
      const parsedValues = newsletterSchema.parse(rawValues);
      const response = await submitNewsletterFormValues(parsedValues);

      if (!response.success) {
        setNewsletterError(response.message);
        return;
      }

      setNewsletterMessage(t("newsletterSuccess"));
      newsletterForm.reset(createNewsletterFormDefaults(locale));
    } catch {
      setNewsletterError(t("newsletterError"));
    }
  });

  return (
    <div className="grid gap-[var(--space-6)] lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
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

        <form className="flex flex-col gap-[var(--space-5)]" noValidate onSubmit={onContactSubmit}>
          <div className="section-card gap-[var(--space-5)]">
            <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("nameLabel")}
                </span>
                <input className="form-control" type="text" {...contactForm.register("name")} />
                {contactForm.formState.errors.name ? (
                  <span className="field-error" role="alert">
                    {contactForm.formState.errors.name.message}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("emailLabel")}
                </span>
                <input className="form-control" type="email" {...contactForm.register("email")} />
                {contactForm.formState.errors.email ? (
                  <span className="field-error" role="alert">
                    {contactForm.formState.errors.email.message}
                  </span>
                ) : null}
              </label>
            </div>

            <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("phoneLabel")}
                </span>
                <input className="form-control" type="tel" {...contactForm.register("phone")} />
                {contactForm.formState.errors.phone ? (
                  <span className="field-error" role="alert">
                    {contactForm.formState.errors.phone.message}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                  {t("subjectLabel")}
                </span>
                <input className="form-control" type="text" {...contactForm.register("subject")} />
                {contactForm.formState.errors.subject ? (
                  <span className="field-error" role="alert">
                    {contactForm.formState.errors.subject.message}
                  </span>
                ) : null}
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                {t("messageLabel")}
              </span>
              <textarea className="form-control min-h-36 resize-y" {...contactForm.register("message")} />
              <span className="field-hint">{t("contactHint")}</span>
              {contactForm.formState.errors.message ? (
                <span className="field-error" role="alert">
                  {contactForm.formState.errors.message.message}
                </span>
              ) : null}
            </label>
          </div>

          <div className="divider-top flex flex-col gap-3">
            <button className="button-primary w-full sm:w-fit" type="submit">
              {contactForm.formState.isSubmitting ? t("contactSubmitting") : t("contactSubmit")}
            </button>

            <div aria-live="polite" className="min-h-6 text-sm">
              {contactMessage ? (
                <p className="text-[color:var(--color-accent-strong)]">{contactMessage}</p>
              ) : null}
              {contactError ? (
                <p className="field-error" role="alert">
                  {contactError}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      </div>

      <aside className="surface-panel flex flex-col gap-[var(--space-5)] px-[var(--space-5)] py-[var(--space-6)] sm:px-[var(--space-6)] lg:sticky lg:top-[var(--space-6)] lg:self-start">
        <h2 className="font-serif text-2xl tracking-[0.04em]">{t("newsletterTitle")}</h2>
        <p className="text-sm leading-7 text-[color:var(--color-foreground-muted)]">
          {t("newsletterDescription")}
        </p>
        <p className="support-note">
          {t("newsletterHint")}
        </p>

        <form className="section-card gap-[var(--space-4)]" noValidate onSubmit={onNewsletterSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[color:var(--color-foreground)]">
              {t("newsletterEmailLabel")}
            </span>
            <input
              className="form-control"
              type="email"
              {...newsletterForm.register("email")}
            />
            {newsletterForm.formState.errors.email ? (
              <span className="field-error" role="alert">
                {newsletterForm.formState.errors.email.message}
              </span>
            ) : null}
          </label>

          <button className="button-secondary w-full" type="submit">
            {newsletterForm.formState.isSubmitting
              ? t("newsletterSubmitting")
              : t("newsletterSubmit")}
          </button>

          <div aria-live="polite" className="min-h-6 text-sm">
            {newsletterMessage ? (
              <p className="text-[color:var(--color-accent-strong)]">{newsletterMessage}</p>
            ) : null}
            {newsletterError ? (
              <p className="field-error" role="alert">
                {newsletterError}
              </p>
            ) : null}
          </div>
        </form>
      </aside>
    </div>
  );
}
