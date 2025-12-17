import { Skeleton, Card, Row, Col, Space } from 'antd';

/**
 * PageSkeleton - Full page loading skeleton
 */
export const PageSkeleton = ({ 
  showStats = true, 
  statsCount = 4,
  showTable = true,
  tableRows = 5,
}) => (
  <div>
    {/* Header Skeleton */}
    <div style={{ marginBottom: 24 }}>
      <Skeleton.Input active style={{ width: 200, marginBottom: 8 }} />
      <Skeleton.Input active size="small" style={{ width: 300 }} />
    </div>

    {/* Stats Cards Skeleton */}
    {showStats && (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {Array(statsCount).fill(null).map((_, index) => (
          <Col span={24 / statsCount} key={index}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>
    )}

    {/* Table Skeleton */}
    {showTable && (
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Skeleton.Input active style={{ width: 250, marginBottom: 16 }} />
          {Array(tableRows).fill(null).map((_, index) => (
            <Skeleton active key={index} paragraph={{ rows: 0 }} />
          ))}
        </Space>
      </Card>
    )}
  </div>
);

/**
 * TableSkeleton - Table loading skeleton
 */
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div>
    {/* Table Header */}
    <div style={{ display: 'flex', gap: 16, marginBottom: 16, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
      {Array(columns).fill(null).map((_, index) => (
        <Skeleton.Input key={index} active size="small" style={{ flex: 1 }} />
      ))}
    </div>
    
    {/* Table Rows */}
    {Array(rows).fill(null).map((_, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {Array(columns).fill(null).map((_, colIndex) => (
          <Skeleton.Input key={colIndex} active size="small" style={{ flex: 1 }} />
        ))}
      </div>
    ))}
  </div>
);

/**
 * CardSkeleton - Card loading skeleton
 */
export const CardSkeleton = ({ avatar = false, rows = 2 }) => (
  <Card>
    <Skeleton active avatar={avatar} paragraph={{ rows }} />
  </Card>
);

/**
 * FormSkeleton - Form loading skeleton
 */
export const FormSkeleton = ({ fields = 4, columns = 1 }) => (
  <div>
    <Row gutter={16}>
      {Array(fields).fill(null).map((_, index) => (
        <Col span={24 / columns} key={index} style={{ marginBottom: 24 }}>
          <Skeleton.Input active size="small" style={{ width: 100, marginBottom: 8 }} />
          <Skeleton.Input active style={{ width: '100%' }} />
        </Col>
      ))}
    </Row>
  </div>
);

/**
 * StatCardSkeleton - Stat card loading skeleton
 */
export const StatCardSkeleton = () => (
  <Card>
    <Skeleton.Input active size="small" style={{ width: 100, marginBottom: 12 }} />
    <Skeleton.Input active size="large" style={{ width: 150, marginBottom: 8 }} />
    <Skeleton.Input active size="small" style={{ width: 80 }} />
  </Card>
);

/**
 * DetailSkeleton - Detail view loading skeleton
 */
export const DetailSkeleton = ({ sections = 3 }) => (
  <div>
    {Array(sections).fill(null).map((_, index) => (
      <Card key={index} style={{ marginBottom: 16 }}>
        <Skeleton.Input active style={{ width: 150, marginBottom: 16 }} />
        <Row gutter={[16, 16]}>
          {Array(4).fill(null).map((_, i) => (
            <Col span={12} key={i}>
              <Skeleton.Input active size="small" style={{ width: 80, marginBottom: 4 }} />
              <Skeleton.Input active style={{ width: '100%' }} />
            </Col>
          ))}
        </Row>
      </Card>
    ))}
  </div>
);

export default PageSkeleton;
