import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import sharp from "sharp";
import { models } from "../src/data/models";

const checkedAt = "2026-09-11";

const pageOverrides: Record<string, string> = {
  "coway-ap-4025d": "https://www.coway.com/product/detail?prdno=1219",
  "coway-ap-3024h": "https://www.coway.com/product/detail?prdno=1186",
  "coway-ap-2219k": "https://prod.danawa.com/info/?pcode=10298868",
  "coway-ap-2021a": "https://www.cowayusa-shop.com/AP-2021A",
  "coway-ap-1521b": "https://prod.danawa.com/info/?pcode=14030744",
  "winix-azse430-jwk": "https://www.winix.com/product/843",
  "winix-at8e430-mwk": "https://www.winix.com/product/1538",
  "winix-aprm833-jwk": "https://www.winix.com/product/1211",
  "winix-attm115-mwk": "https://www.winix.com/product/1669",
  "winix-amsh993-jsk": "https://www.winix.com/product/852",
  "cuckoo-ac-23ah10fnw": "https://www.cuckoo.co.kr/mall/productView?productNo=11307",
  "cuckoo-ac-25w20fwh": "https://www.cuckoo.co.kr/mall/productView?productNo=7375",
  "cuckoo-ac-28ahnl20fnw": "https://www.cuckoo.co.kr/mall/productView?productNo=9229",
  "cuckoo-ac-17t20fwh": "https://www.cuckoo.co.kr/mall/productView?productNo=9226",
  "cuckoo-ac-14l10few": "https://www.cuckoo.co.kr/rental/productView?idx=860",
  "dyson-bp04": "https://www.dyson.co.kr/purifier-big-quiet-formaldehyde-nickel-blue",
  "dyson-bp03": "https://www.dyson.co.kr/purifier-big-quiet-formaldehyde-nickel-blue",
  "dyson-hp09": "https://www.dyson.co.kr/dyson-purifier-hot-cool-formaldehyde-white-nickel-gold",
  "dyson-tp09": "https://www.dyson.co.kr/dyson-purifier-cool-formaldehyde-white-gold",
  "dyson-ph04": "https://www.dyson.co.kr/dyson-purifier-humidify-cool-formaldehyde-white-gold",
  "xiaomi-5-pro": "https://www.mi.com/global/product/xiaomi-robot-vacuum-5-pro/",
  "xiaomi-5": "https://www.mi.com/global/product/xiaomi-robot-vacuum-5/",
  "xiaomi-x20-plus": "https://www.mi.com/global/product/xiaomi-robot-vacuum-x20-plus/",
  "xiaomi-x10-plus": "https://www.mi.com/global/product/xiaomi-robot-vacuum-x10-plus/",
  "xiaomi-s20": "https://www.mi.com/global/product/xiaomi-robot-vacuum-s20/",
  "blueair-cp7i": "https://www.blueair.com/products/classic-pro-cp7i",
  "blueair-cp9i": "https://www.blueair.com/en-kr/products/classic-pro-cp9i",
  "blueair-5240i": "https://www.blueair.com/products/dustmagnet-5400-series",
  "blueair-5210i": "https://www.blueair.com/products/dustmagnet-5400-series",
  "blueair-3410": "https://www.blueair.com/ko-kr/products/blue-3410",
  "roborock-saros-z70":
    "https://kr.roborock.com/products/%EB%A1%9C%EB%B3%B4%EB%9D%BD-saros-z70-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0",
  "roborock-s10-maxv-ultra": "https://kr.roborock.com/pages/roborock-s10-maxv-ultra",
  "roborock-s8-maxv-ultra":
    "https://us.roborock.com/products/roborock-s8-maxv-ultra-with-refill-drainage-system",
  "roborock-qrevo-curv-2-flow": "https://us.roborock.com/products/roborock-qrevo-curv-2-flow",
  "roborock-qrevo-curv": "https://us.roborock.com/products/roborock-qrevo-curv-s5x",
  "dreame-x50s-pro-master":
    "https://store.kr.dreametech.com/products/%EB%93%9C%EB%A6%AC%EB%AF%B8-x50s-pro-master-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0",
  "dreame-x50s-pro-ultra":
    "https://store.kr.dreametech.com/products/%EB%93%9C%EB%A6%AC%EB%AF%B8-x50s-pro-ultra-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0",
  "dreame-x40-ultra": "https://www.dreametech.com/products/dreametech-x40-ultra-robot-vacuum",
  "dreame-x40s-pro-ultra": "https://kr.dreametech.com/products?category=15",
  "dreame-l10s-pro-ultra-heat": "https://global.dreametech.com/products/l10s-pro-ultra",
  "ecovacs-deebot-x12":
    "https://www.ecovacs.com/us/shop/deebot-robotic-vacuum-cleaner/deebot-x12-omnicyclone",
  "ecovacs-deebot-x11":
    "https://www.ecovacs.com/kr/deebot-robotic-vacuum-cleaner/deebot-x11-omnicyclone",
  "ecovacs-deebot-x9":
    "https://www.ecovacs.com/us/shop/deebot-robotic-vacuum-cleaner/deebot-x9-pro-omni",
  "ecovacs-deebot-t80":
    "https://www.ecovacs.com/kr/deebot-robotic-vacuum-cleaner/deebot-t80-omni-white",
  "ecovacs-deebot-n20-pro-plus":
    "https://www.ecovacs.com/us/shop/deebot-robotic-vacuum-cleaner/n20-pro-plus",
  "narwal-flow": "https://kr.narwal.com/products/narwal-flow-1",
  "narwal-freo-z10": "https://kr.narwal.com/products/freo-z10-ultra",
  "narwal-freo-z-ultra": "https://us.narwal.com/products/freo-z-ultra-robot-vacuum-mop",
  "narwal-freo-x-ultra":
    "https://kr.narwal.com/products/narwal-%EB%82%98%EB%A5%B4%EC%99%88-freo-x-ultra-%EC%99%84%EC%84%B1%ED%98%95-%EC%98%AC%EC%9D%B8%EC%9B%90-%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0",
  "narwal-freo": "https://kr.narwal.com/products/narwal-freo",
  "irobot-combo-10-max":
    "https://www.irobot.com/en_US/roomba-combo-10-max-robot-with-autowash-dock/X085020.html",
  "irobot-205-dustcompactor":
    "https://www.irobot.com/en_US/roomba-205-dustcompactor-combo-robot/L124020.html",
  "irobot-105-vac": "https://www.irobot.com/en_US/us/products",
  "irobot-combo-j9-plus":
    "https://www.irobot.com/en_US/roomba-combo-j9plus-self-emptying-robot-vacuum-and-mop/C975020.html",
  "irobot-combo-i5":
    "https://www.irobot.com/en_US/roomba-combo-i5-robot-vacuum-and-mop/I517020.html",
  "everybot-q11":
    "https://everybotmall.com/product/공식몰-단독-26년-new-에브리봇-ai-올인원-로봇청소기-q11-먼지봉투3세정제/295/",
  "everybot-q9": "https://everybotmall.com/category/q9/135/",
  "everybot-q3-turbo-plus":
    "https://everybotmall.com/product/공식몰단독-에브리봇-q3-turbo-plus-로봇청소기/348/",
  "everybot-rs350":
    "https://everybotmall.com/product/%EC%97%90%EB%B8%8C%EB%A6%AC%EB%B4%87-%EC%97%A3%EC%A7%802-%EB%AC%BC%EA%B1%B8%EB%A0%88%EB%A1%9C%EB%B4%87%EC%B2%AD%EC%86%8C%EA%B8%B0-rs350/117/",
  "everybot-ts402m":
    "https://everybotmall.com/product/공식몰-단독스테디셀러-new-에브리봇-쓰리스핀-evo-물걸레-로봇청소기-ts40/332/",
  "eufy-omni-s2": "https://www.eufy.com/products/t2081111",
  "eufy-omni-c28": "https://www.eufy.com/au/products/eufy-robot-vacuum-omni-c28",
  "eufy-x10-pro-omni": "https://www.eufy.com/products/t2351111",
  "eufy-omni-s1-pro": "https://www.eufy.com/products/t2080111",
  "eufy-omni-c20": "https://www.eufy.com/products/t2280111",
};

