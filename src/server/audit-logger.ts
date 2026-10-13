import { AuditLogEntry } from '../types/mcp.js';

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 500;

  constructor() {
    this.seedInitialLogs();
  }

  private seedInitialLogs() {
    const seed: Omit<AuditLogEntry, 'id'>[] = [
      {
        timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        toolName: 'qbo_get_profit_and_loss',
        category: 'Financial Reporting',
        companyId: 'comp-101',
        companyName: 'Apex Global Technologies',
        actor: 'Claude-3.7-Sonnet (MCP Agent)',
        status: 'success',
        durationMs: 142,
        inputPayload: { start_date: '2026-01-01', end_date: '2026-09-30', accounting_method: 'Accrual' },
        summary: 'Generated 9-month Accrual P&L. Net Income: $428,950.00',
        isDestructive: false
      },
      {
        timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
        toolName: 'qbo_analyze_ar_collectability',
        category: 'Advanced Financial Intelligence',
        companyId: 'comp-101',
        companyName: 'Apex Global Technologies',
        actor: 'Cursor IDE (Agent)',
        status: 'success',
        durationMs: 215,
        inputPayload: { as_of_date: '2026-10-01' },
        summary: 'Analyzed 42 open receivables. DSO: 38.4 days. High risk exposure: $18,200',
        isDestructive: false
      },
      {
        timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
        toolName: 'qbo_void_invoice',
        category: 'Sales & Accounts Receivable',
        companyId: 'comp-103',
        companyName: 'Horizon Cloud Software',
        actor: 'Autonomous Agent #4',
        status: 'blocked_by_safety',
        durationMs: 12,
        inputPayload: { invoice_id: 'INV-8891' },
        summary: 'Blocked: Read-Only role assigned to Horizon Cloud Software and Safe Mode enabled.',
        isDestructive: true
      },
      {
        timestamp: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
        toolName: 'qbo_13_week_cash_flow_forecast',
        category: 'Advanced Financial Intelligence',
        companyId: 'comp-101',
        companyName: 'Apex Global Technologies',
        actor: 'Executive MCP Client',
        status: 'success',
        durationMs: 298,
        inputPayload: { start_date: '2026-10-13' },
        summary: 'Forecasted 13-week cash runway. Minimum projected cash: $310,400 in Week 8.',
        isDestructive: false
      }
    ];

    seed.forEach((entry, idx) => {
      this.logs.unshift({
        ...entry,
        id: `audit-${Date.now() - idx * 1000}`
      });
    });
  }

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    this.logs.unshift(fullEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    return fullEntry;
  }

  public getLogs(limit: number = 50, filterCompanyId?: string): AuditLogEntry[] {
    let result = this.logs;
    if (filterCompanyId) {
      result = result.filter((l) => l.companyId === filterCompanyId);
    }
    return result.slice(0, limit);
  }

  public clear(): void {
    this.logs = [];
  }
}

export const auditLogger = new AuditLogger();
