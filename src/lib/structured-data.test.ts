import { buildPersonJsonLd, serializeJsonLd } from "./structured-data";

describe("buildPersonJsonLd", () => {
  it("describes the site owner in the requested locale", () => {
    const data = buildPersonJsonLd("en");

    expect(data).toMatchObject({
      "@type": "Person",
      name: "Guilherme Rosário Alves",
      jobTitle: "Full Stack Developer",
      inLanguage: "en-US",
    });
    expect(data.sameAs).toEqual([
      "https://www.linkedin.com/in/guigorosario/",
      "https://github.com/athena272",
    ]);
  });
});

describe("serializeJsonLd", () => {
  it("escapes '<' so the payload can't close the script tag", () => {
    const json = serializeJsonLd({ text: "</script><script>alert(1)</script>" });

    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({ text: "</script><script>alert(1)</script>" });
  });
});
