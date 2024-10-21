import {
  BookOutlined,
  ClockCircleOutlined,
  FileAddOutlined,
  FormOutlined,
  MailOutlined,
  MobileOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { GridContent, ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Card, Col, Form, Input, Radio, Row, Select } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import MessagePreview from './components/MessagePreview';
const { Option } = Select;
const { TextArea } = Input;

const useStyles = createStyles(({}) => {
  return {
    menuBox: {},
    groupBox: {
      display: 'flex',
      flexDirection: 'column',
      '.ant-menu': {
        // background:'red',
        'border-inline-end': 'none !important',
      },
      '.ant-card-body': {
        padding: '14px',
      },
    },
    groupItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '10px',
      span: {
        fontSize: 18,
      },
    },
    tabsCard: {
      '.ant-card-body': { padding: 0 },
    },
  };
});

const Center: React.FC = () => {
  const { styles } = useStyles();
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);

  const [modalTitle, handleUpdateModalTitle] = useState<string>('新建通讯录分组');

  const [value, setValue] = useState(1);
  const onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const onGenderChange = (value) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({
          note: 'Hi, man!',
        });
        break;
      case 'female':
        form.setFieldsValue({
          note: 'Hi, lady!',
        });
        break;
      case 'other':
        form.setFieldsValue({
          note: 'Hi there!',
        });
        break;
      default:
    }
  };

  const onTextChange = (e) => {
    console.log('Change:', e.target.value);
  };

  return (
    <GridContent>
      <Row gutter={2}>
        <Col lg={14} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={false}
          >
            <div className={styles.groupBox}>
              <ProForm
                style={{
                  // margin: 'auto',
                  marginTop: 8,
                  maxWidth: 600,
                }}
                name="basic"
                layout="horizontal"
                initialValues={{
                  public: '1',
                }}
                // onFinish={onFinish}
              >
                <div style={{ marginBottom: 20 }}>
                  <h3>
                    <MobileOutlined /> 号码池
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      background: '#e6f4ff',
                      boxSizing: 'border-box',
                      padding: '15px',
                      borderRadius: '5px',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      已添加号码数量： <span style={{ color: '#1890ff' }}>6000</span>
                    </span>
                    <span
                      style={{
                        border: '1px dashed',
                        display: 'inline-block',
                        padding: '3px 6px',
                        color: '#1890ff',
                        cursor: 'pointer',
                      }}
                    >
                      查看号码池
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Button
                        type="link"
                        key="primary"
                        onClick={() => {
                          // handleModalOpen(true);
                        }}
                      >
                        <PlusOutlined /> 手动添加
                      </Button>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        type="link"
                        key="primary"
                        onClick={() => {
                          // handleModalOpen(true);
                        }}
                      >
                        <FileAddOutlined /> 文件导入
                      </Button>
                      <span
                        style={{
                          display: 'inline-block',
                          height: '32px',
                          lineHeight: '32px',
                          color: '#ccc',
                        }}
                      >
                        |
                      </span>
                      <Button
                        type="link"
                        key="primary"
                        onClick={() => {
                          // handleModalOpen(true);
                        }}
                      >
                        <BookOutlined /> 通讯录导入
                      </Button>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <h3>
                    <FormOutlined /> 选择签名
                  </h3>
                  <Form.Item
                    name="gender"
                    label="签名"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select placeholder="请选择签名" onChange={onGenderChange} allowClear>
                      <Option value="male">male</Option>
                      <Option value="female">female</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h3>
                    <MailOutlined /> 短信内容
                  </h3>
                  <TextArea
                    showCount
                    maxLength={100}
                    onChange={onTextChange}
                    placeholder="disable resize"
                    style={{
                      height: 120,
                      resize: 'none',
                    }}
                  />
                  <Button
                    type="link"
                    key="primary"
                    onClick={() => {
                      // handleModalOpen(true);
                    }}
                  >
                    <FileAddOutlined /> 选择短信模板
                  </Button>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h3>
                    <ClockCircleOutlined /> 发送时间
                  </h3>
                  <Radio.Group onChange={onRadioChange} value={value}>
                    <Radio value={1}>即时发送</Radio>
                    <Radio value={2}>定时发送</Radio>
                  </Radio.Group>
                </div>
              </ProForm>
            </div>

            {/* {!loading && currentUser && (
              <div>
                <Divider dashed />
                <Divider
                  style={{
                    marginTop: 16,
                  }}
                  dashed
                />
              </div>
            )} */}
          </Card>
        </Col>
        <Col lg={10} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={false}
          >
            <div className={styles.groupBox}>
              <MessagePreview
                sender="宋楚望"
                title="中国联通"
                content="验证码7414，用于手机登录，5分钟内有效。验证码提供给他人可能导致账号被盗，请勿泄露，谨防被骗。"
                timestamp="2023-04-01T12:00:00Z"
              />
            </div>

            {/* {!loading && currentUser && (
              <div>
                <Divider dashed />
                <Divider
                  style={{
                    marginTop: 16,
                  }}
                  dashed
                />
              </div>
            )} */}
          </Card>
        </Col>
      </Row>
      <ModalForm
        title={modalTitle}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleCreateModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleCreateModalOpen(false);
            handleUpdateModalTitle(false);
            // if (actionRef.current) {
            //   actionRef.current.reload();
            // }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="分组名称"
        />
      </ModalForm>
    </GridContent>
  );
};

export default Center;
