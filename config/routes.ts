export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '首页', icon: 'home', component: './Welcome' },
  {
    path: '/smsManage',
    name: '短信管理',
    icon: 'mail',
    access: 'canAdmin',
    routes: [
      { path: '/smsManage', redirect: '/smsManage/sub-page' },
      { path: '/smsManage/smsList', name: '短信列表', component: './SmsManage/SmsList' },
      { path: '/smsManage/upAndDowm', name: '上下行', component: './SmsManage/UpAndDowm' },
      { path: '/smsManage/sendSms', name: '发送短信', component: './SmsManage/SendSms' },
    ],
  },
  {
    name: '通讯录管理',
    icon: 'book',
    path: '/AddressBookManage',
    component: './AddressBookManage',
  },
  {
    path: '/consumption',
    name: '消费充值',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/consumption/consumptionDetails',
        name: '消费明细',
        component: './ConsumerRecharge/ConsumptionDetails',
      },
      {
        path: '/consumption/accountRecharge',
        name: '账户充值',
        component: './ConsumerRecharge/AccountRecharge',
      },
    ],
  },
  {
    path: '/statistics',
    name: '报表统计',
    icon: 'table',
    access: 'canAdmin',
    routes: [
      {
        path: '/statistics/rechargeStatistics',
        name: '充值统计',
        component: './ReportStatistics/RechargeStatistics',
      },
      {
        path: '/statistics/SRVStatistics',
        name: '收发量统计',
        component: './ReportStatistics/SRVStatistics',
      },
    ],
  },
  {
    path: '/account',
    name: '账户管理',
    icon: 'appstore',
    access: 'canAdmin',
    routes: [
      {
        path: '/account/employeeAccount',
        name: '员工账户',
        component: './AccountManage/EmployeeAccount',
      },
      { path: '/account/roles', name: '账户充值', component: './AccountManage/RolesManage' },
    ],
  },
  {
    path: '/setting',
    name: '系统设置',
    icon: 'setting',
    access: 'canAdmin',
    routes: [
      { path: '/setting/smsTemplate', name: '短信模板', component: './Setting/SmsTemplate' },
      {
        path: '/setting/enterpriseCertification',
        name: '企业认证',
        component: './Setting/EnterpriseCertification',
      },
      {
        path: '/setting/signatureManagement',
        name: '签名管理',
        component: './Setting/SignatureManagement',
      },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
