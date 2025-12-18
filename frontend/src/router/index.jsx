import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout';
import { ProtectedRoute } from '../components/Auth';
import { Login, Dashboard, Users, Roles } from '../pages';
import ComingSoon from '../pages/ComingSoon';
import { ProductList, ProductCategories, ProductBrands, UnitsOfMeasure, ProductVariants } from '../pages/products';
import { StockLevels, StockMovements, StockTransfers, StockAdjustments, StockCounts, ReorderPoints } from '../pages/inventory';
import { SalesTransactions, SalesOrders, SalesReturns, Discounts, Quotations } from '../pages/sales';
import { PurchaseOrders, GoodsReceiving, Suppliers, PurchaseRequests, PurchaseReturns } from '../pages/purchasing';
import { Customers, CustomerTypes, CreditAccounts, LoyaltyProgram, CustomerGroups } from '../pages/customers';
import { Branches, Warehouses, CashRegisters as BranchCashRegisters } from '../pages/branches';
import { Employees, Departments, Attendance, Payroll, Positions, LeaveManagement, Benefits } from '../pages/hr';
import { FinanceOverview, AccountsReceivable, AccountsPayable, BankReconciliation, Expenses } from '../pages/finance';
import { SalesReports, InventoryReports, FinancialReports, CustomReports, PurchasingReports, HRReports } from '../pages/reports';
import { CashRegisters, Shifts, PettyCash, DailyCashPosition, BankDeposits } from '../pages/cash';
import { OnlineOrders, ProductListings, StoreSettings } from '../pages/ecommerce';
import { Leads, Opportunities, Activities, Campaigns } from '../pages/crm';
import { ConsignmentInventory, ConsignmentPartners, ConsignmentSettlements } from '../pages/consignment';
import { ChartOfAccounts, JournalEntries, GeneralLedger, TrialBalance, BalanceSheet, IncomeStatement, CashFlowStatement } from '../pages/accounting';
import { BudgetPlanning, BudgetTracking, Forecasting } from '../pages/budgeting';
import { TaxRates, VAT, WithholdingTax, TaxFilings } from '../pages/tax';
import { FixedAssets, AssetCategories, Depreciation, Maintenance, AssetDisposal } from '../pages/assets';
import { WarrantyRegistrations, WarrantyClaims, ServiceJobs } from '../pages/warranty';
import { Deliveries, Shipments, Routes, FleetManagement } from '../pages/logistics';
import { BillOfMaterials, WorkOrders, ProductionScheduling, ProductionOutput } from '../pages/manufacturing';
import { Inspections, QualityStandards, DefectTracking } from '../pages/quality';
import { PendingApprovals, SubmittedApprovals, ApprovalRules } from '../pages/workflow';
import { FileManager, DocumentTemplates } from '../pages/documents';
import { Regulations, Certifications, Audits } from '../pages/compliance';
import { CustomerPortal, VendorPortal, EmployeePortal } from '../pages/portals';
import { SystemSettings, AuditLogs, NotificationSettings } from '../pages/admin';
import { ConnectedApps, APIManagement, ImportExport } from '../pages/integrations';
import { KnowledgeBase, FAQs, SupportTickets } from '../pages/help';
import { Dashboards, KPIs, TrendAnalysis } from '../pages/analytics';

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
        path: 'admin/users',
        element: <Users />,
      },
      {
        path: 'admin/roles',
        element: <Roles />,
      },
      {
        path: 'settings',
        element: <SystemSettings />,
      },
      {
        path: 'admin/settings',
        element: <SystemSettings />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogs />,
      },
      {
        path: 'admin/audit-logs',
        element: <AuditLogs />,
      },
      {
        path: 'notifications',
        element: <NotificationSettings />,
      },
      {
        path: 'admin/notifications',
        element: <NotificationSettings />,
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
      {
        path: 'products/variants',
        element: <ProductVariants />,
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
      {
        path: 'inventory/reorder',
        element: <ReorderPoints />,
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
        element: <Quotations />,
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
      {
        path: 'purchasing/requests',
        element: <PurchaseRequests />,
      },
      {
        path: 'purchasing/returns',
        element: <PurchaseReturns />,
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
      {
        path: 'customers/groups',
        element: <CustomerGroups />,
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
      {
        path: 'branches/registers',
        element: <BranchCashRegisters />,
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
      {
        path: 'cash/daily',
        element: <DailyCashPosition />,
      },
      {
        path: 'cash/deposits',
        element: <BankDeposits />,
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
      {
        path: 'finance/expenses',
        element: <Expenses />,
      },
      {
        path: 'cash/daily',
        element: <DailyCashPosition />,
      },
      {
        path: 'cash/deposits',
        element: <BankDeposits />,
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
        element: <HRReports />,
      },
      {
        path: 'reports/analytics',
        element: <CustomReports />,
      },
      {
        path: 'reports/purchasing',
        element: <PurchasingReports />,
      },
      {
        path: 'reports/custom',
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
        element: <LeaveManagement />,
      },
      {
        path: 'hr/positions',
        element: <Positions />,
      },
      {
        path: 'hr/benefits',
        element: <Benefits />,
      },
      // CRM
      {
        path: 'crm/leads',
        element: <Leads />,
      },
      {
        path: 'crm/opportunities',
        element: <Opportunities />,
      },
      {
        path: 'crm/activities',
        element: <Activities />,
      },
      {
        path: 'crm/campaigns',
        element: <Campaigns />,
      },
      // Accounting
      {
        path: 'accounting/chart',
        element: <ChartOfAccounts />,
      },
      {
        path: 'accounting/journal',
        element: <JournalEntries />,
      },
      {
        path: 'accounting/ledger',
        element: <GeneralLedger />,
      },
      {
        path: 'accounting/trial-balance',
        element: <TrialBalance />,
      },
      {
        path: 'accounting/balance-sheet',
        element: <BalanceSheet />,
      },
      {
        path: 'accounting/income-statement',
        element: <IncomeStatement />,
      },
      {
        path: 'accounting/cash-flow',
        element: <CashFlowStatement />,
      },
      // Assets
      {
        path: 'assets',
        element: <FixedAssets />,
      },
      {
        path: 'assets/categories',
        element: <AssetCategories />,
      },
      {
        path: 'assets/depreciation',
        element: <Depreciation />,
      },
      {
        path: 'assets/maintenance',
        element: <Maintenance />,
      },
      {
        path: 'assets/disposal',
        element: <AssetDisposal />,
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
        element: <FileManager />,
      },
      {
        path: 'documents/templates',
        element: <DocumentTemplates />,
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
        element: <KnowledgeBase />,
      },
      {
        path: 'help/faqs',
        element: <FAQs />,
      },
      {
        path: 'help/tickets',
        element: <SupportTickets />,
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
        element: <Deliveries />,
      },
      {
        path: 'logistics/shipments',
        element: <Shipments />,
      },
      {
        path: 'logistics/routes',
        element: <Routes />,
      },
      {
        path: 'logistics/fleet',
        element: <FleetManagement />,
      },
      // Manufacturing
      {
        path: 'manufacturing/work-orders',
        element: <WorkOrders />,
      },
      {
        path: 'manufacturing/bom',
        element: <BillOfMaterials />,
      },
      {
        path: 'manufacturing/scheduling',
        element: <ProductionScheduling />,
      },
      {
        path: 'manufacturing/output',
        element: <ProductionOutput />,
      },
      // Quality Control
      {
        path: 'quality/inspections',
        element: <Inspections />,
      },
      {
        path: 'quality/standards',
        element: <QualityStandards />,
      },
      {
        path: 'quality/defects',
        element: <DefectTracking />,
      },
      // Warranty
      {
        path: 'warranty/registrations',
        element: <WarrantyRegistrations />,
      },
      {
        path: 'warranty/claims',
        element: <WarrantyClaims />,
      },
      {
        path: 'warranty/service',
        element: <ServiceJobs />,
      },
      // Budgeting & Forecasting
      {
        path: 'budgeting/plans',
        element: <BudgetPlanning />,
      },
      {
        path: 'budgeting/tracking',
        element: <BudgetTracking />,
      },
      {
        path: 'budgeting/forecasts',
        element: <Forecasting />,
      },
      // Tax Management
      {
        path: 'tax/rates',
        element: <TaxRates />,
      },
      {
        path: 'tax/vat',
        element: <VAT />,
      },
      {
        path: 'tax/withholding',
        element: <WithholdingTax />,
      },
      {
        path: 'tax/filings',
        element: <TaxFilings />,
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
        element: <Regulations />,
      },
      {
        path: 'compliance/certifications',
        element: <Certifications />,
      },
      {
        path: 'compliance/audits',
        element: <Audits />,
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
        path: 'ecommerce/orders',
        element: <OnlineOrders />,
      },
      {
        path: 'ecommerce/products',
        element: <ProductListings />,
      },
      {
        path: 'ecommerce/settings',
        element: <StoreSettings />,
      },
      // Analytics
      {
        path: 'analytics/dashboards',
        element: <Dashboards />,
      },
      {
        path: 'analytics/kpis',
        element: <KPIs />,
      },
      {
        path: 'analytics/trends',
        element: <TrendAnalysis />,
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
      // Portals
      {
        path: 'portals/customer',
        element: <CustomerPortal />,
      },
      {
        path: 'portals/vendor',
        element: <VendorPortal />,
      },
      {
        path: 'portals/employee',
        element: <EmployeePortal />,
      },
      // Workflow & Approvals
      {
        path: 'workflow/pending',
        element: <PendingApprovals />,
      },
      {
        path: 'workflow/submitted',
        element: <SubmittedApprovals />,
      },
      {
        path: 'workflow/rules',
        element: <ApprovalRules />,
      },
      // Integrations
      {
        path: 'integrations/apps',
        element: <ConnectedApps />,
      },
      {
        path: 'integrations/api',
        element: <APIManagement />,
      },
      {
        path: 'integrations/import-export',
        element: <ImportExport />,
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
        element: <ConsignmentInventory />,
      },
      {
        path: 'consignment/partners',
        element: <ConsignmentPartners />,
      },
      {
        path: 'consignment/settlements',
        element: <ConsignmentSettlements />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
