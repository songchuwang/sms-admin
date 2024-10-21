import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Card, Cascader, Divider, Form, message, Upload } from 'antd';
import type { FC } from 'react';
import { fakeSubmitForm } from './components/service';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const BasicForm: FC<Record<string, any>> = () => {
  const { run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: () => {
      message.success('提交成功');
    },
  });
  const onFinish = async (values: Record<string, any>) => {
    run(values);
  };
  const onChange = (value) => {
    console.log(value);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const normFile2 = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <PageContainer>
      <Card bordered={false}>
        <ProForm
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          initialValues={{
            public: '1',
          }}
          onFinish={onFinish}
        >
          <ProFormText
            width="md"
            label="公司名称"
            name="name"
            rules={[
              {
                required: true,
                message: '公司名称未填写',
              },
            ]}
            placeholder="请输入公司名称"
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ marginBottom: 5 }}>
              <i style={{ color: '#ff4d4f' }}>*</i> 公司地址
            </span>
            <Cascader
              style={{ marginBottom: 15, width: 330 }}
              options={options}
              onChange={onChange}
              placeholder="Please select"
            />
          </div>

          <ProFormText
            width="md"
            label="详细地址"
            name="name"
            rules={[
              {
                required: true,
                message: '详细地址未填写',
              },
            ]}
            placeholder="请输入公司详细地址"
          />

          <Form.Item
            label="上传营业执照"
            rules={[
              {
                required: true,
                message: '上传营业执照',
              },
            ]}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload action="/upload.do" listType="picture-card">
              <button
                style={{
                  border: 0,
                  background: 'none',
                }}
                type="button"
              >
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  上传图片
                </div>
              </button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="upload"
            label="授权书"
            valuePropName="fileList"
            getValueFromEvent={normFile2}
            // extra="longgggggggggggggggggggggggggggggggggg"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
              <Upload name="logo" action="/upload.do" listType="picture">
                <Button type="primary" icon={<UploadOutlined />}>
                  点击上传
                </Button>
              </Upload>
              <Button type="link">下载授权书</Button>
            </div>
          </Form.Item>
        </ProForm>
        <Divider
          style={{
            margin: '40px 0 24px',
          }}
        />
        <div>
          {/* <h3>说明</h3> */}
          <p>*请上传可以证明企业资质的营业执照</p>
          <p>*营业执照图片格式需为gif/jpg/jpeg/png格式，文件{'<'}2M</p>
          <p>*授权书需在下载授权书模板填写后上传</p>
          {/* <h4>转账到银行卡</h4>
          <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
          </p> */}
        </div>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
