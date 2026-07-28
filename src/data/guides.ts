import type { Guide } from "@/types";

export const guides: Guide[] = [
  {
    slug: "find-model-number",
    title: "가전제품 모델명 찾는 방법",
    summary: "제품 라벨과 앱에서 정확한 모델 코드를 찾는 순서를 안내합니다.",
    category: "기초",
    steps: [
      {
        title: "제품 전원을 끄세요",
        description: "안전하게 제품을 이동하거나 뒤집을 수 있도록 전원을 분리합니다.",
      },
      {
        title: "정격 라벨을 찾으세요",
        description: "제품 뒷면, 바닥면, 필터 덮개 안쪽을 차례로 확인합니다.",
      },
      {
        title: "모델명과 제조번호를 구분하세요",
        description: "Model 또는 모델명 항목을 입력하고 Serial 번호는 제외합니다.",
      },
    ],
    checklist: [
      "영문과 숫자를 빠뜨리지 않았는지 확인",
      "색상 코드까지 포함",
      "하이픈은 그대로 입력해도 검색 가능",
    ],
    cautions: [
      "제조번호(S/N)를 모델명으로 입력하지 마세요.",
      "제품군 이름만으로는 정확한 소모품을 찾기 어렵습니다.",
    ],
  },
  {
    slug: "genuine-vs-compatible",
    title: "정품과 호환 소모품 비교",
    summary: "표기, 가격, 판매자 고지를 비교해 구매 판단에 필요한 기준을 정리합니다.",
    category: "기초",
    steps: [
      {
        title: "부품번호 확인",
        description: "정품 부품번호가 있다면 포장과 판매 페이지에서 같은지 확인합니다.",
      },
      {
        title: "호환 범위 확인",
        description: "판매자가 명시한 모델 코드가 내 제품과 완전히 일치하는지 확인합니다.",
      },
      {
        title: "교환 조건 확인",
        description: "개봉 후 반품 가능 여부와 필터 포장 상태를 확인합니다.",
      },
    ],
    checklist: ["모델 코드 완전 일치", "부품번호 확인", "판매자 고지 캡처"],
    cautions: ["‘범용’, ‘대부분 호환’ 같은 표현만으로 구매를 결정하지 마세요."],
  },
  {
    slug: "air-purifier-filter-guide",
    title: "공기청정기 필터 선택 가이드",
    summary: "집진, HEPA, 탈취, 프리필터의 차이와 확인 순서를 소개합니다.",
    category: "공기청정기",
    steps: [
      { title: "필터 구조 확인", description: "일체형인지 분리형인지 먼저 확인합니다." },
      {
        title: "필터 규격 확인",
        description: "제품 모델명뿐 아니라 기존 필터의 각인도 함께 확인합니다.",
      },
      {
        title: "관리 방식 확인",
        description: "세척 가능한 프리필터와 교체형 집진 필터를 구분합니다.",
      },
    ],
    checklist: ["일체형/분리형", "탈취 필터 포함 여부", "세척 가능 여부"],
    cautions: ["HEPA 등급 표기만 같아도 크기와 결합 방식이 다를 수 있습니다."],
  },
  {
    slug: "robot-vacuum-consumables",
    title: "로봇청소기 소모품 체크리스트",
    summary: "필터, 브러시, 먼지봉투, 물걸레 패드의 호환성을 확인합니다.",
    category: "로봇청소기",
    steps: [
      {
        title: "본체와 스테이션 구분",
        description: "본체용 소모품과 자동비움 스테이션용 소모품을 나눠 확인합니다.",
      },
      {
        title: "세대 확인",
        description: "같은 시리즈라도 세대별 브러시 결합부가 다를 수 있습니다.",
      },
      {
        title: "세트 구성 확인",
        description: "필요한 수량과 구성품이 모두 포함됐는지 확인합니다.",
      },
    ],
    checklist: ["본체 모델 코드", "스테이션 모델 코드", "브러시 결합부", "패드 모양"],
    cautions: ["시리즈 이름이 같아도 Plus, Ultra 등 세부 모델에 따라 다를 수 있습니다."],
  },
  {
    slug: "replacement-cycle",
    title: "소모품 교체주기 판단법",
    summary: "고정된 기간보다 사용 환경과 제품 상태를 함께 보는 방법을 안내합니다.",
    category: "관리",
    steps: [
      { title: "앱 알림 확인", description: "제조사 앱이 제공하는 잔여 수명 정보를 참고합니다." },
      { title: "외관 확인", description: "변색, 냄새, 손상, 흡입력 저하를 확인합니다." },
      {
        title: "사용 환경 반영",
        description: "반려동물, 미세먼지, 사용 빈도에 따라 주기를 조정합니다.",
      },
    ],
    checklist: ["흡입력 저하", "이상 냄새", "세척 후에도 남는 오염", "브러시 변형"],
    cautions: ["표시된 교체주기는 일반적인 예시이며 제조사 지침이 우선입니다."],
  },
];
