import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Lock, 
  Download
} from 'lucide-react';

export const ProposalView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const proposalMarkdown = `# QBO MCP — Enterprise Integration Proposal & Production Architecture

## 1. Executive Summary
Thank you for the opportunity to review your requirements for building a production-ready, custom **QuickBooks Online Model Context Protocol (MCP) Server**. We have reviewed your architectural specifications, existing proof-of-concept foundation, and the 120-tool scope across all 8 major accounting and financial intelligence domains.

Our custom solution provides **100% intellectual property ownership**, complete independence from third-party vendor connectors (no Zapier, no Make, no proprietary SaaS middleware), native multi-company tenant isolation, OAuth 2.0 automated token rotation, and a resilient TypeScript architecture using the official Model Context Protocol standard.

---

## 2. Experience Developing MCP Servers & AI Integrations
- **Official MCP SDK & Spec Expertise**: Deep implementation track record building remote MCP servers implementing both JSON-RPC 2.0 over HTTPS (\`/mcp\`) and Server-Sent Events (\`/mcp/sse\`), compatible with Claude Desktop, Cursor IDE, Windsurf, LangChain, and autonomous agents.
- **Enterprise Schema Rigor**: Strict JSON Schema generation, Zod-backed runtime input validation, and AI-friendly structured responses designed specifically for low-hallucination agent execution.
- **Agent Safety Sandboxing**: Safe Mode guards on destructive operations (void, delete), idempotent writes, and audit trail diff logging.

---

## 3. QuickBooks Online API & Accounting Integrations Track Record
- **Direct Intuit Developer API Integration**: 7+ years developing integrations with the QuickBooks Online Accounting REST API v3, Intuit OAuth 2.0, Webhooks, and Batch processing.
- **GAAP & Accounting Mechanics**: Deep working knowledge of double-entry bookkeeping, trial balance reconciliations, subledger-to-GL matching, accrual vs cash accounting, class and department tracking, and 13-week direct cash forecasting.
- **Rate Limit & Concurrency Management**: Intuit 429 backoff handling, 500 req/min throttling per realmId, and optimistic concurrency management using QBO \`SyncToken\`.

---

## 4. Proposed Technical Architecture
Rather than 120 disparate, unmaintainable endpoint scripts, our system follows a **Modular Service-Oriented Architecture**:

1. **Protocol & Transport Layer**:
   - Remote HTTPS \`/mcp\` endpoint handling JSON-RPC 2.0 (\`initialize\`, \`tools/list\`, \`tools/call\`, \`ping\`).
   - Server-Sent Events (SSE) streaming transport for continuous agent communication.
2. **Tool Registry & Validation Engine**:
   - Centralized registry indexing all 120 tools with schemas, category tags, and destructive action flags.
   - Strict argument validation prior to dispatch.
3. **Company Context & Tenant Isolation**:
   - Multi-tenant credential store isolating realmIds, environments (Sandbox vs Production), and tokens.
   - Dynamic company resolution via header (\`X-QBO-Company-ID\`) or tool arguments (\`company_id\`).
   - Role-Based Access Control (RBAC): Financial Admin, Read/Write, Read-Only per company.
4. **Reusable QuickBooks Service Layer**:
   - \`ReportingService\`: P&L, Balance Sheet, Cash Flow, Trial Balance, Aging schedules.
   - \`SalesService\`: Invoices, Payments, Estimates, Credit Memos, Refunds.
   - \`PurchasingService\`: Bills, Bill Payments, Expenses, Purchase Orders, Vendor Credits.
   - \`BankingJournalService\`: Bank Feeds, Deposits, Transfers, Journal Entries, Balancing logic.
   - \`AttachmentService\`: Uploads, downloads, PDF retrieval, linkage.
   - \`ReconciliationService\`: Bank reconciliation diagnostics, change audit, clearing tests.
   - \`DataQualityService\`: Uncategorized detection, duplicate scanner, closing locks.
   - \`FinancialIntelligenceService\`: AR risk scoring, 13-week cash projections, variance analysis, cross-company consolidation.
5. **Security, Safety & Audit Ledger**:
   - Destructive action interlock: Delete and void operations disabled by default; require explicit administrative unlock.
   - In-memory and persistent audit logging of all requests, actors, payloads, and latency.

---

## 5. Implementation & Testing Approach for All 120 Tools
- **Unit Testing**: Isolated tests for each service method, verifying parameter handling and schema conformance.
- **Sandbox Integration Testing**: Automated integration suites executed against Intuit QuickBooks Online Sandbox companies to validate live API round-trips.
- **Idempotency & Concurrency Validation**: Optimistic locking testing with simulated stale \`SyncToken\` collisions.
- **End-to-End MCP Client Verification**: Live testing with Claude Desktop, Cursor, and Python/Node MCP clients.

---

## 6. Multi-Company Authentication & Data Security
- **Data Partitioning**: Each company operates with an isolated ledger state and API client instance. Cross-tenant leakage is architecturally impossible.
- **OAuth 2.0 Security**: Automatic background refresh token rotation prior to expiry (Intuit 60-minute access token window). Client credentials stored securely using environment variables and encryption.
- **Destructive Action Guards**: Hard blocks on voiding and deleting accounting documents unless Safe Mode is disarmed with verified authorization.
- **Immutable Audit Trail**: Actor tracking (which agent or user triggered the call), company target, payload summary, and execution duration.

---

## 7. Estimated Timeline & Milestones
- **Phase 1: Core Platform & Foundation (Weeks 1-2)**
  - Review and refactor proof of concept.
  - Remote MCP endpoint with JSON-RPC & SSE.
  - Multi-company context engine, OAuth 2.0 automated token rotation.
  - Reusable service architecture & RBAC security gates.
  - First 40 tools (Core Reporting, Accounts, Customers, Vendors, Invoices).
- **Phase 2: Complete 120-Tool Scope & Advanced Financial Intelligence (Weeks 3-4)**
  - Implement remaining 80 tools across Purchasing, Banking, Reconciliations, Month-End Closing, and Financial Intelligence.
  - 13-Week Cash Flow model and Cross-Company comparison matrix.
  - Sandbox end-to-end test suite and error handling hardening.
- **Phase 3: Production Hardening, Documentation & Delivery (Week 5)**
  - Comprehensive API documentation and MCP setup guides (Claude, Cursor, custom agents).
  - Production deployment configuration (Docker / Cloud Run).
  - Full source code and IP transfer walkthrough.

---

## 8. Fixed-Price Estimate & IP Transfer Confirmation
- **Fixed-Price Estimate**: $8,500 USD (or $115/hour if preferred).
  - Milestone 1 (Phase 1 delivery & core 40 tools): 35% ($2,975)
  - Milestone 2 (Complete 120 tools & analytics engine): 45% ($3,825)
  - Milestone 3 (Final acceptance, testing, IP transfer): 20% ($1,700)
- **Intellectual Property Guarantee**: We hereby confirm that 100% of all source code, architecture diagrams, configurations, tests, and intellectual property will be transferred exclusively to your ownership upon completion with clean, unencumbered licensing.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(proposalMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Enterprise Integration Proposal & Architectural Specification
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Prepared in direct response to your RFP. Begins with &quot;QBO MCP&quot; and details the full 120-tool production architecture, timeline, pricing, and IP transfer terms.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Full Proposal!' : 'Copy Proposal (Markdown)'}</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-teal-400">
            <Cpu className="w-4 h-4" />
            <span className="text-[11px] uppercase font-semibold text-slate-400">Tool Scope</span>
          </div>
          <div className="text-xl font-bold text-white mt-1">120 MCP Tools</div>
          <p className="text-[11px] text-slate-400 mt-1">Across 9 distinct accounting categories</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] uppercase font-semibold text-slate-400">Timeline</span>
          </div>
          <div className="text-xl font-bold text-white mt-1">4–5 Weeks</div>
          <p className="text-[11px] text-slate-400 mt-1">Staged milestones with weekly demo drops</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-[11px] uppercase font-semibold text-slate-400">Fixed-Price</span>
          </div>
          <div className="text-xl font-bold text-white mt-1">$8,500 USD</div>
          <p className="text-[11px] text-slate-400 mt-1">Milestone-based or $115/hr billing</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-purple-400">
            <Lock className="w-4 h-4" />
            <span className="text-[11px] uppercase font-semibold text-slate-400">IP Ownership</span>
          </div>
          <div className="text-xl font-bold text-white mt-1">100% Transfer</div>
          <p className="text-[11px] text-slate-400 mt-1">Full source code & IP ownership guarantee</p>
        </div>
      </div>

      {/* Structured Proposal Sections */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <div className="space-y-2 border-b border-slate-800 pb-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            1. Experience Developing MCP Servers & AI Systems
          </h3>
          <p>
            We possess hands-on, production experience architecting remote Model Context Protocol (MCP) servers using the official TypeScript <code className="text-teal-300">@modelcontextprotocol/sdk</code> and JSON-RPC 2.0 specifications. Our implementations provide secure HTTPS <code className="text-teal-300">/mcp</code> endpoints and Server-Sent Events (SSE) streaming capable of serving multiple concurrent AI agents without provider lock-in (compatible with Claude Desktop, Cursor IDE, Windsurf, LangChain, AutoGen, and custom Python/TypeScript agents).
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2 border-b border-slate-800 pb-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            2. QuickBooks Online API Integrations
          </h3>
          <p>
            Our background includes extensive work with the QuickBooks Online Accounting REST API v3, Intuit OAuth 2.0 token management, and complex financial data reconciliation. We have built integrations handling hundreds of thousands of transactions, automated invoicing pipelines, multi-currency conversions, and tax agency filings while respecting Intuit rate limits (500 requests/minute per realmId) and implementing exponential backoff.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2 border-b border-slate-800 pb-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            3. Proposed Technical Architecture
          </h3>
          <p>
            As requested, we strictly reject monolithic architectures or 120 isolated ad-hoc scripts. Instead, we structure the server around a <strong>unified service-oriented architecture</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li><strong>MCP Tool Registry</strong>: Centralized schema directory with auto-documentation and parameter validation.</li>
            <li><strong>Company Context & Session Layer</strong>: Automatic routing via realmId header or parameter with strict tenant memory isolation.</li>
            <li><strong>Intuit OAuth 2.0 Engine</strong>: Background proactive token rotation prior to token expiry.</li>
            <li><strong>Domain Service Layer</strong>: ReportingService, SalesService, PurchasingService, BankingService, AttachmentService, ReconciliationService, ClosingService, and FinancialIntelligenceService.</li>
            <li><strong>Safety Gatekeeper</strong>: Destructive action interlock requiring explicit authorization for voiding/deleting records.</li>
            <li><strong>Audit Ledger</strong>: Immutable logging of callers, company contexts, latency, and payload diffs.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-2 border-b border-slate-800 pb-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            4. 120-Tool Scope Coverage & Verification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {[
              { title: 'Financial Reporting', count: '15 Tools', desc: 'P&L, Balance Sheet, Cash Flow, Trial Balance, GL, Aging' },
              { title: 'Accounting Data Mgmt', count: '20 Tools', desc: 'Accounts, Customers, Vendors, Items, Employees, SQL queries' },
              { title: 'Sales & AR', count: '15 Tools', desc: 'Invoices, Payments, Estimates, Credit Memos, Refunds' },
              { title: 'Purchasing & AP', count: '15 Tools', desc: 'Bills, Bill Payments, Expenses, Purchase Orders, Vendor Credits' },
              { title: 'Banking & Journal Entries', count: '10 Tools', desc: 'Deposits, Transfers, Journal Entries, Bank Feed matches' },
              { title: 'Attachments & Documents', count: '8 Tools', desc: 'Uploads, downloads, PDF streams, entity linkages' },
              { title: 'Reconciliations & Audits', count: '12 Tools', desc: 'Diagnostics, statement reconstruction, deposit matching' },
              { title: 'Month-End Closing', count: '12 Tools', desc: 'Checklists, uncategorized finder, duplicate scanner, period lock' },
              { title: 'Financial Intelligence', count: '13 Tools', desc: '13-Week Cash forecast, AR collectability, KPIs, Cross-Company' }
            ].map((cat, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{cat.title}</span>
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">{cat.count}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5 & 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-800 pb-5">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              5. Timeline & Milestones
            </h3>
            <ul className="space-y-2">
              <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-semibold text-teal-300">Phase 1: Foundation (Weeks 1-2)</span>
                <p className="text-slate-400 text-[11px]">MCP server, multi-company isolation, OAuth, core 40 tools.</p>
              </li>
              <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-semibold text-teal-300">Phase 2: Complete 120 Tools (Weeks 3-4)</span>
                <p className="text-slate-400 text-[11px]">All remaining tools, 13-week cash model, cross-company matrix, tests.</p>
              </li>
              <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-semibold text-teal-300">Phase 3: Production & Transfer (Week 5)</span>
                <p className="text-slate-400 text-[11px]">Deployment verification, client documentation, IP handover.</p>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              6. Fixed Price & IP Ownership Confirmation
            </h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-white">Fixed-Price Total:</span>
                <span className="font-bold text-emerald-400 text-base font-mono">$8,500 USD</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Payable across 3 clear deliverables upon your review and satisfaction. Alternatively, billable at $115/hour with bi-weekly timesheet reporting.
              </p>
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center space-x-1.5 text-teal-400 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>IP Ownership Guarantee</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  We explicitly confirm that full, unconditional copyright, source code ownership, documentation, and intellectual property will be transferred to your company upon final delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
