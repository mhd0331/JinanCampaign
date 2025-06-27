# 수동 코드 입력 가이드

## 1. 환경 변수 설정 (필수)

### Replit Secrets 설정
Replit 환경에서 다음 시크릿을 설정해야 합니다:

```
DATABASE_URL=postgresql://username:password@host:port/database
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

### 로컬 개발용 .env 파일
```bash
# .env 파일 생성
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

## 2. 후보자 기본 정보 변경

### 파일: `client/src/data/candidate.ts`
```typescript
export const candidateInfo = {
  name: "이우규",
  englishName: "Lee Woo-gyu", 
  position: "진안군수 후보",
  slogan: "함께 만드는 희망찬 진안",
  
  // 연락처 정보 (실제 정보로 변경)
  phone: "010-7366-8789",
  email: "contact@leewoogyu.kr",
  office: "진안군 진안읍 중앙로 123",
  
  // 소셜미디어 (실제 계정으로 변경)
  facebook: "https://facebook.com/leewoogyu",
  instagram: "https://instagram.com/leewoogyu_jinan",
  youtube: "https://youtube.com/@leewoogyu",
  
  // 약력 수정
  education: [
    "진안고등학교 졸업",
    "전북대학교 행정학과 학사",
    "전북대학교 행정대학원 석사"
  ],
  
  career: [
    "現 진안군의회 의원 (3선)",
    "前 진안군 청년회의소 회장",
    "前 진안군 체육회 부회장",
    "前 마령면 이장협의회 회장"
  ]
};
```

## 3. 정책 공약 내용 수정

### 파일: `client/src/data/policies.ts`
각 정책의 세부 내용을 실제 공약으로 변경:

```typescript
export const policies: Policy[] = [
  {
    id: "economic-growth",
    title: "지역경제 활성화",
    subtitle: "일자리 창출과 상생발전",
    description: "실제 공약 내용으로 변경",
    
    // 세부 정책 내용 수정
    details: [
      "스마트팜 육성으로 청년농업인 100명 육성",
      "농촌관광 브랜드 개발로 관광객 30% 증가",
      "지역화폐 확대로 지역 내 소비 촉진",
      "소상공인 창업지원센터 운영"
    ],
    
    // 예산 정보 실제 데이터로 변경
    budget: "80억원 (4년간)",
    
    // 아이콘과 색상은 정책 성격에 맞게 조정
    icon: "TrendingUp",
    color: "emerald-600",
    bgGradient: "from-emerald-500 to-green-600"
  }
  // ... 나머지 5개 정책도 동일하게 수정
];
```

## 4. 지역별 공약 수정

### 파일: `client/src/data/districts.ts`
11개 면별 실제 공약으로 변경:

```typescript
export const districts: District[] = [
  {
    id: "jinan",
    name: "진안읍",
    title: "진안읍 중심가 활성화",
    description: "실제 진안읍 공약 내용",
    image: "/images/jinan-eup.jpg", // 실제 이미지로 교체
    projects: [
      {
        title: "중앙광장 조성사업",
        budget: "15억원",
        description: "시민 문화공간 조성으로 중심가 활력 증대"
      },
      {
        title: "상가 리모델링 지원",
        budget: "5억원", 
        description: "노후 상가 현대화로 상권 경쟁력 강화"
      }
      // 실제 프로젝트들로 추가/수정
    ]
  }
  // ... 나머지 10개 면도 동일하게 수정
];
```

## 5. 연락처 정보 업데이트

### 파일: `client/src/components/ContactSection.tsx`
실제 선거사무소 정보로 변경:

```typescript
// 선거사무소 정보 수정 (라인 50-80 근처)
const officeInfo = {
  address: "전북 진안군 진안읍 중앙로 123 2층",
  phone: "063-432-8789",
  email: "office@leewoogyu.kr",
  hours: "평일 09:00-18:00, 토요일 09:00-17:00"
};
```

## 6. AI 학습 데이터 추가

### SQL로 직접 입력
데이터베이스에 AI 상담용 학습 문서 추가:

