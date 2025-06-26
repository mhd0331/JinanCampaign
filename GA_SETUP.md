# Google Analytics 설정 가이드

## 현재 상태

Google Analytics 추적 코드가 웹사이트에 설치되었습니다. 하지만 실제로 작동하려면 Google Analytics 계정에서 측정 ID를 발급받아야 합니다.

## 설정 방법

### 1. Google Analytics 계정 생성
1. [Google Analytics](https://analytics.google.com/) 접속
2. '측정 시작' 클릭
3. 계정명 입력 (예: "이우규 선거사무소")
4. 속성명 입력 (예: "진안군수 후보 홈페이지")
5. 산업 카테고리: "정치"
6. 보고 시간대: "대한민국"

### 2. 데이터 스트림 설정
1. 플랫폼: "웹" 선택
2. 웹사이트 URL: `https://your-site-name.replit.app`
3. 스트림 이름: "진안군수 후보 웹사이트"

### 3. 측정 ID 확인
- 설정 완료 후 `G-XXXXXXXXXX` 형태의 측정 ID 발급
- 이 ID를 `GA_MEASUREMENT_ID` 부분에 교체해야 함

## 코드 수정 필요 사항

현재 `client/index.html` 파일의 10번째와 15번째 줄에서:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```
```javascript
gtag('config', 'GA_MEASUREMENT_ID');
```

실제 측정 ID로 교체:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```
```javascript
gtag('config', 'G-XXXXXXXXXX');
```

## 추적 가능한 데이터

현재 설정된 이벤트들:

### AI 챗봇 상호작용
- `chat_opened`: 채팅 창 열기
- `message_sent`: 메시지 전송
- `response_received`: AI 응답 수신

### 정책 관련 활동
- `policy_viewed`: 특정 공약 상세보기 클릭
- `district_viewed`: 면별 정책 탭 선택

### 문서 다운로드
- `document_download`: 공약서, 자료 다운로드

### 문의 폼 활동
- `form_submitted`: 문의 접수 성공
- `form_error`: 문의 접수 실패

## 분석 가능한 지표

Google Analytics에서 확인할 수 있는 데이터:
- 방문자 수 및 페이지뷰
- 사용자 행동 흐름
- 인기 있는 공약 분야
- AI 챗봇 사용률
- 지역별 관심도 (면별 정책 클릭률)
- 문서 다운로드 현황
- 문의 접수 전환율

이 데이터를 통해 캠페인 전략을 데이터 기반으로 최적화할 수 있습니다.