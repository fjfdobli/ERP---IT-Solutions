import { useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Collapse,
  Tag,
  Typography,
} from 'antd';
import {
  FilterOutlined,
  ClearOutlined,
  SearchOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * FilterPanel Component
 * Collapsible filter panel with various filter types
 */
const FilterPanel = ({
  // Filter configuration
  filters = [], // Array of filter configurations
  
  // Values
  values = {},
  onFilter,
  onClear,
  
  // Layout
  columns = 4, // Number of columns (1, 2, 3, 4)
  collapsible = true,
  defaultExpanded = false,
  
  // Buttons
  showApplyButton = true,
  showClearButton = true,
  applyText = 'Apply Filters',
  clearText = 'Clear',
  
  // Active filters display
  showActiveFilters = true,
  
  // Loading
  loading = false,
  
  // Quick filters (displayed outside collapse)
  quickFilters = [],
  
  // Styling
  className = '',
  style = {},
}) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeFilters, setActiveFilters] = useState([]);

  // Get column span based on columns setting
  const getColSpan = () => {
    const spans = { 1: 24, 2: 12, 3: 8, 4: 6 };
    return spans[columns] || 6;
  };

  // Handle filter application
  const handleApply = () => {
    const formValues = form.getFieldsValue();
    
    // Build active filters list
    const active = [];
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const filterConfig = filters.find(f => f.name === key);
        if (filterConfig) {
          active.push({
            key,
            label: filterConfig.label,
            value: formatFilterValue(value, filterConfig),
          });
        }
      }
    });
    setActiveFilters(active);

    if (onFilter) {
      onFilter(formValues);
    }
  };

  // Handle clear filters
  const handleClear = () => {
    form.resetFields();
    setActiveFilters([]);
    if (onClear) {
      onClear();
    }
  };

  // Remove a single filter
  const handleRemoveFilter = (filterKey) => {
    form.setFieldValue(filterKey, undefined);
    setActiveFilters(prev => prev.filter(f => f.key !== filterKey));
    handleApply();
  };

  // Format filter value for display
  const formatFilterValue = (value, config) => {
    if (Array.isArray(value)) {
      if (config.type === 'daterange') {
        return `${value[0]?.format('MMM D')} - ${value[1]?.format('MMM D')}`;
      }
      return value.join(', ');
    }
    if (config.type === 'date') {
      return value?.format('MMM D, YYYY');
    }
    if (config.type === 'select' && config.options) {
      const option = config.options.find(o => o.value === value);
      return option?.label || value;
    }
    return String(value);
  };

  // Render a single filter input
  const renderFilter = (filter) => {
    const {
      type = 'text',
      name,
      label,
      placeholder,
      options = [],
      ...filterProps
    } = filter;

    switch (type) {
      case 'text':
      case 'string':
        return (
          <Form.Item name={name} label={label}>
            <Input
              placeholder={placeholder || `Search ${label?.toLowerCase()}`}
              allowClear
              {...filterProps}
            />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item name={name} label={label}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder={placeholder}
              {...filterProps}
            />
          </Form.Item>
        );

      case 'numberrange':
        return (
          <Form.Item label={label}>
            <Input.Group compact>
              <Form.Item name={[name, 'min']} noStyle>
                <InputNumber
                  style={{ width: '50%' }}
                  placeholder="Min"
                  {...filterProps}
                />
              </Form.Item>
              <Form.Item name={[name, 'max']} noStyle>
                <InputNumber
                  style={{ width: '50%' }}
                  placeholder="Max"
                  {...filterProps}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item name={name} label={label}>
            <Select
              placeholder={placeholder || `Select ${label?.toLowerCase()}`}
              allowClear
              showSearch
              optionFilterProp="label"
              options={options}
              {...filterProps}
            />
          </Form.Item>
        );

      case 'multiselect':
        return (
          <Form.Item name={name} label={label}>
            <Select
              mode="multiple"
              placeholder={placeholder || `Select ${label?.toLowerCase()}`}
              allowClear
              showSearch
              optionFilterProp="label"
              options={options}
              maxTagCount={2}
              {...filterProps}
            />
          </Form.Item>
        );

      case 'date':
        return (
          <Form.Item name={name} label={label}>
            <DatePicker
              style={{ width: '100%' }}
              placeholder={placeholder || 'Select date'}
              {...filterProps}
            />
          </Form.Item>
        );

      case 'daterange':
        return (
          <Form.Item name={name} label={label}>
            <RangePicker
              style={{ width: '100%' }}
              {...filterProps}
            />
          </Form.Item>
        );

      default:
        return (
          <Form.Item name={name} label={label}>
            <Input placeholder={placeholder} allowClear {...filterProps} />
          </Form.Item>
        );
    }
  };

  // Filter panel content
  const filterContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={values}
      onFinish={handleApply}
    >
      <Row gutter={16}>
        {filters.map((filter) => (
          <Col span={filter.span || getColSpan()} key={filter.name}>
            {renderFilter(filter)}
          </Col>
        ))}
      </Row>

      {/* Action buttons */}
      {(showApplyButton || showClearButton) && (
        <Row justify="end" style={{ marginTop: 8 }}>
          <Space>
            {showClearButton && (
              <Button
                icon={<ClearOutlined />}
                onClick={handleClear}
                disabled={loading}
              >
                {clearText}
              </Button>
            )}
            {showApplyButton && (
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleApply}
                loading={loading}
              >
                {applyText}
              </Button>
            )}
          </Space>
        </Row>
      )}
    </Form>
  );

  return (
    <div className={`filter-panel ${className}`} style={style}>
      {/* Quick Filters */}
      {quickFilters.length > 0 && (
        <Space style={{ marginBottom: 16 }} wrap>
          {quickFilters.map((qf) => (
            <Button
              key={qf.key}
              size="small"
              type={qf.active ? 'primary' : 'default'}
              onClick={qf.onClick}
            >
              {qf.label}
            </Button>
          ))}
        </Space>
      )}

      {/* Active Filters Tags */}
      {showActiveFilters && activeFilters.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Space size={[8, 8]} wrap>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Active filters:
            </Text>
            {activeFilters.map((filter) => (
              <Tag
                key={filter.key}
                closable
                onClose={() => handleRemoveFilter(filter.key)}
              >
                {filter.label}: {filter.value}
              </Tag>
            ))}
            <Button
              type="link"
              size="small"
              onClick={handleClear}
              style={{ padding: 0 }}
            >
              Clear all
            </Button>
          </Space>
        </div>
      )}

      {/* Filter Panel */}
      {collapsible ? (
        <Card
          size="small"
          style={{ marginBottom: 16 }}
          styles={{ body: { padding: expanded ? 16 : 0 } }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: expanded ? 0 : '8px 16px',
              cursor: 'pointer',
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <Space>
              <FilterOutlined />
              <Text strong>Filters</Text>
              {activeFilters.length > 0 && (
                <Tag color="blue">{activeFilters.length} active</Tag>
              )}
            </Space>
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </div>
          {expanded && (
            <div style={{ marginTop: 16 }}>
              {filterContent}
            </div>
          )}
        </Card>
      ) : (
        <Card size="small" style={{ marginBottom: 16 }}>
          {filterContent}
        </Card>
      )}
    </div>
  );
};

export default FilterPanel;
