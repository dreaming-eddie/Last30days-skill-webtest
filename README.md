# 🌊 last30days 실시간 딥 리서치 웹 대시보드

`last30days-skill`을 기반으로 구축된 **실시간 소셜, 뉴스 & 기술 커뮤니티 딥 리서치 웹 애플리케이션**입니다.  
최근 24시간 실시간 핫 트렌드 탐색부터 최근 30일간의 Google News, Reddit, HackerNews, GitHub, Polymarket 데이터를 시각화된 글래스모피즘 대시보드에서 조사할 수 있습니다.

---

## 🌟 주요 핵심 엔진 및 정렬 규칙 (Engine & Rules)

### 1. 🐙 GitHub 2단계 다중 정렬 규칙 (GitHub 2-Tier Sorting Rule)
- **1순위**: **키워드 적합도 (Keyword Relevance Score)** 높은 순 정렬.
- **2순위**: 적합도가 비슷한 항목 중 **스타 수(Stars Count) 내림차순** 정렬 (`sort=stars&order=desc` API 적용).

### 2. 🌐 한영 분동 지능형 라우터 (Bilingual Multi-Branch Query Router)
- **한영 혼용 키워드 분동 조회**: `"Nvidia 실적"`, `"클로드 3.7"`처럼 한글이 포함된 검색어 입력 시, 한글 키워드와 영문 핵심어(`"Nvidia"`, `"Nvidia earnings"`)를 자동 분리 처리합니다.
- **해외 소셜 플랫폼 연동**: Reddit, HackerNews, GitHub, Polymarket에는 정제된 영문 쿼리를 전송하여 해외 커뮤니티 토론 데이터가 100% 수집됩니다.
- **국내/글로벌 뉴스 연동**: Google News Korea(`hl=ko&gl=KR`) 및 Google News US(`hl=en-US&gl=US`)에 동시 전송하여 국내 속보와 글로벌 기사를 통합 제공합니다.

### 3. 📅 엄격한 조사 기간 차단 엔진 (Strict Lookback Window Cutoff)
- 사용자가 선택한 **Lookback Days (7일, 14일, 30일, 90일)** 기준 타임스탬프(`cutoffMs`)를 엄격하게 계산합니다.
- **수집 단계 타임스탬프 필터**: 지정한 일자보다 단 1초라도 오래된 과거 데이터(20년 전 글 등)는 수집 즉시 **100% 자동 폐기(Discard)**됩니다.

### 4. 🎨 파란색 파장 라이트 글래스모피즘 UI
- **화이트 배경 & 푸른 물결 캔버스**: 배경에 넘실거리는 파란색 파장(Blue Wave Ripple) 애니메이션과 소프트 글로우 적용.
- **스크롤바 페더링(Feathering)**: 핫 트렌드 및 플랫폼 필터 양 끝이 부드럽게 페이드아웃되는 `mask-image` 스크롤 디자인 적용.

---

## 🚀 사용 방법 (How to Run & Deploy)

### 1. 로컬 환경에서 실행 (Local Development)

```bash
# 1. 프로젝트 폴더로 이동
cd "E:\Antigravity Playground\Github\Last30days-skill Website Test"

# 2. Python 백엔드 서버 실행 (포트 자동 감지: 3000, 8000, 8080 등)
python server.py
```

서버 실행 후 웹 브라우저에서 아래 주소로 접속합니다:
👉 **[http://localhost:3000](http://localhost:3000)** (또는 콘솔에 출력된 포트 주소)

---

### 2. GitHub Pages 배포

1. [GitHub.com](https://github.com) 리포지토리: [https://github.com/dreaming-eddie/Last30days-skill-webtest](https://github.com/dreaming-eddie/Last30days-skill-webtest)
2. 코드 변경사항 터미널에서 푸시:
   ```bash
   git push origin main
   ```
3. GitHub Pages가 설정되어 있어 **[https://dreaming-eddie.github.io/Last30days-skill-webtest/](https://dreaming-eddie.github.io/Last30days-skill-webtest/)**에서 100% 실시간 동작합니다.

---

## 📁 주요 프로젝트 구조 (Directory Structure)

```text
E:\Antigravity Playground\Github\Last30days-skill Website Test\
├── index.html                # React 단일 페이지 & GitHub Stars 2단계 정렬 & 한영 라우팅 엔진
├── server.py                 # Python HTTP 백엔드 (포트 자동 탐지 & CLI 브릿지)
├── netlify.toml              # Netlify 서버리스 라우팅 설정 파일
├── netlify/
│   └── functions/
│       └── search.js         # Netlify 서버리스 실시간 수집 함수
├── src/
│   ├── index.css             # 파란색 파장 라이트 글래스모피즘 CSS 스타일시트
│   └── components/           # UI 세부 컴포넌트
├── README.md                 # 프로젝트 문서 및 엔진 설명서
└── package.json              # 프로젝트 설정 파일
```
