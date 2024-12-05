/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log('权限控制逻辑处理', currentUser);
  const permissions = currentUser?.perms || [];
  let perms = {};
  permissions.forEach((permItem) => {
    perms[permItem] = permItem;
  });
  console.log('permspermsperms',perms);
  
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    ...perms,
  };
}
