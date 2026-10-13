import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  RefreshCw, 
  Key, 
  Shield, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { QboCompany } from '../types/mcp';

interface CompanyManagerViewProps {
  companies: QboCompany[];
  activeCompanyId: string;
  onSelectCompany: (id: string) => void;
  onRefreshList: () => void;
}

export const CompanyManagerView: React.FC<CompanyManagerViewProps> = ({
  companies,
  activeCompanyId,
  onSelectCompany,
  onRefreshList
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  // New company form state
  const [newCompName, setNewCompName] = useState('');
  const [newLegalName, setNewLegalName] = useState('');
  const [newRealmId, setNewRealmId] = useState('');
  const [newEnv, setNewEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [newRole, setNewRole] = useState<'financial_admin' | 'read_write' | 'read_only'>('read_write');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [newClientId, setNewClientId] = useState('');
  const [newClientSecret, setNewClientSecret] = useState('');

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName || !newRealmId) return;

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCompName,
          legalName: newLegalName || newCompName,
          realmId: newRealmId,
          environment: newEnv,
          role: newRole,
          currency: newCurrency,
          country: newCurrency === 'GBP' ? 'GB' : 'US',
          status: 'connected',
          clientId: newClientId || 'IntuitApp-DevKey',
          clientSecret: newClientSecret ? '••••••••••••••••' : undefined,
          fiscalYearStartMonth: 'January',
          tokenExpiresAt: new Date(Date.now() + 86400000).toISOString()
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewCompName('');
        setNewLegalName('');
        setNewRealmId('');
        onRefreshList();
      }
    } catch (err) {
      console.error('Failed to create company:', err);
    }
  };

  const handleRefreshToken = async (companyId: string) => {
    setRefreshingId(companyId);
    try {
      await fetch('/api/oauth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: companyId })
      });
      onRefreshList();
    } catch (err) {
      console.error('Failed to refresh token:', err);
    } finally {
      setTimeout(() => setRefreshingId(null), 600);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (companies.length <= 1) {
      alert('Cannot delete the only remaining company.');
      return;
    }
    if (!confirm('Are you sure you want to disconnect this QuickBooks company context?')) return;

    try {
      const res = await fetch(`/api/companies/${companyId}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshList();
      }
    } catch (err) {
      console.error('Failed to delete company:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Multi-Company Architecture & Tenant Isolation
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Every QuickBooks company is maintained in an isolated execution context. MCP clients pass company context via arguments (<code className="text-teal-400">company_id</code>) or HTTP header (<code className="text-teal-400">X-QBO-Company-ID</code>). Tokens, data ledgers, and RBAC permissions are strictly partitioned.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New QBO Company</span>
        </button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {companies.map((comp) => {
          const isActive = comp.id === activeCompanyId;
          const isRefreshing = refreshingId === comp.id;

          return (
            <div
              key={comp.id}
              className={`rounded-2xl border transition-all p-5 shadow-sm relative ${
                isActive
                  ? 'bg-slate-900/95 border-teal-500 shadow-teal-500/5 ring-1 ring-teal-500/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active Context</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Company Name & Realm */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {comp.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">{comp.legalName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      Realm ID: {comp.realmId}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase ${
                      comp.environment === 'sandbox'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {comp.environment}
                    </span>
                  </div>
                </div>

                {/* Specs: Currency, Role, Expiry */}
                <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">RBAC Access Role</span>
                    <div className="flex items-center space-x-1 mt-0.5 font-medium text-slate-200">
                      <Shield className="w-3.5 h-3.5 text-teal-400" />
                      <span className="capitalize">{comp.role.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Base Currency</span>
                    <div className="flex items-center space-x-1 mt-0.5 font-medium text-slate-200">
                      <Globe className="w-3.5 h-3.5 text-teal-400" />
                      <span>{comp.currency} ({comp.country})</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">OAuth 2.0 Token Health</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Active & Synced
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Expires: {new Date(comp.tokenExpiresAt || '').toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    {!isActive && (
                      <button
                        onClick={() => onSelectCompany(comp.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        Set as Active Context
                      </button>
                    )}
                    <button
                      onClick={() => handleRefreshToken(comp.id)}
                      disabled={isRefreshing}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      title="Rotate OAuth 2.0 access and refresh token"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
                      <span>{isRefreshing ? 'Refreshing...' : 'Refresh Token'}</span>
                    </button>
                  </div>

                  {companies.length > 1 && (
                    <button
                      onClick={() => handleDeleteCompany(comp.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Disconnect company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Connect QuickBooks Company</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Industrial Supplies"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">QuickBooks Realm ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 913035298172999"
                    value={newRealmId}
                    onChange={(e) => setNewRealmId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Environment</label>
                  <select
                    value={newEnv}
                    onChange={(e: any) => setNewEnv(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="sandbox">Sandbox (Development)</option>
                    <option value="production">Production (Live Books)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">RBAC Role Permission</label>
                  <select
                    value={newRole}
                    onChange={(e: any) => setNewRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="financial_admin">Financial Admin (All tools + Void/Delete)</option>
                    <option value="read_write">Read & Write (Standard operations)</option>
                    <option value="read_only">Read-Only (Reports & queries only)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Currency</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Intuit Client ID (Optional for Live OAuth)</label>
                <input
                  type="text"
                  placeholder="ABx..."
                  value={newClientId}
                  onChange={(e) => setNewClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-md shadow-teal-600/20"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
