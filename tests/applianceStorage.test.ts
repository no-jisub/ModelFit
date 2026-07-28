import { describe, expect, it } from "vitest";
import {
  APPLIANCE_STORAGE_KEY,
  parseSavedAppliances,
  readSavedAppliances,
  toggleSavedAppliance,
} from "../src/utils/applianceStorage";

function memoryStorage(initial: string | null = null) {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (key: string, next: string) => {
      expect(key).toBe(APPLIANCE_STORAGE_KEY);
      value = next;
    },
  };
}

describe("내 가전함 저장소", () => {
  it("손상되거나 중복된 데이터를 안전하게 정리한다", () => {
    expect(parseSavedAppliances("not-json")).toEqual([]);
    expect(
      parseSavedAppliances(
        JSON.stringify([
          { modelId: "model-a", savedAt: "2026-07-29T00:00:00.000Z" },
          { modelId: "model-a", savedAt: "2026-07-29T00:00:00.000Z" },
          { modelId: "", savedAt: "invalid" },
        ]),
      ),
    ).toEqual([{ modelId: "model-a", savedAt: "2026-07-29T00:00:00.000Z", reminders: [] }]);
  });

  it("같은 모델을 다시 누르면 저장 목록에서 제거한다", () => {
    const storage = memoryStorage();
    const now = new Date("2026-07-29T01:00:00.000Z");

    expect(toggleSavedAppliance("model-a", storage, now)).toEqual([
      { modelId: "model-a", savedAt: now.toISOString(), reminders: [] },
    ]);
    expect(toggleSavedAppliance("model-a", storage, now)).toEqual([]);
    expect(readSavedAppliances(storage)).toEqual([]);
  });
});
