
import { hashHistory, routerRedux } from 'dva/router';
import { message } from 'antd';
import { call, put } from 'dva/effects';
import { register } from 'aoao-core-api-service/lib/register.js';
import { sms_send, account_find_one, vendor_find_one } from 'aoao-core-api-service/lib/public.js';

const {err_codeTransform} = window.tempAppTool;

module.exports =   {
  namespace: 'sys_register',
  state: {
  },

  subscriptions: [
    function({ dispatch, history }) {
      history.listen(location => {
      });
    },
  ],

  effects: {
      // 获取验证码
    *['register/io/send_verify_code'](params) {
      const {mobile} = params.payload;
      const result_sms = yield call(sms_send, { mobile, type: 2 });
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
    // 注册
    *['register/submit'](params) {
      const result_register = yield call(register, params.payload);
      if(result_register.err) {
        const _response = result_register.err.response.json();
        _response.then((err_obj)=> {
          message.error(`注册失败,${err_codeTransform(err_obj.err_code)}`);
        });
      } else {
        message.success('注册成功');
        let {data} = result_register;
        const {account_id, vendor_id} = data;

        //缓存账号信息
        window.setStorageItem('accountInfo',JSON.stringify(data));
        window.localStorage.setItem('accountInfo',JSON.stringify(data));

        //缓存用户信息
        const result_account = yield call(account_find_one, account_id);
        let account_data2 = result_account.data;
        const cities = window.appGlobalInfos.city;
        account_data2.city_name = cities.data[cities.index.indexOf(account_data2.city_code)].name;

        window.setStorageItem('userInfo',JSON.stringify(account_data2));
        window.currentAppUserInfo = account_data2; // Created by dave 2017/2/22

        const result_vendor = yield call(vendor_find_one, vendor_id);
        let vendor_data = result_vendor.data;
        console.log(vendor_data,'vendor_data');

        // Created by dave 2017/2/22 (content: if(vendor_data){});

          vendor_data.city_name = cities.data[cities.index.indexOf(vendor_data.city_code)].name;
          window.setStorageItem('vendorInfo',JSON.stringify(vendor_data));
          window.currentAppVendorInfo = vendor_data;

          // 注册成功跳转页面
          setTimeout(() => {
            window.location.href = '/#/account/merchants_info';
          },1000);

      };
    },
  },

  reducers: { },
}
