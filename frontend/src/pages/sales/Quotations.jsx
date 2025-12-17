import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Quotations = () => {
  return (
    <Card style={{ maxWidth: 800, margin: '40px auto', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <Title level={2}>Quotations</Title>
      <Paragraph type="secondary">
        This is the Quotations module. Here you will be able to create, view, and manage sales quotations for your customers. 
        Quotation features such as item selection, pricing, discounts, and customer details will be available soon.
      </Paragraph>
      <Paragraph>
        <b>Coming soon:</b>
        <ul>
          <li>Create new quotation</li>
          <li>View and edit existing quotations</li>
          <li>Send quotations to customers</li>
          <li>Convert quotations to sales orders</li>
        </ul>
      </Paragraph>
    </Card>
  );
};

export default Quotations;
