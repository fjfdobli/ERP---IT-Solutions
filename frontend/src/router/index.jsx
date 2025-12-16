import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout';
import { ProtectedRoute } from '../components/Auth';
import { Login, Dashboard, Users, Roles } from '../pages';
import ComingSoon from '../pages/ComingSoon';

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
        element: <ComingSoon title="All Products" />,
      },
      {
        path: 'products/categories',
        element: <ComingSoon title="Product Categories" />,
      },
      {
        path: 'products/brands',
        element: <ComingSoon title="Brands" />,
      },
      {
        path: 'products/units',
        element: <ComingSoon title="Units of Measure" />,
      },
      // Inventory
      {
        path: 'inventory/stock',
        element: <ComingSoon title="Stock Levels" />,
      },
      {
        path: 'inventory/movements',
        element: <ComingSoon title="Stock Movements" />,
      },
      {
        path: 'inventory/transfers',
        element: <ComingSoon title="Stock Transfers" />,
      },
      {
        path: 'inventory/adjustments',
        element: <ComingSoon title="Stock Adjustments" />,
      },
      {
        path: 'inventory/counts',
        element: <ComingSoon title="Stock Counts" />,
      },
      // Sales
      {
        path: 'sales/transactions',
        element: <ComingSoon title="Sales Transactions" />,
      },
      {
        path: 'sales/orders',
        element: <ComingSoon title="Sales Orders" />,
      },
      {
        path: 'sales/returns',
        element: <ComingSoon title="Returns & Refunds" />,
      },
      {
        path: 'sales/discounts',
        element: <ComingSoon title="Discounts & Promotions" />,
      },
      // Purchasing
      {
        path: 'purchasing/orders',
        element: <ComingSoon title="Purchase Orders" />,
      },
      {
        path: 'purchasing/receiving',
        element: <ComingSoon title="Goods Receiving" />,
      },
      {
        path: 'purchasing/suppliers',
        element: <ComingSoon title="Suppliers" />,
      },
      // Customers
      {
        path: 'customers',
        element: <ComingSoon title="All Customers" />,
      },
      {
        path: 'customers/types',
        element: <ComingSoon title="Customer Types" />,
      },
      {
        path: 'customers/credits',
        element: <ComingSoon title="Credit Accounts" />,
      },
      {
        path: 'customers/loyalty',
        element: <ComingSoon title="Loyalty Program" />,
      },
      // Branches
      {
        path: 'branches',
        element: <ComingSoon title="All Branches" />,
      },
      {
        path: 'branches/warehouses',
        element: <ComingSoon title="Warehouses" />,
      },
      // Cash Management
      {
        path: 'cash/registers',
        element: <ComingSoon title="Cash Registers" />,
      },
      {
        path: 'cash/shifts',
        element: <ComingSoon title="Shifts" />,
      },
      {
        path: 'cash/petty',
        element: <ComingSoon title="Petty Cash" />,
      },
      // Finance
      {
        path: 'finance/overview',
        element: <ComingSoon title="Finance Overview" />,
      },
      {
        path: 'finance/receivables',
        element: <ComingSoon title="Accounts Receivable" />,
      },
      {
        path: 'finance/payables',
        element: <ComingSoon title="Accounts Payable" />,
      },
      {
        path: 'finance/bank',
        element: <ComingSoon title="Bank Reconciliation" />,
      },
      // Reports
      {
        path: 'reports/sales',
        element: <ComingSoon title="Sales Reports" />,
      },
      {
        path: 'reports/inventory',
        element: <ComingSoon title="Inventory Reports" />,
      },
      {
        path: 'reports/financial',
        element: <ComingSoon title="Financial Reports" />,
      },
      {
        path: 'reports/hr',
        element: <ComingSoon title="HR Reports" />,
      },
      {
        path: 'reports/analytics',
        element: <ComingSoon title="Analytics" />,
      },
      // Human Resources
      {
        path: 'hr/employees',
        element: <ComingSoon title="Employees" />,
      },
      {
        path: 'hr/departments',
        element: <ComingSoon title="Departments" />,
      },
      {
        path: 'hr/positions',
        element: <ComingSoon title="Positions" />,
      },
      {
        path: 'hr/attendance',
        element: <ComingSoon title="Attendance" />,
      },
      {
        path: 'hr/payroll',
        element: <ComingSoon title="Payroll" />,
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
        element: <ComingSoon title="Sync Status" />,
      },
      {
        path: 'pos-sync/logs',
        element: <ComingSoon title="Sync Logs" />,
      },
      {
        path: 'pos-sync/settings',
        element: <ComingSoon title="Sync Settings" />,
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
