import React, {Component, PropTypes} from 'react';
import { Form, Input,message, Button, Checkbox,DatePicker, Icon, Select,Popover } from 'antd';
import { Link } from 'dva/router';
const MonthPicker = DatePicker.MonthPicker;
const [FormItem,Option] = [Form.Item,Select.Option];
const {stateTransform, utcToDate, numberDateToStr,dateFormat} =  window.tempAppTool;

const Search = Form.create()(({form, searchProps}) => {
// 从props里面获取信息
  const { getFieldProps, getFieldsValue } = form;
  const { monthOnSearch,sellers = []} = searchProps;
  let _time = null;
//提交函数
  function handleSubmit(e) {
    e.preventDefault();
    let _data = getFieldsValue();
    let newDate = '';
    if(!_data.month) {
      message.info('请选择月份');
      return ;
    };
    newDate = _data.month.replace('-','')
    // 参数获取
    let params = {};
    params.start_date = newDate;
    params.end_date = newDate;
    if(_data.seller_ids === undefined){
      _data.seller_ids = [];
    }
    params.seller_ids = _data.seller_ids;
    monthOnSearch(params)
  };
// 提示信息
  const content2 = (
    <div>
      <p> 1.当月账单数据统计截止到昨日 </p>
      <p> 2.成交订单量：为所有产生交易费用的订单之和</p>
      <p> 3.结算总额=为账户余额结算金额+现金结算金额</p>
      <p> 4.结算总额＝配送费＋手续费＋小费</p>
    </div>
  );
// 设置不可用的日期
  function disabledDate(current) {
    return  current.valueOf().time >= new Date().getMonth();
  };

  // 获取上个月的日期
  var last_month= new Date();
  last_month = last_month.getMonth() + 1
  last_month = (last_month < 10) ? `0${last_month}` : last_month;
  var month_date = dateFormat();
  month_date.length = 1;
  month_date = month_date + '-' +last_month;

// ant-design组件 展示商家列表
  const children = [];
  sellers.map((item,index) =>{
    children.push(<Option  key={item.seller_id} value={item.seller_id} >{item.seller ? item.seller.name : '' }</Option>);
  })

  return (
    <Form inline onSubmit={handleSubmit}>

      <FormItem label="日期" required={true}>
        <MonthPicker {...getFieldProps("month",{initialValue: month_date,getValueFromEvent:(date, dateString) => dateString})} {...{"style":{"width":120},"placeholder":"日期"}}/>
      </FormItem>

      <FormItem label="商家名称" >
        <Select tags
                showSearch optionFilterProp="children"
                {...getFieldProps("seller_ids")} {...{"style":{"width":300}}}
                placeholder="请选择商户"
        >
          {children}
        </Select>
      </FormItem>
      <FormItem >
        <Button type="primary" htmlType="submit">查询</Button>
      </FormItem>

      {/*<FormItem >*/}
        {/*<Button htmlType="submit">导出</Button>*/}
      {/*</FormItem>*/}

      <p style={{textAlign: 'right', position: 'relative', height: '0'}}>
        <span style={{ display:'inline-block',position: 'absolute', top: '-20px', right: '20px'}} >
          <Popover content={content2} placement="leftBottom" title="说明">
            <Icon type="question-circle-o" />
          </Popover>
        </span>
      </p>
    </Form>
  );
});

module.exports =  Search;
