// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/v1/admin/getInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  console.log('outLogin', options);
  return request<Record<string, any>>('/api/v1/admin/loginOut', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/v1/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
//   return request<API.LoginResult>('/api/login/account', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: body,
//     ...(options || {}),
//   });
// }

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取备注列表
export async function getLogList(
  params: {
    businessId?: string;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口', params);
  let payload = {
    businessId: params
  }
  return request<API.RuleList>('/api/v1/admin/platform/business/check/log/list', {
    method: 'GET',
    params: {
      ...payload,
    },
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function getList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口', params, options);
  let payload = {
    ...params,
    pageNum: params.current
  }
  delete payload.current

  // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
  // 如果需要转化参数可以在这里进行修改
  const msg = await request<API.RuleList>('/api/v1/admin/platform/business/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(payload || {}),
    },
  })
  console.log('request result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total
  }

  //   return {
  //     data: msg.result,
  //     // success 请返回 true，
  //     // 不然 table 会停止解析数据，即使有数据
  //     success: boolean,
  //     // 不传会使用 data 的长度，如果是分页一定要传
  //     total: number,
  //   };

  // return request<API.RuleList>('/api/v1/admin/platform/business/page', {
  //   method: 'POST',
  //   data: {
  //     method: 'post',
  //     ...(payload || {}),
  //   },
  // });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口', params, options);

  return request<API.RuleList>('/api/v1/admin/platform/business/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

export async function getAccountList(options?: { [key: string]: any }) {
  console.log('getAccountList', options);

  const msg = await request<API.RuleList>('/api/v1/admin/platform/business/user/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  })
  console.log('getAccountList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total
  }

}

export async function getEmployeeList(options?: { [key: string]: any }) {
  console.log('getAccountList', options);

  const msg = await request<API.RuleList>('/api/v1/admin/platform/user/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  })
  console.log('getAccountList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total
  }
}

export async function getPlatformRoleList(options?: { [key: string]: any }) {
  console.log('getPlatformRoleList', options);
  const msg = await request<API.RuleList>('/api/v1/admin/platform/role/list', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  })
  console.log('getPlatformRoleList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total
  }
}

export async function getRoleList(options?: { [key: string]: any }) {
  console.log('getRoleList', options);

  const msg = await request<API.RuleList>('/api/v1/admin/platform/role/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  })
  console.log('getAccountList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total
  }
}

export async function getMenuList(options?: { [key: string]: any }) {
  console.log('getRoleList', options);

  // const msg = await request<API.RuleList>('/api/v1/admin/platform/role/menu/list', {
  //   method: 'POST',
  //   data: {
  //     method: 'post',
  //     ...(options || {}),
  //   },
  // })
  // console.log('getAccountList result', msg);

  return request<API.RuleList>('/api/v1/admin/platform/role/menu/list', {
    method: 'GET',
    params: {
      ...options,
    },
    // ...(options || {}),
  });
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total
  }
}


export async function handleMenuAdd(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/role/add', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
export async function handleMenuUpdate(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/role/update', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleAccountEdit(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/business/user/update', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
export async function handleEmployeeAdd(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/user/add', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}


/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function addBusiness(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/business/add', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function editBusiness(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/business/update', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

export async function removeBusiness(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/admin/platform/business/delete', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

export async function handleRoleRemove(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/admin/platform/role/delete', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

export async function handleAccountRemove(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/admin/platform/business/user/delete', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
// 启用账号
export async function handleAccountEnable(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/admin/platform/business/user/enable', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
// 禁用账号
export async function handleAccountDisable(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/admin/platform/business/user/disable', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}



