import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OBSERVED_SECTION_IDS, SECTION_IDS } from "@/lib/sections";
import { installIntersectionObserverMock } from "@/test/intersection-observer-mock";
import { renderWithIntl } from "@/test/render";

import { Header } from "./header";

vi.mock("@/i18n/navigation", async () => (await import("@/test/mock-navigation")).mockNavigation);

/** Simulates a section reaching the middle of the screen. */
function installSectionScrollMock() {
  const { intersect } = installIntersectionObserverMock();

  return (id: string) => {
    const target = document.getElementById(id);
    if (!target) throw new Error(`Missing section #${id}`);
    intersect(target);
  };
}

describe("Header active section", () => {
  afterEach(() => vi.unstubAllGlobals());

  function renderPage() {
    return renderWithIntl(
      <>
        <Header />
        {OBSERVED_SECTION_IDS.map((id) => (
          <section key={id} id={id} />
        ))}
      </>,
    );
  }

  it("highlights the section in view and keeps it when switching language", () => {
    const scrollTo = installSectionScrollMock();
    renderPage();

    scrollTo("projects");

    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    expect(within(nav).getByRole("link", { name: "Projetos" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: /Ver o site em inglês/ })).toHaveAttribute(
      "href",
      "/#projects",
    );
  });

  it("clears the highlight after scrolling back up to the hero", () => {
    const scrollTo = installSectionScrollMock();
    renderPage();

    scrollTo("about");
    scrollTo("home");

    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    within(nav)
      .getAllByRole("link")
      .forEach((link) => expect(link).not.toHaveAttribute("aria-current"));
    expect(screen.getByRole("link", { name: /Ver o site em inglês/ })).toHaveAttribute("href", "/");
  });
});

describe("Header", () => {
  it("links every section of the home page, so the menu also works from other pages", () => {
    renderWithIntl(<Header />);

    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual(SECTION_IDS.map((id) => `/#${id}`));
  });

  it("points the section links to the English home page in English", () => {
    renderWithIntl(<Header />, { locale: "en" });

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/en#projects",
    );
  });

  it("links the logo to the top of the home page", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: /Início/ })).toHaveAttribute("href", "/#home");
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    renderWithIntl(<Header />);

    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Fechar menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.getElementById("mobile-navigation")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(document.getElementById("mobile-navigation")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes the mobile menu after choosing a section", async () => {
    const user = userEvent.setup();
    renderWithIntl(<Header />);

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    const mobileNav = document.getElementById("mobile-navigation");
    expect(mobileNav).not.toBeNull();

    await user.click(within(mobileNav!).getByRole("link", { name: "Projetos" }));
    expect(document.getElementById("mobile-navigation")).not.toBeInTheDocument();
  });
});
