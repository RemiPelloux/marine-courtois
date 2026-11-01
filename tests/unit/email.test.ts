import { decodeEmail, encodeEmail } from "@/lib/utils/email";
import { RESEARCHER } from "@/data/researcher";
import fs from "node:fs";
import path from "node:path";

describe("protected email", () => {
  it("round-trips through the obfuscation", () => {
    expect(decodeEmail(encodeEmail("a.b@c.fr"))).toBe("a.b@c.fr");
  });
  it("decodes the stored professional address", () => {
    expect(decodeEmail(RESEARCHER.emailCodes)).toMatch(/^[a-z.]+@inrae\.fr$/);
  });
  it("never stores the address in plain text in the sources", () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const f of fs.readdirSync(dir)) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?|css)$/.test(f) && fs.readFileSync(p, "utf8").includes(decodeEmail(RESEARCHER.emailCodes))) hits.push(p);
      }
    };
    walk(path.join(process.cwd(), "src"));
    expect(hits).toEqual([]);
  });
});
