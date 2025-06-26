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
    details: [
      "찾아가는 찐반장, 찐여사 프로그램",
      "그린에너지 협동조합 설립", 
      "진안 주거자 가산점 제도"
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
    details: [
      "마을별 생활 활력센터 구축",
      "장애인 복지 향상",
      "농식품 바우처 제도 강화"
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
    details: [
      "1인당 50만원 지역화폐 발행",
      "소규모 신재생에너지 발전",
      "스마트팜 고원농업 단지"
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
    details: [
      "수요응답형 행복콜 서비스",
      "버스 공영화",
      "공공 의료기관 기능 강화"
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
    details: [
      "전력 및 초고속 광통신망 유치",
      "용담호 주변 하수처리시설",
      "산업단지 인프라 확충"
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
    details: [
      "인구유입 정책 예산 증액",
      "귀농 청년층 스마트팜 단지",
      "귀농·귀촌 임대주택 지원"
    ]
  }
];
