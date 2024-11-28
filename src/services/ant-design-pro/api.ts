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


export async function getBusinessCount() {
  return request<API.RuleList>('/api/v1/admin/home/platform/statistics/business/count', {
    method: 'GET',
    params: {},
  });
}

export async function getBusinessConsumption(
  params: {
    businessId?: string;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口', params);
  return request<API.RuleList>('/api/v1/admin/home/platform/statistics/business/consumption', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
// 平台营收
export async function getRevenueData(
  params: {
    businessId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/v1/admin/home/platform/statistics/revenue', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
// 平台短信条数
export async function getSmsData(
  params: {
    businessId?: string;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口', params);
  return request<API.RuleList>('/api/v1/admin/home/platform/statistics/sms/count', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}




export async function getCostList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口222', params, options);
  let payload = {
    ...params,
    pageNum: params.current
  }
  delete payload.current

  // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
  // 如果需要转化参数可以在这里进行修改
  const msg = await request<API.RuleList>('/api/v1/admin/platform/business/cost/page', {
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
}

export async function getRechargeList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口222', params, options);
  let payload = {
    ...params,
    pageNum: params.current
  }
  delete payload.current

  // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
  // 如果需要转化参数可以在这里进行修改
  const msg = await request<API.RuleList>('/api/v1/admin/platform/business/recharge/log/page', {
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

  return request<API.RuleList>('/api/v1/admin/platform/role/menu/list', {
    method: 'GET',
    params: {
      ...options,
    },
  });
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

export async function handleEmployeeRemove(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/user/delete', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleEmployeeUpdate(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/user/update', {
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

// 开启服务
export async function handleActivateService(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/business/enable', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleExamine(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/business/check', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
// 禁用服务
export async function handleEnableService(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/business/disable', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleRechargeMoney(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/business/recharge', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleUpdateCost(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/platform/business/cost', {
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

function toQueryString(obj) {
  return Object.keys(obj)
    .map((key) => {
      if (Array.isArray(obj[key])) {
        return obj[key]
          .map((arrayValue) => `${encodeURIComponent(key)}=${encodeURIComponent(arrayValue)}`)
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
    })
    .join('&');
}


export async function businessRechargeExport(url: string, options?: { [key: string]: any }) {
  let _params = toQueryString(options);
  let _url = url;
  if (Object.keys(options).length) {
    _url += '?' + _params;
  }
  return request<{
    data: API.CurrentUser;
  }>(_url, {
    method: 'GET',
    responseType: 'blob',
    ...(options || {}),
  })
    .then((response) => {
      console.log('导出文件结果', response);
      // 创建一个指向Blob的URL
      const blobUrl = URL.createObjectURL(response);

      // 创建一个临时的下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = '导出数据.xlsx'; // 设置下载文件名

      // 触发下载
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // 清理临时元素和URL对象
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      // 处理错误
      console.error('下载失败:', error);
    });
}


export async function exportFile(url: string, options?: { [key: string]: any }) {
  let _params = toQueryString(options);
  let _url = url;
  if (Object.keys(options).length) {
    _url += '?' + _params;
  }
  console.log('optionsoptions',options);
  
  return request<{
    data: API.CurrentUser;
  }>(_url, {
    method: 'POST',
    responseType: 'blob',
    data: {
      method: 'post',
      ...(options || {}),
    },
    // ...(options || {}),
  })
    .then((response) => {
      console.log('导出文件结果', response);
      // 创建一个指向Blob的URL
      const blobUrl = URL.createObjectURL(response);

      // 创建一个临时的下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = '导出数据.xlsx'; // 设置下载文件名

      // 触发下载
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // 清理临时元素和URL对象
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      // 处理错误
      console.error('下载失败:', error);
    });
}


export async function getCaptcha(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/sms/code', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function findPwd(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/find/password', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
export async function mobileLogin(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/v1/admin/loginByCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