const htmlEntityDecode = (value: string) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x2F;", "/")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");

function absoluteUrl(value: string, pageUrl: string) {
  try {
    return new URL(htmlEntityDecode(value), pageUrl).href;
  } catch {
    return undefined;
  }
}

function extractMeta(html: string, pageUrl: string) {
  const patterns = [
    /<meta[^>]+(?:property|name)=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+(?:name|property)=["']twitter:image["'][^>]+content=["']([^"']+)/i,
    /"image"\s*:\s*"([^"]+\.(?:png|jpe?g|webp)(?:\?[^"]*)?)"/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    const url = match?.[1] && absoluteUrl(match[1].replaceAll("\\/", "/"), pageUrl);
    if (url) return url;
  }
}

const directImages: Record<string, string> = {
  "coway-ap-2219k":
    "https://img.danuri.io/catalog-image/868/298/010/ada7c912cfcc489fb3c8c8a5852e5b50.jpg",
  "coway-ap-1521b":
    "https://img.danuri.io/catalog-image/744/030/014/0dd8c678c62a415c99985ca19ebdc9db.jpg",
  "dyson-bp04":
    "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/hero/ec/KR-BP03_BNKGLDDKBL_primary_withIcon.png",
  "dyson-bp03":
    "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/hero/ec/KR-BP03_BNKGLDDKBL_primary_withIcon.png",
  "dyson-hp09":
    "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/products/ec/527e/variants/sco/HP09_WHSGLD_Primary_800x1200.png?fmt=png-alpha&scl=1",
  "dyson-tp09":
    "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/products/machine-first-testing/support/purifiers/tp09-support-banner.jpg?wid=1920",
  "dyson-ph04":
    "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/leap-petite-global/markets/korea/support/s-a/KR_Support_PH04.jpg?wid=1920",
  "skmagic-acl130z0skpn": "https://static.skmagic.com/image/goods/G000069281/G000069281_2.png",
  "wells-aq107": "https://www.kyowonwells.com/upload/product/202301/00789954532.png",
  "blueair-5240i": "https://cdn.shopify.com/s/files/1/0881/6030/5438/files/1_20_1.png?v=1734554713",
  "blueair-5210i": "https://cdn.shopify.com/s/files/1/0881/6030/5438/files/1_20_1.png?v=1734554713",
  "roborock-qrevo-curv":
    "https://cdn.shopify.com/s/files/1/0082/3666/2902/files/Vivian_C_Set_8b2a8492-7aa2-4230-9054-2877fd143711.jpg?v=1757903106",
  "dreame-x40s-pro-ultra":
    "https://kr.dreametech.com/data/dreame/files/product/45/image.png?m=1768741249",
  "dreame-l10s-pro-ultra-heat":
    "https://kr.dreametech.com/data/dreame/files/product/43/image.png?m=1768741056",
  "irobot-combo-10-max":
    "https://www.irobot.com/on/demandware.static/-/Sites-master-catalog-irobot/default/dwe55aefa6/images/large/combo/X085020_1.jpg",
  "irobot-205-dustcompactor":
    "https://www.irobot.com/on/demandware.static/-/Sites-master-catalog-irobot/default/dw829867df/images/large/combo/L124020_0.jpg",
  "irobot-105-vac":
    "https://www.irobot.com/dw/image/v2/BFXP_PRD/on/demandware.static/-/Sites-site-catalog-irobot/default/dwcc55e30b/105_vac_AE.png?sw=1200&fmt=png",
  "irobot-combo-j9-plus":
    "https://www.irobot.com/on/demandware.static/-/Sites-master-catalog-irobot/default/dw11325a42/images/large/combo/C975020_00.jpg",
  "irobot-combo-i5":
    "https://www.irobot.com/on/demandware.static/-/Sites-master-catalog-irobot/default/dw7b16aec4/images/large/combo/i517020_01.jpg",
  "eufy-omni-s2":
    "https://cdn.shopify.com/s/files/1/0504/7094/4954/files/listing_a7166655-35b7-486f-a46d-37d7e4377d03.png?v=1783663736",
  "coway-ap-4025d":
    "https://mall.cowaystatic.com/static/upload/product/product/ID0101_6057_attimg_org.png?v=132220",
  "coway-ap-3024h":
    "https://mall.cowaystatic.com/static/upload/product/product/ID0101_5866_attimg_org.png?v=071128",
  "winix-azse430-jwk":
    "https://kr.object.ncloudstorage.com/w2r-commerce-winix/product/202412/241219140653034-b7813980c570401d83124d698cf6af20.png",
  "winix-at8e430-mwk":
    "https://kr.object.ncloudstorage.com/w2r-commerce-winix/product/202603/260311100439389-2c75dbfcf0e44876b8d1a8e6ad26cd8e.png",
  "winix-aprm833-jwk":
    "https://kr.object.ncloudstorage.com/w2r-commerce-winix/product/202603/260311100404031-d479ed82f60146d98b797f7f70f12642.png",
  "winix-attm115-mwk":
    "https://kr.object.ncloudstorage.com/w2r-commerce-winix/product/202603/260311100459969-b292e5e1641142c0b7219a98549ee48b.png",
};

const excludedImageIds = new Set(["roborock-s10-maxv-ultra"]);
const trimImageIds = new Set(["dreame-l10s-pro-ultra-heat"]);

const outputDir = path.resolve("public/images/models");
await mkdir(outputDir, { recursive: true });
const records: Array<{
  id: string;
  src: string;
  alt: string;
  sourceUrl: string;
  checkedAt: string;
}> = [];
const failures: Array<{ id: string; reason: string }> = [];

for (const model of models) {
  if (excludedImageIds.has(model.id)) {
    failures.push({ id: model.id, reason: "공식 본체 이미지를 확인하지 못함" });
    continue;
  }

  const pageUrl =
    pageOverrides[model.id] ??
    (model.brandId === "lg"
      ? `https://www.lge.co.kr/air-purifier/${model.slug}`
      : model.sources[0]?.url);
  if (!pageUrl) {
    failures.push({ id: model.id, reason: "제품 페이지 없음" });
    continue;
  }

  try {
    let imageUrl: string | undefined = directImages[model.id];
    if (!imageUrl) {
      const pageResponse = await fetch(pageUrl, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; ModelFitImageSync/1.0)" },
        redirect: "follow",
        signal: AbortSignal.timeout(25_000),
      });
      if (!pageResponse.ok) throw new Error(`제품 페이지 HTTP ${pageResponse.status}`);
      const html = await pageResponse.text();
      imageUrl = extractMeta(html, pageResponse.url);
    }
    if (!imageUrl) throw new Error("대표 이미지 메타데이터 없음");

    const imageResponse = await fetch(imageUrl, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; ModelFitImageSync/1.0)" },
      redirect: "follow",
      signal: AbortSignal.timeout(25_000),
    });
    if (!imageResponse.ok) throw new Error(`이미지 HTTP ${imageResponse.status}`);
    const input = Buffer.from(await imageResponse.arrayBuffer());
    const destination = path.join(outputDir, `${model.id}.webp`);
    const image = sharp(input).rotate();
    if (trimImageIds.has(model.id)) image.trim({ background: "#ffffff", threshold: 10 });
    await image
      .resize(720, 720, {
        fit: "contain",
        background: { r: 248, g: 250, b: 252, alpha: 1 },
        withoutEnlargement: !trimImageIds.has(model.id),
      })
      .webp({ quality: 82, effort: 5 })
      .toFile(destination);

    records.push({
      id: model.id,
      src: `/images/models/${model.id}.webp`,
      alt: `${model.brandName} ${model.modelCode} 제품 본체`,
      sourceUrl: pageUrl,
      checkedAt,
    });
    console.log(`[ok] ${model.id} <- ${imageUrl}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    failures.push({ id: model.id, reason });
    console.error(`[failed] ${model.id}: ${reason}`);
  }
}

const generated = `import type { ModelImage } from "@/types";

export const modelImages: Record<string, ModelImage> = ${JSON.stringify(
  Object.fromEntries(records.map(({ id, ...record }) => [id, record])),
  null,
  2,
)};
`;
await writeFile(
  "src/data/modelImages.ts",
  await prettier.format(generated, { parser: "typescript" }),
  "utf8",
);
console.log(`모델 이미지 동기화: 성공 ${records.length}, 실패 ${failures.length}`);
if (failures.length) console.log(JSON.stringify(failures, null, 2));
