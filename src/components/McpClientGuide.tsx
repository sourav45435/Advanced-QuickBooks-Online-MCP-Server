import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Cpu, 
  Sparkles, 
  Code2, 
  ExternalLink,
  Laptop
} from 'lucide-react';

export const McpClientGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const mcpEndpoint = `${originUrl}/mcp`;
  const sseEndpoint = `${originUrl}/mcp/sse`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        quickbooks_online: {
          url: mcpEndpoint,
          headers: {
            "Content-Type": "application/json"
          }
        }
      }
    },
    null,
    2
  );

  const cursorConfig = JSON.stringify(
    {
      mcpServers: {
        qbo_mcp: {
          url: mcpEndpoint
        }
      }
    },
    null,
    2
  );

  const curlTest = `curl -X POST ${mcpEndpoint} \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "qbo_get_profit_and_loss",
      "arguments": {
        "start_date": "2026-01-01",
        "end_date": "2026-10-13"
      }
    }
  }'`;

  const tsCode = `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function run() {
  const transport = new SSEClientTransport(new URL("${sseEndpoint}"));
  const client = new Client({ name: "qbo-agent", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);

  // Call any of the 120 QBO tools
  const result = await client.callTool({
    name: "qbo_get_balance_sheet",
    arguments: { as_of_date: "2026-10-13" }
  });

  console.log("QBO Balance Sheet:", result);
}
run();`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            MCP Client Connectivity & Integration Guide
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          This server implements the official <strong>Model Context Protocol (JSON-RPC 2.0 & SSE)</strong> specifications. Any MCP-compliant client (Claude Desktop, Cursor, Windsurf, LangChain, or custom autonomous agents) can connect directly to your QuickBooks Online ledgers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Claude Desktop Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Laptop className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">Claude Desktop Configuration</h3>
            </div>
            <button
              onClick={() => copyToClipboard(claudeConfig, 'claude')}
              className="flex items-center space-x-1 text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              {copiedSection === 'claude' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'claude' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Paste this snippet into your <code className="text-slate-300">claude_desktop_config.json</code> file:
          </p>
          <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-teal-300 overflow-x-auto leading-relaxed">
            {claudeConfig}
          </pre>
        </div>

        {/* Cursor Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">Cursor IDE MCP Config</h3>
            </div>
            <button
              onClick={() => copyToClipboard(cursorConfig, 'cursor')}
              className="flex items-center space-x-1 text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              {copiedSection === 'cursor' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'cursor' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Add to your project or user Cursor MCP configuration:
          </p>
          <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-teal-300 overflow-x-auto leading-relaxed">
            {cursorConfig}
          </pre>
        </div>

        {/* Direct cURL Command */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Direct Terminal cURL (JSON-RPC)</h3>
            </div>
            <button
              onClick={() => copyToClipboard(curlTest, 'curl')}
              className="flex items-center space-x-1 text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              {copiedSection === 'curl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'curl' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Execute a test call directly from terminal to verify network connectivity:
          </p>
          <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
            {curlTest}
          </pre>
        </div>

        {/* TypeScript Client */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">TypeScript SDK Integration</h3>
            </div>
            <button
              onClick={() => copyToClipboard(tsCode, 'ts')}
              className="flex items-center space-x-1 text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              {copiedSection === 'ts' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'ts' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Connect using the official <code className="text-slate-300">@modelcontextprotocol/sdk</code>:
          </p>
          <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
            {tsCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
