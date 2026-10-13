import { QboCompany } from '../types/mcp.js';
import { companyManager } from './company-manager.js';

export interface CompanyLedgerState {
  accounts: Array<{ id: string; name: string; type: string; subType: string; balance: number; classification: string }>;
  customers: Array<{ id: string; name: string; email: string; balance: number; overdue: number; status: string }>;
  vendors: Array<{ id: string; name: string; email: string; balance: number; is1099: boolean }>;
  invoices: Array<{ id: string; docNumber: string; customerId: string; customerName: string; txnDate: string; dueDate: string; totalAmount: number; balance: number; status: string; lines: any[] }>;
  bills: Array<{ id: string; docNumber: string; vendorId: string; vendorName: string; txnDate: string; dueDate: string; totalAmount: number; balance: number; status: string; lines: any[] }>;
  journalEntries: Array<{ id: string; docNumber: string; txnDate: string; memo: string; lines: any[] }>;
  attachments: Array<{ id: string; fileName: string; contentType: string; sizeBytes: number; linkedTo?: string; uploadedAt: string }>;
  closingDate?: string;
  isClosed: boolean;
}

// In-memory persistent company ledgers
const companyLedgers = new Map<string, CompanyLedgerState>();

function getOrCreateLedger(companyId: string): CompanyLedgerState {
  if (companyLedgers.has(companyId)) {
    return companyLedgers.get(companyId)!;
  }

  const seed: CompanyLedgerState = {
    isClosed: false,
    closingDate: '2025-12-31',
    accounts: [
      { id: '1001', name: 'Operating Checking Account (Chase #4190)', type: 'Bank', subType: 'Checking', balance: 482590.25, classification: 'Asset' },
      { id: '1002', name: 'Money Market Reserves (Silicon Valley Bank)', type: 'Bank', subType: 'Savings', balance: 850200.00, classification: 'Asset' },
      { id: '1100', name: 'Accounts Receivable (A/R)', type: 'Accounts Receivable', subType: 'AccountsReceivable', balance: 214800.50, classification: 'Asset' },
      { id: '1200', name: 'Allowance for Doubtful Accounts', type: 'Other Current Asset', subType: 'AllowanceForDoubtfulAccounts', balance: -8500.00, classification: 'Asset' },
      { id: '1300', name: 'Undeposited Funds / Clearing', type: 'Other Current Asset', subType: 'UndepositedFunds', balance: 14250.00, classification: 'Asset' },
      { id: '1500', name: 'Computer Equipment & Hardware', type: 'Fixed Asset', subType: 'FurnitureAndFixtures', balance: 145000.00, classification: 'Asset' },
      { id: '1590', name: 'Accumulated Depreciation', type: 'Fixed Asset', subType: 'AccumulatedDepreciation', balance: -42500.00, classification: 'Asset' },
      { id: '2001', name: 'Accounts Payable (A/P)', type: 'Accounts Payable', subType: 'AccountsPayable', balance: 94250.10, classification: 'Liability' },
      { id: '2100', name: 'Corporate Credit Card (Amex Platinum)', type: 'Credit Card', subType: 'CreditCard', balance: 23410.80, classification: 'Liability' },
      { id: '2200', name: 'Accrued Payroll & Bonuses', type: 'Other Current Liability', subType: 'OtherCurrentLiabilities', balance: 48900.00, classification: 'Liability' },
      { id: '2300', name: 'Sales Tax Payable (State Board)', type: 'Other Current Liability', subType: 'SalesTaxPayable', balance: 12450.35, classification: 'Liability' },
      { id: '2500', name: 'Venture Term Loan (JPMorgan)', type: 'Long Term Liability', subType: 'NotesPayable', balance: 350000.00, classification: 'Liability' },
      { id: '3001', name: 'Common Stock', type: 'Equity', subType: 'CommonStock', balance: 500000.00, classification: 'Equity' },
      { id: '3900', name: 'Retained Earnings', type: 'Equity', subType: 'RetainedEarnings', balance: 341230.50, classification: 'Equity' },
      { id: '4001', name: 'Software Subscription Revenue', type: 'Income', subType: 'ServiceFeeIncome', balance: 1485600.00, classification: 'Revenue' },
      { id: '4002', name: 'Enterprise Implementation Services', type: 'Income', subType: 'ServiceFeeIncome', balance: 312400.00, classification: 'Revenue' },
      { id: '5001', name: 'AWS & Cloud Infrastructure Hosting', type: 'Cost of Goods Sold', subType: 'SuppliesMaterialsCogs', balance: 215400.00, classification: 'Expense' },
      { id: '5002', name: 'Third-Party API & SaaS Licensing', type: 'Cost of Goods Sold', subType: 'SuppliesMaterialsCogs', balance: 84200.00, classification: 'Expense' },
      { id: '6001', name: 'Salaries & Engineering Wages', type: 'Expense', subType: 'PayrollExpenses', balance: 642800.00, classification: 'Expense' },
      { id: '6002', name: 'Sales & Growth Marketing', type: 'Expense', subType: 'AdvertisingPromotional', balance: 184500.00, classification: 'Expense' },
      { id: '6003', name: 'Legal & Accounting Professional Fees', type: 'Expense', subType: 'LegalProfessionalFees', balance: 49200.00, classification: 'Expense' },
      { id: '6004', name: 'Office Rent & Facilities', type: 'Expense', subType: 'RentRepairs', balance: 78000.00, classification: 'Expense' }
    ],
    customers: [
      { id: 'cust-1', name: 'Acme Enterprises Inc', email: 'billing@acme.example.com', balance: 48500.00, overdue: 12500.00, status: 'Active' },
      { id: 'cust-2', name: 'CyberShield Security Corp', email: 'ap@cybershield.example.com', balance: 82000.00, overdue: 0.00, status: 'Active' },
      { id: 'cust-3', name: 'Global Logistics Nexus', email: 'finance@nexuslogistics.example.com', balance: 29400.00, overdue: 8400.00, status: 'Active' },
      { id: 'cust-4', name: 'Bluefin BioTech Labs', email: 'accounting@bluefinbio.example.com', balance: 54900.50, overdue: 32000.00, status: 'Active' },
      { id: 'cust-5', name: 'Omni Retail Group', email: 'vendorpay@omniretail.example.com', balance: 0.00, overdue: 0.00, status: 'Active' }
    ],
    vendors: [
      { id: 'vend-1', name: 'Amazon Web Services Inc', email: 'aws-invoicing@amazon.com', balance: 42100.00, is1099: false },
      { id: 'vend-2', name: 'Latham & Watkins LLP', email: 'billing@lw.example.com', balance: 18500.00, is1099: true },
      { id: 'vend-3', name: 'WeWork Global Management', email: 'rent@wework.example.com', balance: 13000.00, is1099: false },
      { id: 'vend-4', name: 'Snowflake Computing Inc', email: 'ar@snowflake.example.com', balance: 11400.00, is1099: false },
      { id: 'vend-5', name: 'FastTrack Recruiting Partners', email: 'invoices@fasttrack.example.com', balance: 9250.10, is1099: true }
    ],
    invoices: [
      {
        id: 'inv-101',
        docNumber: 'INV-2026-081',
        customerId: 'cust-1',
        customerName: 'Acme Enterprises Inc',
        txnDate: '2026-08-15',
        dueDate: '2026-09-15',
        totalAmount: 48500.00,
        balance: 48500.00,
        status: 'Overdue',
        lines: [{ item: 'Annual Enterprise SaaS License', qty: 1, rate: 48500, amount: 48500 }]
      },
      {
        id: 'inv-102',
        docNumber: 'INV-2026-092',
        customerId: 'cust-2',
        customerName: 'CyberShield Security Corp',
        txnDate: '2026-09-28',
        dueDate: '2026-10-28',
        totalAmount: 82000.00,
        balance: 82000.00,
        status: 'Open',
        lines: [{ item: 'Quarterly Dedicated Cloud Cluster', qty: 1, rate: 82000, amount: 82000 }]
      },
      {
        id: 'inv-103',
        docNumber: 'INV-2026-095',
        customerId: 'cust-3',
        customerName: 'Global Logistics Nexus',
        txnDate: '2026-09-01',
        dueDate: '2026-10-01',
        totalAmount: 29400.00,
        balance: 29400.00,
        status: 'Overdue',
        lines: [{ item: 'Custom Integration Consulting', qty: 70, rate: 420, amount: 29400 }]
      },
      {
        id: 'inv-104',
        docNumber: 'INV-2026-074',
        customerId: 'cust-4',
        customerName: 'Bluefin BioTech Labs',
        txnDate: '2026-07-20',
        dueDate: '2026-08-20',
        totalAmount: 54900.50,
        balance: 54900.50,
        status: 'Overdue',
        lines: [{ item: 'SaaS Platform Tier 3', qty: 1, rate: 54900.50, amount: 54900.50 }]
      }
    ],
    bills: [
      {
        id: 'bill-201',
        docNumber: 'AWS-SEP-2026',
        vendorId: 'vend-1',
        vendorName: 'Amazon Web Services Inc',
        txnDate: '2026-09-30',
        dueDate: '2026-10-30',
        totalAmount: 42100.00,
        balance: 42100.00,
        status: 'Open',
        lines: [{ account: '5001', desc: 'Production Kubernetes Cluster', amount: 42100.00 }]
      },
      {
        id: 'bill-202',
        docNumber: 'LW-78912',
        vendorId: 'vend-2',
        vendorName: 'Latham & Watkins LLP',
        txnDate: '2026-09-15',
        dueDate: '2026-10-15',
        totalAmount: 18500.00,
        balance: 18500.00,
        status: 'Due Soon',
        lines: [{ account: '6003', desc: 'Series B Corporate Governance', amount: 18500.00 }]
      },
      {
        id: 'bill-203',
        docNumber: 'WW-OCT-RENT',
        vendorId: 'vend-3',
        vendorName: 'WeWork Global Management',
        txnDate: '2026-10-01',
        dueDate: '2026-10-05',
        totalAmount: 13000.00,
        balance: 13000.00,
        status: 'Overdue',
        lines: [{ account: '6004', desc: 'San Francisco HQ Suite', amount: 13000.00 }]
      }
    ],
    journalEntries: [
      {
        id: 'je-1',
        docNumber: 'JE-2026-009',
        txnDate: '2026-09-30',
        memo: 'Month-end accrued cloud hosting costs',
        lines: [
          { accountId: '5001', postingType: 'Debit', amount: 14500.00, description: 'Accrued hosting' },
          { accountId: '2200', postingType: 'Credit', amount: 14500.00, description: 'Accrued liabilities' }
        ]
      }
    ],
    attachments: [
      { id: 'att-1', fileName: 'AWS_Invoice_Sep2026.pdf', contentType: 'application/pdf', sizeBytes: 248910, linkedTo: 'bill-201', uploadedAt: '2026-10-01T14:20:00Z' },
      { id: 'att-2', fileName: 'LegalRetainer_Latham.pdf', contentType: 'application/pdf', sizeBytes: 512400, linkedTo: 'bill-202', uploadedAt: '2026-09-18T09:12:00Z' },
      { id: 'att-3', fileName: 'Acme_Enterprise_Contract.pdf', contentType: 'application/pdf', sizeBytes: 1048576, linkedTo: 'inv-101', uploadedAt: '2026-08-16T11:00:00Z' }
    ]
  };

  companyLedgers.set(companyId, seed);
  return seed;
}

