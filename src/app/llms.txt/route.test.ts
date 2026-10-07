import { buildLlmsTxt } from "@/lib/llms-txt";

import { dynamic, GET } from "./route";

describe("GET /llms.txt", () => {
  it("serves the generated Markdown", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(await response.text()).toBe(buildLlmsTxt());
  });

  it("is generated at build time", () => {
    expect(dynamic).toBe("force-static");
  });
});
