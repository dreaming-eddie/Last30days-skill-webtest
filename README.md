# 🌊 last30days 실시간 딥 리서치 웹 대시보드

`last30days-skill`을 기반으로 구축된 **실시간 소셜, 뉴스, 기술 커뮤니티 & 학술 논문 딥 리서치 웹 애플리케이션**입니다.  
최근 24시간 실시간 핫 트렌드 탐색부터 최근 30일간의 Google News, Reddit, HackerNews, GitHub, Polymarket, **alphaXiv 학술 논문 MCP 3대 툴 (discover_papers, get_paper_content, answer_pdf_queries)** 데이터를 시각화된 대시보드에서 통합 조사할 수 있습니다.

---

## 🌟 alphaXiv 공식 MCP 3대 툴 연동 (Official MCP Research Tools)

사이트에서 공식 제공하는 3가지 alphaXiv MCP 연구 툴이 웹 앱 조회 결과에 직접 통합되어 작동합니다:

### 1. 🔍 `discover_papers`
- **역할**: 입력한 검색 주제에 맞는 후보 논문들을 자동 발굴 및 순위화.
- **파라미터 연동**:
  - `keywords`: 3~4개의 정제된 핵심 키워드 배열.
  - `question`: 논문의 시맨틱 상세 설명.
  - `difficulty`: 1~10 탐색 난이도 (Quick = Level 3, Deep = Level 7).
  - `published_after`: 선택한 조사 기간(Lookback Days) 날짜 경계선(`YYYY-MM-DD`).

### 2. 📄 `get_paper_content`
- **역할**: 수집된 alphaXiv/arXiv 논문의 AI 생성 본문 리포트 및 초록 추출.
- **UI 기능**: 각 논문 카드마다 **`[get_paper_content] 본문 수집 & 요약 리포트`** 버튼이 제공되어, 모달 창에서 논문 주요 내용을 즉시 열람할 수 있습니다.

### 3. ❓ `answer_pdf_queries`
- **역할**: 특정 논문(PDF)에 대해 궁금한 질문(Benchmark, 한계점, 방법론 등)에 대해 페이지 레벨 질의응답을 수행.
- **UI 기능**: 각 논문 카드의 **`[answer_pdf_queries] PDF 질의응답 (Q&A)`** 버튼을 눌러 모달 창에서 질문을 입력하고 AI 기반 응답을 받을 수 있습니다.

---

## 🌟 주요 핵심 정렬 및 라우터 엔진 (Engine & Rules)

### 1. 🐙 GitHub 2단계 다중 정렬 규칙 (GitHub 2-Tier Sorting Rule)
- **1순위**: **키워드 적합도 (Keyword Relevance Score)** 높은 순 정렬.
- **2순위**: 적합도가 비슷한 항목 중 **스타 수(Stars Count) 내림차순** 정렬 (`sort=stars&order=desc` API 적용).

### 2. 🌐 한영 분동 지능형 라우터 (Bilingual Multi-Branch Query Router)
- **한영 혼용 키워드 분동 조회**: `"Nvidia 실적"`, `"클로드 3.7"`처럼 한글이 포함된 검색어 입력 시, 한글 키워드와 영문 핵심어(`"Nvidia"`, `"Nvidia earnings"`)를 자동 분리 처리합니다.

### 3. 📅 엄격한 조사 기간 차단 엔진 (Strict Lookback Window Cutoff)
- 사용자가 선택한 **Lookback Days (7일, 14일, 30일, 90일)** 기준 타임스탬프(`cutoffMs`)보다 오래된 과거 데이터는 수집 즉시 **100% 자동 폐기(Discard)**됩니다.

---

## 🚀 사용 방법 (How to Run & Deploy)

### 1. 로컬 환경에서 실행 (Local Development)

```bash
# 1. 프로젝트 폴더로 이동
cd "E:\Antigravity Playground\Github\Last30days-skill Website Test"

# 2. Python 백엔드 서버 실행
python server.py
```

웹 브라우저 접속:
👉 **[http://localhost:3000](http://localhost:3000)**

---

### 2. GitHub Pages 배포

```bash
git push origin main
```
배포 사이트: **[https://dreaming-eddie.github.io/Last30days-skill-webtest/](https://dreaming-eddie.github.io/Last30days-skill-webtest/)**

---

## 📁 주요 프로젝트 구조 (Directory Structure)

```text
E:\Antigravity Playground\Github\Last30days-skill Website Test\
├── index.html                # React 단일 페이지 & alphaXiv MCP 3대 툴 (discover, content, pdf_qa) 연동
├── mcp_config.json           # https://api.alphaxiv.org/mcp/v1 서버 등록 파일
├── server.py                 # Python HTTP 백엔드
├── README.md                 # 프로젝트 문서 및 MCP 툴 설명서
└── package.json              # 프로젝트 설정 파일
```
