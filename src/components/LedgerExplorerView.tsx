import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Receipt, 
  Users, 
  Building2, 
  DollarSign, 
  RefreshCw, 
  Search, 
  ArrowUpRight, 
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { QboCompany } from '../types/mcp';

interface LedgerExplorerViewProps {
  activeCompanyId: string;
  companies: QboCompany[];
}

export const LedgerExplorerView: React.FC<LedgerExplorerViewProps> = ({
  activeCompanyId,
  companies
}) => {
  const [subTab, setSubTab] = useState<'invoices' | 'bills' | 'accounts' | 'customers' | 'journal'>('invoices');
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const activeCompany = companies.find(c => c.id === activeCompanyId) || companies[0];

  const fetchLedgerData = async () => {
    setLoading(true);
    try {
      // Invoices
      const invRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'inv-fetch',
          method: 'tools/call',
          params: { name: 'qbo_query_sql', arguments: { company_id: activeCompanyId, query: 'SELECT * FROM Invoice' } }
        })
      });
      const invJson = await invRes.json();
      if (invJson.result?.content?.[0]?.text) {
        const parsed = JSON.parse(invJson.result.content[0].text);
        setInvoices(parsed.rows || []);
      }

      // Bills
      const billRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'bill-fetch',
          method: 'tools/call',
          params: { name: 'qbo_query_sql', arguments: { company_id: activeCompanyId, query: 'SELECT * FROM Bill' } }
        })
      });
      const billJson = await billRes.json();
      if (billJson.result?.content?.[0]?.text) {
        const parsed = JSON.parse(billJson.result.content[0].text);
        setBills(parsed.rows || []);
      }

      // Accounts
      const accRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'acc-fetch',
          method: 'tools/call',
          params: { name: 'qbo_list_accounts', arguments: { company_id: activeCompanyId } }
        })
      });
      const accJson = await accRes.json();
      if (accJson.result?.content?.[0]?.text) {
        const parsed = JSON.parse(accJson.result.content[0].text);
        setAccounts(parsed.accounts || []);
      }

      // Customers
      const custRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'cust-fetch',
          method: 'tools/call',
          params: { name: 'qbo_query_sql', arguments: { company_id: activeCompanyId, query: 'SELECT * FROM Customer' } }
        })
      });
      const custJson = await custRes.json();
      if (custJson.result?.content?.[0]?.text) {
        const parsed = JSON.parse(custJson.result.content[0].text);
        setCustomers(parsed.rows || []);
      }

      // Journal Entries
      const jeRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'je-fetch',
          method: 'tools/call',
          params: { name: 'qbo_get_general_ledger', arguments: { company_id: activeCompanyId } }
        })
      });
      const jeJson = await jeRes.json();
      if (jeJson.result?.content?.[0]?.text) {
        const parsed = JSON.parse(jeJson.result.content[0].text);
        setJournalEntries(parsed.rows || []);
      }
    } catch (e) {
      console.error('Failed to load ledger data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, [activeCompanyId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Live QuickBooks Online Subledgers & Entities
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Direct real-time view into the active company&apos;s synchronized general ledger, open invoices, vendor bills, customer balances, and Chart of Accounts. All records mutate live when MCP write tools execute.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-300 font-semibold">{activeCompany?.name}</div>
            <div className="text-[11px] text-teal-400 font-mono">Realm: {activeCompany?.realmId}</div>
          </div>
          <button
            onClick={fetchLedgerData}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-400' : ''}`} />
            <span>Sync Ledger</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex space-x-2">
          {[
            { id: 'invoices', label: 'Invoices', count: invoices.length, icon: FileText },
            { id: 'bills', label: 'Vendor Bills', count: bills.length, icon: Receipt },
            { id: 'accounts', label: 'Chart of Accounts', count: accounts.length, icon: DollarSign },
            { id: 'customers', label: 'Customers', count: customers.length, icon: Users },
            { id: 'journal', label: 'Journal Entries', count: journalEntries.length, icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-950 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Subledgers Content */}

      {/* 1. INVOICES */}
      {subTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Total Amount</th>
                  <th className="p-3.5 text-right">Open Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {invoices
                  .filter(inv => !searchTerm || inv.docNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-teal-300">{inv.docNumber}</td>
                      <td className="p-3.5 text-slate-200 font-sans">{inv.customerName}</td>
                      <td className="p-3.5 text-slate-400">{inv.txnDate}</td>
                      <td className="p-3.5 text-slate-400">{inv.dueDate}</td>
                      <td className="p-3.5 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          inv.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          inv.status === 'Voided' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-semibold text-white">
                        ${inv.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right font-bold text-emerald-400">
                        ${inv.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. BILLS */}
      {subTab === 'bills' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Bill #</th>
                  <th className="p-3.5">Vendor Name</th>
                  <th className="p-3.5">Bill Date</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Total Amount</th>
                  <th className="p-3.5 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {bills
                  .filter(b => !searchTerm || b.docNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || b.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-amber-300">{b.docNumber}</td>
                      <td className="p-3.5 text-slate-200 font-sans">{b.vendorName}</td>
                      <td className="p-3.5 text-slate-400">{b.txnDate}</td>
                      <td className="p-3.5 text-slate-400">{b.dueDate}</td>
                      <td className="p-3.5 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          b.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          b.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-semibold text-white">
                        ${b.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right font-bold text-rose-400">
                        ${b.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CHART OF ACCOUNTS */}
      {subTab === 'accounts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Account ID</th>
                  <th className="p-3.5">Account Name</th>
                  <th className="p-3.5">Classification</th>
                  <th className="p-3.5">Account Type</th>
                  <th className="p-3.5">Detail Sub-Type</th>
                  <th className="p-3.5 text-right">Current Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {accounts
                  .filter(a => !searchTerm || a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || a.type?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 text-slate-400 font-bold">{a.id}</td>
                      <td className="p-3.5 text-slate-200 font-sans font-medium">{a.name}</td>
                      <td className="p-3.5 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          a.classification === 'Asset' ? 'bg-teal-500/10 text-teal-300' :
                          a.classification === 'Liability' ? 'bg-rose-500/10 text-rose-400' :
                          a.classification === 'Equity' ? 'bg-purple-500/10 text-purple-300' :
                          a.classification === 'Revenue' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-amber-500/10 text-amber-300'
                        }`}>
                          {a.classification}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-sans">{a.type}</td>
                      <td className="p-3.5 text-slate-400 font-sans">{a.subType}</td>
                      <td className="p-3.5 text-right font-bold text-white">
                        ${a.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CUSTOMERS */}
      {subTab === 'customers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Customer ID</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Billing Email</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Open A/R Balance</th>
                  <th className="p-3.5 text-right">Overdue Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {customers
                  .filter(c => !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 text-slate-400 font-bold">{c.id}</td>
                      <td className="p-3.5 text-slate-200 font-sans font-medium">{c.name}</td>
                      <td className="p-3.5 text-slate-400">{c.email}</td>
                      <td className="p-3.5 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-white">
                        ${c.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`p-3.5 text-right font-bold ${c.overdue > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                        ${c.overdue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. JOURNAL ENTRIES */}
      {subTab === 'journal' && (
        <div className="space-y-4">
          {journalEntries.map((je) => (
            <div key={je.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="font-mono font-bold text-teal-300 text-xs">{je.docNumber}</span>
                  <span className="text-slate-400 text-xs ml-3 font-sans">Date: {je.txnDate}</span>
                </div>
                <span className="text-xs text-slate-300 font-medium italic">&quot;{je.memo}&quot;</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-1">Account Ref</th>
                      <th className="py-1">Description</th>
                      <th className="py-1 text-right">Debit ($)</th>
                      <th className="py-1 text-right">Credit ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {je.lines?.map((line: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-1.5 font-semibold text-teal-300">{line.accountId}</td>
                        <td className="py-1.5 font-sans text-slate-400">{line.description}</td>
                        <td className="py-1.5 text-right font-bold text-white">
                          {line.postingType === 'Debit' ? `$${line.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                        </td>
                        <td className="py-1.5 text-right font-bold text-emerald-400">
                          {line.postingType === 'Credit' ? `$${line.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
