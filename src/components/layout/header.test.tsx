import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OBSERVED_SECTION_IDS, SECTION_IDS } from "@/lib/sections";
import { renderWithIntl } from "@/test/render";

import { Header } from "./header";

vi.mock("@/i18n/navigation", async () => (await import("@/test/mock-navigation")).mockNavigation);

/** Captures the observer callback so tests can simulate a section reaching the middle of the screen. */
function installIntersectionObserverMock() {
  let notify: IntersectionObserverCallback = () => {};
  const observed = new Set<Element>();

  class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      notify = callback;
    }
    observe(element: Element) {
      observed.add(element);
    }
    unobserve(element: Element) {
      observed.delete(element);
    }
    disconnect() {
      observed.clear();
    }
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  return (id: string) =>
    act(() => {
      const target = document.getElementById(id);
      if (!target) throw new Error(`Missing section #${id}`);
      if (!observed.has(target)) return;
      notify(
        [{ target, isIntersecting: true } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
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
    const scrollTo = installIntersectionObserverMock();
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
    const scrollTo = installIntersectionObserverMock();
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
