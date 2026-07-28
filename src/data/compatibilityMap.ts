/**
 * 제조사 공식 제품·부품 페이지에서 호환 관계가 확인된 연결만 등록합니다.
 * 소모품 상세 데이터의 compatibleModelIds와 반드시 양방향으로 일치해야 합니다.
 */
export const modelConsumableIds: Record<string, string[]> = {
  "lg-as355nsna": ["lg-puricare-m-filter", "lg-360-micro-filter"],
  "lg-as355ngna": ["lg-puricare-m-filter", "lg-360-micro-filter"],
  "lg-as355nsah": ["lg-puricare-g-filter", "lg-360-micro-filter"],
  "lg-as205nsja": ["lg-puricare-g-filter", "lg-360-micro-filter"],
  "lg-as205ngja": ["lg-puricare-g-filter", "lg-360-micro-filter"],

  "coway-ap-4025d": [
    "coway-4d-pre-filter",
    "coway-4d-dimensional-filter",
    "coway-air-matching-filter",
  ],
  "coway-ap-3024h": [
    "coway-4d-pre-filter",
    "coway-4d-dimensional-filter",
    "coway-air-matching-filter",
  ],

  "winix-attm115-mwk": ["winix-tower-prime-plus-all-in-one-filter"],

  "cuckoo-ac-25w20fwh": ["cuckoo-acf-wmt10-filter"],
  "cuckoo-ac-28ahnl20fnw": ["cuckoo-acf-ahmt10-filter"],
  "cuckoo-ac-17t20fwh": ["cuckoo-acf-tmt20-filter"],

  "dyson-bp04": ["dyson-bp04-k-carbon-filter", "dyson-big-quiet-hepa-h13-filter"],
  "dyson-bp03": ["dyson-big-quiet-hepa-h13-filter", "dyson-bp03-activated-carbon-filter"],
  "dyson-hp09": ["dyson-360-glass-hepa-carbon-filter"],
  "dyson-tp09": ["dyson-360-glass-hepa-carbon-filter"],
  "dyson-ph04": ["dyson-360-glass-hepa-carbon-filter"],

  "xiaomi-5-pro": ["xiaomi-5-series-mop-pad"],
  "xiaomi-5": ["xiaomi-5-series-mop-pad"],
  "xiaomi-s20": [
    "xiaomi-s20-dust-bin-filter",
    "xiaomi-s20-main-brush",
    "xiaomi-s20-side-brush",
    "xiaomi-s20-mop-pad",
  ],

  "skmagic-acl15c1askwh": ["skmagic-all-in-one-care-filter"],

  "blueair-cp7i": ["blueair-cp7i-pac-filter"],
  "blueair-5240i": ["blueair-dustmagnet-5200-combofilter"],
  "blueair-5210i": ["blueair-dustmagnet-5200-combofilter"],

  "roborock-saros-z70": ["roborock-saros-qrevo-s8-dust-bag"],
  "roborock-s8-maxv-ultra": ["roborock-saros-qrevo-s8-dust-bag"],
  "roborock-qrevo-curv-2-flow": ["roborock-saros-qrevo-s8-dust-bag"],
  "roborock-qrevo-curv": ["roborock-saros-qrevo-s8-dust-bag"],

  "dreame-x40-ultra": [
    "dreame-x40-main-brush",
    "dreame-x40-side-brush",
    "dreame-x40-dust-bag",
    "dreame-x40-dust-box-filter",
    "dreame-x40-mop-pad",
  ],

  "ecovacs-deebot-n20-pro-plus": [
    "ecovacs-n20-main-brush",
    "ecovacs-n20-side-brush",
    "ecovacs-n20-filter",
  ],

  "narwal-freo-z10": [
    "narwal-freo-mop-pad",
    "narwal-freo-zero-tangle-roller",
    "narwal-freo-dustbin-filter",
    "narwal-freo-dust-bag",
  ],
  "narwal-freo-z-ultra": [
    "narwal-freo-mop-pad",
    "narwal-freo-zero-tangle-roller",
    "narwal-freo-dustbin-filter",
    "narwal-freo-side-brush",
    "narwal-freo-dust-bag",
  ],
  "narwal-freo-x-ultra": [
    "narwal-freo-mop-pad",
    "narwal-freo-zero-tangle-roller",
    "narwal-freo-dustbin-filter",
    "narwal-freo-side-brush",
  ],
  "narwal-freo": ["narwal-freo-mop-pad", "narwal-freo-side-brush"],

  "irobot-combo-10-max": ["irobot-combo-j-high-efficiency-filter"],
  "irobot-combo-j9-plus": ["irobot-combo-j-high-efficiency-filter"],
  "irobot-combo-i5": ["irobot-i-e-j-high-efficiency-filter"],
  "irobot-105-vac": ["irobot-105-filter"],

  "everybot-rs350": ["everybot-rs350-microfiber-mop", "everybot-rs350-yarn-mop"],

  "eufy-omni-c20": [
    "eufy-c20-dust-bag",
    "eufy-c20-washable-filter",
    "eufy-c20-roller-brush",
    "eufy-c20-side-brush",
    "eufy-c20-mop-cloth",
  ],
  "eufy-x10-pro-omni": ["eufy-x10-pro-side-brush"],
  "eufy-omni-c28": ["eufy-c28-filter", "eufy-c28-dust-bag"],
};
