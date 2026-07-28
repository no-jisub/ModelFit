import type { ApplianceCategory, ApplianceModel, SourceReference } from "@/types";
import { modelConsumableIds } from "./compatibilityMap";

interface CatalogEntry {
  brandId: string;
  brandName: string;
  brandNameEn: string;
  category: ApplianceCategory;
  modelName: string;
  modelCode: string;
  series?: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceType?: SourceReference["sourceType"];
}

const checkedAt = "2026-07-27";

const entries: CatalogEntry[] = [
  // 삼성전자
  ...[
    ["Bespoke AI 공기청정기", "AP90H10198EDD"],
    ["Bespoke AI 공기청정기", "AP90H10198UDD"],
    ["Bespoke AI 공기청정기", "AP90H03193EGD"],
    ["Bespoke AI 공기청정기", "AP90H03193UGD"],
    ["Bespoke AI 공기청정기", "AP90H10198MDD"],
  ].map(([modelName, modelCode]) => ({
    brandId: "samsung",
    brandName: "삼성",
    brandNameEn: "Samsung",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: "Bespoke AI",
    sourceUrl: "https://www.samsung.com/sec/event/air-cleaner/",
    sourceTitle: "삼성전자 공기청정기 공식 제품 안내",
  })),

  // LG전자
  ...[
    ["LG 퓨리케어 360° 공기청정기", "AS355NSNA"],
    ["LG 퓨리케어 360° 공기청정기", "AS355NGNA"],
    ["LG 퓨리케어 360° 공기청정기", "AS355NSAH"],
    ["LG 퓨리케어 360° 공기청정기", "AS205NSJA"],
    ["LG 퓨리케어 360° 공기청정기", "AS205NGJA"],
  ].map(([modelName, modelCode]) => ({
    brandId: "lg",
    brandName: "LG",
    brandNameEn: "LG",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: "퓨리케어 360°",
    sourceUrl:
      "https://www.lge.co.kr/kr/ebook/2025/may/himart/catImage/552/202505_himart_catalogue.pdf",
    sourceTitle: "LG전자 공식 제품 카탈로그",
    sourceType: "manufacturer" as const,
  })),

  // 코웨이
  ...[
    ["코웨이 노블 공기청정기", "AP-4025D"],
    ["코웨이 공기청정기", "AP-3024H"],
    ["코웨이 공기청정기", "AP-2219K"],
    ["코웨이 공기청정기", "AP-2021A"],
    ["코웨이 공기청정기", "AP-1521B"],
  ].map(([modelName, modelCode], index) => ({
    brandId: "coway",
    brandName: "코웨이",
    brandNameEn: "Coway",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: "AP Series",
    sourceUrl:
      index < 2
        ? "https://www.coway.com/core/product/fmanual/download/302"
        : "https://www.coway.com/cowayservice/air_care?tab=1",
    sourceTitle: index < 2 ? "코웨이 공식 사용설명서" : "코웨이 공식 에어케어 제품 안내",
    sourceType: index < 2 ? ("official-manual" as const) : ("manufacturer" as const),
  })),

  // 위닉스
  ...[
    ["제로 S", "AZSE430-JWK"],
    ["타워 엣지", "AT8E430-MWK"],
    ["타워 프라임", "APRM833-JWK"],
    ["타워프라임 플러스", "ATTM115-MWK"],
    ["마스터 S", "AMSH993-JSK"],
  ].map(([modelName, modelCode]) => ({
    brandId: "winix",
    brandName: "위닉스",
    brandNameEn: "Winix",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: modelName.split(" ")[0],
    sourceUrl:
      modelCode === "AMSH993-JSK"
        ? "https://www.winix.com/product/852"
        : "https://www.winix.com/product/list/001",
    sourceTitle: "위닉스 공식 공기청정기 제품 정보",
  })),

  // 쿠쿠
  ...[
    ["쿠쿠 인스퓨어 공기청정기", "AC-23AH10FNW"],
    ["쿠쿠 인스퓨어 공기청정기", "AC-25W20FWH"],
    ["쿠쿠 인스퓨어 공기청정기", "AC-28AHNL20FNW"],
    ["쿠쿠 인스퓨어 공기청정기", "AC-17T20FWH"],
    ["쿠쿠 인스퓨어 브릭 공기청정기", "AC-14L10FEW"],
  ].map(([modelName, modelCode], index) => ({
    brandId: "cuckoo",
    brandName: "쿠쿠",
    brandNameEn: "Cuckoo",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: "인스퓨어",
    sourceUrl:
      index === 4
        ? "https://www.cuckoo.co.kr/searchWord?searchWord=%EB%B8%8C%EB%A6%AD"
        : "https://www.cuckoo.co.kr/mall/productView?categoryCd=34&productNo=7375",
    sourceTitle: "쿠쿠 공식몰 공기청정기 제품 정보",
    sourceType: "official-store" as const,
  })),

  // 다이슨
  ...[
    ["빅+콰이엇 포름알데히드 공기청정기", "BP04"],
    ["빅+콰이엇 포름알데히드 공기청정기", "BP03"],
    ["핫앤쿨 포름알데히드 공기청정기", "HP09"],
    ["쿨 포름알데히드 공기청정기", "TP09"],
    ["휴미디파이+쿨 포름알데히드 공기청정기", "PH04"],
  ].map(([modelName, modelCode]) => ({
    brandId: "dyson",
    brandName: "다이슨",
    brandNameEn: "Dyson",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: modelCode.slice(0, 2),
    sourceUrl: "https://www.dyson.co.kr/support/guides-and-manuals",
    sourceTitle: "다이슨 공식 매뉴얼 가이드",
    sourceType: "official-manual" as const,
  })),

  // 샤오미
  ...[
    ["Xiaomi 로봇청소기 5 Pro", "5 PRO"],
    ["Xiaomi 로봇청소기 5", "5"],
    ["Xiaomi 로봇청소기 X20+", "X20+"],
    ["Xiaomi 로봇청소기 X10+", "X10+"],
    ["Xiaomi 로봇청소기 S20", "S20"],
  ].map(([modelName, modelCode]) => ({
    brandId: "xiaomi",
    brandName: "샤오미",
    brandNameEn: "Xiaomi",
    category: "robot-vacuum" as const,
    modelName,
    modelCode,
    series: "Xiaomi Robot Vacuum",
    sourceUrl: "https://www.mi.com/kr/smart-home/",
    sourceTitle: "샤오미 코리아 공식 스마트홈 제품 목록",
  })),

  // SK매직
  ...[
    ["코어 360° 공기청정기", "ACL-131T0"],
    ["15평 올클린 공기청정기", "ACL15C1ASKWH"],
    ["20평 올클린 공기청정기", "ACL20C1ASKWH"],
    ["25평 올클린 공기청정기", "ACL25C1ASKCE"],
    ["PSG 코어 공기청정기", "ACL130Z0SKPN"],
  ].map(([modelName, modelCode], index) => ({
    brandId: "skmagic",
    brandName: "SK매직",
    brandNameEn: "SK magic",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: modelName.includes("올클린") ? "올클린" : "코어",
    sourceUrl: [
      "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000069301",
      "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000062559",
      "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000069682",
      "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000069683",
      "https://www.skmagic.com/goods/indexGoodsDetail?goodsId=G000069281",
    ][index],
    sourceTitle: "SK매직 공식몰 제품 정보",
    sourceType: "official-store" as const,
  })),

  // 교원 웰스
  ...[
    ["웰스 공기청정기 6평형", "AL106"],
    ["웰스 공기청정기 토네이도", "AN730"],
    ["웰스 공기청정기 토네이도", "AN734"],
    ["웰스 공기청정기 미니맥스 7평형", "AQ107"],
    ["웰스 공기청정기 15평형", "AM315"],
  ].map(([modelName, modelCode], index) => ({
    brandId: "wells",
    brandName: "교원 웰스",
    brandNameEn: "Wells",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: modelName.includes("토네이도") ? "토네이도" : "Wells Air",
    sourceUrl: [
      "https://m.kyowonwells.com/Product/Detail?grpIdx=47&productIdx=49",
      "https://m.kyowonwells.com/Product/Detail?grpIdx=182&productIdx=373",
      "https://m.kyowonwells.com/Product/Detail?grpIdx=182&productIdx=373",
      "https://m.kyowonwells.com/Product/Detail?grpIdx=1394&productIdx=926",
      "https://m.kyowonwells.com/Product/Detail?grpIdx=49&productIdx=54",
    ][index],
    sourceTitle: "교원 웰스 공식 제품 정보",
  })),

  // 블루에어
  ...[
    ["Classic Pro CP7i", "CP7i"],
    ["Classic Pro CP9i", "CP9i"],
    ["DustMagnet 5240i", "5240i"],
    ["DustMagnet 5210i", "5210i"],
    ["Blue 3410", "3410"],
  ].map(([modelName, modelCode]) => ({
    brandId: "blueair",
    brandName: "블루에어",
    brandNameEn: "Blueair",
    category: "air-purifier" as const,
    modelName,
    modelCode,
    series: modelName.split(" ")[0],
    sourceUrl: "https://www.blueair.com/ko-kr/collections/shop-all",
    sourceTitle: "블루에어 코리아 공식 제품 목록",
    sourceType: "official-store" as const,
  })),

  // 로보락
  ...[
    ["Saros Z70", "SAROS Z70"],
    ["S10 MaxV Ultra", "S10 MAXV ULTRA"],
    ["S8 MaxV Ultra", "S8 MAXV ULTRA"],
    ["Qrevo Curv 2 Flow", "QREVO CURV 2 FLOW"],
    ["Qrevo Curv", "QREVO CURV"],
  ].map(([modelName, modelCode]) => ({
    brandId: "roborock",
    brandName: "로보락",
    brandNameEn: "Roborock",
    category: "robot-vacuum" as const,
    modelName,
    modelCode,
    series: modelName.split(" ")[0],
    sourceUrl: "https://kr.roborock.com/pages/robot-vacuum-cleaner-compare",
    sourceTitle: "로보락 코리아 공식 로봇청소기 비교",
  })),

  // 드리미
  ...[
    ["X50s Pro Master", "X50S PRO MASTER"],
    ["X50s Pro Ultra", "X50S PRO ULTRA"],
    ["X40 Ultra", "X40 ULTRA"],
    ["X40s Pro Ultra", "X40S PRO ULTRA"],
    ["L10s Pro Ultra Heat", "L10S PRO ULTRA HEAT"],
  ].map(([modelName, modelCode]) => ({
    brandId: "dreame",
    brandName: "드리미",
    brandNameEn: "Dreame",
    category: "robot-vacuum" as const,
    modelName,
    modelCode,
    series: modelName.startsWith("L") ? "L10 Series" : "X Series",
    sourceUrl: modelName.startsWith("L")
      ? "https://kr.dreametech.com/products?category=17"
      : "https://store.kr.dreametech.com/collections/x-series",
    sourceTitle: "드리미 코리아 공식 로봇청소기 제품 목록",
  })),

  // 에코백스
  ...[
    ["DEEBOT X12", "DEEBOT X12"],
    ["DEEBOT X11", "DEEBOT X11"],
    ["DEEBOT X9", "DEEBOT X9"],
    ["DEEBOT T80", "DEEBOT T80"],
    ["DEEBOT N20 PRO PLUS", "DEEBOT N20 PRO PLUS"],
  ].map(([modelName, modelCode], index) => ({
    brandId: "ecovacs",
    brandName: "에코백스",
    brandNameEn: "ECOVACS",
    category: "robot-vacuum" as const,
    modelName,
    modelCode,
    series: modelName.split(" ")[1] ?? "DEEBOT",
    sourceUrl:
      index === 4
        ? "https://www.ecovacs.com/kr/deebot-robotic-vacuum-cleaner/deebot-n20-pro-plus-white"
        : "https://www.ecovacs.com/kr/deebot-robotic-vacuum-cleaner?page=0",
    sourceTitle: "에코백스 코리아 공식 DEEBOT 제품 목록",
  })),

  // 나르왈
  ...[
    ["Narwal Flow", "FLOW"],
    ["Freo Z10", "FREO Z10"],
    ["Freo Z Ultra", "FREO Z ULTRA"],
    ["Freo X Ultra", "FREO X ULTRA"],
    ["Freo", "FREO"],
  ].map(([modelName, modelCode]) => ({
    brandId: "narwal",
    brandName: "나르왈",
    brandNameEn: "Narwal",
    category: "robot-vacuum" as const,
    modelName,
    modelCode,
    series: modelName.includes("Freo") ? "Freo" : "Flow",
    sourceUrl: "https://kr.narwal.com/pages/%EC%A0%9C%ED%92%88",
    sourceTitle: "나르왈 코리아 공식 제품 목록",
  })),

  // 아이로봇
  ...[
    ["Roomba Combo 10 Max", "COMBO 10 MAX"],
    ["Roomba 205 DustCompactor Combo", "205 DUSTCOMPACTOR"],
    ["Roomba 105 Vac + AutoEmpty Dock", "105 VAC"],
    ["Roomba Combo j9+", "COMBO J9+"],
    ["Roomba Combo i5", "COMBO I5"],
  ].map(([modelName, modelCode]) => ({
    brandId: "irobot",
    brandName: "아이로봇",
    brandNameEn: "iRobot",
    category: "robot-vacuum" as const,
    modelName,
    modelCode,
    series: "Roomba",
    sourceUrl: "https://www.irobot.com/en_US/us/products",
    sourceTitle: "iRobot 공식 Roomba 제품 목록",
  })),

  // 에브리봇
  ...[
    ["AI 올인원 로봇청소기 Q11", "Q11"],
    ["AI 올인원 로봇청소기 Q9", "Q9"],
    ["Q3 Turbo Plus", "Q3 TURBO PLUS"],
    ["엣지2 물걸레 로봇청소기", "RS350"],
    ["쓰리스핀 EVO 물걸레 로봇청소기", "TS402M"],
  ].map(([modelName, modelCode]) => ({
    brandId: "everybot",
    brandName: "에브리봇",
    brandNameEn: "Everybot",
    category: "robot-vacuum" as const,
    modelName,
    modelCode,
    series: modelName.includes("물걸레") ? "Mop Robot" : "Q Series",
    sourceUrl: "https://everybotmall.com/category/%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0/53",
    sourceTitle: "에브리봇 공식몰 로봇청소기 목록",
    sourceType: "official-store" as const,
  })),

  // 유피
  ...[
    ["eufy Robot Vacuum Omni S2", "OMNI S2"],
    ["eufy Robot Vacuum Omni C28", "OMNI C28"],
    ["eufy X10 Pro Omni", "X10 PRO OMNI"],
    ["eufy Omni S1 Pro", "OMNI S1 PRO"],
    ["eufy Robot Vacuum Omni C20", "OMNI C20"],
  ].map(([modelName, modelCode]) => ({
    brandId: "eufy",
    brandName: "유피",
    brandNameEn: "eufy",
    category: "robot-vacuum" as const,
    modelName,
    modelCode,
    series: "Omni",
    sourceUrl:
      modelCode === "X10 PRO OMNI"
        ? "https://www.eufy.com/products/t2351111"
        : "https://www.eufy.com/robot-vacuums",
    sourceTitle: "eufy 공식 로봇청소기 제품 목록",
  })),
];

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/°/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "");

