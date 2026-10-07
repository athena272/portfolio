"use client";

import { CircleAlert, CircleCheck, RotateCcw, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";

import { Button } from "@/components/ui/button";
import { CharacterCounter } from "@/components/ui/character-counter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { CONTACT_LIMITS, type ContactField } from "./contact-fields";
import { submitContact } from "./submit-contact";
import { useContactForm } from "./use-contact-form";

type ContactFormProps = {
  /** Injectable for tests and previews. */
  submit?: typeof submitContact;
};

export function ContactForm({ submit = submitContact }: ContactFormProps) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const submitWithLocale = useCallback<typeof submitContact>(
    (submission) => submit({ ...submission, locale }),
    [submit, locale],
  );
  const { state, submitForm, preloadValidator, clearFieldError, reset } =
    useContactForm(submitWithLocale);
  const formRef = useRef<HTMLFormElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const idPrefix = useId();

  const isSubmitting = state.status === "submitting";

  useEffect(() => {
    if (state.status === "success") successHeadingRef.current?.focus();
  }, [state.status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const invalidField = await submitForm(form);
    if (invalidField) {
      const element = form.elements.namedItem(invalidField);
      if (element instanceof HTMLElement) element.focus();
    }
  };

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CircleCheck className="size-12 text-success" aria-hidden="true" />
        <h3 ref={successHeadingRef} tabIndex={-1} className="text-xl font-semibold outline-none">
          {t("form.successTitle")}
        </h3>
        <p className="text-muted-foreground" role="status">
          {t("form.successDescription")}
        </p>
        <Button variant="outline" className="mt-2" onClick={reset}>
          {t("form.sendAnother")}
        </Button>
      </div>
    );
  }

  const fieldProps = (field: ContactField) => {
    const error = state.fieldErrors[field];
    return {
      id: `${idPrefix}-${field}`,
      name: field,
      onEdit: () => clearFieldError(field),
      error: error ? t(`errors.${error}`) : undefined,
    };
  };

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      onFocus={preloadValidator}
      onPointerDown={preloadValidator}
      aria-busy={isSubmitting}
      className="flex flex-col gap-5"
    >
      <fieldset disabled={isSubmitting} className="flex flex-col gap-5">
        <Field label={t("form.name")} maxLength={CONTACT_LIMITS.name.max} {...fieldProps("name")}>
          {(props) => (
            <Input
              {...props}
              autoComplete="name"
              placeholder={t("form.namePlaceholder")}
              required
            />
          )}
        </Field>

        <Field label={t("form.email")} {...fieldProps("email")}>
          {(props) => (
            <Input
              {...props}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t("form.emailPlaceholder")}
              required
            />
          )}
        </Field>

        <Field
          label={t("form.message")}
          maxLength={CONTACT_LIMITS.message.max}
          {...fieldProps("message")}
        >
          {(props) => (
            <Textarea {...props} rows={5} placeholder={t("form.messagePlaceholder")} required />
          )}
        </Field>

        <div aria-hidden="true" className="hidden">
          <label>
            Leave this field empty
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </fieldset>

      {state.status === "error" && state.failure && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex items-start gap-2">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            {t(`errors.${state.failure}`)}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="shrink-0"
            onClick={() => formRef.current?.requestSubmit()}
          >
            <RotateCcw aria-hidden="true" />
            {t("form.retry")}
          </Button>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto sm:self-start"
      >
        {isSubmitting ? <Spinner /> : <Send aria-hidden="true" />}
        {isSubmitting ? t("form.submitting") : t("form.submit")}
      </Button>

      <p role="status" aria-live="polite" className="sr-only">
        {isSubmitting ? t("form.submitting") : ""}
      </p>
    </form>
  );
}

type FieldControlProps = {
  id: string;
  name: ContactField;
  maxLength?: number;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type FieldProps = {
  id: string;
  name: ContactField;
  label: string;
  error?: string;
  /** Applied to the control and shown as a character counter next to the label. */
  maxLength?: number;
  onEdit: () => void;
  children: (props: FieldControlProps) => ReactElement;
};

function Field({ id, name, label, error, maxLength, onEdit, children }: FieldProps) {
  const t = useTranslations("contact.form");
  const [length, setLength] = useState(0);
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;
  const describedBy = [error && errorId, maxLength !== undefined && counterId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {maxLength !== undefined && (
          <CharacterCounter
            id={counterId}
            count={length}
            max={maxLength}
            label={t("characterCount", { count: length, max: maxLength })}
          />
        )}
      </div>
      {children({
        id,
        name,
        maxLength,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
        onChange: (event) => {
          setLength(event.currentTarget.value.length);
          onEdit();
        },
      })}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
