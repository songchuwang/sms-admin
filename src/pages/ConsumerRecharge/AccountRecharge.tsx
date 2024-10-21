import { PageContainer } from '@ant-design/pro-components';
import { Card, Descriptions, Divider } from 'antd';
import type { FC } from 'react';
const Basic: FC = () => {
  return (
    <PageContainer>
      <Card bordered={false}>
        <h3>
          企业账户：账户余额<span style={{ color: '#1890ff' }}>2000.00</span>元，短信剩余量：
          <span style={{ color: '#1890ff' }}>8888</span>条。
        </h3>
        <Descriptions
          title="第一步：请选择微信或支付宝扫码付款"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="取货单号">1000000000</Descriptions.Item>
          <Descriptions.Item label="状态">已取货</Descriptions.Item>
          <Descriptions.Item label="销售单号">1234123421</Descriptions.Item>
          <Descriptions.Item label="子订单">3214321432</Descriptions.Item>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
        <Descriptions
          title="第二步：转账成功后联系平台官方客服"
          style={{
            marginBottom: 32,
          }}
        >
          <Descriptions.Item label="用户姓名">付小小</Descriptions.Item>
          <Descriptions.Item label="联系电话">18100000000</Descriptions.Item>
          <Descriptions.Item label="常用快递">菜鸟仓储</Descriptions.Item>
          <Descriptions.Item label="取货地址">浙江省杭州市西湖区万塘路18号</Descriptions.Item>
          <Descriptions.Item label="备注">无</Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};
export default Basic;
