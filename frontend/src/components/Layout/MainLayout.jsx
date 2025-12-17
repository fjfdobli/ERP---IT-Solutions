
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  BellOutlined,
  ShopOutlined,
  AppstoreOutlined,
  SwapOutlined,
  GiftOutlined,
  BankOutlined,
  AuditOutlined,
  FileTextOutlined,
  WalletOutlined,
  ReconciliationOutlined,
  SolutionOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  BookOutlined,
  CalculatorOutlined,
  AccountBookOutlined,
  FundProjectionScreenOutlined,
  CarOutlined,
  ToolOutlined,
  ContactsOutlined,
  RocketOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  FolderOutlined,
  SyncOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  SendOutlined,
  TruckOutlined,
  EnvironmentOutlined,
  BuildOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  FieldTimeOutlined,
  FundOutlined,
  PercentageOutlined,
  GlobalOutlined,
  FileDoneOutlined,
  MailOutlined,
  ShoppingOutlined,
  LineChartOutlined,
  ProjectOutlined,
  CloudServerOutlined,
  ApiOutlined,
  ImportOutlined,
  ExportOutlined,
  NodeIndexOutlined,
  CarryOutOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useAppStore } from '../../store';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// ============================================
// MENU STRUCTURE - Organized by Business Flow
// ============================================
// Flow: POS Sync → Sales → Inventory → Purchasing → Finance → Accounting → Reports
// Triggers: Sales → updates Inventory, AR | Purchasing → updates Inventory, AP
//           Inventory → triggers Reorder | Finance → feeds Accounting
// ============================================

