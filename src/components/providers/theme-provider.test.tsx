import { render, screen } from "@testing-library/react";

import { isScriptDataBlock } from "@/test/script-data-block";

import { ThemeProvider } from "./theme-provider";

function renderThemeProvider(props: Partial<Parameters<typeof ThemeProvider>[0]> = {}) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      <p>Conteúdo</p>
    </ThemeProvider>,
  );
}

describe("ThemeProvider on the client", () => {
  it("renders its children", () => {
    renderThemeProvider();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("renders the theme script as a data block, which React accepts on the client", () => {
    const { container } = renderThemeProvider();
    const script = container.querySelector("script");

    expect(script).not.toBeNull();
    expect(isScriptDataBlock(script?.getAttribute("type"))).toBe(true);
  });

  it("keeps the remaining script props from the caller", () => {
    const { container } = renderThemeProvider({ scriptProps: { id: "theme-script" } });
    const script = container.querySelector("script");

    expect(script).toHaveAttribute("id", "theme-script");
    expect(isScriptDataBlock(script?.getAttribute("type"))).toBe(true);
  });
});
