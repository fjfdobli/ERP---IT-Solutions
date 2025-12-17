import { Card, Statistic, Progress, Tooltip, Space, Typography } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const StatCard = ({
  title,
  value,
  prefix,
  suffix,
  precision = 0,
  icon,
  trend,
  trendValue,
  trendSuffix = '%',
  progress,
  progressColor,
  loading = false,
  color,
  backgroundColor,
  bordered = true,
  hoverable = false,
  size = 'default', 
  tooltip,
  onClick,
  footer,
  extra,
  className = '',
  style = {},
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return '#52c41a';
    if (trend === 'down') return '#ff4d4f';
    return '#8c8c8c';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpOutlined />;
    if (trend === 'down') return <ArrowDownOutlined />;
    return null;
  };

  const sizeConfig = {
    small: { padding: 12, fontSize: 20 },
    default: { padding: 16, fontSize: 24 },
    large: { padding: 20, fontSize: 32 },
  };

  const config = sizeConfig[size] || sizeConfig.default;

  const cardContent = (
    <Card
      bordered={bordered}
      hoverable={hoverable || !!onClick}
      loading={loading}
      onClick={onClick}
      className={`stat-card ${className}`}
      style={{
        backgroundColor: backgroundColor,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      styles={{
        body: { padding: config.padding },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Space size={4} style={{ marginBottom: 8 }}>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {title}
            </Text>
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoCircleOutlined style={{ color: '#bfbfbf', fontSize: 12 }} />
              </Tooltip>
            )}
          </Space>

          <Statistic
            value={value}
            precision={precision}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ 
              color: color, 
              fontSize: config.fontSize,
              fontWeight: 600,
            }}
          />

          {trend && trendValue !== undefined && (
            <Space size={4} style={{ marginTop: 8 }}>
              <Text style={{ color: getTrendColor(), fontSize: 13 }}>
                {getTrendIcon()}
                <span style={{ marginLeft: 4 }}>
                  {trendValue}{trendSuffix}
                </span>
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                vs last period
              </Text>
            </Space>
          )}

          {progress !== undefined && (
            <Progress
              percent={progress}
              showInfo={false}
              strokeColor={progressColor || color}
              size="small"
              style={{ marginTop: 8 }}
            />
          )}

          {footer && (
            <div style={{ marginTop: 12 }}>
              {footer}
            </div>
          )}
        </div>

        {icon && (
          <div
            style={{
              fontSize: 40,
              color: color || '#667eea',
              opacity: 0.15,
              marginLeft: 16,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {extra && (
        <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
          {extra}
        </div>
      )}
    </Card>
  );

  return cardContent;
};

export const StatCardGroup = ({ children, gutter = 16 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: gutter,
        marginBottom: 24,
      }}
    >
      {children}
    </div>
  );
};

export default StatCard;