export const catalogModels: ApplianceModel[] = entries.map((entry) => {
  const slug = toSlug(entry.modelCode);
  const id = `${entry.brandId}-${slug}`;

  return {
    id,
    slug,
    category: entry.category,
    brandId: entry.brandId,
    brandName: entry.brandName,
    brandNameEn: entry.brandNameEn,
    modelName: entry.modelName,
    modelCode: entry.modelCode,
    aliases: [
      `${entry.brandName} ${entry.modelCode}`,
      `${entry.brandNameEn} ${entry.modelCode}`,
      entry.modelName,
    ],
    series: entry.series,
    shortDescription: `제조사 공식 제품 또는 지원 자료에서 모델명이 확인된 ${entry.category === "air-purifier" ? "공기청정기" : "로봇청소기"}입니다.`,
    consumableNote:
      entry.brandId === "samsung" && entry.modelCode.startsWith("AP90H")
        ? "삼성 공식 제품 안내상 이 모델은 주기적으로 교체하는 필터 대신 물세척으로 관리하는 리유저블 필터를 사용합니다."
        : undefined,
    consumableIds: modelConsumableIds[id] ?? [],
    sources: [
      {
        title: entry.sourceTitle,
        url: entry.sourceUrl,
        sourceType: entry.sourceType ?? "manufacturer",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    verificationStatus: "official",
    isDemo: false,
  };
});
