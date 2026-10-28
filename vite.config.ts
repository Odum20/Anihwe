import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import { telemetryStore } from './src/server/telemetryStore.ts';

dotenv.config();

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'traffic-ai-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Health check
            if (req.url === '/api/health' && req.method === 'GET') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'ok', service: 'Jamaica Traffic Vision (Open-Source YOLO)' }));
              return;
            }

            // Get live telemetry
            if (req.url === '/api/telemetry/live' && req.method === 'GET') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(telemetryStore.getTelemetry()));
              return;
            }

            // Get incidents
            if (req.url === '/api/telemetry/incidents' && req.method === 'GET') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(telemetryStore.getIncidents()));
              return;
            }

            // Ingest edge telemetry from Python YOLO/BoT-SORT runner
            if (req.url === '/api/telemetry/push' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body);
                  telemetryStore.updateFromEdge(data);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, activeTracks: data.tracks?.length || 0 }));
                } catch (err: any) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
                }
              });
              return;
            }

            // OpenRouter Vision Analysis Endpoint
            if (req.url === '/api/openrouter/analyze-frame' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const { image, timestampSec } = JSON.parse(body);
                  if (!image) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Missing image data' }));
                    return;
                  }

                  const { analyzeFrameWithOpenRouter } = await import('./src/server/openRouterService.ts');
                  const result = await analyzeFrameWithOpenRouter(image, timestampSec || 0);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err?.message || 'OpenRouter vision analysis failed' }));
                }
              });
              return;
            }

            // Frame Analysis endpoint
            if (req.url === '/api/analyze-frame' && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const { image, note } = JSON.parse(body);
                  if (!image) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Missing image data' }));
                    return;
                  }

                  const { analyzeTrafficFrame } = await import('./src/server/trafficAiService.ts');
                  const result = await analyzeTrafficFrame(image, note);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err?.message || 'Frame analysis failed' }));
                }
              });
              return;
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
