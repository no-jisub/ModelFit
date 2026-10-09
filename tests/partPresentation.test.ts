import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { getPartConfiguration, getMaintenancePresentation } from "../src/utils/partPresentation";
describe("structured part presentation", () => {
  it("selects relation quantity using model identity", () => {
    const part = consumables.find((p) => p.id === "lg-puricare-g-filter")!;
    expect(getPartConfiguration(part, "lg-as205ngja")?.requiredQuantity).toContain("1개");
    expect(getPartConfiguration(part, "lg-as355nsah")?.composition).toContain("2개");
    expect(getPartConfiguration(part, "missing-model")).toBeUndefined();
  });
  it("does not parse warning text or fabricate quantities", () => {
    const part = consumables[0];
    expect(
      getMaintenancePresentation({
        ...part,
        maintenance: undefined,
        purchaseWarning: "2주마다 세척해 재사용",
      }),
    ).toBeUndefined();
    expect(
      getPartConfiguration({ ...part, compatibilities: [] }, part.compatibleModelIds[0]),
    ).toBeUndefined();
  });
  it("distinguishes factory filters from approved replacements per model", () => {
    const m5 = consumables.find((p) => p.id === "lg-360-m5-filter")!;
    expect(getPartConfiguration(m5, "lg-as356nsma")?.fitNote).toBe(
      "기본 M7 필터 대신 사용할 수 있는 M5 교체 필터입니다.",
    );
    expect(getPartConfiguration(m5, "lg-as336nslc")?.fitNote).toBe("기본 장착 필터: M5");
    const v2 = consumables.find((p) => p.id === "lg-360-v2-filter")!;
    expect(getPartConfiguration(v2, "lg-as305dwwa")?.fitNote).toContain("기본 V 필터 대신");
    expect(getPartConfiguration(v2, "lg-as186hwwa")?.fitNote).toBe("기본 장착 필터: V2");
  });
});
