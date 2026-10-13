import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { McpProtocolHandler } from './src/server/mcp-protocol.js';
import { ALL_MCP_TOOLS, TOOL_CATEGORIES } from './src/server/tools-catalog.js';
import { companyManager } from './src/server/company-manager.js';
import { auditLogger } from './src/server/audit-logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// CORS headers for MCP and API clients
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-QBO-Company-ID, X-MCP-Session-ID');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ==========================================
// 1. OFFICIAL MCP REMOTE ENDPOINTS
// ==========================================

// JSON-RPC 2.0 MCP POST endpoint
app.post('/mcp', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '127.0.0.1';
  const response = McpProtocolHandler.handleJsonRpc(req.body, clientIp);
  res.json(response);
});

// SSE endpoint for streaming MCP clients
app.get('/mcp/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sessionId = `mcp-session-${Date.now()}`;
  res.write(`event: endpoint\ndata: /mcp?session_id=${sessionId}\n\n`);

  // Heartbeat keep-alive every 15s
  const interval = setInterval(() => {
    res.write(`event: ping\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
  }, 15000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Server health and metadata
app.get('/mcp/health', (req, res) => {
  const companies = companyManager.getCompanies();
  res.json({
    status: 'healthy',
    server: 'quickbooks-online-mcp-server',
    version: '2.4.0',
    protocol_version: '2024-11-05',
    uptime_seconds: process.uptime(),
    total_tools_count: ALL_MCP_TOOLS.length,
    connected_companies_count: companies.length,
    safe_mode_enabled: companyManager.isSafeMode(),
    active_company: companyManager.getActiveCompany()
  });
});

// ==========================================
// 2. MANAGEMENT REST APIS FOR DASHBOARD
// ==========================================

app.get('/api/tools', (req, res) => {
  res.json({
    count: ALL_MCP_TOOLS.length,
    categories: TOOL_CATEGORIES,
    tools: ALL_MCP_TOOLS
  });
});

app.get('/api/companies', (req, res) => {
  res.json({
    companies: companyManager.getCompanies(),
    activeCompanyId: companyManager.getActiveCompany().id,
    safeMode: companyManager.isSafeMode()
  });
});

app.post('/api/companies', (req, res) => {
  const newComp = companyManager.addCompany(req.body);
  res.status(201).json(newComp);
});

app.patch('/api/companies/:id', (req, res) => {
  const updated = companyManager.updateCompany(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Company not found' });
  res.json(updated);
});

app.delete('/api/companies/:id', (req, res) => {
  const success = companyManager.deleteCompany(req.params.id);
  if (!success) return res.status(400).json({ error: 'Cannot delete last remaining company' });
  res.json({ success: true });
});

app.post('/api/companies/active', (req, res) => {
  const { id } = req.body;
  const ok = companyManager.setActiveCompany(id);
  if (!ok) return res.status(404).json({ error: 'Company ID not found' });
  res.json({ success: true, activeCompany: companyManager.getActiveCompany() });
});

app.post('/api/safe-mode', (req, res) => {
  const { enabled } = req.body;
  companyManager.setSafeMode(Boolean(enabled));
  res.json({ safeMode: companyManager.isSafeMode() });
});

app.get('/api/audit-logs', (req, res) => {
  const filterCompany = req.query.company_id as string | undefined;
  const logs = auditLogger.getLogs(100, filterCompany);
  res.json({ logs });
});

app.post('/api/oauth/refresh-token', (req, res) => {
  const { company_id } = req.body;
  const comp = companyManager.getCompany(company_id);
  if (!comp) return res.status(404).json({ error: 'Company not found' });

  // Simulate Intuit OAuth token renewal
  const updated = companyManager.updateCompany(comp.id, {
    tokenExpiresAt: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
    status: 'connected'
  });
  res.json({ success: true, company: updated, message: 'OAuth 2.0 access and refresh token rotated successfully.' });
});

// ==========================================
// 3. FRONTEND SERVING
// ==========================================
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const httpServer = createServer(app);
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[QBO MCP Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[QBO MCP Server] JSON-RPC Endpoint: http://0.0.0.0:${PORT}/mcp`);
    console.log(`[QBO MCP Server] SSE Stream: http://0.0.0.0:${PORT}/mcp/sse`);
    console.log(`[QBO MCP Server] Tool Catalog: ${ALL_MCP_TOOLS.length} tools registered`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
