import { localize, resolveText } from "./localize";

describe("localize", () => {
  it("returns the text for the requested locale", () => {
    expect(localize({ pt: "Olá", en: "Hello" }, "en")).toBe("Hello");
    expect(localize({ pt: "Olá", en: "Hello" }, "pt")).toBe("Olá");
  });

  it("falls back to the default locale when the translation is blank", () => {
    expect(localize({ pt: "Olá", en: "  " }, "en")).toBe("Olá");
  });
});

describe("resolveText", () => {
  it("returns plain strings untouched", () => {
    expect(resolveText("TypeScript", "en")).toBe("TypeScript");
  });

  it("localizes translated values", () => {
    expect(resolveText({ pt: "Acessibilidade", en: "Accessibility" }, "en")).toBe("Accessibility");
  });
});
