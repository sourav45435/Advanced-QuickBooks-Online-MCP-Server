import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Terminal, 
  Copy, 
  Check, 
  Activity, 
  Cpu
} from 'lucide-react';
import { QboCompany } from '../types/mcp';

interface NavbarProps {
  companies: QboCompany[];
  activeCompanyId: string;
  onSelectCompany: (id: string) => void;
  safeMode: boolean;
  onToggleSafeMode: (enabled: boolean) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  toolCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  companies,
  activeCompanyId,
  onSelectCompany,
  safeMode,
  onToggleSafeMode,
  activeTab,
  onSelectTab,
  toolCount
}) => {
  const [copied, setCopied] = React.useState(false);
  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];

  const copyMcpUrl = () => {
    const url = `${window.location.origin}/mcp`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navTabs = [
    { id: 'tools', label: '120-Tool MCP Explorer', count: toolCount },
    { id: 'ledger', label: 'Live QBO Ledgers' },
    { id: 'finance', label: 'Financial Intelligence', badge: 'Live' },
    { id: 'companies', label: 'Multi-Company Hub', count: companies.length },
    { id: 'test-suite', label: 'Automated QA Tests', badge: 'Pass' },
    { id: 'audit', label: 'Security & Audit Log' },
    { id: 'client-setup', label: 'MCP Client Setup' },
    { id: 'proposal', label: 'QBO MCP Proposal', badge: 'RFP' }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Server Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">QBO MCP Server</span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  v2.4.0 Online
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Model Context Protocol for QuickBooks Online API</p>
            </div>
          </div>

          {/* Quick Actions & State Controls */}
          <div className="flex items-center space-x-3">
            {/* Safe Mode Toggle */}
            <button
              onClick={() => onToggleSafeMode(!safeMode)}
              title={safeMode ? "Safe Mode active: Destructive delete/void actions are blocked." : "Safe Mode disarmed: Destructive actions authorized."}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                safeMode
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                  : 'bg-rose-950/70 text-rose-300 border-rose-700/60 hover:bg-rose-900/70 animate-pulse'
              }`}
            >
              {safeMode ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
              <span className="hidden md:inline">{safeMode ? 'Safe Mode: Armed' : 'Safe Mode: Disarmed'}</span>
            </button>

            {/* Active Company Selector */}
            <div className="relative flex items-center bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
              <Building2 className="w-3.5 h-3.5 text-teal-400 mr-2 shrink-0" />
              <div className="flex flex-col text-left mr-2">
                <span className="text-[10px] text-slate-400 font-mono">Company Context</span>
                <select
                  value={activeCompanyId}
                  onChange={(e) => onSelectCompany(e.target.value)}
                  className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-4"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                      {c.name} ({c.environment === 'sandbox' ? 'Sandbox' : 'Production'})
                    </option>
                  ))}
                </select>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                activeCompany?.environment === 'sandbox' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {activeCompany?.environment || 'sandbox'}
              </span>
            </div>

            {/* Copy /mcp Endpoint */}
            <button
              onClick={copyMcpUrl}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium shadow-sm transition-all"
              title="Copy remote MCP JSON-RPC endpoint for Claude Desktop or Cursor"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline font-mono">/mcp</span>
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Endpoint'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2.5 scrollbar-none">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
                    isActive
                      ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded text-[11px] font-mono ${
                      isActive ? 'bg-teal-950 text-teal-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] font-semibold uppercase rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
