import { describe, it, expect } from "vitest";
import {
  CRM_MFE_CONFIG,
  ERP_MFE_CONFIG,
  ADMIN_MFE_CONFIG,
  WELLNESS_MFE_CONFIG,
  INTELLIGENCE_MFE_CONFIG,
  CONSUMER_MFE_CONFIG,
  AI_MFE_CONFIG,
} from "./mfe-route-config";

describe("mfe-route-config", () => {
  it("exports CRM_MFE_CONFIG with basePath and tabs", () => {
    expect(CRM_MFE_CONFIG.basePath).toBe("/crm");
    expect(CRM_MFE_CONFIG.tabs.length).toBeGreaterThan(0);
  });

  it("exports ERP_MFE_CONFIG with basePath and tabs", () => {
    expect(ERP_MFE_CONFIG.basePath).toBe("/erp");
    expect(ERP_MFE_CONFIG.tabs.length).toBeGreaterThan(0);
  });

  it("exports ADMIN_MFE_CONFIG with basePath and tabs", () => {
    expect(ADMIN_MFE_CONFIG.basePath).toBe("/admin");
    expect(ADMIN_MFE_CONFIG.tabs.length).toBeGreaterThan(0);
  });

  it("exports WELLNESS_MFE_CONFIG with basePath and tabs", () => {
    expect(WELLNESS_MFE_CONFIG.basePath).toBe("/wellness");
    expect(WELLNESS_MFE_CONFIG.tabs.length).toBeGreaterThan(0);
  });

  it("exports INTELLIGENCE_MFE_CONFIG with basePath and tabs", () => {
    expect(INTELLIGENCE_MFE_CONFIG.basePath).toBe("/intelligence");
    expect(INTELLIGENCE_MFE_CONFIG.tabs.length).toBeGreaterThan(0);
  });

  it("exports CONSUMER_MFE_CONFIG with basePath and tabs", () => {
    expect(CONSUMER_MFE_CONFIG.basePath).toBe("/consumer");
    expect(CONSUMER_MFE_CONFIG.tabs.length).toBeGreaterThan(0);
  });

  it("exports AI_MFE_CONFIG with basePath and tabs", () => {
    expect(AI_MFE_CONFIG.basePath).toBe("/ai");
    expect(AI_MFE_CONFIG.tabs.length).toBeGreaterThan(0);
  });
});
