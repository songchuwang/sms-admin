import { addRule, removeRule, rule, updateRule, getAccountList, handleAccountEdit, handleAccountRemove, handleAccountEnable, handleAccountDisable } from '@/services/ant-design-pro/api';
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
import { Button, Drawer, Input, message, Col, Row, Space, Form, Popconfirm } from 'antd';
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
    const modalFormRef = useRef<ProFormInstance>();
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

    const columns: ProColumns<API.RuleListItem>[] = [
        {
            title: '账号',
            dataIndex: 'account',
            valueType: 'textarea',
        },
        {
            title: '账号类型',
            dataIndex: 'accountType',
            hideInForm: true,
            valueEnum: {
                1: {
                    text: '主账号',
                    // status: 'Processing',
                },
                2: {
                    text: '子账号',
                    // status: 'Success',
                },
            },
        },
        {
            title: '所属企业',
            dataIndex: 'businessName',
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
                // headerTitle={}
                actionRef={actionRef}
                rowKey="key"
                search={{
                    labelWidth: 120,
                }}
                options={false}
                toolBarRender={() => []}
                request={(params) => {
                    let payload = {
                      ...params,
                      pageNum: params.current,
                    };
                    delete payload.current;
                    return getAccountList(payload);
                  }}
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
                title={'账户编辑'}
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
                    let payload = {
                        ...value,
                        userId: currentRow?.userId
                    }
                    const result = await handleAccountEdit(payload as API.RuleListItem);
                    console.log('success', result);

                    if (result.code === '200') {
                        message.success('更新成功');
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
                    label="账号名"
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
                    label="职务"
                    width="md"
                    name="job"
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
            </ModalForm>
        </PageContainer>
    );
};
export default TableList;
