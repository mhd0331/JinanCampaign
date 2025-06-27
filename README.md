# 진안군 이우규 후보 선거 캠페인 웹사이트

## 프로젝트 개요

진안군수 선거 후보 이우규를 위한 종합 디지털 캠페인 플랫폼입니다. React와 TypeScript를 기반으로 구축되었으며, PostgreSQL 데이터베이스와 AI 기반 상담 서비스를 제공합니다.

## 주요 기능

- **후보자 소개**: 이력, 비전, 정책 철학
- **6대 핵심 공약**: 상세 정책 내용과 예산 계획
- **면별 맞춤 공약**: 11개 면별 특화 정책
- **AI 공약 상담**: OpenAI 기반 실시간 정책 문의 응답
- **시민 제안 시스템**: 시민 의견 수렴 및 피드백
- **관리자 CMS**: 콘텐츠 관리 시스템
- **데이터 시각화**: 정책 효과 및 예산 차트
- **반응형 디자인**: 모바일/태블릿/데스크톱 최적화

## 기술 스택

### Frontend
- React 18 + TypeScript
- Vite (빌드 도구)
- Tailwind CSS + shadcn/ui
- TanStack Query (상태 관리)
- Wouter (라우팅)
- Recharts (차트)
- React Hook Form + Zod (폼 검증)

### Backend
- Express.js + TypeScript
- PostgreSQL (Neon)
- Drizzle ORM
- OpenAI API (GPT-4o)

### 배포
- Replit 플랫폼
- 자동 스케일링
- PostgreSQL 16

## 설치 및 실행

### 필수 요구사항
- Node.js 20+
- PostgreSQL 데이터베이스
- OpenAI API 키

### 환경 변수 설정
```bash
DATABASE_URL=postgresql://username:password@host:port/database
OPENAI_API_KEY=sk-your-openai-api-key
```

### 개발 환경 실행
```bash
npm install
npm run db:push  # 데이터베이스 스키마 생성
npm run dev      # 개발 서버 시작
```

## 수동 코드 입력이 필요한 사항

### 1. 환경 변수 설정
다음 환경 변수들을 직접 설정해야 합니다:

```bash
# .env 파일 또는 환경 변수로 설정
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

### 2. 후보자 정보 수정
`client/src/data/candidate.ts` 파일에서 후보자 정보를 업데이트:

```typescript
export const candidateInfo = {
  name: "이우규",
  position: "진안군수 후보",
  phone: "010-7366-8789",
  email: "candidate@jinan.kr",
  // ... 기타 정보
};
```

### 3. 정책 내용 업데이트
`client/src/data/policies.ts`에서 6대 공약 내용 수정:

```typescript
export const policies: Policy[] = [
  {
    id: "policy1",
    title: "정책 제목",
    description: "정책 설명",
    budget: "예산",
    // ... 세부 내용
  }
];
```

### 4. 지역별 공약 수정
`client/src/data/districts.ts`에서 11개 면별 공약 업데이트:

```typescript
export const districts: District[] = [
  {
    id: "jinan",
    name: "진안읍",
    projects: [
      {
        title: "프로젝트명",
        budget: "예산",
        description: "설명"
      }
    ]
  }
];
```

### 5. Google Analytics 설정
`client/src/lib/analytics.ts`에서 GA4 추적 ID 변경:

```typescript
// Google Analytics 4 추적 ID를 본인의 것으로 변경
const GA_TRACKING_ID = 'G-XXXXXXXXXX';
```

### 6. 연락처 정보 업데이트
`client/src/components/ContactSection.tsx`에서 연락처 정보 수정:

```typescript
// 선거사무소 주소, 전화번호, 이메일 등
```

### 7. 후보자 사진 교체
`attached_assets/` 폴더의 후보자 사진을 새 이미지로 교체하고, 관련 컴포넌트에서 경로 업데이트

### 8. AI 상담 학습 데이터 추가
데이터베이스의 `ai_training_docs` 테이블에 AI 상담용 학습 문서 추가:

```sql
INSERT INTO ai_training_docs (title, content, category, tags)
VALUES ('정책 문서 제목', '상세 내용', 'policy', ARRAY['태그1', '태그2']);
```

### 9. 시민 제안 카테고리 커스터마이징
`client/src/pages/CitizenSuggestions.tsx`에서 카테고리 추가/수정:

```typescript
const categoryColors = {
  infrastructure: "bg-blue-100 text-blue-800 border-blue-200",
  // ... 새 카테고리 추가
  custom_category: "bg-custom-100 text-custom-800 border-custom-200"
};
```

## 주요 파일 구조

```
├── client/src/
│   ├── components/          # UI 컴포넌트
│   ├── data/               # 정적 데이터 (수정 필요)
│   ├── pages/              # 페이지 컴포넌트
│   ├── lib/                # 유틸리티 함수
│   └── hooks/              # 커스텀 훅
├── server/
│   ├── routes.ts           # API 라우트
│   ├── storage.ts          # 데이터베이스 액세스
│   └── services/           # 비즈니스 로직
├── shared/
│   └── schema.ts           # 데이터베이스 스키마
└── attached_assets/        # 정적 파일 (이미지 등)
```

## 데이터베이스 관리

### 스키마 업데이트
```bash
npm run db:push
```

### 직접 SQL 실행
Replit의 SQL 도구나 데이터베이스 클라이언트를 사용하여 데이터 조작

## 배포

### Replit에서 배포
1. 환경 변수 설정 완료
2. "Deploy" 버튼 클릭
3. 자동 빌드 및 배포 진행

### 커스텀 도메인 설정
Replit 배포 설정에서 도메인 연결 가능

## 지원 및 문의

- 기술 문의: 개발팀
- 정책 내용 문의: 선거사무소
- 시스템 오류: Replit 지원팀

## 라이센스

이 프로젝트는 선거 캠페인 목적으로 제작되었습니다.

---

*마지막 업데이트: 2025년 6월 27일*