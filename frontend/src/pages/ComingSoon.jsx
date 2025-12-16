import { Typography, Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const ComingSoon = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Result
      status="info"
      title={title}
      subTitle="This feature is coming soon!"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      }
    />
  );
};

export default ComingSoon;
