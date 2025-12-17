import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Drawer, Descriptions, 
  Avatar, Divider, Form, Progress, Statistic, Timeline, Switch
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  TrophyOutlined,
  StarOutlined,
  StarFilled,
  CrownOutlined,
  UserOutlined,
  RiseOutlined,
  SwapOutlined,
  HistoryOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;

// Mock loyalty tiers
const loyaltyTiers = [
  { name: 'Bronze', minPoints: 0, maxPoints: 999, color: '#cd7f32', discount: 0, multiplier: 1 },
  { name: 'Silver', minPoints: 1000, maxPoints: 4999, color: '#c0c0c0', discount: 2, multiplier: 1.25 },
  { name: 'Gold', minPoints: 5000, maxPoints: 14999, color: '#ffd700', discount: 5, multiplier: 1.5 },
  { name: 'Platinum', minPoints: 15000, maxPoints: 99999999, color: '#e5e4e2', discount: 10, multiplier: 2 },
];

// Mock loyalty members
const mockLoyaltyMembers = [
  {
    id: 'LYL001',
    customerId: 'CUST001',
    customerName: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '+63 917 123 4567',
    points: 2500,
    lifetimePoints: 15000,
    tier: 'Silver',
    pointsToNextTier: 2500,
    nextTier: 'Gold',
    status: 'active',
    joinDate: '2022-03-10',
    lastActivity: '2024-01-15',
    rewardsRedeemed: 5,
    totalSavings: 5000,
    pointsHistory: [
      { date: '2024-01-15', type: 'earned', points: 500, description: 'Purchase - MacBook Pro', orderId: 'ORD001' },
      { date: '2024-01-10', type: 'earned', points: 150, description: 'Purchase - AirPods Pro', orderId: 'ORD002' },
      { date: '2024-01-05', type: 'redeemed', points: -500, description: 'Reward: ₱500 Discount', rewardId: 'RWD001' },
    ],
  },
  {
    id: 'LYL002',
    customerId: 'CUST003',
    customerName: 'Pedro Reyes',
    email: 'pedro.reyes@company.com',
    phone: '+63 919 345 6789',
    points: 5000,
    lifetimePoints: 35000,
    tier: 'Gold',
    pointsToNextTier: 10000,
    nextTier: 'Platinum',
    status: 'active',
    joinDate: '2021-08-20',
    lastActivity: '2024-01-13',
    rewardsRedeemed: 12,
    totalSavings: 15000,
    pointsHistory: [
      { date: '2024-01-13', type: 'earned', points: 2500, description: 'Bulk Purchase - Samsung S24', orderId: 'ORD003' },
      { date: '2024-01-05', type: 'redeemed', points: -2000, description: 'Reward: Free Shipping', rewardId: 'RWD002' },
    ],
  },
  {
    id: 'LYL003',
    customerId: 'CUST005',
    customerName: 'Carlos Tan',
    email: 'carlos.tan@business.com',
    phone: '+63 921 567 8901',
    points: 10400,
    lifetimePoints: 52000,
    tier: 'Gold',
    pointsToNextTier: 4600,
    nextTier: 'Platinum',
    status: 'active',
    joinDate: '2020-11-12',
    lastActivity: '2024-01-11',
    rewardsRedeemed: 18,
    totalSavings: 26000,
    pointsHistory: [
      { date: '2024-01-11', type: 'earned', points: 1500, description: 'Purchase - Dell Monitors', orderId: 'ORD004' },
      { date: '2024-01-05', type: 'earned', points: 900, description: 'Purchase - Network Equipment', orderId: 'ORD005' },
    ],
  },
  {
    id: 'LYL004',
    customerId: 'CUST002',
    customerName: 'Maria Santos',
    email: 'maria.santos@gmail.com',
    phone: '+63 918 234 5678',
    points: 900,
    lifetimePoints: 4500,
    tier: 'Bronze',
    pointsToNextTier: 100,
    nextTier: 'Silver',
    status: 'active',
    joinDate: '2023-01-15',
    lastActivity: '2024-01-14',
    rewardsRedeemed: 2,
    totalSavings: 1000,
    pointsHistory: [
      { date: '2024-01-14', type: 'earned', points: 100, description: 'Purchase - iPhone Case', orderId: 'ORD006' },
    ],
  },
  {
    id: 'LYL005',
    customerId: 'CUST007',
    customerName: 'Roberto Lim',
    email: 'roberto.lim@shop.com',
    phone: '+63 923 789 0123',
    points: 3600,
    lifetimePoints: 18000,
    tier: 'Silver',
    pointsToNextTier: 1400,
    nextTier: 'Gold',
    status: 'active',
    joinDate: '2022-07-14',
    lastActivity: '2024-01-10',
    rewardsRedeemed: 8,
    totalSavings: 9000,
    pointsHistory: [
      { date: '2024-01-10', type: 'earned', points: 700, description: 'Purchase - Accessories Bundle', orderId: 'ORD007' },
    ],
  },
  {
    id: 'LYL006',
    customerId: 'CUST006',
    customerName: 'Lisa Wong',
    email: 'lisa.wong@email.com',
    phone: '+63 922 678 9012',
    points: 170,
    lifetimePoints: 850,
    tier: 'Bronze',
    pointsToNextTier: 830,
    nextTier: 'Silver',
    status: 'inactive',
    joinDate: '2023-02-28',
    lastActivity: '2023-08-20',
    rewardsRedeemed: 0,
    totalSavings: 0,
    pointsHistory: [
      { date: '2023-08-20', type: 'earned', points: 70, description: 'Purchase - Wireless Earbuds', orderId: 'ORD008' },
    ],
  },
];

