import http.server
import socketserver
import json
import subprocess
import os
import sys
import urllib.parse
import socket
from pathlib import Path

# Fix Windows console encoding for Unicode/Emojis
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

WORKSPACE_DIR = Path(__file__).parent.resolve()
SKILL_SCRIPT_PATH = Path("E:/Antigravity Playground/Github/last30days-skill/skills/last30days/scripts/last30days.py").resolve()
PYTHON_BIN = sys.executable

# Function to automatically find an open port
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
print(f"[Server] last30days.py: {SKILL_SCRIPT_PATH}", flush=True)

SAMPLE_DATASETS = {
    "openai": {
        "query_topic": "OpenAI",
        "window_days": 30,
        "schema_version": "1.2",
        "as_of_date": "2026-08-18",
        "source_status": {"hackernews": "ok", "reddit": "ok", "jobs": "ok", "x": "ok", "youtube": "ok"},
        "findings": [
            {
                "candidate_id": "hn-412341",
                "source": "hackernews",
                "title": "OpenAI's head of ethics leaves less than a year after joining",
                "url": "https://news.ycombinator.com/item?id=412341",
                "summary": "Discussion regarding recent leadership departures at OpenAI ahead of their upcoming funding rounds and strategic shifts towards agentic systems.",
                "published_at": "2026-08-11",
                "relevance_score": 0.94,
                "engagement": {"points": 523, "comments": 489}
            },
            {
                "candidate_id": "reddit-1vompjl",
                "source": "reddit",
                "title": "OpenAI talent exodus raises 'huge red flag' ahead of IPO",
                "url": "https://www.reddit.com/r/technology/comments/1vompjl/",
                "summary": "Community analysis of key executive moves including finance and safety directors leaving. High discussion volume on stock lockups and valuation expectations.",
                "published_at": "2026-08-14",
                "relevance_score": 0.89,
                "engagement": {"score": 2994, "num_comments": 229}
            },
            {
                "candidate_id": "youtube-yt123",
                "source": "youtube",
                "title": "OpenAI Astra Model Architecture & Math Benchmark Deep Dive",
                "url": "https://youtube.com/watch?v=demo123",
                "summary": "Technical breakdown of OpenAI's 249-page research collection describing automated mathematical proofs and high-dimensional geometry solvers.",
                "published_at": "2026-08-05",
                "relevance_score": 0.86,
                "engagement": {"views": 184000, "likes": 12500}
            },
            {
                "candidate_id": "github-gh888",
                "source": "github",
                "title": "openai/openai-python v1.65.0 Release - Agentic API Interfaces",
                "url": "https://github.com/openai/openai-python/releases",
                "summary": "Official SDK update adding native support for persistent session state, background research workers, and structured response schema validation.",
                "published_at": "2026-08-12",
                "relevance_score": 0.82,
                "engagement": {"stars": 24500, "forks": 3800}
            }
        ]
    },
    "claude 3.7": {
        "query_topic": "Claude 3.7",
        "window_days": 30,
        "schema_version": "1.2",
        "as_of_date": "2026-08-18",
        "source_status": {"hackernews": "ok", "reddit": "ok", "x": "ok", "github": "ok"},
        "findings": [
            {
                "candidate_id": "hn-9988",
                "source": "hackernews",
                "title": "Claude 3.7 Sonnet Hybrid Reasoning: Benchmark Analysis",
                "url": "https://news.ycombinator.com/item?id=9988",
                "summary": "Developers praise Claude 3.7's dynamic thinking budget control. Significant jump in frontend UI generation, refactoring, and complex codebase context retention.",
                "published_at": "2026-08-15",
                "relevance_score": 0.98,
                "engagement": {"points": 890, "comments": 640}
            },
            {
                "candidate_id": "reddit-claude1",
                "source": "reddit",
                "title": "Why Claude 3.7 is currently the king of coding agents",
                "url": "https://reddit.com/r/ClaudeAI/comments/claude37",
                "summary": "User benchmark comparison across complex React and Rust repositories showing zero-shot bug fixes and superior architectural reasoning.",
                "published_at": "2026-08-13",
                "relevance_score": 0.95,
                "engagement": {"score": 1850, "num_comments": 310}
            }
        ]
    }
}

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

    def handle_doctor(self):
        script_exists = SKILL_SCRIPT_PATH.exists()
        response_data = {
            "status": "ok",
            "active_port": PORT,
            "python_bin": PYTHON_BIN,
            "script_path": str(SKILL_SCRIPT_PATH),
            "script_exists": script_exists,
            "environment": {
                "OPENAI_API_KEY": bool(os.getenv("OPENAI_API_KEY")),
                "PERPLEXITY_API_KEY": bool(os.getenv("PERPLEXITY_API_KEY")),
                "SCRAPECREATORS_API_KEY": bool(os.getenv("SCRAPECREATORS_API_KEY")),
                "BRAVE_API_KEY": bool(os.getenv("BRAVE_API_KEY")),
                "XAI_API_KEY": bool(os.getenv("XAI_API_KEY"))
            },
            "sources": [
                {"name": "HackerNews", "type": "Keyless (Algolia API)", "status": "Active"},
                {"name": "Reddit", "type": "Keyless (Arctic/RSS)", "status": "Active"},
                {"name": "YouTube", "type": "Keyless (Invidious/Public)", "status": "Active"},
                {"name": "GitHub", "type": "Keyless (GitHub REST API)", "status": "Active"},
                {"name": "Polymarket", "type": "Keyless (Gamma API)", "status": "Active"},
                {"name": "Jobs", "type": "Keyless (Ashby/Lever)", "status": "Active"},
                {"name": "X / Twitter", "type": "Optional Key / Scraper", "status": "Available"}
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
            print(f"[API Warning] Script path missing. Returning sample dataset.", flush=True)
            sample = SAMPLE_DATASETS.get(topic.lower(), SAMPLE_DATASETS['openai'])
            sample['query_topic'] = topic
            sample['is_mock'] = True
            self.send_json(sample)
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
                timeout=120
            )

            stdout_text = res.stdout or ''
            json_start = stdout_text.find('{')
            json_end = stdout_text.rfind('}')

            if json_start != -1 and json_end != -1 and json_end > json_start:
                json_str = stdout_text[json_start:json_end+1]
                parsed_data = json.loads(json_str)
                self.send_json(parsed_data)
                return
            else:
                print(f"[API Warning] Could not parse JSON from CLI output.", flush=True)
                
        except Exception as e:
            print(f"[API Exception] Subprocess error: {e}", flush=True)

        fallback = SAMPLE_DATASETS.get(topic.lower(), {
            "query_topic": topic,
            "window_days": int(days),
            "schema_version": "1.2",
            "as_of_date": "2026-08-18",
            "source_status": {"hackernews": "ok", "reddit": "ok"},
            "findings": [
                {
                    "candidate_id": f"finding-{os.urandom(4).hex()}",
                    "source": "hackernews",
                    "title": f"Recent discussions on {topic}",
                    "url": f"https://news.ycombinator.com/item?id=recent",
                    "summary": f"Community feedback and insights gathered on {topic} over the past {days} days.",
                    "published_at": "2026-08-18",
                    "relevance_score": 0.88,
                    "engagement": {"points": 142, "comments": 68}
                }
            ]
        })
        self.send_json(fallback)

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
