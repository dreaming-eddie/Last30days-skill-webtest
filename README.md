# 🌊 last30days 실시간 딥 리서치 웹 대시보드

`last30days-skill`을 기반으로 구축된 **실시간 소셜, 뉴스 & 기술 커뮤니티 딥 리서치 웹 애플리케이션**입니다.  
최근 24시간 실시간 핫 트렌드 탐색부터 최근 30일간의 Google News, Reddit, HackerNews, GitHub, Polymarket 데이터를 시각화된 글래스모피즘 대시보드에서 조사할 수 있습니다.

---

## 🌟 주요 기능 (Key Features)

### 1. 🎨 파란색 파장 글래스모피즘 디자인 (Blue Wave Glass UI)
- **화이트 배경 & 푸른 물결 캔버스**: 배경에 넘실거리는 파란색 파장(Blue Wave Ripple) 애니메이션과 소프트 글로우 적용.
- **라이트 글래스모피즘**: 반투명 글래스 패널(`rgba(255, 255, 255, 0.85)` + `backdrop-filter: blur(20px)`), 부드러운 블루 글래스 테두리와 그림자 효과.

### 2. ⚡ 24시간 실시간 핫 트렌드 (Real-time 24H Hot Trends)
- 웹페이지 접속 시 **최근 24시간 동안 실시간으로 가장 핫한 주제**를 파이프라인으로 자동 추출하여 칩(Chip)으로 제공합니다.
- `🔄 트렌드 새로고침` 버튼 클릭 시 실시간 핫 이슈가 즉시 갱신됩니다.

### 3. 🌐 다중 실시간 데이터 수집 파이프라인 (Multi-Source Pipeline)
- 📰 **Google News RSS**: 최신 속보 기사, 게시 일시, 출판사(TechCrunch, Reuters, Bloomberg 등) 실시간 수집.
- 🌐 **Web Search API**: DuckDuckGo / 웹 검색 엔진 검색 결과.
- 🔴 **Reddit**: 서브레딧 게시글, 추천 수, 댓글 수.
- 🟠 **HackerNews**: 개발자 커뮤니티 토론, 포인트, 댓글 수.
- 🐙 **GitHub**: 실시간 스타(Star) 수, 포크(Fork) 수, 오픈소스 기술 트렌드.
- 🎲 **Polymarket**: 예측 시장 이벤트 확률 및 거래 볼륨.

### 4. 🚀 100% 클라우드 & 정적 배포 지원 (Netlify & GitHub Pages Ready)
- **로컬 백엔드 모드**: Python `server.py`를 통해 local `last30days.py` CLI 직접 실행.
- **클라우드/배포 모드**: Netlify 또는 GitHub Pages 배포 시, 브라우저가 직접 실시간 공개 API(HackerNews, Reddit, GitHub, Google News)를 다이렉트 수집하므로 **별도 서버 없이 100% 무료 배포 가능**.

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

### 2. GitHub Pages 배포 (1분 완료)

이미 `git init` 및 로컬 커밋 작성이 완료되어 있습니다.

1. [GitHub.com](https://github.com)에서 새로운 리포지토리 생성 (예: `last30days-web-dashboard`)
2. 터미널에서 코드 푸시:
   ```bash
   git remote add origin https://github.com/본인계정명/last30days-web-dashboard.git
   git branch -M main
   git push -u origin main
   ```
3. GitHub 리포지토리 페이지 → **Settings** → **Pages** 클릭
4. Source를 **`Deploy from a branch`**, Branch를 **`main` / `/(root)`** 선택 후 **Save** 클릭!  
👉 약 1분 후 생성되는 `https://본인계정명.github.io/last30days-web-dashboard/` URL에서 바로 사용 가능합니다.

---

### 3. Netlify 배포 (Netlify Serverless)

1. Netlify에 로그인 후 **Add new site** → **Import an existing project** 선택
2. GitHub 리포지토리 연결 후 **Deploy** 클릭
3. [`netlify.toml`](file:///E:/Antigravity%20Playground/Github/Last30days-skill%20Website%20Test/netlify.toml)과 [`netlify/functions/search.js`](file:///E:/Antigravity%20Playground/Github/Last30days-skill%20Website%20Test/netlify/functions/search.js)에 의해 서버리스 라우팅이 자동 설정되어 100% 동작합니다.

---

## 📁 주요 프로젝트 구조 (Directory Structure)

```text
E:\Antigravity Playground\Github\Last30days-skill Website Test\
├── index.html                # 단일 페이지 React 앱 & 파란색 파장 UI & 실시간 수집 엔진
├── server.py                 # Python HTTP 백엔드 (포트 자동 탐지 & CLI 브릿지)
├── netlify.toml              # Netlify 서버리스 라우팅 설정 파일
├── netlify/
│   └── functions/
│       └── search.js         # Netlify 서버리스 실시간 수집 함수
├── src/
│   ├── index.css             # 파란색 파장 라이트 글래스모피즘 CSS 스타일시트
│   ├── App.jsx               # 대시보드 컴포넌트
│   └── components/           # UI 세부 컴포넌트 (검색, 피드, 요약, 내보내기, 진단)
├── README.md                 # 프로젝트 문서 및 사용 가이드
└── package.json              # 프로젝트 설정 파일
```

---

## 🛠️ 주요 기능 사용 팁

- **검색 실행**: 상단 검색창에 키워드(예: `Claude 3.7`, `Nvidia`, `React 19`) 입력 후 **`🌊 딥 리서치 실행`** 클릭.
- **기간 및 정밀도 조절**: 7일~90일 Lookback Window 조절, ⚡ Quick(빠름) / 🔍 Deep(정밀) 탐색 모드 선택.
- **리포트 내보내기**: 상단 **`📥 리포트 / JSON 내보내기`** 버튼을 눌러 Markdown 보고서 작성 또는 JSON 데이터 다운로드.
- **시스템 진단**: **`🩺 시스템 진단 Doctor`** 버튼 클릭 시 수집 소스 연결 상태 확인.
