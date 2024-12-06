import { exportFile, removeBusiness, handleExamine, getList, getRechargeList, businessRechargeExport, getCostList, updateRule, handleActivateService, handleEnableService, addBusiness, handleRechargeMoney, handleUpdateCost, editBusiness, getLogList } from '@/services/ant-design-pro/api';
import { PlusOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, InputNumber, message, Col, Row, Space, Cascader, Form, Popconfirm, Modal } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { history, useModel } from '@umijs/max';
import { areaList } from '../../../public/area';
import type { CascaderProps } from 'antd';
import moment from 'moment';

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
    }
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const downLoadUrl = '/api/v1/admin/platform/business/export';

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
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};



  const modalFormRef = useRef<ProFormInstance>();
  const rechargeRef = useRef<ActionType>();
  const billingRef = useRef<ActionType>();
  const bzRef = useRef();

  const [auth, setAuth] = useState([]);

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  // 充值记录弹窗
  const [isRechargeModalOpen, setRechargeModalOpen] = useState(false); // 充值弹窗
  // 计费设置弹窗
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false); // 充值弹窗

  const [businessTitle, editBusinessTitle] = useState<string>('新建企业');

  const [examineModalOpen, handleExamineModalOpen] = useState<boolean>(false);

  const [notesModalOpen, handleNotesModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const [rechargeAmount, setRechargeAmount] = useState(0);

  const [smsBilling, setSmsBilling] = useState(0);

  const [isShowReason, showReason] = useState(false);

  const [businessLicense, setBusinessLicense] = useState<string>('')
  const [powerOfAttorney, setPowerOfAttorney] = useState<string>('')

  const [downloadFileParams, saveDownloadFileParams] = useState({});

  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    console.log('currentUser123', currentUser);
    setAuth(currentUser?.perms || [])
  }, [])

  // 处理 InputNumber 值变化的函数
  const handleInputChange = (value) => {
    setInputValue(value);
  };

  // 重置 InputNumber 值的函数
  const resetInputValue = () => {
    setInputValue(null); // 将值重置为 null，或者根据你的需求设置为其他值
  };

  const onMoneyChange = (value) => {
    setRechargeAmount(value)
  };

  const onCostChange = (value) => {
    setSmsBilling(value)
  };

  const columns: ProColumns<API.RuleListItem>[] = [
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
      dataIndex: 'createTime',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime() };
        },
      },
      render: (_, record) => {
        return <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
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
      render: (dom, entity, other) => {
        return (
          <span>
            {dom.toFixed(2)}
          </span>
        );
      },
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
      render: (_, record) => {
        let renderArr = [
          <a
            onClick={() => {
              setCurrentRow(record);
              setTimeout(() => {
                setShowDetail(true);
                if (bzRef.current) {
                  bzRef.current.reload()
                }
              }, 200)
            }}
            key="bz"
          >
            备注
          </a>,
        ]
        if (auth.includes('platform:business:delete')) {
          renderArr.push(
            <a
              key="config"
              onClick={() => {
                console.log('modalFormRef', modalFormRef);
                handleModalOpen(true);
                setTimeout(() => {
                  if (modalFormRef.current) {

                    let data = {
                      ...record,
                      allArea: [record.province, record.city, record.area]
                    }
                    modalFormRef.current.setFieldsValue(data);

                    setCurrentRow(record);
                    editBusinessTitle('编辑企业')
                  }
                })
              }}
            >
              编辑
            </a>
          )
        }
        if (auth.includes('platform:business:delete')) {
          renderArr.push(
            <Popconfirm title="确定要删除该企业吗？" onConfirm={async () => {
              await handleRemove(record)
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}>
              <a>删除</a>
            </Popconfirm>
          )
        }

        if (auth.includes('platform:business:cost')) {
          renderArr.push(
            <a
              onClick={() => {
                setSettingsModalOpen(true)
                setCurrentRow(record);
                if (billingRef.current) {
                  billingRef.current.reload()
                }
              }}
              key="settingsModalOpenAlert"
            >
              计费设置
            </a>
          )
        }

        if (auth.includes('platform:business:recharge')) {
          renderArr.push(
            <a
              onClick={() => {
                setRechargeModalOpen(true)
                setCurrentRow(record);
                if (rechargeRef.current) {
                  rechargeRef.current.reset();
                  rechargeRef.current.reload();
                }
              }}
              key="cz"
            >
              充值
            </a>
          )
        }
        if (record.status === 1) {
          if (auth.includes('platform:business:check')) {
            renderArr.unshift(
              <a
                onClick={() => {
                  handleExamineModalOpen(true)
                  setCurrentRow(record);
                }}
                key="sh"
              >
                审核
              </a>
            )
          }
        }
        if (record.businessStatus == 1) {
          if (auth.includes('platform:business:disable')) {
            renderArr.push(
              <Popconfirm style={{ display: 'none' }} title="确定要禁用该企业吗？" onConfirm={async () => {
                let result = await handleEnableService({
                  businessId: record.businessId
                })
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}>
                <a>暂停服务</a>
              </Popconfirm>
            )
          }
        } else {
          if (auth.includes('platform:business:enable')) {
            renderArr.push(
              <Popconfirm style={{ display: 'none' }} title="确定要开启服务吗？" onConfirm={async () => {
                let result = await handleActivateService({
                  businessId: record.businessId
                })
                console.log('result1111', result);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}>
                <a>开启服务</a>
              </Popconfirm>
            )
          }
        }
        return renderArr
      }
    },
  ];


  const bzColumns: ProColumns<API.RuleListItem>[] = [
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        2: {
          text: '审核通过',
          status: 'Success',
        },
        3: {
          text: '认证不通过',
          status: 'Error',
        },
      },
    },
    {
      title: '操作账号',
      dataIndex: 'createBy',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      search: false,
      search: {
        transform: (value) => {
          return { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime() };
        },
      },
      render: (_, record) => {
        return <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      search: false,
    },
  ];

  const billingColumns = [
    {
      title: '修改内容',
      dataIndex: 'remark',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '修改人',
      dataIndex: 'createBy',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'date',
      valueType: 'dateTime',
      search: false,
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

  ];

  const handleDownLoadFile = (params = {}) => {
    exportFile(downLoadUrl, { ...downloadFileParams, ...params });
  };

  const rechargeColumns: ProColumns<API.RuleListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'textarea',
      search: false,
      render: (dom, entity, index) => {
        return index + 1;
      },
    },
    {
      title: '充值金额（元）',
      dataIndex: 'rechargeMoney',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '充值时间',
      dataIndex: 'date',
      valueType: 'dateTime',
      search: false,
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
      title: '操作人',
      dataIndex: 'createBy',
      valueType: 'textarea',
      search: false,
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
        // options={false}
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
            hidden={auth.includes('platform:business:add') ? false : true}
          >
            <PlusOutlined /> 开通企业
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleDownLoadFile();
            }}
            hidden={auth.includes('platform:business:export') ? false : true}
          >
            <VerticalAlignBottomOutlined /> 导出
          </Button>,
        ]}
        request={(params) => {
          let payload = {
            ...params,
            pageNum: params.current,
          };
          delete payload.current;
          let downloadFileParams = JSON.parse(JSON.stringify(params));
          delete downloadFileParams.current;
          delete downloadFileParams.pageSize;
          saveDownloadFileParams(downloadFileParams);
          if (!auth.includes('platform:business:page')) {
            return []
          }
          return getList(payload);
        }}
        columns={columns}
        rowSelection={false}
      />
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
          const payload = {
            ...value,
            province: value?.allArea[0],
            city: value?.allArea[1],
            area: value?.allArea[2],
            businessId: currentRow?.businessId
          }
          delete payload?.allArea
          if (businessTitle === '新建企业') {
            const success = await handleAdd(payload as API.RuleListItem);
            if (success) {
              if (actionRef.current) {
                modalFormRef.current?.resetFields();
                actionRef.current.reload();
              }
              handleModalOpen(false);
            }
          } else {
            const success = await handleEdit(payload as API.RuleListItem);
            if (success) {
              if (actionRef.current) {
                modalFormRef.current?.resetFields();
                actionRef.current.reload();
              }

              handleModalOpen(false);
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
          width="md"
          name="job"
          label="职位"
          placeholder="请输入职位"
        />
        {
          businessTitle === '新建企业' ?
            <ProFormText
              rules={[
                { type: 'string', min: 6, max: 18 },
                {
                  required: true,
                  message: '请设置初始登录密码',
                },
              ]}
              width="md"
              name="password"
              label="初始登录密码"
              placeholder="初始登录密码"
            /> : null
        }
        <ProFormText
          rules={[
            {
              required: true,
              message: '请设置单条短信计费',
            },
          ]}
          width="md"
          name="cost"
          label="单条短信计费"
          placeholder="单条短信计费(元/条)"
        />
      </ModalForm>
      {/* 企业充值 */}
      <Modal width={1000} footer="" title="企业充值" open={isRechargeModalOpen} onCancel={() => setRechargeModalOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'row', height: 35 }}>
          <Form.Item
            label="企业"
            name="allArea"
            style={{ marginRight: 30 }}
          >
            <span>{currentRow?.name}</span>
          </Form.Item>
          <Form.Item
            label="充值金额"
            name="allArea"
          >
          </Form.Item>
          <InputNumber
            style={{ width: 200 }}
            min="0"
            max="1000"
            step="1"
            suffix="RMB"
            controls={false}
            value={inputValue} // 将状态绑定到 InputNumber 的 value 属性
            onChange={handleInputChange} // 当 InputNumber 的值改变时调用处理函数
          />
          {/* 外部按钮，点击时调用重置函数 */}
          <Button
            style={{ marginLeft: 30, marginTop: 2 }}
            type="primary"
            key="primary"
            onClick={async () => {
              let payload = {
                businessId: currentRow.businessId,
                rechargeMoney: inputValue
              }
              delete payload.method
              let result = await handleRechargeMoney(payload)
              if (result.code === '200') {
                message.success('充值成功')
              }
              if (rechargeRef.current) {
                setInputValue(null);
                rechargeRef.current.reload();
                actionRef.current.reload();
              }
            }}
          >
            确定
          </Button>
        </div>
        <ProTable<API.RuleListItem, API.PageParams>
          headerTitle={'充值记录'}
          actionRef={rechargeRef}
          rowKey="key"
          options={false}
          search={false}
          pagination={{
            pageSize: 10, // 设置每页显示10条
            // 可以设置其他分页属性，如默认当前页等
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                businessRechargeExport('/api/v1/admin/platform/business/recharge/log/export', {
                  businessId: currentRow.businessId
                })
              }}
            >
              <VerticalAlignBottomOutlined /> 导出
            </Button>,
          ]}
          request={(params) => {
            let payload = {
              ...params,
              pageSize: 10,
              businessId: currentRow.businessId
            }
            return getRechargeList(payload)
          }}
          columns={rechargeColumns}
          rowSelection={false}
        />
      </Modal>
      {/* 计费设置 */}
      <Modal width={1000} footer="" title="计费设置" open={isSettingsModalOpen} onCancel={() => {
        setSmsBilling(null)
        setSettingsModalOpen(false)
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', height: 35 }}>
          <Form.Item
            label="企业名称"
            name="allArea"
            style={{ marginRight: 30 }}
          >
            <span>{currentRow?.name}</span>
          </Form.Item>
          <Form.Item
            label="短信计费"
          >
          </Form.Item>
          <InputNumber
            style={{ width: 200 }}
            value={smsBilling}
            min="0"
            max="1000"
            step="1"
            suffix="RMB"
            controls={false}
            onChange={onCostChange}
          />
          {/* 外部按钮，点击时调用重置函数 */}
          <Button
            style={{ marginLeft: 30, marginTop: 2 }}
            type="primary"
            key="primary"
            onClick={async () => {
              let payload = {
                businessId: currentRow.businessId,
                cost: smsBilling
              }
              delete payload.method
              setSmsBilling(null)
              let result = await handleUpdateCost(payload)
              if (result.code === '200') {
                message.success('修改成功')
              }
              if (billingRef.current) {
                billingRef.current.reload();
                actionRef.current.reload();
              }
            }}
          >
            确定
          </Button>

        </div>
        <ProTable<API.RuleListItem, API.PageParams>
          headerTitle={'修改记录'}
          actionRef={billingRef}
          pagination={{
            pageSize: 10, // 设置每页显示10条
            // 可以设置其他分页属性，如默认当前页等
          }}
          rowKey="key"
          options={false}
          search={false}
          toolBarRender={() => []}
          request={(params) => {
            let payload = {
              ...params,
              pageSize: 10,
              businessId: currentRow.businessId
            }
            return getCostList(payload)
          }}
          columns={billingColumns}
          rowSelection={false}
        />
      </Modal>
      <ModalForm
        {...formItemLayout}
        title={'企业审核'}
        width="600px"
        open={examineModalOpen}
        layout={'horizontal'}
        onOpenChange={handleExamineModalOpen}
        onValuesChange={(changeValues) => {
          if (changeValues.examine == '2') {
            showReason(false)
          } else if (changeValues.examine == '3') {
            showReason(true)
          }
        }}
        request={async () => {
          setBusinessLicense(currentRow.businessLicense)
          setPowerOfAttorney(currentRow.powerOfAttorney)
          return {
            ...currentRow,
            allArea: `${currentRow.province}${currentRow.city}${currentRow.area}${currentRow.address}`
          };
        }}
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
          let payload = {
            businessId: currentRow.businessId,
            status: value.examine,
          }
          if (value.examine == 3) {
            payload['remark'] = value.remark
          }

          const result = await handleExamine(payload as API.RuleListItem);
          if (result) {
            if (result.code == '200') {
              message.success(result.msg)
            } else {
            }
            if (actionRef.current) {
              actionRef.current.reload();
            }
            handleExamineModalOpen(false);
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
          disabled
          label={'企业名称'}
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
          disabled
          label={'企业地址'}
          width="md"
          name="allArea"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          disabled
          label={'提交人'}
          width="md"
          name="account"
        />
        <Form.Item
          label="营业执照"
          name="allArea"
          rules={[{ required: true, message: '请选择公司地址' }]}
        >
          {businessLicense ? <img onClick={() => window.open(currentRow.businessLicense, '_blank')} src={businessLicense} alt="营业执照" style={{ display: 'inline-block', width: '100%', maxWidth: '200px', height: 'auto', cursor: 'pointer' }} /> : null}
        </Form.Item>
        <Form.Item
          label="授权书"
          name="allArea"
          rules={[{ required: true, message: '请选择公司地址' }]}
        >
          <Button onClick={() => window.open(currentRow.powerOfAttorney, '_blank')} type="link">短信平台服务申请授权书.docx</Button>
        </Form.Item>
        <ProFormRadio.Group
          name="examine"
          label={'审核结果'}
          rules={[
            {
              required: true,
              message: '请选择审核结果',
            },
          ]}
          options={[
            {
              value: '2',
              label: '同意，认证通过',
            },
            {
              value: '3',
              label: '不同意，认证不通过',
            },
          ]}
        />
        {
          isShowReason ?
            <ProFormTextArea
              width="md"
              name="remark"
              label={'拒绝原因'}
              placeholder="请输入驳回原因"
              rules={[
                {
                  required: true,
                  message: '请输入驳回原因',
                },
              ]}
            /> : null
        }
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

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        <ProTable<API.RuleListItem, API.PageParams>
          headerTitle={'备注记录'}
          actionRef={bzRef}
          rowKey="key"
          options={false}
          search={false}
          request={async () => {
            let payload = {
              businessId: currentRow?.businessId
            }
            let result = await getLogList(payload)
            return {
              data: result.list,
              success: result.success,
              total: result.list.length
            }
          }}
          columns={bzColumns}
          rowSelection={false}
        />
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
