
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { call, put } from 'dva/effects';

import { login } from 'aoao-core-api-service/lib/login.js';
import { sms_send, account_find_one, vendor_find_one } from 'aoao-core-api-service/lib/public.js';

const {err_codeTransform} = window.tempAppTool;

module.exports = {
  namespace: 'sys_login',
  state: {
    msg:{    //登录的信息
      name: '',
      txt: '',
      success: null
    }
  },

  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {
      });
    },
  ],

  effects: {

// 获取验证码
    *['login/io/send_verify_code'](params) {
      const {mobile,code} = params.payload;
      const result_sms = yield call(sms_send, { mobile, code, type: 1 });
      message.config({ duration: 3, });

      const [verify_button, seconds] = [document.querySelector('#verify_button'), 60];
      verify_button.disabled = true;

      if(result_sms.err) {

        verify_button.disabled = false;

        if (typeof result_sms.err.response === 'undefined') {
          message.error('未知异常！');
          return;
        };
        const _response = result_sms.err.response.json();
        _response.then((err_obj)=> {
          message.error(`验证码发送失败,${err_codeTransform(err_obj.err_code)}`);
        });
        return;
      };

      const {data} = result_sms;
      let _text = '验证码发送成功';
      if(data.code) {
        _text += `，验证码为${data.code}`;
      };
      message.success(_text);

      //倒计时
      let _secs = seconds;
      let countDown = setInterval(()=>{
        if(_secs > 0){
          _secs --;
          verify_button.innerText = _secs;
         } else {
           clearInterval(countDown);
           verify_button.innerText = '验证码';
           verify_button.removeAttribute('disabled');
        };
      },1000);

    },
    // 登录
    *['login/submit'](params) {
      let _payload = params.payload;
      _payload.code = _payload.vendor_code;
      delete _payload.vendor_code;
      const result_login = yield call(login, _payload);
      if(result_login.err) {
        if (typeof result_login.err.response === 'undefined') {
          message.error('未知异常！');
          return;
        };
        const _response = result_login.err.response.json();
        _response.then((err_obj)=> {
          message.error(`登录失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        //存储token,方便调用
        let accountInfo = result_login.data;
        window.setStorageItem('accountInfo',JSON.stringify(accountInfo));
        window.currentAppAccountInfo = accountInfo;
        //获取帐号和服务商id准备查询
        const {account_id, vendor_id} = result_login.data;
        //查询账号信息
        const result_account = yield call(account_find_one, account_id);
        //查询服务商信息
        const result_vendor = yield call(vendor_find_one, vendor_id);
        //获取城市名称
        const cityDict = window.appGlobalInfos.city;
        let city_name = '';
        if (result_vendor.err) {
          message.error('获取服务商信息失败，请尝试重新登录！');
          return ;
        };
        const {city_code} = result_vendor.data;
        try {
          let _i = cityDict.index.indexOf(city_code);
          city_name = cityDict.data[_i].name;
        } catch (e) {
          console.error('获取城市名称失败');
        };
        const [
          userInfo,
          vendorInfo
        ] = [
          {...result_account.data, city_name},
          {...result_vendor.data, city_name}
        ];
        //缓存账号信息

        window.setStorageItem('userInfo',JSON.stringify(userInfo));
        window.setStorageItem('vendorInfo',JSON.stringify(vendorInfo));
        //复制到全局变量中
        window.currentAppVendorInfo = vendorInfo;
        window.currentAppUserInfo = userInfo;
        message.success('登录成功');
        setTimeout(() => {
          window.location.href = '/#/account/account_info';
        },1000);
      };
    },
  },
// state生成器
  reducers: {},
}
