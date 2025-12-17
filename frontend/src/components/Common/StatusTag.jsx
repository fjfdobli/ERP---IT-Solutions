import { Tag, Badge } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

export const StatusTag = ({ status, size = 'default' }) => {
  const statusConfig = {
    active: { color: 'success', icon: <CheckCircleOutlined />, text: 'Active' },
    inactive: { color: 'default', icon: <MinusCircleOutlined />, text: 'Inactive' },
    pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
    approved: { color: 'success', icon: <CheckCircleOutlined />, text: 'Approved' },
    rejected: { color: 'error', icon: <CloseCircleOutlined />, text: 'Rejected' },
    cancelled: { color: 'default', icon: <CloseCircleOutlined />, text: 'Cancelled' },
    draft: { color: 'default', icon: <MinusCircleOutlined />, text: 'Draft' },
    confirmed: { color: 'processing', icon: <SyncOutlined spin />, text: 'Confirmed' },
    processing: { color: 'processing', icon: <SyncOutlined spin />, text: 'Processing' },
    shipped: { color: 'cyan', icon: <SyncOutlined />, text: 'Shipped' },
    delivered: { color: 'success', icon: <CheckCircleOutlined />, text: 'Delivered' },
    returned: { color: 'orange', icon: <ExclamationCircleOutlined />, text: 'Returned' },
    paid: { color: 'success', icon: <CheckCircleOutlined />, text: 'Paid' },
    unpaid: { color: 'error', icon: <CloseCircleOutlined />, text: 'Unpaid' },
    partial: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Partial' },
    overdue: { color: 'error', icon: <ExclamationCircleOutlined />, text: 'Overdue' },
    refunded: { color: 'purple', icon: <SyncOutlined />, text: 'Refunded' },
    in_stock: { color: 'success', icon: <CheckCircleOutlined />, text: 'In Stock' },
    low_stock: { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Low Stock' },
    out_of_stock: { color: 'error', icon: <CloseCircleOutlined />, text: 'Out of Stock' },
    synced: { color: 'success', icon: <CheckCircleOutlined />, text: 'Synced' },
    syncing: { color: 'processing', icon: <SyncOutlined spin />, text: 'Syncing' },
    sync_error: { color: 'error', icon: <CloseCircleOutlined />, text: 'Sync Error' },
    yes: { color: 'success', icon: <CheckCircleOutlined />, text: 'Yes' },
    no: { color: 'error', icon: <CloseCircleOutlined />, text: 'No' },
    true: { color: 'success', icon: <CheckCircleOutlined />, text: 'Yes' },
    false: { color: 'error', icon: <CloseCircleOutlined />, text: 'No' },
  };

  const normalizedStatus = String(status).toLowerCase().replace(/[\s-]/g, '_');
  
  const config = statusConfig[normalizedStatus] || {
    color: 'default',
    text: String(status),
  };

  return (
    <Tag
      color={config.color}
      icon={config.icon}
      style={{
        fontSize: size === 'small' ? 11 : 12,
        padding: size === 'small' ? '0 4px' : '0 7px',
      }}
    >
      {config.text}
    </Tag>
  );
};

export const PriorityTag = ({ priority }) => {
  const priorityConfig = {
    critical: { color: '#f5222d', text: 'Critical' },
    high: { color: '#fa541c', text: 'High' },
    medium: { color: '#faad14', text: 'Medium' },
    low: { color: '#52c41a', text: 'Low' },
    none: { color: '#d9d9d9', text: 'None' },
  };

  const normalizedPriority = String(priority).toLowerCase();
  const config = priorityConfig[normalizedPriority] || priorityConfig.none;

  return (
    <Tag color={config.color}>
      {config.text}
    </Tag>
  );
};

export const CountBadge = ({ 
  count, 
  overflowCount = 99, 
  showZero = false,
  status,
  color,
  children,
}) => {
  return (
    <Badge
      count={count}
      overflowCount={overflowCount}
      showZero={showZero}
      status={status}
      color={color}
    >
      {children}
    </Badge>
  );
};

export const StockBadge = ({ quantity, reorderPoint = 10 }) => {
  let status = 'in_stock';
  if (quantity <= 0) {
    status = 'out_of_stock';
  } else if (quantity <= reorderPoint) {
    status = 'low_stock';
  }

  return (
    <span>
      <StatusTag status={status} size="small" />
      <span style={{ marginLeft: 8 }}>{quantity} units</span>
    </span>
  );
};

export default StatusTag;
