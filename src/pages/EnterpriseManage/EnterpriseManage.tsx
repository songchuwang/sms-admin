import { addRule, removeRule, removeBusiness, getList, updateRule, addBusiness, editBusiness, getLogList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsActionType, ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message, Col, Row, Space, Cascader, Form, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { areaList } from '../../../public/area';
import type { CascaderProps } from 'antd';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    let res = await addBusiness({
      ...fields,
    });
    if (res.code === '200') {
      message.success('添加成功');
      hide();
    } else {
      message.error(res.msg)
    }
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleEdit = async (fields: API.RuleListItem) => {
  const hide = message.loading('更新中...');
  try {
    let res = await editBusiness({
      ...fields,
    });
    if (res.code === '200') {
      message.success('更新成功');
      hide();
    } else {
      message.error(res.msg)
    }
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};



/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeBusiness({
      businessId: selectedRows.businessId,
    });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
const TableList: React.FC = () => {
  const modalFormRef = useRef<ProFormInstance>();
  const actionDesRef = useRef<ProDescriptionsActionType>();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);


  const [businessTitle, editBusinessTitle] = useState<string>('新建企业');

  const [examineModalOpen, handleExamineModalOpen] = useState<boolean>(false);

  const [notesModalOpen, handleNotesModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.RuleListItem>[] = [
    // {
    //   title: '企业编号',
    //   dataIndex: 'businessId',
    //   tip: 'The rule name is the unique key',
    // },
    {
      title: '企业名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '公司地址',
      dataIndex: 'area',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '企业认证状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '仅注册',
          status: 'Default',
        },
        1: {
          text: '待审核',
          status: 'Processing',
        },
        2: {
          text: '认证通过',
          status: 'Success',
        },
        3: {
          text: '认证不通过',
          status: 'Error',
        },
      },
    },
    {
      title: '开通时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder={'请输入异常原因！'} />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '账户余额',
      dataIndex: 'balance',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '单条短信收费（元）',
      dataIndex: 'cost',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '企业状态',
      dataIndex: 'businessStatus',
      hideInForm: true,
      valueEnum: {
        1: {
          text: '正常',
          status: 'Success',
        },
        0: {
          text: '暂停服务',
          status: 'Error',
        },
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            if (modalFormRef.current) {
              let data = {
                ...record,
                allArea: [record.province, record.city, record.area]
              }
              modalFormRef.current.setFieldsValue(data);
              handleModalOpen(true);
              setCurrentRow(record);
              editBusinessTitle('编辑企业')
            }
          }}
        >
          编辑
        </a>,
        <Popconfirm title="确定要删除该企业吗？" onConfirm={async () => {
          await handleRemove(record)
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}>
          <a>删除</a>
        </Popconfirm>,
        <a
          onClick={() => {
            // handleNotesModalOpen(true);
            setShowDetail(true);
            setCurrentRow(record);
          }}
          key="subscribeAlert"
        >
          备注
        </a>,
        <a
          onClick={() => {
            // handleNotesModalOpen(true);
            setShowDetail(true);
            setCurrentRow(record);
          }}
          key="subscribeAlert"
        >
          充值
        </a>,
        // <a
        //   onClick={() => {
        //     // handleNotesModalOpen(true);
        //     setShowDetail(true);
        //     setCurrentRow(record);
        //   }}
        //   key="subscribeAlert"
        // >
        //   计费设置
        // </a>,
        // <a
        //   onClick={() => {
        //     // handleNotesModalOpen(true);
        //     setShowDetail(true);
        //     setCurrentRow(record);
        //   }}
        //   key="subscribeAlert"
        // >
        //   暂停服务
        // </a>,
        // <a
        //   onClick={() => {
        //     // handleNotesModalOpen(true);
        //     setShowDetail(true);
        //     setCurrentRow(record);
        //   }}
        //   key="subscribeAlert"
        // >
        //   开启服务
        // </a>,
      ],
    },
  ];
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const onAreaChange: CascaderProps<Option>['onChange'] = (value) => {
    console.log(value);
  };
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow({})
              if (modalFormRef.current) {
                editBusinessTitle('新建企业')
                modalFormRef.current.resetFields()
              }
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      {/* 新增、编辑企业弹窗 */}
      <ModalForm
        {...formItemLayout}
        title={businessTitle}
        width="600px"
        formRef={modalFormRef}
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        layout='horizontal'
        submitter={{
          render: (props, doms) => {
            return (
              <Row>
                <Col span={14} offset={2}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            )
          },
        }}
        onFinish={async (value) => {
          console.log('onFinish', value);
          const payload = {
            ...value,
            province: value?.allArea[0],
            city: value?.allArea[1],
            area: value?.allArea[2],
            businessId: currentRow?.businessId
          }
          console.log('onFinish2', payload);
          delete payload?.allArea
          if (businessTitle === '新建企业') {
            const success = await handleAdd(payload as API.RuleListItem);
            if (success) {
              handleModalOpen(false);
              if (actionRef.current) {
                modalFormRef.current?.resetFields();
                actionRef.current.reload();
              }
            }
          } else {
            const success = await handleEdit(payload as API.RuleListItem);
            if (success) {
              handleModalOpen(false);
              if (actionRef.current) {
                modalFormRef.current?.resetFields();
                actionRef.current.reload();
              }
            }
          }

        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入公司名称',
            },
          ]}
          width="md"
          name="name"
          label="公司名称"
          placeholder="请输入公司名称"
        />

        <Form.Item
          label="公司地址"
          name="allArea"
          rules={[{ required: true, message: '请选择公司地址' }]}
        >
          <Cascader style={{ width: 330 }} options={areaList} onChange={onAreaChange} placeholder="请选择公司地址" />
        </Form.Item>
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入公司地址',
            },
          ]}
          width="md"
          name="address"
          label="详细地址"
          placeholder="请输入公司地址"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入账户名',
            },
            { type: 'string', min: 6, max: 18 }
          ]}
          width="md"
          name="account"
          label="账户名（主）"
          placeholder="主账号字母开头，允许6-18位，允许字母数字下划线"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入账户真实姓名',
            },
          ]}
          width="md"
          name="realName"
          label="账户真实姓名"
          placeholder="请输入账户真实姓名"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入手机号码',
            },
          ]}
          width="md"
          name="phoneNumber"
          label="绑定手机号码"
          placeholder="请输入手机号码"
        />
        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: '请输入职位',
          //   },
          // ]}
          width="md"
          name="job"
          label="职位"
          placeholder="请输入职位"
        />
        {
          businessTitle === '新建企业' ?
            <ProFormText
              rules={[
                { type: 'string', min: 6, max: 18 }
                // {
                //   required: true,
                //   message: '请设置初始登录密码',
                // },
              ]}
              width="md"
              name="password"
              label="初始登录密码"
              placeholder="初始登录密码"
            /> : null
        }
        <ProFormText
          // rules={[
          //   {
          //     required: true,
          //     message: '规则名称为必填项',
          //   },
          // ]}
          width="md"
          name="cost"
          label="单条短信计费"
          placeholder="单条短信计费"
        />
      </ModalForm>
      {/* 企业充值 */}
      <ModalForm
        title={'短信审核'}
        width="400px"
        open={examineModalOpen}
        onOpenChange={handleExamineModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleExamineModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormRadio.Group
          name="type"
          label={''}
          options={[
            {
              value: '0',
              label: '通过，允许发送短信',
            },
            {
              value: '1',
              label: '驳回，不允许发送短信',
            },
          ]}
        />
        {/* <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
        /> */}
        <ProFormTextArea
          width="md"
          name="desc"
          placeholder="请输入驳回原因"
          rules={[
            {
              required: true,
              message: '请输入驳回原因',
            },
          ]}
        />
      </ModalForm>
      <ModalForm
        title={'备注'}
        width="400px"
        open={notesModalOpen}
        onOpenChange={handleNotesModalOpen}
      // onFinish={async (value) => {
      //   const success = await handleAdd(value as API.RuleListItem);
      //   if (success) {
      //     handleExamineModalOpen(false);
      //     if (actionRef.current) {
      //       actionRef.current.reload();
      //     }
      //   }
      // }}
      >
        <ProFormRadio.Group
          name="type"
          label={''}
          options={[
            {
              value: '0',
              label: '通过，允许发送短信',
            },
            {
              value: '1',
              label: '驳回，不允许发送短信',
            },
          ]}
        />
        {/* <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
        /> */}
        <ProFormTextArea
          width="md"
          name="desc"
          placeholder="请输入驳回原因"
          rules={[
            {
              required: true,
              message: '请输入驳回原因',
            },
          ]}
        />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        <ProDescriptions
          actionRef={actionDesRef}
          title="高级定义列表 request"
          column={1}
          request={async () => {
            return getLogList(currentRow?.businessId)
          }}
        // extra={<Button type="link">修改</Button>}
        >
          <ProDescriptions.Item dataIndex="id" label="审核人" />
          <ProDescriptions.Item dataIndex="date" label="日期" valueType="date" />
          <ProDescriptions.Item dataIndex="reason" label="审核未通过原因" />
          <ProDescriptions.Item dataIndex="date" label="短信发送时间" />
          <ProDescriptions.Item dataIndex="reason2" label="发送失败原因" />
          <ProDescriptions.Item label="money" dataIndex="money" valueType="money" />
          {/* <ProDescriptions.Item label="文本" valueType="option">
            <Button
              type="primary"
              onClick={() => {
                actionRef.current?.reload();
              }}
              key="reload"
            >
              刷新
            </Button>
            <Button key="rest">重置</Button>
          </ProDescriptions.Item> */}
        </ProDescriptions>
        {/* {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )} */}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