// Mock rewards catalog for reference
const REWARDS_CATALOG = [
  { id: 'R001', name: '₱100 Discount', pointsCost: 100, category: 'Discount', status: 'active' },
  { id: 'R002', name: '₱500 Discount', pointsCost: 500, category: 'Discount', status: 'active' },
  { id: 'R003', name: '₱1,000 Discount', pointsCost: 1000, category: 'Discount', status: 'active' },
  { id: 'R004', name: 'Free Shipping', pointsCost: 200, category: 'Shipping', status: 'active' },
  { id: 'R005', name: 'Priority Support', pointsCost: 300, category: 'Service', status: 'active' },
  { id: 'R006', name: 'Exclusive Product Access', pointsCost: 2000, category: 'Access', status: 'active' },
];

const LoyaltyProgram = () => {
  const [members, setMembers] = useState(mockLoyaltyMembers);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterTier, setFilterTier] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [adjustDrawerVisible, setAdjustDrawerVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [adjustForm] = Form.useForm();

  // Calculate stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
  const totalSavings = members.reduce((sum, m) => sum + m.totalSavings, 0);

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = !searchText || 
      member.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      member.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesTier = !filterTier || member.tier === filterTier;
    const matchesStatus = !filterStatus || member.status === filterStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierColor = (tier) => {
    const tierData = loyaltyTiers.find(t => t.name === tier);
    return tierData?.color || '#000';
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Platinum': return <CrownOutlined />;
      case 'Gold': return <TrophyOutlined />;
      case 'Silver': return <StarFilled />;
      default: return <StarOutlined />;
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Member',
      key: 'member',
      width: 220,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            style={{ backgroundColor: getTierColor(record.tier) }}
          >
            {record.customerName.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <Text strong>{record.customerName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      width: 120,
      render: (tier) => (
        <Tag 
          icon={getTierIcon(tier)} 
          style={{ 
            backgroundColor: `${getTierColor(tier)}20`, 
            color: getTierColor(tier),
            borderColor: getTierColor(tier),
          }}
        >
          {tier}
        </Tag>
      ),
    },
    {
      title: 'Current Points',
      dataIndex: 'points',
      key: 'points',
      width: 130,
      align: 'right',
      render: (points) => (
        <Text strong style={{ color: '#52c41a' }}>
          {points.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: 'Lifetime Points',
      dataIndex: 'lifetimePoints',
      key: 'lifetimePoints',
      width: 140,
      align: 'right',
      render: (points) => points.toLocaleString(),
      sorter: (a, b) => a.lifetimePoints - b.lifetimePoints,
    },
    {
      title: 'Next Tier Progress',
      key: 'progress',
      width: 180,
      render: (_, record) => {
        const currentTierData = loyaltyTiers.find(t => t.name === record.tier);
        const nextTierData = loyaltyTiers.find(t => t.name === record.nextTier);
        if (!nextTierData || record.tier === 'Platinum') {
          return <Text type="secondary">Max tier reached</Text>;
        }
        const progress = Math.round(((record.lifetimePoints - currentTierData.minPoints) / (nextTierData.minPoints - currentTierData.minPoints)) * 100);
        return (
          <div>
            <Progress percent={Math.min(100, progress)} size="small" strokeColor={getTierColor(record.nextTier)} />
            <Text type="secondary" style={{ fontSize: 10 }}>
              {record.pointsToNextTier.toLocaleString()} pts to {record.nextTier}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Rewards Redeemed',
      dataIndex: 'rewardsRedeemed',
      key: 'rewardsRedeemed',
      width: 130,
      align: 'center',
    },
    {
      title: 'Total Savings',
      dataIndex: 'totalSavings',
      key: 'totalSavings',
      width: 120,
      align: 'right',
      render: (amount) => <Text type="success">₱{amount.toLocaleString()}</Text>,
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      width: 110,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Adjust Points">
            <Button 
              type="text" 
              icon={<SwapOutlined />}
              onClick={() => handleAdjustPoints(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setDetailDrawerVisible(true);
  };

  const handleAdjustPoints = (member) => {
    setSelectedMember(member);
    adjustForm.resetFields();
    setAdjustDrawerVisible(true);
  };

  const handleSaveAdjustment = () => {
    adjustForm.validateFields().then(values => {
      const adjustment = values.type === 'add' ? values.points : -values.points;
      const updatedMembers = members.map(m => {
        if (m.id === selectedMember.id) {
          const newPoints = Math.max(0, m.points + adjustment);
          const newLifetime = values.type === 'add' ? m.lifetimePoints + values.points : m.lifetimePoints;
          // Determine new tier
          const newTierData = loyaltyTiers.find(t => newLifetime >= t.minPoints && newLifetime <= t.maxPoints);
          const nextTierData = loyaltyTiers.find(t => t.minPoints > newLifetime);
          return {
            ...m,
            points: newPoints,
            lifetimePoints: newLifetime,
            tier: newTierData?.name || m.tier,
            nextTier: nextTierData?.name || null,
            pointsToNextTier: nextTierData ? nextTierData.minPoints - newLifetime : 0,
            pointsHistory: [
              {
                date: dayjs().format('YYYY-MM-DD'),
                type: values.type === 'add' ? 'earned' : 'adjustment',
                points: adjustment,
                description: values.reason,
              },
              ...m.pointsHistory,
            ],
          };
        }
        return m;
      });
      setMembers(updatedMembers);
      message.success('Points adjusted successfully');
      setAdjustDrawerVisible(false);
    });
  };

  // Adjustment form fields
  const adjustFields = [
    {
      name: 'type',
      label: 'Adjustment Type',
      type: 'select',
      options: [
        { label: 'Add Points', value: 'add' },
        { label: 'Deduct Points', value: 'deduct' },
      ],
      rules: [{ required: true, message: 'Please select adjustment type' }],
      span: 24,
    },
    {
      name: 'points',
      label: 'Points',
      type: 'number',
      placeholder: 'Enter points',
      rules: [{ required: true, message: 'Please enter points' }],
      span: 24,
    },
    {
      name: 'reason',
      label: 'Reason',
      type: 'textarea',
      placeholder: 'Reason for adjustment',
      rules: [{ required: true, message: 'Please enter reason' }],
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Loyalty Program"
        subtitle={`${filteredMembers.length} members`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Customers', path: '/customers' },
          { title: 'Loyalty Program', path: '/customers/loyalty' },
        ]}
        actions={[
          <Button key="rewards" icon={<GiftOutlined />}>Rewards Catalog</Button>,
          <Button key="settings" icon={<SettingOutlined />}>Settings</Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Members"
            value={totalMembers}
            icon={<UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Members"
            value={activeMembers}
            icon={<UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Points Outstanding"
            value={totalPoints.toLocaleString()}
            icon={<StarFilled style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Customer Savings"
            value={`₱${totalSavings.toLocaleString()}`}
            icon={<GiftOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Tier Overview Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {loyaltyTiers.map(tier => {
          const tierMembers = members.filter(m => m.tier === tier.name);
          return (
            <Col xs={12} sm={6} key={tier.name}>
              <Card 
                size="small" 
                style={{ borderTop: `3px solid ${tier.color}` }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Badge 
                    count={tierMembers.length} 
                    style={{ backgroundColor: tier.color }}
                    overflowCount={999}
                  >
                    <Avatar 
                      size={40} 
                      style={{ 
                        backgroundColor: `${tier.color}20`, 
                        color: tier.color,
                        border: `2px solid ${tier.color}`,
                      }}
                    >
                      {tier.name === 'Platinum' ? <CrownOutlined /> :
                       tier.name === 'Gold' ? <TrophyOutlined /> :
                       tier.name === 'Silver' ? <StarFilled /> : <StarOutlined />}
                    </Avatar>
                  </Badge>
                  <div style={{ marginTop: 8 }}>
                    <Text strong>{tier.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {tier.discount}% discount • {tier.multiplier}x points
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search members..."
              allowClear
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Tier"
              allowClear
              style={{ width: 120 }}
              value={filterTier}
              onChange={setFilterTier}
              options={loyaltyTiers.map(t => ({ label: t.name, value: t.name }))}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 120 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredMembers}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} members`,
          }}
        />
      </Card>

      {/* Details Drawer */}
      <Drawer
        title="Member Details"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Button 
            icon={<SwapOutlined />}
            onClick={() => {
              setDetailDrawerVisible(false);
              handleAdjustPoints(selectedMember);
            }}
          >
            Adjust Points
          </Button>
        }
      >
        {selectedMember && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: getTierColor(selectedMember.tier),
                  fontSize: 28,
                }}
              >
                {selectedMember.customerName.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedMember.customerName}
              </Title>
              <Tag 
                icon={getTierIcon(selectedMember.tier)}
                style={{ 
                  backgroundColor: `${getTierColor(selectedMember.tier)}20`, 
                  color: getTierColor(selectedMember.tier),
                  borderColor: getTierColor(selectedMember.tier),
                  fontSize: 14,
                  padding: '4px 12px',
                }}
              >
                {selectedMember.tier} Member
              </Tag>
            </div>

            {/* Points Overview */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Current Points" 
                    value={selectedMember.points} 
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Lifetime Points" 
                    value={selectedMember.lifetimePoints}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Total Savings" 
                    value={selectedMember.totalSavings}
                    prefix="₱"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            {selectedMember.tier !== 'Platinum' && (
              <Card size="small" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Progress to {selectedMember.nextTier}</Text>
                  <Text strong>{selectedMember.pointsToNextTier.toLocaleString()} points needed</Text>
                </div>
                <Progress 
                  percent={100 - Math.round((selectedMember.pointsToNextTier / (loyaltyTiers.find(t => t.name === selectedMember.nextTier)?.minPoints - loyaltyTiers.find(t => t.name === selectedMember.tier)?.minPoints || 1)) * 100)}
                  strokeColor={getTierColor(selectedMember.nextTier)}
                />
              </Card>
            )}

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Member ID">{selectedMember.id}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedMember.status === 'active' ? 'success' : 'default'}>
                  {selectedMember.status === 'active' ? 'Active' : 'Inactive'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Email">{selectedMember.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedMember.phone}</Descriptions.Item>
              <Descriptions.Item label="Member Since">
                {dayjs(selectedMember.joinDate).format('MMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Activity">
                {dayjs(selectedMember.lastActivity).format('MMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Rewards Redeemed">
                {selectedMember.rewardsRedeemed}
              </Descriptions.Item>
              <Descriptions.Item label="Tier Benefits">
                {loyaltyTiers.find(t => t.name === selectedMember.tier)?.discount}% discount, {loyaltyTiers.find(t => t.name === selectedMember.tier)?.multiplier}x points
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Points History</Divider>
            <Timeline
              items={selectedMember.pointsHistory.map(h => ({
                color: h.type === 'earned' ? 'green' : h.type === 'redeemed' ? 'red' : 'blue',
                children: (
                  <div>
                    <Text strong>{h.description}</Text>
                    <br />
                    <Space>
                      <Text type="secondary">{dayjs(h.date).format('MMM D, YYYY')}</Text>
                      <Text type={h.points > 0 ? 'success' : 'danger'}>
                        {h.points > 0 ? '+' : ''}{h.points.toLocaleString()} pts
                      </Text>
                    </Space>
                  </div>
                ),
              }))}
            />
          </>
        )}
      </Drawer>

      {/* Adjust Points Drawer */}
      <FormDrawer
        title={`Adjust Points - ${selectedMember?.customerName}`}
        open={adjustDrawerVisible}
        onClose={() => setAdjustDrawerVisible(false)}
        onSubmit={handleSaveAdjustment}
        form={adjustForm}
        fields={adjustFields}
        width={400}
        submitText="Apply Adjustment"
        extra={
          selectedMember && (
            <div style={{ marginBottom: 16 }}>
              <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Current Points:</Text>
                    <Text strong style={{ color: '#52c41a' }}>{selectedMember.points.toLocaleString()}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Tier:</Text>
                    <Tag style={{ margin: 0, backgroundColor: `${getTierColor(selectedMember.tier)}20`, color: getTierColor(selectedMember.tier) }}>
                      {selectedMember.tier}
                    </Tag>
                  </div>
                </Space>
              </Card>
            </div>
          )
        }
      />
    </div>
  );
};

export default LoyaltyProgram;
