import dva, { connect } from 'dva';
import 'antd/dist/antd.min.css';
import './index.html';

//全局信息
window.appGlobalInfos = {
  province: require('./assets/citys/province.json'),
  city: require('./assets/citys/city.json'),
};

//根据命名控件获取对象
window.getStorageWithNameSpace = () => {
  const namespace = 'aoaoAppsVender';
  const item = window.localStorage.getItem(namespace);
  return (item != null && item !== '') ? JSON.parse(item) : {};
}

//设置localstorage对象
window.setStorageItem = (key, value) => {
  const namespace = 'aoaoAppsVender';
  const namespaceItem = window.getStorageWithNameSpace();
  namespaceItem[key] = value;
  window.localStorage.setItem(namespace, JSON.stringify(namespaceItem))
}

//获取localstorage对象
window.getStorageItem = (key) => {
  const namespaceItem = window.getStorageWithNameSpace();
  return namespaceItem[key];
}

//模块
const allModels = [
  require('./services/account/src/models'),
  require('./services/business/src/models'),
  require('./services/finance/src/models'),
  require('./services/statictics/src/models'),
  require('./services/team/src/models'),
  require('./services/tms/src/models'),
  require('./services/operation/src/models'),
  require('./models'),
];

// 1. Initialize
const app = dva();

// 2. Model
allModels.forEach((models) => {
  models.forEach((theModel) => {
    app.model(theModel);
  });
});

// 3. Routers
app.router(require('./router'));

// 4. Start
app.start(document.getElementById('root'));
