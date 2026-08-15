import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface FirebaseHostingConfig {
  hosting: {
    headers: Array<{
      source: string;
      headers: Array<{ key: string; value: string }>;
    }>;
  };
}

const config = JSON.parse(
  readFileSync(new URL("../firebase.json", import.meta.url), "utf8"),
) as FirebaseHostingConfig;

describe("Firebase Hosting security headers", () => {
  it("allows the same-origin Firebase Auth helper iframe", () => {
    const globalHeaders = config.hosting.headers.find(({ source }) => source === "**")?.headers;
    const contentSecurityPolicy = globalHeaders?.find(
      ({ key }) => key === "Content-Security-Policy",
    )?.value;

    expect(contentSecurityPolicy).toMatch(/frame-src[^;]*'self'/);
    expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
  });
});
