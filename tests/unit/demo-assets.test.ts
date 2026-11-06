import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("demo tattoo SVG assets", () => {
  const dir = join(process.cwd(), "public/demo/tattoos");
  const files = readdirSync(dir).filter((name) => name.endsWith(".svg"));

  it("ships the expected demo files", () => {
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps SVG files as well-formed UTF-8 XML without mojibake", () => {
    for (const file of files) {
      const contents = readFileSync(join(dir, file), "utf8");
      expect(contents.startsWith("<svg")).toBe(true);
      expect(contents.trimEnd().endsWith("</svg>")).toBe(true);
      expect(contents.includes("\uFFFD")).toBe(false);
      expect(contents).toMatch(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    }
  });
});
