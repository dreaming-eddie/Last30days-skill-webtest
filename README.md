# 🌊 last30days 실시간 딥 리서치 웹 대시보드

`last30days-skill`을 기반으로 구축된 **실시간 소셜, 뉴스, 기술 커뮤니티 & 학술 논문 딥 리서치 웹 애플리케이션**입니다.  
최근 24시간 실시간 핫 트렌드 탐색부터 최근 30일간의 Google News, Reddit, HackerNews, GitHub, Polymarket, **alphaXiv 학술 논문 MCP** 데이터를 시각화된 글래스모피즘 대시보드에서 조사할 수 있습니다.

---

## 🌟 주요 핵심 엔진 및 MCP (Engine & MCP)

### 1. 📄 alphaXiv / arXiv 학술 논문 MCP 연동 (`https://api.alphaxiv.org/mcp/v1`)
- **AlphaXiv MCP Server 추가**: `https://api.alphaxiv.org/mcp/v1` 엔드포인트를 등록하여 최신 AI 논문, 수식 논문 및 alphaXiv 커뮤니티 논문 토론 링크(`https://alphaxiv.org/abs/...`)를 실시간 수집합니다.
- **저자(Authors) & 요약(Abstract) 제공**: 논문 저자진, 발표 날짜, 연구 요약을 한눈에 볼 수 있는 `alphaxiv` 배지와 링크를 표출합니다.

### 2. 🐙 GitHub 2단계 다중 정렬 규칙 (GitHub 2-Tier Sorting Rule)
- **1순위**: **키워드 적합도 (Keyword Relevance Score)** 높은 순 정렬.
- **2순위**: 적합도가 비슷한 항목 중 **스타 수(Stars Count) 내림차순** 정렬 (`sort=stars&order=desc` API 적용).

### 3. 🌐 한영 분동 지능형 라우터 (Bilingual Multi-Branch Query Router)
- **한영 혼용 키워드 분동 조회**: `"Nvidia 실적"`, `"클로드 3.7"`처럼 한글이 포함된 검색어 입력 시, 한글 키워드와 영문 핵심어(`"Nvidia"`, `"Nvidia earnings"`)를 자동 분리 처리합니다.
- **해외 소셜 플랫폼 연동**: Reddit, HackerNews, GitHub, Polymarket에는 정제된 영문 쿼리를 전송하여 해외 커뮤니티 토론 데이터가 100% 수집됩니다.

### 4. 📅 엄격한 조사 기간 차단 엔진 (Strict Lookback Window Cutoff)
- 사용자가 선택한 **Lookback Days (7일, 14일, 30일, 90일)** 기준 타임스탬프(`cutoffMs`)를 엄격하게 계산합니다.
- **수집 단계 타임스탬프 필터**: 지정한 일자보다 오래된 과거 데이터는 수집 즉시 **100% 자동 폐기(Discard)**됩니다.

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
├── index.html                # React 단일 페이지 & alphaXiv MCP 학술 논문 연동 엔진
├── mcp_config.json           # https://api.alphaxiv.org/mcp/v1 서버 등록 파일
├── server.py                 # Python HTTP 백엔드 (포트 자동 탐지 & CLI 브릿지)
├── netlify.toml              # Netlify 서버리스 라우팅 설정 파일
├── netlify/
│   └── functions/
│       └── search.js         # Netlify 서버리스 실시간 수집 함수
├── README.md                 # 프로젝트 문서 및 엔진 설명서
└── package.json              # 프로젝트 설정 파일
```
