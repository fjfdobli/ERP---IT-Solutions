import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tag,
  Typography,
  Row,
  Col,
  Tooltip,
  Checkbox,
  Tabs,
  Descriptions,
  List,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewingRole, setViewingRole] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch roles
  const {
    data: rolesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.getAll(),
  });

  // Fetch permissions
  const { data: permissionsData } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => rolesApi.getPermissions(),
  });

  // Create role mutation
  const createMutation = useMutation({
    mutationFn: (data) => rolesApi.create(data),
    onSuccess: () => {
      message.success('Role created successfully');
      queryClient.invalidateQueries(['roles']);
      handleCloseModal();
    },
    onError: (error) => {
      message.error(error.response?.data?.error || 'Failed to create role');
    },
  });

  const handleOpenModal = (role = null) => {
    setEditingRole(role);
    if (role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permission_ids: role.permissions?.map((p) => p.id) || [],
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    form.resetFields();
  };

  const handleViewRole = (role) => {
    setViewingRole(role);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (values) => {
    createMutation.mutate(values);
  };

  // Group permissions by category
  const groupedPermissions = permissionsData?.permissions?.reduce((acc, perm) => {
    const category = perm.name.split(':')[0] || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(perm);
    return acc;
  }, {});

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Tag color="blue">{name}</Tag>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Text type="secondary">
          {permissions?.length || 0} permissions
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewRole(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Role"
            description="Are you sure you want to delete this role?"
            onConfirm={() => message.info('Delete functionality coming soon')}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Roles & Permissions
          </Title>
          <Text type="secondary">Manage system roles and their permissions</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Add Role
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Roles"
            extra={
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Refresh
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={rolesData?.roles}
              rowKey="id"
              loading={isLoading}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Available Permissions">
            <Tabs
              defaultActiveKey={Object.keys(groupedPermissions || {})[0]}
              items={Object.entries(groupedPermissions || {}).map(
                ([category, perms]) => ({
                  key: category,
                  label: `${category} (${perms.length})`,
                  children: (
                    <List
                      size="small"
                      dataSource={perms}
                      renderItem={(perm) => (
                        <List.Item>
                          <Text>{perm.name}</Text>
                        </List.Item>
                      )}
                    />
                  ),
                })
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal
        title={editingRole ? 'Edit Role' : 'Create Role'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item name="permission_ids" label="Permissions">
            <Checkbox.Group style={{ width: '100%' }}>
              {Object.entries(groupedPermissions || {}).map(
                ([category, perms]) => (
                  <div key={category} style={{ marginBottom: 16 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>
                      {category}
                    </Text>
                    <Row>
                      {perms.map((perm) => (
                        <Col span={12} key={perm.id}>
                          <Checkbox value={perm.id}>{perm.name}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )
              )}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending}
              >
                {editingRole ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Role Modal */}
      <Modal
        title="Role Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={
          <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
        }
        width={500}
      >
        {viewingRole && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Role Name">
                <Tag color="blue">{viewingRole.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {viewingRole.description || '-'}
              </Descriptions.Item>
            </Descriptions>
            <Title level={5} style={{ marginTop: 16 }}>
              Permissions ({viewingRole.permissions?.length || 0})
            </Title>
            <div>
              {viewingRole.permissions?.map((perm) => (
                <Tag key={perm.id} style={{ marginBottom: 8 }}>
                  {perm.name}
                </Tag>
              ))}
              {(!viewingRole.permissions ||
                viewingRole.permissions.length === 0) && (
                <Text type="secondary">No permissions assigned</Text>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Roles;
