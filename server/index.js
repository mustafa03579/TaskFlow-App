import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── AWS Load Balancer Health Check ───────────────────────
// Must return 200 quickly — no DB call needed here.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task Flow API is running.' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

app.post('/api/tasks', (req, res) => { res.json({ message: 'Tasks endpoint' }); });
app.get('/api/tasks',  (req, res) => { res.json({ message: 'Tasks endpoint' }); });

// ── Production: Serve React client build ─────────────────
// In production, Express serves the Vite-built static files.
// Any non-API route gets index.html so React Router works correctly.
if (isProd) {
  const clientDist = path.resolve(__dirname, '../client/dist');

  app.use(express.static(clientDist));

  // React Router fallback — must come AFTER all API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[TaskFlow] Server running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  if (isProd) {
    console.log('[TaskFlow] Serving React client from ../client/dist');
  }
});
