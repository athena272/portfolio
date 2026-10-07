import { screen } from "@testing-library/react";

import { profile } from "@/content/profile";
import { renderWithIntl } from "@/test/render";

import { Hero } from "./hero";

describe("Hero", () => {
  // Scroll-reveal wrappers start hidden until JavaScript runs, which delays the Largest Contentful Paint.
  it("keeps the above-the-fold content outside scroll-reveal wrappers", () => {
    renderWithIntl(<Hero />);

    const heading = screen.getByRole("heading", { level: 1, name: profile.name });
    const photo = screen.getByRole("img", { name: profile.photo.alt.pt });

    expect(heading.closest("[data-reveal]")).toBeNull();
    expect(photo.closest("[data-reveal]")).toBeNull();
  });
});
