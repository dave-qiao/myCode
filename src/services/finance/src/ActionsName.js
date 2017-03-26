module.exports =  {
  'WALLET': {
    find: 'finance/seller_wallet/querys', //商户钱包列表查询
  },
  'COURIER_BILLS': {
    find: 'finance/courier_bills/querys', //骑士账单查询
  },
  'SELLER_BILLS':{
    find: 'finance/seller_bills/querys', //财务模块的商家账单列表
    list: 'finance/seller_bills/querysSucess'//商家账单查询成功
  },
  'SELLER_BILLS_MONTH': {
    find: 'finance/seller_bills_month/querys', //获取月账单列表
    list: 'finance/seller_bills_month/querysSucess'//商家的月账单查询成功
  }
}
