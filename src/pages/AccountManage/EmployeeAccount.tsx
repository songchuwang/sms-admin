import { addRule, removeRule, rule, updateRule, getEmployeeList, getPlatformRoleList, handleAccountEdit, handleEmployeeRemove, handleEmployeeAdd, handleEmployeeUpdate, handleAccountRemove, handleAccountEnable, handleAccountDisable } from '@/services/ant-design-pro/api';
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
import { history, useModel } from '@umijs/max';
import { Button, Drawer, Input, message, Col, Row, Space, Form, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const TableList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [auth, setAuth] = useState([]);
  useEffect(() => {
    setAuth(currentUser?.perms || [])
  }, [])
  const modalFormRef = useRef<ProFormInstance>();

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [roles, setRoles] = useState([]);
  const [modalTitle, setModalTitle] = useState('新建账户')

  useEffect(() => {
    getPlatformRoleList().then(res => {
      // let valueEnum = {}
      let arr = []
      res.data.map(item => {
        arr.push({
          label: item.roleName,
          value: item.roleId
        })
      })

      console.log('valueEnum123', arr);

      setRoles(arr)
    })
  }, [])

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
        let renderArr = []
        if (auth.includes('platform:user:update')) {
          renderArr.push(
            <a
              key="config"
              onClick={() => {
                handleModalOpen(true);
                setModalTitle('编辑账户')
                setTimeout(() => {
                  if (modalFormRef.current) {
                    let roleIdList = record.roles[0].roleId
                    modalFormRef.current.setFieldsValue({
                      ...record,
                      roleIdList: roleIdList
                    })
                    setCurrentRow(record);
                  }
                })
              }}
            >
              编辑
            </a>
          )
        }
        if (record.accountType != 1 && auth.includes('platform:user:delete')) {
          renderArr.push(
            <Popconfirm style={{ display: 'none' }} title="确定要删除该企业吗？" onConfirm={async () => {
              await handleEmployeeRemove({
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
        if (record.status == 1 && auth.includes('platform:user:disable')) {
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
          if (auth.includes('platform:user:enable')) {
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
        }
        return renderArr
      }
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        // headerTitle={'查询表格'}
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
              if (modalFormRef.current) {
                setModalTitle('新建账户')
                modalFormRef.current.resetFields()
              }
            }}
            hidden={auth.includes('platform:user:add') ? false : true}
          >
            <PlusOutlined /> 创建账号
          </Button>,
        ]}
        request={(params) => {
          let payload = {
            ...params,
            pageNum: params.current,
          };
          delete payload.current;
          if(!auth.includes('platform:user:page')) {
            return []
         }
          return getEmployeeList(payload);
        }}
        columns={columns}
        rowSelection={false}
      />
      <ModalForm
        {...formItemLayout}
        title={modalTitle}
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
            roleIdList: [value.roleIdList]
          }
          delete payload.method
          let result = {}
          if (modalTitle === '编辑账户') {
            result = await handleEmployeeUpdate({
              ...payload,
              userId: currentRow.userId,
              roleId: currentRow?.roleId
            });
          } else {
            result = await handleEmployeeAdd(payload as API.RuleListItem);
          }
          if (result.code === '200') {
            message.success(modalTitle === '编辑账户' ? '修改成功' : '创建成功');
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
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
          label="职位"
          width="md"
          name="job"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          name="roleIdList"
          width="md"
          label="角色"
          options={roles}
          // valueEnum={roles}
          initialValue={currentRow?.roleNames}
        />
        {
          modalTitle === '新建账户' ?
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
            /> : null
        }
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
