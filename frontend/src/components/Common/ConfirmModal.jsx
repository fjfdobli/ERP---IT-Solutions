import { Modal, Typography, Space, Button, Result } from 'antd';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

/**
 * ConfirmModal - Reusable confirmation modal
 */
export const ConfirmModal = ({
  open,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  content,
  type = 'warning', // 'warning', 'danger', 'info'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 48 }} />;
      case 'info':
        return <CheckCircleOutlined style={{ color: '#1890ff', fontSize: 48 }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 48 }} />;
    }
  };

  const getConfirmButtonType = () => {
    return type === 'danger' ? 'primary' : 'primary';
  };

  const getConfirmButtonDanger = () => {
    return type === 'danger';
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={false}
      centered
      width={400}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {getIcon()}
        <Typography.Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
          {title}
        </Typography.Title>
        {content && (
          <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            {content}
          </Paragraph>
        )}
        <Space>
          <Button onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            type={getConfirmButtonType()}
            danger={getConfirmButtonDanger()}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

/**
 * DeleteConfirmModal - Specialized for delete operations
 */
export const DeleteConfirmModal = ({
  open,
  onConfirm,
  onCancel,
  itemName = 'item',
  loading = false,
}) => (
  <ConfirmModal
    open={open}
    onConfirm={onConfirm}
    onCancel={onCancel}
    title={`Delete ${itemName}?`}
    content={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
    type="danger"
    confirmText="Delete"
    loading={loading}
  />
);

/**
 * SuccessModal - Display success message
 */
export const SuccessModal = ({
  open,
  onClose,
  title = 'Success!',
  subTitle,
  extra,
}) => (
  <Modal
    open={open}
    onCancel={onClose}
    footer={null}
    centered
    width={400}
  >
    <Result
      status="success"
      title={title}
      subTitle={subTitle}
      extra={extra || (
        <Button type="primary" onClick={onClose}>
          Continue
        </Button>
      )}
    />
  </Modal>
);

/**
 * ErrorModal - Display error message
 */
export const ErrorModal = ({
  open,
  onClose,
  title = 'Error',
  subTitle,
  extra,
}) => (
  <Modal
    open={open}
    onCancel={onClose}
    footer={null}
    centered
    width={400}
  >
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      extra={extra || (
        <Button type="primary" onClick={onClose}>
          Close
        </Button>
      )}
    />
  </Modal>
);

export default ConfirmModal;
