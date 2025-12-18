import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form, Collapse } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;
const { Panel } = Collapse;

const mockFAQs = [
  { id: 1, question: 'How do I create a new sales order?', answer: 'Navigate to Sales > Sales Orders and click "New Order"', category: 'Sales', status: 'published' },
];

const FAQs = () => {
  const [faqs] = useState(mockFAQs);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <PageHeader title="FAQs" subtitle={`${faqs.length} FAQs`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Help & Support', path: '/help' }, { title: 'FAQs', path: '/help/faqs' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New FAQ</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search FAQs..." allowClear style={{ width: 300 }} />
        </div>
        <Collapse>
          {faqs.map(faq => (
            <Panel header={faq.question} key={faq.id}>
              <Text>{faq.answer}</Text>
            </Panel>
          ))}
        </Collapse>
      </Card>
      <FormDrawer title="Create FAQ" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'question', label: 'Question', type: 'text', required: true, span: 24 }, { name: 'answer', label: 'Answer', type: 'textarea', required: true, span: 24 }, { name: 'category', label: 'Category', type: 'select', options: [], required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default FAQs;

