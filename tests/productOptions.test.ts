import { describe, expect, it } from "vitest";
import { consumables } from "../src/data/consumables";
import { createProductOptions } from "../src/utils/productOptions";
import { models } from "../src/data/models";

describe("consumable product options", () => {
  it("공식 근거가 없는 데이터에 공식 확인 설명을 자동으로 붙이지 않는다", () => {
    const option = createProductOptions(
      { ...consumables[0], verificationStatus: "unverified" },
      [],
    )[0];
    expect(option.verification).toBe("unverified");
    expect(option.description).toContain("추가 확인이 필요");
    expect(option.description).not.toContain("공식 자료에서 확인한");
  });
  it("LG 360 공기청정기는 모델별 필터 필요 수량과 관리 방식을 구분한다", () => {
    const mFilter = consumables.find((part) => part.id === "lg-puricare-m-filter")!;
    const gFilter = consumables.find((part) => part.id === "lg-puricare-g-filter")!;
    const preFilter = consumables.find((part) => part.id === "lg-360-micro-filter")!;

    expect(mFilter.compatibleProductName).toContain("1회 교체 시 2개 필요");
    expect(gFilter.compatibleProductName).toContain("AS355NSAH는 2개");
    expect(gFilter.compatibleProductName).toContain("AS205NSJA/NGJA는 1개");
    expect(mFilter.replacementInterval).toMatch(/^약 1년/);
    expect(gFilter.purchaseWarning).toContain("물로 세척하지 마세요");
    expect(preFilter.compatibleProductName).toContain("6개입");
    expect(preFilter.purchaseWarning).toContain("한 달마다");
  });
  it("웰스는 주기가 다른 교체 필터를 구분하고 미확인 부품번호를 추정하지 않는다", () => {
    const al106 = models.find((model) => model.id === "wells-al106")!;
    const aq107 = models.find((model) => model.id === "wells-aq107")!;
    const tornado = models.find((model) => model.id === "wells-an730")!;
    expect(al106.consumableIds).toHaveLength(3);
    expect(aq107.consumableIds).toHaveLength(4);
    expect(tornado.consumableIds).toHaveLength(3);
    const parts = consumables.filter((part) => al106.consumableIds.includes(part.id));
    expect(parts.find((part) => part.type === "custom-filter")?.replacementInterval).toMatch(
      /^3개월/,
    );
    expect(
      parts
        .filter((part) => part.type !== "custom-filter")
        .every((part) => part.replacementInterval?.startsWith("12개월")),
    ).toBe(true);
    expect(parts.every((part) => !part.genuinePartNumber)).toBe(true);
    expect(parts.filter((part) => part.affiliate.enabled)).toHaveLength(2);
    expect(parts.find((part) => part.id === "wells-al106-hepa-filter")?.affiliate.enabled).toBe(
      false,
    );
  });
  it("제로 S는 교체 필터 두 종류를 별도 부품번호와 공식 구매 근거로 제공한다", () => {
    const model = models.find((item) => item.id === "winix-azse430-jwk")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);
    expect(parts.map((part) => part.genuinePartNumber)).toEqual(["CAF-I0H3", "CAF-I0D1"]);
    expect(parts.map((part) => part.type)).toEqual(["dust-filter", "deodorizing-filter"]);
    expect(
      parts.every((part) => part.sources.some((source) => source.sourceType === "official-manual")),
    ).toBe(true);
    expect(parts.every((part) => part.purchaseWarning?.includes("물세척하면 안 됩니다"))).toBe(
      true,
    );
    expect(parts.find((part) => part.id === "winix-zero-s-dust-filter")?.affiliate.enabled).toBe(
      true,
    );
    expect(
      parts.find((part) => part.id === "winix-zero-s-deodorizing-filter")?.affiliate.enabled,
    ).toBe(true);
  });
  it("코웨이 노블은 세척 프리필터와 주기가 다른 교체 필터를 구분한다", () => {
    const preFilter = consumables.find((part) => part.id === "coway-4d-pre-filter")!;
    const dimensional = consumables.find((part) => part.id === "coway-4d-dimensional-filter")!;
    const matching = consumables.find((part) => part.id === "coway-air-matching-filter")!;

    expect(preFilter.replacementInterval).toBeUndefined();
    expect(preFilter.purchaseWarning).toContain("2주마다");
    expect(dimensional.replacementInterval).toMatch(/^12개월/);
    expect(dimensional.purchaseWarning).toContain("복합형 필터");
    expect(matching.replacementInterval).toMatch(/^4개월 또는 6개월/);
    expect(matching.purchaseWarning).toContain("6종 중 2종");
  });
  it("AP-2219K는 탈취와 집진 기능이 결합된 복합필터 한 개로 안내한다", () => {
    const model = models.find((item) => item.id === "coway-ap-2219k")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);
    expect(parts).toHaveLength(1);
    expect(parts[0].displayName).toBe("코웨이 AP-2219K 일체형 복합필터");
    expect(parts[0].compatibleProductName).toContain("탈취필터와 초미세먼지 집진필터가 결합");
    expect(parts[0].replacementInterval).toMatch(/^12개월/);
    expect(parts[0].sources.some((source) => source.sourceType === "official-manual")).toBe(true);
    expect(parts[0].genuinePartNumber).toBeUndefined();
    expect(parts[0].affiliate.enabled).toBe(true);
  });
  it("쿠쿠 ACF-AHMT10은 공식 2개입 세트와 직접 상품 근거를 제공한다", () => {
    const filter = consumables.find((part) => part.id === "cuckoo-acf-ahmt10-filter")!;

    expect(filter.genuinePartNumber).toBe("ACF-AHMT10");
    expect(filter.compatibleProductName).toContain("2개입 1세트");
    expect(filter.sources[0].url).toContain("productNo=7461");
  });
  it("아이로봇 205와 Combo 물걸레 부품은 공식 수량과 부품번호를 제공한다", () => {
    const find = (id: string) => consumables.find((part) => part.id === id)!;
    expect(find("irobot-205-filter").compatibleProductName).toContain("3-Pack");
    expect(find("irobot-205-main-brush").compatibleProductName).toContain("1개");
    expect(find("irobot-205-side-brush").genuinePartNumber).toBe("4837322");
    expect(find("irobot-205-mop-pad").genuinePartNumber).toBe("4849958");
    expect(find("irobot-combo-j9-washable-mop-pad").genuinePartNumber).toBe("4785885");
    expect(find("irobot-combo-i5-mopping-kit").compatibleProductName).toContain("심지 4개");
  });
  it("에브리봇 걸레는 부품명과 판매 수량을 분리한다", () => {
    const parts = consumables.filter(
      (part) => part.id.startsWith("everybot-") && part.type === "mop-pad",
    );
    const packagedParts = parts.filter((part) =>
      part.compatibleProductName?.match(/[234](?:개입|매입|장|세트)/),
    );

    expect(packagedParts).toHaveLength(6);
    expect(
      packagedParts.every((part) => !part.displayName.match(/[234](?:개입|매입|장|세트)/)),
    ).toBe(true);
  });

  it("에브리봇 Q11과 Q9는 공식 판매 구성 수량을 모델별로 제공한다", () => {
    const q11 = consumables.filter((part) => part.id.startsWith("everybot-q11-"));
    const q9 = consumables.filter((part) => part.id.startsWith("everybot-q9-"));
    expect(q11.map((part) => part.compatibleProductName)).toEqual([
      "HEPA필터 2개입",
      "메인브러시 1개",
      "사이드브러시 2개입",
      "전용 걸레 4매입",
      "먼지봉투 3개입",
    ]);
    expect(q9.map((part) => part.compatibleProductName)).toEqual([
      "HEPA필터 2개입",
      "메인브러시 1개",
      "사이드브러시 2개입",
      "전용 걸레 2세트(4매입)",
      "먼지봉투 3개입",
    ]);
    expect(
      [...q11, ...q9].every((part) =>
        part.sources.every((source) => !Number.isNaN(Date.parse(source.checkedAt))),
      ),
    ).toBe(true);
  });
  it("유피 C20·X10 Pro·C28·S2는 공식 키트 수량과 모델별 교체 주기를 분리한다", () => {
    const find = (id: string) => consumables.find((part) => part.id === id)!;
    expect(find("eufy-c20-dust-bag").compatibleProductName).toContain("6-Pack");
    expect(find("eufy-c20-washable-filter").compatibleProductName).toContain("필터 2개");
    expect(find("eufy-x10-pro-side-brush").genuinePartNumber).toBe("T29A1031");
    expect(find("eufy-x10-pro-filter").replacementInterval).toMatch(/^약 3개월/);
    expect(find("eufy-x10-pro-main-brush").replacementInterval).toMatch(/^약 6개월/);
    expect(find("eufy-x10-pro-dust-bag").compatibleProductName).toContain("6개입");
    expect(find("eufy-c28-dust-bag").compatibleProductName).toContain("3개");
    expect(find("eufy-c28-roller-mop").replacementInterval).toMatch(/^약 6개월/);
    expect(find("eufy-s2-side-brush").compatibleProductName).toContain("2쌍");
    expect(find("eufy-s2-filter").sources[0].url).toContain("t291n110");
  });
  it("샤오미 X10+와 X20+의 물걸레 및 먼지봉투 주기를 혼용하지 않는다", () => {
    const find = (id: string) => consumables.find((part) => part.id === id)!;
    expect(find("xiaomi-x10-plus-mop-pad").replacementInterval).toMatch(/^1~3개월/);
    expect(find("xiaomi-x20-plus-mop-pad").replacementInterval).toMatch(/^3~6개월/);
    expect(find("xiaomi-x10-plus-dust-bag").replacementInterval).toContain("4~6주");
    expect(find("xiaomi-x20-plus-dust-bag").replacementInterval).toMatch(/^약 2.5개월/);
    expect(find("xiaomi-x10-plus-filter").sources[0].url).toContain("KA-11678");
  });

  it("샤오미 S20은 부품별 공식 번호를 제공하고 판매 수량을 부품명과 분리한다", () => {
    const model = models.find((item) => item.id === "xiaomi-s20")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);
    expect(parts.map((part) => part.genuinePartNumber).sort()).toEqual([
      "B106GL-BX",
      "B112-CH",
      "B112-ZS",
      "D106-TB",
    ]);
    expect(parts.every((part) => part.compatibleProductName?.includes("개입"))).toBe(true);
    expect(parts.every((part) => !part.displayName.includes("개입"))).toBe(true);
  });

  it("SK매직 ACL130Z는 탈취·집진을 분리하고 세트 번호를 개별 부품번호로 표시하지 않는다", () => {
    const model = models.find((item) => item.id === "skmagic-acl130z0skpn")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);
    expect(parts.map((part) => part.type)).toEqual(["deodorizing-filter", "dust-filter"]);
    expect(parts.every((part) => part.replacementInterval?.startsWith("12개월"))).toBe(true);
    expect(parts.every((part) => part.genuinePartNumber === undefined)).toBe(true);
    expect(
      parts.every((part) => part.productOptions[0].packageLabel?.includes("FLTACL130PWH 세트")),
    ).toBe(true);
    expect(parts.every((part) => part.purchaseWarning?.includes("세트 한 개"))).toBe(true);
  });

  it("SK매직 ACL20은 공식 일체형 필터 부품번호와 주기를 제공한다", () => {
    const model = models.find((item) => item.id === "skmagic-acl20c1askwh")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);

    expect(parts).toHaveLength(1);
    expect(parts[0].genuinePartNumber).toBe("FLTA20C2ATWH");
    expect(parts[0].displayName).toContain("일체형 필터");
    expect(parts[0].replacementInterval).toMatch(/^12개월/);
    expect(parts[0].sources[0].url).toContain("goodsId=G000066078");
  });
  it("블루에어 Classic Pro는 CP7i 2개입과 CP9i 3개 장착을 구분한다", () => {
    const cp7 = consumables.find((part) => part.id === "blueair-cp7i-pac-filter")!;
    const cp9 = consumables.find((part) => part.id === "blueair-cp9i-main-filter")!;

    expect(cp7.compatibleProductName).toContain("2개입");
    expect(cp7.replacementInterval).toMatch(/^최대 1년/);
    expect(cp7.purchaseWarning).toContain("메인 필터 2개");
    expect(cp9.compatibleProductName).toContain("3개 장착");
    expect(cp9.replacementInterval).toMatch(/^최대 1년/);
    expect(cp9.purchaseWarning).toContain("CP7i용 2개입");
  });

  it("블루에어 DustMagnet과 Blue 3410의 필터 수량·주기를 구분한다", () => {
    const dustMagnet = consumables.find(
      (part) => part.id === "blueair-dustmagnet-5200-combofilter",
    )!;
    const blue3410 = consumables.find((part) => part.id === "blueair-3410-particle-carbon-filter")!;

    expect(dustMagnet.compatibleModelIds).toEqual(["blueair-5240i", "blueair-5210i"]);
    expect(dustMagnet.compatibleProductName).toContain("교체 필터 1개");
    expect(dustMagnet.replacementInterval).toMatch(/^최대 9개월/);
    expect(blue3410.compatibleProductName).toContain("메인 필터 1개");
    expect(blue3410.replacementInterval).toMatch(/^약 6개월/);
    expect(blue3410.purchaseWarning).toContain("패브릭 프리필터");
  });
  it("로보락은 공용 먼지봉투와 Saros Z70 교체품 수량을 구분한다", () => {
    const dustBag = consumables.find((part) => part.id === "roborock-saros-qrevo-s8-dust-bag")!;
    const saros = models.find((model) => model.id === "roborock-saros-z70")!;
    const parts = saros.consumableIds.map((id) => consumables.find((part) => part.id === id)!);

    expect(dustBag.compatibleProductName).toContain("6개입");
    expect(dustBag.compatibleModelIds).toHaveLength(4);
    expect(parts.find((part) => part.id.endsWith("-filter"))?.compatibleProductName).toContain(
      "2개입",
    );
    expect(parts.find((part) => part.id.endsWith("-mop-cloth"))?.compatibleProductName).toContain(
      "4개입",
    );
  });
  it("드리미 X40 Ultra는 공식 키트의 부품별 판매 수량을 표시한다", () => {
    const model = models.find((item) => item.id === "dreame-x40-ultra")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);

    expect(parts.map((part) => part.compatibleProductName)).toEqual([
      "X40 Ultra Accessory Cleaning Kit · Main Brush ×1",
      "X40 Ultra Accessory Cleaning Kit · Side Brush ×2",
      "X40 Ultra Accessory Cleaning Kit · Dust Collection Bag ×2",
      "X40 Ultra Accessory Cleaning Kit · Dust Box Filter ×2",
      "X40 Ultra Accessory Cleaning Kit · Wash-free Mop Pad ×6",
    ]);
    expect(parts.every((part) => part.purchaseWarning?.includes("키트 한 세트"))).toBe(true);
  });

  it("드리미 X50s Pro는 Master와 Ultra의 스테이션 차이를 안내한다", () => {
    const parts = consumables.filter((part) => part.id.startsWith("dreame-x50s-"));

    expect(parts).toHaveLength(5);
    expect(
      parts.every(
        (part) =>
          part.compatibleModelIds.includes("dreame-x50s-pro-master") &&
          part.compatibleModelIds.includes("dreame-x50s-pro-ultra"),
      ),
    ).toBe(true);
    expect(parts.every((part) => part.purchaseWarning?.includes("스테이션 형태가 다릅니다"))).toBe(
      true,
    );
  });
  it("에코백스 N20은 Buddy Kit의 부품별 수량을 표시한다", () => {
    const model = models.find((item) => item.id === "ecovacs-deebot-n20-pro-plus")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);

    expect(parts.map((part) => part.compatibleProductName)).toEqual([
      "N20 PRO PLUS Buddy Kit · Main Brush ×1",
      "N20 PRO PLUS Buddy Kit · Side Brush ×4",
      "N20 PRO PLUS Buddy Kit · Filter ×3",
    ]);
  });

  it("에코백스 X9와 T80은 각 모델용 메인·사이드 브러시를 제공한다", () => {
    const x9 = models.find((item) => item.id === "ecovacs-deebot-x9")!;
    const t80 = models.find((item) => item.id === "ecovacs-deebot-t80")!;
    const sharedDustBag = consumables.find((part) => part.id === "ecovacs-x9-t80-dust-bag")!;

    expect(x9.consumableIds).toContain("ecovacs-x9-main-brush");
    expect(x9.consumableIds).toContain("ecovacs-x9-side-brush");
    expect(t80.consumableIds).toContain("ecovacs-t80-main-brush");
    expect(t80.consumableIds).toContain("ecovacs-t80-side-brush");
    expect(sharedDustBag.compatibleProductName).toContain("6개입");
    expect(sharedDustBag.replacementInterval).toMatch(/^2~3개월/);
  });
  it("나르왈 Freo는 Z10·Z Ultra와 X Ultra 먼지봉투 규격을 분리한다", () => {
    const z10 = models.find((item) => item.id === "narwal-freo-z10")!;
    const xUltra = models.find((item) => item.id === "narwal-freo-x-ultra")!;
    const zSeriesBag = consumables.find((part) => part.id === "narwal-freo-dust-bag")!;
    const xUltraBag = consumables.find((part) => part.id === "narwal-freo-x-ultra-dust-bag")!;

    expect(z10.consumableIds).toContain("narwal-freo-z10-side-brush");
    expect(xUltra.consumableIds).toContain("narwal-freo-x-ultra-dust-bag");
    expect(zSeriesBag.compatibleProductName).toContain("2개입");
    expect(xUltraBag.compatibleProductName).toContain("3개입");
    expect(zSeriesBag.purchaseWarning).toContain("혼용하지 마세요");
  });

  it("나르왈 Flow는 공식 세트 수량과 부품별 교체 주기를 제공한다", () => {
    const model = models.find((item) => item.id === "narwal-flow")!;
    const parts = model.consumableIds.map((id) => consumables.find((part) => part.id === id)!);

    expect(parts.map((part) => part.compatibleProductName)).toEqual([
      "Flow Accessories Set · Dust Bin HEPA Filter · 2개",
      "Flow Accessories Set · Zero-Tangling Roller Brush · 1개",
      "Flow Accessories Set · Detangling Side Brush · 2개",
      "Flow Accessories Set · Track Mop · 2개",
      "Flow Accessories Set · Base Station Dust Bag · 3개",
    ]);
    expect(parts.map((part) => part.replacementInterval)).toEqual([
      "3개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
      "6개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
      "3개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
      "1~3개월마다 (제조사 권장, 마모 상태에 따라 달라짐)",
      "최대 120일 (사용량과 봉투 상태에 따라 달라짐)",
    ]);
  });
  it("모든 소모품에 최소 한 개의 정품 기준 상품을 제공한다", () => {
    expect(
      consumables.every(
        (part) =>
          part.productOptions.length > 0 &&
          part.productOptions.some(
            (option) => option.kind === "genuine" && option.verification === "official-genuine",
          ),
      ),
    ).toBe(true);
  });

  it("쿠팡 판매 후보를 공식 정품 기준과 분리해 표시한다", () => {
    const compatibleIds = [
      "winix-zero-s-dust-filter",
      "cuckoo-acf-ahmt10-filter",
      "coway-ap2219k-composite-filter",
    ];

    for (const id of compatibleIds) {
      const part = consumables.find((item) => item.id === id)!;
      expect(part.productOptions[0]).toMatchObject({
        kind: "genuine",
        verification: "official-genuine",
      });
      expect(part.productOptions[1]).toMatchObject({
        kind: "compatible",
        verification: "seller-claimed",
      });
      expect(part.productOptions[1]?.purchaseLinks[0]?.isAffiliate).toBe(true);
    }

    const blueair = consumables.find((item) => item.id === "blueair-3410-particle-carbon-filter")!;
    expect(blueair.productOptions[1]).toMatchObject({
      name: "Blue 3410 교체 필터 106332",
      kind: "genuine",
      verification: "seller-claimed",
    });
    expect(blueair.productOptions[1]?.purchaseLinks[0]?.url).toBe(
      "https://link.coupang.com/a/g0AWwsZXVs",
    );
  });

  it("특정 상품 후보에 쿠팡 검색 결과 링크를 포함하지 않는다", () => {
    expect(
      consumables
        .flatMap((part) => part.productOptions)
        .flatMap((option) => option.purchaseLinks)
        .every((link) => link.linkType !== "search-results"),
    ).toBe(true);
  });

  it("다이슨 BP03을 활성탄소와 HEPA H13 두 소모품으로 분리한다", () => {
    const model = models.find((item) => item.id === "dyson-bp03");
    const parts = model?.consumableIds.map((id) => consumables.find((part) => part.id === id));

    expect(parts).toHaveLength(2);
    expect(parts?.map((part) => part?.displayName)).toEqual([
      "다이슨 BP03 활성 탄소 필터",
      "다이슨 빅+콰이엇 HEPA H13 필터",
    ]);
    expect(parts?.every((part) => part?.productOptions[0]?.kind === "genuine")).toBe(true);
    expect(parts?.[0]?.replacementInterval).toBeUndefined();
    expect(parts?.[0]?.purchaseWarning).toContain("서로 다른 교체 부품");
    expect(parts?.[1]?.replacementInterval).toMatch(/^최대 5년/);
    expect(parts?.[1]?.purchaseWarning).toContain("별도 부품");
  });

  it("다이슨 HP09·TP09·PH04에 결합형 360° 필터를 연결한다", () => {
    const part = consumables.find((item) => item.id === "dyson-360-glass-hepa-carbon-filter");

    expect(part?.compatibleModelIds).toEqual(["dyson-hp09", "dyson-tp09", "dyson-ph04"]);
    expect(part?.replacementInterval).toBeUndefined();
    expect(part?.purchaseWarning).toContain("단일 교체 필터");
    expect(part?.sources[0]?.url).toBe(
      "https://www.dyson.co.kr/support/replacement-parts/air-treatment/tp04",
    );
  });

  it("검증된 직접 상품 링크는 해당 정품 후보 안에서 제공한다", () => {
    const part = consumables.find((item) => item.id === "winix-tower-edge-all-in-one-filter");
    const directLinks = part?.productOptions[0]?.purchaseLinks.filter(
      (link) => link.linkType === "direct-product",
    );

    expect(directLinks).toHaveLength(1);
    expect(directLinks?.[0]?.url).toContain("/vp/products/7368403017");
  });
});
