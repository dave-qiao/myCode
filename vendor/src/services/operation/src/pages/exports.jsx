//结算方式（订单支付方式）
const PayType = {
  cash: 1,          //现金
  balance: 2,       //余额
  afterPayment: 3,  //后付费

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.cash:
        return '现金';
      case this.balance:
        return '余额';
      case this.afterPayment:
        return '后付费';
      default:
        return '未知';
    }
  },
};

//订单状态（分单状态）
const OrderState = {
  created: 1,     //已创建
  confirmed: 25,  //已确认
  shipping: 50,   //配送中
  done: 100,      //已完成
  closed: -100,   //已关闭
  error: -50,     //异常

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.created:
        return '已创建';
      case this.confirmed:
        return '已确认';
      case this.shipping:
        return '配送中';
      case this.done:
        return '已完成';
      case this.closed:
        return '已关闭';
      case this.error:
        return '异常';
      default:
        return '未知';
    }
  },
}

module.exports.PayType = PayType;
module.exports.OrderState = OrderState;
