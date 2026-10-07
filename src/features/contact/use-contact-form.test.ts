import { act, renderHook } from "@testing-library/react";

import { validateContact } from "./contact-schema";
import type { ContactValidatorLoader } from "./load-contact-validator";
import type { SubmitContactResult } from "./submit-contact";
import {
  contactFormReducer,
  initialContactFormState,
  useContactForm,
  type ContactFormState,
} from "./use-contact-form";

const validInput = {
  name: "Ana Souza",
  email: "ana@empresa.com",
  message: "Olá! Gostaria de conversar sobre uma vaga.",
};

function buildForm(values: Record<string, string>): HTMLFormElement {
  const form = document.createElement("form");
  for (const [name, value] of Object.entries({ _gotcha: "", ...values })) {
    const input = document.createElement("input");
    input.name = name;
    input.value = value;
    form.append(input);
  }
  return form;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("useContactForm", () => {
  it("shows a network error and does not send when the validator fails to load", async () => {
    const submit = vi.fn();
    const loadValidator = vi.fn<ContactValidatorLoader>().mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useContactForm(submit, loadValidator));

    await act(() => result.current.submitForm(buildForm(validInput)));

    expect(submit).not.toHaveBeenCalled();
    expect(result.current.state).toEqual({ status: "error", fieldErrors: {}, failure: "network" });
  });

  it("lets the visitor retry after the validator failed to load", async () => {
    const submit = vi.fn().mockResolvedValue({ ok: true } satisfies SubmitContactResult);
    const loadValidator = vi
      .fn<ContactValidatorLoader>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(validateContact);
    const { result } = renderHook(() => useContactForm(submit, loadValidator));

    await act(() => result.current.submitForm(buildForm(validInput)));
    await act(() => result.current.submitForm(buildForm(validInput)));

    expect(submit).toHaveBeenCalledTimes(1);
    expect(result.current.state.status).toBe("success");
  });

  it("sends only once when submitted repeatedly while the validator is still loading", async () => {
    const submit = vi.fn().mockResolvedValue({ ok: true } satisfies SubmitContactResult);
    const validator = deferred<typeof validateContact>();
    const { result } = renderHook(() => useContactForm(submit, () => validator.promise));

    const form = buildForm(validInput);
    let first!: Promise<unknown>;
    let second!: Promise<unknown>;
    act(() => {
      first = result.current.submitForm(form);
      second = result.current.submitForm(form);
    });
    validator.resolve(validateContact);
    await act(() => Promise.all([first, second]));

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("returns the first invalid field so the form can focus it", async () => {
    const submit = vi.fn();
    const { result } = renderHook(() =>
      useContactForm(submit, () => Promise.resolve(validateContact)),
    );

    let invalidField: unknown;
    await act(async () => {
      invalidField = await result.current.submitForm(
        buildForm({ ...validInput, email: "invalido" }),
      );
    });

    expect(invalidField).toBe("email");
    expect(result.current.state.fieldErrors).toEqual({ email: "emailInvalid" });
    expect(submit).not.toHaveBeenCalled();
  });

  it("preloads the validator without surfacing a failed download", async () => {
    const loadValidator = vi.fn<ContactValidatorLoader>().mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useContactForm(vi.fn(), loadValidator));

    await act(async () => result.current.preloadValidator());

    expect(loadValidator).toHaveBeenCalledTimes(1);
    expect(result.current.state).toEqual(initialContactFormState);
  });
});

describe("contactFormReducer", () => {
  it("goes from idle to submitting, clearing previous errors", () => {
    const withErrors: ContactFormState = {
      status: "error",
      fieldErrors: { name: "nameTooShort" },
      failure: "network",
    };

    expect(contactFormReducer(withErrors, { type: "submit" })).toEqual({
      status: "submitting",
      fieldErrors: {},
      failure: null,
    });
  });

  it("stores the failure reason", () => {
    const state = contactFormReducer(initialContactFormState, {
      type: "failure",
      reason: "timeout",
    });
    expect(state).toEqual({ status: "error", fieldErrors: {}, failure: "timeout" });
  });

  it("clears a single field error and keeps the others", () => {
    const state = contactFormReducer(
      { ...initialContactFormState, fieldErrors: { name: "nameTooShort", email: "emailInvalid" } },
      { type: "clearFieldError", field: "name" },
    );
    expect(state.fieldErrors).toEqual({ email: "emailInvalid" });
  });

  it("returns the same state when the field has no error", () => {
    const state = { ...initialContactFormState, fieldErrors: { email: "emailInvalid" as const } };
    expect(contactFormReducer(state, { type: "clearFieldError", field: "name" })).toBe(state);
  });

  it("resets to the initial state", () => {
    const state = contactFormReducer(
      { status: "success", fieldErrors: {}, failure: null },
      { type: "reset" },
    );
    expect(state).toEqual(initialContactFormState);
  });
});
