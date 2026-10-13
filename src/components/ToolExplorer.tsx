import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Play, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  Layers, 
  Sparkles, 
  ChevronRight,
  Code2,
  RefreshCw
} from 'lucide-react';
import { McpToolDefinition, ToolCategory } from '../types/mcp';

interface ToolExplorerProps {
  tools: McpToolDefinition[];
  categories: ToolCategory[];
  activeCompanyId: string;
  safeMode: boolean;
  onExecutionLogged?: () => void;
}

export const ToolExplorer: React.FC<ToolExplorerProps> = ({
  tools,
  categories,
  activeCompanyId,
  safeMode,
  onExecutionLogged
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<McpToolDefinition>(tools[0] || null);
  const [inputJson, setInputJson] = useState<string>('{}');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionLatency, setExecutionLatency] = useState<number | null>(null);
  const [rawRpcTrace, setRawRpcTrace] = useState<any>(null);

  // Filter tools
  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [tools, selectedCategory, searchQuery]);

  // Load smart sample arguments when tool changes
  const handleSelectTool = (tool: McpToolDefinition) => {
    setSelectedTool(tool);
    setExecutionResult(null);
    setExecutionError(null);
    setExecutionLatency(null);
    setRawRpcTrace(null);

    // Generate intelligent default input
    const sample: Record<string, any> = {};
    if (tool.inputSchema?.properties) {
      Object.entries(tool.inputSchema.properties).forEach(([key, prop]: [string, any]) => {
        if (key === 'company_id') {
          // Leave blank to default to active company or set explicitly
          return;
        }
        if (prop.type === 'string') {
          if (key.includes('date')) sample[key] = '2026-10-13';
          else if (key.includes('id')) sample[key] = '1001';
          else if (key.includes('reason')) sample[key] = 'Audit correction or duplicate entry';
          else if (prop.enum && prop.enum.length > 0) sample[key] = prop.enum[0];
          else sample[key] = 'Sample Value';
        } else if (prop.type === 'number') {
          if (key.includes('amount') || key.includes('balance')) sample[key] = 1250.0;
          else sample[key] = 30;
        } else if (prop.type === 'boolean') {
          sample[key] = true;
        } else if (prop.type === 'array') {
          sample[key] = [];
        }
      });
    }

    if (tool.name === 'qbo_create_invoice') {
      sample['customer_id'] = 'cust-1';
      sample['line_items'] = [{ item_id: 'item-1', description: 'Enterprise Advisory', quantity: 1, unit_price: 4500, amount: 4500 }];
    } else if (tool.name === 'qbo_create_journal_entry') {
      sample['memo'] = 'Reclassification of software licenses';
      sample['lines'] = [
        { account_id: '5002', posting_type: 'Debit', amount: 3200, description: 'Software SaaS license' },
        { account_id: '1001', posting_type: 'Credit', amount: 3200, description: 'Checking bank offset' }
      ];
    } else if (tool.name === 'qbo_query_sql') {
      sample['query'] = 'SELECT * FROM Customer WHERE Balance > 0';
    }

    setInputJson(JSON.stringify(sample, null, 2));
  };

  const executeTool = async () => {
    if (!selectedTool) return;
    setIsRunning(true);
    setExecutionError(null);
    setExecutionResult(null);

    let parsedArgs: any = {};
    try {
      parsedArgs = JSON.parse(inputJson || '{}');
    } catch (e: any) {
      setExecutionError(`Invalid JSON arguments: ${e.message}`);
      setIsRunning(false);
      return;
    }

    const startTime = performance.now();
    const rpcPayload = {
      jsonrpc: '2.0',
      id: `client-req-${Date.now()}`,
      method: 'tools/call',
      params: {
        name: selectedTool.name,
        arguments: parsedArgs
      }
    };

    try {
      const res = await fetch('/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-QBO-Company-ID': activeCompanyId
        },
        body: JSON.stringify(rpcPayload)
      });

      const data = await res.json();
      const endTime = performance.now();
      setExecutionLatency(Math.round(endTime - startTime));
      setRawRpcTrace({ request: rpcPayload, response: data });

      if (data.error) {
        setExecutionError(`JSON-RPC Error (${data.error.code}): ${data.error.message}`);
      } else if (data.result?.isError) {
        const errorContent = data.result.content?.[0]?.text;
        try {
          const parsed = JSON.parse(errorContent);
          setExecutionError(parsed.message || errorContent);
        } catch {
          setExecutionError(errorContent || 'Unknown error occurred.');
        }
      } else {
        const textContent = data.result?.content?.[0]?.text;
        try {
          setExecutionResult(JSON.parse(textContent));
        } catch {
          setExecutionResult(textContent);
        }
      }

      if (onExecutionLogged) {
        onExecutionLogged();
      }
    } catch (err: any) {
      setExecutionError(`Network / Connection Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Category Filter Pills & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 120 tools (e.g., profit_and_loss, invoice, reconcile, cash_flow)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="font-mono text-teal-400 font-semibold">{filteredTools.length}</span> tools matching filter
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            All Categories ({tools.length})
          </button>
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1 py-0.2 rounded text-[10px] font-mono ${
                  isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-900 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout: Tool List on Left, Interactive Runner on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tools List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[740px]">
          <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Tool Directory</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">120 Total Implemented</span>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-y-auto flex-1 scrollbar-thin">
            {filteredTools.map((tool) => {
              const isSelected = selectedTool?.name === tool.name;
              return (
                <button
                  key={tool.name}
                  onClick={() => handleSelectTool(tool)}
                  className={`w-full text-left p-3.5 transition-all flex items-start justify-between group ${
                    isSelected
                      ? 'bg-slate-800/90 border-l-4 border-teal-500'
                      : 'hover:bg-slate-800/40 border-l-4 border-transparent'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono font-semibold ${
                        isSelected ? 'text-teal-300' : 'text-slate-200 group-hover:text-teal-400'
                      }`}>
                        {tool.name}
                      </span>
                      {tool.isDestructive && (
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold uppercase rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Destructive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center space-x-2 pt-0.5">
                      <span className="text-[10px] text-slate-500 font-medium">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform mt-1 ${
                    isSelected ? 'text-teal-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive MCP Execution Workbench (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[740px]">
          {selectedTool ? (
            <div className="flex flex-col h-full">
              {/* Tool Header */}
              <div className="p-4 bg-slate-950/90 border-b border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-base font-bold text-white font-mono tracking-tight">
                        {selectedTool.name}
                      </h2>
                      {selectedTool.isDestructive ? (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Destructive Action</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Safe Read/Write</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {selectedTool.description}
                    </p>
                  </div>

                  <button
                    onClick={executeTool}
                    disabled={isRunning}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-teal-500/15 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
                  >
                    {isRunning ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white fill-white" />
                    )}
                    <span>{isRunning ? 'Executing...' : 'Run via /mcp'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                  <span>Category: <strong className="text-slate-300">{selectedTool.category}</strong></span>
                  <span>•</span>
                  <span>Safety Guard: <strong className={safeMode ? "text-emerald-400" : "text-amber-400"}>{safeMode ? "Active" : "Disarmed"}</strong></span>
                </div>
              </div>

              {/* Tool Parameters & Result Split */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Arguments Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Input Arguments (JSON Schema)</span>
                    </label>
                    <span className="text-[11px] text-slate-500">Edit parameters as JSON</span>
                  </div>
                  <textarea
                    value={inputJson}
                    onChange={(e) => setInputJson(e.target.value)}
                    rows={6}
                    className="w-full bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-700/80 rounded-xl p-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 leading-relaxed shadow-inner"
                  />
                </div>

                {/* Status Bar */}
                {executionLatency !== null && (
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-xs">
                    <div className="flex items-center space-x-2">
                      {executionError ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className={executionError ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                        {executionError ? 'Execution Blocked / Error' : 'MCP Response 200 OK'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{executionLatency} ms</span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {executionError && (
                  <div className="p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-200 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Action Halted</span>
                    </div>
                    <p className="leading-relaxed font-mono">{executionError}</p>
                    {executionError.includes('Safe Mode') && (
                      <p className="text-[11px] text-rose-300/80 mt-1">
                        Tip: Click &quot;Safe Mode&quot; toggle in top navbar to temporarily disarm safety for destructive tools.
                      </p>
                    )}
                  </div>
                )}

                {/* Success Result View */}
                {executionResult && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-teal-400" />
                        <span>MCP Structured Tool Output</span>
                      </label>
                      <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(executionResult, null, 2))}
                        className="text-[11px] text-teal-400 hover:text-teal-300 font-mono underline"
                      >
                        Copy JSON
                      </button>
                    </div>
                    <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-teal-300 overflow-x-auto max-h-72 leading-relaxed scrollbar-thin">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Schema Documentation for this tool */}
                <div className="border-t border-slate-800 pt-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    JSON Schema Properties
                  </h4>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 divide-y divide-slate-800/50">
                    {Object.entries(selectedTool.inputSchema?.properties || {}).map(([paramName, prop]: [string, any]) => (
                      <div key={paramName} className="py-2 first:pt-0 last:pb-0 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-teal-300 font-semibold">{paramName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {prop.type || 'any'}
                          </span>
                          {selectedTool.inputSchema?.required?.includes(paramName) && (
                            <span className="text-[10px] text-rose-400 font-semibold">required</span>
                          )}
                        </div>
                        {prop.description && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{prop.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-600" />
              <p className="text-sm">Select a tool from the directory to inspect and execute.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
