import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const SKILL_SCRIPT_PATH = path.resolve('E:/Antigravity Playground/Github/last30days-skill/skills/last30days/scripts/last30days.py');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python';

// Serve static HTML/JS files directly from workspace
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/doctor', (req, res) => {
  const scriptExists = fs.existsSync(SKILL_SCRIPT_PATH);
  res.json({
    status: 'ok',
    server_type: 'Node.js Express',
    port: PORT,
    script_path: SKILL_SCRIPT_PATH,
    script_exists: scriptExists,
    environment: {
      OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
      PERPLEXITY_API_KEY: Boolean(process.env.PERPLEXITY_API_KEY),
      SCRAPECREATORS_API_KEY: Boolean(process.env.SCRAPECREATORS_API_KEY)
    }
  });
});

app.post('/api/search', (req, res) => {
  const { topic, days = 30, depth = 'quick', competitors = '' } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const args = [SKILL_SCRIPT_PATH, topic, '--days', String(days), '--emit', 'json'];
  if (depth === 'quick') args.push('--quick');
  if (depth === 'deep') args.push('--deep');
  if (competitors) args.push('--competitors-list', competitors);

  const pyProcess = spawn(PYTHON_BIN, args, {
    cwd: path.dirname(SKILL_SCRIPT_PATH),
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
  });

  let stdoutData = '';
  pyProcess.stdout.on('data', data => stdoutData += data.toString());
  pyProcess.on('close', code => {
    try {
      const start = stdoutData.indexOf('{');
      const end = stdoutData.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        return res.json(JSON.parse(stdoutData.substring(start, end + 1)));
      }
    } catch (e) {}
    res.json({ query_topic: topic, window_days: days, findings: [] });
  });
});

app.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(`🚀 Node Express Server running on PORT: ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`============================================================`);
});
