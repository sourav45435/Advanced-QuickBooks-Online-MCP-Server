import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ToolExplorer } from './components/ToolExplorer';
import { CompanyManagerView } from './components/CompanyManagerView';
import { FinancialIntelligenceView } from './components/FinancialIntelligenceView';
import { AuditLogView } from './components/AuditLogView';
import { McpClientGuide } from './components/McpClientGuide';
import { ProposalView } from './components/ProposalView';
import { LedgerExplorerView } from './components/LedgerExplorerView';
import { TestSuiteView } from './components/TestSuiteView';
import { McpToolDefinition, QboCompany, ToolCategory } from './types/mcp';
import { TOOL_CATEGORIES } from './server/tools-catalog';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('tools');
  const [tools, setTools] = useState<McpToolDefinition[]>([]);
  const [categories, setCategories] = useState<ToolCategory[]>(TOOL_CATEGORIES);
  const [companies, setCompanies] = useState<QboCompany[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string>('comp-101');
  const [safeMode, setSafeMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAppData = async () => {
    try {
      const [toolsRes, compRes] = await Promise.all([
        fetch('/api/tools'),
        fetch('/api/companies')
      ]);

      if (toolsRes.ok) {
        const toolsData = await toolsRes.json();
        setTools(toolsData.tools || []);
        if (toolsData.categories) setCategories(toolsData.categories);
      }

      if (compRes.ok) {
        const compData = await compRes.json();
        setCompanies(compData.companies || []);
        if (compData.activeCompanyId) setActiveCompanyId(compData.activeCompanyId);
        if (compData.safeMode !== undefined) setSafeMode(compData.safeMode);
      }
    } catch (err) {
      console.error('Failed to load initial app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const handleSelectCompany = async (id: string) => {
    setActiveCompanyId(id);
    try {
      await fetch('/api/companies/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error('Failed to change active company:', err);
    }
  };

  const handleToggleSafeMode = async (enabled: boolean) => {
    setSafeMode(enabled);
    try {
      await fetch('/api/safe-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
    } catch (err) {
      console.error('Failed to update safe mode:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        companies={companies}
        activeCompanyId={activeCompanyId}
        onSelectCompany={handleSelectCompany}
        safeMode={safeMode}
        onToggleSafeMode={handleToggleSafeMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        toolCount={tools.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-mono">Initializing QuickBooks MCP Server Engine...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'tools' && (
              <ToolExplorer
                tools={tools}
                categories={categories}
                activeCompanyId={activeCompanyId}
                safeMode={safeMode}
                onExecutionLogged={() => {}}
              />
            )}

            {activeTab === 'ledger' && (
              <LedgerExplorerView
                activeCompanyId={activeCompanyId}
                companies={companies}
              />
            )}

            {activeTab === 'finance' && (
              <FinancialIntelligenceView
                activeCompanyId={activeCompanyId}
                companies={companies}
              />
            )}

            {activeTab === 'companies' && (
              <CompanyManagerView
                companies={companies}
                activeCompanyId={activeCompanyId}
                onSelectCompany={handleSelectCompany}
                onRefreshList={fetchAppData}
              />
            )}

            {activeTab === 'test-suite' && <TestSuiteView />}

            {activeTab === 'audit' && (
              <AuditLogView
                companies={companies}
                activeCompanyId={activeCompanyId}
              />
            )}

            {activeTab === 'client-setup' && <McpClientGuide />}

            {activeTab === 'proposal' && <ProposalView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">QuickBooks Online MCP Server</span>
            <span>•</span>
            <span className="font-mono text-teal-400">120 Production Accounting Tools</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-500">
            <span>Model Context Protocol v2024-11-05</span>
            <span>•</span>
            <span>Intuit QBO REST v3</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">Live /mcp JSON-RPC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