```sql
-- 정책 관련 학습 데이터
INSERT INTO ai_training_docs (title, content, category, tags) VALUES
(
  '이우규 후보 6대 공약 전문',
  '1. 지역경제 활성화: 스마트팜 육성, 농촌관광 브랜드화...
   2. 교육환경 개선: 작은학교 살리기, 평생교육 확대...
   3. 의료복지 확충: 마을보건의료센터 확대...
   ... (실제 공약 전문)',
  'policy',
  ARRAY['공약', '정책', '이우규']
),
(
  '진안군 현황 및 문제점',
  '인구: 24,000명 감소 추세
   주요 문제: 고령화, 청년유출, 일자리 부족
   해결방안: ... (실제 분석 내용)',
  'analysis',
  ARRAY['현황', '문제점', '분석']
);
```

## 7. 후보자 사진 교체

### 이미지 파일 교체
1. `attached_assets/` 폴더의 기존 이미지 파일 삭제
2. 새로운 후보자 사진을 같은 파일명으로 업로드
3. 또는 새 파일명 사용 시 관련 컴포넌트에서 경로 수정

### 파일: `client/src/components/CandidateProfile.tsx`
```typescript
// 이미지 경로 수정 (라인 10 근처)
import candidatePhoto from "@assets/new-candidate-photo.jpg";
```

## 8. Google Analytics 설정

### 파일: `client/src/lib/analytics.ts`
```typescript
// GA4 추적 ID 변경 (라인 3)
const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // 실제 GA4 ID로 변경

// 이벤트 카테고리도 필요시 수정
export const trackEvent = (category: string, action: string, label?: string) => {
  // ... 기존 코드
};
```

## 9. 메타 정보 및 SEO

### 파일: `client/index.html`
```html
<!-- 페이지 제목 및 메타 태그 수정 -->
<title>이우규 진안군수 후보 - 함께 만드는 희망찬 진안</title>
<meta name="description" content="실제 선거 슬로건 및 설명">
<meta property="og:title" content="이우규 진안군수 후보">
<meta property="og:description" content="실제 설명">
<meta property="og:image" content="실제 이미지 URL">
```

## 10. 색상 테마 커스터마이징

### 파일: `client/src/index.css`
진안 지역 특색에 맞는 색상으로 변경:

```css
:root {
  /* 진안 캠페인 색상 커스터마이징 */
  --jinan-green: hsl(120, 39%, 27%);    /* 메인 녹색 */
  --jinan-blue: hsl(207, 78%, 56%);     /* 보조 파란색 */
  --jinan-light-green: hsl(120, 39%, 49%); /* 밝은 녹색 */
  --jinan-accent: hsl(38, 100%, 50%);   /* 강조 색상 */
}
```

## 11. 시민 제안 카테고리 추가

### 파일: `client/src/pages/CitizenSuggestions.tsx`
필요한 카테고리 추가:

```typescript
const categoryColors = {
  infrastructure: "bg-blue-100 text-blue-800 border-blue-200",
  education: "bg-green-100 text-green-800 border-green-200",
  healthcare: "bg-red-100 text-red-800 border-red-200",
  environment: "bg-emerald-100 text-emerald-800 border-emerald-200",
  economy: "bg-purple-100 text-purple-800 border-purple-200",
  administration: "bg-indigo-100 text-indigo-800 border-indigo-200",
  // 새 카테고리 추가
  culture: "bg-pink-100 text-pink-800 border-pink-200",
  welfare: "bg-orange-100 text-orange-800 border-orange-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};
```

## 12. 도메인 및 배포 설정

### Replit 배포 설정
1. Replit에서 "Deploy" 탭 접속
2. 커스텀 도메인 연결 (예: leewoogyu.kr)
3. SSL 인증서 자동 설정 확인

### 환경별 설정
```typescript
// 프로덕션 환경에서는 실제 도메인 사용
const DOMAIN = process.env.NODE_ENV === 'production' 
  ? 'https://leewoogyu.replit.app' 
  : 'http://localhost:5000';
```

---

## 우선순위 작업 순서

1. **필수**: 환경 변수 설정 (DATABASE_URL, OPENAI_API_KEY)
2. **필수**: 후보자 기본 정보 변경
3. **중요**: 6대 공약 내용 수정
4. **중요**: 연락처 정보 업데이트
5. **중요**: 후보자 사진 교체
6. 지역별 공약 세부 내용 수정
7. AI 학습 데이터 추가
8. Google Analytics 설정
9. SEO 메타 정보 수정
10. 추가 기능 커스터마이징

*각 변경사항 적용 후 `npm run dev`로 테스트 확인 권장*