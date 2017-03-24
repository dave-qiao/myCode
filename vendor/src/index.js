import dva, { connect } from 'dva';
import { notification } from 'antd';
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

//加载状态
const LoadingState = {
  none: 0,      //无状态
  loading: 1,   //加载中
  finish: 2,    //已完成
  error: 3,     //出错
}

//通知中心
let notificationQueue = [];
const loadingNotification = () => {
  let loadingCount = 0; //加载中的请求数量
  let finishCount = 0;  //已完成的请求数量
  let errorCount = 0;   //错误的请求数量
  notificationQueue.forEach((loadingTask) => {
    switch (loadingTask.state) {
      case LoadingState.loading: loadingCount += 1; break;
      case LoadingState.error: errorCount += 1; break;
      case LoadingState.finish: finishCount += 1; break;
      default: break;
    }
  })

  //显示信息
  notification.close('aoaoAppsVenderLoading');
  notification.open({
    key: 'aoaoAppsVenderLoading',
    message: '数据加载中...',
    description: `加载中 ${loadingCount} / 已完成 ${finishCount} / 错误 ${errorCount}`,
    duration: null,
  });

  if (notificationQueue.length === finishCount) {
    notification.close('aoaoAppsVenderLoading');
    // notification.success({ message: '数据加载完成', duration: 4.0 });
    notificationQueue = [];
  } else if (notificationQueue.length !== 0 && loadingCount === 0) {
    notification.error({ message: '数据加载失败，请重新加载尝试', duration: null });
    notificationQueue = [];
  }
};

//开始加载
window.startLoading = (key) => {
  //记录加载的请求
  notificationQueue.push({ key, state: LoadingState.loading });
  loadingNotification()
};

//结束加载
window.finishLoading = (key) => {
  notificationQueue.map((loadingTask) => {
    const task = loadingTask
    if (task.key === key) {
      task.state = LoadingState.finish;
    }
    return loadingTask;
  })

  loadingNotification()
}

//加载失败
window.errorLoading = (key) => {
  notificationQueue.map((loadingTask) => {
    const task = loadingTask
    if (task.key === key) {
      task.state = LoadingState.error;
    }
    return loadingTask;
  })

  loadingNotification()
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
