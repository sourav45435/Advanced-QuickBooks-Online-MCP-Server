import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Download, 
  Trash2, 
  Clock, 
  Filter, 
  User, 
  Building2,
  RefreshCw
} from 'lucide-react';
import { AuditLogEntry, QboCompany } from '../types/mcp';

interface AuditLogViewProps {
  companies: QboCompany[];
  activeCompanyId: string;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  companies,
  activeCompanyId
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = filterCompany === 'all' ? '/api/audit-logs' : `/api/audit-logs?company_id=${filterCompany}`;
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterCompany]);

  const filteredLogs = logs.filter((l) => {
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    return true;
  });

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `qbo_mcp_audit_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Export Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Security Governance & Audit Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Immutable tracking of all Model Context Protocol tool requests, identity stamps, company contexts, latency, and safety blocks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-400' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-300">Company:</span>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
            >
              <option value="all">All Connected Entities</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
            >
              <option value="all">All Outcomes</option>
              <option value="success">Success</option>
              <option value="blocked_by_safety">Blocked by Safety / RBAC</option>
              <option value="failure">Execution Failure</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400 font-mono text-[11px]">
          Showing {filteredLogs.length} logged events
        </span>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Tool Invoked</th>
                <th className="p-3.5">Company Context</th>
                <th className="p-3.5">Actor / Client</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-slate-400 whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-3.5 font-bold text-teal-300 whitespace-nowrap">
                    {log.toolName}
                  </td>
                  <td className="p-3.5 text-slate-300 font-sans whitespace-nowrap">
                    {log.companyName}
                  </td>
                  <td className="p-3.5 text-slate-400 font-sans whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {log.status === 'success' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" /> Success
                      </span>
                    )}
                    {log.status === 'blocked_by_safety' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 w-fit">
                        <ShieldAlert className="w-3 h-3" /> Blocked
                      </span>
                    )}
                    {log.status === 'failure' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" /> Error
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {log.durationMs}ms
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-teal-400 hover:text-teal-300 underline text-xs cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono">{selectedLog.toolName}</h3>
                <p className="text-xs text-slate-400">{selectedLog.timestamp}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Target Company</span>
                  <p className="text-slate-200 font-semibold">{selectedLog.companyName} ({selectedLog.companyId})</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Execution Actor</span>
                  <p className="text-slate-200 font-semibold">{selectedLog.actor}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Result Status</span>
                  <p className="capitalize font-semibold text-teal-400">{selectedLog.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Latency</span>
                  <p className="text-slate-200 font-mono">{selectedLog.durationMs} milliseconds</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Summary & Rationale</span>
                <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 mt-1 leading-relaxed">
                  {selectedLog.summary}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Input Payload</span>
                <pre className="bg-slate-950 text-teal-300 font-mono text-xs p-3 rounded-lg border border-slate-800 mt-1 overflow-x-auto max-h-40">
                  {JSON.stringify(selectedLog.inputPayload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
