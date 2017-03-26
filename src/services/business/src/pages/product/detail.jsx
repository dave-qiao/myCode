import React from 'react';
import { Form, Button, Row, Col, Table, Alert } from 'antd';
const { utcToDate } = window.tempAppTool;
const [FormItem] = [Form.Item];

const stateNames = {
  //定价类型
  plan_type: {
    21: '距离加时间阶梯价',
    22: '距离阶梯价',
    23: '时间阶梯价',
  },
  price_mode: { 2: '阶梯计价', 1: '一口价' },  //定价模式
  biz_mode: { 10: '本地生活圈' },             //业务模式
};

const View_detail = ({ detail_state_0, detail, curr_status, changeCurrStatus, didEnabled }) => {
  // 布局配置
  const Lay_6_16 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

  // 通知
  function topTip() {
    if (detail_state_0.no_result) {
      return '';
    }
    if (curr_status === 'detail') {
      return (<Row type="flex" justify="center"> <Col span={12}><Alert onClose={(e) => { changeCurrStatus('toEnable') }} message="您当前有新的产品服务未启用." closeText="点击查看" type="info" /></Col> </Row>);
    }
  }

  // 获取启用时间和生效时间扽函数
  function usedTime() {
    if (curr_status === 'detail') {
      const [actived_at_obj, used_at_obj] = [utcToDate(detail.actived_at), utcToDate(detail.used_at)];
      actived_at_obj.time.length = 2;
      used_at_obj.time.length = 2;
      const actived_time = `${actived_at_obj.date.join('-')}  ${actived_at_obj.time.join(':')}`;
      const used_time = `${used_at_obj.date.join('-')}  ${used_at_obj.time.join(':')}`;
      return ([
        <FormItem key="actived_time1" label="启用时间" {...Lay_6_16}> {actived_time} </FormItem>,
        <FormItem key="used_time1" label="生效时间" {...Lay_6_16}> {used_time} </FormItem>,
      ]);
    }
    return '';
  }

  // 根据条件获取对应的定价模式函数
  function show_price_mode() {
    const _result = [
      <FormItem key="price_mode1" label="定价模式" {...Lay_6_16}> {stateNames.price_mode[detail.price_mode]} </FormItem>,
    ];
    if (detail.price_mode === 2) {
      _result.push(
        <FormItem key="plan_type1" label="定价方案" {...Lay_6_16}> {stateNames.plan_type[detail.plan_type]} </FormItem>,
      )
    }
    return _result;
  }
// 定价方案的展示
  function showStandPricePlan() {
    // 获取到定价方案对象
    const { price_plan } = detail;
    // 获取基础定价
    const price = price_plan[0].base_price / 100;

    return ([
      <FormItem label="定价方案" {...Lay_6_16}>
        {price} 元／单
      </FormItem>,
      <FormItem label="说明" {...Lay_6_16}>
        一口价，一律按订单计价，所有订单配送费不分距离、时间如：设置费用5元/单，1单配送费为5元
      </FormItem>,
    ])
  }
  // 判断展示可能为多级的定价方案
  function showLevelPricePlan() {
    // 获取定价方案的对象
    const {price_plan} = detail;
    // 获取到一系列需要用到的数据
    let [distanceData, pirceData, rowNum, colNum, curr_time] = [[], [{}], 0, 0, price_plan[0].time_span[0]];
    //distanceData距离数据
    //pirceData 定价数据
    price_plan.forEach((item,index) => {
      //判断是否换行 是否换列
      if (curr_time !== item.time_span[0]) {
        curr_time = item.time_span[0];
        pirceData.push({});
        colNum = 0;
        rowNum++;
      } else if (index !== 0) {
        colNum++;
      }
      if (rowNum === 0) {
        //收集第一行的距离个数
        distanceData.push(1);
      }
      // 写入价格数据里面
      pirceData[rowNum][`plan${colNum}`] = item;
    });
    // 关于距离定价
    let columns = distanceData.map((item,index) => {
      let _result = {
        title: '距离分段',
        dataIndex: `plan${index}`,
        key: `name_${index}`,
      };
      // 如果只有一列
      if(index === 0) {
        _result.colSpan = distanceData.length;
        _result.render = (text, record, index2) => {
          const { max_distance, base_price } = text;
          if (index2 === 0) {
            return `小于${max_distance / 1000}km`;
          }
          return `${base_price / 100}元／${max_distance / 1000}km`;
        };
      } else {
        _result.colSpan = 0;
        _result.render = (text, record, index2) => {
          const { max_distance, min_distance, base_price, ext_price } = text;
          if (index2 === 0) {
            return `小于${max_distance / 1000}km`;
          }
          return `${base_price / 100}元／${min_distance / 1000}km + ${ext_price / 100}元／1km`;
        };
      }

      return _result;
    });
// table的配置 距离参照ant-design
    let tableProps = {
      pagination: false,//分页
      dataSource: [pirceData[0],...pirceData],//数据源
      columns: [//列
        {
          title: '时间分段',
          dataIndex: 'name',
          key: 'name',
          render: (text, record, index) => {
            if (index === 0) {
              return '--';
            } else {
              const { time_span } = record.plan0;
              return `${time_span[0]}--${time_span[1]}`;
            }
          },
        },
        ...columns,
      ],
    };
    return (<Table {...tableProps} />);
  }

  //显示定价方案
  function showPricePlan() {
    // const { showStandPricePlan, showLevelPricePlan } = this;
    const { price_mode } = detail;//获取定价模式

    //判断，如果是一口价，则显示一口价
    if (price_mode === 1) {
      return showStandPricePlan();
    }
    //如果是阶梯定价, 则显示阶梯定价
    return showLevelPricePlan();
  }
// 根据页面的不同显示的按钮也是不同
  function bottmBtns() {
    switch (curr_status) {
      case 'detail':
        return (<FormItem> <Button type="primary" onClick={(e) => { changeCurrStatus('edit') }}>编辑</Button> </FormItem>);
        break;
      case 'toEnable':
        return ([
          <FormItem key="btn1"> <Button onClick={(e) => { changeCurrStatus('detail') }}>返回</Button> </FormItem>,
          <FormItem key="btn2"> <Button type="primary" onClick={(e) => { didEnabled() }}>启用</Button> </FormItem>,
        ]);
        break;
    }
  }

  return (
    <Form horizontal className="main-form">
      <div className="bd-header">
        {topTip()}
        <Row><h3 className="form-divider-header" style={{ margin: '0px' }}>产品基本信息</h3></Row>
        <Row style={{ paddingTop: '20px' }}>
          <Col sm={12}>
            <FormItem label="产品名称" {...Lay_6_16}>
              {detail.name}
            </FormItem>
            <FormItem label="营业时间" {...Lay_6_16}>
              {detail.biz_time[0]}-{detail.biz_time[1]}
            </FormItem>
            <FormItem label="业务模式" {...Lay_6_16}>
              {stateNames.biz_mode[detail.biz_mode]}
            </FormItem>
          </Col>
          <Col sm={12}>
            <FormItem label="配送时间" {...Lay_6_16}>
              {detail.delivery_time}(分钟)
            </FormItem>
            {usedTime()}
          </Col>
        </Row>
      </div>

      <div className="bd-content">
        <Row><h3 className="form-divider-header" style={{ margin: '0px' }}> 产品定价 </h3></Row>
        <Row style={{ paddingTop: '20px' }}>
          <Col sm={12}>
            {/* <FormItem label="配送费分成方案" {...Lay_6_16}>
              {detail.shipping_fee_courier_rate}％(骑士提成百分比)
          </FormItem> */}
            {show_price_mode()}
          </Col>
          <Col sm={12}>
            {/* <FormItem label="小费分成方案" {...Lay_6_16}>
              {detail.tip_fee_courier_rate}％(骑士提成百分比)
          </FormItem> */}
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col sm={18}>{showPricePlan()}</Col>
        </Row>
        <Row type="flex" justify="center">
          {bottmBtns()}
        </Row>
      </div>
    </Form>

  );
};

module.exports = View_detail;
