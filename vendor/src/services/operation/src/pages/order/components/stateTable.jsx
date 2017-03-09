
import React from 'react';
import { Link } from 'dva/router';
import { Table, Badge } from 'antd';

import style from './style.less';

const orderWord = {
  total: 8888,          //总订单
  undone: 25,           //未完成 ＊
  done: 100,            //已完成 ＊
  unDistribution: 10,   //待分配 ＊
  distribution: 50,     //分配中 ＊
  exception: -50,       //异常   ＊
  canceled: -100,       //已取消 ＊
  completeRate: 0.88,    //成功率

  //使用初始化
  description(rawValue) {
    switch (rawValue) {
      case this.total:
        return 'total';  //草稿状态，默认前端展示为禁用
      case this.undone:
        return 'undone';
      case this.done:
        return 'done';
      case this.unDistribution:
        return 'unDistribution';
      case this.distribution:
        return 'distribution';
      case this.exception:
        return 'exception';
      case this.canceled:
        return 'canceled';
      case this.completeRate:
        return 'completeRate';
      default:
        return 'other';
    }
  },
};
//优化代码－－－
function getSource(styleName, key, name) {
  return {
    title: <span><Badge className={style.minCircle_1} />name</span>,
    dataIndex: 'states',
    key: 'key',
    render: (states, row, index) => { return states[orderWord.key] || 0 },
  }
};

const columns = [{
  title: '项目',
  dataIndex: 'seller_name',
  key: 'sellerName',
  render: (text, record) => (
    <span>
      <Link to={`/operation/order/seller/?sellerId=${record.seller_id}`}>{ record.seller_name }</Link>
    </span>
  ),
}, {
  title: '总订单',
  dataIndex: 'order_count',
  key: 'total',
}, {
  //getSource(style.minCircle_1, unDistribution, 待分配);
  title: <span><Badge className={style.minCircle_1} />待分配</span>,
  dataIndex: 'states',
  key: 'unDistribution',
  render: (states, row, index) => { return states[orderWord.unDistribution] || 0 },
}, {
  title: <span><Badge className={style.minCircle_2} />已确认</span>,
  dataIndex: 'states',
  key: 'confirmed',
  render: (states, row, index) => { return states[orderWord.confirmed] || 0 },
}, {
  title: <span><Badge className={style.minCircle_3} />异常</span>,
  dataIndex: 'states',
  key: 'exception',
  render: (states, row, index) => { return states[orderWord.exception] || 0 },
}, {
  title: <span><Badge className={style.minCircle_4} />配送中</span>,
  dataIndex: 'states',
  key: 'shipping',
  render: (states, row, index) => { return states[orderWord.shipping] || 0 },
}, {
  title: <span><Badge className={style.minCircle_5} />未完成</span>,
  dataIndex: 'states',
  key: 'undone',
  render: (states, row, index) => { return states[orderWord.undone] || 0 },
}, {
  title: <span><Badge className={style.minCircle_6} />已送达</span>,
  dataIndex: 'states',
  key: 'done',
  render: (states, row, index) => { return states[orderWord.done] || 0 },
}, {
  title: <span><Badge className={style.minCircle_7} />已取消</span>,
  dataIndex: 'states',
  key: 'canceled',
  render: (states, row, index) => { return states[orderWord.canceled] || 0 },
}, {
  title: '完成率',
  dataIndex: 'states',
  key: 'completeRate',
  render: (text, record, index) => {
    //TODO:
    const totalNum = record.order_count;
    const rate = totalNum != 0 ? text[orderWord.done] / totalNum : 0;
    let completeRate = rate * 100;
    completeRate = completeRate.toFixed(2).toString();
    /*completeRate = completeRate && (completeRate.slice(2, 4) + '.' + completeRate.slice(4, 6));*/
    return (completeRate && (completeRate + '%')) || (0 + '%');
  },
}, {
  title: '操作',
  key: 'operation',
  render: (text, record) => (
    <span>
      <a href="/#/operation/order/close">分单规则调整</a>
    </span>
  ),
}];

class StateTable extends React.Component {
  constructor(props) {
    super();

    //初始化商家列表
    this.state = {
      sellerOrderList: props.sellerOrderList,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    //update 商家列表
    this.setState({
      sellerOrderList: nextProps.sellerOrderList,
    });
  };

  render() {
    const { sellerOrderList } = this.state;

    return (
      <Table dataSource={sellerOrderList} columns={columns} />
    );
  }
}
module.exports = StateTable;
