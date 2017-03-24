import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Table, Alert } from 'antd';
import { prctoMinute } from '../../../../../../utils/newUtils';
const [FormItem] = [Form.Item];
const { stateTransform, numberDateToStr, utcToDate } = window.tempAppTool;

const stateNames = {
  // 定价类型
  plan_type: {
    21: '距离加时间阶梯价',
    22: '距离阶梯价',
    23: '时间阶梯价',
  },
  //定价模式
  price_mode: { 2: '阶梯计价', 1: '一口价' },
  // 业务模式
  biz_mode: { 10: '本地生活圈即时送' },
};


const View_detail = ({ business_sign }) => {
  // 从model获取details信息
  const { list_details } = business_sign;
  // 布局配置参数
  const Lay_6_16 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
// 显示定价模式的函数
  function show_price_mode() {
    const _result = [
      <FormItem key="price_mode1"
                label="定价模式" {...Lay_6_16}> {stateNames.price_mode[list_details.price_mode]} </FormItem>,
    ];
    if (list_details.price_mode === 2) {
      _result.push(
        <FormItem key="plan_type1"
                  label="定价方案" {...Lay_6_16}> {stateNames.plan_type[list_details.plan_type]} </FormItem>,
      )
    }
    return _result;
  }

  let biz_time1 = '';
  let biz_time2 = '';
  let service_name = '默认产品名称';
  let sign_time = '';//签约时间
  let updated_at = '';//更新时间
  let unsigned_at = list_details.unsigned_at ? prctoMinute(list_details.unsigned_at, 2) : '--';
  let contractId = list_details.id ? list_details.id : '--';

  if (list_details.biz_time) {
    biz_time1 = list_details.biz_time[0],
      biz_time2 = list_details.biz_time[1]
  }

  sign_time = utcToDate(list_details.created_at);
  sign_time.time.length = 2;
  sign_time = `${sign_time.date.join('-')} ${sign_time.time.join(':')}`;

  updated_at = utcToDate(list_details.updated_at);
  updated_at.time.length = 2;
  updated_at = `${updated_at.date.join('-')} ${updated_at.time.join(':')}`;

  //获取服务
  if (list_details.service) {
    service_name = list_details.service.name
  }
  // 定价方案的展示
  function showStandPricePlan() {
    // 获取到定价方案对象
    const { price_plan } = list_details;
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
    const { price_plan } = list_details;
    // 获取到一系列需要用到的数据
    let [distanceData, pirceData, rowNum, colNum, curr_time] = [[], [{}], 0, 0, price_plan[0].time_span[0]];
    //distanceData距离数据
    //pirceData 定价数据
    price_plan.forEach((item, index) => {
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
    let columns = distanceData.map((item, index) => {
      let _result = {
        title: '距离分段',
        dataIndex: `plan${index}`,
        key: `name_${index}`,
      };
      // 如果只有一列
      if (index === 0) {
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
      dataSource: [pirceData[0], ...pirceData],//数据源
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
    const { price_mode } = list_details;//获取定价模式

    //判断，如果是一口价，则显示一口价
    if (price_mode === 1) {
      return showStandPricePlan();
    }
    //如果是阶梯定价, 则显示阶梯定价
    return showLevelPricePlan();
  }

  // 跳转到签约列表的函数
  function toList() {
    window.location.href = '/#/business/sign/list';
  }

  return (
    <div className="con-body">
      <div className="bd-header">
        <Form horizontal className="main-form">

          <h3 className="form-divider-header" style={{ margin: '0px' }}>产品基本信息</h3>
          <Row >
            <Col sm={12}>
              <FormItem label="签约ID" {...Lay_6_16}>
                {contractId}
              </FormItem>
              <FormItem label="业务模式" {...Lay_6_16}>
                {stateNames.biz_mode[list_details.biz_mode]}
              </FormItem>
              <FormItem label="营业时间" {...Lay_6_16}>
                {biz_time1}-{biz_time2}
              </FormItem>
              <FormItem key="actived_time2" label="最新修改时间" {...Lay_6_16}>
                {updated_at}
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="产品名称" {...Lay_6_16}>
                {service_name}
              </FormItem>
              <FormItem label="配送时间" {...Lay_6_16}>
                {list_details.delivery_time}(分钟)
              </FormItem>
              <FormItem key="actived_time1" label="签约时间" {...Lay_6_16}>
                {sign_time}
              </FormItem>
              <FormItem key="unsigned_at" label="解约时间" {...Lay_6_16}>
                {list_details.state?(list_details.state==-100?unsigned_at:'--'):'--'}
              </FormItem>
            </Col>
          </Row>
          <h3 className="form-divider-header" style={{ margin: '0px' }}> 产品定价 </h3>
          <Row>
            <Col sm={12}>
              {/* <FormItem label="配送费分成方案" {...Lay_6_16}>
               {list_details.shipping_fee_courier_rate}％(骑士提成百分比)
               </FormItem> */}
              {show_price_mode()}
            </Col>
            <Col sm={12}>
              {/* <FormItem label="小费分成方案" {...Lay_6_16}>
               {list_details.tip_fee_courier_rate}％(骑士提成百分比)
               </FormItem> */}
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col sm={18}>{showPricePlan()}</Col>
          </Row>
          <Row type="flex" justify="center">
            <FormItem key="btn1"> <Button onClick={(e) => {
              toList()
            }}>返回</Button> </FormItem>
          </Row>
        </Form>
      </div>
    </div>
  );
};

const MainForm = Form.create()(View_detail);

function mapStateToProps({ business_sign, business_public }) {
  return { business_sign, business_public };
}

module.exports = connect(mapStateToProps)(MainForm);
