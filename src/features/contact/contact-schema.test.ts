import { CONTACT_LIMITS } from "./contact-fields";
import { validateContact } from "./contact-schema";

const valid = {
  name: "Ana Souza",
  email: "ana@empresa.com",
  message: "Olá! Gostaria de conversar sobre uma vaga.",
};

describe("validateContact", () => {
  it("accepts valid input and trims every field", () => {
    const result = validateContact({
      name: "  Ana Souza ",
      email: " ana@empresa.com ",
      message: `  ${valid.message}  `,
    });

    expect(result).toEqual({ success: true, data: valid });
  });

  it("reports one translation key per invalid field", () => {
    const result = validateContact({ name: "A", email: "not-an-email", message: "curta" });

    expect(result).toEqual({
      success: false,
      errors: { name: "nameTooShort", email: "emailInvalid", message: "messageTooShort" },
    });
  });

  it("treats whitespace-only values as empty", () => {
    const result = validateContact({ name: "   ", email: "   ", message: "          " });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual({
        name: "nameTooShort",
        email: "emailInvalid",
        message: "messageTooShort",
      });
    }
  });

  it("rejects values above the limits", () => {
    const result = validateContact({
      ...valid,
      name: "a".repeat(CONTACT_LIMITS.name.max + 1),
      message: "a".repeat(CONTACT_LIMITS.message.max + 1),
    });

    expect(result).toEqual({
      success: false,
      errors: { name: "nameTooLong", message: "messageTooLong" },
    });
  });
});
