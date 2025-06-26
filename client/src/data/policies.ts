export interface Policy {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  details: string[];
  budget?: string;
}

export const policies: Policy[] = [
  {
    id: "participation",
    title: "주민참여행정",
    subtitle: "기본사회위원회 운영",
    description: "주민, 기업, 시민사회조직이 참여하는 기본사회위원회를 통해 주거, 의료, 돌봄, 교육, 교통 정책을 총괄 조정",
    icon: "Users",
    color: "text-white",
    bgGradient: "from-green-700 to-green-500",
    budget: "30억원",
    details: [
      "찾아가는 찐반장, 찐여사 프로그램 운영",
      "그린에너지 협동조합 설립 지원", 
      "진안 주거자 가산점 제도 도입",
      "기본사회위원회 운영 예산",
      "주민참여 교육 프로그램 시행",
      "마을 단위 자치활동 지원금"
    ]
  },
  {
    id: "welfare",
    title: "삶의 질 향상",
    subtitle: "공동체 활력 증진",
    description: "마을별 생활 활력센터 구축과 장애인 복지 향상을 통해 모든 군민의 삶의 질을 개선",
    icon: "Heart",
    color: "text-white",
    bgGradient: "from-blue-700 to-blue-500",
    budget: "45억원",
    details: [
      "마을별 생활 활력센터 11개소 구축",
      "장애인 복지시설 확충 및 서비스 개선",
      "농식품 바우처 제도 강화 (월 10만원)",
      "고령자 맞춤형 돌봄 서비스 확대",
      "청년 정착 지원금 확대",
      "육아 종합지원센터 운영"
    ]
  },
  {
    id: "economy",
    title: "지속가능한 경제성장",
    subtitle: "지역경제 활성화",
    description: "지역화폐 발행과 신재생에너지 발전을 통해 지역 경제의 선순환 구조를 구축",
    icon: "TrendingUp",
    color: "text-white",
    bgGradient: "from-orange-700 to-orange-500",
    budget: "520억원",
    details: [
      "1인당 50만원 지역화폐 발행 (총 122억원)",
      "소규모 신재생에너지 발전소 건설",
      "스마트팜 고원농업 단지 조성 (300억원)",
      "농업 6차산업화 지원센터 운영",
      "지역특산품 브랜드화 사업",
      "청년창업 인큐베이팅 센터 구축"
    ]
  },
  {
    id: "administration",
    title: "행정 혁신",
    subtitle: "미래 100년 행정",
    description: "수요응답형 행복콜 서비스와 공공 의료기관 기능 강화로 효율적인 행정 서비스 제공",
    icon: "Settings",
    color: "text-white",
    bgGradient: "from-purple-700 to-purple-500",
    budget: "80억원",
    details: [
      "수요응답형 행복콜(DRT) 서비스 도입",
      "버스 공영화 추진 및 노선 확대",
      "공공 의료기관 기능 강화 및 장비 현대화",
      "디지털 행정서비스 플랫폼 구축",
      "원스톱 민원처리 시스템 도입",
      "찾아가는 행정서비스 확대"
    ]
  },
  {
    id: "infrastructure",
    title: "인프라 개선",
    subtitle: "주거 및 산업 인프라",
    description: "전력 및 초고속 광통신망 유치를 통해 첨단 산업 유치 기반을 마련",
    icon: "Building",
    color: "text-white",
    bgGradient: "from-indigo-700 to-indigo-500",
    budget: "350억원",
    details: [
      "전력 및 초고속 광통신망 유치 (100억원)",
      "용담호 주변 하수처리시설 건설 (150억원)",
      "산업단지 인프라 확충 및 현대화",
      "도로 및 교통 인프라 개선",
      "상하수도 시설 확충",
      "공공 와이파이 전 지역 확대"
    ]
  },
  {
    id: "population",
    title: "인구 유입",
    subtitle: "미래 100년 인구정책",
    description: "인구유입 정책 예산 증액과 귀농·귀촌 지원으로 지역 인구 증가 및 정착 지원",
    icon: "Home",
    color: "text-white",
    bgGradient: "from-pink-700 to-pink-500",
    budget: "75억원",
    details: [
      "인구유입 정책 예산 3배 증액 (연 25억원)",
      "귀농 청년층 스마트팜 단지 조성",
      "귀농·귀촌 임대주택 100가구 지원",
      "신혼부부 정착지원금 확대 (500만원)",
      "청년 창업 지원금 및 멘토링 프로그램",
      "출산 축하금 및 육아 지원 서비스"
    ]
  }
];
