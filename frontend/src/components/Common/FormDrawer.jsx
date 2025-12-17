import { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  TimePicker,
  Switch,
  Radio,
  Checkbox,
  Upload,
  Button,
  Space,
  Divider,
  Typography,
  Row,
  Col,
  Spin,
  message,
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * FormDrawer Component
 * Reusable drawer form for create/edit operations
 */
const FormDrawer = ({
  // Visibility
  open = false,
  onClose,
  
  // Mode
  mode = 'create', // 'create', 'edit', 'view'
  
  // Form configuration
  title,
  subtitle,
  fields = [], // Array of field configurations
  initialValues = {},
  
  // Layout
  width = 520,
  placement = 'right',
  columns = 1, // 1 or 2 column layout
  labelCol = { span: 24 },
  wrapperCol = { span: 24 },
  layout = 'vertical', // 'vertical', 'horizontal', 'inline'
  
  // Submission
  onSubmit,
  submitText,
  loading = false,
  
  // Extra buttons
  extraButtons = [],
  
  // Form instance (optional, for external control)
  form: externalForm,
  
  // Validation
  validateOnChange = false,
  
  // Additional props
  destroyOnClose = true,
  maskClosable = true,
  keyboard = true,
  footer,
  extra,
  className = '',
}) => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const [submitting, setSubmitting] = useState(false);

  // Set initial values when drawer opens or initialValues change
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues, form]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!open && destroyOnClose) {
      form.resetFields();
    }
  }, [open, destroyOnClose, form]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      if (onSubmit) {
        await onSubmit(values, mode);
      }
      
      onClose();
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fix the errors in the form');
      } else {
        message.error('An error occurred. Please try again.');
        console.error('Form submission error:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Render a single field based on its configuration
  const renderField = (field) => {
    const {
      type = 'text',
      name,
      label,
      placeholder,
      rules = [],
      required = false,
      disabled = false,
      hidden = false,
      tooltip,
      dependencies,
      // Options for select, radio, checkbox
      options = [],
      // Additional props for specific field types
      ...fieldProps
    } = field;

    if (hidden) return null;

    // Add required rule if needed
    const fieldRules = [...rules];
    if (required && !fieldRules.some(r => r.required)) {
      fieldRules.unshift({ required: true, message: `${label} is required` });
    }

    // Common form item props
    const formItemProps = {
      name,
      label,
      rules: fieldRules,
      tooltip,
      dependencies,
    };

    // Determine if field should be read-only in view mode
    const isReadOnly = mode === 'view' || disabled;

    // Render based on field type
    switch (type) {
      case 'text':
      case 'string':
        return (
          <Form.Item key={name} {...formItemProps}>
            <Input
              placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'password':
        return (
          <Form.Item key={name} {...formItemProps}>
            <Input.Password
              placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'email':
        return (
          <Form.Item 
            key={name} 
            {...formItemProps}
            rules={[
              ...fieldRules,
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              type="email"
              placeholder={placeholder || 'Enter email address'}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item key={name} {...formItemProps}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'currency':
        return (
          <Form.Item key={name} {...formItemProps}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder={placeholder || '0.00'}
              precision={2}
              formatter={(value) => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/₱\s?|(,*)/g, '')}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'textarea':
        return (
          <Form.Item key={name} {...formItemProps}>
            <TextArea
              rows={4}
              placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
              disabled={isReadOnly}
              showCount={fieldProps.maxLength ? true : false}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item key={name} {...formItemProps}>
            <Select
              placeholder={placeholder || `Select ${label?.toLowerCase()}`}
              disabled={isReadOnly}
              showSearch
              optionFilterProp="label"
              options={options}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'multiselect':
        return (
          <Form.Item key={name} {...formItemProps}>
            <Select
              mode="multiple"
              placeholder={placeholder || `Select ${label?.toLowerCase()}`}
              disabled={isReadOnly}
              showSearch
              optionFilterProp="label"
              options={options}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'date':
        return (
          <Form.Item key={name} {...formItemProps}>
            <DatePicker
              style={{ width: '100%' }}
              placeholder={placeholder || 'Select date'}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'daterange':
        return (
          <Form.Item key={name} {...formItemProps}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'time':
        return (
          <Form.Item key={name} {...formItemProps}>
            <TimePicker
              style={{ width: '100%' }}
              placeholder={placeholder || 'Select time'}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );

      case 'switch':
        return (
          <Form.Item key={name} {...formItemProps} valuePropName="checked">
            <Switch disabled={isReadOnly} {...fieldProps} />
          </Form.Item>
        );

      case 'radio':
        return (
          <Form.Item key={name} {...formItemProps}>
            <Radio.Group disabled={isReadOnly} options={options} {...fieldProps} />
          </Form.Item>
        );

      case 'checkbox':
        return (
          <Form.Item key={name} {...formItemProps} valuePropName="checked">
            <Checkbox disabled={isReadOnly} {...fieldProps}>
              {fieldProps.checkboxLabel}
            </Checkbox>
          </Form.Item>
        );

      case 'checkboxgroup':
        return (
          <Form.Item key={name} {...formItemProps}>
            <Checkbox.Group disabled={isReadOnly} options={options} {...fieldProps} />
          </Form.Item>
        );

      case 'upload':
        return (
          <Form.Item key={name} {...formItemProps} valuePropName="fileList">
            <Upload
              listType="picture-card"
              disabled={isReadOnly}
              {...fieldProps}
            >
              {!isReadOnly && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        );

      case 'divider':
        return (
          <Divider key={name} orientation="left" style={{ marginTop: 8, marginBottom: 16 }}>
            {label}
          </Divider>
        );

      case 'custom':
        return (
          <Form.Item key={name} {...formItemProps}>
            {fieldProps.render && fieldProps.render(form, isReadOnly)}
          </Form.Item>
        );

      default:
        return (
          <Form.Item key={name} {...formItemProps}>
            <Input
              placeholder={placeholder}
              disabled={isReadOnly}
              {...fieldProps}
            />
          </Form.Item>
        );
    }
  };

  // Render fields in columns
  const renderFields = () => {
    if (columns === 1) {
      return fields.map(renderField);
    }

    // Two column layout
    const rows = [];
    for (let i = 0; i < fields.length; i += 2) {
      const field1 = fields[i];
      const field2 = fields[i + 1];

      // Full width fields (dividers, textareas, etc.)
      const isFullWidth = (f) => ['divider', 'textarea', 'upload'].includes(f?.type) || f?.fullWidth;

      if (isFullWidth(field1)) {
        rows.push(
          <Col span={24} key={field1.name || i}>
            {renderField(field1)}
          </Col>
        );
        if (field2) {
          if (isFullWidth(field2)) {
            rows.push(
              <Col span={24} key={field2.name || i + 1}>
                {renderField(field2)}
              </Col>
            );
          } else {
            rows.push(
              <Col span={12} key={field2.name || i + 1}>
                {renderField(field2)}
              </Col>
            );
          }
        }
      } else {
        rows.push(
          <Col span={12} key={field1.name || i}>
            {renderField(field1)}
          </Col>
        );
        if (field2) {
          if (isFullWidth(field2)) {
            rows.push(
              <Col span={24} key={field2.name || i + 1}>
                {renderField(field2)}
              </Col>
            );
          } else {
            rows.push(
              <Col span={12} key={field2.name || i + 1}>
                {renderField(field2)}
              </Col>
            );
          }
        }
      }
    }

    return <Row gutter={16}>{rows}</Row>;
  };

  // Get title based on mode
  const getTitle = () => {
    if (title) return title;
    switch (mode) {
      case 'create':
        return 'Create New';
      case 'edit':
        return 'Edit';
      case 'view':
        return 'View Details';
      default:
        return 'Form';
    }
  };

  // Get submit text based on mode
  const getSubmitText = () => {
    if (submitText) return submitText;
    switch (mode) {
      case 'create':
        return 'Create';
      case 'edit':
        return 'Save Changes';
      default:
        return 'Submit';
    }
  };

  // Default footer
  const defaultFooter = (
    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
      {extraButtons}
      <Button onClick={onClose}>
        Cancel
      </Button>
      {mode !== 'view' && (
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={submitting || loading}
        >
          {getSubmitText()}
        </Button>
      )}
    </Space>
  );

  return (
    <Drawer
      title={
        <div>
          <div>{getTitle()}</div>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 13, fontWeight: 'normal' }}>
              {subtitle}
            </Text>
          )}
        </div>
      }
      width={width}
      placement={placement}
      open={open}
      onClose={onClose}
      destroyOnClose={destroyOnClose}
      maskClosable={maskClosable}
      keyboard={keyboard}
      extra={extra}
      footer={footer !== undefined ? footer : defaultFooter}
      className={className}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout={layout}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          validateTrigger={validateOnChange ? 'onChange' : 'onBlur'}
          initialValues={initialValues}
        >
          {renderFields()}
        </Form>
      </Spin>
    </Drawer>
  );
};

export default FormDrawer;
