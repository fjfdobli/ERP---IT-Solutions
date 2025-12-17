import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout';
import { ProtectedRoute } from '../components/Auth';
import { Login, Dashboard, Users, Roles } from '../pages';
import ComingSoon from '../pages/ComingSoon';
import { ProductList, ProductCategories, ProductBrands, UnitsOfMeasure } from '../pages/products';
import { StockLevels, StockMovements, StockTransfers, StockAdjustments, StockCounts } from '../pages/inventory';
import { SalesTransactions, SalesOrders, SalesReturns, Discounts } from '../pages/sales';
import { PurchaseOrders, GoodsReceiving, Suppliers } from '../pages/purchasing';
import { Customers, CustomerTypes, CreditAccounts, LoyaltyProgram } from '../pages/customers';
import { Branches, Warehouses } from '../pages/branches';
import { Employees, Departments, Attendance, Payroll } from '../pages/hr';
import { FinanceOverview, AccountsReceivable, AccountsPayable, BankReconciliation } from '../pages/finance';
import { SalesReports, InventoryReports, FinancialReports, CustomReports } from '../pages/reports';
import { CashRegisters, Shifts, PettyCash } from '../pages/cash';

import { SyncStatus, SyncLogs, SyncSettings, DataMapping } from '../pages/pos';
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // Administration
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'roles',
        element: <Roles />,
      },
      {
        path: 'settings',
        element: <ComingSoon title="Settings" />,
      },
      {
        path: 'audit-logs',
        element: <ComingSoon title="Audit Logs" />,
      },
      {
        path: 'profile',
        element: <ComingSoon title="Profile" />,
      },
      // Products
      {
        path: 'products',
        element: <ProductList />,
      },
      {
        path: 'products/categories',
        element: <ProductCategories />,
      },
      {
        path: 'products/brands',
        element: <ProductBrands />,
      },
      {
        path: 'products/units',
        element: <UnitsOfMeasure />,
      },
      // Inventory
      {
        path: 'inventory/stock',
        element: <StockLevels />,
      },
      {
        path: 'inventory/movements',
        element: <StockMovements />,
      },
      {
        path: 'inventory/transfers',
        element: <StockTransfers />,
      },
      {
        path: 'inventory/adjustments',
        element: <StockAdjustments />,
      },
      {
        path: 'inventory/counts',
        element: <StockCounts />,
      },
      // Sales
      {
        path: 'sales/transactions',
        element: <SalesTransactions />,
      },
      {
        path: 'sales/orders',
        element: <SalesOrders />,
      },
      {
        path: 'sales/quotations',
        element: <ComingSoon title="Quotations" />,
      },
      {
        path: 'sales/returns',
        element: <SalesReturns />,
      },
      {
        path: 'sales/discounts',
        element: <Discounts />,
      },
      // Purchasing
      {
        path: 'purchasing/orders',
        element: <PurchaseOrders />,
      },
      {
        path: 'purchasing/receiving',
        element: <GoodsReceiving />,
      },
      {
        path: 'purchasing/suppliers',
        element: <Suppliers />,
      },
      // Customers
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'customers/types',
        element: <CustomerTypes />,
      },
      {
        path: 'customers/credits',
        element: <CreditAccounts />,
      },
      {
        path: 'customers/loyalty',
        element: <LoyaltyProgram />,
      },
      // Branches
      {
        path: 'branches',
        element: <Branches />,
      },
      {
        path: 'branches/warehouses',
        element: <Warehouses />,
      },
      // Cash Management
      {
        path: 'cash/registers',
        element: <CashRegisters />,
      },
      {
        path: 'cash/shifts',
        element: <Shifts />,
      },
      {
        path: 'cash/petty',
        element: <PettyCash />,
      },
      // Finance
      {
        path: 'finance/overview',
        element: <FinanceOverview />,
      },
      {
        path: 'finance/receivables',
        element: <AccountsReceivable />,
      },
      {
        path: 'finance/payables',
        element: <AccountsPayable />,
      },
      {
        path: 'finance/bank',
        element: <BankReconciliation />,
      },
      // Reports
      {
        path: 'reports/sales',
        element: <SalesReports />,
      },
      {
        path: 'reports/inventory',
        element: <InventoryReports />,
      },
      {
        path: 'reports/financial',
        element: <FinancialReports />,
      },
      {
        path: 'reports/hr',
        element: <CustomReports />,
      },
      {
        path: 'reports/analytics',
        element: <CustomReports />,
      },
      // Human Resources
      {
        path: 'hr/employees',
        element: <Employees />,
      },
      {
        path: 'hr/departments',
        element: <Departments />,
      },
      {
        path: 'hr/positions',
        element: <ComingSoon title="Positions" />,
      },
      {
        path: 'hr/attendance',
        element: <Attendance />,
      },
      {
        path: 'hr/payroll',
        element: <Payroll />,
      },
      {
        path: 'hr/leave',
        element: <ComingSoon title="Leave Management" />,
      },
      // CRM
      {
        path: 'crm/leads',
        element: <ComingSoon title="Leads" />,
      },
      {
        path: 'crm/opportunities',
        element: <ComingSoon title="Opportunities" />,
      },
      {
        path: 'crm/tasks',
        element: <ComingSoon title="Tasks" />,
      },
      {
        path: 'crm/communications',
        element: <ComingSoon title="Communications" />,
      },
      // Accounting
      {
        path: 'accounting/chart',
        element: <ComingSoon title="Chart of Accounts" />,
      },
      {
        path: 'accounting/journal',
        element: <ComingSoon title="Journal Entries" />,
      },
      {
        path: 'accounting/ledger',
        element: <ComingSoon title="General Ledger" />,
      },
      {
        path: 'accounting/trial-balance',
        element: <ComingSoon title="Trial Balance" />,
      },
      {
        path: 'accounting/balance-sheet',
        element: <ComingSoon title="Balance Sheet" />,
      },
      {
        path: 'accounting/income-statement',
        element: <ComingSoon title="Income Statement" />,
      },
      // Assets
      {
        path: 'assets',
        element: <ComingSoon title="Fixed Assets" />,
      },
      {
        path: 'assets/categories',
        element: <ComingSoon title="Asset Categories" />,
      },
      {
        path: 'assets/depreciation',
        element: <ComingSoon title="Depreciation" />,
      },
      {
        path: 'assets/maintenance',
        element: <ComingSoon title="Maintenance" />,
      },
      // POS Sync
      {
        path: 'pos-sync/status',
        element: <SyncStatus />,
      },
      {
        path: 'pos-sync/logs',
        element: <SyncLogs />,
      },
      {
        path: 'pos-sync/settings',
        element: <SyncSettings />,
      },
      {
        path: 'pos-sync/data-mapping',
        element: <DataMapping />,
      },
      // Documents
      {
        path: 'documents',
        element: <ComingSoon title="File Manager" />,
      },
      {
        path: 'documents/categories',
        element: <ComingSoon title="Document Categories" />,
      },
      // Notifications
      {
        path: 'notifications',
        element: <ComingSoon title="All Notifications" />,
      },
      {
        path: 'notifications/rules',
        element: <ComingSoon title="Alert Rules" />,
      },
      {
        path: 'notifications/templates',
        element: <ComingSoon title="Email Templates" />,
      },
      // Help Center
      {
        path: 'help/knowledge-base',
        element: <ComingSoon title="Knowledge Base" />,
      },
      {
        path: 'help/faqs',
        element: <ComingSoon title="FAQs" />,
      },
      {
        path: 'help/tickets',
        element: <ComingSoon title="Support Tickets" />,
      },
      // User Profile & Settings
      {
        path: 'profile/change-password',
        element: <ComingSoon title="Change Password" />,
      },
      {
        path: 'profile/preferences',
        element: <ComingSoon title="Preferences" />,
      },
      // Logistics
      {
        path: 'logistics/deliveries',
        element: <ComingSoon title="Deliveries" />,
      },
      {
        path: 'logistics/shipments',
        element: <ComingSoon title="Shipment Tracking" />,
      },
      {
        path: 'logistics/routes',
        element: <ComingSoon title="Route Planning" />,
      },
      // Manufacturing
      {
        path: 'manufacturing/work-orders',
        element: <ComingSoon title="Work Orders" />,
      },
      {
        path: 'manufacturing/bom',
        element: <ComingSoon title="Bill of Materials" />,
      },
      {
        path: 'manufacturing/scheduling',
        element: <ComingSoon title="Production Scheduling" />,
      },
      // Quality Control
      {
        path: 'quality/inspections',
        element: <ComingSoon title="Inspections" />,
      },
      {
        path: 'quality/standards',
        element: <ComingSoon title="Quality Standards" />,
      },
      {
        path: 'quality/defects',
        element: <ComingSoon title="Defect Tracking" />,
      },
      // Warranty
      {
        path: 'warranty/products',
        element: <ComingSoon title="Product Warranties" />,
      },
      {
        path: 'warranty/claims',
        element: <ComingSoon title="Claims Processing" />,
      },
      // Budgeting & Forecasting
      {
        path: 'budgeting/plans',
        element: <ComingSoon title="Budget Planning" />,
      },
      {
        path: 'budgeting/forecasts',
        element: <ComingSoon title="Forecasting" />,
      },
      {
        path: 'budgeting/variance',
        element: <ComingSoon title="Variance Analysis" />,
      },
      // Tax Management
      {
        path: 'tax/rates',
        element: <ComingSoon title="Tax Rates" />,
      },
      {
        path: 'tax/reports',
        element: <ComingSoon title="Tax Reports" />,
      },
      {
        path: 'tax/vat',
        element: <ComingSoon title="VAT/GST" />,
      },
      // Multi-Currency
      {
        path: 'currency/rates',
        element: <ComingSoon title="Exchange Rates" />,
      },
      {
        path: 'currency/conversion',
        element: <ComingSoon title="Currency Conversion" />,
      },
      // Compliance
      {
        path: 'compliance/regulations',
        element: <ComingSoon title="Regulations" />,
      },
      {
        path: 'compliance/certifications',
        element: <ComingSoon title="Certifications" />,
      },
      {
        path: 'compliance/audits',
        element: <ComingSoon title="Compliance Audits" />,
      },
      // Marketing
      {
        path: 'marketing/campaigns',
        element: <ComingSoon title="Campaigns" />,
      },
      {
        path: 'marketing/promotions',
        element: <ComingSoon title="Promotions" />,
      },
      {
        path: 'marketing/email',
        element: <ComingSoon title="Email Marketing" />,
      },
      // E-Commerce
      {
        path: 'ecommerce/store',
        element: <ComingSoon title="Online Store" />,
      },
      {
        path: 'ecommerce/orders',
        element: <ComingSoon title="Online Orders" />,
      },
      {
        path: 'ecommerce/integration',
        element: <ComingSoon title="E-Commerce Integration" />,
      },
      // Business Intelligence
      {
        path: 'bi/dashboards',
        element: <ComingSoon title="BI Dashboards" />,
      },
      {
        path: 'bi/kpis',
        element: <ComingSoon title="KPIs" />,
      },
      {
        path: 'bi/visualization',
        element: <ComingSoon title="Data Visualization" />,
      },
      // Project Management
      {
        path: 'projects',
        element: <ComingSoon title="All Projects" />,
      },
      {
        path: 'projects/milestones',
        element: <ComingSoon title="Milestones" />,
      },
      {
        path: 'projects/resources',
        element: <ComingSoon title="Resource Allocation" />,
      },
      // Vendor Portal
      {
        path: 'vendor-portal/suppliers',
        element: <ComingSoon title="Supplier Self-Service" />,
      },
      {
        path: 'vendor-portal/acknowledgments',
        element: <ComingSoon title="PO Acknowledgments" />,
      },
      // Customer Portal
      {
        path: 'customer-portal/tracking',
        element: <ComingSoon title="Order Tracking" />,
      },
      {
        path: 'customer-portal/invoices',
        element: <ComingSoon title="Customer Invoices" />,
      },
      {
        path: 'customer-portal/support',
        element: <ComingSoon title="Customer Support" />,
      },
      // Workflow & Approvals
      {
        path: 'workflow/approvals',
        element: <ComingSoon title="Pending Approvals" />,
      },
      {
        path: 'workflow/rules',
        element: <ComingSoon title="Approval Rules" />,
      },
      {
        path: 'workflow/history',
        element: <ComingSoon title="Approval History" />,
      },
      // Import/Export
      {
        path: 'data-tools/import',
        element: <ComingSoon title="Data Import" />,
      },
      {
        path: 'data-tools/export',
        element: <ComingSoon title="Data Export" />,
      },
      {
        path: 'data-tools/templates',
        element: <ComingSoon title="Import/Export Templates" />,
      },
      // Integrations
      {
        path: 'integrations/apps',
        element: <ComingSoon title="Connected Apps" />,
      },
      {
        path: 'integrations/api',
        element: <ComingSoon title="API Management" />,
      },
      {
        path: 'integrations/webhooks',
        element: <ComingSoon title="Webhooks" />,
      },
      // Fleet Management
      {
        path: 'fleet/vehicles',
        element: <ComingSoon title="Vehicles" />,
      },
      {
        path: 'fleet/tracking',
        element: <ComingSoon title="GPS Tracking" />,
      },
      {
        path: 'fleet/maintenance',
        element: <ComingSoon title="Fleet Maintenance" />,
      },
      // Consignment
      {
        path: 'consignment/inventory',
        element: <ComingSoon title="Consignment Inventory" />,
      },
      {
        path: 'consignment/partners',
        element: <ComingSoon title="Consignment Partners" />,
      },
      {
        path: 'consignment/settlements',
        element: <ComingSoon title="Settlements" />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
