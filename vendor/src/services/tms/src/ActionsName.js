module.exports =  {
  'CONTROL_PANEL': {
    areas: {
      get: 'areas/get', //获取区域区域
    },
    shipments:{
      query: 'tms/shipments/query', //调度中运单的查询
      stats: 'tms/shipments/statistics',  //运单的数据
      close: 'tms/shipments/one/close'  //关闭运单
    },
    couriers:{
      query: 'tms/couriers/query', //查询调度中骑士的信息
      reassign: 'couriers/reassign',//关于骑士的改派
    },
    modalVisible: 'reassign/modal/visible'//模态框的状态
  },
};
