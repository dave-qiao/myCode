import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Icon, Select, Popover, message, Tabs } from 'antd';
import { Link } from 'dva/router';
const RangePicker = DatePicker.RangePicker;
const { stateTransform, utcToDate, dateFormat, numberDateToStr } =  window.tempAppTool;
const [FormItem,Option,TabPane] = [Form.Item, Select.Option, Tabs.TabPane];

const Search = Form.create()(({ form, searchProps }) => {

  const { getFieldProps, getFieldsValue } = form;

  const { areas = { data: [] }, onSearch, dispatch, vendorList } = searchProps;
  let _time = null;

  function handleSubmit(e) {
    e.preventDefault();
    let _data = getFieldsValue();
    let date = '';
    // 获取到的日期
    let data_time = '';
    // 获取到的时间
    let date_date = '';
    if (!_data.time) {
      message.info('请选择日期');
      return;
    }
    ;
    if (_data.time) {
      date = utcToDate(_data.time);
      date_date = date.date.join('');
    }
    let params = {};
    params.start_date = date_date;
    params.end_date = date_date;
    if (_data.area_ids === undefined) {
      _data.area_ids = [];
    }
    params.area_ids = _data.area_ids;
    onSearch(params);
  };

  function disabledDate(current) {
    return current.valueOf().time >= Date.now() - 24 * 60 * 60 * 1000;
  };

  const content1 = (
    <div>
      <p> 1.超时取消订单：</p>
      <p> 1.1超时没有骑士接单系统关闭的订单</p>
      <p> 1.2骑士接单后当天没有处理完的订单</p>
      <p> 2.异常取消订单：</p>
      <p> 2.1骑士标记异常后被取消的订单</p>
    </div>
  );

  let _date = dateFormat(Date.now() - 24 * 60 * 60 * 1000);
  const children = [];
  const vendor = [];

  // 区域子选项
  areas.data.map((item, index) => {
    children.push(<Option key={'area' + item.id}
                          value={item.id}>{`${item.name}${item.vendor ? `(${item.vendor.name})` : ''}`}</Option>);
  });

  // 加盟商子选项
  vendorList.data.map((item, index) => {
    vendor.push(<Option key={item.id}
                        value={item.id}>{item.name}</Option>)
  });

  //tabs切换 缓存活动的tabs
  let activeKey = {
    key: 10,      // 10为直营  20为加盟
  };

  //tabs切换 回调函数
  function retailArea(key) {
    const is_filter_sub_area = true;
    const limit = 500;
    let relate_type;
    const { vendor_id } = JSON.parse(window.getStorageItem('accountInfo') || '{}');
    const { city_code } = JSON.parse(window.getStorageItem('userInfo') || '{}');
    switch (key) {
      case '10':
        activeKey.key = 10;
        relate_type = 10;
        dispatch({
          type: 'generalAreasListE',
          payload: { vendor_id, is_filter_sub_area, relate_type, city_code, limit },
        });
        break;
      case '20':
        activeKey.key = 20;
        relate_type = 20;
        const supply_vendor_id = vendor_id;
        dispatch({
          type: 'generalAreasListE',
          payload: { supply_vendor_id, is_filter_sub_area, relate_type, city_code, limit },
        });

        dispatch({
          type: 'getCityVendorListE',
          payload: { supply_vendor_id, city_code },
        });
        break;
    }

  }

  return (
    <Form inline onSubmit={handleSubmit}>
      <Tabs onTabClick={retailArea}>
        <TabPane tab="直营区域" key="10">

          <FormItem label="日期">
            <DatePicker {...getFieldProps("time", { initialValue: _date.join('-') }) } disabledDate={disabledDate}/>
          </FormItem>

          <FormItem label="区域名称">
            <Select tags
                    showSearch optionFilterProp="children"
                    {...getFieldProps("area_ids")} {...{ "style": { "width": 300 } }}
                    placeholder="请选择区域"
            >
              {children}
            </Select>

          </FormItem>

          <FormItem >
            <Button type="primary" htmlType="submit">查询</Button>
          </FormItem>
          <p style={{ textAlign: 'right', position: 'relative', height: '0' }}>
        <span style={{ display: 'inline-block', position: 'absolute', top: '-20px', right: '20px' }}>
          <Popover content={content1} placement="leftBottom" title="说明">
            <Icon type="question-circle-o"/>
          </Popover>
        </span>
          </p>
        </TabPane>
        {/*<TabPane tab="加盟区域" disabled key="20">
          <FormItem label="日期">
            <DatePicker {...getFieldProps("time", { initialValue: _date.join('-') }) } disabledDate={disabledDate}/>
          </FormItem>

          <FormItem label="加盟商名称">
            <Select tags
                    showSearch optionFilterProp="children"
                    {...getFieldProps("supply_vendor_id")} {...{ "style": { "width": 300 } }}
                    placeholder="请选择加盟商"
            >
              {vendor}
            </Select>

          </FormItem>

          <FormItem label="区域名称">
            <Select tags
                    showSearch optionFilterProp="children"
                    {...getFieldProps("Join_area_ids")} {...{ "style": { "width": 300 } }}
                    placeholder="请选择区域"
            >
              {children}
            </Select>

          </FormItem>

          <FormItem >
            <Button type="primary" htmlType="submit">查询</Button>
          </FormItem>
          <p style={{ textAlign: 'right', position: 'relative', height: '0' }}>
        <span style={{ display: 'inline-block', position: 'absolute', top: '-20px', right: '20px' }}>
          <Popover content={content1} placement="leftBottom" title="说明">
            <Icon type="question-circle-o"/>
          </Popover>
        </span>
          </p>
        </TabPane>*/}
      </Tabs>
    </Form>
  );
});

module.exports = Search;
