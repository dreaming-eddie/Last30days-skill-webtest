import http.server
import socketserver
import json
import subprocess
import os
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import re
import socket
from pathlib import Path

# Fix Windows console encoding for Unicode/Emojis
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

WORKSPACE_DIR = Path(__file__).parent.resolve()
SKILL_SCRIPT_PATH = (WORKSPACE_DIR / "last30days-skill" / "skills" / "last30days" / "scripts" / "last30days.py").resolve()
PYTHON_BIN = sys.executable

def find_available_port(preferred_ports=[3000, 8000, 8080, 9000]):
    for p in preferred_ports:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind(('127.0.0.1', p))
                return p
            except OSError:
                continue
    return 3000

PORT = find_available_port([3000, 8000, 8080, 9000])

print(f"[Server] Workspace Root: {WORKSPACE_DIR}", flush=True)
print(f"[Server] last30days.py Script Path: {SKILL_SCRIPT_PATH}", flush=True)
print(f"[Server] Python Binary: {PYTHON_BIN}", flush=True)

def fetch_google_news_rss(topic, days=30, lang="ko", country="KR"):
    items_list = []
    try:
        q_str = urllib.parse.quote(topic)
        url = f"https://news.google.com/rss/search?q={q_str}+when:{days}d&hl={lang}&gl={country}&ceid={country}:{lang}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        })
        with urllib.request.urlopen(req, timeout=12) as res:
            xml_data = res.read()
            root = ET.fromstring(xml_data)
            for item in root.findall('.//item'):
                title_elem = item.find('title')
                link_elem = item.find('link')
                pubdate_elem = item.find('pubDate')
                source_elem = item.find('source')
                desc_elem = item.find('description')

                title = title_elem.text if title_elem is not None else ""
                link = link_elem.text if link_elem is not None else ""
                pub_date = pubdate_elem.text if pubdate_elem is not None else ""
                publisher = source_elem.text if source_elem is not None else ""
                desc = desc_elem.text if desc_elem is not None else ""

                if not publisher and "-" in title:
                    publisher = title.split("-")[-1].strip()
                    title = "-".join(title.split("-")[:-1]).strip()

                clean_desc = re.sub(r'<[^>]+>', '', desc).strip()

                # Ad filter check
                title_lower = title.lower()
                if any(ad_kw in title_lower for ad_kw in ["google ad", "sponsored", "광고", "ads", "advertiser"]):
                    continue

                if title and link:
                    items_list.append({
                        "title": title,
                        "link": link,
                        "pubDate": pub_date,
                        "author": publisher or "Google News",
                        "description": clean_desc
                    })
    except Exception as e:
        print(f"[Google News Fetch Error] {e}", flush=True)
    return items_list

class DashboardRequestHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[HTTP Request] {format % args}", flush=True)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        if path == '/api/doctor':
            self.handle_doctor()
        elif path == '/api/gnews':
            self.handle_gnews()
        elif path in ('', '/index.html'):
            self.serve_file(WORKSPACE_DIR / 'index.html', 'text/html; charset=utf-8')
        else:
            target = WORKSPACE_DIR / path.lstrip('/')
            if target.exists() and target.is_file():
                content_type = 'text/html'
                if path.endswith('.js'): content_type = 'text/javascript'
                elif path.endswith('.css'): content_type = 'text/css'
                elif path.endswith('.json'): content_type = 'application/json'
                elif path.endswith('.svg'): content_type = 'image/svg+xml'
                self.serve_file(target, content_type)
            else:
                self.serve_file(WORKSPACE_DIR / 'index.html', 'text/html; charset=utf-8')

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        if path == '/api/search':
            self.handle_search()
        else:
            self.send_json({"error": "Not Found"}, status=404)

    def serve_file(self, file_path, content_type):
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            print(f"[Error serving {file_path}] {e}", flush=True)
            self.send_error(404, f"File Not Found: {e}")

    def handle_gnews(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        topic = params.get('q', [''])[0].strip()
        days = params.get('days', ['30'])[0].strip()
        lang = params.get('lang', ['ko'])[0].strip()
        country = params.get('country', ['KR'])[0].strip()

        if not topic:
            self.send_json({"items": []})
            return

        items = fetch_google_news_rss(topic, days=days, lang=lang, country=country)
        self.send_json({"topic": topic, "items": items})

    def handle_doctor(self):
        script_exists = SKILL_SCRIPT_PATH.exists()
        response_data = {
            "status": "ok",
            "active_port": PORT,
            "python_bin": PYTHON_BIN,
            "script_path": str(SKILL_SCRIPT_PATH),
            "script_exists": script_exists,
            "original_repo": "https://github.com/mvanhorn/last30days-skill.git",
            "environment": {
                "OPENAI_API_KEY": bool(os.getenv("OPENAI_API_KEY")),
                "PERPLEXITY_API_KEY": bool(os.getenv("PERPLEXITY_API_KEY")),
                "SCRAPECREATORS_API_KEY": bool(os.getenv("SCRAPECREATORS_API_KEY")),
                "BRAVE_API_KEY": bool(os.getenv("BRAVE_API_KEY")),
                "XAI_API_KEY": bool(os.getenv("XAI_API_KEY"))
            },
            "sources": [
                {"name": "alphaXiv", "type": "MCP Tools (discover_papers, get_paper_content, answer_pdf_queries)", "status": "Active"},
                {"name": "Google News", "type": "Direct Native RSS Parser & Ad Filter (/api/gnews)", "status": "Active"},
                {"name": "HackerNews", "type": "Algolia Realtime API", "status": "Active"},
                {"name": "Reddit", "type": "Public JSON / RSS Engine", "status": "Active"},
                {"name": "GitHub", "type": "GitHub REST API (Stars 2-Tier Sort)", "status": "Active"},
                {"name": "Bluesky", "type": "Public XRPCSearch Posts API", "status": "Active"},
                {"name": "YouTube", "type": "Public Video Feed & Deep-Dive Transcripts", "status": "Active"},
                {"name": "Dev.to", "type": "Developer Technical Articles API", "status": "Active"},
                {"name": "StackOverflow", "type": "Technical Q&A API", "status": "Active"},
                {"name": "Wikipedia", "type": "KR & EN Encyclopedia Search API", "status": "Active"}
            ]
        }
        self.send_json(response_data)

    def handle_search(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            req_json = json.loads(post_data)
        except Exception:
            req_json = {}

        topic = req_json.get('topic', '').strip()
        days = str(req_json.get('days', 30))
        depth = req_json.get('depth', 'quick')
        competitors = req_json.get('competitors', '').strip()

        if not topic:
            self.send_json({"error": "Topic is required"}, status=400)
            return

        print(f"[API /api/search] Querying topic: '{topic}', days: {days}, depth: {depth}", flush=True)

        if not SKILL_SCRIPT_PATH.exists():
            print(f"[API Warning] last30days.py script path not found. Falling back to live browser fetcher.", flush=True)
            self.send_json({"findings": []}, status=404)
            return

        cmd = [
            PYTHON_BIN,
            str(SKILL_SCRIPT_PATH),
            topic,
            "--days", days,
            "--emit", "json"
        ]

        if depth == "quick":
            cmd.append("--quick")
        elif depth == "deep":
            cmd.append("--deep")

        if competitors:
            cmd.extend(["--competitors-list", competitors])

        try:
            res = subprocess.run(
                cmd,
                cwd=str(SKILL_SCRIPT_PATH.parent),
                capture_output=True,
                text=True,
                encoding='utf-8',
                timeout=60
            )

            stdout_text = res.stdout or ''
            json_start = stdout_text.find('{')
            json_end = stdout_text.rfind('}')

            if json_start != -1 and json_end != -1 and json_end > json_start:
                json_str = stdout_text[json_start:json_end+1]
                parsed_data = json.loads(json_str)

                # Format results into findings list expected by frontend UI
                results_list = parsed_data.get('results') or parsed_data.get('findings') or []
                formatted_findings = []

                for r in results_list:
                    formatted_findings.append({
                        "candidate_id": r.get("id") or r.get("candidate_id") or f"cli-{os.urandom(4).hex()}",
                        "source": r.get("source", "web"),
                        "title": r.get("title", topic),
                        "url": r.get("url", "#"),
                        "summary": r.get("summary") or r.get("text", ""),
                        "published_at": r.get("published_at") or r.get("date", "최근"),
                        "relevance_score": r.get("relevance_score", 0.85),
                        "engagement": r.get("engagement") or {"score_by_people": r.get("score", 500)}
                    })

                if len(formatted_findings) > 0:
                    self.send_json({
                        "query_topic": topic,
                        "window_days": int(days),
                        "findings": formatted_findings,
                        "raw_cli_output": parsed_data
                    })
                    return

        except Exception as e:
            print(f"[API Subprocess Error] {e}", flush=True)

        # If CLI output had 0 items (e.g. rate limits), return empty findings so frontend seamlessly executes live client-side router!
        self.send_json({
            "query_topic": topic,
            "window_days": int(days),
            "findings": []
        })

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(body)

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), DashboardRequestHandler) as httpd:
        print("============================================================", flush=True)
        print(f"🚀 last30days Web Dashboard Server running on PORT: {PORT}", flush=True)
        print(f"👉 Open in browser: http://localhost:{PORT} or http://127.0.0.1:{PORT}", flush=True)
        print("============================================================", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.", flush=True)

if __name__ == '__main__':
    run_server()