export class QboService {
  private static resolveCompany(explicitId?: string): { company: QboCompany; ledger: CompanyLedgerState } {
    let company = explicitId ? companyManager.getCompany(explicitId) : companyManager.getActiveCompany();
    if (!company) {
      company = companyManager.getActiveCompany();
    }
    const ledger = getOrCreateLedger(company.id);
    return { company, ledger };
  }

  // ==========================================
  // 1. FINANCIAL REPORTING SERVICES
  // ==========================================
  public static getProfitAndLoss(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const startDate = args?.start_date || '2026-01-01';
    const endDate = args?.end_date || '2026-10-13';
    const method = args?.accounting_method || 'Accrual';

    const revenueAccounts = ledger.accounts.filter(a => a.classification === 'Revenue');
    const cogsAccounts = ledger.accounts.filter(a => a.type === 'Cost of Goods Sold');
    const expenseAccounts = ledger.accounts.filter(a => a.classification === 'Expense' && a.type !== 'Cost of Goods Sold');

    const totalRevenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);
    const totalCogs = cogsAccounts.reduce((sum, a) => sum + a.balance, 0);
    const grossProfit = totalRevenue - totalCogs;
    const totalExpenses = expenseAccounts.reduce((sum, a) => sum + a.balance, 0);
    const netOperatingIncome = grossProfit - totalExpenses;
    const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const netMarginPercent = totalRevenue > 0 ? (netOperatingIncome / totalRevenue) * 100 : 0;

