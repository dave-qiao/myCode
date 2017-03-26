import authHelper from './authHelper'

//判断跳转地址，防止循环重定向跳转
function replaceWithLoopCheck(nextEntry, newEntry, replace) {
  if (nextEntry !== newEntry) {
    replace(newEntry);
  }
}

function isRedirctToDashboard(nextEntry) {
  //跳转名单
  const redirctList = [
    '/login',
    '/register',
    '/',
  ]
  if (redirctList.indexOf(nextEntry) !== -1) {
    return true;
  }
  return false;
}

//跳转到已登录的默认界面
function redirctToDashboard(nextState, replace, callback) {
  const nextEntry = nextState.location.pathname;  //路由访问路径
  const dashboard = '/account/account_info';      //登录后，指定的默认访问路径

  //加载用户信息
  authHelper.loadAccountInfo(nextEntry);

  //如果是跳转名单中的地址，跳转到默认路径
  if (isRedirctToDashboard(nextEntry)) {
    replaceWithLoopCheck(nextEntry, dashboard, replace);
  }

  callback();
}

//跳转到未登录的默认界面
function redirctToAnonymous(nextState, replace, callback) {
  const nextEntry = nextState.location.pathname;  //路由访问路径
  const anonymous = '/login'                      //未登录，指定的默认访问路径

  //白名单
  const whiteList = [
    '/register',
  ]

  //如果是白名单中的地址，默认不跳转到登录页
  if (whiteList.indexOf(nextEntry) === -1) {
    replaceWithLoopCheck(nextEntry, anonymous, replace);
  }
  callback();
}

module.exports = {
  //进行登录判断
  redictWithAuthCheck(nextState, replace, callback) {
    if (authHelper.isLogin() === true) {
      //如果已登录，跳转到登陆后默认界面
      redirctToDashboard(nextState, replace, callback);
    } else {
      //如果未登录，跳转到未登录默认界面
      redirctToAnonymous(nextState, replace, callback);
    }
  },

  //判断是否需要跳转到默认页面
  isRedirctToDashboard(nextEntry) {
    return isRedirctToDashboard(nextEntry);
  },
}