const menuItems = [
  // ==================== DASHBOARD ====================
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },

  // ==================== POS & SALES OPERATIONS ====================
  // Core revenue-generating modules - Entry point for most transactions
  {
    key: 'pos-sync',
    icon: <SyncOutlined />,
    label: 'POS Integration',
    children: [
      { key: '/pos-sync/status', label: <Link to="/pos-sync/status">Sync Status</Link> },
      { key: '/pos-sync/logs', label: <Link to="/pos-sync/logs">Sync Logs</Link> },
      { key: '/pos-sync/data-mapping', label: <Link to="/pos-sync/data-mapping">Data Mapping</Link> },
      { key: '/pos-sync/settings', label: <Link to="/pos-sync/settings">Sync Settings</Link> },
    ],
  },
  {
    key: 'sales',
    icon: <ShoppingCartOutlined />,
    label: 'Sales',
    children: [
      { key: '/sales/transactions', label: <Link to="/sales/transactions">POS Transactions</Link> },
      { key: '/sales/orders', label: <Link to="/sales/orders">Sales Orders</Link> },
      { key: '/sales/quotations', label: <Link to="/sales/quotations">Quotations</Link> },
      { key: '/sales/returns', label: <Link to="/sales/returns">Returns & Refunds</Link> },
      { key: '/sales/discounts', label: <Link to="/sales/discounts">Pricing & Discounts</Link> },
    ],
  },
  {
    key: 'ecommerce',
    icon: <ShoppingOutlined />,
    label: 'E-Commerce',
    children: [
      { key: '/ecommerce/orders', label: <Link to="/ecommerce/orders">Online Orders</Link> },
      { key: '/ecommerce/products', label: <Link to="/ecommerce/products">Product Listings</Link> },
      { key: '/ecommerce/settings', label: <Link to="/ecommerce/settings">Store Settings</Link> },
    ],
  },

  // ==================== PRODUCT & INVENTORY ====================
  // Triggered by: Sales (stock deduction), Purchasing (stock addition)
  {
    key: 'products',
    icon: <AppstoreOutlined />,
    label: 'Products',
    children: [
      { key: '/products', label: <Link to="/products">Product Catalog</Link> },
      { key: '/products/categories', label: <Link to="/products/categories">Categories</Link> },
      { key: '/products/brands', label: <Link to="/products/brands">Brands</Link> },
      { key: '/products/units', label: <Link to="/products/units">Units of Measure</Link> },
      { key: '/products/variants', label: <Link to="/products/variants">Variants & Attributes</Link> },
    ],
  },
  {
    key: 'inventory',
    icon: <InboxOutlined />,
    label: 'Inventory',
    children: [
      { key: '/inventory/stock', label: <Link to="/inventory/stock">Stock Levels</Link> },
      { key: '/inventory/movements', label: <Link to="/inventory/movements">Stock Movements</Link> },
      { key: '/inventory/transfers', label: <Link to="/inventory/transfers">Branch Transfers</Link> },
      { key: '/inventory/adjustments', label: <Link to="/inventory/adjustments">Adjustments</Link> },
      { key: '/inventory/counts', label: <Link to="/inventory/counts">Physical Counts</Link> },
      { key: '/inventory/reorder', label: <Link to="/inventory/reorder">Reorder Points</Link> },
    ],
  },
  {
    key: 'consignment',
    icon: <CarryOutOutlined />,
    label: 'Consignment',
    children: [
      { key: '/consignment/inventory', label: <Link to="/consignment/inventory">Consignment Stock</Link> },
      { key: '/consignment/partners', label: <Link to="/consignment/partners">Partners</Link> },
      { key: '/consignment/settlements', label: <Link to="/consignment/settlements">Settlements</Link> },
    ],
  },

  // ==================== PURCHASING & SUPPLIERS ====================
  // Triggers: Low stock → Purchase Request → PO → Receiving → AP
  {
    key: 'purchasing',
    icon: <ReconciliationOutlined />,
    label: 'Purchasing',
    children: [
      { key: '/purchasing/requests', label: <Link to="/purchasing/requests">Purchase Requests</Link> },
      { key: '/purchasing/orders', label: <Link to="/purchasing/orders">Purchase Orders</Link> },
      { key: '/purchasing/receiving', label: <Link to="/purchasing/receiving">Goods Receiving</Link> },
      { key: '/purchasing/returns', label: <Link to="/purchasing/returns">Purchase Returns</Link> },
      { key: '/purchasing/suppliers', label: <Link to="/purchasing/suppliers">Suppliers</Link> },
    ],
  },

  // ==================== CUSTOMERS & CRM ====================
  // Linked to: Sales, AR, Marketing campaigns
  {
    key: 'customers',
    icon: <TeamOutlined />,
    label: 'Customers',
    children: [
      { key: '/customers', label: <Link to="/customers">Customer List</Link> },
      { key: '/customers/groups', label: <Link to="/customers/groups">Customer Groups</Link> },
      { key: '/customers/credits', label: <Link to="/customers/credits">Credit Accounts</Link> },
      { key: '/customers/loyalty', label: <Link to="/customers/loyalty">Loyalty Program</Link> },
    ],
  },
  {
    key: 'crm',
    icon: <ContactsOutlined />,
    label: 'CRM',
    children: [
      { key: '/crm/leads', label: <Link to="/crm/leads">Leads</Link> },
      { key: '/crm/opportunities', label: <Link to="/crm/opportunities">Opportunities</Link> },
      { key: '/crm/activities', label: <Link to="/crm/activities">Activities</Link> },
      { key: '/crm/campaigns', label: <Link to="/crm/campaigns">Campaigns</Link> },
    ],
  },

  // ==================== BRANCHES & LOGISTICS ====================
  // Multi-location operations management
  {
    key: 'branches',
    icon: <ShopOutlined />,
    label: 'Branches',
    children: [
      { key: '/branches', label: <Link to="/branches">All Locations</Link> },
      { key: '/branches/warehouses', label: <Link to="/branches/warehouses">Warehouses</Link> },
      { key: '/branches/registers', label: <Link to="/branches/registers">Cash Registers</Link> },
    ],
  },
  {
    key: 'logistics',
    icon: <TruckOutlined />,
    label: 'Logistics',
    children: [
      { key: '/logistics/deliveries', label: <Link to="/logistics/deliveries">Deliveries</Link> },
      { key: '/logistics/shipments', label: <Link to="/logistics/shipments">Shipment Tracking</Link> },
      { key: '/logistics/routes', label: <Link to="/logistics/routes">Route Planning</Link> },
      { key: '/logistics/fleet', label: <Link to="/logistics/fleet">Fleet Management</Link> },
    ],
  },

  // ==================== MANUFACTURING & QUALITY ====================
  // Production flow: BOM → Work Order → Production → QC → Finished Goods
  {
    key: 'manufacturing',
    icon: <BuildOutlined />,
    label: 'Manufacturing',
    children: [
      { key: '/manufacturing/bom', label: <Link to="/manufacturing/bom">Bill of Materials</Link> },
      { key: '/manufacturing/work-orders', label: <Link to="/manufacturing/work-orders">Work Orders</Link> },
      { key: '/manufacturing/scheduling', label: <Link to="/manufacturing/scheduling">Production Schedule</Link> },
      { key: '/manufacturing/output', label: <Link to="/manufacturing/output">Production Output</Link> },
    ],
  },
  {
    key: 'quality',
    icon: <SafetyCertificateOutlined />,
    label: 'Quality Control',
    children: [
      { key: '/quality/inspections', label: <Link to="/quality/inspections">Inspections</Link> },
      { key: '/quality/standards', label: <Link to="/quality/standards">Quality Standards</Link> },
      { key: '/quality/defects', label: <Link to="/quality/defects">Defect Tracking</Link> },
    ],
  },

  // ==================== CASH & FINANCE ====================
  // Daily operations: Cash handling → Bank deposits → Reconciliation
  {
    key: 'cash',
    icon: <WalletOutlined />,
    label: 'Cash Management',
    children: [
      { key: '/cash/daily', label: <Link to="/cash/daily">Daily Cash Position</Link> },
      { key: '/cash/shifts', label: <Link to="/cash/shifts">Shift Closings</Link> },
      { key: '/cash/deposits', label: <Link to="/cash/deposits">Bank Deposits</Link> },
      { key: '/cash/petty', label: <Link to="/cash/petty">Petty Cash</Link> },
    ],
  },
  {
    key: 'finance',
    icon: <DollarOutlined />,
    label: 'Finance',
    children: [
      { key: '/finance/overview', label: <Link to="/finance/overview">Financial Overview</Link> },
      { key: '/finance/receivables', label: <Link to="/finance/receivables">Accounts Receivable</Link> },
      { key: '/finance/payables', label: <Link to="/finance/payables">Accounts Payable</Link> },
      { key: '/finance/bank', label: <Link to="/finance/bank">Bank Reconciliation</Link> },
      { key: '/finance/expenses', label: <Link to="/finance/expenses">Expenses</Link> },
    ],
  },

  // ==================== ACCOUNTING ====================
  // Double-entry bookkeeping - fed by Finance transactions
  {
    key: 'accounting',
    icon: <CalculatorOutlined />,
    label: 'Accounting',
    children: [
      { key: '/accounting/chart', label: <Link to="/accounting/chart">Chart of Accounts</Link> },
      { key: '/accounting/journal', label: <Link to="/accounting/journal">Journal Entries</Link> },
      { key: '/accounting/ledger', label: <Link to="/accounting/ledger">General Ledger</Link> },
      { key: '/accounting/trial-balance', label: <Link to="/accounting/trial-balance">Trial Balance</Link> },
      { key: '/accounting/balance-sheet', label: <Link to="/accounting/balance-sheet">Balance Sheet</Link> },
      { key: '/accounting/income-statement', label: <Link to="/accounting/income-statement">Income Statement</Link> },
      { key: '/accounting/cash-flow', label: <Link to="/accounting/cash-flow">Cash Flow Statement</Link> },
    ],
  },
  {
    key: 'budgeting',
    icon: <FundOutlined />,
    label: 'Budgeting',
    children: [
      { key: '/budgeting/plans', label: <Link to="/budgeting/plans">Budget Planning</Link> },
      { key: '/budgeting/tracking', label: <Link to="/budgeting/tracking">Budget vs Actual</Link> },
      { key: '/budgeting/forecasts', label: <Link to="/budgeting/forecasts">Forecasting</Link> },
    ],
  },
  {
    key: 'tax',
    icon: <PercentageOutlined />,
    label: 'Tax',
    children: [
      { key: '/tax/rates', label: <Link to="/tax/rates">Tax Rates</Link> },
      { key: '/tax/vat', label: <Link to="/tax/vat">VAT/GST</Link> },
      { key: '/tax/withholding', label: <Link to="/tax/withholding">Withholding Tax</Link> },
      { key: '/tax/filings', label: <Link to="/tax/filings">Tax Filings</Link> },
    ],
  },

  // ==================== FIXED ASSETS ====================
  // Asset lifecycle: Acquisition → Depreciation → Disposal
  {
    key: 'assets',
    icon: <BankOutlined />,
    label: 'Fixed Assets',
    children: [
      { key: '/assets', label: <Link to="/assets">Asset Register</Link> },
      { key: '/assets/categories', label: <Link to="/assets/categories">Asset Categories</Link> },
      { key: '/assets/depreciation', label: <Link to="/assets/depreciation">Depreciation</Link> },
      { key: '/assets/maintenance', label: <Link to="/assets/maintenance">Maintenance Schedule</Link> },
      { key: '/assets/disposal', label: <Link to="/assets/disposal">Asset Disposal</Link> },
    ],
  },

  // ==================== HUMAN RESOURCES ====================
  // Employee lifecycle: Onboarding → Attendance → Payroll → Offboarding
  {
    key: 'hr',
    icon: <SolutionOutlined />,
    label: 'Human Resources',
    children: [
      { key: '/hr/employees', label: <Link to="/hr/employees">Employees</Link> },
      { key: '/hr/departments', label: <Link to="/hr/departments">Departments</Link> },
      { key: '/hr/positions', label: <Link to="/hr/positions">Positions</Link> },
      { key: '/hr/attendance', label: <Link to="/hr/attendance">Time & Attendance</Link> },
      { key: '/hr/leave', label: <Link to="/hr/leave">Leave Management</Link> },
      { key: '/hr/payroll', label: <Link to="/hr/payroll">Payroll</Link> },
      { key: '/hr/benefits', label: <Link to="/hr/benefits">Benefits</Link> },
    ],
  },

  // ==================== WARRANTY & AFTER-SALES ====================
  // Product support: Warranty registration → Claims → Service
  {
    key: 'warranty',
    icon: <FieldTimeOutlined />,
    label: 'Warranty & Service',
    children: [
      { key: '/warranty/registrations', label: <Link to="/warranty/registrations">Registrations</Link> },
      { key: '/warranty/claims', label: <Link to="/warranty/claims">Claims</Link> },
      { key: '/warranty/service', label: <Link to="/warranty/service">Service Jobs</Link> },
    ],
  },

  // ==================== REPORTS & ANALYTICS ====================
  // Business Intelligence - consolidates data from all modules
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
    children: [
      { key: '/reports/sales', label: <Link to="/reports/sales">Sales Reports</Link> },
      { key: '/reports/inventory', label: <Link to="/reports/inventory">Inventory Reports</Link> },
      { key: '/reports/purchasing', label: <Link to="/reports/purchasing">Purchasing Reports</Link> },
      { key: '/reports/financial', label: <Link to="/reports/financial">Financial Reports</Link> },
      { key: '/reports/hr', label: <Link to="/reports/hr">HR Reports</Link> },
      { key: '/reports/custom', label: <Link to="/reports/custom">Report Builder</Link> },
    ],
  },
  {
    key: 'analytics',
    icon: <LineChartOutlined />,
    label: 'Analytics',
    children: [
      { key: '/analytics/dashboards', label: <Link to="/analytics/dashboards">Custom Dashboards</Link> },
      { key: '/analytics/kpis', label: <Link to="/analytics/kpis">KPI Tracking</Link> },
      { key: '/analytics/trends', label: <Link to="/analytics/trends">Trend Analysis</Link> },
    ],
  },

  // ==================== WORKFLOW & APPROVALS ====================
  // Cross-module approval workflows
  {
    key: 'workflow',
    icon: <NodeIndexOutlined />,
    label: 'Approvals',
    children: [
      { key: '/workflow/pending', label: <Link to="/workflow/pending">My Pending</Link> },
      { key: '/workflow/submitted', label: <Link to="/workflow/submitted">My Submitted</Link> },
      { key: '/workflow/rules', label: <Link to="/workflow/rules">Approval Rules</Link> },
    ],
  },

  // ==================== DOCUMENT MANAGEMENT ====================
  {
    key: 'documents',
    icon: <FolderOutlined />,
    label: 'Documents',
    children: [
      { key: '/documents', label: <Link to="/documents">File Manager</Link> },
      { key: '/documents/templates', label: <Link to="/documents/templates">Document Templates</Link> },
    ],
  },

  // ==================== COMPLIANCE & AUDIT ====================
  {
    key: 'compliance',
    icon: <FileDoneOutlined />,
    label: 'Compliance',
    children: [
      { key: '/compliance/regulations', label: <Link to="/compliance/regulations">Regulations</Link> },
      { key: '/compliance/certifications', label: <Link to="/compliance/certifications">Certifications</Link> },
      { key: '/compliance/audits', label: <Link to="/compliance/audits">Audit Schedules</Link> },
    ],
  },

  // ==================== SELF-SERVICE PORTALS ====================
  {
    key: 'portals',
    icon: <GlobalOutlined />,
    label: 'Self-Service Portals',
    children: [
      { key: '/portals/customer', label: <Link to="/portals/customer">Customer Portal</Link> },
      { key: '/portals/vendor', label: <Link to="/portals/vendor">Vendor Portal</Link> },
      { key: '/portals/employee', label: <Link to="/portals/employee">Employee Portal</Link> },
    ],
  },

  // ==================== SYSTEM ADMINISTRATION ====================
  {
    key: 'admin',
    icon: <SettingOutlined />,
    label: 'Administration',
    children: [
      { key: '/admin/users', label: <Link to="/admin/users">Users</Link> },
      { key: '/admin/roles', label: <Link to="/admin/roles">Roles & Permissions</Link> },
      { key: '/admin/settings', label: <Link to="/admin/settings">System Settings</Link> },
      { key: '/admin/audit-logs', label: <Link to="/admin/audit-logs">Audit Logs</Link> },
      { key: '/admin/notifications', label: <Link to="/admin/notifications">Notification Settings</Link> },
    ],
  },
  {
    key: 'integrations',
    icon: <ApiOutlined />,
    label: 'Integrations',
    children: [
      { key: '/integrations/apps', label: <Link to="/integrations/apps">Connected Apps</Link> },
      { key: '/integrations/api', label: <Link to="/integrations/api">API Management</Link> },
      { key: '/integrations/import-export', label: <Link to="/integrations/import-export">Import/Export</Link> },
    ],
  },
  {
    key: 'help',
    icon: <QuestionCircleOutlined />,
    label: 'Help & Support',
    children: [
      { key: '/help/knowledge-base', label: <Link to="/help/knowledge-base">Knowledge Base</Link> },
      { key: '/help/faqs', label: <Link to="/help/faqs">FAQs</Link> },
      { key: '/help/tickets', label: <Link to="/help/tickets">Support Tickets</Link> },
    ],
  },
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#001529',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Text
            strong
            style={{
              color: '#fff',
              fontSize: sidebarCollapsed ? 16 : 20,
              transition: 'all 0.2s',
            }}
          >
            {sidebarCollapsed ? 'ERP' : 'ERP System'}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['inventory', 'sales', 'finance']}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{ fontSize: 16, width: 48, height: 48 }}
          />

          <Space size="middle">
            <Button type="text" icon={<BellOutlined />} style={{ fontSize: 18 }} />

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <span>{user?.username || 'User'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: '#f0f2f5',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
