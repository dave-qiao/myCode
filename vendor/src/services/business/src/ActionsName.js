module.exports = {
  AreaAction: {
    fetchSupplyVendorList: 'fetchSupplyVendorList',   //获取供应商列表
    fetchCityList: 'fetchCityList',                   //获取城市列表
    fetchDirectAreaList: 'fetchDirectAreaList',       //获取直营区域列表
    fetchFranchiseAreaList: 'fetchFranchiseAreaList', //获取加盟区域列表
    fetchAreaDetail: 'fetchAreaDetail',               //获取区域详情
    fetchAreaDraftDetail: 'fetchAreaDraftDetail',     //获取区域草稿
    publishArea: 'publishArea',                       //发布区域
    createArea: 'createArea',                         //创建父级区域
    createSubArea: 'createSubArea',                   //创建子级区域
    updateArea: 'updateArea',                         //更新区域信息
    resetAreaDetail: 'resetAreaDetail',               //重置区域详情
    resetAreaDraftDetail: 'resetAreaDraftDetail',     //重置草稿数据
    resetFranchiseAreaList: 'resetFranchiseAreaList', //重置加盟列表数据
    resetDirectAreaList: 'resetDirectAreaList',       //重置直营列表数据
    resetUpdateAreaCallback: 'resetUpdateAreaCallback',   //重置保存成功后的回调
    resetCreateAreaCallback: 'resetCreateAreaCallback',   //重置创建区域后的回调
    resetPublishAreaCallback: 'resetPublishAreaCallback', //重置发布成功后的回调
  },
  // 区域区域模块
  AREA: {
    getAreaList: 'getAreaList', //获取商户列表
    find: 'area/querys', //查询区域
    getDetail: 'area/getDetail', //获取区域的详细信息
    creates: 'area/creates',//创建区域
    updates: 'area/updates',//区域的更新
  },
  // 产品服务模块
  SERVICE: {
    find: 'service/querys/special', //查询服务
    switchCase: 'service/set/status',//切换页面的状态
    creates: 'service/creates',//创建服务
    updates: 'service/updates',//更新服务的信息
    enable: 'service/version/enable',//启用服务成为可用的版本
    changeVisible: 'service/version/changeVisible',//改变模态框的状态
  },
  // 员工模块
  EMPLOYEE: {
    find: 'employee/querys', //查询员工列表
    getDetail: 'employee/getDetail',//获取员工的信息
    updateDetail: 'employee/queryItemSuccess',//更新员工的资料
    list: 'employee/querySuccess',//查询员工列表信息成功
    creates: 'employee/creates', //添加新员工
    updates: 'employee/updates',//更新员工信息
  },
  // 签约模块
  SIGN: {
    find: 'sign/querys', //查询签约列表
    getDetail: 'sign/getDetail',//获取签约的详情
    updates: 'sign/updates',//更新签约的信息
    search: 'sign/search',//签约列表条件的查询
  },
  // 骑士模块
  COURIER: {
    find: 'business_courier/querys', //骑士列表的查询
    getDetail: 'business_courier/getDetail',//获取骑士的详情
    updateDetail: 'business_courier/queryItemSuccess',//更新骑士的信息
    upload: 'business_courier/upload',
    uploadOK: 'business_courier/uploadSuccess',
    list: 'business_courier/querySuccess',//骑士查询成功
    creates: 'business_courier/creates',//创建新的骑士
    updates: 'business_courier/updates',//更新新的骑士
    approve_verify: 'business_courier/approve_verify',//骑士的审核
  },
  // 商家模块
  SELLER: {
    find: 'seller/querys', //商家搜索
    getDetail: 'seller/getDetail', //商家详情
    updateDetail: 'seller/queryItemSuccess',// 获取商户详情成功
    list: 'seller/querySuccess',//获取商家详情的成功
    approve_verify: 'seller/approve_verify',//商家的身份审核
    updates: 'seller/updates',//更新商家的信息
    getSellerShops: 'seller/getSellerShops',//获取商家的店铺信息
    getSellerShopSucess: 'seller/getSellerShopsSucess',//获取商家的店铺信息成功
  },
  RETAIL: {
    basicinfo: 'manageRetail/basicinfo',

  }
}
