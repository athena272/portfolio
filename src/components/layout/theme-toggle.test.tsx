import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithIntl } from "@/test/render";

import { ThemeToggle } from "./theme-toggle";

const setTheme = vi.fn();
let resolvedTheme: "light" | "dark" = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme, setTheme }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => setTheme.mockClear());

  it("switches from light to dark", async () => {
    resolvedTheme = "light";
    renderWithIntl(<ThemeToggle />);

    await userEvent.click(screen.getByRole("button", { name: "Ativar tema escuro" }));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches from dark to light", async () => {
    resolvedTheme = "dark";
    renderWithIntl(<ThemeToggle />, { locale: "en" });

    await userEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
