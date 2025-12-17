import { Typography, Space, Button, Breadcrumb, Tooltip } from 'antd';
import { 
  ArrowLeftOutlined, 
  ReloadOutlined, 
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  PrinterOutlined,
  FilterOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  showBack = false,
  onBack,
  actions = [],
  onAdd,
  addText = 'Add New',
  onRefresh,
  onExport,
  onImport,
  onPrint,
  onFilter,
  onSettings,
  loading = false,
  extra,
  children,
  className = '',
  style = {},
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Build quick actions from props
  const quickActions = [];
  
  if (onAdd) {
    quickActions.push(
      <Button 
        key="add" 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={onAdd}
      >
        {addText}
      </Button>
    );
  }

  if (onRefresh) {
    quickActions.push(
      <Tooltip key="refresh" title="Refresh">
        <Button 
          icon={<ReloadOutlined spin={loading} />}
          onClick={onRefresh}
          loading={loading}
        />
      </Tooltip>
    );
  }

  if (onExport) {
    quickActions.push(
      <Tooltip key="export" title="Export">
        <Button icon={<DownloadOutlined />} onClick={onExport} />
      </Tooltip>
    );
  }

  if (onImport) {
    quickActions.push(
      <Tooltip key="import" title="Import">
        <Button icon={<UploadOutlined />} onClick={onImport} />
      </Tooltip>
    );
  }

  if (onPrint) {
    quickActions.push(
      <Tooltip key="print" title="Print">
        <Button icon={<PrinterOutlined />} onClick={onPrint} />
      </Tooltip>
    );
  }

  if (onFilter) {
    quickActions.push(
      <Tooltip key="filter" title="Filters">
        <Button icon={<FilterOutlined />} onClick={onFilter} />
      </Tooltip>
    );
  }

  if (onSettings) {
    quickActions.push(
      <Tooltip key="settings" title="Settings">
        <Button icon={<SettingOutlined />} onClick={onSettings} />
      </Tooltip>
    );
  }

  const allActions = [...quickActions, ...actions];

  return (
    <div 
      className={`page-header ${className}`}
      style={{
        marginBottom: 24,
        ...style,
      }}
    >
      {breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: 8 }}
          items={breadcrumbs.map((item, index) => ({
            key: index,
            title: item.path ? (
              <Link to={item.path}>{item.title}</Link>
            ) : (
              item.title
            ),
          }))}
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        
        <Space align="start">
          {showBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              style={{ marginRight: 8 }}
            />
          )}
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            {subtitle && (
              <Text type="secondary" style={{ fontSize: 14 }}>
                {subtitle}
              </Text>
            )}
          </div>
        </Space>

        {(allActions.length > 0 || extra) && (
          <Space wrap>
            {extra}
            {allActions}
          </Space>
        )}
      </div>

      {children && (
        <div style={{ marginTop: 16 }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
