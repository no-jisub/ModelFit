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
  "coway-ap-2219k": ["coway-ap2219k-composite-filter"],
  "coway-ap-2021a": [
    "coway-4d-pre-filter",
    "coway-4d-dimensional-filter",
    "coway-air-matching-filter",
  ],
  "coway-ap-1521b": [
    "coway-4d-pre-filter",
    "coway-4d-dimensional-filter",
    "coway-air-matching-filter",
  ],

  "winix-azse430-jwk": ["winix-zero-s-replacement-filter"],
  "winix-at8e430-mwk": ["winix-tower-edge-all-in-one-filter"],
  "winix-aprm833-jwk": ["winix-tower-prime-all-in-one-filter"],
  "winix-attm115-mwk": ["winix-tower-prime-plus-all-in-one-filter"],
  "winix-amsh993-jsk": ["winix-master-s-all-in-one-filter"],

  "cuckoo-ac-23ah10fnw": ["cuckoo-ac23-total-care-filter"],
  "cuckoo-ac-25w20fwh": ["cuckoo-acf-wmt10-filter"],
  "cuckoo-ac-28ahnl20fnw": ["cuckoo-acf-ahmt10-filter"],
  "cuckoo-ac-17t20fwh": ["cuckoo-acf-tmt20-filter"],
  "cuckoo-ac-14l10few": ["cuckoo-ac14-total-care-filter"],

  "dyson-bp04": ["dyson-bp04-k-carbon-filter", "dyson-big-quiet-hepa-h13-filter"],
  "dyson-bp03": ["dyson-big-quiet-hepa-h13-filter", "dyson-bp03-activated-carbon-filter"],
  "dyson-hp09": ["dyson-360-glass-hepa-carbon-filter"],
  "dyson-tp09": ["dyson-360-glass-hepa-carbon-filter"],
  "dyson-ph04": ["dyson-360-glass-hepa-carbon-filter"],

  "xiaomi-5-pro": ["xiaomi-5-series-mop-pad"],
  "xiaomi-5": ["xiaomi-5-series-mop-pad"],
  "xiaomi-x20-plus": [
    "xiaomi-x20-plus-filter",
    "xiaomi-x20-plus-main-brush",
    "xiaomi-x20-plus-side-brush",
    "xiaomi-x20-plus-mop-pad",
    "xiaomi-x20-plus-dust-bag",
  ],
  "xiaomi-x10-plus": [
    "xiaomi-x10-plus-filter",
    "xiaomi-x10-plus-main-brush",
    "xiaomi-x10-plus-side-brush",
    "xiaomi-x10-plus-mop-pad",
    "xiaomi-x10-plus-dust-bag",
  ],
  "xiaomi-s20": [
    "xiaomi-s20-dust-bin-filter",
    "xiaomi-s20-main-brush",
    "xiaomi-s20-side-brush",
    "xiaomi-s20-mop-pad",
  ],

  "skmagic-acl-131t0": ["skmagic-acl131-filter"],
  "skmagic-acl15c1askwh": ["skmagic-all-in-one-care-filter"],
  "skmagic-acl20c1askwh": ["skmagic-acl20-all-in-one-care-filter"],
  "skmagic-acl25c1askce": ["skmagic-acl25-all-in-one-care-filter"],
  "skmagic-acl130z0skpn": ["skmagic-acl130z-filter"],

  "wells-al106": ["wells-al106-filter-set"],
  "wells-an730": ["wells-tornado-allcare-filter"],
  "wells-an734": ["wells-tornado-allcare-filter"],
  "wells-aq107": ["wells-aq107-filter-set"],
  "wells-am315": ["wells-am315-combi-filter"],

  "blueair-cp7i": ["blueair-cp7i-pac-filter"],
  "blueair-cp9i": ["blueair-cp9i-main-filter"],
  "blueair-5240i": ["blueair-dustmagnet-5200-combofilter"],
  "blueair-5210i": ["blueair-dustmagnet-5200-combofilter"],
  "blueair-3410": ["blueair-3410-particle-carbon-filter"],

  "roborock-saros-z70": ["roborock-saros-qrevo-s8-dust-bag"],
  "roborock-s10-maxv-ultra": [
    "roborock-s10-maxv-main-brush",
    "roborock-s10-maxv-side-brush",
    "roborock-s10-maxv-mop-pad",
    "roborock-s10-maxv-dust-bag",
  ],
  "roborock-s8-maxv-ultra": ["roborock-saros-qrevo-s8-dust-bag"],
  "roborock-qrevo-curv-2-flow": ["roborock-saros-qrevo-s8-dust-bag"],
  "roborock-qrevo-curv": ["roborock-saros-qrevo-s8-dust-bag"],

  "dreame-x50s-pro-master": [
    "dreame-x50s-main-brush",
    "dreame-x50s-side-brush",
    "dreame-x50s-dust-box-filter",
    "dreame-x50s-mop-pad",
    "dreame-x50s-dust-bag",
  ],
  "dreame-x50s-pro-ultra": [
    "dreame-x50s-main-brush",
    "dreame-x50s-side-brush",
    "dreame-x50s-dust-box-filter",
    "dreame-x50s-mop-pad",
    "dreame-x50s-dust-bag",
  ],
  "dreame-x40-ultra": [
    "dreame-x40-main-brush",
    "dreame-x40-side-brush",
    "dreame-x40-dust-bag",
    "dreame-x40-dust-box-filter",
    "dreame-x40-mop-pad",
  ],
  "dreame-x40s-pro-ultra": [
    "dreame-x40s-main-brush",
    "dreame-x40s-side-brush",
    "dreame-x40s-filter",
    "dreame-x40s-mop-pad",
    "dreame-x40s-dust-bag",
  ],
  "dreame-l10s-pro-ultra-heat": [
    "dreame-l10s-heat-main-brush",
    "dreame-l10s-heat-side-brush",
    "dreame-l10s-heat-mop-pad",
    "dreame-l10s-heat-dust-bag",
  ],

  "ecovacs-deebot-x12": [
    "ecovacs-x12-filter",
    "ecovacs-x12-main-brush",
    "ecovacs-x12-side-brush",
    "ecovacs-x12-roller-mop",
  ],
  "ecovacs-deebot-x11": [
    "ecovacs-x11-filter",
    "ecovacs-x11-main-brush",
    "ecovacs-x11-side-brush",
    "ecovacs-x11-roller-mop",
  ],
  "ecovacs-deebot-x9": [
    "ecovacs-x9-t80-filter",
    "ecovacs-x9-t80-dust-bag",
    "ecovacs-x9-t80-roller-mop",
  ],
  "ecovacs-deebot-t80": [
    "ecovacs-x9-t80-filter",
    "ecovacs-x9-t80-dust-bag",
    "ecovacs-x9-t80-roller-mop",
    "ecovacs-t80-main-brush",
  ],
  "ecovacs-deebot-n20-pro-plus": [
    "ecovacs-n20-main-brush",
    "ecovacs-n20-side-brush",
    "ecovacs-n20-filter",
  ],

  "narwal-flow": [
    "narwal-flow-dustbin-filter",
    "narwal-flow-main-brush",
    "narwal-flow-side-brush",
    "narwal-flow-track-mop",
    "narwal-flow-dust-bag",
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
  "irobot-205-dustcompactor": [
    "irobot-205-filter",
    "irobot-205-main-brush",
    "irobot-205-side-brush",
    "irobot-205-mop-pad",
  ],
  "irobot-combo-j9-plus": ["irobot-combo-j-high-efficiency-filter"],
  "irobot-combo-i5": ["irobot-i-e-j-high-efficiency-filter"],
  "irobot-105-vac": ["irobot-105-filter"],

  "everybot-q11": [
    "everybot-q11-filter",
    "everybot-q11-main-brush",
    "everybot-q11-side-brush",
    "everybot-q11-mop-pad",
    "everybot-q11-dust-bag",
  ],
  "everybot-q9": [
    "everybot-q9-filter",
    "everybot-q9-main-brush",
    "everybot-q9-side-brush",
    "everybot-q9-mop-pad",
    "everybot-q9-dust-bag",
  ],
  "everybot-q3-turbo-plus": ["everybot-q3-filter", "everybot-q3-main-brush"],
  "everybot-rs350": ["everybot-rs350-microfiber-mop", "everybot-rs350-yarn-mop"],

  "eufy-omni-s2": [
    "eufy-s2-filter",
    "eufy-s2-main-brush",
    "eufy-s2-side-brush",
    "eufy-s2-roller-mop",
    "eufy-s2-dust-bag",
  ],
  "eufy-omni-c20": [
    "eufy-c20-dust-bag",
    "eufy-c20-washable-filter",
    "eufy-c20-roller-brush",
    "eufy-c20-side-brush",
    "eufy-c20-mop-cloth",
  ],
  "eufy-x10-pro-omni": ["eufy-x10-pro-side-brush"],
  "eufy-omni-s1-pro": [
    "eufy-s1-pro-filter",
    "eufy-s1-pro-main-brush",
    "eufy-s1-pro-side-brush",
    "eufy-s1-pro-roller-mop",
    "eufy-s1-pro-dust-bag",
  ],
  "eufy-omni-c28": ["eufy-c28-filter", "eufy-c28-dust-bag"],
};
