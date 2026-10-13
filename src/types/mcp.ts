export interface QboCompany {
  id: string;
  realmId: string;
  name: string;
  legalName: string;
  country: string;
  currency: string;
  environment: 'sandbox' | 'production';
  status: 'connected' | 'token_expired' | 'disconnected';
  role: 'financial_admin' | 'read_write' | 'read_only';
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  lastSyncAt: string;
  fiscalYearStartMonth: string;
}

export type ToolCategory =
  | 'Financial Reporting'
  | 'Accounting Data Management'
  | 'Sales & Accounts Receivable'
  | 'Purchasing & Accounts Payable'
  | 'Banking & Journal Entries'
  | 'Attachments & Documents'
  | 'Reconciliation & Accounting Reviews'
  | 'Month-End Closing & Data Quality'
  | 'Advanced Financial Intelligence';

export interface McpToolDefinition {
  name: string;
  description: string;
  category: ToolCategory;
  isDestructive?: boolean;
  requiresAdmin?: boolean;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  toolName: string;
  category: string;
  companyId: string;
  companyName: string;
  actor: string;
  status: 'success' | 'failure' | 'blocked_by_safety';
  durationMs: number;
  inputPayload: any;
  summary: string;
  isDestructive: boolean;
}

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: string | number | null;
  method: string;
  params?: any;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}
