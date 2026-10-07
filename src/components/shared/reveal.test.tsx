import { render, screen } from "@testing-library/react";

import { installIntersectionObserverMock } from "@/test/intersection-observer-mock";

import { Reveal } from "./reveal";

function getRevealWrapper() {
  const wrapper = screen.getByText("Conteúdo").closest("[data-reveal]");
  if (!(wrapper instanceof HTMLElement)) throw new Error("Missing reveal wrapper");
  return wrapper;
}

describe("Reveal", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("starts hidden until it scrolls into view", () => {
    const observer = installIntersectionObserverMock();
    render(<Reveal>Conteúdo</Reveal>);

    const wrapper = getRevealWrapper();
    expect(wrapper).toHaveAttribute("data-revealed", "false");
    expect(wrapper).toHaveClass("opacity-0");
    expect(observer.isObserved(wrapper)).toBe(true);
    expect(observer.optionsFor(wrapper)).toEqual({ rootMargin: "0px 0px -64px 0px" });
  });

  it("reveals the content once it intersects and stops observing", () => {
    const observer = installIntersectionObserverMock();
    render(<Reveal>Conteúdo</Reveal>);

    const wrapper = getRevealWrapper();
    observer.intersect(wrapper);

    expect(wrapper).toHaveAttribute("data-revealed", "true");
    expect(wrapper).toHaveClass("opacity-100");
    expect(wrapper).not.toHaveClass("opacity-0");
    expect(observer.isObserved(wrapper)).toBe(false);
  });

  it("stays revealed after leaving the viewport", () => {
    const observer = installIntersectionObserverMock();
    const { rerender } = render(<Reveal>Conteúdo</Reveal>);

    observer.intersect(getRevealWrapper());
    rerender(<Reveal>Conteúdo</Reveal>);

    expect(getRevealWrapper()).toHaveAttribute("data-revealed", "true");
  });

  it("shows the content right away when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal>Conteúdo</Reveal>);

    expect(getRevealWrapper()).toHaveAttribute("data-revealed", "true");
  });

  it("applies the delay to the transition and keeps custom classes", () => {
    installIntersectionObserverMock();
    render(
      <Reveal delay={0.15} className="h-full">
        Conteúdo
      </Reveal>,
    );

    const wrapper = getRevealWrapper();
    expect(wrapper).toHaveStyle({ transitionDelay: "0.15s" });
    expect(wrapper).toHaveClass("h-full");
  });

  it("drops the slide, keeping only the fade, when reduced motion is requested", () => {
    installIntersectionObserverMock();
    render(<Reveal>Conteúdo</Reveal>);

    expect(getRevealWrapper()).toHaveClass("motion-reduce:translate-y-0");
  });
});
