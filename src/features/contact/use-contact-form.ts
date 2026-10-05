"use client";

import { useCallback, useReducer, useRef } from "react";

import {
  CONTACT_FIELDS,
  validateContact,
  type ContactField,
  type ContactFieldErrors,
} from "./contact-schema";
import { submitContact, type SubmitContactFailure } from "./submit-contact";

export type ContactFormStatus = "idle" | "submitting" | "success" | "error";

export type ContactFormState = {
  status: ContactFormStatus;
  fieldErrors: ContactFieldErrors;
  failure: SubmitContactFailure | null;
};

type ContactFormAction =
  | { type: "invalid"; errors: ContactFieldErrors }
  | { type: "submit" }
  | { type: "success" }
  | { type: "failure"; reason: SubmitContactFailure }
  | { type: "clearFieldError"; field: ContactField }
  | { type: "reset" };

export const initialContactFormState: ContactFormState = {
  status: "idle",
  fieldErrors: {},
  failure: null,
};

export function contactFormReducer(
  state: ContactFormState,
  action: ContactFormAction,
): ContactFormState {
  switch (action.type) {
    case "invalid":
      return { status: "idle", fieldErrors: action.errors, failure: null };
    case "submit":
      return { status: "submitting", fieldErrors: {}, failure: null };
    case "success":
      return { status: "success", fieldErrors: {}, failure: null };
    case "failure":
      return { status: "error", fieldErrors: {}, failure: action.reason };
    case "clearFieldError": {
      if (!state.fieldErrors[action.field]) return state;
      const fieldErrors = { ...state.fieldErrors };
      delete fieldErrors[action.field];
      return { ...state, fieldErrors };
    }
    case "reset":
      return initialContactFormState;
  }
}

/** Reads a form, validates it and submits it, exposing every step as explicit state. */
export function useContactForm(submit: typeof submitContact = submitContact) {
  const [state, dispatch] = useReducer(contactFormReducer, initialContactFormState);
  const inFlight = useRef(false);

  /** Resolves with the first invalid field (so the caller can focus it), or `null`. */
  const submitForm = useCallback(
    async (form: HTMLFormElement): Promise<ContactField | null> => {
      if (inFlight.current) return null;

      const formData = new FormData(form);
      const readField = (field: string) => {
        const value = formData.get(field);
        return typeof value === "string" ? value : "";
      };

      const validation = validateContact({
        name: readField("name"),
        email: readField("email"),
        message: readField("message"),
      });

      if (!validation.success) {
        dispatch({ type: "invalid", errors: validation.errors });
        return CONTACT_FIELDS.find((field) => validation.errors[field]) ?? null;
      }

      inFlight.current = true;
      dispatch({ type: "submit" });
      try {
        const result = await submit({ ...validation.data, honeypot: readField("_gotcha") });
        dispatch(result.ok ? { type: "success" } : { type: "failure", reason: result.reason });
      } catch {
        dispatch({ type: "failure", reason: "network" });
      } finally {
        inFlight.current = false;
      }
      return null;
    },
    [submit],
  );

  const clearFieldError = useCallback(
    (field: ContactField) => dispatch({ type: "clearFieldError", field }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return { state, submitForm, clearFieldError, reset };
}
