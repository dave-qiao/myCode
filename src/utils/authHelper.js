module.exports = {
  //判断是否登录
  isLogin() {
    const [accountStr, userStr, vendorStr] = [
      window.getStorageItem('accountInfo'),
      window.getStorageItem('userInfo'),
      window.getStorageItem('vendorInfo'),
    ];
    if (accountStr && userStr && vendorStr) {
      return true;
    }
    return false;
  },

  //加载账户信息
  loadAccountInfo(pathname) {
    //将账号和用户信息存到全局，方便直接取，在这执行的话，每次都会更新（有个过期问题）

    if (this.isLogin() === false) {
      console.log('用户未登录');
      return;
    }

    //获取信息
    const [account, user, vendor] = [
      JSON.parse(window.getStorageItem('accountInfo')),
      JSON.parse(window.getStorageItem('userInfo')),
      JSON.parse(window.getStorageItem('vendorInfo')),
    ];

    //获取城市信息
    const cityName = this.getCityNameByCode(vendor.cityCode);

    //设置window
    window.currentAppAccountInfo = account;
    window.currentAppUserInfo = { ...user, cityName };
    window.currentAppVendorInfo = { ...vendor, cityName };
    window.currentAppPathname = pathname;
  },

  //根据城市code获取城市名称
  getCityNameByCode(cityCode) {
    let cityName = '';
    const citesDict = window.appGlobalInfos.city;
    try {
      cityName = citesDict.data[citesDict.index.indexOf(cityCode)].name;
    } catch (e) {
      cityName = '';
      const _len = citesDict.data;
      for (let i = 0; i < _len; i += 1) {
        if (citesDict.data[i]._id === cityCode) {
          cityName = citesDict.data[i].name;
        }
      }
    } finally {
      if (cityName.length === 0) {
        /*console.error('该城市无法找到，默认北京市');*/
        cityName = '北京市';
      }
    }
    return cityName;
  },
}
