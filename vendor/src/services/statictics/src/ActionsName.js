module.exports =  {
  'SELLER': {
    find:'shipments_seller/querys'    //查询商家
  },
  'AREA': {
    find:'shipments_area/querys',//区域查询
  },
  'CORUIER': {
    find:'shipments_courier/querys',  //骑士查询
  },
  'DETAIL':{
    queryList:"shipments_detail_down/querys",//运单详情下载的查询
    find: 'shipments_detail/querys',//运单详情查询
    downUrl:'shipments_detail/down',  //下载的url

  },
  'COMPASS':{//数据罗盘
    find:'compass/query',
  },
  'MONITO':{  //实时监控
    find:'monito/querys',
  }

}
