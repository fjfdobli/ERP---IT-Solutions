import { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Input,
  Button,
  Space,
  Dropdown,
  Tag,
  Typography,
  Tooltip,
  Popconfirm,
  Badge,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

/**
 * DataTable Component
 * Feature-rich data table with search, filters, pagination, and row actions
 */
const DataTable = ({
  // Data
  columns: propColumns = [],
  dataSource = [],
  rowKey = 'id',
  loading = false,
  
  // Pagination
  pagination = true,
  pageSize = 20,
  total,
  currentPage = 1,
  onPageChange,
  
  // Selection
  selectable = false,
  selectedRowKeys = [],
  onSelectionChange,
  
  // Search
  searchable = true,
  searchPlaceholder = 'Search...',
  searchFields = [],
  onSearch,
  
  // Actions
  onView,
  onEdit,
  onDelete,
  actions = [], // Custom actions [{ key, label, icon, onClick, danger, confirm }]
  
  // Bulk Actions
  bulkActions = [], // [{ key, label, icon, onClick, danger }]
  
  // Refresh
  onRefresh,
  
  // Export
  onExport,
  exportFormats = ['excel', 'csv', 'pdf'],
  
  // Row expansion
  expandable,
  
  // Row click
  onRowClick,
  
  // Empty state
  emptyText = 'No data available',
  emptyDescription,
  
  // Styling
  bordered = false,
  size = 'middle', // 'small', 'middle', 'large'
  scroll,
  sticky = false,
  showHeader = true,
  className = '',
  style = {},
  cardStyle = {},
}) => {
  const [searchText, setSearchText] = useState('');
  const [tableDensity, setTableDensity] = useState(size);

  // Build row actions column
  const actionsColumn = useMemo(() => {
    const hasActions = onView || onEdit || onDelete || actions.length > 0;
    if (!hasActions) return null;

    const actionItems = [];
    
    if (onView) {
      actionItems.push({
        key: 'view',
        label: 'View',
        icon: <EyeOutlined />,
        onClick: (record) => onView(record),
      });
    }
    
    if (onEdit) {
      actionItems.push({
        key: 'edit',
        label: 'Edit',
        icon: <EditOutlined />,
        onClick: (record) => onEdit(record),
      });
    }

    // Add custom actions
    actions.forEach(action => actionItems.push(action));

    if (onDelete) {
      actionItems.push({
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
        confirm: 'Are you sure you want to delete this item?',
        onClick: (record) => onDelete(record),
      });
    }

    return {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        if (actionItems.length === 1) {
          const action = actionItems[0];
          return (
            <Tooltip title={action.label}>
              <Button
                type="text"
                size="small"
                icon={action.icon}
                danger={action.danger}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(record);
                }}
              />
            </Tooltip>
          );
        }

        const menuItems = actionItems.map(action => ({
          key: action.key,
          label: action.confirm ? (
            <Popconfirm
              title={action.confirm}
              onConfirm={() => action.onClick(record)}
              okText="Yes"
              cancelText="No"
            >
              <Space>
                {action.icon}
                {action.label}
              </Space>
            </Popconfirm>
          ) : (
            <Space onClick={() => action.onClick(record)}>
              {action.icon}
              {action.label}
            </Space>
          ),
          danger: action.danger,
        }));

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    };
  }, [onView, onEdit, onDelete, actions]);

  // Build final columns
  const finalColumns = useMemo(() => {
    let cols = [...propColumns];
    if (actionsColumn) {
      cols.push(actionsColumn);
    }
    return cols;
  }, [propColumns, actionsColumn]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchText || searchFields.length === 0) {
      return dataSource;
    }

    const lowerSearch = searchText.toLowerCase();
    return dataSource.filter(record => {
      return searchFields.some(field => {
        const value = record[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerSearch);
      });
    });
  }, [dataSource, searchText, searchFields]);

  // Handle search input
  const handleSearch = (value) => {
    setSearchText(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle density change
  const densityItems = [
    { key: 'small', label: 'Compact' },
    { key: 'middle', label: 'Default' },
    { key: 'large', label: 'Comfortable' },
  ];

  // Export dropdown items
  const exportItems = exportFormats.map(format => ({
    key: format,
    label: format.toUpperCase(),
    onClick: () => onExport && onExport(format),
  }));

  // Selection config
  const rowSelection = selectable ? {
    selectedRowKeys,
    onChange: onSelectionChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  } : undefined;

  // Pagination config
  const paginationConfig = pagination ? {
    current: currentPage,
    pageSize: pageSize,
    total: total || filteredData.length,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    onChange: onPageChange,
    pageSizeOptions: ['10', '20', '50', '100'],
  } : false;

  // Table toolbar
  const tableToolbar = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
      }}
    >
      {/* Left side - Search and bulk actions */}
      <Space wrap>
        {searchable && (
          <Input.Search
            placeholder={searchPlaceholder}
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
        )}

        {/* Bulk actions when items selected */}
        {selectable && selectedRowKeys.length > 0 && (
          <Space>
            <Text type="secondary">
              {selectedRowKeys.length} selected
            </Text>
            {bulkActions.map(action => (
              <Button
                key={action.key}
                size="small"
                icon={action.icon}
                danger={action.danger}
                onClick={() => action.onClick(selectedRowKeys)}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        )}
      </Space>

      {/* Right side - Actions */}
      <Space>
        {onRefresh && (
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined spin={loading} />}
              onClick={onRefresh}
            />
          </Tooltip>
        )}

        <Dropdown
          menu={{
            items: densityItems,
            selectedKeys: [tableDensity],
            onClick: ({ key }) => setTableDensity(key),
          }}
          trigger={['click']}
        >
          <Tooltip title="Density">
            <Button icon={<ColumnHeightOutlined />} />
          </Tooltip>
        </Dropdown>

        {onExport && (
          <Dropdown menu={{ items: exportItems }} trigger={['click']}>
            <Button icon={<DownloadOutlined />}>Export</Button>
          </Dropdown>
        )}
      </Space>
    </div>
  );

  const emptyState = (
    <Empty
      description={
        <div>
          <Text>{emptyText}</Text>
          {emptyDescription && (
            <div>
              <Text type="secondary">{emptyDescription}</Text>
            </div>
          )}
        </div>
      }
    />
  );

  return (
    <Card 
      className={`data-table-card ${className}`}
      style={{ ...cardStyle }}
      styles={{ body: { padding: '16px' } }}
    >
      {tableToolbar}
      
      <Table
        columns={finalColumns}
        dataSource={filteredData}
        rowKey={rowKey}
        loading={loading}
        pagination={paginationConfig}
        rowSelection={rowSelection}
        expandable={expandable}
        bordered={bordered}
        size={tableDensity}
        scroll={scroll}
        sticky={sticky}
        showHeader={showHeader}
        locale={{ emptyText: emptyState }}
        onRow={(record) => ({
          onClick: () => onRowClick && onRowClick(record),
          style: { cursor: onRowClick ? 'pointer' : 'default' },
        })}
        style={style}
      />
    </Card>
  );
};

export default DataTable;