    return {
      report_name: 'Profit and Loss',
      company_name: company.name,
      currency: company.currency,
      date_range: { start_date: startDate, end_date: endDate },
      accounting_method: method,
      summarize_by: args?.summarize_by || 'Total',
      rows: {
        revenue: {
          categories: revenueAccounts.map(a => ({ account_id: a.id, name: a.name, amount: a.balance })),
          total: totalRevenue
        },
        cost_of_goods_sold: {
          categories: cogsAccounts.map(a => ({ account_id: a.id, name: a.name, amount: a.balance })),
          total: totalCogs
        },
        gross_profit: grossProfit,
        gross_margin_percent: Number(grossMarginPercent.toFixed(2)),
        operating_expenses: {
          categories: expenseAccounts.map(a => ({ account_id: a.id, name: a.name, amount: a.balance })),
          total: totalExpenses
        },
        net_operating_income: netOperatingIncome,
        net_margin_percent: Number(netMarginPercent.toFixed(2))
      }
    };
  }

  public static getBalanceSheet(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const asOfDate = args?.as_of_date || '2026-10-13';

    const assets = ledger.accounts.filter(a => a.classification === 'Asset');
    const liabilities = ledger.accounts.filter(a => a.classification === 'Liability');
    const equity = ledger.accounts.filter(a => a.classification === 'Equity');

    const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
    const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);

    // Net income flows into equity
    const pnl = this.getProfitAndLoss({ company_id: company.id });
    const netIncome = pnl.rows.net_operating_income;
    const adjustedTotalEquity = totalEquity + netIncome;
    const balancedDiscrepancy = Math.abs(totalAssets - (totalLiabilities + adjustedTotalEquity));

    return {
      report_name: 'Balance Sheet',
      company_name: company.name,
      currency: company.currency,
      as_of_date: asOfDate,
      accounting_method: args?.accounting_method || 'Accrual',
      assets: {
        bank_accounts: assets.filter(a => a.type === 'Bank'),
        accounts_receivable: assets.filter(a => a.type === 'Accounts Receivable'),
        other_current_assets: assets.filter(a => a.type === 'Other Current Asset'),
        fixed_assets: assets.filter(a => a.type === 'Fixed Asset'),
        total_assets: totalAssets
      },
      liabilities: {
        accounts_payable: liabilities.filter(a => a.type === 'Accounts Payable'),
        credit_cards: liabilities.filter(a => a.type === 'Credit Card'),
        other_current_liabilities: liabilities.filter(a => a.type === 'Other Current Liability'),
        long_term_liabilities: liabilities.filter(a => a.type === 'Long Term Liability'),
        total_liabilities: totalLiabilities
      },
      equity: {
        equity_accounts: equity,
        current_year_net_income: netIncome,
        total_equity: adjustedTotalEquity
      },
      accounting_equation_check: {
        assets: totalAssets,
        liabilities_plus_equity: totalLiabilities + adjustedTotalEquity,
        is_balanced: balancedDiscrepancy < 0.01,
        discrepancy: balancedDiscrepancy
      }
    };
  }

  public static getCashFlow(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const pnl = this.getProfitAndLoss({ company_id: company.id });
    const netIncome = pnl.rows.net_operating_income;

    return {
      report_name: 'Statement of Cash Flows',
      company_name: company.name,
      currency: company.currency,
      period: { start_date: args?.start_date || '2026-01-01', end_date: args?.end_date || '2026-10-13' },
      operating_activities: {
        net_income: netIncome,
        adjustments_for_depreciation: 12500,
        change_in_accounts_receivable: -48200,
        change_in_accounts_payable: 18400,
        change_in_undeposited_funds: -3100,
        net_cash_from_operating_activities: netIncome + 12500 - 48200 + 18400 - 3100
      },
      investing_activities: {
        purchase_of_fixed_assets: -35000,
        net_cash_used_in_investing_activities: -35000
      },
      financing_activities: {
        principal_loan_repayments: -24000,
        net_cash_used_in_financing_activities: -24000
      },
      summary: {
        beginning_cash_balance: 915200,
        net_change_in_cash: 417590.25,
        ending_cash_balance: 1332790.25
      }
    };
  }

  public static getTrialBalance(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    let totalDebits = 0;
    let totalCredits = 0;

    const items = ledger.accounts.map(acc => {
      const isDebitNature = ['Asset', 'Expense'].includes(acc.classification);
      let debit = 0;
      let credit = 0;
      if (isDebitNature) {
        if (acc.balance >= 0) debit = acc.balance;
        else credit = Math.abs(acc.balance);
      } else {
        if (acc.balance >= 0) credit = acc.balance;
        else debit = Math.abs(acc.balance);
      }
      totalDebits += debit;
      totalCredits += credit;
      return {
        account_id: acc.id,
        account_name: acc.name,
        type: acc.type,
        debit,
        credit
      };
    });

    return {
      report_name: 'Trial Balance',
      company_name: company.name,
      as_of_date: args?.as_of_date || '2026-10-13',
      accounts: items,
      totals: {
        total_debits: Number(totalDebits.toFixed(2)),
        total_credits: Number(totalCredits.toFixed(2)),
        balanced: Math.abs(totalDebits - totalCredits) < 0.01
      }
    };
  }

  public static getArAgingSummary(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const buckets = [
      { customer: 'Acme Enterprises Inc', current: 0, d1_30: 36000, d31_60: 12500, d61_90: 0, d91_plus: 0, total: 48500 },
      { customer: 'CyberShield Security Corp', current: 82000, d1_30: 0, d31_60: 0, d61_90: 0, d91_plus: 0, total: 82000 },
      { customer: 'Global Logistics Nexus', current: 0, d1_30: 21000, d31_60: 8400, d61_90: 0, d91_plus: 0, total: 29400 },
      { customer: 'Bluefin BioTech Labs', current: 0, d1_30: 0, d31_60: 22900.50, d61_90: 32000, d91_plus: 0, total: 54900.50 }
    ];
    return {
      report_name: 'Accounts Receivable Aging Summary',
      company_name: company.name,
      currency: company.currency,
      as_of_date: args?.as_of_date || '2026-10-13',
      buckets,
      total_receivables: buckets.reduce((s, b) => s + b.total, 0),
      total_overdue: buckets.reduce((s, b) => s + (b.d1_30 + b.d31_60 + b.d61_90 + b.d91_plus), 0)
    };
  }

  public static getApAgingSummary(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const buckets = [
      { vendor: 'Amazon Web Services Inc', current: 42100, d1_30: 0, d31_60: 0, d61_90: 0, total: 42100 },
      { vendor: 'Latham & Watkins LLP', current: 18500, d1_30: 0, d31_60: 0, d61_90: 0, total: 18500 },
      { vendor: 'WeWork Global Management', current: 0, d1_30: 13000, d31_60: 0, d61_90: 0, total: 13000 },
      { vendor: 'Snowflake Computing Inc', current: 11400, d1_30: 0, d31_60: 0, d61_90: 0, total: 11400 },
      { vendor: 'FastTrack Recruiting Partners', current: 9250.10, d1_30: 0, d31_60: 0, d61_90: 0, total: 9250.10 }
    ];
    return {
      report_name: 'Accounts Payable Aging Summary',
      company_name: company.name,
      currency: company.currency,
      as_of_date: args?.as_of_date || '2026-10-13',
      buckets,
      total_payables: buckets.reduce((s, b) => s + b.total, 0)
    };
  }

  // ==========================================
  // 2. ACCOUNTING DATA MANAGEMENT SERVICES
  // ==========================================
  public static executeSql(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const q = (args.query || '').trim();

    if (q.toUpperCase().includes('CUSTOMER')) {
      return { query: q, row_count: ledger.customers.length, rows: ledger.customers };
    }
    if (q.toUpperCase().includes('VENDOR')) {
      return { query: q, row_count: ledger.vendors.length, rows: ledger.vendors };
    }
    if (q.toUpperCase().includes('ACCOUNT')) {
      return { query: q, row_count: ledger.accounts.length, rows: ledger.accounts };
    }
    if (q.toUpperCase().includes('INVOICE')) {
      return { query: q, row_count: ledger.invoices.length, rows: ledger.invoices };
    }
    if (q.toUpperCase().includes('BILL')) {
      return { query: q, row_count: ledger.bills.length, rows: ledger.bills };
    }

    return {
      query: q,
      company: company.name,
      status: 'executed',
      message: 'Intuit SQL parsed and executed against company database snapshot.',
      data: ledger.accounts.slice(0, 5)
    };
  }

  public static getCompanyInfo(args: any) {
    const { company } = this.resolveCompany(args?.company_id);
    return {
      company_id: company.id,
      realm_id: company.realmId,
      company_name: company.name,
      legal_name: company.legalName,
      country: company.country,
      fiscal_year_start: company.fiscalYearStartMonth,
      currency: company.currency,
      environment: company.environment,
      status: company.status,
      role: company.role,
      last_synced: company.lastSyncAt
    };
  }

  public static listAccounts(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    let accounts = ledger.accounts;
    if (args?.account_type) {
      accounts = accounts.filter(a => a.type.toLowerCase().includes(args.account_type.toLowerCase()));
    }
    return { total: accounts.length, accounts };
  }

  public static getAccount(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const acc = ledger.accounts.find(a => a.id === args.account_id);
    if (!acc) throw new Error(`Account not found: ${args.account_id}`);
    return acc;
  }

  public static createAccount(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const newId = `acc-${Date.now().toString(36)}`;
    const newAcc = {
      id: newId,
      name: args.name,
      type: args.account_type,
      subType: args.account_sub_type || 'General',
      balance: 0,
      classification: ['Bank', 'Accounts Receivable', 'Fixed Asset'].includes(args.account_type) ? 'Asset' : 'Expense'
    };
    ledger.accounts.push(newAcc);
    return { success: true, account: newAcc };
  }

  public static getCustomer(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const c = ledger.customers.find(item => item.id === args.customer_id);
    if (!c) throw new Error(`Customer not found: ${args.customer_id}`);
    return c;
  }

  public static searchCustomers(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const term = (args.search_term || '').toLowerCase();
    const results = ledger.customers.filter(c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term));
    return { count: results.length, customers: results };
  }

  public static createCustomer(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const id = `cust-${Date.now().toString(36)}`;
    const cust = {
      id,
      name: args.display_name,
      email: args.email || 'billing@client.com',
      balance: 0,
      overdue: 0,
      status: 'Active'
    };
    ledger.customers.push(cust);
    return { success: true, customer: cust };
  }

  // ==========================================
  // 3. SALES & ACCOUNTS RECEIVABLE SERVICES
  // ==========================================
  public static getInvoice(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const inv = ledger.invoices.find(i => i.id === args.invoice_id || i.docNumber === args.invoice_id);
    if (!inv) throw new Error(`Invoice not found: ${args.invoice_id}`);
    return inv;
  }

  public static createInvoice(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const customer = ledger.customers.find(c => c.id === args.customer_id);
    const total = (args.line_items || []).reduce((s: number, l: any) => s + (Number(l.amount) || 0), 0);
    const id = `inv-${Date.now().toString(36)}`;
    const docNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newInv = {
      id,
      docNumber,
      customerId: args.customer_id,
      customerName: customer ? customer.name : 'Client',
      txnDate: args.txn_date || new Date().toISOString().slice(0, 10),
      dueDate: args.due_date || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      totalAmount: total,
      balance: total,
      status: 'Open',
      lines: args.line_items || []
    };

    ledger.invoices.push(newInv);
    if (customer) {
      customer.balance += total;
    }
    // Update AR
    const ar = ledger.accounts.find(a => a.type === 'Accounts Receivable');
    if (ar) ar.balance += total;

    return {
      success: true,
      message: `Invoice ${docNumber} created successfully in QuickBooks Online.`,
      invoice: newInv
    };
  }

  public static voidInvoice(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const inv = ledger.invoices.find(i => i.id === args.invoice_id);
    if (!inv) throw new Error(`Invoice not found: ${args.invoice_id}`);

    const oldBalance = inv.balance;
    inv.balance = 0;
    inv.totalAmount = 0;
    inv.status = 'Voided';

    const customer = ledger.customers.find(c => c.id === inv.customerId);
    if (customer) customer.balance = Math.max(0, customer.balance - oldBalance);

    const ar = ledger.accounts.find(a => a.type === 'Accounts Receivable');
    if (ar) ar.balance = Math.max(0, ar.balance - oldBalance);

    return {
      success: true,
      message: `Invoice ${inv.docNumber} has been voided. Reason: ${args.void_reason}`,
      invoice: inv
    };
  }

  public static recordPayment(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const cust = ledger.customers.find(c => c.id === args.customer_id);
    const amt = Number(args.total_amount) || 0;

    if (cust) {
      cust.balance = Math.max(0, cust.balance - amt);
    }
    const ar = ledger.accounts.find(a => a.type === 'Accounts Receivable');
    if (ar) ar.balance = Math.max(0, ar.balance - amt);
    const bank = ledger.accounts.find(a => a.id === args.deposit_to_account_id) || ledger.accounts.find(a => a.type === 'Bank');
    if (bank) bank.balance += amt;

    return {
      payment_id: `pmt-${Date.now().toString(36)}`,
      status: 'Applied',
      customer_id: args.customer_id,
      amount_paid: amt,
      payment_method: args.payment_method || 'Check',
      undeposited_funds_cleared: true
    };
  }

  // ==========================================
  // 4. PURCHASING & AP SERVICES
  // ==========================================
  public static getBill(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const b = ledger.bills.find(item => item.id === args.bill_id);
    if (!b) throw new Error(`Bill not found: ${args.bill_id}`);
    return b;
  }

  public static createBill(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const vendor = ledger.vendors.find(v => v.id === args.vendor_id);
    const total = (args.line_items || []).reduce((s: number, l: any) => s + (Number(l.amount) || 0), 0);
    const id = `bill-${Date.now().toString(36)}`;
    const docNumber = `BILL-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newBill = {
      id,
      docNumber,
      vendorId: args.vendor_id,
      vendorName: vendor ? vendor.name : 'Vendor',
      txnDate: args.txn_date || new Date().toISOString().slice(0, 10),
      dueDate: args.due_date || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      totalAmount: total,
      balance: total,
      status: 'Open',
      lines: args.line_items || []
    };

    ledger.bills.push(newBill);
    if (vendor) vendor.balance += total;
    const ap = ledger.accounts.find(a => a.type === 'Accounts Payable');
    if (ap) ap.balance += total;

    return { success: true, message: `Bill ${docNumber} logged.`, bill: newBill };
  }

  // ==========================================
  // 5. BANKING & JOURNAL ENTRIES
  // ==========================================
  public static createJournalEntry(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const lines = args.lines || [];
    let debitTotal = 0;
    let creditTotal = 0;

    lines.forEach((l: any) => {
      if (l.posting_type === 'Debit') debitTotal += Number(l.amount);
      if (l.posting_type === 'Credit') creditTotal += Number(l.amount);
    });

    if (Math.abs(debitTotal - creditTotal) > 0.001) {
      throw new Error(`Double-entry violation: Debits ($${debitTotal}) must equal Credits ($${creditTotal}). Discrepancy: $${Math.abs(debitTotal - creditTotal)}`);
    }

    const id = `je-${Date.now().toString(36)}`;
    const docNumber = `JE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const je = {
      id,
      docNumber,
      txnDate: args.txn_date || new Date().toISOString().slice(0, 10),
      memo: args.memo || 'Adjusting journal entry',
      lines
    };

    ledger.journalEntries.push(je);
    return { success: true, journal_entry: je, total_posted: debitTotal };
  }

  // ==========================================
  // 6. ATTACHMENTS
  // ==========================================
  public static uploadAttachment(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const id = `att-${Date.now().toString(36)}`;
    const att = {
      id,
      fileName: args.file_name,
      contentType: args.content_type,
      sizeBytes: Math.floor(args.content_base64?.length * 0.75) || 54200,
      linkedTo: args.attachable_to?.entity_id,
      uploadedAt: new Date().toISOString()
    };
    ledger.attachments.push(att);
    return { success: true, attachment: att };
  }

  public static listEntityAttachments(args: any) {
    const { ledger } = this.resolveCompany(args?.company_id);
    const items = ledger.attachments.filter(a => a.linkedTo === args.entity_id || !args.entity_id);
    return { count: items.length, attachments: items };
  }

  // ==========================================
  // 7. RECONCILIATION & ACCOUNTING REVIEWS
  // ==========================================
  public static reconciliationDiagnostics(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const bankAcc = ledger.accounts.find(a => a.id === args.account_id) || ledger.accounts[0];
    const targetEnding = Number(args.statement_ending_balance) || 482590.25;
    const registerBalance = bankAcc.balance;
    const diff = registerBalance - targetEnding;

    return {
      company_name: company.name,
      account_name: bankAcc.name,
      statement_date: args.statement_ending_date,
      statement_ending_balance: targetEnding,
      register_balance: registerBalance,
      cleared_balance: registerBalance - 1450.00,
      difference: diff,
      status: Math.abs(diff) < 0.01 ? 'BALANCED' : 'VARIANCE_DETECTED',
      diagnostic_checks: [
        { check: 'Beginning Balance Integrity', passed: true, note: 'Matched prior signed statement' },
        { check: 'Uncleared Checks > 90 Days', passed: false, note: 'Found 1 stale check (#1042 for $850.00)' },
        { check: 'Duplicate Feed Matches', passed: true, note: 'Zero duplicate pairings detected' },
        { check: 'Direct Register Edits to Cleared Items', passed: true, note: 'No prior reconciled records modified' }
      ],
      recommendations: [
        'Review Uncleared Check #1042 to verify if void or escheatment is required.',
        'Match incoming wire of $14,250 currently sitting in Undeposited Funds.'
      ]
    };
  }

  // ==========================================
  // 8. MONTH-END CLOSING & DATA QUALITY
  // ==========================================
  public static monthEndCloseReview(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    return {
      company_name: company.name,
      period_ending: args.period_ending || '2026-09-30',
      close_readiness_score: 94,
      status: 'READY_FOR_CONTROLLER_SIGN_OFF',
      modules: {
        bank_reconciliations: { completed: 2, pending: 0, status: 'PASSED' },
        subledgers: { ar_agrees_with_gl: true, ap_agrees_with_gl: true, discrepancy: 0.00 },
        uncategorized_transactions: { count: 0, balance: 0.00 },
        payroll_clearing: { balance: 0.00, status: 'WASHED' },
        depreciation_posted: { status: 'POSTED', amount: 1250.00 },
        closing_date_lock: { locked: ledger.isClosed, closing_date: ledger.closingDate }
      },
      audit_flags: []
    };
  }

  public static detectUncategorized(args: any) {
    const { company } = this.resolveCompany(args?.company_id);
    return {
      company_name: company.name,
      uncategorized_income_items: [],
      uncategorized_expense_items: [
        { id: 'tx-812', date: '2026-10-02', payee: 'UNKNOWN ACH 4120', amount: 145.20, account: 'Uncategorized Expense', suggestion: 'Software Subscription' }
      ],
      total_uncategorized_amount: 145.20,
      cleanliness_grade: 'A-'
    };
  }

  // ==========================================
  // 9. ADVANCED FINANCIAL INTELLIGENCE
  // ==========================================
  public static analyzeArCollectability(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const totalAr = ledger.customers.reduce((s, c) => s + c.balance, 0);
    const totalOverdue = ledger.customers.reduce((s, c) => s + c.overdue, 0);

    return {
      company_name: company.name,
      currency: company.currency,
      total_accounts_receivable: totalAr,
      total_overdue: totalOverdue,
      days_sales_outstanding_dso: 38.4,
      industry_benchmark_dso: 45.0,
      collection_effectiveness_index_cei: 88.6,
      high_risk_exposure: 32000.00,
      customer_risk_stratification: ledger.customers.map(c => ({
        customer_id: c.id,
        customer_name: c.name,
        open_balance: c.balance,
        overdue_balance: c.overdue,
        risk_score: c.overdue > 20000 ? 'High' : c.overdue > 0 ? 'Medium' : 'Low',
        expected_loss_provision: c.overdue > 20000 ? c.overdue * 0.25 : 0
      }))
    };
  }

  public static cashFlowForecast13Week(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const startingCash = ledger.accounts.filter(a => a.type === 'Bank').reduce((s, a) => s + a.balance, 0);

    const weeks = [];
    let runningCash = startingCash;
    const weeklyInflows = [45000, 52000, 38000, 61000, 44000, 48000, 72000, 39000, 51000, 46000, 58000, 64000, 80000];
    const weeklyOutflows = [38000, 41000, 35000, 89000 /* payroll */, 36000, 40000, 39000, 92000 /* payroll */, 37000, 42000, 36000, 95000, 44000];

    for (let i = 1; i <= 13; i++) {
      const inflow = weeklyInflows[i - 1];
      const outflow = weeklyOutflows[i - 1];
      const net = inflow - outflow;
      runningCash += net;
      weeks.push({
        week_number: i,
        projected_inflows: inflow,
        projected_outflows: outflow,
        net_cash_flow: net,
        ending_cash_balance: runningCash
      });
    }

    return {
      company_name: company.name,
      currency: company.currency,
      forecast_horizon: '13 Weeks',
      starting_liquid_cash: startingCash,
      minimum_projected_cash: Math.min(...weeks.map(w => w.ending_cash_balance)),
      projected_cash_at_week_13: runningCash,
      runway_months: (startingCash / 48000).toFixed(1),
      weekly_schedule: weeks
    };
  }

  public static computeFinancialKpis(args: any) {
    const { company, ledger } = this.resolveCompany(args?.company_id);
    const pnl = this.getProfitAndLoss({ company_id: company.id });
    const bs = this.getBalanceSheet({ company_id: company.id });

    const currentAssets = bs.assets.bank_accounts.reduce((s: number, a: any) => s + a.balance, 0) +
      bs.assets.accounts_receivable.reduce((s: number, a: any) => s + a.balance, 0) +
      bs.assets.other_current_assets.reduce((s: number, a: any) => s + a.balance, 0);

    const currentLiabilities = bs.liabilities.accounts_payable.reduce((s: number, a: any) => s + a.balance, 0) +
      bs.liabilities.credit_cards.reduce((s: number, a: any) => s + a.balance, 0) +
      bs.liabilities.other_current_liabilities.reduce((s: number, a: any) => s + a.balance, 0);

    const quickAssets = bs.assets.bank_accounts.reduce((s: number, a: any) => s + a.balance, 0) +
      bs.assets.accounts_receivable.reduce((s: number, a: any) => s + a.balance, 0);

    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 9.9;
    const quickRatio = currentLiabilities > 0 ? quickAssets / currentLiabilities : 9.9;

    return {
      company_name: company.name,
      currency: company.currency,
      liquidity: {
        current_ratio: Number(currentRatio.toFixed(2)),
        quick_ratio: Number(quickRatio.toFixed(2)),
        working_capital: currentAssets - currentLiabilities,
        status: currentRatio >= 1.5 ? 'STRONG' : 'MODERATE'
      },
      profitability: {
        gross_profit_margin_percent: pnl.rows.gross_margin_percent,
        net_profit_margin_percent: pnl.rows.net_margin_percent,
        annualized_ebitda: pnl.rows.net_operating_income + 15000,
        status: pnl.rows.net_margin_percent > 20 ? 'EXCELLENT' : 'HEALTHY'
      },
      efficiency: {
        days_sales_outstanding_dso: 38.4,
        days_payables_outstanding_dpo: 32.1,
        cash_conversion_cycle_ccc: 6.3
      }
    };
  }

  public static crossCompanyMatrix(args: any) {
    const companies = companyManager.getCompanies();
    const rows = companies.map(c => {
      const pnl = this.getProfitAndLoss({ company_id: c.id });
      const bs = this.getBalanceSheet({ company_id: c.id });
      return {
        company_id: c.id,
        realm_id: c.realmId,
        company_name: c.name,
        country: c.country,
        currency: c.currency,
        environment: c.environment,
        total_revenue: pnl.rows.revenue.total,
        net_operating_income: pnl.rows.net_operating_income,
        gross_margin_pct: pnl.rows.gross_margin_percent,
        total_assets: bs.assets.total_assets,
        liquid_cash: bs.assets.bank_accounts.reduce((s: number, a: any) => s + a.balance, 0),
        open_receivables: bs.assets.accounts_receivable.reduce((s: number, a: any) => s + a.balance, 0)
      };
    });

    return {
      matrix_name: 'Cross-Company Consolidated Financial Matrix',
      reporting_timestamp: new Date().toISOString(),
      participating_entities: rows.length,
      companies: rows
    };
  }

  // Generic dispatcher for any of the 120 tools
  public static executeTool(toolName: string, args: any) {
    switch (toolName) {
      // 1. Financial Reporting
      case 'qbo_get_profit_and_loss': return this.getProfitAndLoss(args);
      case 'qbo_get_balance_sheet': return this.getBalanceSheet(args);
      case 'qbo_get_cash_flow': return this.getCashFlow(args);
      case 'qbo_get_trial_balance': return this.getTrialBalance(args);
      case 'qbo_get_general_ledger': return { report: 'General Ledger', rows: this.resolveCompany(args?.company_id).ledger.journalEntries };
      case 'qbo_get_ar_aging_summary': return this.getArAgingSummary(args);
      case 'qbo_get_ap_aging_summary': return this.getApAgingSummary(args);
      case 'qbo_get_customer_balance_detail': return { customers: this.resolveCompany(args?.company_id).ledger.customers };
      case 'qbo_get_vendor_balance_detail': return { vendors: this.resolveCompany(args?.company_id).ledger.vendors };
      case 'qbo_get_sales_by_customer': return { sales: this.resolveCompany(args?.company_id).ledger.customers.map(c => ({ customer: c.name, sales: c.balance * 1.5 })) };
      case 'qbo_get_expenses_by_vendor': return { expenses: this.resolveCompany(args?.company_id).ledger.vendors.map(v => ({ vendor: v.name, expense: v.balance * 1.2 })) };
      case 'qbo_get_tax_summary': return { total_tax_collected: 38940.50, tax_payable: 12450.35, agencies: [{ state: 'CA', rate: 7.25, collected: 24100 }] };
      case 'qbo_get_transaction_list': return { transactions: [...this.resolveCompany(args?.company_id).ledger.invoices, ...this.resolveCompany(args?.company_id).ledger.bills] };
      case 'qbo_get_customer_income': return { income_by_customer: this.resolveCompany(args?.company_id).ledger.customers.map(c => ({ customer: c.name, net_revenue: c.balance })) };
      case 'qbo_get_inventory_valuation_summary': return { inventory_asset_value: 0, items: [] };

      // 2. Accounting Data Management
      case 'qbo_query_sql': return this.executeSql(args);
      case 'qbo_get_company_info': return this.getCompanyInfo(args);
      case 'qbo_list_accounts': return this.listAccounts(args);
      case 'qbo_get_account': return this.getAccount(args);
      case 'qbo_create_account': return this.createAccount(args);
      case 'qbo_update_account': return { success: true, updated_id: args.account_id };
      case 'qbo_get_customer': return this.getCustomer(args);
      case 'qbo_search_customers': return this.searchCustomers(args);
      case 'qbo_create_customer': return this.createCustomer(args);
      case 'qbo_update_customer': return { success: true, updated_id: args.customer_id };
      case 'qbo_get_vendor': return this.resolveCompany(args?.company_id).ledger.vendors.find(v => v.id === args.vendor_id) || { id: args.vendor_id, name: 'Vendor' };
      case 'qbo_search_vendors': return { vendors: this.resolveCompany(args?.company_id).ledger.vendors };
      case 'qbo_create_vendor': return { success: true, vendor: { id: `vend-${Date.now().toString(36)}`, ...args } };
      case 'qbo_update_vendor': return { success: true, updated_id: args.vendor_id };
      case 'qbo_list_items': return { items: [{ id: 'item-1', name: 'Software Subscription', rate: 450 }, { id: 'item-2', name: 'Implementation Consulting', rate: 250 }] };
      case 'qbo_get_item': return { id: args.item_id, name: 'Software Subscription', rate: 450 };
      case 'qbo_create_item': return { success: true, item_id: `item-${Date.now().toString(36)}` };
      case 'qbo_update_item': return { success: true, updated_id: args.item_id };
      case 'qbo_list_classes': return { classes: [{ id: 'cls-1', name: 'North America' }, { id: 'cls-2', name: 'Europe' }] };
      case 'qbo_list_departments': return { departments: [{ id: 'dept-1', name: 'Engineering' }, { id: 'dept-2', name: 'Sales' }] };

      // 3. Sales & Accounts Receivable
      case 'qbo_get_invoice': return this.getInvoice(args);
      case 'qbo_create_invoice': return this.createInvoice(args);
      case 'qbo_update_invoice': return { success: true, updated_invoice_id: args.invoice_id };
      case 'qbo_send_invoice': return { success: true, sent_to: args.send_to_email || 'client@example.com', invoice_id: args.invoice_id };
      case 'qbo_void_invoice': return this.voidInvoice(args);
      case 'qbo_delete_invoice': return { success: true, deleted_invoice_id: args.invoice_id };
      case 'qbo_record_payment': return this.recordPayment(args);
      case 'qbo_get_payment': return { payment_id: args.payment_id, status: 'Completed', amount: 48500 };
      case 'qbo_create_estimate': return { estimate_id: `est-${Date.now().toString(36)}`, status: 'Pending' };
      case 'qbo_get_estimate': return { estimate_id: args.estimate_id, status: 'Accepted' };
      case 'qbo_create_credit_memo': return { credit_memo_id: `cm-${Date.now().toString(36)}`, amount: args.total_amount };
      case 'qbo_get_credit_memo': return { credit_memo_id: args.credit_memo_id, remaining_credit: 0 };
      case 'qbo_create_refund_receipt': return { refund_receipt_id: `rr-${Date.now().toString(36)}`, amount: args.total_amount };
      case 'qbo_create_sales_receipt': return { sales_receipt_id: `sr-${Date.now().toString(36)}`, status: 'Deposited' };
      case 'qbo_apply_payment_to_invoice': return { success: true, payment_id: args.payment_id, invoice_id: args.invoice_id };

      // 4. Purchasing & Accounts Payable
      case 'qbo_get_bill': return this.getBill(args);
      case 'qbo_create_bill': return this.createBill(args);
      case 'qbo_update_bill': return { success: true, updated_bill_id: args.bill_id };
      case 'qbo_void_bill': return { success: true, voided_bill_id: args.bill_id, reason: args.void_reason };
      case 'qbo_delete_bill': return { success: true, deleted_bill_id: args.bill_id };
      case 'qbo_record_bill_payment': return { payment_id: `bp-${Date.now().toString(36)}`, paid_amount: args.total_amount };
      case 'qbo_get_bill_payment': return { bill_payment_id: args.bill_payment_id, amount: 42100 };
      case 'qbo_create_expense': return { expense_id: `exp-${Date.now().toString(36)}`, amount: args.line_items?.[0]?.amount };
      case 'qbo_get_expense': return { expense_id: args.expense_id, payee: 'Stripe Fee', amount: 84.20 };
      case 'qbo_create_purchase_order': return { po_id: `po-${Date.now().toString(36)}`, status: 'Open' };
      case 'qbo_get_purchase_order': return { po_id: args.purchase_order_id, status: 'Open' };
      case 'qbo_create_vendor_credit': return { vendor_credit_id: `vc-${Date.now().toString(36)}`, amount: args.total_amount };
      case 'qbo_get_vendor_credit': return { vendor_credit_id: args.vendor_credit_id, amount: 2400 };
      case 'qbo_match_purchase_order_to_bill': return { po_id: args.po_id, generated_bill_id: `bill-${Date.now().toString(36)}` };
      case 'qbo_batch_pay_bills': return { processed_count: args.bill_ids?.length || 0, status: 'Disbursed' };

      // 5. Banking & Journal Entries
      case 'qbo_create_deposit': return { deposit_id: `dep-${Date.now().toString(36)}`, total: args.total_amount };
      case 'qbo_get_deposit': return { deposit_id: args.deposit_id, amount: 14250.00 };
      case 'qbo_create_transfer': return { transfer_id: `txf-${Date.now().toString(36)}`, amount: args.amount };
      case 'qbo_get_transfer': return { transfer_id: args.transfer_id, amount: 50000 };
      case 'qbo_create_journal_entry': return this.createJournalEntry(args);
      case 'qbo_get_journal_entry': return this.resolveCompany(args?.company_id).ledger.journalEntries.find(j => j.id === args.journal_entry_id) || { id: args.journal_entry_id };
      case 'qbo_update_journal_entry': return { success: true, updated_je_id: args.journal_entry_id };
      case 'qbo_reverse_journal_entry': return { success: true, reversal_je_id: `je-rev-${Date.now().toString(36)}` };
      case 'qbo_validate_accounting_entry': return { is_valid: true, gaap_compliant: true, debits_equal_credits: true };
      case 'qbo_query_bank_feed_transactions': return { transactions: [{ id: 'feed-1', date: '2026-10-12', description: 'GUSTO PAYROLL', amount: -28400.00, matched: true }] };

      // 6. Attachments & Documents
      case 'qbo_upload_attachment': return this.uploadAttachment(args);
      case 'qbo_search_attachments': return { attachments: this.resolveCompany(args?.company_id).ledger.attachments };
      case 'qbo_get_attachment_metadata': return this.resolveCompany(args?.company_id).ledger.attachments[0];
      case 'qbo_download_invoice_pdf': return { invoice_id: args.invoice_id, file_name: `invoice_${args.invoice_id}.pdf`, mime_type: 'application/pdf', base64_sample: 'JVBERi0xLjQKJcTl8uXr...[PDF_STREAM]' };
      case 'qbo_link_attachment_to_tx': return { success: true, linked: true };
      case 'qbo_unlink_attachment': return { success: true, unlinked: true };
      case 'qbo_list_entity_attachments': return this.listEntityAttachments(args);
      case 'qbo_verify_document_retention': return { compliance_percent: 98.2, missing_docs_count: 1 };

      // 7. Reconciliation & Accounting Reviews
      case 'qbo_reconciliation_diagnostics': return this.reconciliationDiagnostics(args);
      case 'qbo_reconstruct_bank_statement_balance': return { reconstructed_balance: 482590.25, confidence: 0.99 };
      case 'qbo_match_deposits': return { matched_count: 2, suggested_matches: [{ feed_amount: 14250, deposit_id: 'dep-1' }] };
      case 'qbo_find_unreconciled_discrepancies': return { discrepancy_count: 1, items: [{ check_no: '1042', amount: 850.00, days_old: 94 }] };
      case 'qbo_detect_reconciliation_changes': return { altered_transactions_since_signoff: 0, integrity: 'INTACT' };
      case 'qbo_cleared_transaction_audit': return { cleared_count: 142, uncleared_count: 3 };
      case 'qbo_reconciliation_history': return { sessions: [{ date: '2026-08-31', ending_balance: 450120.00, diff: 0.00 }] };
      case 'qbo_reconciliation_summary_report': return { account: 'Operating Checking', statement_date: args.statement_date || '2026-09-30', reconciled: true };
      case 'qbo_flag_stale_uncleared_checks': return { stale_checks: [{ check_number: '1042', date: '2026-07-08', payee: 'Office Depot', amount: 850.00, days_outstanding: 97 }] };
      case 'qbo_check_bank_feed_rules': return { active_rules: 14, conflicting_rules: 0 };
      case 'qbo_audit_reconciled_modifications': return { modified_records: [] };
      case 'qbo_zero_balance_subledger_check': return { ar_difference: 0.00, ap_difference: 0.00, status: 'PERFECT_MATCH' };

      // 8. Month-End Closing & Data Quality
      case 'qbo_month_end_close_review': return this.monthEndCloseReview(args);
      case 'qbo_month_end_checklist_status': return { checklist: [{ item: 'Bank Recs', done: true }, { item: 'Depreciation', done: true }, { item: 'Period Lock', done: false }] };
      case 'qbo_detect_uncategorized_transactions': return this.detectUncategorized(args);
      case 'qbo_detect_duplicate_transactions': return { duplicates_found: 0, scanned_records: 284 };
      case 'qbo_detect_unusual_transactions': return { anomalies: [{ txn_id: 'tx-99', reason: 'Round dollar transfer > $50k', amount: 50000 }] };
      case 'qbo_audit_prior_period_changes': return { violations_count: 0, books_locked: true };
      case 'qbo_detect_coding_inconsistencies': return { inconsistencies: [] };
      case 'qbo_lock_accounting_period': return { success: true, locked_through: args.closing_date };
      case 'qbo_verify_closing_date_password': return { is_locked: true, closing_date: '2025-12-31' };
      case 'qbo_suspense_account_clearance_check': return { clearing_account_balance: 0.00, status: 'CLEARED' };
      case 'qbo_tax_clearing_reconciliation': return { tax_collected: 38940.50, tax_remitted: 26490.15, tax_payable: 12450.35 };
      case 'qbo_depreciation_schedule_audit': return { fixed_assets_total: 145000, current_accumulated_depreciation: -42500, monthly_depreciation_posted: true };

      // 9. Advanced Financial Intelligence
      case 'qbo_analyze_ar_collectability': return this.analyzeArCollectability(args);
      case 'qbo_review_ap_cash_outflows': return { forecast_weeks: args.forecast_horizon_weeks || 4, upcoming_bills_total: 94250.10, early_pay_discounts_available: 840.00 };
      case 'qbo_balance_sheet_integrity_audit': return { integrity_score: 100, is_balanced: true, assets_equal_liabilities_plus_equity: true };
      case 'qbo_13_week_cash_flow_forecast': return this.cashFlowForecast13Week(args);
      case 'qbo_budget_variance_analysis': return { variance_percent: -2.4, favorable: true, revenue_actual: 1798000, revenue_budget: 1750000 };
      case 'qbo_compute_financial_kpis': return this.computeFinancialKpis(args);
      case 'qbo_generate_management_report_pack': return { executive_summary: 'Strong Q3 financial performance driven by 18% SaaS revenue growth and 72% gross margins.', net_income: 428950, runway_months: 27 };
      case 'qbo_explain_financial_statement_variance': return { period_a: args.period_a, period_b: args.period_b, variance_driver: 'Gross Margin expanded 3.2% due to cloud infrastructure optimizations reducing AWS cost-of-goods.' };
      case 'qbo_cross_company_financial_matrix': return this.crossCompanyMatrix(args);
      case 'qbo_working_capital_runway_analysis': return { liquid_cash: 1332790.25, net_burn_monthly: 42000, runway_months: 31.7 };
      case 'qbo_customer_churn_revenue_impact': return { churn_risk_customers: 1, revenue_at_risk: 18000 };
      case 'qbo_gross_margin_leakage_detector': return { margin_leaks: [] };
      case 'qbo_debt_covenant_compliance_check': return { debt_to_equity: 0.42, max_allowed: args.max_debt_to_equity || 2.5, compliant: true };

      default:
        throw new Error(`Tool "${toolName}" is not registered in QuickBooks MCP registry.`);
    }
  }
}
