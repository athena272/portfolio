import { render, screen } from "@testing-library/react";

import { CharacterCounter, getCharacterCountTone } from "./character-counter";

describe("getCharacterCountTone", () => {
  it.each([
    [0, 100, "default"],
    [89, 100, "default"],
    [90, 100, "warning"],
    [99, 100, "warning"],
    [100, 100, "limit"],
    [4499, 5000, "default"],
    [4500, 5000, "warning"],
    [5000, 5000, "limit"],
  ] as const)("%i of %i is '%s'", (count, max, tone) => {
    expect(getCharacterCountTone(count, max)).toBe(tone);
  });
});

describe("CharacterCounter", () => {
  it("shows count/max visually and a full sentence to screen readers", () => {
    render(<CharacterCounter id="counter" count={12} max={100} label="12 de 100 caracteres" />);

    const counter = screen.getByText("12/100");
    expect(counter).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("12 de 100 caracteres")).toHaveClass("sr-only");
  });
});
