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
});
