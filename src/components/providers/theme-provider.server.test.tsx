// @vitest-environment node
import { renderToString } from "react-dom/server";

import { isScriptDataBlock } from "@/test/script-data-block";

import { ThemeProvider } from "./theme-provider";

function renderThemeScript() {
  const html = renderToString(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <p>Conteúdo</p>
    </ThemeProvider>,
  );
  const [, attributes = "", body = ""] = /<script([^>]*)>([\s\S]*?)<\/script>/.exec(html) ?? [];
  const type = /\stype="([^"]*)"/.exec(attributes)?.[1];

  return { html, type, body };
}

describe("ThemeProvider on the server", () => {
  it("renders an executable theme script so the theme is applied before hydration", () => {
    const { html, type, body } = renderThemeScript();

    expect(html).toContain("<script");
    expect(isScriptDataBlock(type)).toBe(false);
    expect(body).toContain("localStorage");
  });
});
