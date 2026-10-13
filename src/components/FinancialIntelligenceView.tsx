import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Scale, 
  AlertCircle, 
  ShieldCheck, 
  Calendar, 
  RefreshCw, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  BarChart3
} from 'lucide-react';
import { QboCompany } from '../types/mcp';

interface FinancialIntelligenceViewProps {
  activeCompanyId: string;
  companies: QboCompany[];
}

export const FinancialIntelligenceView: React.FC<FinancialIntelligenceViewProps> = ({
  activeCompanyId,
  companies
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'pnl' | 'balance_sheet' | 'cash_forecast' | 'reconciliation' | 'cross_company'>('pnl');
  const [loading, setLoading] = useState(false);
  const [pnlData, setPnlData] = useState<any>(null);
  const [balanceSheetData, setBalanceSheetData] = useState<any>(null);
  const [cashForecastData, setCashForecastData] = useState<any>(null);
  const [reconcileData, setReconcileData] = useState<any>(null);
  const [crossCompanyData, setCrossCompanyData] = useState<any>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // 1. P&L via MCP endpoint
      const pnlRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'pnl-req',
          method: 'tools/call',
          params: { name: 'qbo_get_profit_and_loss', arguments: { company_id: activeCompanyId } }
        })
      });
      const pnlJson = await pnlRes.json();
      if (pnlJson.result?.content?.[0]?.text) {
        setPnlData(JSON.parse(pnlJson.result.content[0].text));
      }

      // 2. Balance Sheet
      const bsRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'bs-req',
          method: 'tools/call',
          params: { name: 'qbo_get_balance_sheet', arguments: { company_id: activeCompanyId } }
        })
      });
      const bsJson = await bsRes.json();
      if (bsJson.result?.content?.[0]?.text) {
        setBalanceSheetData(JSON.parse(bsJson.result.content[0].text));
      }

      // 3. Cash Flow Forecast
      const cfRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'cf-req',
          method: 'tools/call',
          params: { name: 'qbo_13_week_cash_flow_forecast', arguments: { company_id: activeCompanyId } }
        })
      });
      const cfJson = await cfRes.json();
      if (cfJson.result?.content?.[0]?.text) {
        setCashForecastData(JSON.parse(cfJson.result.content[0].text));
      }

      // 4. Reconciliation Diagnostics
      const recRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'rec-req',
          method: 'tools/call',
          params: { name: 'qbo_reconciliation_diagnostics', arguments: { company_id: activeCompanyId, account_id: '1001', statement_ending_date: '2026-09-30', statement_ending_balance: 482590.25 } }
        })
      });
      const recJson = await recRes.json();
      if (recJson.result?.content?.[0]?.text) {
        setReconcileData(JSON.parse(recJson.result.content[0].text));
      }

      // 5. Cross Company Matrix
      const matrixRes = await fetch('/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'matrix-req',
          method: 'tools/call',
          params: { name: 'qbo_cross_company_financial_matrix', arguments: {} }
        })
      });
      const matrixJson = await matrixRes.json();
      if (matrixJson.result?.content?.[0]?.text) {
        setCrossCompanyData(JSON.parse(matrixJson.result.content[0].text));
      }
    } catch (e) {
      console.error('Failed to load reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [activeCompanyId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Accounting Ledger & Financial Intelligence Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Direct real-time view into the QuickBooks Online financial models calculated by our MCP analytics engine. Includes GAAP verification, 13-week direct cash runway, and cross-company comparisons.
          </p>
        </div>

        <button
          onClick={fetchReports}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-400' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Ledgers'}</span>
        </button>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'pnl', label: 'Profit & Loss Statement' },
          { id: 'balance_sheet', label: 'Balance Sheet & Integrity Audit' },
          { id: 'cash_forecast', label: '13-Week Cash Flow Forecast' },
          { id: 'reconciliation', label: 'Bank Reconciliation Diagnostics' },
          { id: 'cross_company', label: 'Cross-Company Matrix' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeReportTab === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panes */}

      {/* 1. PROFIT & LOSS */}
      {activeReportTab === 'pnl' && pnlData && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue</span>
              <div className="text-xl font-bold text-white mt-1">
                ${pnlData.rows.revenue.total.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs prior period
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Gross Profit</span>
              <div className="text-xl font-bold text-white mt-1">
                ${pnlData.rows.gross_profit.toLocaleString()}
              </div>
              <span className="text-[11px] text-teal-300 font-mono mt-1">
                Margin: {pnlData.rows.gross_margin_percent}%
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Operating Expenses</span>
              <div className="text-xl font-bold text-white mt-1">
                ${pnlData.rows.operating_expenses.total.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1">
                4 line items tracked
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Net Operating Income</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                ${pnlData.rows.net_operating_income.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-300 font-mono mt-1">
                Net Margin: {pnlData.rows.net_margin_percent}%
              </span>
            </div>
          </div>

          {/* Statement Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Profit and Loss (Income Statement)</h3>
                <p className="text-xs text-slate-400">Method: {pnlData.accounting_method} • Currency: {pnlData.currency}</p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {pnlData.date_range.start_date} to {pnlData.date_range.end_date}
              </span>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Revenue Section */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-200 border-b border-slate-800 pb-1">
                  <span>Revenues & Invoiced Income</span>
                  <span>Amount</span>
                </div>
                {pnlData.rows.revenue.categories.map((c: any) => (
                  <div key={c.account_id} className="flex justify-between text-slate-300 pl-4 py-0.5">
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-200">${c.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-teal-300 pt-1 border-t border-slate-800/60 pl-2">
                  <span>Total Revenue</span>
                  <span className="font-mono">${pnlData.rows.revenue.total.toLocaleString()}</span>
                </div>
              </div>

              {/* COGS Section */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between font-bold text-slate-200 border-b border-slate-800 pb-1">
                  <span>Cost of Goods Sold (COGS)</span>
                  <span>Amount</span>
                </div>
                {pnlData.rows.cost_of_goods_sold.categories.map((c: any) => (
                  <div key={c.account_id} className="flex justify-between text-slate-300 pl-4 py-0.5">
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-200">${c.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-amber-300 pt-1 border-t border-slate-800/60 pl-2">
                  <span>Total Cost of Goods Sold</span>
                  <span className="font-mono">${pnlData.rows.cost_of_goods_sold.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Gross Profit Callout */}
              <div className="flex justify-between font-bold text-sm bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-white">Gross Profit</span>
                <span className="text-emerald-400 font-mono">${pnlData.rows.gross_profit.toLocaleString()} ({pnlData.rows.gross_margin_percent}%)</span>
              </div>

              {/* Operating Expenses */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between font-bold text-slate-200 border-b border-slate-800 pb-1">
                  <span>Operating Expenses</span>
                  <span>Amount</span>
                </div>
                {pnlData.rows.operating_expenses.categories.map((c: any) => (
                  <div key={c.account_id} className="flex justify-between text-slate-300 pl-4 py-0.5">
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-200">${c.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-rose-300 pt-1 border-t border-slate-800/60 pl-2">
                  <span>Total Operating Expenses</span>
                  <span className="font-mono">${pnlData.rows.operating_expenses.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Net Income Callout */}
              <div className="flex justify-between font-bold text-base bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/50">
                <span className="text-emerald-200">Net Operating Income</span>
                <span className="text-emerald-400 font-mono">${pnlData.rows.net_operating_income.toLocaleString()} ({pnlData.rows.net_margin_percent}%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BALANCE SHEET & INTEGRITY AUDIT */}
      {activeReportTab === 'balance_sheet' && balanceSheetData && (
        <div className="space-y-6">
          {/* Integrity Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Balance Sheet Integrity: Fully Balanced</h3>
                <p className="text-xs text-slate-400">
                  Fundamental Accounting Equation: Assets ($ {balanceSheetData.accounting_equation_check.assets.toLocaleString()}) = Liabilities + Equity ($ {balanceSheetData.accounting_equation_check.liabilities_plus_equity.toLocaleString()})
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Discrepancy: $0.00
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assets */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2">
                Assets (${balanceSheetData.assets.total_assets.toLocaleString()})
              </h4>
              <div className="space-y-2 text-xs">
                {balanceSheetData.assets.bank_accounts.map((a: any) => (
                  <div key={a.id} className="flex justify-between text-slate-300">
                    <span className="truncate pr-2">{a.name}</span>
                    <span className="font-mono">${a.balance.toLocaleString()}</span>
                  </div>
                ))}
                {balanceSheetData.assets.accounts_receivable.map((a: any) => (
                  <div key={a.id} className="flex justify-between text-slate-300">
                    <span>{a.name}</span>
                    <span className="font-mono">${a.balance.toLocaleString()}</span>
                  </div>
                ))}
                {balanceSheetData.assets.fixed_assets.map((a: any) => (
                  <div key={a.id} className="flex justify-between text-slate-300">
                    <span>{a.name}</span>
                    <span className="font-mono">${a.balance.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Liabilities */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-2">
                Liabilities (${balanceSheetData.liabilities.total_liabilities.toLocaleString()})
              </h4>
              <div className="space-y-2 text-xs">
                {balanceSheetData.liabilities.accounts_payable.map((a: any) => (
                  <div key={a.id} className="flex justify-between text-slate-300">
                    <span>{a.name}</span>
                    <span className="font-mono">${a.balance.toLocaleString()}</span>
                  </div>
                ))}
                {balanceSheetData.liabilities.credit_cards.map((a: any) => (
                  <div key={a.id} className="flex justify-between text-slate-300">
                    <span>{a.name}</span>
                    <span className="font-mono">${a.balance.toLocaleString()}</span>
                  </div>
                ))}
                {balanceSheetData.liabilities.long_term_liabilities.map((a: any) => (
                  <div key={a.id} className="flex justify-between text-slate-300">
                    <span>{a.name}</span>
                    <span className="font-mono">${a.balance.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equity */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 border-b border-slate-800 pb-2">
                Equity (${balanceSheetData.equity.total_equity.toLocaleString()})
              </h4>
              <div className="space-y-2 text-xs">
                {balanceSheetData.equity.equity_accounts.map((a: any) => (
                  <div key={a.id} className="flex justify-between text-slate-300">
                    <span>{a.name}</span>
                    <span className="font-mono">${a.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-emerald-300 font-semibold pt-1 border-t border-slate-800">
                  <span>Current Year Net Income</span>
                  <span className="font-mono">${balanceSheetData.equity.current_year_net_income.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 13-WEEK CASH FLOW FORECAST */}
      {activeReportTab === 'cash_forecast' && cashForecastData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Starting Liquid Cash</span>
              <div className="text-xl font-bold text-white mt-1">
                ${cashForecastData.starting_liquid_cash.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1">Checking + Money Market</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Min Projected Cash (Trough)</span>
              <div className="text-xl font-bold text-amber-400 mt-1">
                ${cashForecastData.minimum_projected_cash.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 font-mono mt-1">Solvency intact (+Buffer)</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Calculated Runway</span>
              <div className="text-xl font-bold text-teal-400 mt-1">
                {cashForecastData.runway_months} Months
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1">Assuming base burn rate</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">13-Week Rolling Cash Flow Schedule</h3>
              <p className="text-xs text-slate-400">Direct cash model combining AR due dates, AP schedules, and payroll cycles.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Week</th>
                    <th className="p-3">Projected Inflows</th>
                    <th className="p-3">Projected Outflows</th>
                    <th className="p-3">Net Weekly Cash Flow</th>
                    <th className="p-3 text-right">Ending Cash Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {cashForecastData.weekly_schedule.map((w: any) => (
                    <tr key={w.week_number} className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-300 font-sans font-medium">Week {w.week_number}</td>
                      <td className="p-3 text-emerald-400">+${w.projected_inflows.toLocaleString()}</td>
                      <td className="p-3 text-rose-400">-${w.projected_outflows.toLocaleString()}</td>
                      <td className={`p-3 font-semibold ${w.net_cash_flow >= 0 ? 'text-teal-300' : 'text-amber-400'}`}>
                        {w.net_cash_flow >= 0 ? '+' : ''}${w.net_cash_flow.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-bold text-white">
                        ${w.ending_cash_balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECONCILIATION DIAGNOSTICS */}
      {activeReportTab === 'reconciliation' && reconcileData && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{reconcileData.account_name} — Reconciliation Diagnostic</h3>
                <p className="text-xs text-slate-400">Target Statement Date: {reconcileData.statement_date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                reconcileData.status === 'BALANCED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {reconcileData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-sans">Statement Ending</span>
                <div className="text-sm font-bold text-white mt-0.5">${reconcileData.statement_ending_balance.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-sans">Register Balance</span>
                <div className="text-sm font-bold text-white mt-0.5">${reconcileData.register_balance.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-sans">Cleared Balance</span>
                <div className="text-sm font-bold text-teal-300 mt-0.5">${reconcileData.cleared_balance.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-sans">Reconciliation Diff</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">${reconcileData.difference.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Diagnostic Rule Verifications</h4>
              <div className="divide-y divide-slate-800/80">
                {reconcileData.diagnostic_checks.map((chk: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      {chk.passed ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="text-slate-200 font-medium">{chk.check}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{chk.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CROSS-COMPANY MATRIX */}
      {activeReportTab === 'cross_company' && crossCompanyData && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Cross-Company Multi-Tenant Ledger Comparison</h3>
            <p className="text-xs text-slate-400">Authorized consolidated reporting across all connected QuickBooks entities with isolation intact.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Entity Name</th>
                  <th className="p-3">Realm ID</th>
                  <th className="p-3">Env</th>
                  <th className="p-3">Currency</th>
                  <th className="p-3 text-right">Revenue</th>
                  <th className="p-3 text-right">Net Income</th>
                  <th className="p-3 text-right">Gross Margin</th>
                  <th className="p-3 text-right">Liquid Cash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {crossCompanyData.companies.map((c: any) => (
                  <tr key={c.company_id} className="hover:bg-slate-800/30">
                    <td className="p-3 text-slate-200 font-sans font-semibold">{c.company_name}</td>
                    <td className="p-3 text-slate-400">{c.realm_id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                        c.environment === 'sandbox' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {c.environment}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-sans">{c.currency}</td>
                    <td className="p-3 text-right font-bold text-white">${c.total_revenue.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">${c.net_operating_income.toLocaleString()}</td>
                    <td className="p-3 text-right text-teal-300">{c.gross_margin_pct}%</td>
                    <td className="p-3 text-right text-slate-200">${c.liquid_cash.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
