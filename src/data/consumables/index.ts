import type { ConsumableCompatibility } from "@/types";
import { createPurchaseLinks } from "../../utils/purchaseLinks";
import { createProductOptions } from "../../utils/productOptions";
import { lgConsumableRecords } from "./lg";
import { cowayConsumableRecords } from "./coway";
import { winixConsumableRecords } from "./winix";
import { cuckooConsumableRecords } from "./cuckoo";
import { dysonConsumableRecords } from "./dyson";
import { xiaomiConsumableRecords } from "./xiaomi";
import { skmagicConsumableRecords } from "./skmagic";
import { blueairConsumableRecords } from "./blueair";
import { roborockConsumableRecords } from "./roborock";
import { dreameConsumableRecords } from "./dreame";
import { ecovacsConsumableRecords } from "./ecovacs";
import { narwalConsumableRecords } from "./narwal";
import { irobotConsumableRecords } from "./irobot";
import { everybotConsumableRecords } from "./everybot";
import { eufyConsumableRecords } from "./eufy";
import { wellsConsumableRecords } from "./wells";
import type { ConsumableRecord } from "./shared";

const allRecords: ConsumableRecord[] = [
  ...lgConsumableRecords,
  ...cowayConsumableRecords,
  ...winixConsumableRecords,
  ...cuckooConsumableRecords,
  ...dysonConsumableRecords,
  ...xiaomiConsumableRecords,
  ...skmagicConsumableRecords,
  ...blueairConsumableRecords,
  ...roborockConsumableRecords,
  ...dreameConsumableRecords,
  ...ecovacsConsumableRecords,
  ...narwalConsumableRecords,
  ...irobotConsumableRecords,
  ...everybotConsumableRecords,
  ...eufyConsumableRecords,
  ...wellsConsumableRecords,
];
const consumableOrder = [
  "lg-puricare-m-filter",
  "lg-puricare-g-filter",
  "lg-360-micro-filter",
  "coway-4d-pre-filter",
  "coway-4d-dimensional-filter",
  "coway-air-matching-filter",
  "winix-tower-prime-plus-all-in-one-filter",
  "cuckoo-acf-wmt10-filter",
  "cuckoo-acf-ahmt10-filter",
  "cuckoo-acf-tmt20-filter",
  "dyson-bp04-k-carbon-filter",
  "dyson-big-quiet-hepa-h13-filter",
  "dyson-bp03-activated-carbon-filter",
  "dyson-360-glass-hepa-carbon-filter",
  "xiaomi-5-series-mop-pad",
  "xiaomi-s20-dust-bin-filter",
  "xiaomi-s20-main-brush",
  "xiaomi-s20-side-brush",
  "xiaomi-s20-mop-pad",
  "skmagic-all-in-one-care-filter",
  "blueair-cp7i-pac-filter",
  "blueair-dustmagnet-5200-combofilter",
  "roborock-saros-qrevo-s8-dust-bag",
  "dreame-x40-main-brush",
  "dreame-x40-side-brush",
  "dreame-x40-dust-bag",
  "dreame-x40-dust-box-filter",
  "dreame-x40-mop-pad",
  "ecovacs-n20-main-brush",
  "ecovacs-n20-side-brush",
  "ecovacs-n20-filter",
  "narwal-freo-mop-pad",
  "narwal-freo-zero-tangle-roller",
  "narwal-freo-dustbin-filter",
  "narwal-freo-side-brush",
  "narwal-freo-dust-bag",
  "irobot-combo-j-high-efficiency-filter",
  "irobot-i-e-j-high-efficiency-filter",
  "irobot-105-filter",
  "everybot-rs350-microfiber-mop",
  "everybot-rs350-yarn-mop",
  "eufy-c20-dust-bag",
  "eufy-c20-washable-filter",
  "eufy-c20-roller-brush",
  "eufy-c20-side-brush",
  "eufy-c20-mop-cloth",
  "eufy-x10-pro-side-brush",
  "eufy-c28-filter",
  "eufy-c28-dust-bag",
  "coway-ap2219k-composite-filter",
  "winix-zero-s-replacement-filter",
  "winix-tower-edge-all-in-one-filter",
  "winix-tower-prime-all-in-one-filter",
  "winix-master-s-all-in-one-filter",
  "cuckoo-ac23-total-care-filter",
  "cuckoo-ac14-total-care-filter",
  "xiaomi-x20-plus-filter",
  "xiaomi-x20-plus-main-brush",
  "xiaomi-x20-plus-side-brush",
  "xiaomi-x20-plus-mop-pad",
  "xiaomi-x20-plus-dust-bag",
  "xiaomi-x10-plus-filter",
  "xiaomi-x10-plus-main-brush",
  "xiaomi-x10-plus-side-brush",
  "xiaomi-x10-plus-mop-pad",
  "xiaomi-x10-plus-dust-bag",
  "skmagic-acl131-filter",
  "skmagic-acl20-all-in-one-care-filter",
  "skmagic-acl25-all-in-one-care-filter",
  "skmagic-acl130z-filter",
  "wells-al106-filter-set",
  "wells-tornado-allcare-filter",
  "wells-aq107-filter-set",
  "wells-am315-combi-filter",
  "blueair-cp9i-main-filter",
  "blueair-3410-particle-carbon-filter",
  "roborock-s10-maxv-main-brush",
  "roborock-s10-maxv-side-brush",
  "roborock-s10-maxv-mop-pad",
  "roborock-s10-maxv-dust-bag",
  "dreame-x50s-main-brush",
  "dreame-x50s-side-brush",
  "dreame-x50s-dust-box-filter",
  "dreame-x50s-mop-pad",
  "dreame-x50s-dust-bag",
  "dreame-x40s-main-brush",
  "dreame-x40s-side-brush",
  "dreame-x40s-filter",
  "dreame-x40s-mop-pad",
  "dreame-x40s-dust-bag",
  "dreame-l10s-heat-main-brush",
  "dreame-l10s-heat-side-brush",
  "dreame-l10s-heat-mop-pad",
  "dreame-l10s-heat-dust-bag",
  "ecovacs-x12-filter",
  "ecovacs-x12-main-brush",
  "ecovacs-x12-side-brush",
  "ecovacs-x12-roller-mop",
  "ecovacs-x11-filter",
  "ecovacs-x11-main-brush",
  "ecovacs-x11-side-brush",
  "ecovacs-x11-roller-mop",
  "ecovacs-x9-t80-filter",
  "ecovacs-x9-t80-dust-bag",
  "ecovacs-x9-t80-roller-mop",
  "ecovacs-t80-main-brush",
  "narwal-flow-dustbin-filter",
  "narwal-flow-main-brush",
  "narwal-flow-side-brush",
  "narwal-flow-track-mop",
  "narwal-flow-dust-bag",
  "irobot-205-filter",
  "irobot-205-main-brush",
  "irobot-205-side-brush",
  "irobot-205-mop-pad",
  "everybot-q11-filter",
  "everybot-q11-main-brush",
  "everybot-q11-side-brush",
  "everybot-q11-mop-pad",
  "everybot-q11-dust-bag",
  "everybot-q9-filter",
  "everybot-q9-main-brush",
  "everybot-q9-side-brush",
  "everybot-q9-mop-pad",
  "everybot-q9-dust-bag",
  "everybot-q3-filter",
  "everybot-q3-main-brush",
  "everybot-three-spin-microfiber-mop",
  "everybot-three-spin-yarn-mop",
  "everybot-three-spin-disposable-sheet",
  "eufy-s2-filter",
  "eufy-s2-main-brush",
  "eufy-s2-side-brush",
  "eufy-s2-roller-mop",
  "eufy-s2-dust-bag",
  "eufy-s1-pro-filter",
  "eufy-s1-pro-main-brush",
  "eufy-s1-pro-side-brush",
  "eufy-s1-pro-roller-mop",
  "eufy-s1-pro-dust-bag",
  "irobot-clean-base-autowash-dust-bag",
  "irobot-combo-i-e-j-dual-rubber-brushes",
  "irobot-combo-i-e-j-edge-brush",
  "irobot-combo-j9-washable-mop-pad",
  "irobot-combo-i5-mopping-kit",
  "roborock-saros-z70-main-brush",
  "roborock-saros-z70-side-brush",
  "roborock-saros-z70-filter",
  "roborock-saros-z70-mop-cloth",
  "eufy-x10-pro-main-brush",
  "eufy-x10-pro-filter",
  "eufy-x10-pro-mop-cloth",
  "eufy-x10-pro-dust-bag",
  "eufy-c28-side-brush",
  "eufy-c28-main-brush",
  "eufy-c28-roller-mop",
  "xiaomi-5-series-anti-tangle-side-brush",
] as const;
const recordsById = new Map(allRecords.map((record) => [record.id, record]));

if (recordsById.size !== allRecords.length) {
  throw new Error("소모품 ID가 중복되었습니다.");
}
if (recordsById.size !== consumableOrder.length) {
  throw new Error("소모품 순서 목록과 브랜드 데이터 개수가 다릅니다.");
}

const consumableRecords = consumableOrder.map((id) => {
  const record = recordsById.get(id);
  if (!record) throw new Error("소모품 순서 목록에만 존재하는 ID입니다: " + id);
  return record;
});

export const consumables: ConsumableCompatibility[] = consumableRecords.map((part) => {
  const normalizedPart = {
    ...part,
    partNumberStatus:
      part.partNumberStatus ?? (part.genuinePartNumber?.trim() ? "confirmed" : "not-listed"),
  };

  const purchaseLinks = createPurchaseLinks(normalizedPart);

  return {
    ...normalizedPart,
    purchaseLinks,
    productOptions:
      normalizedPart.productOptions ?? createProductOptions(normalizedPart, purchaseLinks),
  };
});
