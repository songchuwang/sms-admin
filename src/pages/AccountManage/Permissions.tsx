import { addRule, removeRule, handleRoleRemove, rule, updateRule, getRoleList, getMenuList, handleAccountEdit, handleMenuAdd, handleMenuUpdate, handleAccountRemove, handleAccountEnable, handleAccountDisable } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, Drawer, Input, message, Col, Row, Space, Form, Popconfirm, Tree } from 'antd';
import type { TreeProps } from 'antd';
import React, { useRef, useState, useEffect } from 'react';

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
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState([])
  const [modalTitle, setModalTitle] = useState('新建角色')



  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, e) => {
    console.log('onCheck', checkedKeys, e);
    setHalfCheckedKeys(e.halfCheckedKeys)
    setCheckedKeys(checkedKeys);
    // setCheckedMenuList([...checkedKeys, ...e.halfCheckedKeys])
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const modalFormRef = useRef<ProFormInstance>();
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      valueType: 'textarea',
    },
    {
      title: '相关账号',
      dataIndex: 'accounts',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '创建时间',
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
        if (auth.includes('platform:role:update')) {
          renderArr.push(
            <a
              key="config"
              onClick={async () => {
                handleModalOpen(true);
                setModalTitle('编辑角色')
                let res = await getMenuList({ roleId: record.roleId })
                setTimeout(() => {
                  if (modalFormRef.current) {
                    modalFormRef.current.setFieldsValue(record);
                    setCheckedKeys(record.menuIds)
                    setTreeData(res.list)
                    setCurrentRow(record);
                  }
                })
              }}
            >
              编辑
            </a>
          )
        }
        if(auth.includes('platform:role:delete')) {
          renderArr.push(
            <Popconfirm style={{ display: 'none' }} title="确定要删除该角色吗？" onConfirm={async () => {
              await handleRoleRemove({
                roleId: record.roleId
              })
              if (actionRef.current) {
                message.success("删除成功")
                actionRef.current.reload();
              }
            }}>
              <a>删除</a>
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
            onClick={async () => {
              let res = await getMenuList()
              if (modalFormRef.current) {
                modalFormRef.current.resetFields()
              }
              setTreeData(res.list)
              setCheckedKeys([])
              setModalTitle('新建角色')
              handleModalOpen(true);
            }}
            hidden={auth.includes('platform:role:add') ? false : true}
          >
            <PlusOutlined /> 添加角色
          </Button>,
        ]}
        request={(params) => {
          let payload = {
            ...params,
            pageNum: params.current,
          };
          delete payload.current;
          if(!auth.includes('platform:role:page')) {
            return []
         }
          return getRoleList(payload);
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
        layout={'vertical'}
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
          let payload = {
            ...value,
            menuIdList: [...checkedKeys, ...halfCheckedKeys]
          }
          let result = {}
          if (modalTitle === '编辑角色') {
            result = await handleMenuUpdate({
              ...payload,
              roleId: currentRow?.roleId
            });
          } else {
            result = await handleMenuAdd(payload);
          }
          if (result.code === '200') {
            message.success(modalTitle === '编辑角色' ? '修改成功' : '添加成功');
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
              message: '角色名称为必填项',
            },
          ]}
          label="角色名称"
          width="md"
          name="roleName"
        />
        <Form.Item
          label="权限分配"
          name="menuList"
        // rules={[{ required: true, message: '请进行角色分配' }]}
        >
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={true}
            defaultExpandAll={true}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={treeData}
            fieldNames={{
              title: 'menuName',
              key: 'menuId',
              children: 'sysMenuList'
            }}
          />
        </Form.Item>

      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
