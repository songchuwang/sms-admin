export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '首页', icon: 'home', component: './Welcome' },
  {
    path: '/enterpriseManage',
    name: '企业管理',
    icon: 'book',
    access: 'platform:business:manager',
    routes: [
      { path: '/enterpriseManage/enterpriseManage',access: 'platform:business:page', name: '企业管理', component: './EnterpriseManage/EnterpriseManage' },
      { path: '/enterpriseManage/accountManage',access: 'platform:business:user:manager', name: '账户管理', component: './EnterpriseManage/AccountManage' },
    ],
  },
  {
    path: '/account',
    name: '账户管理',
    icon: 'appstore',
    access: 'platform:sys:seting',
    routes: [
      {
        path: '/account/employeeAccount',
        name: '员工账户',
        access: 'platform:user:page',
        component: './AccountManage/EmployeeAccount',
      },
      { path: '/account/permissions',access: 'platform:role:manager', name: '权限管理', component: './AccountManage/Permissions' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
