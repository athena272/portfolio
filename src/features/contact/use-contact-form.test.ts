import {
  contactFormReducer,
  initialContactFormState,
  type ContactFormState,
} from "./use-contact-form";

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
