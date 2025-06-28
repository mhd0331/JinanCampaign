export interface District {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  projects: {
    title: string;
    budget: string;
    description: string;
  }[];
}

export const districts: District[] = [
  {
    id: "jinan",
    name: "진안읍",
    title: "진안읍 발전 계획",
    description: "군 중심지로서의 역할 강화와 상권 활성화",
    image: "/attached_assets/진안시장-1_1751090757034.png",
    projects: [
      {
        title: "진안고원시장 종합 리뉴얼",
        budget: "80억원",
        description: "복합문화공간 조성으로 지역 상권 활성화"
      },
      {
        title: "스마트 주차관리 시스템",
        budget: "50억원", 
        description: "200면 → 800면 확대, 실시간 안내 시스템"
      },
      {
        title: "청년 정착 지원 패키지",
        budget: "200억원",
        description: "신혼부부 정착지원금 2,000만원, 임대주택 50세대"
      }
    ]
  },
  {
    id: "donghyang",
    name: "동향면",
    title: "동향면 생태관광 활성화",
    description: "수변생태공원과 디지털 인프라 구축",
    image: "/attached_assets/river-fish_1751090513751.png",
    projects: [
      {
        title: "수변생태공원 조성",
        budget: "120억원",
        description: "민물고기 보호센터 건립 및 생태체험 공간"
      },
      {
        title: "디지털 소통망 구축",
        budget: "30억원",
        description: "정보격차 해소 및 스마트 마을 조성"
      }
    ]
  },
  {
    id: "maryeong",
    name: "마령면",
    title: "마령면 관광산업 육성",
    description: "마이산 연계 관광자원 개발",
    image: "/attached_assets/공공형발전사업_1751090757028.png",
    projects: [
      {
        title: "마령장터 365 프로젝트",
        budget: "60억원",
        description: "마령시장 부활 및 상설 장터 운영"
      },
      {
        title: "마령 힐링 스테이 개발",
        budget: "100억원",
        description: "마이산 연계 숙박 및 체험시설"
      },
      {
        title: "에너지 자립마을 조성",
        budget: "80억원",
        description: "태양광 발전 및 에너지 저장시설"
      }
    ]
  },
  {
    id: "baekun",
    name: "백운면",
    title: "백운면 농업혁신 클러스터",
    description: "농기계 임대사업 혁신과 관광상품 개발",
    image: "/attached_assets/sheep-goat_1751090513752.png",
    projects: [
      {
        title: "농기계 임대사업 혁신",
        budget: "40억원",
        description: "스마트 농기계 도입 및 예약시스템 구축"
      },
      {
        title: "특화 관광상품 개발",
        budget: "50억원",
        description: "농촌체험 및 힐링 프로그램 운영"
      }
    ]
  },
  {
    id: "bugwi",
    name: "부귀면",
    title: "부귀면 축산업 특화",
    description: "산양유 특화단지와 6차 산업 육성",
    image: "/attached_assets/medical welfare-1_1751090513749.png",
    projects: [
      {
        title: "산양유 특화단지 조성",
        budget: "150억원",
        description: "산양 사육시설 현대화 및 가공시설 구축"
      },
      {
        title: "스마트 교통망 구축",
        budget: "35억원",
        description: "DRT 서비스 확대 및 교통편의 개선"
      }
    ]
  },
  {
    id: "sangjeon",
    name: "상전면",
    title: "상전면 교육환경 개선",
    description: "평생학습 지원과 농업소득 증대",
    image: "/attached_assets/medical welfare-2_1751090513751.png",
    projects: [
      {
        title: "교육환경 개선",
        budget: "70억원",
        description: "평생학습센터 건립 및 프로그램 운영"
      },
      {
        title: "농업소득 증대 지원",
        budget: "45억원",
        description: "6차 산업화 및 직거래 시스템 구축"
      }
    ]
  },
  {
    id: "seongsu",
    name: "성수면",
    title: "성수면 의료접근성 개선",
    description: "의료서비스 확충과 교육환경 개선",
    image: "/attached_assets/lakeside-tuor_1751090497063.png",
    projects: [
      {
        title: "의료접근성 혁신 프로젝트",
        budget: "90억원",
        description: "원격의료 시스템 및 이동진료 확대"
      },
      {
        title: "생활폐기물 처리시스템 현대화",
        budget: "25억원",
        description: "친환경 폐기물 처리시설 구축"
      }
    ]
  },
  {
    id: "ancheon",
    name: "안천면",
    title: "안천면 교통인프라 개선",
    description: "접근성 향상과 문화관광 자원 개발",
    image: "/attached_assets/tracking_1751090513753.png",
    projects: [
      {
        title: "교통인프라 개선",
        budget: "80억원",
        description: "도로 확포장 및 교통안전시설 확충"
      },
      {
        title: "문화관광 자원 개발",
        budget: "55억원",
        description: "지역 문화자원 발굴 및 관광상품화"
      }
    ]
  },
  {
    id: "yongdam",
    name: "용담면",
    title: "용담면 수변관광 특화",
    description: "용담호 수변 레저복합단지 조성",
    image: "/attached_assets/DRT_1751090487916.png",
    projects: [
      {
        title: "수변 레저복합단지 조성",
        budget: "300억원",
        description: "용담호 수상레저 및 숙박시설 구축"
      },
      {
        title: "스마트 관광 시스템 구축",
        budget: "40억원",
        description: "관광 순환코스 고도화 및 디지털 안내"
      },
      {
        title: "수질보호 고도화",
        budget: "120억원",
        description: "지속가능한 환경관리 시스템 구축"
      }
    ]
  },
  {
    id: "jeongcheon",
    name: "정천면",
    title: "정천면 교육관광 허브",
    description: "글로벌 농촌유학과 에코힐링 관광",
    image: "/attached_assets/DRT공공버스_1751090497062.png",
    projects: [
      {
        title: "글로벌 농촌유학 허브 조성",
        budget: "100억원",
        description: "조림초등학교 중심 국제교육 프로그램"
      },
      {
        title: "에코힐링 관광벨트 개발",
        budget: "180억원",
        description: "운장산 연계 생태관광 시설"
      }
    ]
  },
  {
    id: "jucheon",
    name: "주천면",
    title: "주천면 종합개발",
    description: "청년 정착과 혁신농업 클러스터",
    image: "/attached_assets/스마트팜1_1751090757032.png",
    projects: [
      {
        title: "주천 청년 드림 빌리지",
        budget: "250억원",
        description: "청년 정착 혁신기지 조성"
      },
      {
        title: "주천 스마트팜 밸리",
        budget: "200억원",
        description: "혁신농업 클러스터 구축"
      },
      {
        title: "운일암반일암 글로벌 명품관광지",
        budget: "150억원",
        description: "관광문화 르네상스 프로젝트"
      }
    ]
  }
];
