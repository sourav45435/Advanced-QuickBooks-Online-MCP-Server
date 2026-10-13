import { McpToolDefinition, ToolCategory } from '../types/mcp.js';

export const ALL_MCP_TOOLS: McpToolDefinition[] = [
  // ==========================================
  // 1. FINANCIAL REPORTING (15 Tools)
  // ==========================================
  {
    name: 'qbo_get_profit_and_loss',
    description: 'Generates Profit and Loss (Income Statement) report for specified date range, accounting method, and optional class/department filtering.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID (realmId). Defaults to active company.' },
        start_date: { type: 'string', description: 'Start date in YYYY-MM-DD format (e.g., 2026-01-01)' },
        end_date: { type: 'string', description: 'End date in YYYY-MM-DD format (e.g., 2026-12-31)' },
        accounting_method: { type: 'string', enum: ['Accrual', 'Cash'], description: 'Accounting method (Accrual or Cash)' },
        summarize_by: { type: 'string', enum: ['Total', 'Month', 'Quarter', 'Class', 'Department'], description: 'Columns segmentation' }
      }
    }
  },
  {
    name: 'qbo_get_balance_sheet',
    description: 'Generates Balance Sheet report showing Assets, Liabilities, and Equity as of specified date.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID (realmId)' },
        as_of_date: { type: 'string', description: 'Balance sheet cutoff date (YYYY-MM-DD)' },
        accounting_method: { type: 'string', enum: ['Accrual', 'Cash'] },
        comparison_period: { type: 'string', enum: ['None', 'PreviousPeriod', 'PreviousYear'], description: 'Compare with prior period' }
      }
    }
  },
  {
    name: 'qbo_get_cash_flow',
    description: 'Generates Statement of Cash Flows broken down into Operating, Investing, and Financing activities.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' }
      }
    }
  },
  {
    name: 'qbo_get_trial_balance',
    description: 'Retrieves full Trial Balance report showing debit and credit balances for every account in the Chart of Accounts.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string', description: 'Cutoff date (YYYY-MM-DD)' },
        accounting_method: { type: 'string', enum: ['Accrual', 'Cash'] }
      }
    }
  },
  {
    name: 'qbo_get_general_ledger',
    description: 'Extracts detailed General Ledger transaction report for specified accounts and date intervals.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Optional specific Account ID' },
        start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' }
      }
    }
  },
  {
    name: 'qbo_get_ar_aging_summary',
    description: 'Generates Accounts Receivable (A/R) Aging Summary report grouped into Current, 1-30, 31-60, 61-90, and 91+ days past due.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string', description: 'Report date (YYYY-MM-DD)' },
        aging_method: { type: 'string', enum: ['Current', 'ReportDate'] }
      }
    }
  },
  {
    name: 'qbo_get_ap_aging_summary',
    description: 'Generates Accounts Payable (A/P) Aging Summary report categorizing vendor bills by aging buckets.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string', description: 'Report date (YYYY-MM-DD)' }
      }
    }
  },
  {
    name: 'qbo_get_customer_balance_detail',
    description: 'Retrieves detailed open balance and invoice breakdown for all customers or a specific customer.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Optional specific Customer ID' }
      }
    }
  },
  {
    name: 'qbo_get_vendor_balance_detail',
    description: 'Retrieves detailed open balance and unpaid bill breakdown for all vendors or a specific vendor.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_id: { type: 'string', description: 'Optional specific Vendor ID' }
      }
    }
  },
  {
    name: 'qbo_get_sales_by_customer',
    description: 'Retrieves Sales by Customer summary report calculating total volume, percentage of sales, and average ticket.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' }
      }
    }
  },
  {
    name: 'qbo_get_expenses_by_vendor',
    description: 'Retrieves Expenses by Vendor summary report identifying top expenditure partners.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' }
      }
    }
  },
  {
    name: 'qbo_get_tax_summary',
    description: 'Retrieves Sales Tax liability summary report by tax agency, taxable sales, and tax payable.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' }
      }
    }
  },
  {
    name: 'qbo_get_transaction_list',
    description: 'Retrieves transaction register report filtered by date, transaction type, or account.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        transaction_type: { type: 'string', description: 'e.g., Invoice, Bill, Payment, JournalEntry' },
        start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' }
      }
    }
  },
  {
    name: 'qbo_get_customer_income',
    description: 'Retrieves Income by Customer report showing gross revenue minus discounts and returns.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' }
      }
    }
  },
  {
    name: 'qbo_get_inventory_valuation_summary',
    description: 'Retrieves Inventory Valuation Summary report with quantity on hand, asset value, and average cost.',
    category: 'Financial Reporting',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string', description: 'Valuation date (YYYY-MM-DD)' }
      }
    }
  },

  // ==========================================
  // 2. ACCOUNTING DATA MANAGEMENT (20 Tools)
  // ==========================================
  {
    name: 'qbo_query_sql',
    description: 'Executes a raw Intuit QBO SQL query (e.g. "SELECT * FROM Customer WHERE Active = true MAXRESULTS 20").',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        query: { type: 'string', description: 'Valid QuickBooks SQL SELECT query' }
      },
      required: ['query']
    }
  },
  {
    name: 'qbo_get_company_info',
    description: 'Retrieves QuickBooks Online company metadata, legal name, tax year, base currency, and company address.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' }
      }
    }
  },
  {
    name: 'qbo_list_accounts',
    description: 'Lists all accounts in Chart of Accounts with account type, classification, current balance, and currency.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_type: { type: 'string', description: 'Filter by type: Bank, Expense, Income, Accounts Receivable, etc.' },
        active_only: { type: 'boolean', description: 'Return only active accounts. Defaults to true.' }
      }
    }
  },
  {
    name: 'qbo_get_account',
    description: 'Retrieves specific Account details by Account ID including sub-accounts and current balance.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Account ID' }
      },
      required: ['account_id']
    }
  },
  {
    name: 'qbo_create_account',
    description: 'Creates a new account in the Chart of Accounts.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        name: { type: 'string', description: 'Account Name' },
        account_type: { type: 'string', description: 'e.g. Bank, Accounts Receivable, Other Current Asset, Expense, Income' },
        account_sub_type: { type: 'string', description: 'Sub type e.g. Checking, Savings, AdvertisingPromotional' },
        description: { type: 'string', description: 'Account description' },
        currency: { type: 'string', description: '3-letter currency code (e.g. USD)' }
      },
      required: ['name', 'account_type']
    }
  },
  {
    name: 'qbo_update_account',
    description: 'Updates an existing account name, classification, or description in the Chart of Accounts.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Account ID' },
        sync_token: { type: 'string', description: 'Sync token for optimistic concurrency' },
        name: { type: 'string', description: 'New account name' },
        description: { type: 'string', description: 'New description' },
        active: { type: 'boolean', description: 'Active status' }
      },
      required: ['account_id']
    }
  },
  {
    name: 'qbo_get_customer',
    description: 'Retrieves customer record by Customer ID including billing address, email, phone, and open balance.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Customer ID' }
      },
      required: ['customer_id']
    }
  },
  {
    name: 'qbo_search_customers',
    description: 'Searches for customers by display name, email, company name, or tax identifier.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        search_term: { type: 'string', description: 'Search term or partial name' },
        limit: { type: 'number', description: 'Max records (default 20)' }
      },
      required: ['search_term']
    }
  },
  {
    name: 'qbo_create_customer',
    description: 'Creates a new Customer record in QuickBooks Online.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        display_name: { type: 'string', description: 'Customer Display Name' },
        company_name: { type: 'string', description: 'Company Name' },
        email: { type: 'string', description: 'Primary email address' },
        phone: { type: 'string', description: 'Phone number' },
        billing_address: {
          type: 'object',
          properties: {
            line1: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postal_code: { type: 'string' },
            country: { type: 'string' }
          }
        }
      },
      required: ['display_name']
    }
  },
  {
    name: 'qbo_update_customer',
    description: 'Updates an existing Customer record.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Customer ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        display_name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' }
      },
      required: ['customer_id']
    }
  },
  {
    name: 'qbo_get_vendor',
    description: 'Retrieves vendor record by Vendor ID including contact details, tax ID (1099 eligible), and open balance.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_id: { type: 'string', description: 'Vendor ID' }
      },
      required: ['vendor_id']
    }
  },
  {
    name: 'qbo_search_vendors',
    description: 'Searches for vendors by display name, company name, or tax ID.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        search_term: { type: 'string', description: 'Search term or partial name' }
      },
      required: ['search_term']
    }
  },
  {
    name: 'qbo_create_vendor',
    description: 'Creates a new Vendor record in QuickBooks Online.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        display_name: { type: 'string', description: 'Vendor display name' },
        company_name: { type: 'string', description: 'Vendor company name' },
        email: { type: 'string', description: 'Vendor email' },
        phone: { type: 'string', description: 'Vendor phone' },
        is_1099: { type: 'boolean', description: 'Track payments for 1099' }
      },
      required: ['display_name']
    }
  },
  {
    name: 'qbo_update_vendor',
    description: 'Updates an existing Vendor record.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_id: { type: 'string', description: 'Vendor ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        display_name: { type: 'string' },
        email: { type: 'string' },
        is_1099: { type: 'boolean' }
      },
      required: ['vendor_id']
    }
  },
  {
    name: 'qbo_list_items',
    description: 'Lists all Products and Services (Items) including unit price, income account, and expense account.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        type: { type: 'string', enum: ['Service', 'Inventory', 'NonInventory'] }
      }
    }
  },
  {
    name: 'qbo_get_item',
    description: 'Retrieves item details for product or service by Item ID.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        item_id: { type: 'string', description: 'Item ID' }
      },
      required: ['item_id']
    }
  },
  {
    name: 'qbo_create_item',
    description: 'Creates a new Product or Service item in QuickBooks Online.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        name: { type: 'string', description: 'Item name' },
        type: { type: 'string', enum: ['Service', 'Inventory', 'NonInventory'] },
        unit_price: { type: 'number', description: 'Selling price' },
        income_account_id: { type: 'string', description: 'Income account reference' },
        expense_account_id: { type: 'string', description: 'Expense account reference' }
      },
      required: ['name', 'type', 'income_account_id']
    }
  },
  {
    name: 'qbo_update_item',
    description: 'Updates an existing Product or Service item details and pricing.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        item_id: { type: 'string', description: 'Item ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        unit_price: { type: 'number' },
        name: { type: 'string' }
      },
      required: ['item_id']
    }
  },
  {
    name: 'qbo_list_classes',
    description: 'Lists all Classes defined for multidimensional reporting.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' }
      }
    }
  },
  {
    name: 'qbo_list_departments',
    description: 'Lists all Departments/Locations configured in QuickBooks.',
    category: 'Accounting Data Management',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' }
      }
    }
  },

  // ==========================================
  // 3. SALES & ACCOUNTS RECEIVABLE (15 Tools)
  // ==========================================
  {
    name: 'qbo_get_invoice',
    description: 'Retrieves Invoice details by Invoice ID including line items, tax, discounts, balance, and customer info.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        invoice_id: { type: 'string', description: 'Invoice ID' }
      },
      required: ['invoice_id']
    }
  },
  {
    name: 'qbo_create_invoice',
    description: 'Creates a new Customer Invoice with line items, quantities, rates, terms, and due date.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Customer ID' },
        txn_date: { type: 'string', description: 'Invoice date (YYYY-MM-DD)' },
        due_date: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
        line_items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              item_id: { type: 'string' },
              description: { type: 'string' },
              quantity: { type: 'number' },
              unit_price: { type: 'number' },
              amount: { type: 'number' }
            },
            required: ['amount']
          }
        },
        customer_memo: { type: 'string', description: 'Customer note displayed on invoice' }
      },
      required: ['customer_id', 'line_items']
    }
  },
  {
    name: 'qbo_update_invoice',
    description: 'Updates an existing Invoice (line items, terms, memo).',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        invoice_id: { type: 'string', description: 'Invoice ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        customer_memo: { type: 'string' },
        due_date: { type: 'string' }
      },
      required: ['invoice_id']
    }
  },
  {
    name: 'qbo_send_invoice',
    description: 'Triggers QuickBooks to email the invoice PDF to the customer billing email address.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        invoice_id: { type: 'string', description: 'Invoice ID' },
        send_to_email: { type: 'string', description: 'Optional override email address' }
      },
      required: ['invoice_id']
    }
  },
  {
    name: 'qbo_void_invoice',
    description: 'Voids an invoice in QuickBooks Online, reducing amounts to 0 while maintaining the invoice number for audit trail.',
    category: 'Sales & Accounts Receivable',
    isDestructive: true,
    requiresAdmin: true,
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        invoice_id: { type: 'string', description: 'Invoice ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        void_reason: { type: 'string', description: 'Mandatory reason for voiding' }
      },
      required: ['invoice_id', 'void_reason']
    }
  },
  {
    name: 'qbo_delete_invoice',
    description: 'Deletes an invoice permanently from QuickBooks. Requires explicit administrative authorization.',
    category: 'Sales & Accounts Receivable',
    isDestructive: true,
    requiresAdmin: true,
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        invoice_id: { type: 'string', description: 'Invoice ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        confirm_deletion: { type: 'boolean', description: 'Explicit safety confirmation' }
      },
      required: ['invoice_id', 'confirm_deletion']
    }
  },
  {
    name: 'qbo_record_payment',
    description: 'Records a customer payment and applies it against one or more open invoices.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Customer ID' },
        total_amount: { type: 'number', description: 'Payment amount received' },
        payment_method: { type: 'string', enum: ['Check', 'CreditCard', 'Cash', 'ACH', 'Wire'] },
        deposit_to_account_id: { type: 'string', description: 'Bank account or Undeposited Funds' },
        applied_invoices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              invoice_id: { type: 'string' },
              amount: { type: 'number' }
            },
            required: ['invoice_id', 'amount']
          }
        }
      },
      required: ['customer_id', 'total_amount']
    }
  },
  {
    name: 'qbo_get_payment',
    description: 'Retrieves payment record details and list of invoices it was applied to.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        payment_id: { type: 'string', description: 'Payment ID' }
      },
      required: ['payment_id']
    }
  },
  {
    name: 'qbo_create_estimate',
    description: 'Creates a sales estimate / quote for a customer.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Customer ID' },
        expiration_date: { type: 'string', description: 'Estimate expiration (YYYY-MM-DD)' },
        line_items: { type: 'array', items: { type: 'object' } }
      },
      required: ['customer_id', 'line_items']
    }
  },
  {
    name: 'qbo_get_estimate',
    description: 'Retrieves estimate details and its status (Accepted, Closed, Pending).',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        estimate_id: { type: 'string', description: 'Estimate ID' }
      },
      required: ['estimate_id']
    }
  },
  {
    name: 'qbo_create_credit_memo',
    description: 'Creates a credit memo to issue store credit or offset customer balance.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Customer ID' },
        total_amount: { type: 'number', description: 'Credit amount' },
        reason: { type: 'string', description: 'Reason for credit memo' }
      },
      required: ['customer_id', 'total_amount']
    }
  },
  {
    name: 'qbo_get_credit_memo',
    description: 'Retrieves credit memo details and remaining unapplied balance.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        credit_memo_id: { type: 'string', description: 'Credit Memo ID' }
      },
      required: ['credit_memo_id']
    }
  },
  {
    name: 'qbo_create_refund_receipt',
    description: 'Creates a refund receipt recording a cash/card refund issued directly to a customer.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Customer ID' },
        payment_method: { type: 'string' },
        refund_from_account_id: { type: 'string', description: 'Bank account funds returned from' },
        total_amount: { type: 'number' }
      },
      required: ['customer_id', 'total_amount', 'refund_from_account_id']
    }
  },
  {
    name: 'qbo_create_sales_receipt',
    description: 'Creates a point-of-sale sales receipt for immediate customer payment.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        customer_id: { type: 'string', description: 'Customer ID' },
        deposit_to_account_id: { type: 'string', description: 'Bank account' },
        line_items: { type: 'array', items: { type: 'object' } }
      },
      required: ['customer_id', 'deposit_to_account_id', 'line_items']
    }
  },
  {
    name: 'qbo_apply_payment_to_invoice',
    description: 'Links an unapplied payment or credit balance to an open invoice.',
    category: 'Sales & Accounts Receivable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        payment_id: { type: 'string', description: 'Existing Payment ID' },
        invoice_id: { type: 'string', description: 'Invoice ID' },
        amount: { type: 'number', description: 'Amount to link' }
      },
      required: ['payment_id', 'invoice_id', 'amount']
    }
  },

  // ==========================================
  // 4. PURCHASING & ACCOUNTS PAYABLE (15 Tools)
  // ==========================================
  {
    name: 'qbo_get_bill',
    description: 'Retrieves Bill details from a vendor including expense categorizations and line items.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        bill_id: { type: 'string', description: 'Bill ID' }
      },
      required: ['bill_id']
    }
  },
  {
    name: 'qbo_create_bill',
    description: 'Creates a new vendor Bill with expense account lines, items, terms, and due date.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_id: { type: 'string', description: 'Vendor ID' },
        txn_date: { type: 'string', description: 'Bill date (YYYY-MM-DD)' },
        due_date: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
        line_items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              account_id: { type: 'string', description: 'Expense account' },
              description: { type: 'string' },
              amount: { type: 'number' }
            },
            required: ['account_id', 'amount']
          }
        }
      },
      required: ['vendor_id', 'line_items']
    }
  },
  {
    name: 'qbo_update_bill',
    description: 'Updates an existing vendor Bill.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        bill_id: { type: 'string', description: 'Bill ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        due_date: { type: 'string' }
      },
      required: ['bill_id']
    }
  },
  {
    name: 'qbo_void_bill',
    description: 'Voids an unpaid vendor Bill.',
    category: 'Purchasing & Accounts Payable',
    isDestructive: true,
    requiresAdmin: true,
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        bill_id: { type: 'string', description: 'Bill ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        void_reason: { type: 'string', description: 'Reason for voiding' }
      },
      required: ['bill_id', 'void_reason']
    }
  },
  {
    name: 'qbo_delete_bill',
    description: 'Permanently deletes a vendor Bill. Requires explicit confirmation.',
    category: 'Purchasing & Accounts Payable',
    isDestructive: true,
    requiresAdmin: true,
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        bill_id: { type: 'string', description: 'Bill ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        confirm_deletion: { type: 'boolean' }
      },
      required: ['bill_id', 'confirm_deletion']
    }
  },
  {
    name: 'qbo_record_bill_payment',
    description: 'Records payment of vendor bills via check, ACH, or credit card.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_id: { type: 'string', description: 'Vendor ID' },
        bank_account_id: { type: 'string', description: 'Disbursement bank account' },
        payment_type: { type: 'string', enum: ['Check', 'CreditCard', 'Cash', 'ACH'] },
        total_amount: { type: 'number' },
        applied_bills: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              bill_id: { type: 'string' },
              amount: { type: 'number' }
            },
            required: ['bill_id', 'amount']
          }
        }
      },
      required: ['vendor_id', 'bank_account_id', 'total_amount']
    }
  },
  {
    name: 'qbo_get_bill_payment',
    description: 'Retrieves bill payment record and the list of cleared bills.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        bill_payment_id: { type: 'string', description: 'Bill Payment ID' }
      },
      required: ['bill_payment_id']
    }
  },
  {
    name: 'qbo_create_expense',
    description: 'Creates a direct expense/purchase transaction (card or cash purchase not requiring a bill).',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        payment_account_id: { type: 'string', description: 'Credit card or Bank account ID' },
        payment_type: { type: 'string', enum: ['Cash', 'Check', 'CreditCard'] },
        entity_ref: { type: 'string', description: 'Vendor or Payee ID' },
        txn_date: { type: 'string', description: 'Expense date (YYYY-MM-DD)' },
        line_items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              account_id: { type: 'string' },
              amount: { type: 'number' },
              description: { type: 'string' }
            },
            required: ['account_id', 'amount']
          }
        }
      },
      required: ['payment_account_id', 'line_items']
    }
  },
  {
    name: 'qbo_get_expense',
    description: 'Retrieves direct expense transaction details by Expense ID.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        expense_id: { type: 'string', description: 'Expense ID' }
      },
      required: ['expense_id']
    }
  },
  {
    name: 'qbo_create_purchase_order',
    description: 'Creates a Purchase Order (PO) issued to a vendor.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_id: { type: 'string', description: 'Vendor ID' },
        line_items: { type: 'array', items: { type: 'object' } },
        expected_date: { type: 'string', description: 'Expected delivery date (YYYY-MM-DD)' }
      },
      required: ['vendor_id', 'line_items']
    }
  },
  {
    name: 'qbo_get_purchase_order',
    description: 'Retrieves purchase order status and linked items.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        purchase_order_id: { type: 'string', description: 'PO ID' }
      },
      required: ['purchase_order_id']
    }
  },
  {
    name: 'qbo_create_vendor_credit',
    description: 'Creates a Vendor Credit memo from a vendor for returns or rebates.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_id: { type: 'string', description: 'Vendor ID' },
        total_amount: { type: 'number' },
        account_id: { type: 'string', description: 'Expense or inventory account offset' }
      },
      required: ['vendor_id', 'total_amount', 'account_id']
    }
  },
  {
    name: 'qbo_get_vendor_credit',
    description: 'Retrieves vendor credit details and unapplied credit amount.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_credit_id: { type: 'string', description: 'Vendor Credit ID' }
      },
      required: ['vendor_credit_id']
    }
  },
  {
    name: 'qbo_match_purchase_order_to_bill',
    description: 'Copies items from an open Purchase Order directly into a new Vendor Bill.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        po_id: { type: 'string', description: 'Purchase Order ID' },
        bill_date: { type: 'string', description: 'Bill date (YYYY-MM-DD)' }
      },
      required: ['po_id']
    }
  },
  {
    name: 'qbo_batch_pay_bills',
    description: 'Executes a batch payment for multiple vendor bills in a single operation.',
    category: 'Purchasing & Accounts Payable',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        bank_account_id: { type: 'string', description: 'Funding bank account' },
        bill_ids: { type: 'array', items: { type: 'string' } }
      },
      required: ['bank_account_id', 'bill_ids']
    }
  },

  // ==========================================
  // 5. BANKING & JOURNAL ENTRIES (10 Tools)
  // ==========================================
  {
    name: 'qbo_create_deposit',
    description: 'Creates a bank deposit, bundling payments from Undeposited Funds into a bank account.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        bank_account_id: { type: 'string', description: 'Destination bank account' },
        txn_date: { type: 'string', description: 'Deposit date (YYYY-MM-DD)' },
        payment_ids: { type: 'array', items: { type: 'string' }, description: 'IDs of customer payments bundled' },
        total_amount: { type: 'number' }
      },
      required: ['bank_account_id', 'total_amount']
    }
  },
  {
    name: 'qbo_get_deposit',
    description: 'Retrieves deposit record details and lines included in deposit.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        deposit_id: { type: 'string', description: 'Deposit ID' }
      },
      required: ['deposit_id']
    }
  },
  {
    name: 'qbo_create_transfer',
    description: 'Creates a funds transfer between two balance sheet accounts (e.g., Checking to Savings).',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        from_account_id: { type: 'string', description: 'Source account ID' },
        to_account_id: { type: 'string', description: 'Target account ID' },
        amount: { type: 'number', description: 'Transfer amount' },
        txn_date: { type: 'string', description: 'Transfer date (YYYY-MM-DD)' }
      },
      required: ['from_account_id', 'to_account_id', 'amount']
    }
  },
  {
    name: 'qbo_get_transfer',
    description: 'Retrieves transfer details by Transfer ID.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        transfer_id: { type: 'string', description: 'Transfer ID' }
      },
      required: ['transfer_id']
    }
  },
  {
    name: 'qbo_create_journal_entry',
    description: 'Creates a double-entry Journal Entry with validated debits equal to credits.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        txn_date: { type: 'string', description: 'Date (YYYY-MM-DD)' },
        memo: { type: 'string', description: 'Journal entry explanation' },
        lines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              account_id: { type: 'string' },
              posting_type: { type: 'string', enum: ['Debit', 'Credit'] },
              amount: { type: 'number' },
              description: { type: 'string' },
              entity_id: { type: 'string', description: 'Required for A/R or A/P accounts' }
            },
            required: ['account_id', 'posting_type', 'amount']
          }
        }
      },
      required: ['lines']
    }
  },
  {
    name: 'qbo_get_journal_entry',
    description: 'Retrieves journal entry details, line entries, and debit/credit breakdown.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        journal_entry_id: { type: 'string', description: 'Journal Entry ID' }
      },
      required: ['journal_entry_id']
    }
  },
  {
    name: 'qbo_update_journal_entry',
    description: 'Updates an existing Journal Entry, enforcing balanced debits and credits.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        journal_entry_id: { type: 'string', description: 'Journal Entry ID' },
        sync_token: { type: 'string', description: 'Sync token' },
        memo: { type: 'string' },
        lines: { type: 'array', items: { type: 'object' } }
      },
      required: ['journal_entry_id', 'lines']
    }
  },
  {
    name: 'qbo_reverse_journal_entry',
    description: 'Creates an automatic reversing journal entry on the first day of next period.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        journal_entry_id: { type: 'string', description: 'Source Journal Entry ID' },
        reversal_date: { type: 'string', description: 'Reversal date (YYYY-MM-DD)' }
      },
      required: ['journal_entry_id']
    }
  },
  {
    name: 'qbo_validate_accounting_entry',
    description: 'Validates a planned accounting entry against GAAP rules, account classification, and currency before posting.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        entry_type: { type: 'string', enum: ['JournalEntry', 'Invoice', 'Bill', 'Transfer'] },
        lines: { type: 'array', items: { type: 'object' } }
      },
      required: ['entry_type', 'lines']
    }
  },
  {
    name: 'qbo_query_bank_feed_transactions',
    description: 'Queries unreviewed transactions from connected bank feeds awaiting categorization.',
    category: 'Banking & Journal Entries',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Bank account ID' },
        status: { type: 'string', enum: ['Unreviewed', 'Recognized', 'Matched'] }
      }
    }
  },

  // ==========================================
  // 6. ATTACHMENTS & DOCUMENTS (8 Tools)
  // ==========================================
  {
    name: 'qbo_upload_attachment',
    description: 'Uploads a document or receipt attachment (PDF/image) and optionally links to a transaction or customer.',
    category: 'Attachments & Documents',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        file_name: { type: 'string', description: 'File name (e.g. invoice_receipt.pdf)' },
        content_base64: { type: 'string', description: 'Base64-encoded document data' },
        content_type: { type: 'string', description: 'MIME type e.g. application/pdf, image/png' },
        attachable_to: {
          type: 'object',
          properties: {
            entity_type: { type: 'string', description: 'Invoice, Bill, Customer, etc.' },
            entity_id: { type: 'string' }
          }
        }
      },
      required: ['file_name', 'content_base64', 'content_type']
    }
  },
  {
    name: 'qbo_search_attachments',
    description: 'Searches all attachments by filename, linked entity, or date range.',
    category: 'Attachments & Documents',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        file_name_contains: { type: 'string' },
        entity_type: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_get_attachment_metadata',
    description: 'Retrieves metadata, size, upload timestamp, and links for an Attachable ID.',
    category: 'Attachments & Documents',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        attachable_id: { type: 'string', description: 'Attachable record ID' }
      },
      required: ['attachable_id']
    }
  },
  {
    name: 'qbo_download_invoice_pdf',
    description: 'Retrieves the official generated PDF of a customer invoice as a base64 encoded stream.',
    category: 'Attachments & Documents',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        invoice_id: { type: 'string', description: 'Invoice ID' }
      },
      required: ['invoice_id']
    }
  },
  {
    name: 'qbo_link_attachment_to_tx',
    description: 'Links an existing uploaded document attachment to a transaction (e.g. attaching bill image to Bill #104).',
    category: 'Attachments & Documents',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        attachable_id: { type: 'string', description: 'Attachment ID' },
        entity_type: { type: 'string', description: 'e.g. Bill, Invoice, Expense' },
        entity_id: { type: 'string', description: 'Entity ID' }
      },
      required: ['attachable_id', 'entity_type', 'entity_id']
    }
  },
  {
    name: 'qbo_unlink_attachment',
    description: 'Unlinks an attachment from a transaction. Destructive action.',
    category: 'Attachments & Documents',
    isDestructive: true,
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        attachable_id: { type: 'string', description: 'Attachment ID' },
        entity_type: { type: 'string' },
        entity_id: { type: 'string' }
      },
      required: ['attachable_id', 'entity_type', 'entity_id']
    }
  },
  {
    name: 'qbo_list_entity_attachments',
    description: 'Lists all attachments connected to a specific customer, vendor, bill, or invoice.',
    category: 'Attachments & Documents',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        entity_type: { type: 'string', description: 'Customer, Vendor, Invoice, Bill' },
        entity_id: { type: 'string' }
      },
      required: ['entity_type', 'entity_id']
    }
  },
  {
    name: 'qbo_verify_document_retention',
    description: 'Scans accounting records to ensure bills and expenses exceeding threshold have supporting documentation attached.',
    category: 'Attachments & Documents',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        threshold_amount: { type: 'number', description: 'Dollar threshold (e.g. 75.00)' },
        date_from: { type: 'string', description: 'Start date (YYYY-MM-DD)' }
      }
    }
  },

  // ==========================================
  // 7. RECONCILIATION & ACCOUNTING REVIEWS (12 Tools)
  // ==========================================
  {
    name: 'qbo_reconciliation_diagnostics',
    description: 'Runs diagnostic check comparing QBO register balance, statement ending balance, and uncleared checks/deposits.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Bank or Credit Card account ID' },
        statement_ending_date: { type: 'string', description: 'Statement cutoff date (YYYY-MM-DD)' },
        statement_ending_balance: { type: 'number', description: 'Target bank statement ending balance' }
      },
      required: ['account_id', 'statement_ending_date', 'statement_ending_balance']
    }
  },
  {
    name: 'qbo_reconstruct_bank_statement_balance',
    description: 'Reconstructs expected bank statement balance based on cleared transactions up to specified statement cutoff.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Bank account ID' },
        as_of_date: { type: 'string', description: 'Statement cutoff date (YYYY-MM-DD)' }
      },
      required: ['account_id', 'as_of_date']
    }
  },
  {
    name: 'qbo_match_deposits',
    description: 'Searches and pairs bank feed incoming credits with undeposited customer payments using smart matching.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Bank account ID' },
        tolerance_days: { type: 'number', description: 'Allowable date difference in days (default 3)' }
      },
      required: ['account_id']
    }
  },
  {
    name: 'qbo_find_unreconciled_discrepancies',
    description: 'Identifies transactions that are un-reconciled, dated prior to last completed reconciliation, or flagged as deleted after clearing.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Bank account ID' }
      },
      required: ['account_id']
    }
  },
  {
    name: 'qbo_detect_reconciliation_changes',
    description: 'Audits previously reconciled periods to detect any transactions that were edited, un-cleared, or deleted after sign-off.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string', description: 'Account ID' },
        last_reconciliation_date: { type: 'string', description: 'Cutoff date (YYYY-MM-DD)' }
      },
      required: ['account_id']
    }
  },
  {
    name: 'qbo_cleared_transaction_audit',
    description: 'Produces complete listing of all cleared vs uncleared transactions for an account.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string' },
        start_date: { type: 'string' },
        end_date: { type: 'string' }
      },
      required: ['account_id']
    }
  },
  {
    name: 'qbo_reconciliation_history',
    description: 'Retrieves historical reconciliation sessions, signed off ending balances, and variance history for an account.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string' }
      },
      required: ['account_id']
    }
  },
  {
    name: 'qbo_reconciliation_summary_report',
    description: 'Generates formal bank reconciliation summary report for accountant workpapers.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string' },
        statement_date: { type: 'string' }
      },
      required: ['account_id', 'statement_date']
    }
  },
  {
    name: 'qbo_flag_stale_uncleared_checks',
    description: 'Flags checks and outbound payments outstanding for over 90 days that may need voiding or escheatment review.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string' },
        days_stale: { type: 'number', description: 'Threshold days (default 90)' }
      }
    }
  },
  {
    name: 'qbo_check_bank_feed_rules',
    description: 'Audits automatic bank feed rules for potential conflicts, broad wildcards, or miscategorizations.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' }
      }
    }
  },
  {
    name: 'qbo_audit_reconciled_modifications',
    description: 'Pinpoints exact modified records that broke the beginning reconciliation balance.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        account_id: { type: 'string' }
      },
      required: ['account_id']
    }
  },
  {
    name: 'qbo_zero_balance_subledger_check',
    description: 'Verifies that subledgers (A/R, A/P) balance exactly with general ledger control accounts with 0 discrepancy.',
    category: 'Reconciliation & Accounting Reviews',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string' }
      }
    }
  },

  // ==========================================
  // 8. MONTH-END CLOSING & DATA QUALITY (12 Tools)
  // ==========================================
  {
    name: 'qbo_month_end_close_review',
    description: 'Runs comprehensive month-end close evaluation assessing subledger reconciliations, unassigned expenses, and accruals.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        period_ending: { type: 'string', description: 'Period end date (YYYY-MM-DD)' }
      },
      required: ['period_ending']
    }
  },
  {
    name: 'qbo_month_end_checklist_status',
    description: 'Checks status of all month-end closing procedures (bank recs, payroll clearing, tax filing, depreciation).',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        period_month: { type: 'string', description: 'Month (e.g. 2026-09)' }
      },
      required: ['period_month']
    }
  },
  {
    name: 'qbo_detect_uncategorized_transactions',
    description: 'Finds all transactions parked in Uncategorized Expense, Uncategorized Income, or Ask My Accountant.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        start_date: { type: 'string' },
        end_date: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_detect_duplicate_transactions',
    description: 'Scans for duplicate payments, double bills, or duplicate invoice postings based on amounts, dates, and vendors.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        lookback_days: { type: 'number', description: 'Days to analyze (default 60)' }
      }
    }
  },
  {
    name: 'qbo_detect_unusual_transactions',
    description: 'Applies anomaly detection algorithm on transaction sizes, uncommon weekend postings, or round-dollar payouts.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        start_date: { type: 'string' },
        end_date: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_audit_prior_period_changes',
    description: 'Audits transactions posted or edited in closed/locked periods that could alter prior financial filings.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        closing_date: { type: 'string', description: 'Official closing cutoff date' }
      },
      required: ['closing_date']
    }
  },
  {
    name: 'qbo_detect_coding_inconsistencies',
    description: 'Finds instances where recurring vendor transactions were coded to different general ledger accounts.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        vendor_id: { type: 'string', description: 'Optional specific vendor' }
      }
    }
  },
  {
    name: 'qbo_lock_accounting_period',
    description: 'Sets or verifies the QuickBooks closing date password to prevent unauthorized adjustments to closed periods.',
    category: 'Month-End Closing & Data Quality',
    requiresAdmin: true,
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        closing_date: { type: 'string', description: 'Date through which books are closed (YYYY-MM-DD)' },
        warn_only: { type: 'boolean', description: 'Allow changes with warning vs require password' }
      },
      required: ['closing_date']
    }
  },
  {
    name: 'qbo_verify_closing_date_password',
    description: 'Verifies whether book closing lock is active and enforces closing date rules.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' }
      }
    }
  },
  {
    name: 'qbo_suspense_account_clearance_check',
    description: 'Scans Clearing Accounts, Payroll Suspense, and Undeposited Funds to verify they wash to zero at period end.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_tax_clearing_reconciliation',
    description: 'Reconciles Sales Tax Payable subledger against payments made to state tax authorities.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        period_month: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_depreciation_schedule_audit',
    description: 'Audits Fixed Asset accounts to verify monthly depreciation journal entries were calculated and posted.',
    category: 'Month-End Closing & Data Quality',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        period_month: { type: 'string' }
      }
    }
  },

  // ==========================================
  // 9. ADVANCED FINANCIAL INTELLIGENCE (13 Tools)
  // ==========================================
  {
    name: 'qbo_analyze_ar_collectability',
    description: 'Computes AI-driven collectability risk scores, DSO (Days Sales Outstanding), and bad-debt exposure across customers.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_review_ap_cash_outflows',
    description: 'Analyzes Accounts Payable cash outlays over next 30/60/90 days and recommends early-pay discount opportunities.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        forecast_horizon_weeks: { type: 'number', description: 'Weeks forward (default 4)' }
      }
    }
  },
  {
    name: 'qbo_balance_sheet_integrity_audit',
    description: 'Performs 12-point structural audit on Balance Sheet: Assets = Liabilities + Equity, negative balances, and retained earnings flow.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_13_week_cash_flow_forecast',
    description: 'Projects rolling 13-week direct cash flow model based on AR due dates, AP schedules, payroll run-rate, and recurring bills.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        start_date: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_budget_variance_analysis',
    description: 'Calculates actual versus budgeted performance, variance percentages, and flags unfavorable variances exceeding 5%.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        budget_year: { type: 'number', description: 'Budget year (e.g. 2026)' },
        period_month: { type: 'string', description: 'Month in YYYY-MM format' }
      }
    }
  },
  {
    name: 'qbo_compute_financial_kpis',
    description: 'Calculates standard executive financial ratios: Current Ratio, Quick Ratio, Gross Margin %, Net Margin %, EBITDA, ROA.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_generate_management_report_pack',
    description: 'Generates structured executive management packet summarizing P&L, key drivers, top customers, runway, and action items.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        period_ending: { type: 'string' },
        reporting_currency: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_explain_financial_statement_variance',
    description: 'Provides structured analytical narrative explaining why gross margin or operating profit moved between two fiscal periods.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        period_a: { type: 'string', description: 'Prior period (YYYY-MM)' },
        period_b: { type: 'string', description: 'Current period (YYYY-MM)' }
      },
      required: ['period_a', 'period_b']
    }
  },
  {
    name: 'qbo_cross_company_financial_matrix',
    description: 'Aggregates P&L, balance sheet, and revenue side-by-side across all connected QuickBooks companies with currency normalization.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_ids: { type: 'array', items: { type: 'string' }, description: 'List of realmIds or omit for all connected companies' },
        metric: { type: 'string', enum: ['Revenue', 'NetIncome', 'CashBalance', 'WorkingCapital', 'All'] },
        period: { type: 'string', description: 'Fiscal period e.g. 2026-Q3' }
      }
    }
  },
  {
    name: 'qbo_working_capital_runway_analysis',
    description: 'Analyzes liquid cash runway, net burn rate per month, and zero-cash date under base and stress-test scenarios.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        as_of_date: { type: 'string' }
      }
    }
  },
  {
    name: 'qbo_customer_churn_revenue_impact',
    description: 'Identifies previously active customers who have not ordered in the past 60/90 days and calculates annualized revenue at risk.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        inactivity_days: { type: 'number', description: 'Days of inactivity (default 90)' }
      }
    }
  },
  {
    name: 'qbo_gross_margin_leakage_detector',
    description: 'Analyzes product and service SKUs to pinpoint items sold below target margin or suffering direct material cost inflation.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        target_margin_percent: { type: 'number', description: 'Target gross margin percentage (e.g. 40.0)' }
      }
    }
  },
  {
    name: 'qbo_debt_covenant_compliance_check',
    description: 'Calculates Debt-to-Equity and Fixed Charge Coverage ratios against bank covenant limits to ensure compliance.',
    category: 'Advanced Financial Intelligence',
    inputSchema: {
      type: 'object',
      properties: {
        company_id: { type: 'string', description: 'QuickBooks Company ID' },
        max_debt_to_equity: { type: 'number', description: 'Covenant limit (e.g. 2.5)' },
        min_current_ratio: { type: 'number', description: 'Covenant limit (e.g. 1.25)' }
      }
    }
  }
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  'Financial Reporting',
  'Accounting Data Management',
  'Sales & Accounts Receivable',
  'Purchasing & Accounts Payable',
  'Banking & Journal Entries',
  'Attachments & Documents',
  'Reconciliation & Accounting Reviews',
  'Month-End Closing & Data Quality',
  'Advanced Financial Intelligence'
];
