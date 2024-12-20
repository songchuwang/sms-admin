import { removeRule, rule, getAccountList, handleAccountEdit, handleAccountRemove, handleAccountEnable, handleAccountDisable } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
    FooterToolbar,
    ModalForm,
    PageContainer,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, Input, message, Col, Row, Space, Form, Popconfirm } from 'antd';
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
                if(auth.includes('platform:business:user:update')) {
                    renderArr.push(
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
                    )
                }
                if (record.accountType != 1 && auth.includes('platform:business:user:delete')) {
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
                    if(auth.includes('platform:business:user:disable')) {
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
                    }
                } else {
                    if(auth.includes('platform:business:user:enable')) {
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
                    if(!auth.includes('platform:business:user:page')) {
                       return []
                    }
                    return getAccountList(payload);
                }}
                columns={columns}
                rowSelection={false}
            />
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
