import React, {Component, PropTypes} from 'react';
import { Form, Input,Button, Checkbox, Icon, Select, DatePicker, Popover } from 'antd';
import { Link } from 'dva/router';
const {dateFormat} = window.tempAppTool;
const {stateTransform, utcToDate, numberDateToStr} =  window.tempAppTool;

const [FormItem,Option, RangePicker] = [Form.Item,Select.Option , DatePicker.RangePicker];

const Search = Form.create()((props) => {

  const { getFieldProps, getFieldsValue } = props.form;
  const {onSearch,areas,sellers,couriers} = props;

  function handleSubmit(e) {
    e.preventDefault();
    let _data = getFieldsValue();
    let date = '';
    let data_time = '';
    let date_date = '';
    if(!_data.time) {
      message.info('请选择日期');
      return;
    };
    if(_data.time){
      date = utcToDate(_data.time);
      date_date = date.date.join('');
    }
    let params = {};
    params.start_date = date_date;
    params.end_date = date_date;
    onSearch(params)
  };

  const content2 = (
    <div>
      <p> 1.订单按预计送达时间导出 </p>
      <p> 2.每日上午可以下载昨日的订单明细 </p>
    </div>
  );

  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  function disabledDate(current) {
    return  current.valueOf().time >= Date.now() - 24*60*60*1000;
  };
  let _date = dateFormat(Date.now() - 24*60*60*1000);
  return (
    <Form inline onSubmit={handleSubmit}>

      <FormItem label="日期" style={{marginTop:'10px'}}>
        <DatePicker {...getFieldProps("time",{initialValue:  _date.join('-')}) } disabledDate={disabledDate}/>
        <Button type="primary" htmlType="submit" style={{ marginRight: 20, marginLeft: 20 }}>查询</Button>

      </FormItem>

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
