import { addRule, removeRule, handleRoleRemove, rule, updateRule, getRoleList, getMenuList, handleAccountEdit, handleMenuAdd, handleMenuUpdate, handleAccountRemove, handleAccountEnable, handleAccountDisable } from '@/services/ant-design-pro/api';
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
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message, Col, Row, Space, Form, Popconfirm, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import React, { useRef, useState } from 'react';
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
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  // const [checkedMenuList, setCheckedMenuList] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState([])
  const [modalTitle, setModalTitle] = useState('新建角色')



  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, e) => {
    console.log('onCheck', checkedKeys, e);
    setCheckedKeys(checkedKeys as React.Key[]);
    // setCheckedMenuList([...checkedKeys, ...e.halfCheckedKeys])
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };



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

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      valueType: 'textarea',
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
          </a>,
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
        ]
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
          >
            <PlusOutlined /> 添加角色
          </Button>,
        ]}
        request={getRoleList}
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
            menuIdList: checkedKeys
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
          } else {
            message.error(result.msg)
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
