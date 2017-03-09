
import React from 'react';
import { Row, Col, Input, Button, Form, Table, Radio, Breadcrumb, Alert, Icon, Popover } from 'antd';
import style from './style.less';

class OrderStatistics extends React.Component {
  constructor(props) {
    super();
    this.state = {
      totalOrderStatistics: props.totalOrderStatistics, //订单状态
    };
  }

  componentWillReceiveProps = (nextProps) => {
    //初始化新数据
    this.setState({
      totalOrderStatistics: nextProps.totalOrderStatistics,        //当前订单状态
    });
  };

  //状态数据面板
  renderOrderStatistics = () => {
    const { totalOrderStatistics } = this.state;

    //枚举方法－－－公共
    const orderState = {
      total: 8888,          //总订单
      undone: 25,           //未完成 ＊
      done: 100,            //已完成 ＊
      unDistribution: 10,   //待分配
      distribution: 50,     //分配中
      exception: -50,       //异常
      canceled: -100,       //已取消 ＊
      completeRate: 0.88,    //成功率

      //使用初始化
      description(rawValue) {
        switch (rawValue) {
          case this.total:
            return '总订单';
          case this.undone:
            return '未完成';
          case this.done:
            return '已完成';
          case this.unDistribution:
            return '待分配';
          case this.distribution:
            return '已分配';
          case this.exception:
            return '异常';
          case this.canceled:
            return '取消';
          case this.completeRate:
            return '成功率';
          default:
            return '其他';
        }
      },
    };

    //保存图片资源  －－－－  关联状态和相应状态下的总数
    const orderIcon = [
      { state: 8888, number: 0, title: orderState.description(orderState.total), src: './images/totalOrder@2x.png' },
      { state: 25, number: 0, title: orderState.description(orderState.undone), src: './images/undone@2x.png' },
      { state: 100, number: 0, title: orderState.description(orderState.done), src: './images/done@2x.png' },
      { state: 10, number: 0, title: orderState.description(orderState.unDistribution), src: './images/undistribution@2x.png' },
      { state: 50, number: 0, title: orderState.description(orderState.distribution), src: './images/distribution@2x.png' },
      { state: -50, number: 0, title: orderState.description(orderState.exception), src: './images/exception@2x.png' },
      { state: -100, number: 0, title: orderState.description(orderState.canceled), src: './images/canceled@2x.png' },
      { state: 0.88, number: 0, title: orderState.description(orderState.completeRate), src: './images/completeRate@2x.png' },
    ];

    //过滤订单数据－根据返回数据的state 和 headerIcon中的state相同，则修改该number
    if (totalOrderStatistics.length > 0) {
      let totalNumber = 0;
      for (let i = 0; i < totalOrderStatistics.length; i ++) {
        //统计总订单数
        totalNumber = totalNumber + totalOrderStatistics[i].count;
        for (let j = 1; j < orderIcon.length - 1; j++) {
          if (totalOrderStatistics[i].state === orderIcon[j].state) {
            //匹配state，并修改相应的number
            orderIcon[j].number = totalOrderStatistics[i].count;
          }
        }
      }
      //总订单数
      orderIcon[0].number = totalNumber;
      //成功率
      /*let b = (1 - (orderIcon[6].number / totalNumber + orderIcon[5].number / totalNumber)).toFixed(3);*/
      const b = (orderIcon[2].number / totalNumber).toFixed(3);
      orderIcon[7].number = b.slice(2, 4) + '.' + b.slice(4, 6) + '%';
    }

    return orderIcon.map((item) => {
      return (
        <Col sm={3} key={item.state}>
          <div>
            <div className={style.floatL}>
              <img src={item.src} alt={item.title} className={style.headerIcon} />
            </div>
            <div className={[style.floatL, style.marginR]}>
              <div className={style.font18}>{item.number}</div>
              <div>{item.title}</div>
            </div>
          </div>
        </Col>
      );
    })
  };

  render() {
    const {
      renderOrderStatistics,
    } = this;
    return (
      <Row className={`${style.component}`}>
        {/* 渲染状态数据面板 */}
        {renderOrderStatistics()}
      </Row>
    );
  }
}

module.exports = OrderStatistics;
