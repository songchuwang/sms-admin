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
    // access: 'canAdmin',
    routes: [
      { path: '/enterpriseManage/enterpriseManage', name: '企业管理', component: './EnterpriseManage/EnterpriseManage' },
      { path: '/enterpriseManage/accountManage', name: '账户管理', component: './EnterpriseManage/AccountManage' },
    ],
  },
  {
    path: '/account',
    name: '账户管理',
    icon: 'appstore',
    // access: 'canAdmin',
    routes: [
      {
        path: '/account/employeeAccount',
        name: '员工账户',
        component: './AccountManage/EmployeeAccount',
      },
      { path: '/account/permissions', name: '权限管理', component: './AccountManage/Permissions' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
