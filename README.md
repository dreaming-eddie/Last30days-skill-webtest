# 🌊 last30days 실시간 딥 리서치 웹 대시보드

`last30days-skill`을 기반으로 구축된 **실시간 소셜, 뉴스, 기술 커뮤니티 & 학술 논문 딥 리서치 웹 애플리케이션**입니다.  
최근 24시간 실시간 핫 트렌드 탐색부터 최근 30일간의 Google News, Reddit, HackerNews, GitHub, Polymarket, **alphaXiv 학술 논문 MCP 3대 툴 (discover_papers, get_paper_content, answer_pdf_queries)** 데이터를 시각화된 대시보드에서 통합 조사할 수 있습니다.

---

## 🌟 주요 신규 기능 (New Features)

### 1. 📰 구글 뉴스 동일 이슈 복수 매체 종합 보도 클러스터링 (Google News Story Clustering)
- **동일 이슈 뉴스 그룹화**: 동일한 사건이나 기사를 여러 언론사(조선일보, 연합뉴스, 매일경제 등)에서 보도한 경우, 개별 기사로 나열하지 않고 **"📰 조선일보 외 3개 매체에서 함께 보도 (총 4개 출처)"** 형태의 단일 대표 카드로 자동 종합합니다.
- **아코디언 확장 목록**: 카드 내 **`▼ 복수 매체 기사 보기`** 버튼을 누르면 관련된 모든 언론사의 기사 제목과 직접 링크를 한눈에 펼쳐볼 수 있습니다.

### 2. 💡 Human Score (사람의 관심도 점수) 산출 기준 & 안내
- **개념**: 검색엔진 광고나 알고리즘 추천 순위가 아닌, **실제 대중(Human)이 매긴 관심도 및 참여도 정량 지표**입니다.
- **플랫폼별 산출공식**:
  - **Reddit**: `Upvote 점수 + (댓글 수 × 2)`
  - **HackerNews**: `Upvote Points × 2 + (댓글 수 × 3)`
  - **GitHub**: `Stars + (Forks × 3)`
- **UI 안내**: 상단 헤더의 **`ℹ️ Human Score 안내`** 버튼 및 각 카드 뱃지를 클릭하면 산출 기준 안내 모달 창이 표시됩니다.

### 3. 📄 alphaXiv 공식 MCP 3대 툴 연동 (`discover_papers`, `get_paper_content`, `answer_pdf_queries`)
- **`discover_papers`**: 검색 키워드 및 조사 기간(`published_after`) 연동 논문 자동 발굴.
- **`get_paper_content`**: 각 논문 카드의 **`[get_paper_content]`** 버튼으로 AI 요약 리포트 열람.
- **`answer_pdf_queries`**: 각 논문 카드의 **`[answer_pdf_queries]`** 버튼으로 PDF 페이지 레벨 질의응답 (Q&A) 수행.

### 4. 📥 마크다운 (.md) 리서치 보고서 내보내기
- 수집된 모든 결과 데이터를 깔끔한 **GitHub Flavored Markdown 문서**로 클립보드 복사 및 `.md` 파일 다운로드 지원.

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
├── index.html                # React 단일 페이지 & 구글뉴스 클러스터링 & Human Score 안내 & alphaXiv MCP
├── mcp_config.json           # https://api.alphaxiv.org/mcp/v1 서버 등록 파일
├── server.py                 # Python HTTP 백엔드
├── README.md                 # 프로젝트 문서 및 기능 설명서
└── package.json              # 프로젝트 설정 파일
```
