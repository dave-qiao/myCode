module.exports = {
  downloadURI: function (uri, name) {
    //dynamic download file
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link = null;
  },
  numberDateToStr: (num) => {
    const _date = num + '';
    return `${_date.substr(0, 4)}-${_date.substr(4, 2)}-${_date.substr(6, 2)}`;
  },
  sqlit: (arr, type) => {
    var s = arr[0];
    for (var i = 1; i < arr.length; i++) {
      s = s + type + arr[i];
    }
    return s;
  },
  utcToDate: (dateStr) => {
    const _date = new Date(dateStr);
    const [_y,_m,_d,_h,_min,_sec] = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds()];
    return {
      date: [_y, checkIsBiger10(_m), checkIsBiger10(_d)],
      time: [checkIsBiger10(_h), checkIsBiger10(_min), checkIsBiger10(_sec)]
    };
  },
  getMonthDays: (month) => {
    const _demo = new Date();
    const [_y,_m,_d] = [_demo.getFullYear(), _demo.getMonth() + 1, _demo.getDate()];
    let _month = month ? month * 1 : _m;
    if ([1, 3, 5, 7, 8, 10, 12].indexOf(_month) !== -1) {
      return 31;
    }
    ;
    if ([4, 6, 9, 11].indexOf(_month) !== -1) {
      return 30;
    }
    const temp = new Date(`${_y}/3/0`);
    return temp.getDate();
  },
  dateFormat(stamp) {
    const _date = stamp ? new Date(stamp) : new Date();
    const [_y,_m,_d] = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate()];
    return [_y, _m >= 10 ? _m : ('0' + _m), _d >= 10 ? _d : ('0' + _d)];
  },
  // 将时间转换为 xx-xx-xx格式
  dateFormatNew(stamp) {
    const _date = stamp ? new Date(stamp) : new Date();
    const [_y,_m,_d] = [_date.getFullYear(), _date.getMonth() + 1, _date.getDate()];
    return [`${_y}-`, _m >= 10 ? `${_m}-` : `${('0' + _m)}-`, _d >= 10 ? _d : ('0' + _d)];
  },
  err_codeTransform(code){
    const codeDict = {
      "401001": "参数缺失或错误",
      "401002": "该名称已存在",
      "401003": "该账号已存在",
      "401004": "该电话号码已存在",
      "401005": "该工号已存在",
      "401006": "手机号没有找到",
      "401007": "商户订单编号已存在",
      "401008": "验证码错误",
      "402001": "服务商创建失败",
      "402002": "服务商更新错误",
      "402003": "服务商没有找到",
      "402004": "服务商被禁用",
      "402005": "服务商未审核通过",
      "402006": "不在配送时间内",
      "403001": "商户创建失败",
      "403002": "商户更新失败",
      "403003": "商户没有找到",
      "403004": "商户被禁用",
      "403006": "商户签约失败",
      "404001": "区域创建失败",
      "404002": "区域更新失败",
      "404003": "区域没有找到",
      "404004": "区域创建失败",
      "404005": "区域更新失败",
      "404006": "区域没有找到",
      "405001": "产品创建失败",
      "405002": "产品更新失败",
      "405003": "产品没有找到",
      "405004": "产品不可用",
      "405005": "产品启用失败",
      "405006": "产品状态错误",
      "405007": "产品已起用",
      "407001": "账号创建失败",
      "407002": "账号更新失败",
      "407003": "账号没有找到",
      "407004": "账号不可用",
      "408001": "登录失败",
      "408002": "注册失败",
      "409001": "骑士创建失败",
      "409002": "骑士更新失败",
      "409003": "骑士没有找到",
      "409004": "骑士状态错误",
      "409005": "骑士审核状态错误",
      "412001": "角色创建",
      "412002": "角色更新失败",
      "412003": "角色没有找到",
      "413001": "权限创建失败",
      "413002": "权限更新失败",
      "413003": "权限没有找到",
      "414001": "店铺创建失败",
      "414002": "店铺更新失败",
      "414003": "店铺没有找到",
      "415001": "无效token或token已过期",
      "416001": "发送验证码失败",
      "416002": "创建七牛Token失败",
      "417001": "审核失败",
      "417002": "提交审核失败",
      "417003": "审核记录没有找到",
      "418001": "没有权限",
      "403005": "商户未审核通过,或商户审核状态错误"
    };
    return codeDict[code] ? codeDict[code] : '错误';
  },
  stateTransform(field, state) {
    const state_dict = {
      sex: {
        '1': '男',
        '2': '女',
      },
      //签约类型
      contract_type: {
        '10': '直营',
        '20': '加盟',
      },
      //可用/不可用
      state: {
        '100': '可用',
        '-100': '不可用',
      },
      error_flags: {
        "1": "配送费计算错误",
        "2": "商家取消",
        "3": "货损",
        "4": "顾客失联",
        "5": "顾客拒签",
        "6": "商家出餐太慢",
        "7": "商家地址错误",
        "8": "商家其他原因",
        "20": "骑士车坏了",
        "21": "货损",
        "22": "骑士其他原因"
      },
      work_state: {
        '100': '在职',
        '-100': '离职',
      },
      sign_state: {
        '100': '签约',
        '-100': '解约',
      },
      duty_state: {
        '100': '在岗',
        '-100': '离岗',
      },
      work_type: {
        '10': '全职',
        '20': '兼职',
      },
      verify_state: {
        '0': '待提交',
        '1': '待审核',
        '100': '通过',
        '-100': '驳回',
      },
      seller_state: {
        '100': '正常',
        '-100': '冻结',
      },

      seller_type: {
        "1": "美食餐饮",
        "2": "生鲜蔬菜",
        "3": "超市商品",
        "4": "鲜花蛋糕",
        "5": "其他",
      },
      delivery_state: {
        '5': '已创建',
        '10': '待分配',
        '15': '已分配',
        '20': '已接单',
        '22': '已到店',
        '24': '已取货',
        '50': '配送中',
        '-50': '异常',
        '100': '已送达',
        '-100': '已取消',
      },
      area_state: {
        '100': '启用',
        '-100': '禁用',
      },
      pay_type: {
        '1': '现金支付',
        '2': '余额支付',
        '3': '后付费'
      },
      event_name: {
        'created': '已创建',
        'closed': '已关闭',
        'accepted': '已接单',
        'arrived': '已到店',
        'confirmed': '已确认',
        'pickup': '已取货',
        'reassigned': '已改派',
        'recover_state': '恢复状态',
        'done': '已完成',
        'error': '异常',
      },
      state_operation: {
        'created': '商家已下单，等待调度',
        'closed': '运单已关闭',
        'accepted': '骑士抢单',
        'arrived': '骑士确认到店',
        'confirmed': '服务商已确认，等待接单',
        'pickup': '骑士已取货',
        'reassigned': '运单已被改派',
        'recover_state': '状态已恢复',
        'done': '派单已完成',
        'error': '骑士标记异常',
      }
    };
    return state_dict[field] ? state_dict[field][state] : '';
  },
  utctoMinute: (timestamp) => {
    var year, month, day, hours, minnute;
    var timestamp = timestamp * 1000;
    var date = new Date(timestamp);
    year = date.getFullYear() + '/';
    month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    day = (date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ');
    hours = (date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':');
    minnute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    return (year + month + day + hours + minnute);
  }
};
function checkIsBiger10(num) {
  return num >= 10 ? num : ('0' + num);
}
