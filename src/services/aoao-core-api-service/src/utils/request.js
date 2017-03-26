const fetch = require('dva/fetch');
const config = window.appSystemConfigInfo;
const startLoading = window.startLoading;
const finishLoading = window.finishLoading;
const errorLoading = window.errorLoading;
const create_Head = require('./createHead');

// 从全局变量中获取config里面的config.env参数
const baseUrl = config[config.env];
function parseJSON(response) {
  return response.json();
}

// 根据状态的值判断返回的结果
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // 错误抛出
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

// 用fetch封装的request方法
function request(api, options, type) {
  // 默认的请求方式是get方式
  const _options = options || { method: 'get' };
  /*拼接API*/
  let _api = baseUrl + api;
  let noStop = true;
  _options.headers = {};

  // 如果是七牛就直接用外部的API
  if (['https://up.qbox.me'].indexOf(api) !== -1) {
    _api = api;
    noStop = false;
  }

  // 如果没有登陆 type为X-AUTH 登陆过的为X-TOKEN（也是默认的只是需要在还没登陆接口和注册接口的第三个参数写上X-AUTH即可，在系统中
  // 体现为登陆页面的注册的页面 具体可参照登陆注册的model层）
  // 跨域
  if (noStop) {
    _options.headers = create_Head(type ? 'X-AUTH' : 'X-TOKEN');
    if (_options.method !== 'get') {
      _options.headers['Content-Type'] = 'application/json';
    }
  }
  Object.assign(_options, {
    mode: 'cors',
  });

  //请求标示
  const requestKey = _api + JSON.stringify(_options);
  if (startLoading) {
    startLoading(requestKey);
  }

  return fetch(_api, _options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      if (finishLoading) {
        finishLoading(requestKey);
      }
      return { data };
    })
    .catch((err) => {
      if (errorLoading) {
        errorLoading(requestKey);
      }
      return { err }
    });
}
module.exports = request;
