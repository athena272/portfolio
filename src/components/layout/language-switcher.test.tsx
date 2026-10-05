import { screen } from "@testing-library/react";

import { renderWithIntl } from "@/test/render";

import { LanguageSwitcher } from "./language-switcher";

vi.mock("@/i18n/navigation", async () => (await import("@/test/mock-navigation")).mockNavigation);

describe("LanguageSwitcher", () => {
  it("links to the English version when the page is in Portuguese", () => {
    renderWithIntl(<LanguageSwitcher />);

    const link = screen.getByRole("link", { name: /Ver o site em inglês/ });
    expect(link).toHaveAttribute("data-locale", "en");
    expect(link).toHaveAttribute("hreflang", "en-US");
    expect(link).toHaveAttribute("href", "/");
  });

  it("links to the Portuguese version when the page is in English", () => {
    renderWithIntl(<LanguageSwitcher />, { locale: "en" });

    const link = screen.getByRole("link", { name: /View the site in Portuguese/ });
    expect(link).toHaveAttribute("data-locale", "pt");
    expect(link).toHaveAttribute("hreflang", "pt-BR");
  });

  it("keeps the current section after switching", () => {
    renderWithIntl(<LanguageSwitcher hash="projects" />);

    expect(screen.getByRole("link", { name: /Ver o site em inglês/ })).toHaveAttribute(
      "href",
      "/#projects",
    );
  });
});
