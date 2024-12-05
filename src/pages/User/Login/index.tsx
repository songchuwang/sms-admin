import { Footer } from '@/components';
import { findPwd, getCaptcha, login, mobileLogin } from '@/services/ant-design-pro/api';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, Button, Form, Input, message, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
// const ActionIcons = () => {
//   const { styles } = useStyles();
//   return (
//     <>
//       <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
//       <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
//       <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
//     </>
//   );
// };
// const Lang = () => {
//   return;
// };
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [loginType, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isShowForget, showForget] = useState(false);

  const [form] = Form.useForm();
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const { styles } = useStyles();
  const fetchUserInfo = async (userInfo: any) => {
    // const userInfo = await initialState?.fetchUserInfo?.();
    console.log('initialState', initialState);

    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const newPwdValue = form.getFieldValue('newPassword');
    const rePwdValue = event.target.value;

    setPasswordsMatch(newPwdValue === rePwdValue);
  };

  const updatePwdSubmit = async (values) => {
    console.log('updatePwdSubmit', values);
    let payload = {
      code: values.captcha,
      phoneNumber: values.phoneNumber,
      newPassword: values.newPassword,
    };
    let result = await findPwd(payload);
    console.log('找回密码结果', result);
    if (result.code === '200') {
      message.success('密码更新成功');
      showForget(false);
    } else {
      // message.error(result.msg);
    }
  };

  const handleSubmit = async (values: API.LoginParams, loginType = 'account') => {
    console.log('handleSubmit', values, loginType);

    try {
      // 登录
      let msg = {};
      if (loginType === 'account') {
        msg = await login({
          ...values,
          // type,
        });
      } else if (loginType === 'mobile') {
        msg = await mobileLogin({
          ...values,
          // type,
        });
      }
      console.log('【msg】', msg);

      if (msg.code === '200') {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        localStorage.setItem('token', JSON.stringify(msg?.data?.token));
        await fetchUserInfo(msg.data);
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        // message.error(msg.msg);
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { code } = userLoginState;
  console.log('userLoginState', userLoginState, loginType);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      {/* <Lang /> */}
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        {isShowForget ? (
          <Form
            name="login"
            form={form}
            initialValues={{ remember: true }}
            style={{ maxWidth: 360, margin: '100px auto' }}
            onFinish={updatePwdSubmit}
          >
            <Form.Item name="phoneNumber" rules={[{ required: true, message: '请输入手机号' }]}>
              <Input style={{ height: 40 }} prefix={<UserOutlined />} placeholder="请输入手机号" />
            </Form.Item>
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              captchaProps={{
                size: 'large',
              }}
              phoneName="phoneNumber"
              placeholder={'请输入验证码！'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'秒后重新获取'}`;
                }
                return '获取验证码';
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '验证码是必填项！',
                },
              ]}
              onGetCaptcha={async (phone) => {
                console.log('onGetCaptcha', phone);
                const result = await getCaptcha({
                  phoneNumber: phone,
                  type: 'forgetpsw',
                });
                if (!result) {
                  return;
                }
                message.success('获取验证码成功');
              }}
            />
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Please input your Password!' },
                {
                  min: 10,
                  max: 18,
                  message: '密码长度必须在10到18位之间',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="请输入新密码，长度不少于10位"
              />
            </Form.Item>
            <Form.Item
              name="rePassword"
              dependencies={['newPassword']}
              hasFeedback
              validateStatus={passwordsMatch ? 'success' : 'error'}
              rules={[
                {
                  required: true,
                  message: '请确认你的密码',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两个密码不匹配'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入新密码"
                onChange={handleConfirmPasswordChange}
              />
              {/* <Input prefix={<LockOutlined />} type="password" placeholder="请再次输入新密码" /> */}
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                确认
              </Button>
              <a
                style={{ marginTop: '10px', display: 'inline-block' }}
                onClick={() => showForget(false)}
              >
                返回登录 {'>'}
              </a>
            </Form.Item>

            {/* <Form.Item>
              <Button block type="primary" onClick={() => setStep('2')}>
                确认
              </Button>
              <a style={{ marginTop: '10px', display: 'inline-block' }} onClick={() => showForget(false)}>返回登录 {'>'}</a>
            </Form.Item> */}
          </Form>
        ) : (
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            logo={<img alt="logo" src="/logo.svg" />}
            title="杰讯互联短信平台"
            subTitle={' '}
            initialValues={
              {
                // autoLogin: false,
              }
            }
            actions={[]}
            onFinish={async (values) => {
              console.log('登录参数', values);
              let payload = {};
              if (loginType === 'account') {
                payload = values;
              } else {
                payload = {
                  code: values.captcha,
                  phoneNumber: values.phoneNumber,
                };
              }
              await handleSubmit(payload as API.LoginParams, loginType);
            }}
          >
            <Tabs
              activeKey={loginType}
              onChange={setType}
              centered
              items={[
                {
                  key: 'account',
                  label: '账户密码登录',
                },
                {
                  key: 'mobile',
                  label: '手机号登录',
                },
              ]}
            />

            {(code === '400' || code === '404') && <LoginMessage content={userLoginState.msg} />}
            {loginType === 'account' && (
              <>
                <ProFormText
                  name="account"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                  }}
                  placeholder={'请输入用户名'}
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                  }}
                  placeholder={'请输入密码'}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
            {loginType === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined />,
                  }}
                  name="phoneNumber"
                  placeholder={'请输入手机号！'}
                  rules={[
                    {
                      required: true,
                      message: '手机号是必填项！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '不合法的手机号！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  phoneName="phoneNumber"
                  placeholder={'请输入验证码！'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'秒后重新获取'}`;
                    }
                    return '获取验证码';
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '验证码是必填项！',
                    },
                  ]}
                  onGetCaptcha={async (phone) => {
                    console.log('onGetCaptcha', phone);
                    const result = await getCaptcha({
                      phoneNumber: phone,
                      type: 'login',
                    });
                    if (!result) {
                      return;
                    }
                    message.success('获取验证码成功');
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
              }}
            >
              {/* <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox> */}
              <a
                style={{
                  float: 'right',
                  marginBottom: 24,
                }}
                onClick={() => showForget(true)}
              >
                忘记密码 ?
              </a>
            </div>
          </LoginForm>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default Login;
