
import { hashHistory, routerRedux } from 'dva/router';
import { call, put } from 'dva/effects';
import {message} from 'antd';
import {ACCOUNT} from '../ActionsName.js';
import { qiniu_tokens, account_find_one, assets, qiniu_upload, qiniu_upload_img_info, vendor_find_one, vendor_update, vendor_apply_verify } from 'aoao-core-api-service/lib/public.js';

module.exports =   {
  namespace: 'account_merchant',
  state: {
    details: {
      apply_info: {}
    },
    page_status: '100'
  },

  subscriptions: [

    function(params) {
      const { dispatch, history } = params;
      history.listen(location => {
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const {vendor_id} = JSON.parse(_accountInfo);
        // 路由判断
        if (location.pathname === '/account/merchants_info') {
          dispatch({
            type: ACCOUNT.getMerchant,
            payload: {vendor_id}
          });
        };
      });
    },
  ],

  effects: {
      // 商户编辑
    *['merchant/toEdit'](params) {
      const {page_status} = params.payload;
      // 商户编辑成功
      yield put({
        type: 'merchant/changeEditState',
        payload: {page_status}
      });
    },
    // 服务商提交审核
    *['merchant/toApplyVerify'](params) {
      const {vendor_id} = params.payload;
      const result_vendor = yield call(vendor_apply_verify, params.payload);
      if (result_vendor.err) {
        message.error('服务商提交审核失败');
      } else {
        message.success('服务提交审核成功');
        // 服务商提交审核成功
        yield put({
          type: 'merchant/getDetail',
          payload: {vendor_id}
        });
      };
    },
    // 更新服务商信息
    *['merchant/updates'](params) {
      const {vendor_id} = params.payload;
      const result_vendor = yield call(vendor_update, params.payload);
      if (result_vendor.err) {
        message.error('更新服务商信息失败');
      } else {
        message.success('更新服务商信息成功');
        // 服务商信息更新成功
        yield put({
          type: 'merchant/getDetail',
          payload: {vendor_id}
        });
        //更新本地数据
        const {account_id} = window.currentAppAccountInfo;
        const result_account = yield call(account_find_one, account_id);
        let data2 = result_account.data;
        const citesDict = window.appGlobalInfos.city;
        const {city_code} = data2;
        let city_name = '';
        try {
          city_name = citesDict.data[citesDict.index.indexOf(city_code)].name;
        } catch (e) {
          city_name = '';
          const _len = citesDict.data;
          for(let i = 0; i < _len; i++) {
            if(citesDict.data[i]._id === city_code) {
              city_name = citesDict.data[i].name;
            };
          };
        } finally {
          if(city_name.length === 0) {
            console.error('该城市无法找到，默认北京市');
            city_name = '北京市';
          };
        };
        const result_vendor2 = yield call(vendor_find_one, vendor_id);
        const [userInfo, vendorInfo] = [{...data2,city_name}, {...result_vendor2.data, city_name}];
        // 将数据保存到本地
        window.setStorageItem('userInfo',JSON.stringify(userInfo));
        window.setStorageItem('vendorInfo',JSON.stringify(result_vendor2.data));
        window.currentAppUserInfo = userInfo;
        window.currentAppVendorInfo = vendorInfo;
      };
    },
    // 查看服务商详情
    *['merchant/getDetail'](params) {
      const {vendor_id} = params.payload;
      const result_vendor = yield call(vendor_find_one, vendor_id);
      if (result_vendor.err) {
        message.error('查询账号信息失败');
      } else {
        yield put({
          type: ACCOUNT.showMerchant,
          payload: result_vendor.data
        });
      };

    },
    // 上传资质审核图片
    *['merchant/upload'](params){
      const {asset_type, file, vendor_id} = params.payload;
      if(['image/png','image/jpg', 'image/jpeg'].indexOf(file.type) === -1) {
        message.error('文件格式不对, 请上传png/jpg格式图片！');
        return ;
      };
      if(file.size/1024 > 1024) {
        message.error('图片尺寸过大, 请重新上传！');
        return ;
      };
      //获取图片信息
      let asset_info = {
        size: file.size,
        mime: file.type,
      };
      const  reader = new FileReader();
      reader.onload = function (e) {
          var data = e.target.result;
          //加载图片获取图片真实宽度和高度
          var image = new Image();
          image.onload=function(){
              Object.assign(asset_info,{width: image.width, height:image.height});
          };
          image.src= data;
     };
      reader.readAsDataURL(file);
      const result_token = yield call(qiniu_tokens, {
        asset_type,
        target_type: 1,
        target_id: vendor_id,
      });
      if (result_token.err) {
        message.error('获取上传token失败！');
        return ;
      };
      //上传七牛
      const {path, token} = result_token.data;
      let uploadData = new FormData();
      uploadData.append("token", token);
      uploadData.append("key", path);
      uploadData.append("file", file);
      const result_upload = yield call(qiniu_upload, uploadData);
      if (result_upload.err) {
        message.error('图片上传失败！');
        return ;
      };
      //资源持久化
      const result_assets = yield call(assets, {
        asset_type,
        path,
        target_type: 1,
        target_id: vendor_id,
        asset_info
      });
      if (result_assets.err) {
        message.error('更新图片失败！');
        return ;
      };
      const result_vendor = yield call(vendor_find_one, vendor_id);
      if (result_vendor.err) {
        message.error('获取图片信息失败');
      };
      yield put({
        type: 'merchant/upload/success',
        payload: result_vendor.data
      });

    },

  },

  reducers: {
    ['merchant/querySuccess'](state,action){
      return {
        ...state,
        ...{details: action.payload, page_status: '100'}
      };
    },
    ['merchant/changeEditState'](state,action){
      const {page_status} = action.payload;
      return { ...state, page_status };
    },
    ['merchant/upload/success'](state,action){
      return {
        ...state,
        ...{details: action.payload}
      };
    },
  },
}
