
const CryptoJS = require("crypto-js");
const config = window.appSystemConfigInfo;
const {getTOKEN, getSTAMP} = require('./utils');
// 创建AUTH_SIGN签名
function create_AUTH_SIGN(stamp) {
  //获取时间戳
  const _msg = [stamp,stamp].join(':');
  // HmacMD5加密
  let _result = CryptoJS.HmacMD5(_msg, config.publisher_key);
  return _result.toString();
}
// 创建token签名TOKEN_SIGN
function create_TOKEN_SIGN(token,stamp) {
  //获取时间戳
  const _msg = [token,stamp,stamp].join(':');
  // HmacMD5加密
  let _result = CryptoJS.HmacMD5(_msg, config.publisher_key);
  return _result.toString();
}
// 创建请求头
function create_Head(type) {
   // 获取时间戳
  const stamp = getSTAMP();
  let _result = {
    'X-APP-KEY': config.access_key,
    'X-MSG-ID': [stamp,stamp].join(','),
  };
  let _sign =null;
  // 如果没有登陆 type为X-AUTH 登陆过的为X-TOKEN（也是默认的只是需要在还没登陆接口和注册接口的第三个参数写上X-AUTH即可，在系统中
  // 体现为登陆页面的注册的页面 具体可参照登陆注册的model层）
  if(type === 'X-AUTH') {
    _sign = create_AUTH_SIGN(stamp);
    _result[type] = [_sign].join(','); // [_sign,'publisher'].join(',')
  } else {
    // 如果已经登陆过获取当前的token
    const token = getTOKEN();
    // 根据函数获取create_TOKEN_SIGN
    _sign = create_TOKEN_SIGN(token,stamp);
    _result[type] = [token,_sign].join(',');
  };
  return _result;
};

module.exports = create_Head;
