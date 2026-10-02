import { describe, expect, it } from "vitest";
import { formatPackageLabelForModel } from "../scripts/lib/migration-package-label";

describe("모델별 상품 구성 표시", () => {
  it("슬래시로 줄여 쓴 모델 코드에서 현재 모델의 수량만 표시한다", () => {
    expect(
      formatPackageLabelForModel(
        "PFSACC01 · AS355NSAH는 2개, AS205NSJA/NGJA는 1개 필요",
        "AS205NGJA",
      ),
    ).toBe("PFSACC01 · AS205NGJA 1개 필요");
  });

  it("같은 제품군의 축약 모델 코드도 현재 모델 코드로 풀어 쓴다", () => {
    expect(
      formatPackageLabelForModel("PFSALC01 · AS355NSNA/NGNA 1회 교체 시 2개 필요", "AS355NGNA"),
    ).toBe("PFSALC01 · AS355NGNA 1회 교체 시 2개 필요");
  });

  it("모델별 문구가 아니면 원래 구성을 유지한다", () => {
    expect(formatPackageLabelForModel("PFPNNC06 · 공식 판매 구성 6개입", "AS205NGJA")).toBe(
      "PFPNNC06 · 공식 판매 구성 6개입",
    );
  });
});
