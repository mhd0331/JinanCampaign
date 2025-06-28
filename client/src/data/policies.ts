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
  timeline?: string[];
  implementation?: {
    phase1: string[];
    phase2: string[];
    phase3?: string[];
  };
  expectedOutcome?: string[];
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
    ],
    timeline: ["2026년 기본사회위원회 구성", "2027년 찐반장·찐여사 프로그램 시행", "2028년 협동조합 설립 완료"],
    implementation: {
      phase1: ["주민, 기업, 시민사회조직 등 참여 기본사회위원회 구성", "주거, 의료, 돌봄, 교육, 교통, 공공서비스 분야 정책 총괄 조정"],
      phase2: ["행복콜과 미니버스 활용한 찾아가는 서비스 제공", "50~60대 대상 찐반장 일자리 창출 및 전문 교육 시행"],
      phase3: ["그린에너지 협동조합 설립 지원", "공공사업 진안 주거자 가산점 제도 도입"]
    },
    expectedOutcome: ["주민 정책 참여율 30% 향상", "맞춤형 돌봄 서비스 만족도 90% 달성", "지역 협동조합 5개소 설립"]
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
    ],
    timeline: ["2026년 생활 활력센터 기본계획 수립", "2027년 5개소 시범 구축", "2028년 전체 11개소 완공"],
    implementation: {
      phase1: ["마을회관, 노인복지관 리모델링 및 신축", "공동급식, 무료 와이파이, 원격의료·행정 서비스 제공"],
      phase2: ["DRT 포함 행복콜을 통한 장애인 이동권 보장", "장애인 일자리 지원, 체육활동 강화"],
      phase3: ["초등 돌봄교실, 복지관, 마을 활력센터 과일간식 지원 확대", "장애인 가족지원 조례 개정"]
    },
    expectedOutcome: ["마을 공동체 활력 20% 증진", "장애인 복지 만족도 85% 달성", "농식품 바우처 이용률 90% 달성"]
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
      "1인당 15~50만원 지역화폐 발행 (10% 할인 혜택)",
      "마을 유휴지, 공공건물 활용 태양광 발전사업",
      "소수력, 영농형 태양광, LNG·바이오가스 연료전지 발전",
      "진안 로컬푸드 온라인 마케팅 강화",
      "해외 판로 개척 전문위원 채용",
      "진안고원 브랜드 홍보 및 유통 체계 개선"
    ],
    timeline: ["2026년 지역화폐 시범 발행", "2027년 신재생에너지 1단계 구축", "2028년 브랜드화 사업 완료"],
    implementation: {
      phase1: ["1인당 15~50만원 지역화폐(10% 할인) 매월 발행", "마을 유휴지, 공공건물 활용 태양광 발전사업 추진"],
      phase2: ["소수력, 영농형 태양광, LNG·바이오가스 연료전지 발전", "진안 로컬푸드 온라인 마케팅 강화"],
      phase3: ["해외 판로 개척 전문위원 채용 및 전시회 지원", "진안고원 브랜드 홍보 및 유통 체계 개선"]
    },
    expectedOutcome: ["지역 내 소비 30% 증가", "신재생에너지 자립도 40% 달성", "농산물 온라인 판매 50% 증가"]
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
      "DRT 중심의 하이브리드형 완전 공영제 도입",
      "고정노선과 DRT 존 설정으로 맞춤형 교통 서비스",
      "AI 서류체계 도입 및 보건소별 전문화 추진",
      "이동진료 서비스 확대 및 원격 협진 시스템",
      "재능나눔센터 활용 인력 보강",
      "수익창출 모델 개발"
    ],
    timeline: ["2026년 행복콜 시범 운영", "2027년 AI 서류체계 도입", "2028년 완전 공영제 완성"],
    implementation: {
      phase1: ["DRT 중심의 하이브리드형 완전 공영제 도입", "고정노선과 DRT 존 설정으로 맞춤형 교통 서비스 제공"],
      phase2: ["AI 서류체계 도입 및 보건소별 전문화 추진", "이동진료 서비스 확대 및 원격 협진 시스템 구축"],
      phase3: ["재능나눔센터 활용 인력 보강 및 수익창출 모델 개발"]
    },
    expectedOutcome: ["교통 접근성 60% 향상", "의료 서비스 만족도 80% 달성", "행정 효율성 40% 개선"]
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
      "새만금 송배전망 및 변전소 유치",
      "주천 양수발전 송배전망 활용 검토",
      "10Gbps 초고속 시범 광통신망 유치",
      "중앙집중식 및 분산형 하이브리드 하수처리 시스템",
      "농업 및 농촌 비점오염원 관리 강화",
      "용담호 주변 하수처리시설 설치"
    ],
    timeline: ["2026년 전력 인프라 기본계획", "2027년 광통신망 구축", "2028년 하수처리시설 완공"],
    implementation: {
      phase1: ["새만금 송배전망 및 변전소 유치", "주천 양수발전 송배전망 활용 검토"],
      phase2: ["10Gbps 초고속 시범 광통신망 유치", "중앙집중식 및 분산형 하이브리드 하수처리 시스템 구축"],
      phase3: ["농업 및 농촌 비점오염원 관리 강화", "용담호 주변 하수처리시설 설치"]
    },
    expectedOutcome: ["전력 공급 안정성 95% 달성", "초고속 인터넷 전 지역 서비스", "용담호 수질 등급 1등급 달성"]
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
