import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("TikTok API Configuration", () => {
  it("should have all required environment variables set", () => {
    expect(ENV.tiktokAppKey).toBeDefined();
    expect(ENV.tiktokAppSecret).toBeDefined();
    expect(ENV.tiktokAppId).toBeDefined();
    expect(ENV.tiktokRedirectUrl).toBeDefined();
  });

  it("should have valid App Key format", () => {
    expect(ENV.tiktokAppKey).toMatch(/^[a-z0-9]+$/);
    expect(ENV.tiktokAppKey?.length).toBeGreaterThan(5);
  });

  it("should have valid App Secret format", () => {
    expect(ENV.tiktokAppSecret).toMatch(/^[a-f0-9]+$/);
    expect(ENV.tiktokAppSecret?.length).toBeGreaterThan(20);
  });

  it("should have valid App ID format", () => {
    expect(ENV.tiktokAppId).toMatch(/^\d+$/);
  });

  it("should have valid Redirect URL", () => {
    expect(ENV.tiktokRedirectUrl).toMatch(/^https:\/\//);
    expect(ENV.tiktokRedirectUrl).toContain("callback");
  });
});
