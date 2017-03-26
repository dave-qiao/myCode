import authHelper from '../utils/authHelper';
import routerHelper from '../utils/routerHelper';

export default {
  path: '/',
  getComponent: (nextState, callback) => {
    const pathname = nextState.location.pathname;
    //console.log(`pathname ${pathname}`);

    //如果未登录，并且地址判断失败
    if (authHelper.isLogin() === false) {
      //加载登陆页的布局
      callback(null, require('../services/core/src/Login'));
    } else {
      //修复onEnter不调用的问题
      if (routerHelper.isRedirctToDashboard(pathname)) {
        window.location.href = '/#/account/account_info';
        return;
      }
      //加载后台框架的布局
      callback(null, require('../services/core/src/App'));
    }
  },
  onEnter: routerHelper.redictWithAuthCheck,
  childRoutes: [
    require('./core/index.js'),
    require('../services/business/src/routes'),
    require('../services/statictics/src/routes'),
    require('../services/account/src/routes'),
    require('../services/team/src/routes'),
    require('../services/tms/src/routes'),
    require('../services/finance/src/routes'),
    require('../services/guide/routes'),
    require('../services/operation/src/routes'),
    require('./core/error.js'),
  ],
};
