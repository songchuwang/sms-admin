import { addRule, removeRule, rule, updateRule, getEmployeeList, getPlatformRoleList, handleAccountEdit,handleEmployeeAdd, handleAccountRemove, handleAccountEnable, handleAccountDisable } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps, ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormSelect
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message, Col, Row, Space, Form, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({
      ...fields,
    });
    hide();
    message.success('Added successfully');
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
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const TableList: React.FC = () => {
  const modalFormRef = useRef<ProFormInstance>();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [roles, setRoles] = useState({});

  useEffect(() => {
    getPlatformRoleList().then(res => {
      let valueEnum = {}
      res.data.map(item => {
        valueEnum[item.roleId] = item.roleName
      })
      setRoles(valueEnum)
    })
  },[])

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '账户名',
      dataIndex: 'account',
      valueType: 'textarea',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '职位',
      dataIndex: 'job',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '停用',
          status: 'Error',
        },
        1: {
          text: '正常',
          status: 'Processing',
        },
      },
    },
    {
      title: '账号创建时间',
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
      search: false,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        let renderArr = [
          <a
            key="config"
            onClick={() => {
              handleModalOpen(true);
              setTimeout(() => {
                if (modalFormRef.current) {
                  modalFormRef.current.setFieldsValue(record);
                  setCurrentRow(record);
                }
              })
            }}
          >
            编辑
          </a>

        ]
        if (record.accountType != 1) {
          renderArr.push(
            <Popconfirm style={{ display: 'none' }} title="确定要删除该企业吗？" onConfirm={async () => {
              await handleAccountRemove({
                userId: record.userId
              })
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}>
              <a>删除</a>
            </Popconfirm>

          )
        }
        if (record.status == 1) {
          renderArr.push(
            <Popconfirm title="确定要禁用该账号吗？" onConfirm={async () => {
              await handleAccountDisable({
                userId: record.userId
              })
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}>
              <a>禁用</a>
            </Popconfirm>
          )
        } else {
          renderArr.push(
            <Popconfirm title="确定要启用该账号吗？" onConfirm={async () => {
              await handleAccountEnable({
                userId: record.userId
              })
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}>
              <a>启用</a>
            </Popconfirm>
          )
        }
        return renderArr
      }
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 创建账号
          </Button>,
        ]}
        request={getEmployeeList}
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
      <ModalForm
        {...formItemLayout}
        title={'新建账户'}
        width="400px"
        open={createModalOpen}
        formRef={modalFormRef}
        onOpenChange={handleModalOpen}
        layout={'horizontal'}
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
          console.log('handleAccountEdit', value);
          let payload = {
            ...value,
            roleIdList:[value.roleIdList]
          }
          delete payload.method
          console.log('payloadpayload',payload);
          const result = await handleEmployeeAdd(payload as API.RuleListItem);
          console.log('success', result);
          if (result.code === '200') {
            message.success('新增成功');
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error(result.msg)
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
          label="账户名"
          width="md"
          name="account"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          label="姓名"
          width="md"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          label="手机号码"
          width="md"
          name="phoneNumber"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          label="职位"
          width="md"
          name="job"
        />
        <ProFormSelect
          name="roleIdList"
          width="md"
          label="角色"
          valueEnum={roles}
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          label="初始密码"
          width="md"
          name="password"
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
        {currentRow?.name && (
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
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
