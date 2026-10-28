import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { analyzeTrafficFrame } from './src/server/trafficAiService.ts';
import { telemetryStore } from './src/server/telemetryStore.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Jamaica Traffic Vision (Open-Source YOLO)' });
});

// Telemetry endpoints for open-source edge bridge
app.get('/api/telemetry/live', (req, res) => {
  res.json(telemetryStore.getTelemetry());
});

app.get('/api/telemetry/incidents', (req, res) => {
  res.json(telemetryStore.getIncidents());
});

app.post('/api/telemetry/push', (req, res) => {
  try {
    telemetryStore.updateFromEdge(req.body);
    res.json({ success: true, activeTracks: req.body.tracks?.length || 0 });
  } catch (err: any) {
    res.status(400).json({ error: 'Invalid payload' });
  }
});

app.post('/api/openrouter/analyze-frame', async (req, res) => {
  try {
    const { image, timestampSec } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Missing image data' });
    }
    const { analyzeFrameWithOpenRouter } = await import('./src/server/openRouterService.ts');
    const result = await analyzeFrameWithOpenRouter(image, timestampSec || 0);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'OpenRouter vision analysis failed' });
  }
});

app.post('/api/analyze-frame', async (req, res) => {
  try {
    const { image, note } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Missing image data' });
    }
    const result = await analyzeTrafficFrame(image, note);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Frame analysis failed' });
  }
});

// Serve frontend build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Open-Source Traffic Vision server running on port ${PORT}`);
});
