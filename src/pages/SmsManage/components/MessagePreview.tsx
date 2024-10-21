import { Card, Typography } from 'antd';
import './MessagePreview.css'; // 引入自定义样式文件

const { Text } = Typography;

const MessagePreview = ({ sender, content, timestamp, title }) => {
  return (
    <div className="phone-frame">
      <Card className="message-preview-card">
        <div className="message-header">
          <Text className="message-sender">{sender}</Text>
          <Text className="message-timestamp">{new Date(timestamp).toLocaleString()}</Text>
        </div>
        <Text className="message-content">
          【{title}】{content}
        </Text>
      </Card>
    </div>
  );
};

export default MessagePreview;
