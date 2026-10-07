import { validateContact } from "./contact-schema";
import { createContactValidatorLoader, loadContactValidator } from "./load-contact-validator";

describe("createContactValidatorLoader", () => {
  it("downloads the module once and reuses it", async () => {
    const importSchema = vi.fn().mockResolvedValue({ validateContact });
    const load = createContactValidatorLoader(importSchema);

    const [first, second] = await Promise.all([load(), load()]);
    const third = await load();

    expect(importSchema).toHaveBeenCalledTimes(1);
    expect(first).toBe(validateContact);
    expect(second).toBe(validateContact);
    expect(third).toBe(validateContact);
  });

  it("retries the download after a failure", async () => {
    const importSchema = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ validateContact });
    const load = createContactValidatorLoader(importSchema);

    await expect(load()).rejects.toThrow("offline");
    await expect(load()).resolves.toBe(validateContact);
    expect(importSchema).toHaveBeenCalledTimes(2);
  });
});

describe("loadContactValidator", () => {
  it("resolves with the real Zod-based validator", async () => {
    await expect(loadContactValidator()).resolves.toBe(validateContact);
  });
});
