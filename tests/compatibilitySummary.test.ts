import { expect, it } from "vitest";
import { summarizeCompatibility } from "../src/utils/compatibility";

it("모델 등록 상태나 과거 공식 표시를 관계별 공식 확정으로 집계하지 않는다", () => {
  const parts = [
    {
      compatibilities: [
        { modelId: "a", verificationStatus: "official" as const, evidenceScope: "scoped" as const },
      ],
    },
    {
      compatibilities: [
        {
          modelId: "a",
          verificationStatus: "official" as const,
          evidenceScope: "legacy-unscoped" as const,
        },
      ],
    },
    {
      compatibilities: [
        {
          modelId: "other",
          verificationStatus: "official" as const,
          evidenceScope: "scoped" as const,
        },
      ],
    },
  ];
  expect(summarizeCompatibility(parts, "a")).toEqual({
    registered: 3,
    confirmed: 1,
    needsReview: 2,
  });
});
